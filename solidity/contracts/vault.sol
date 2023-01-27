// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FaucetERC721} from "./faucet.sol";

contract Vault is Ownable {

    event Deposit(bytes32 operationId, address asset, address from, uint256 tokenId);
    event Mint(bytes32 operationId, address asset, address to, uint256 tokenId);
    event Burn(bytes32 operationId, address asset, address from, uint256 tokenId);
    event Unlock(bytes32 operationId, address asset, address to, uint256 tokenId);

    mapping(bytes32 => bool) public seenOpId;

    address private payloadSignerAddress;

    modifier OpIdNotSeen(bytes32 operationId) {
        require(!seenOpId[operationId], "invalid operationId already");
        seenOpId[operationId] = true;
        _;
    }

    // @note that owner is the operator here, the same owner
    constructor() {
        payloadSignerAddress = 0xf407b7f92626e22d1EeD7feA0D2A14B471358fDF;
    }

    // @note user calls this function, anyone can call this function ON chain1
    function deposit(bytes32 operationId, address nftAddress, uint256 tokenId, bytes calldata signature) external OpIdNotSeen(operationId) {
        require(ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256(abi.encode(nftAddress,tokenId))), signature) == payloadSignerAddress,
            "signature verification failed");
        require(FaucetERC721(nftAddress).ownerOf(tokenId) == _msgSender(), "deposit: not sender's nft");
        FaucetERC721(nftAddress).operatorTranserFrom(tokenId, address(this));
        emit Deposit(operationId, nftAddress, _msgSender(), tokenId);
    }

// CHAIN 2 FUNCS START
    // @note called by this contract to mint on chain2 for the user
    function mint(bytes32 operationId, address syntheticNFT, address user, bytes32 uri, bytes32 name) external onlyOwner OpIdNotSeen(operationId) {
        FaucetERC721(syntheticNFT).mintForUserWithUriAndName(user, uri, name);
        uint256 tokenIndex = FaucetERC721(syntheticNFT).tokenIndex();
        emit Mint(operationId, syntheticNFT, user, tokenIndex);
    }

    // @note called by operator ON chain2 once user submits request
    function burn(bytes32 operationId, address syntheticNFT, uint256 tokenId) external onlyOwner OpIdNotSeen(operationId) {
        address from = FaucetERC721(syntheticNFT).ownerOf(tokenId);
        FaucetERC721(syntheticNFT).operatorTranserFrom(tokenId, address(this));
        FaucetERC721(syntheticNFT).burn(tokenId);
        emit Burn(operationId, syntheticNFT, from, tokenId);
    }
// CHAIN 2 FUNCS END

    // @note called by operator to transfer the NFT back to the user ON chain1
    function unlock(bytes32 operationId, address nftAddress, address to, uint256 tokenId) external onlyOwner OpIdNotSeen(operationId) {
        FaucetERC721(nftAddress).transferFrom(address(this), to, tokenId);
        emit Unlock(operationId, nftAddress, to, tokenId);
    }

    receive() payable external {
    }

    fallback() external {
    }


    
    /*
    
    BridgeIn flow
    -------------
    deposit(chain1) -> mint(chain2)

    BridgeOut flow
    --------------
    depositAndBurn(chain2) -> unlock(chain1)
    
    */


}