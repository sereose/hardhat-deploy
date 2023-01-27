#!/bin/bash
npx hardhat run scripts/deploy.ts --network localhost
nftAddress=$(jq '.nftAddress' deploy.json)
vaultAddress=$(jq '.vaultAddress' deploy.json)
echo $nftAddress
echo $vaultAddress