const StateMachine = artifacts.require('./StateMachine.sol');
const LibraryDLL = artifacts.require('./LibraryDLL.sol');
const TestStateMachine = artifacts.require('./TestStateMachine.sol');

module.exports = function (deployer) {
  deployer.deploy(LibraryDLL);
  deployer.link(LibraryDLL, StateMachine);
  deployer.link(LibraryDLL, TestStateMachine);
  deployer.deploy(StateMachine);
  deployer.link(StateMachine, TestStateMachine);
  deployer.deploy(TestStateMachine);
};
