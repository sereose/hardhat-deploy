
import { ethers } from "hardhat";
import { loadContracts } from "./common";

// note that these params are fixed if we are spinning up a hardhat node
const privKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const providerURL = "http://localhost:8545/";
const operationId = "0x64383732643361652d666330332d346166612d616632342d6131656239303039";

async function main() {

    const provider = ethers.providers.getDefaultProvider(providerURL)
    const {nft1, nft2, vault1, vault2} = await loadContracts(provider);
    
    const minter = new ethers.Wallet(privKey, provider);

    console.log(
        `
        nft1: ${nft1.address}
        vault1: ${vault1.address}
        minter: ${minter.address}
        `
    );

    const tokenId = "1";
    console.log(`owner of id ${tokenId}: ${await nft1.ownerOf(tokenId)}`);

    const tx = await vault1.connect(minter).deposit(operationId, nft1.address, tokenId);
    const receipt = await tx.wait();

    console.log("events", receipt.events);

    console.log(`balance: ${await nft1.balanceOf(vault1.address)}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});