// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FaucetERC721 is Ownable, ERC721URIStorage, ERC721Burnable {

    //@note owner is the operator, the same guy deploys all the contracts on all the chains

    uint256 public tokenIndex;
    address public operator;
    mapping(uint256 => string) public tokName;
    mapping(uint256 => bool) tokenBurnt;

    constructor(address _operator, string memory _name, string memory _symbol) Ownable() ERC721(_name, _symbol) {
        operator = _operator;
    }

    function mintWithURI(bytes32 uri) external {
        uint256 tokenId = ++tokenIndex;
        _mint(_msgSender(), tokenId);
        _setTokenURI(tokenId, bytes32ToString(uri));
    }

    function mintForUser(address user) external {
        uint256 tokenId = ++tokenIndex;
        _mint(user, tokenId);
    }

    function mintForUserWithUriAndName(address user, bytes32 uri, bytes32 _name) external {
        uint256 tokenId = ++tokenIndex;
        _mint(user, tokenId);
        _setTokenURI(tokenId, bytes32ToString(uri));
        _setName(tokenId, bytes32ToString(_name));
    }

    // @note writing here for the sake of visibility
    function tokenURI(uint256 id) public view virtual override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(id);
    }

    function tokenName(uint256 tokenId) public view virtual returns (string memory) {
        super._requireMinted(tokenId);
        return tokName[tokenId];
    }


    function balanceOf(address owner) public view virtual override(ERC721) returns (uint256) {
        return super.balanceOf(owner);
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        return super.ownerOf(tokenId);
    }

    // @dev only operator can call this function and no one else
    function operatorTranserFrom(uint256 tokenId, address to) external {
        require(_msgSender() == operator, "operatorTranserFrom: !operator");
        _transfer(ownerOf(tokenId), to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.transferFrom(from, to, tokenId);
    }

    function transfer(address to, uint256 tokenId) public virtual {
        transferFrom(_msgSender(), to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function burn(uint256 tokenId) public virtual override {
        tokenBurnt[tokenId] = true;
        super.burn(tokenId);
    }

    function getNfts(address user) public view returns(uint256[] memory, string[] memory, string[] memory) {
        uint256[] memory filteredNFTs = new uint256[](tokenIndex + 1);
        uint256 index;
        for (uint256 i = 1; i < tokenIndex + 1; i++) {
            if (tokenBurnt[i]) {
                continue;
            }
            if (ownerOf(i) == user) {
                filteredNFTs[index++] = i;
            }
        }

        uint256[] memory ownerNFTs = new uint256[](index);
        for(uint256 i = 0; i < index; i++) {
            ownerNFTs[i] = filteredNFTs[i];
        }

        string[] memory nftURIs = new string[](index);
        string[] memory nftNames = new string[](index);
        for(uint256 i = 0; i < index; i++) {
            nftURIs[i] = tokenURI(ownerNFTs[i]);
            nftNames[i] = tokenName(ownerNFTs[i]);
        }

        return (ownerNFTs, nftURIs, nftNames);
    }

    function _setName(uint256 tokenId, string memory _name) internal {
        tokName[tokenId] = _name;
    }
    
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

// NOTE: safeMint and safeTransferFrom mint and transfer NFT to an address which supports the interface so use mint and transferFrom
}
