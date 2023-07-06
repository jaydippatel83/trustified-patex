const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owners = [
    "0x3Fe0ab910eA2f59D4E7ee7375FA69Acff238B798",
    "0x61bde2112cf0B16F3E90B86695E6c5d0B2cD9960",
    "0x73426923AF5FdaDa87c6a3662E3d9253b87AC084",
  ];
  const allowed = [true, true, true];

  const TrustifiedIssuerNFT = await hre.ethers.getContractFactory(
    "TrustifiedIssuer"
  );
  const trustifiedissuerNFTContract = await TrustifiedIssuerNFT.deploy(
    owners,
    allowed
  );

  const TrustifiedContract = await hre.ethers.getContractFactory("Trustified");
  const trustifiedContract = await TrustifiedContract.deploy(
    trustifiedissuerNFTContract.address,
    owners,
    owners.length - 1
  );

  console.log(
    "Trustified IssuerNFT Contract contract address:",
    trustifiedissuerNFTContract.address
  );
  console.log("Trustified nft contract address:", trustifiedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
