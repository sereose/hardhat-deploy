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

    const FaucetERC721 = await ethers.getContractFactory("FaucetERC721");
    const Vault = await ethers.getContractFactory("Vault");

    vaultChain1 = await Vault.deploy();
    vaultChain2 = await Vault.deploy();

    nftChain1 = await FaucetERC721.deploy(vaultChain1.address, "NFT Chain 1", "NFTCHAIN1");
    nftChain2 = await FaucetERC721.deploy(vaultChain2.address, "NFT Chain 2", "NFTCHAIN2");

  });

  it("Should deploy contracts correctly", async () => {
    
    expect(await nftChain1.name()).to.equal("NFT Chain 1");
    expect(await nftChain2.name()).to.equal("NFT Chain 2");


    expect(await nftChain1.owner()).to.equal(operator.address);
    expect(await nftChain2.owner()).to.equal(operator.address);

    expect(await nftChain1.operator()).to.equal(vaultChain1.address);
    expect(await nftChain2.operator()).to.equal(vaultChain2.address);

    expect(await vaultChain1.owner()).to.equal(operator.address);
    expect(await vaultChain2.owner()).to.equal(operator.address);

  });

  describe("User mint and deposit flow on chain1", function() {
    it("Should let user mint a free token", async () => {
      const uriBytes32 = ethers.utils.formatBytes32String("uri1");
      const tx = await nftChain1.connect(user).mintWithURI(uriBytes32);
      await tx.wait();
  
      expect(await nftChain1.ownerOf("1")).to.be.equal(user.address);
      expect(await nftChain1.tokenURI("1")).to.be.equal("uri1");
      expect(await nftChain1.balanceOf(user.address)).to.be.equal(1);
  
    });
  
    it("Should deposit the Nft on chain1 vault", async () => {
      const operationId = ethers.utils.formatBytes32String("1");
      await expect(vaultChain1.connect(user).deposit(operationId, nftChain1.address, "1"))
        .to.emit(vaultChain1, "Deposit")
        .withArgs(operationId, nftChain1.address, user.address, "1");
  
      expect(await nftChain1.ownerOf("1")).to.be.equal(vaultChain1.address);
      expect(await nftChain1.balanceOf(vaultChain1.address)).to.be.equal(1);
  
    });
  
  });

  describe("Vault mint and transfer flow on chain2", function() {
    it("Should let the operator mint a chain2 NFT", async () => {
      const operationId = ethers.utils.formatBytes32String("2");
      const uriBytes32 = ethers.utils.formatBytes32String("user1 nft");
      const nameBytes32 = ethers.utils.formatBytes32String("name_name")
      await expect(vaultChain2.connect(operator).mint(operationId, nftChain2.address, userProxy.address, uriBytes32, nameBytes32))
        .to.emit(vaultChain2, "Mint")
        .withArgs(operationId, nftChain2.address, userProxy.address, "1");
  
      expect(await nftChain2.ownerOf("1")).to.be.equal(userProxy.address);
      expect(await nftChain2.tokenURI("1")).to.be.equal("user1 nft");
      expect(await nftChain2.tokenName("1")).to.be.equal("name_name");
  
    });
  });

  describe("Vault deposit back and burn flow on chain2", function() {
    it("Should let the operator burn on chain2 vault", async () => {
      const operationId = ethers.utils.formatBytes32String("3");
      await expect(vaultChain2.connect(operator).burn(operationId, nftChain2.address, "1"))
        .to.emit(vaultChain2, "Burn")
        .withArgs(operationId, nftChain2.address, userProxy.address, "1");
      
      expect(await nftChain2.balanceOf(userProxy.address)).to.be.equal(0);
      await expect(nftChain2.ownerOf("1")).to.be.reverted;
  
    });
  });

  describe("Vault unlock flow chain1", function() {
    it("Should let the operator unlock on chain1 vault and transfer to user1's vault", async () => {
      const operationId = ethers.utils.formatBytes32String("4");
      await expect(vaultChain1.unlock(operationId, nftChain1.address, user.address, "1"))
        .to.emit(vaultChain1, "Unlock")
        .withArgs(operationId, nftChain1.address, user.address, "1");
  
      expect(await nftChain1.balanceOf(user.address)).to.be.equal(1);
      expect(await nftChain1.balanceOf(vaultChain1.address)).to.be.equal(0);
      expect(await nftChain1.ownerOf("1")).to.be.equal(user.address);
  
    });
  });
  

});
