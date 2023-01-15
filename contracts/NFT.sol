//SPDX-License-Identifier: ISC
pragma solidity 0.8.17;


// Inherited
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol';
import './interfaces/INFT.sol';

/**
 * @title NFT
 * @author MetaDefender
 * @dev An ERC721 token which represents a policy.
 * It is minted when users buy the cover.
 */
contract NFT is INFT, ERC721Pausable {

    /// @dev The minimum amount of the coverage one can buy.
    uint256 internal nextId;

    /**
     * @param _name Token collection name
     * @param _symbol Token collection symbol
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    /**
     * @dev Mints a new NFT and transfers it to `to`.
     */
    function mint(address to) external override {
        uint256 nftId= nextId++;
        _mint(to, nftId);
        emit NewNFTMinted(to, nftId);
    }

    function pause() public {
        _pause();
    }

    function unpause() public {
        _unpause();
    }

    /**
     * @notice Burns the NFT.
     *
     * @param spender The account which is performing the burn.
     * @param nftId The id of the NFT.
     */
    function burn(
        address spender,
        uint256 nftId
    ) external override {
        require(
            _isApprovedOrOwner(spender, nftId),
            'attempted to burn nonexistent certificate, or not owner'
        );
        _burn(nftId);
        emit NFTBurned(spender, nftId);
    }


    // events
    event NewNFTMinted(address to, uint256 nftId);
    event NFTBurned(address spender, uint256 nftId);
}
