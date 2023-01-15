# Pundix 

## Description

A simple http server for querying the token locked on the Pundix contract.

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
## Function: get the tokenList manually 
```shell
curl --location --request POST '127.0.0.1:8082/fetch/tokens'
```

## App will automatically fetch the tokenList every 5 seconds

## All the result will store to the mongo database and export to the fx-bridge-tokne-supply.csv file

## configration at
```
.env.development
```
