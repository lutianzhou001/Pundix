import * as fs from 'fs-extra';
const hre = require('hardhat');

async function main() {
  const Signers = await hre.ethers.getSigners();
  fs.writeFileSync('./.env', '\n');

  const _NFT = await hre.ethers.getContractFactory('NFT');
  const NFT = await _NFT.connect(Signers[0]).deploy("Vincent.R.Jaipul", "VRJ");
  console.log('successfully deployed NFT: ' + NFT.address);
  fs.appendFileSync(
      './.env',
      'NFTAddress =' + '"' + NFT.address + '"' + '\n',
  );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
