pragma solidity 0.8.17;

interface INFT{
    function mint(address to) external;

    function burn(address spender, uint256 nftId) external;

}




