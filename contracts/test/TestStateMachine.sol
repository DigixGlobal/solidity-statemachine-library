pragma solidity ^0.4.16;

import '../lib/StateMachine.sol';
import "@digix/solidity-collections/contracts/lib/DoublyLinkedList.sol";

contract TestStateMachine {
  using DoublyLinkedList for DoublyLinkedList.Bytes;
  using StateMachine for StateMachine.System;
  StateMachine.System testSystem;

  // in this system there are:
  //     - 1 address, with role 50, which is granted access for 0->1 and 100->110
  //     - 2 states: 100 and 110
  //     - 2 items that is currently in state 100
  //     -
  function setup_system_for_testing () {
    delete testSystem;
    testSystem.init();
    
    testSystem.state_ids_to_name[100] = 'name_of_state_id_100';
    testSystem.state_ids_to_name[110] = 'name_of_state_id_110';
    testSystem.role_ids_to_name[50] = 'name_of_role_id_50';
    address testAddress = 0xe76aC07465f353FF8De7C8450C39E936c85FA283;
    testSystem.to_role[testAddress] = 50;
    testSystem.access_control[50][0][1] = true;
    testSystem.access_control[50][100][110] = true;
    testSystem.lists_by_state[100].append('test_item_name');
    testSystem.lists_by_state[100].append('test_item_name_2');
    testSystem.global_list.append('test_item_name');
    testSystem.global_list.append('test_item_name_2');

    testSystem.items['test_item_name'] = StateMachine.Item(100);
    testSystem.items['test_item_name_2'] = StateMachine.Item(100);

  }

  function test_mock_get_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _access)
  {
    _access = testSystem.access_control[_by_role][_from_state][_to_state];
  }

  function test_mock_get_lists_by_states_latest_item (uint256 _state_id)
           returns (bytes32 _item)
  {
    uint256 lists_by_states1_length = testSystem.lists_by_state[_state_id].data.collection.length;
    _item = testSystem.lists_by_state[_state_id].get(lists_by_states1_length);
  }

  function test_mock_check_item_exists_in_list_by_states (uint256 _state_id, bytes32 _item)
           returns (bool _exist)
  {
    _exist = testSystem.lists_by_state[_state_id].find(_item) != 0;
  }

  function test_mock_check_list_by_states_length (uint256 _state_id)
           returns (uint256 _length)
  {
    _length = testSystem.lists_by_state[_state_id].data.collection.length;
  }

  function test_mock_check_item_exists_in_global_list (bytes32 _item)
           returns (bool _exist)
  {
    _exist = testSystem.global_list.find(_item) != 0;
  }

  function test_mock_get_item_state(bytes32 _item)
           returns (uint256 _state)
  {
    _state = testSystem.items[_item].state;
  }

  function test_mock_get_state_name(uint256 _state_id)
           returns (bytes32 _state_name)
  {
    _state_name = testSystem.state_ids_to_name[_state_id];
  }

  function test_mock_get_role_name(uint256 _role_id)
           returns (bytes32 _role_name)
  {
    _role_name = testSystem.role_ids_to_name[_role_id];
  }

  // From here will be the wrapper function to test the StateMachine's methods

  function test_set_state_name(uint256 _state_id, bytes32 _state_name)
           returns (bool _success)
  {
    _success = testSystem.set_state_name(_state_id, _state_name);
  }

  function test_get_state_name(uint256 _state_id)
           returns (bytes32 _state_name)
  {
    _state_name = testSystem.get_state_name(_state_id);
  }

  function test_get_item_state_id(bytes32 _item)
           returns (uint256 _state_id)
  {
    _state_id = testSystem.get_item_state_id(_item);
  }

  function test_get_item_state_name(bytes32 _item)
           returns (bytes32 _state_name)
  {
    _state_name = testSystem.get_item_state_name(_item);
  }

  function test_set_role_name(uint256 _role_id, bytes32 _role_name)
           returns (bool _success)
  {
    _success = testSystem.set_role_name(_role_id, _role_name);
  }

  function test_get_role_name(uint256 _role_id)
           returns (bytes32 _role_name)
  {
    _role_name = testSystem.get_role_name(_role_id);
  }

  function test_get_entity_role_id(address _entity)
           returns (uint256 _role_id)
  {
    _role_id = testSystem.get_entity_role_id(_entity);
  }

  function test_set_role(address _entity, uint256 _role_id)
           returns (bool _success)
  {
    _success = testSystem.set_role(_entity, _role_id);
  }

  function test_unset_role(address _entity)
           returns (bool _success)
  {
    _success = testSystem.unset_role(_entity);
  }

  function test_grant_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _success)
  {
    _success = testSystem.grant_access(_by_role, _from_state, _to_state);
  }

  function test_revoke_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _success)
  {
    _success = testSystem.revoke_access(_by_role, _from_state, _to_state);
  }

  function test_create_item(uint256 _by_role)
           returns (bool _success, bytes32 _item)
  {
    (_success, _item ) = testSystem.create_item(_by_role);
  }

  function test_change_item_state(uint256 _by_role, bytes32 _item, uint256 _to_state)
           returns (bool _success, uint256 _from_state, uint256 _new_state)
  {
    (_success, _from_state, _new_state) = testSystem.change_item_state(_by_role, _item, _to_state);
  }

  function test_total_in_state(uint256 _state_id)
           returns (uint256 _total_count)
  {
    _total_count = testSystem.total_in_state(_state_id);
  }

  function test_total()
           returns (uint256 _global_count)
  {
    _global_count = testSystem.total();
  }

  function test_get_first_in_global()
           returns (bytes32 _item)
  {
    _item = testSystem.get_first_in_global();
  }

  function test_get_last_in_global()
           returns (bytes32 _item)
  {
    _item = testSystem.get_last_in_global();
  }

  function test_get_next_from_in_global(bytes32 _input_item)
           returns (bytes32 _item)
  {
    _item = testSystem.get_next_from_in_global(_input_item);
  }

  function test_get_previous_from_in_global(bytes32 _input_item)
           returns (bytes32 _item)
  {
    _item = testSystem.get_previous_from_in_global(_input_item);
  }


  function test_get_first_in_state(uint256 _state_id)
           returns (bytes32 _item)
  {
    _item = testSystem.get_first_in_state(_state_id);
  }

  function test_get_last_in_state(uint256 _state_id)
           returns (bytes32 _item)
  {
    _item = testSystem.get_last_in_state(_state_id);
  }

  function test_get_next_from_in_state(uint256 _state_id, bytes32 _input_item)
           returns (bytes32 _item)
  {
    _item = testSystem.get_next_from_in_state(_state_id, _input_item);
  }

  function test_get_previous_from_in_state(uint256 _state_id, bytes32 _input_item)
           returns (bytes32 _item)
  {
    _item = testSystem.get_previous_from_in_state(_state_id, _input_item);
  }

  function test_check_role_access(uint256 _role_id, uint256 _from_state, uint256 _to_state)
           returns (bool _yes)
  {
    _yes = testSystem.check_role_access(_role_id, _from_state, _to_state);
  }
}
