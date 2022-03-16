var Nft = artifacts.require("./nft.sol");
var Erc = artifacts.require("./ERC721.sol");
module.exports = function(deployer) {
  deployer.deploy(Nft);
    deployer.deploy(Erc,"nft","dr");
};
