var StateMachine = artifacts.require("StateMachine.sol");
var LibraryDLL = artifacts.require("@digix/solidity-collections/contracts/lib/LibraryDLL.sol");

module.exports = function(deployer) {
  deployer.deploy(LibraryDLL)
  .then(() => {
    return deployer.link(LibraryDLL, StateMachine)
  })
  .then(() => {
    return deployer.deploy(StateMachine);
  });

};
