require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./tasks");
require("dotenv").config();

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
console.log(PRIVATE_KEY,"PRIVATE_KEY");
const MAINNET_PRIVATE_KEY = process.env.REACT_APP_MAINNET_PRIVATE_KEY

module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: process.env.REACT_APPA_POLYGONSCAN_API_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
  defaultNetwork: "calibration",
  networks: {
    hardhat: {},
    calibration: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1 ",
      accounts: [PRIVATE_KEY],
    },
    fvm: {
      chainId: 314,
      url: "https://api.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    // polygon: {
    //   url: `https://polygon-rpc.com/`,
    //   accounts: [MAINNET_PRIVATE_KEY],
    //   chainId: 137,
    // },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    // celotestnet: {
    //   url: `https://alfajores-forno.celo-testnet.org`,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 44787,
    // },
    // celoMainnet: {
    //   url: `https://forno.celo.org`,
    //   accounts: [MAINNET_PRIVATE_KEY],
    //   chainId: 42220,
    // },
    arbitrumtestnet: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts: [PRIVATE_KEY],
      chainId: 421613,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [PRIVATE_KEY],
      chainId: 10200,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/1KY8SXPno-ao61fhLtpTBD4mBZvesVIC",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    patex:{
      url: "https://test-rpc.patex.io",
      accounts: [PRIVATE_KEY],
      chainId: 471100,
    }

  },
  mocha: {
    timeout: 400000000,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
