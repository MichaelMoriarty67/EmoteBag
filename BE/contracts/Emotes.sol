// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Emotes is ERC721URIStorage {

    uint256 counter = 0;
    mapping (uint256 => string) public _tokenURIs;

    constructor() ERC721 ("EmoteBag", "EMTS") {
        console.log("Constructor be working -- u deploying your contract.");
    }
    
    event emoteTransfer(
        address to,
        uint256 tokenId,
        string ipfsHash
    );

    function _setTknURI(uint256 _tokenId, string memory _uriString) private {
        require(_tokenId <= counter);
        _tokenURIs[_tokenId] = _uriString;
    }

    function getTotalEmotesMinted() public view returns (uint256) {
        console.log("So far %d emotes have been minted!", counter);
        return counter;
    }


    function uploadEmote(string memory _ipfsHash) public returns (uint256){
        uint256 tokenId = counter;

        _safeMint(msg.sender, tokenId);
        _setTknURI(tokenId, _ipfsHash);

        emit emoteTransfer(msg.sender, tokenId, _ipfsHash);

        counter++;

        return tokenId;
    }

}