const StateMachine = artifacts.require('./StateMachine.sol');
const DoublyLinkedList = artifacts.require('./DoublyLinkedList.sol');
const TestStateMachine = artifacts.require('./TestStateMachine.sol');

module.exports = function (deployer) {
  deployer.deploy(DoublyLinkedList);
  deployer.link(DoublyLinkedList, StateMachine);
  deployer.link(DoublyLinkedList, TestStateMachine);
  deployer.deploy(StateMachine);
  deployer.link(StateMachine, TestStateMachine);
  deployer.deploy(TestStateMachine);
};
