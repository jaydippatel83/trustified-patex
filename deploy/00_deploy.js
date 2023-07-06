require("hardhat-deploy");
require("hardhat-deploy-ethers");

const ethers = require("ethers");
const fa = require("@glif/filecoin-address");
const util = require("util");
const request = util.promisify(require("request"));

const DEPLOYER_PRIVATE_KEY = network.config.accounts[0];

async function callRpc(method, params) {
  var options = {
    method: "POST",
    url: "https://api.calibration.node.glif.io/rpc/v1 ",
    // url: "http://localhost:1234/rpc/v0",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  };
  const res = await request(options);
  return JSON.parse(res.body).result;
}

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  try {
    await deploy("Trustified", {
      from: deployer.address,  
      maxPriorityFeePerGas: priorityFee,
      log: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.tags = ["Trustified"];
