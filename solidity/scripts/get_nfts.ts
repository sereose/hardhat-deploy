
import { ethers } from "hardhat";
import { loadNetworkInteractionData } from "./common";

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    await getNFTsUsingContractTypeCall();
}

async function getNFTsUsingContractTypeCall() {

    const {minterAccount, minterPrivKey, providerURL, nft1ContractAddress} = await loadNetworkInteractionData();
    const provider = ethers.providers.getDefaultProvider(providerURL);
    const minter = new ethers.Wallet(minterPrivKey, provider);
    const abi = ["function getNfts(address) public view returns(uint256[],string[],string[])"];
    const nft1 = new ethers.Contract(nft1ContractAddress, abi, minter);
    
    let [nfts, uris, names] = await nft1.connect(minter).getNfts(minterAccount);
    console.log(`NFTS: ${nfts}`);
    console.log(`NFTS: ${uris}`);
    console.log(`NFTS: ${names}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});