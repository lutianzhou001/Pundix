# Relayer

## Description

A simple relayer for restore/resend uses' transcations

## Installation

```bash
$ yarn
```

## Running the app

```bash
# Start the docker first.
$ docker-compose up -d
# Then start the app.
$ yarn start
```
## Doc at
```
http://127.0.0.1:8082/api/#/
```
## function signature/new
```
{
  "signature": "string", // the EIP712 signature
  "sender": "string", // sender address
  "x": "string", // destination address
  "token": "string", // token address
  "amount": "string", // the amount of tokens one want to transfer
  "nonce": "string", // nonce, get from the blockchain to prevent replay attack
  "deadline": 0 // deadline, till deadline the transcation will expired
}
```

## function signature/batch
to batch transactions manually. But it will still execute automatically every 10min.

## configration at
```
.env.development
```
