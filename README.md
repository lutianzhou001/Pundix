# Simple NFT contract

## install

```shell
npm i
```

## deploy and verify on testnet:mumbai

```shell
npx hardhat run scripts/deploy.ts --network mumbai
```

## verify the contract
```shell
chmod +x ./verify.sh
./verify.sh
```

## interact with the contract

```shell
npx hardhat run scripts/operations.ts --network mumbai
```

## enjoy coding!