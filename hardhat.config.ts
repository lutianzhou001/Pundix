import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: '3EWYPS54KCZEYHIMZ5X55V5FC4CMTT11H6',
    }
  },
  networks: {
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/XwvHq5PMWDVxAakHt5wdOQWedUdED9C5',
      accounts: [
        // ALERT: DO NOT USE THIS PRIVATE KEY IN PRODUCTION, THIS IS FOR TESTING PURPOSES ONLY
        '7e8444e3b47e706d2190801a32c568edeaeab2fe16e9dafdb774a6fdc5a211b8',
        '7093e4c110c56ec578ff6b3247d5975f1e5819397c42a745ef01bda903cebe61',
      ],
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/22723bae732b4ab197c3fa8bce04b370',
      // url: 'https://eth-goerli.g.alchemy.com/v2/QcFlKsNZbPZkqKT3zkIbe_uGZ57y53Ba',
      accounts: [
        // ALERT: DO NOT USE THIS PRIVATE KEY IN PRODUCTION, THIS IS FOR TESTING PURPOSES ONLY
        '7e8444e3b47e706d2190801a32c568edeaeab2fe16e9dafdb774a6fdc5a211b8',
        '7093e4c110c56ec578ff6b3247d5975f1e5819397c42a745ef01bda903cebe61',
      ],
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;

