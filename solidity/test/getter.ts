import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet and Vault contract tests", function () {
  let nftChain1: any;
  let nftChain2: any;
  let vaultChain1: any;
  let vaultChain2: any;
  let user: any;
  let operator: any;
  let userProxy: any;

  before(async () => {

    [operator, user, userProxy] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");

    vaultChain1 = await Vault.deploy();

    const FaucetERC721 = await ethers.getContractFactory("FaucetERC721");

    nftChain1 = await FaucetERC721.deploy(vaultChain1.address, "NFT Chain 1", "NFTCHAIN1");

  });

  it("Should get correct amount of NFTs", async () => {    
    
    for(let i = 0; i < 10; i++) {
        const name = ethers.utils.formatBytes32String(i.toString() + "_name");
        const uri = ethers.utils.formatBytes32String(i.toString() + ".com");
        const tx = await nftChain1.mintForUserWithUriAndName(user.address, uri, name);
        await tx.wait();
    }

    let [nfts, uris, names] = await nftChain1.getNfts(user.address);
    expect(nfts.length).to.equal(10);
    expect(uris.length).to.equal(10);
    expect(names.length).to.equal(10);

    const tx = await nftChain1.connect(user).transfer(userProxy.address, 2);
    await tx.wait();

    const tx1 = await nftChain1.connect(user).burn(3);
    await tx1.wait();

    let [nfts2, uris2, names2] = await nftChain1.getNfts(user.address);
    expect(nfts2.length).to.equal(8);
    expect(uris2.length).to.equal(8);
    expect(names2.length).to.equal(8);

  });
});