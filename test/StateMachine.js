const { bN, myToAscii, testAddress, moreTestAddresses } = require('./testHelpers');

const TestStateMachine = artifacts.require('./TestStateMachine.sol');

contract('StateMachine', function (addresses) {
  let testStateMachine;

  const resetDataBeforeTest = async function () {
    testStateMachine = await TestStateMachine.new();
    await testStateMachine.setup_system_for_testing();
  };

  before(resetDataBeforeTest);

  describe('set_state_name', function () {
    it('successfully set state name, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_set_state_name.call(bN(123), 'name_of_state_id_123'), true);
      await testStateMachine.test_set_state_name(bN(123), 'name_of_state_id_123');
      assert.deepEqual(myToAscii(await testStateMachine.test_mock_get_state_name.call(bN(123))), 'name_of_state_id_123');
    });
  });

  describe('get_state_name', function () {
    before(resetDataBeforeTest);
    it('[state_id = 0] returns "none"', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_state_name.call(bN(0))), 'none');
    });
    it('[state_id already has name] returns correct name', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_state_name.call(bN(100))), 'name_of_state_id_100');
    });
    it('[state_id has no name yet] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_state_name.call(bN(999))), '');
    });
  });

  describe('get_item_state_id', function () {
    before(resetDataBeforeTest);
    it('[item exists] returns correct state id', async function () {
      assert.deepEqual(await testStateMachine.test_get_item_state_id.call('test_item_name'), bN(100));
    });
    it('[item doesnt exists] returns 0', async function () {
      assert.deepEqual(await testStateMachine.test_get_item_state_id.call('test_item_name_new'), bN(0));
    });
  });

  describe('get_item_state_name', function () {
    before(resetDataBeforeTest);
    it('[item exists] returns correct name', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_item_state_name.call('test_item_name')), 'name_of_state_id_100');
    });
    it('[item doesnt exists] returns "none"', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_item_state_name.call('test_item_name_new')), 'none');
    });
  });

  describe('set_role_name', function () {
    it('successfully set role name, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_set_role_name.call(bN(111), 'name_of_role_id_111'), true);
      await testStateMachine.test_set_role_name(bN(111), 'name_of_role_id_111');
      assert.deepEqual(myToAscii(await testStateMachine.test_mock_get_role_name.call(bN(111))), 'name_of_role_id_111');
    });
  });

  describe('get_role_name', function () {
    before(resetDataBeforeTest);
    it('[role_id = 0] returns "none"', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_role_name.call(bN(0))), 'none');
    });
    it('[role_id already has name] returns correct name', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_role_name.call(bN(50))), 'name_of_role_id_50');
    });
    it('[role_id has no name yet] returns empty bytes32 ""', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_role_name.call(bN(999))), '');
    });
  });

  describe('get_entity_role_id', function () {
    before(resetDataBeforeTest);
    it('[entity was assigned role] returns correct role', async function () {
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(testAddress), bN(50));
    });
    it('[entity was not assigned role] returns 0', async function () {
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(addresses[0]), bN(0));
    });
  });

  describe('set_role', function () {
    it('successfully set role to address, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_set_role.call(addresses[0], bN(49)), true);
      await testStateMachine.test_set_role(addresses[0], bN(49));
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(addresses[0]), bN(49));
    });
  });

  describe('unset_role', function () {
    before(resetDataBeforeTest);
    it('[entity already has some role] successfully unset role, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_unset_role.call(testAddress), true);
      await testStateMachine.test_unset_role(testAddress);
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(testAddress), bN(0));
    });
    it('[entity has not been set any role] doesnt do anything, returns false', async function () {
      assert.deepEqual(await testStateMachine.test_unset_role.call(moreTestAddresses[0]), false);
      await testStateMachine.test_unset_role(moreTestAddresses[0]);
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(moreTestAddresses[0]), bN(0));
    });
  });

  describe('grant_access', function () {
    before(resetDataBeforeTest);

    it('[access was not granted before] successfully grant access, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_grant_access.call(bN(10), bN(20), bN(21)), true);
      await testStateMachine.test_grant_access(bN(10), bN(20), bN(21));
      assert.deepEqual(await testStateMachine.test_mock_get_access.call(bN(10), bN(20), bN(21)), true);
    });
    it('[access was granted before] doesnt do anything, returns false', async function () {
      assert.deepEqual(await testStateMachine.test_grant_access.call(bN(50), bN(0), bN(1)), false);
      await testStateMachine.test_grant_access(bN(50), bN(0), bN(1));
      assert.deepEqual(await testStateMachine.test_mock_get_access.call(bN(50), bN(0), bN(1)), true);
    });
  });

  describe('revoke_access', function () {
    before(resetDataBeforeTest);
    it('[access was granted before] successfully revoke access, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_revoke_access.call(bN(50), bN(0), bN(1)), true);
      await testStateMachine.test_revoke_access(bN(50), bN(0), bN(1));
      assert.deepEqual(await testStateMachine.test_mock_get_access.call(bN(50), bN(0), bN(1)), false);
    });
    it('[access was not granted before] doesnt do anything, returns false', async function () {
      assert.deepEqual(await testStateMachine.test_revoke_access.call(bN(50), bN(1), bN(2)), false);
      await testStateMachine.test_revoke_access(bN(50), bN(1), bN(2));
      assert.deepEqual(await testStateMachine.test_mock_get_access.call(bN(50), bN(1), bN(2)), false);
    });
  });

  describe('create_item', function () {
    before(resetDataBeforeTest);
    it('[role has access for 0=>1] successfully creates item, returns true and item name; item assigned state 1; item is added to global_list and lists_by_state[1]', async function () {
      const result = await testStateMachine.test_create_item.call(bN(50));
      assert.deepEqual(result[0], true);
      await testStateMachine.test_create_item(bN(50));
      assert.deepEqual(await testStateMachine.test_mock_check_item_exists_in_global_list.call(result[1]), true);
      assert.deepEqual(await testStateMachine.test_mock_check_item_exists_in_list_by_states.call(bN(1), result[1]), true);
    });
    it('[role doesnt have access for 0=>1] doesnt do anything, returns (false, empty bytes32)', async function () {
      const result = await testStateMachine.test_create_item.call(bN(51));
      assert.deepEqual(result[0], false);
      assert.deepEqual(myToAscii(result[1]), '');
    });
  });

  describe('change_item_state', function () {
    beforeEach(resetDataBeforeTest);
    it('[role has access to change state] successfully changes state, returns (true, from_state, new_state)', async function () {
      const result = await testStateMachine.test_change_item_state.call(bN(50), 'test_item_name', bN(110));
      assert.deepEqual(result[0], true);
      assert.deepEqual(result[1], bN(100));
      assert.deepEqual(result[2], bN(110));
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(110));
    });
    it('[role has access to change state] item is removed from lists_by_state[old_state]', async function () {
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(110));
      assert.deepEqual(await testStateMachine.test_mock_check_item_exists_in_list_by_states.call(bN(100), 'test_item_name'), false);
    });
    it('[role has access to change state] item is added to lists_by_state[new_state]', async function () {
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(110));
      assert.deepEqual(await testStateMachine.test_mock_check_item_exists_in_list_by_states.call(bN(110), 'test_item_name'), true);
    });
    it('[role has access to change state] item\'s state is updated to new_state', async function () {
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(110));
      assert.deepEqual(await testStateMachine.test_mock_get_item_state.call('test_item_name'), bN(110));
    });
  });

  describe('total_in_state', function () {
    beforeEach(resetDataBeforeTest);
    it('returns correct total number of items in a state', async function () {
      assert.deepEqual(await testStateMachine.test_total_in_state.call(bN(100)), bN(2));
      assert.deepEqual(await testStateMachine.test_total_in_state.call(bN(670)), bN(0));
    });
  });

  describe('total', function () {
    beforeEach(resetDataBeforeTest);
    it('[there are some items] returns correct total number of items', async function () {
      assert.deepEqual(await testStateMachine.test_total.call(), bN(2));
    });
    it('[there are no items] returns 0', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(await testStateMachine.test_total.call(), bN(0));
    });
  });

  describe('get_first_in_global', function () {
    beforeEach(resetDataBeforeTest);
    it('[there are some items] returns correct first item in global_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_first_in_global.call()), 'test_item_name');
    });
    it('[there are no items] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_first_in_global.call()), '');
    });
  });

  describe('get_last_in_global', function () {
    beforeEach(resetDataBeforeTest);
    it('[there are some items] returns correct last item in global_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_last_in_global.call()), 'test_item_name_2');
    });
    it('[there are no items] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_last_in_global.call()), '');
    });
  });

  describe('get_next_from_in_global', function () {
    beforeEach(resetDataBeforeTest);
    it('[item is not last] returns correct next item in global_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_next_from_in_global.call('test_item_name')), 'test_item_name_2');
    });
    it('[item is last] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_next_from_in_global.call('test_item_name_2')), '');
    });
  });

  describe('get_previous_from_in_global', function () {
    beforeEach(resetDataBeforeTest);
    it('[item is not first] returns correct previous item in global_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_previous_from_in_global.call('test_item_name_2')), 'test_item_name');
    });
    it('[item is first] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_previous_from_in_global.call('test_item_name')), '');
    });
  });

  describe('get_first_in_state', function () {
    beforeEach(resetDataBeforeTest);
    it('[there are some items] returns correct first item in state_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_first_in_state.call(bN(100))), 'test_item_name');
    });
    it('[there are no items] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_first_in_state.call(bN(100))), '');
    });
  });

  describe('get_last_in_state', function () {
    beforeEach(resetDataBeforeTest);
    it('[there are some items] returns correct last item in state_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_last_in_state.call(bN(100))), 'test_item_name_2');
    });
    it('[there are no items] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_last_in_state.call(bN(100))), '');
    });
  });

  describe('get_next_from_in_state', function () {
    beforeEach(resetDataBeforeTest);
    it('[item is not last] returns correct next item in state_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_next_from_in_state.call(bN(100), 'test_item_name')), 'test_item_name_2');
    });
    it('[item is last] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_next_from_in_state.call(bN(100), 'test_item_name_2')), '');
    });
  });

  describe('get_previous_from_in_state', function () {
    beforeEach(resetDataBeforeTest);
    it('[item is not first] returns correct previous item in state_list', async function () {
      assert.deepEqual(myToAscii(await testStateMachine.test_get_previous_from_in_state.call(bN(100), 'test_item_name_2')), 'test_item_name');
    });
    it('[item is first] returns empty bytes32 ""', async function () {
      testStateMachine = await TestStateMachine.new();
      assert.deepEqual(myToAscii(await testStateMachine.test_get_previous_from_in_state.call(bN(100), 'test_item_name')), '');
    });
  });

  describe('check_role_access', function () {
    beforeEach(resetDataBeforeTest);
    it('[role has access] returns true', async function () {
      assert.deepEqual(await testStateMachine.test_check_role_access.call(bN(50), bN(100), bN(110)), true);
    });
    it('[role doesnt have access] returns false', async function () {
      assert.deepEqual(await testStateMachine.test_check_role_access.call(bN(50), bN(100), bN(120)), false);
    });
    it('[role is not registered, has no permission] returns false', async function () {
      assert.deepEqual(await testStateMachine.test_check_role_access.call(bN(900), bN(0), bN(1)), false);
    });
  });
});
