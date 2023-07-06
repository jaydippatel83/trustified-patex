// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract TrustifiedIssuer is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address public owner;
    mapping (address => bool) allowList;


    constructor(address[] memory wallets, bool[] memory allowed) ERC721("TrustifiedIssuerv5", "TIv5"){
        owner = msg.sender;
        for(uint16 i =0; i<wallets.length; i++){
            allowList[wallets[i]] = allowed[i];
        }
    }

    modifier onlyOwner() {
      require(msg.sender == owner, "Only contract owner can call this function");
      _;
    }

    function isAllowed() external view returns(bool){
        return allowList[msg.sender];
    }

    function createTokens(string memory tokenURI, address[] calldata issuers) external  {
        require(allowList[msg.sender], "Caller is not allowed to create tokens!");
        for(uint256 i = 0; i < issuers.length; i++){
             _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            _mint(issuers[i], newItemId);
            _setTokenURI(newItemId, tokenURI);
        }
    }

    function setAllowedWallet(address wallet, bool allowed) external onlyOwner {
        allowList[wallet] = allowed;
    }
}
