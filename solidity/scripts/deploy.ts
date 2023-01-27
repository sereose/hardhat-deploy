import { ethers } from "hardhat";
import * as fs from "fs";

async function main(): Promise<{
  nftAddress: string;
  vaultAddress: string;
}> {
  const [deployer] = await ethers.getSigners();

  const provider = ethers.provider;

  console.log(`deployer.address: `, deployer.address);
  console.log(
    `deployer.balance: `,
    await provider.getBalance(deployer.address)
  );

  const FaucetERC721 = await ethers.getContractFactory("FaucetERC721");
  const Vault = await ethers.getContractFactory("Vault");

  const vault1 = await Vault.deploy();
  // const vault2 = await Vault.deploy();

  const nft1 = await FaucetERC721.deploy(vault1.address, "Heroes NFTs", "HNFT");
  // const nft2 = await FaucetERC721.deploy(vault2.address, "NFT 2", "NFT2");

  console.log(`
    Deployer: ${deployer.address}
    vault chain1: ${vault1.address}
    Nft chain1: ${nft1.address}
  `);

  const tx = {
    to: vault1.address,
    value: ethers.utils.parseEther("0.05"),
  };

  await deployer.sendTransaction(tx);
  console.log("balance vault:", await provider.getBalance(vault1.address));
  return {
    nftAddress: nft1.address,
    vaultAddress: vault1.address,
  };
}

main().then((res) =>
  fs.writeFile("./deploy.json", JSON.stringify(res), () => {})
);

/*
LOCALHOST
    Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    vault chain1: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    Nft chain1: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

GOERLI
    Deployer: 0x9aBD70479A9622deb62FC298c6B0005409F0fA67
    vault chain1: 0x12B4852170d586F1441a7be3238B5EF7cf699D23
    Nft chain1: 0x033a555Ec86641e7080b99840528845671a98E0e

GOERLI_NEW
    vault chain1: 0xf1220F151685F33b7aB95936b74fc00f36Fb62fC
    Nft chain1: 0xAcc017036173494fCa86989562cDd90639D1FAC2

bsc
    vault chain1: 0x4242F1b86523BDe526B3B64496e64933cf681ea9
    Nft chain1: 0x12B4852170d586F1441a7be3238B5EF7cf699D23

Ftm:
    vault chain1: 0x2cbbaEf5A866580Eeb8A379330d2700bAcFF12D1
    Nft chain1: 0x782b763CCaf0EC8ac61173Ad2f16cC6F7db460c4

*/
