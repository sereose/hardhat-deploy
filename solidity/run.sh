#!/bin/sh


npx cache clean
npx hardhat compile --force
# npx hardhat --config hardhat.config.ts node
#npx hardhat run scripts/deploy.ts --network docker
npx hardhat run scripts/deploy.ts --network localhost
nftAddress=$(jq '.nftAddress' deploy.json)
vaultAddress=$(jq '.vaultAddress' deploy.json)
echo "nftaddress=$nftAddress"  >> $GITHUB_OUTPUT
echo "vaultaddress=$vaultAddress"  >> $GITHUB_OUTPUT