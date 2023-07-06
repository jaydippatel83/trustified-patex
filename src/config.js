import { ethers } from "ethers";

export const trustifiedContracts = {
  fvmtestnet: {
    trustified: "0x23da8a4aDfB35006927715A21599FD7f0820805A",
    trustifiedIssuernft: "0x06a8fa03F246adCC8D1Ce4f3A8f8323125A51b1a",
  }, // Testnet
  fvm: {
    trustified: "0x86Fc2de800796ae824cAFDE6B000115Aa2d916a2",
    trustifiedIssuernft: "0x7058BFC2141E13b241D744dfB387E2784d8733C7",
  }, // Mainnet
  mumbai: {
    trustified: "0x480a90061Eb948DdDe5cABD6529D2e9eD3298b3d", //v5
    trustifiedIssuernft: "0xa0f03408984424cdDc9688b5FED0AbCDBa6b4fEF",
    //trustified: "0xA7683AEDEcECc2C85EBB6D0f93a1AE852bBeA077", v4
  },
  polygon: {
    trustified: "0x227487a4Fcd8dE7eBb4A5b966E8AcCde0B41b9ea",
    trustifiedIssuernft: "0x6d41f642786601DD60c52dAA0e3536a04B2abea6",
  },
  celotestnet: {
    trustified: "0x8907F6f3040fB8f4A9794BfaAFf8F1ac136F8f06",
    trustifiedIssuernft: "0x66c820B0559A97611918D3d496eEb46BAE3e7202",
  },
  celomainnet: {
    trustified: "0xb93F6F074107C4dd6707879874D1C017450898FC",
    trustifiedIssuernft: "0x493d4C9c27eA03DE1AeA37d8793F0C765676Dc18",
  },
  arbitrumtestnet: {
    trustified: "0x2c01ECa5DF2Fb1Ae9166744b14363984dD27199A",
    trustifiedIssuernft: "0x28719360690e874f7411D2e81C9F470080A7A886",
  },
  gnosistestnet: {
    trustified: "",
    trustifiedIssuernft: "",
  },
  ethereumtestnet: {
    trustified: "0x0C4DCc2dc216fF3Fe1A7A4F6c9B5D71cbA10AFC2",
    trustifiedIssuernft: "0x74eE14CD4f92131042acc08cE50176B351dF31e0",
  },
  patextestnet: {
    trustified: "0xDc68cE61f171e5f9D4CC18fC63ff9406E7Dccd02",
    trustifiedIssuernft: "0x85B6eE037A8E183C502E8Ff17FcC069dd4D5712E",
  },

  // bsc: {
  //   trustified: "0x0FE82cBB448A89Dd912EbC4117B927616826AcCC",
  // },
};

export const chain = {
  314159: "fvmtestnet",
  314: "fvm",
  80001: "mumbai",
  137: "polygon",
  97: "bsc",
  44787: "celotestnet", //
  42220: "celomainnet",
  421613: "arbitrumtestnet", // GOERLI
  10200: "gnosistestnet",
  11155111: "ethereumtestnet", //SEPOLIA
  471100:'patextestnet'
};

export const logos = {
  mumbai: "/assets/logo/mumbai.png",
  polygon: "/assets/logo/mumbai.png",
  ether: "/assets/logo/ethereum.png",
  ethereumtestnet: "/assets/logo/ethereum.png",
  celotestnet: "/assets/logo/celo.png",
  celomainnet: "/assets/logo/celo.png",
  fvm: "/assets/logo/fvm.png",
  fvmtestnet: "/assets/logo/fvm.png",
  gnosis: "/assets/logo/gnosis.png",
  arbitrum: "/assets/logo/arbitrum.png",
  bsc: "/assets/logo/bsc.png",
  patex:"/assets/logo/patex.png"
};

export const networkURL = {
  fvm: "https://filfox.info/en/tx",
  fvmtestnet: "https://calibration.filfox.info/en/tx",
  mumbai: "https://mumbai.polygonscan.com/tx",
  polygon: "https://polygonscan.com/tx",
  celotestnet: "https://alfajores-blockscout.celo-testnet.org/tx",
  celomainnet: "https://celoscan.io/tx",
  arbitrumtestnet: "https://goerli-rollup-explorer.arbitrum.io/tx",
  ethereumtestnet: "https://sepolia.etherscan.io/tx",
  gnosistestnet: "https://gnosisscan.io/tx",
  bsc: "https://testnet.bscscan.com/tx",
  patextestnet:'https://testnet.patexscan.io/tx'
};

export const networkIds = {
  fvm: 314,
  fvmtestnet: 314159,
  mumbai: 80001,
  polygon: 137,
  celotestnet: 44787,
  celomainnet: 42220,
  arbitrumtestnet: 421613,
  ethereumtestnet: 11155111,
  gnosistestnet: 10200,
  bsc: 97,
  patex: 471100
};

export const chainParams = [
  {
    chainId: ethers.utils.hexValue(137),
    rpcUrl: "https://polygon-rpc.com/",
    chainName: "Polygon",
    symbol: "MATIC",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(80001),
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    chainName: "Matic Mumbai",
    symbol: "MATIC",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(314),
    rpcUrl: "https://api.node.glif.io/rpc/v1",
    chainName: "Filecoin Mainnet",
    symbol: "FIL",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(314159),
    rpcUrl: "https://api.calibration.node.glif.io/rpc/v1",
    chainName: "Filecoin Calibration",
    symbol: "tFIL",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(44787),
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    chainName: "Celo Testnet",
    symbol: "CELO",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(421613),
    rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
    chainName: "Arbitrum Goerli",
    symbol: "AGOR",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(11155111),
    rpcUrl: "https://rpc2.sepolia.org",
    chainName: "Ethereum Sepolia",
    symbol: "ETH",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(42220),
    rpcUrl: "https://forno.celo.org",
    chainName: "Celo Mainnet",
    symbol: "CELO",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(471100),
    rpcUrl: "https://test-rpc.patex.io",
    chainName: "Patex",
    symbol: "ETH",
    decimals: 18,
  },
];

export const multiChains = [
  {
    label: "Ethereum Sepolia",
    value: "ethereumtestnet",
    image: "https://request-icons.s3.eu-west-1.amazonaws.com/eth.svg",
    chainId: 11155111,
    priority: 1,
  },
  {
    label: "Patex",
    value: "patextestnet",
    image: "/assets/logo/patex.png",
    chainId: 471100,
    priority: 1,
  },
  {
    label: "Polygon Mumbai",
    value: "mumbai",
    image: "/assets/coin.png",
    chainId: 80001,
    priority: 1,
  },
  {
    label: "FVM(Mainnet)",
    value: "fvm",
    image: "/assets/filecoin.png",
    chainId: 314,
    priority: 0,
  },
  {
    label: "FVM Testnet(Calibration)",
    value: "fvmtestnet",
    image: "/assets/filecoin.png",
    chainId: 314159,
    priority: 0,
  },
  {
    label: "Polygon",
    value: "polygon",
    image: "/assets/coin.png",
    chainId: 137,
    priority: 0,
  }, 
  {
    label: "Alfajores Testnet(Celo)",
    value: "celotestnet",
    image: "/assets/celo.png",
    chainId: 44787,
    priority: 0,
  },
  {
    label: "Celo Mainnet",
    value: "celomainnet",
    image: "/assets/celo.png",
    chainId: 42220,
    priority: 0,
  },
  {
    label: "Arbitrum Goerli",
    value: "arbitrumtestnet",
    image: "/assets/airbitrum.png",
    chainId: 421613,
    priority: 0,
  }, 
];

export const fsize = [
  12, 14, 16, 18, 20, 24, 26, 30, 32, 36, 40, 42, 48, 50, 54, 60,
];
export const fbold = [100, 200, 300, 400, 500, 600, 700, 800, 900];
export const fontList = [
  "Roboto",
  "Borsok",
  "Open Sans",
  "Lato ",
  "Poppins",
  "Zeyada",
  "Babylonica",
  "Dancing Script",
  "Lobster",
  "Pacifico",
  "Caveat",
  "Satisfy",
  "Great Vibes",
  "Ole",
  "Coiny",
  "Kenia",
  "Rubik Beastly",
  "Londrina Sketch",
  "Neonderthaw",
  "Kumar One",
  "Ribeye",
  "Emblema One",
  "Ewert",
  "Kavoon",
  "Moul",
  "Rubik Moonrocks",
  "Rubik Iso",
  "Unifraktur Cook",
  "Germania One",
  "Monoton",
  "Orbitron",
  "Rampart One",
];
