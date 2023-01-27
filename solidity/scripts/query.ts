
import { ethers } from "hardhat";
import { loadContracts } from "./common";

// note that these params are fixed if we are spinning up a hardhat node
const minterPrivKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const deployerPrivKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const providerURL = "http://localhost:8545/";
const operationId = "0x64383732643361652d666330332d346166612d616632342d6131656239303039";

async function main() {

    const provider = ethers.providers.getDefaultProvider(providerURL)

    const {nft1, nft2, vault1, vault2} = await loadContracts(provider);
    
    const minter = new ethers.Wallet(minterPrivKey, provider);
    const deployer = new ethers.Wallet(deployerPrivKey, provider);

    console.log(
        `
        nft1: ${nft1.address}
        vault1: ${vault1.address}
        minter: ${minter.address}
        `
    );


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});