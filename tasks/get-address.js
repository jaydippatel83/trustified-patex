const fa = require("@glif/filecoin-address");

task(
  "get-address",
  "Gets Filecoin f4 address and corresponding Ethereum address."
).setAction(async (taskArgs) => {
  const [deployer] = await hre.ethers.getSigners();

  const f4Address = fa.newDelegatedEthAddress(deployer.address).toString();
});

module.exports = {};
