import * as readline from 'readline';
import hre, { ethers } from 'hardhat';
import inquirer from 'inquirer';
import * as dotenv from 'dotenv';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string) {
    return new Promise((resolve) =>
        rl.question(query, (answ) => resolve(answ)),
    );
}

function operation(query: string) {
    return new Promise((resolve) =>
        rl.question(query, (answ) => resolve(answ)),
    );
}

function send(method: string, params?: Array<any>) {
    return hre.ethers.provider.send(method, params === undefined ? [] : params);
}

function mineBlock() {
    return send('evm_mine', []);
}

async function fastForward(seconds: number) {
    const method = 'evm_increaseTime';
    const params = [seconds];
    await send(method, params);
    await mineBlock();
}

async function currentTime() {
    const { timestamp } = await ethers.provider.getBlock('latest');
    return timestamp;
}

async function main() {
    dotenv.config();
    const signers = await hre.ethers.getSigners();
    const _nft = await hre.ethers.getContractFactory('NFT');
    const nft = await _nft.attach(
        String(process.env.NFTAddress),
    );

    let currentSigner = await signers[0];

    const prompt = inquirer.createPromptModule();
    const choices = [
        'Mint a NFT',
        'Burn a NFT',
        'Query My NFT',
        'Pause',
        'Unpause',
        'Choose Signer',
        'Approve',
        'Exit',
    ];

    while (true) {
        const answers = await prompt({
            type: 'list',
            name: 'operation',
            message: 'What do you want to do?',
            choices,
        });

        switch (answers.operation) {
            case 'Pause': {
                await nft.pause();
                break;
            }
            case 'Unpause': {
                await nft.unpause();
                break;
            }
            case 'Mint a NFT': {
                await nft
                    .connect(currentSigner)
                    .mint(await currentSigner.getAddress());
                break;
            }
            case 'Burn a NFT':
                const toBurn = await prompt({
                    type: 'input',
                    name: 'NFTId',
                    message: 'Which nft you want to burn:)',
                });
                await nft.connect(currentSigner).burn(await currentSigner.getAddress(),toBurn.NFTId);
                break;
            case 'Choose Signer':
                const signers = await hre.ethers.getSigners();
                const addresses = [];
                for (let i = 0; i < signers.length; i++) {
                    addresses.push(await signers[i].getAddress());
                }
                const chooseAddress = await prompt({
                    type: 'list',
                    name: 'address',
                    message: 'Which signer do you want to choose:)',
                    choices: addresses,
                });
                for (let i = 0; i < signers.length; i++) {
                    if (
                        chooseAddress.address ===
                        (await signers[i].getAddress())
                    ) {
                        currentSigner = signers[i];
                    }
                }
                break;
            case 'Approve':
                const toApprove = await prompt({
                    type: 'input',
                    name: 'NFTId',
                    message: 'Which nft you want to approve:)',
                });
                await nft.connect(currentSigner).approve(nft.address, toApprove.NFTId);
                break;
            case 'Exit':
                process.exit(0);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
