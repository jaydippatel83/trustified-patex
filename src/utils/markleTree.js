import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";

export async function getIssuerMarkleTree(issuers) {
  const issuerleaves = issuers.map((x) => ethers.utils.keccak256(x));
  // create a Merkle tree
  const issuerstree = new MerkleTree(issuerleaves, ethers.utils.keccak256, {
    sort: true,
  });

  const issuerRoot = issuerstree.getHexRoot();

  const buf2hex = (x) => "0x" + x.toString("hex");

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const leaf = ethers.utils.keccak256(accounts[0]); // address from wallet using walletconnect/metamask
  const proof = issuerstree.getProof(leaf).map((x) => buf2hex(x.data));

  return [issuerRoot, proof];
}

export async function getClaimerMarkleTree(claimers) {
  const eventclaimers = [
    "0x3Fe0ab910eA2f59D4E7ee7375FA69Acff238B798",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  ]; // get data from firebase

  const claimersleaves = eventclaimers.map((x) => ethers.utils.keccak256(x));

  const claimerstree = new MerkleTree(claimersleaves, ethers.utils.keccak256, {
    sort: true,
  });

  const claimerRoot = claimerstree.getHexRoot();

  const buf2hex = (x) => "0x" + x.toString("hex");

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const leaf = ethers.utils.keccak256(accounts[0]); // address from wallet using walletconnect/metamask
  const proof = claimerstree.getProof(leaf).map((x) => buf2hex(x.data));
  return [claimerRoot, proof];
}
