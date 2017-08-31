const a = require('awaiting');

const bN = web3.toBigNumber;
const TestStateMachine = artifacts.require('./TestStateMachine.sol');

// web3.toAscii results in some padding \u0000 at the end,
// this function fixes this problem
// link to issue: https://github.com/ethereum/web3.js/issues/337
const myToAscii = function (input) { return web3.toAscii(input).replace(/\u0000/g, '') };
const testAddress = '0x1cd24e853af2027df542551f393b1bd0db2f1a03';
const moreTestAddresses = [
  '0x817229b2d1cb37bf23b20185d59aff8595e52401',
  '0x249b1bf054d2b2643a0e38948aa92ccb6c2ccd7e',
  '0x54e3872db39fc3a1fa018688bff59dd6409b0a23',
  '0x4db089d50f72996895dc4224c8c6fae0f104bc1d',
  '0x74cd5f20ee949189bdc83f7f6088063eb7fdcc86',
  '0xa1fada6e4f11770a672ca678d6290b311f53c256',
];
contract('StateMachine', function (addresses) {
  let testStateMachine;

  before(async function () {
    testStateMachine = await TestStateMachine.new();
  });

  describe('set_state_name', function () {
    it('successfully set state name, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_set_state_name.call(bN(123), 'name_of_state_id_123'), true);
      await testStateMachine.test_set_state_name(bN(123), 'name_of_state_id_123');
      assert.deepEqual(myToAscii(await testStateMachine.test_mock_get_state_name.call(bN(123))), 'name_of_state_id_123');
    })
  });

  describe('get_state_name', function () {
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
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
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
    it('[item exists] returns correct state id', async function () {
      assert.deepEqual(await testStateMachine.test_get_item_state_id.call('test_item_name'), bN(100));
    });
    it('[item doesnt exists] returns 0', async function () {
      assert.deepEqual(await testStateMachine.test_get_item_state_id.call('test_item_name_new'), bN(0));
    });
  });

  describe('get_item_state_name', function () {
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
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
    })
  });

  describe('get_role_name', function () {
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
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
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
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
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
    it('[entity already has some role] successfully unset role, returns true', async function () {
      assert.deepEqual(await testStateMachine.test_unset_role.call(testAddress, bN(888)), true);
      await testStateMachine.test_unset_role(testAddress, bN(888));
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(testAddress), bN(0));
    });
    it('[entity has not been set any role] doesnt do anything, returns false', async function () {
      assert.deepEqual(await testStateMachine.test_unset_role.call(moreTestAddresses[0], bN(888)), false);
      await testStateMachine.test_unset_role(moreTestAddresses[0], bN(888));
      assert.deepEqual(await testStateMachine.test_get_entity_role_id.call(moreTestAddresses[0]), bN(0));
    });
  });

  describe('grant_access', function () {
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });

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
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
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
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
    it('[role has access for 0=>1] successfully creates item, returns true and item name; item assigned state 1; item is added to global_list and lists_by_state[1]', async function () {
      const result = await testStateMachine.test_create_item.call(bN(50));
      assert.deepEqual(result[0], true);
      await testStateMachine.test_create_item(bN(50));
      assert.deepEqual(await testStateMachine.test_mock_get_global_list_latest_item.call(), result[1]);
      assert.deepEqual(await testStateMachine.test_mock_get_lists_by_states_latest_item.call(bN(1)), result[1]);
    });
    it('[role doesnt have access for 0=>1] doesnt do anything, returns (false, empty bytes32)', async function () {
      const result = await testStateMachine.test_create_item.call(bN(51));
      assert.deepEqual(result[0], false);
      assert.deepEqual(myToAscii(result[1]), '');
    });
  });

  describe('change_item_state', function () {
    before(async function () {
      await testStateMachine.setup_system_for_testing();
    });
    it('[role has access to change state] successfully changes state, returns (true, from_state, new_state)', async function () {
      const result = await testStateMachine.test_change_item_state.call(bN(50), 'test_item_name', bN(120));
      assert.deepEqual(result[0], true);
      assert.deepEqual(result[1], bN(100));
      assert.deepEqual(result[2], bN(120));
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(120));
      // assert.deepEqual(await testStateMachine.test_mock_get_global_list_latest_item.call(), result[1]);
      // assert.deepEqual(await testStateMachine.test_mock_get_lists_by_states1_latest_item.call(), result[1]);
    });
    it('[role has access to change state] item is assigned new state, is removed from lists_by_state[old_state] and added to lists_by_state[new_state]', async function () {
      await testStateMachine.setup_system_for_testing();
      await testStateMachine.test_change_item_state(bN(50), 'test_item_name', bN(120));
      assert.deepEqual(await testStateMachine.test_mock_get_lists_by_states_latest_item.call(bN(120)), 'test_item_name');
      assert.deepEqual(await testStateMachine.test_mock_check_item_exists_in_list_by_states.call(bN(100), 'test_item_name'), false);
    });
  });


});
