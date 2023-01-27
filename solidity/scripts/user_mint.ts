
import { ethers } from "hardhat";
import {  loadNetworkInteractionData } from "./common";

async function main() {

    // mints 2 NFTs for the user ...
    const {minterAccount, deployerPrivKey, providerURL, nft1ContractAddress} = await loadNetworkInteractionData();
    const provider = ethers.providers.getDefaultProvider(providerURL)

    const deployer = new ethers.Wallet(deployerPrivKey, provider);
    const balance = await provider.getBalance(minterAccount);
    
    // console.log(`provider: `, provider);
    console.log(`minter address: `, minterAccount);
    console.log(`minter balance: `, balance);
    const FaucetERC721 = await ethers.getContractFactory("FaucetERC721");
    const nft1Contract = FaucetERC721.attach(nft1ContractAddress);

    console.log(`minting 2 NFTs`);
    for (let i = 0; i < 2; i++) {
      const uri = ethers.utils.formatBytes32String("shorturl.at/lrUZ0");
      const name = ethers.utils.formatBytes32String("BATMAN!");
      const tx = await nft1Contract.connect(deployer).mintForUserWithUriAndName(minterAccount, uri, name);
      await tx.wait();
    }
    console.log(`minted 2 NFTs`);

    console.log(`balance: ${await nft1Contract.balanceOf(minterAccount)}`);
    console.log(`tokenURI: ${await nft1Contract.tokenURI("1")}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});