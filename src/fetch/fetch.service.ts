import { LoggerService, Injectable } from '@nestjs/common';
import { Contract, ethers, BigNumber } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { pundixABI } from '../abis/Pundix.abi';
import { ERC20ABI } from '../abis/ERC20.abi';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenList } from './schema/database.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { timeInterval, timestamp } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// eslint-disable-next-line @typescript-eslint/no-var-requires

export type TokenListExtended = {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    lockedInBridge: string;
    timeStamp: number;
    blockNumber: number;
};

@Injectable()
export class FetchService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(
        private readonly configService: ConfigService,
        @InjectModel('TokenList')
        private readonly tokenListModel: Model<TokenList>,
    ) {}

    async getProvider(): Promise<ethers.providers.JsonRpcProvider> {
        return new ethers.providers.JsonRpcProvider(
            String(this.configService.get('ProviderUrl')),
            {
                name: String(this.configService.get('ProviderName')),
                chainId: Number(this.configService.get('ProviderChainId')),
            },
        );
    }
    async getInstanceBridge(): Promise<Contract> {
        const provider = await this.getProvider();
        return new ethers.Contract(
            String(this.configService.get('ContractAddress')),
            pundixABI,
            provider,
        );
    }

    async getInstanceERC20(contractAddress: string): Promise<Contract> {
        const provider = await this.getProvider();
        return new ethers.Contract(contractAddress, ERC20ABI, provider);
    }

    async writeToCSV(data) {
        const csvWriter = createCsvWriter({
            path: 'fx-bridge-token-supply.csv',
            header: [
                { id: 'address', title: 'Address' },
                { id: 'name', title: 'Name' },
                { id: 'symbol', title: 'Symbol' },
                { id: 'decimals', title: 'Decimals' },
                { id: 'lockedInBridge', title: 'LockedInBridge' },
                { id: 'timeStamp', title: 'TimeStamp' },
                { id: 'blockNumber', title: 'BlockNumber' },
            ],
        });
        await csvWriter.writeRecords(data);
    }

    async getTokens(): Promise<TokenListExtended[]> {
        const instance = await this.getInstanceBridge();
        const tokenList = await instance.getBridgeTokenList();
        const res: TokenListExtended[] = [];
        for (let i = 0; i < tokenList.length; i++) {
            const timeStamp = new Date().getTime();
            const provider = await this.getProvider();
            const blockNumber = await provider.getBlockNumber()
            const instanceERC20 = await this.getInstanceERC20(tokenList[i][0]);
            const tl: TokenListExtended = {
                address: tokenList[i][0],
                name: tokenList[i][1],
                symbol: tokenList[i][2],
                decimals: tokenList[i][3],
                lockedInBridge: String(
                    BigNumber.from(
                        await instanceERC20.balanceOf(
                            String(this.configService.get('ContractAddress')),
                        ),
                    ),
                ),
                timeStamp: timeStamp,
                blockNumber: blockNumber,
            };
            res.push(tl);
        }
        // record to the database;
        const tokenListExisted = await this.tokenListModel.findOne({
            tokenListData: res,
            timeStamp: new Date().getTime(),
        });
        if (tokenListExisted) {
            throw new Error('TOKEN_LIST_EXISTED');
        } else {
            await new this.tokenListModel({
                tokenListData: res,
                timeStamp: new Date().getTime(),
            }).save();
        }
        console.log(res);
        // write the data to a csv file;
        await this.writeToCSV(res);
        return res;
    }

    // @Cron(CronExpression.EVERY_5_SECONDS)
    async fetchTokenListCronJob() {
        console.log('fetchTokenListCronJob');
        await this.getTokens();
    }
}
