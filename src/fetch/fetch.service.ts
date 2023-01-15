import { LoggerService, Injectable } from '@nestjs/common';
import { Contract, ethers, BigNumber } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { pundixABI } from '../abis/Pundix.abi';
import { ERC20ABI } from '../abis/ERC20.abi';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenList } from './schema/database.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from 'ethers/lib.esm/utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires

export type TokenListExtended = {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    lockedInBridge: string;
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

    async getTokens(): Promise<TokenListExtended[]> {
        const instance = await this.getInstanceBridge();
        const tokenList = await instance.getBridgeTokenList();
        console.log(tokenList);
        const res: TokenListExtended[] = [];
        for (let i = 0; i < tokenList.length; i++) {
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
            };
            res.push(tl);
        }
        // record to the database;
        const tokenListExisted = await this.tokenListModel.findOne({
            tokenListData: res,
            timeStamp: new Date().getTime(),
        });
        if (tokenListExisted) {
            throw new Error('SIGNATURE_EXISTED');
        } else {
            await new this.tokenListModel({
                tokenListData: res,
                timeStamp: new Date().getTime(),
            }).save();
        }
        return res;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async fetchTokenListCronJob() {
        console.log('fetchTokenListCronJob');
        await this.getTokens();
    }
}
