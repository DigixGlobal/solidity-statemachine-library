# Digix Solidity State Machine Library

A Solidity library for implementing role based state machine.

## Example Initialization

```
  using StateMachine for StateMachine.System  

  StateMachine.System state_machine;

  function AssetsStorage(address _resolver)
  {
    require(init("s:poa", _resolver));
    // roles
    state_machine.set_role_name(1, "vendor");
    state_machine.set_role_name(2, "xferauth");
    state_machine.set_role_name(3, "poaadmin");
    state_machine.set_role_name(4, "custodian");
    state_machine.set_role_name(5, "auditor");
    state_machine.set_role_name(6, "recaster");
    // state names
    state_machine.set_state_name(1, "vendor_order");
    state_machine.set_state_name(2, "transfer");
    state_machine.set_state_name(3, "custodian_delivery");
    state_machine.set_state_name(4, "minted");
    state_machine.set_state_name(5, "audit_failure");
    state_machine.set_state_name(6, "replacement_delivery");
    state_machine.set_state_name(7, "recasted");
    state_machine.set_state_name(8, "redeemed");

    // Define allowed role based state transitions

    // vendor create vendor_order
    state_machine.grant_access(1, 0, 1);
    // vendor vendor_order to custodian_delivery
    state_machine.grant_access(1, 1, 3);
    // xferauth create transfer
    state_machine.grant_access(2, 0, 2);
    // xferauth transfer to custodian_delivery
    state_machine.grant_access(2, 2, 3);
    // custodian custodian_delivery to minted
    state_machine.grant_access(4, 3, 4);
    // auditor minted to audit_failure
    state_machine.grant_access(5, 4, 5);
    // poaadmin audit_failure to replacement_delivery
    state_machine.grant_access(3, 5, 6);
    // custodian replacement_delivery to minted
    state_machine.grant_access(4, 6, 4);
    // recaster minted to recasted
    state_machine.grant_access(6, 4, 7);
    // poaadmin recasted to redeemed
    state_machine.grant_access(3, 7, 8);
    system.initialized = false;
  }
```

## Setting roles

```
state_machine.set_role(1,	0xb794f5ea0ba39494ce839613fffba7427957926);
```

# Examples

See tests
