import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ||
  "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    // this network is run inside the docker container and 8545 port is exposed
    hardhat: {
      accounts: [
        {
          privateKey:
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          balance: "20000000000000000000000",
        },
        {
          privateKey:
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
          balance: "20000000000000000000000",
        },
        {
          privateKey:
            "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
          balance: "20000000000000000000000",
        },
        {
          privateKey:
            "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
          balance: "20000000000000000000000",
        },
        {
          privateKey:
            "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
          balance: "20000000000000000000000",
        },
        {
          privateKey:
            "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
          balance: "20000000000000000000000",
        },
      ],
    },
    //docker: {
      // used to deploy solidity files on docker hardhat container
      // url: "http://host.docker.internal:8545" // maybe works only on mac
    //  url: "http://gbu-bridge-evmosd.gbu-bridge.svc.cluster.local:8545"
    //},

    docker: {
      url: "http://evmos-chain:8545"
    },

    localhost: {
      // this is used to access the hardhat node on local machine
      url: "http://localhost:8545/",
    },
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/b8Uz5l-fP0sVGjcpTTGqUw87jlPsFkph`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ftm_testnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    // apiKey: process.env.FTM_API_KEY
    apiKey: {
      ftmTestnet: process.env.FTM_API_KEY as string,
      bscTestnet: process.env.BSC_API_KEY as string,
      goerli: process.env.ETHERSCAN_API_KEY as string,
    },
  },
  abiExporter: [
    {
      path: "./abi",
      pretty: false,
      flat: true,
    },
  ],
};

export default config;
