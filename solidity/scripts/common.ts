
import { BaseProvider } from "@ethersproject/providers";
import { ethers } from "hardhat";

// NOTE: these vault addresses are hardhat node vault addresses
const vault1Address = process.env.VAULT1_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const vault2Address = process.env.VAULT2_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const nft1Address = process.env.NFT1_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const nft2Address = process.env.NFT2_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function loadContracts(provider: BaseProvider) {
  
  const [deployer] = await ethers.getSigners();

  const FaucetERC721 = await ethers.getContractFactory("FaucetERC721");
  const Vault = await ethers.getContractFactory("Vault");

  const vault1 = Vault.attach(vault1Address);
  const vault2 = Vault.attach(vault2Address);

  const nft1 = FaucetERC721.attach(nft1Address);
  const nft2 = FaucetERC721.attach(nft2Address);

  return {
    nft1,
    nft2,
    vault1,
    vault2
  };

}

async function loadNetworkInteractionData(provider: BaseProvider) {
  const minterPrivKey = process.env.MINTER_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const deployerPrivKey = process.env.DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const providerURL = process.env.PROVIDER_URL || "http://localhost:8545/";;
  const nft1ContractAddress = process.env.NFT1_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const minterAccount = process.env.MINTER_ACCOUNT || "0x9aBD70479A9622deb62FC298c6B0005409F0fA67"; // account where nft should be minted

  return {
    minterAccount,
    minterPrivKey,
    deployerPrivKey,
    providerURL,
    nft1ContractAddress
  };
}

module.exports = {
  loadContracts,
  loadNetworkInteractionData
}
