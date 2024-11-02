var myContract = artifacts.require("Library");

module.exports = function(deployer){
  deployer.deploy(myContract);
}