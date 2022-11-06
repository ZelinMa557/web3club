// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract MyERC721 is ERC721, ERC721Enumerable, ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter _tokenId;
    mapping (address => string) studentNFT;

    event Log(string);


    constructor() ERC721("NFT","NFT") {}

    function strConcat(string memory _a, string memory _b) internal pure returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
    }    
    
    function toStr(uint256 value) internal pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory data = abi.encodePacked(value);
        bytes memory str = new bytes(1);
        uint i = data.length - 1;
        str[0] = alphabet[uint(uint8(data[i] & 0x0f))];
        return string(str);
    }
    
    function uintToString(uint _uint) internal pure returns (string memory str) {
        if(_uint==0) return '0';
        while (_uint != 0) {
            uint remainder = _uint % 10;
            _uint = _uint / 10;
            str = strConcat(toStr(remainder),str);
        }
 
    }

    function mintNFT(address _recipient) public returns(uint _mintTokenId){
        _tokenId.increment();
        uint newTokenId = _tokenId.current();
        _mint(_recipient, newTokenId);
        emit Log("mint token");
        string memory _tokenUrl = uintToString(newTokenId);
        emit Log("get url: ");
        emit Log(_tokenUrl);
        _setTokenURI(newTokenId, _tokenUrl);
        emit Log("set url: ");
        studentNFT[_recipient] = _tokenUrl;
        return newTokenId;
    }

    function getNft(address student) view public returns (string memory) {
        return studentNFT[student];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}