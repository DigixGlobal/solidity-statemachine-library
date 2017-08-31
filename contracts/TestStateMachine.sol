pragma solidity ^0.4.14;

import './lib/StateMachine.sol';
import "@digix/solidity-collections/contracts/lib/LibraryDLL.sol";

contract TestStateMachine {
  using LibraryDLL for LibraryDLL.BytesDLL;
  StateMachine.System testSystem;

  // in this system there are:
  //     - 1 address, with role 50, which is granted access for 0->1 and 100->110
  //     - 2 states: 100 and 110
  //     - 1 item that is currently in state 100
  function setup_system_for_testing () {
    delete testSystem;
    testSystem.state_ids_to_name[100] = 'name_of_state_id_100';
    testSystem.state_ids_to_name[110] = 'name_of_state_id_110';
    testSystem.role_ids_to_name[50] = 'name_of_role_id_50';
    address testAddress = 0x1cd24e853af2027df542551f393b1bd0db2f1a03;
    testSystem.to_role[testAddress] = 50;
    testSystem.access_control[50][0][1] = true;
    testSystem.access_control[50][100][110] = true;
    testSystem.lists_by_state[100].append('test_item_name');
    testSystem.global_list.append('test_item_name');
    testSystem.items['test_item_name'] = StateMachine.Item(100);
  }

  function test_mock_get_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _access)
  {
    _access = testSystem.access_control[_by_role][_from_state][_to_state];
  }

  function test_mock_get_global_list_latest_item ()
           returns (bytes32 _item)
  {
    uint256 global_list_length = testSystem.global_list.data.collection.length;
    _item = testSystem.global_list.get(global_list_length);
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



  function test_set_state_name(uint256 _state_id, bytes32 _state_name)
           returns (bool _success)
  {
    _success = StateMachine.set_state_name(testSystem, _state_id, _state_name);
  }

  function test_get_state_name(uint256 _state_id)
           returns (bytes32 _state_name)
  {
    _state_name = StateMachine.get_state_name(testSystem, _state_id);
  }

  function test_get_item_state_id(bytes32 _item)
           returns (uint256 _state_id)
  {
    _state_id = StateMachine.get_item_state_id(testSystem, _item);
  }

  function test_get_item_state_name(bytes32 _item)
           returns (bytes32 _state_name)
  {
    _state_name = StateMachine.get_item_state_name(testSystem, _item);
  }

  function test_set_role_name(uint256 _role_id, bytes32 _role_name)
           returns (bool _success)
  {
    _success = StateMachine.set_role_name(testSystem, _role_id, _role_name);
  }

  function test_get_role_name(uint256 _role_id)
           returns (bytes32 _role_name)
  {
    _role_name = StateMachine.get_role_name(testSystem, _role_id);
  }

  function test_get_entity_role_id(address _entity)
           returns (uint256 _role_id)
  {
    _role_id = StateMachine.get_entity_role_id(testSystem, _entity);
  }

  function test_set_role(address _entity, uint256 _role_id)
           returns (bool _success)
  {
    _success = StateMachine.set_role(testSystem, _entity, _role_id);
  }

  function test_unset_role(address _entity, uint256 _role_id)
           returns (bool _success)
  {
    _success = StateMachine.unset_role(testSystem, _entity, _role_id);
  }

  function test_grant_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _success)
  {
    _success = StateMachine.grant_access(testSystem, _by_role, _from_state, _to_state);
  }

  function test_revoke_access(uint256 _by_role, uint256 _from_state, uint256 _to_state)
           returns (bool _success)
  {
    _success = StateMachine.revoke_access(testSystem, _by_role, _from_state, _to_state);
  }

  function test_create_item(uint256 _by_role)
           returns (bool _success, bytes32 _item)
  {
    (_success, _item ) = StateMachine.create_item(testSystem, _by_role);
  }

  function test_change_item_state(uint256 _by_role, bytes32 _item, uint256 _to_state)
           returns (bool _success, uint256 _from_state, uint256 _new_state)
  {
    (_success, _from_state, _new_state) = StateMachine.change_item_state(testSystem, _by_role, _item, _to_state);
  }
}
