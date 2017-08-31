var StateMachine = artifacts.require("./StateMachine.sol");
var LibraryDLL = artifacts.require("./LibraryDLL.sol");
var TestStateMachine = artifacts.require("./TestStateMachine.sol");

module.exports = function(deployer) {
  deployer.deploy(LibraryDLL);
  deployer.link(LibraryDLL, StateMachine);
  deployer.link(LibraryDLL, TestStateMachine);
  deployer.deploy(StateMachine);
  deployer.link(StateMachine, TestStateMachine);
  deployer.deploy(TestStateMachine);
};
