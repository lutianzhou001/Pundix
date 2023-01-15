import * as fs from 'fs-extra';
const hre = require('hardhat');

async function main() {
  const Signers = await hre.ethers.getSigners();
  fs.writeFileSync('./.env', '\n');
  fs.writeFileSync('./verify.sh', "\n");

  const _NFT = await hre.ethers.getContractFactory('NFT');
  const NFT = await _NFT.connect(Signers[0]).deploy("Vincent.R.Jaipul", "VRJ");
  console.log('successfully deployed NFT: ' + NFT.address);
  fs.appendFileSync(
      './.env',
      'NFTAddress =' + '"' + NFT.address + '"' + '\n',
  );
  fs.appendFileSync('./verify.sh', "echo \"verifying NFT\"" + "\n" + "npx hardhat verify " + NFT.address + " Vincent.R.Jaipul VRJ --network mumbai" + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
