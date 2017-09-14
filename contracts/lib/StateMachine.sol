pragma solidity ^0.4.16;

import "@digix/solidity-collections/contracts/lib/DoublyLinkedList.sol";

library StateMachine {

  using DoublyLinkedList for DoublyLinkedList.Bytes;

  struct System {
    mapping(bytes32 => Item) items;
    mapping(address => uint256) to_role;
    mapping(uint256 => mapping (uint256 => mapping(uint256 => bool))) access_control;
    mapping(uint256 => DoublyLinkedList.Bytes) lists_by_state;
    mapping(uint256 => bytes32) state_ids_to_name;
    mapping(uint256 => bytes32) role_ids_to_name;
    DoublyLinkedList.Bytes global_list;
  }

  struct Item {
    uint256 state;
  }

  function set_state_name(System storage _system, uint256 _state_id, bytes32 _state_name)
           internal
           returns (bool _success)
  {
    _system.state_ids_to_name[_state_id] = _state_name;
    _success = true;
  }

  function get_state_name(System storage _system, uint256 _state_id)
           internal
           returns (bytes32 _state_name)
  {
    if (_state_id == 0) {
      _state_name = bytes32("none");
    } else {
      _state_name = _system.state_ids_to_name[_state_id];
    }
  }

  function get_item_state_id(System storage _system, bytes32 _item)
           internal
           returns (uint256 _state_id)
  {
    _state_id = _system.items[_item].state;
  }

  function get_item_state_name(System storage _system, bytes32 _item)
           internal
           returns (bytes32 _state_name)
  {
    _state_name = get_state_name(_system, get_item_state_id(_system, _item));
  }

  function set_role_name(System storage _system, uint256 _role_id, bytes32 _role_name)
           internal
           returns (bool _success)
  {
    _system.role_ids_to_name[_role_id] = _role_name;
    _success = true;
  }

  function get_role_name(System storage _system, uint256 _role_id)
           internal
           returns (bytes32 _role_name)
  {
    if (_role_id == 0) {
      _role_name = bytes32("none");
    } else {
      _role_name = _system.role_ids_to_name[_role_id];
    }
  }

  function get_entity_role_id(System storage _system, address _entity)
           internal
           returns (uint256 _role_id)
  {
    _role_id = _system.to_role[_entity];
  }

  function set_role(System storage _system, address _entity, uint256 _role_id)
           internal
           returns (bool _success)
  {
    _system.to_role[_entity] = _role_id;
    _success = true;
  }

  function unset_role(System storage _system, address _entity)
           internal
           returns (bool _success)
  {
    if (_system.to_role[_entity] == 0) {
      _success = false;
    } else {
      delete _system.to_role[_entity];
      _success = true;
    }
  }

  function grant_access(System storage _system, uint256 _by_role, uint256 _from_state, uint256 _to_state)
           internal
           returns (bool _success)
  {
    if (_system.access_control[_by_role][_from_state][_to_state] == false) {
      _system.access_control[_by_role][_from_state][_to_state] = true;
      _success = true;
    } else {
      _success = false;
    }
  }

  function revoke_access(System storage _system, uint256 _by_role, uint256 _from_state, uint256 _to_state)
           internal
           returns (bool _success)
  {
    if(_system.access_control[_by_role][_from_state][_to_state] == true) {
      _system.access_control[_by_role][_from_state][_to_state] = false;
      _success = true;
    } else {
      _success = false;
    }
  }

  function create_item(System storage _system, uint256 _by_role)
           internal
           returns (bool _success, bytes32 _item)
  {
    if (_system.access_control[_by_role][0][1] == true) {
      address _item_tmp;
      assembly {
        _item_tmp := create(0,0,0)
      }
      _item = bytes32(_item_tmp);
      _system.items[_item].state = 1;
      require(_system.global_list.append(_item));
      require(_system.lists_by_state[1].append(_item));
      _success = true;
    } else {
      _success = false;
      _item = bytes32(0x0);
    }
  }

  function change_item_state(System storage _system, uint256 _by_role, bytes32 _item, uint256 _to_state)
           internal
           returns (bool _success, uint256 _from_state, uint256 _new_state)
  {
    _from_state = _system.items[_item].state;
    bool _append_success;
    bool _remove_success;
    if (_system.access_control[_by_role][_from_state][_to_state] == true) {
      _system.items[_item].state = _to_state;
      _append_success = _system.lists_by_state[_to_state].append(_item);
      _remove_success = _system.lists_by_state[_from_state].remove_item(_item);
      _new_state = _system.items[_item].state;
      _success = (_append_success == _remove_success);
    } else {
      _new_state = _from_state;
      _success = false;
    }
  }

  function total_in_state(System storage _system, uint256 _state_id)
           public
           constant
           returns (uint256 _total_count)
  {
    _total_count = _system.lists_by_state[_state_id].total();
  }

  function total(System storage _system)
           public
           constant
           returns (uint256 _global_count)
  {
    _global_count = _system.global_list.total();
  }

  function get_first_in_global(System storage _system)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.global_list.start_item();
  }

  function get_last_in_global(System storage _system)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.global_list.end_item();
  }

  function get_next_from_in_global(System storage _system, bytes32 _current_item)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.global_list.next_item(_current_item);
  }

  function get_previous_from_in_global(System storage _system, bytes32 _current_item)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.global_list.previous_item(_current_item);
  }

  function get_first_in_state(System storage _system, uint256 _state_id)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.lists_by_state[_state_id].start_item();
  }

  function get_last_in_state(System storage _system, uint256 _state_id)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.lists_by_state[_state_id].end_item();
  }

  function get_next_from_in_state(System storage _system, uint256 _state_id, bytes32 _current_item)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.lists_by_state[_state_id].next_item(_current_item);
  }

  function get_previous_from_in_state(System storage _system, uint256 _state_id, bytes32 _current_item)
           public
           constant
           returns (bytes32 _item)
  {
    _item = _system.lists_by_state[_state_id].previous_item(_current_item);
  }

  function check_role_access(System storage _system, uint256 _role_id, uint256 _from_state, uint256 _to_state)
           public
           constant
           returns (bool _yes)
  {
    _yes = _system.access_control[_role_id][_from_state][_to_state];
  }
}
