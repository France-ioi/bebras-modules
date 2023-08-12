const conceptBaseUrl = (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//'
    + 'static4.castor-informatique.fr/help/smart_contracts.html';

const smartPyBlocksList = {

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

    'smartpy_import': [{
        name: 'smartpy_smartpy_import',
        type: 'token',
        caption: 'def main():',
        snippet: `import smartpy as sp

@sp.module
def main():
	`
    }],


    'smart_contract': [{
        name: 'smartpy_smart_contract',
        type: 'token',
        caption: 'class ctr(sp.Contract)',
        snippet: `
    class \${1:name}(sp.Contract):
        def __init__(self):
			`,
    }],

    'self.data.value': [{
        name: 'smartpy_self_data_value',
        type: 'token',
        caption: 'self.data.value = ...',
        snippet: `self.data.\${1:valueName} = \${2:value}`
    }],

    'entry_point': [{
        name: 'smartpy_entry_point',
        type: 'token',
        caption: '@sp.entrypoint',
        snippet: `@sp.entry_point
def \${1:entrypointName}(self):
    `,
    }],

    'onchain_view': [{
        name: 'smartpy_onchain_view',
        type: 'token',
        caption: '@sp.onchain_view',
        snippet: `class \${1:contractName}(sp.Contract):
        
        @sp.onchain_view()
        def \${2:methodName}(self,...):
        `
    }],



/* Test */

        'test': [{
        name: 'smartpy_test',
        type: 'token',
        caption: '@sp.add_test',
        snippet: `@sp.add_test(name = "\${1:name of your test}")
def \${2:test_name}():
        `,
    }],

    'scenario_creation': [{
        name: 'smartpy_scenario_creation',
        type: 'token',
        caption: 'sp.test_scenario',
        snippet: `\${1:scenario_name} = sp.test_scenario(main)`,
    }],

    'contract_instantiation': [{
        name: 'smartpy_contract_instantiation',
        type: 'token',
        caption: 'c = main.ctr(...)',
        snippet: `\${1:instanceName} = main.\${2:contractName}(\${3:initialStorage})`
    }],

    'adding_to_scenario': [{
        name: 'smartpy_adding_to_scenario',
        type: 'token',
        caption: 'scenario += c',
        snippet: `\${1:scenario_name} += \${2:instanceName}`
    }],

    'test_unwrap_option': [{
        name: 'smartpy_test_unwrap_option',
        type: 'token',
        caption: 'opt.open_some()',
        snippet: `\${1:optionName}.open_some()`
    }],

    'test_account': [{
        name: 'smartpy_test_account',
        type: 'token',
        caption: 'sp.test_account(a)',
        snippet: `sp.test_account(\${1:accountName})`
    }],

    'test_address': [{
        name: 'smartpy_test_address',
        type: 'token',
        caption: 'acc.address',
        snippet: `\${1:accountName}.address`
    }],

    'public_key_hash': [{
        name: 'smartpy_public_key_hash',
        type: 'token',
        caption: 'acc.public_key_hash',
        snippet: `\${1:accountName}.public_key_hash`
    }],


    'public_key': [{
        name: 'smartpy_public_key',
        type: 'token',
        caption: 'acc.public_key',
        snippet: `\${1:accountName}.public_key`
    }],


    'secret_key': [{
        name: 'smartpy_secret_key',
        type: 'token',
        caption: 'acc.secret_key',
        snippet: `\${1:accountName}.secret_key`
    }],


    'test_some': [{
        name: 'smartpy_test_some',
        type: 'token',
        caption: 'sp.some(value)',
        snippet: `sp.some(\${1:value})`
    }],

    'scenario.verify': [{
        name: 'smartpy_scenario_verify',
        type: 'token',
        caption: 'scenario.verifiy(cond)',
        snippet: `scenario.verify(\${1:condition})`
    }],

    'scenario.verify_equal': [{
        name: 'smartpy_scenario_verify_equal',
        type: 'token',
        caption: 'scenario.verifiy_equal(a, b)',
        snippet: `scenario.verify_equal(\${1:value1}, \${2:value2})`
    }],

    'scenario.show': [{
        name: 'smartpy_scenario_show',
        type: 'token',
        caption: 'scenario.show(value)',
        snippet: `scenario.show(value)`
    }],

    'contract.data': [{
        name: 'smartpy_contract_data',
        type: 'token',
        caption: 'contract.data.value',
        snippet: `\${1:contractName}.data.\${2:value}`
    }],

    'contract.balance': [{
        name: 'smartpy_contract_balance',
        type: 'token',
        caption: 'contract.balance',
        snippet: `\${1:contractName}.balance`
    }],

    'contract.baker': [{
        name: 'smartpy_contract_baker',
        type: 'token',
        caption: 'contract.baker',
        snippet: `\${1:contractName}.baker`
    }],

    'contract.address': [{
        name: 'smartpy_contract_address',
        type: 'token',
        caption: 'contract.address',
        snippet: `\${1:contractName}.address`
    }],

    'trace': [{
        name: 'smartpy_trace',
        type: 'token',
        caption: 'trace(value)',
        snippet: `trace(\${1:value})`
    }],

    'scenario.h': [{
        name: 'smartpy_scenario_h',
        type: 'token',
        caption: 'scenario.h1',
        snippet: `scenario.h1`
    }],

    'test_none': [{
        name: 'smartpy_test_none',
        type: 'token',
        caption: 'sp.none',
        snippet: `sp.none`
    }],

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],


/*Int - Nat - Tez */

    'sp.int': [{
        name: 'smartpy_type_int',
        type: 'token',
        caption: 'sp.int(42)',
        snippet: `sp.int(\${1:42})`
    }],

    'sp.nat': [{
        name: 'smartpy_type_nat',
        type: 'token',
        caption: 'sp.nat(42)',
        snippet: `sp.nat(\${1:42})`
    }],

    'sp.to_int': [{
        name: 'smartpy_sp_to_int',
        type: 'token',
        caption: 'sp.to_int(a)',
        snippet: `sp.to_int(\${1:a})`
    }],

    'sp.is_nat': [{
        name: 'smartpy_sp_is_nat',
        type: 'token',
        caption: 'sp.is_nat(a)',
        snippet: `sp.is_nat(\${1:a})`
    }],

    'sp.as_nat': [{
        name: 'smartpy_sp_as_nat',
        type: 'token',
        caption: 'sp.as_nat(a)',
        snippet: `sp.as_nat(\${1:a})`
    }],

    'type_int': [{
        name: 'smartpy_sp_int',
        type: 'token',
        caption: 'sp.int',
        snippet: `sp.int`
    }],

    'type_nat': [{
        name: 'smartpy_sp_nat',
        type: 'token',
        caption: 'sp.nat',
        snippet: `sp.nat`
    }],

/* Types */

    'sp.cast': [{
        name: 'smartpy_sp_cast',
        type: 'token',
        caption: 'sp.cast(val, type)',
        snippet: `sp.cast(\${1:value}, \${2:type})`
    }],

    'sp.unit': [{
        name: 'smartpy_sp_unit',
        type: 'token',
        caption: 'sp.unit',
        snippet: `sp.unit`
    }],

    '()': [{
        name: 'smartpy_()',
        type: 'token',
        caption: '()',
        snippet: `()`
    }],


    'my_type': [{
        name: 'smartpy_my_type',
        type: 'token',
        caption: 'my_type:type = ...',
        snippet: `my_type:type = \${1:type_definition}`
    }],


    'convert_to_tez': [{
        name: 'smartpy_convert_to_tez',
        type: 'token',
        caption: 'sp.mul(n, sp.tez(x))',
        snippet: `sp.mul(\${1:value1}, sp.tez(1))`
    }],



/*Arithmetic*/

    'addition': [{
        name: 'smartpy_addition', 
        type: 'token',
        caption: 'a + b',
        snippet: `\${1:a} + \${2:b}`
    }],

    'sp.add': [{
        name: 'smartpy_sp_add',
        type: 'token',
        caption: 'sp.add(a, b)',
        snippet: `sp.add(\${1:a}, \${2:b})`
    }],

    'substraction': [{
        name: 'smartpy_substraction',
        type: 'token',
        caption: 'a - b',
        snippet: `\${1:a} - \${2:b}`
    }],

    'sp.sub': [{
        name: 'smartpy_substraction',
        type: 'token',
        caption: 'sp.sub(a, b)',
        snippet: `sp.sub(\${1:a}, \${2:b})`
    }],

    'multiply': [{
        name: 'smartpy_multiply',
        type: 'token',
        caption: 'a * b',
        snippet: `\${1:a} * \${2:b}`
    }],

    'sp.mul': [{
        name: 'smartpy_multiply',
        type: 'token',
        caption: 'sp.mul(a, b)',
        snippet: `sp.mul(\${1:a}, \${2:b})`
    }],

    'divide': [{
        name: 'smartpy_divide',
        type: 'token',
        caption: 'a / b',
        snippet: `\${1:a} / \${2:b}`
    }],

    'sp.mod': [{
        name: 'smartpy_sp_mod',
        type: 'token',
        caption: 'sp.mod(a, b)',
        snippet: `sp.mod(\${1:a}, \${2:b})`
    }],

    'sp.ediv': [{
        name: 'smartpy_sp_ediv',
        type: 'token',
        caption: 'sp.ediv(a, b)',
        snippet: `sp.ediv(\${1:x}, \${2:y})`
    }],

    'split_tokens': [{
        name: 'smartpy_split_tokens',
        type: 'token',
        caption: 'sp.split_tokens(a, q, t)',
        snippet: `sp.split_tokens(\${1:amount}, \${2:quantity}, \${3:totalQuantity})`
    }],

/*Strings*/

    'type_string': [{
        name: 'smartpy_type_string',
        type: 'token',
        caption: 'sp.string',
        snippet: `sp.string`
    }],

    'string': [{
        name: 'smartpy_string',
        type: 'token',
        caption: '"example"',
        snippet: `"\${1:example}"`
    }],


    'concatenate': [{
        name: 'smartpy_concatenate',
        type: 'token',
        caption: 'sp.concat([a, b])',
        snippet: `sp.concat([\${1:string1}, \${2:string2}])`
    }],

    'slice': [{
        name: 'smartpy_slice',
        type: 'token',
        caption: 'sp.slice(off, len, txt)',
        snippet: `sp.slice(\${1:offset}, \${2:length}, \${3:text})`
    }],

    'length': [{
        name: 'smartpy_length',
        type: 'token',
        caption: 'sp.len(a)',
        snippet: `sp.len(\${1:text})`
    }],


/*Timestamps*/

    'sp.timestamp': [{
        name: 'smartpy_timestamp',
        type: 'token', 
        caption: 'sp.timestamp(nbSec)',
        snippet: `sp.timestamp(\${1:nbSeconds})`
    }],

    'sp.now': [{
        name: 'smartpy_now',
        type: 'token',
        caption: 'sp.now',
        snippet: `sp.now`
    }],

    'timestamp_from_utc': [{
        name: 'smartpy_timestamp_from_utc',
        type: 'token',
        caption: '…from_utc(y, m, d,…)',
        snippet: `sp.timestamp_from_utc(\${1:year}, \${2:month}, \${3:day}, \${4:hours}, \${5:minutes}, \${6:seconds})`
    }],

    'sp.add_seconds': [{
        name: 'smartpy_add_seconds',
        type: 'token',
        caption: 'sp.add_seconds(t, s)',
        snippet: `sp.add_seconds(\${1:timestamp}, \${2:nbSeconds})`
    }],

    'sp.add_days': [{
        name: 'smartpy_add_days',
        type: 'token',
        caption: 'sp.add_days(t, d)',
        snippet: `sp.add_days(\${1:timestamp}, \${2:nbDays})`
    }],

    'difference_timestamp': [{
        name: 'smartpy_difference_timestamp',
        type: 'token',
        caption: 't1 - t2',
        snippet: `\${1:timestamp1} - \${2:timestamp2}`
    }],

    'type_timestamp': [{
        name: 'smartpy_sp_timestamp',
        type: 'token',
        caption: 'sp.timestamp',
        snippet: `sp.timestamp`
    }],


/*Addresses - Transactions -delegation */

    'sp.tez': [{
        name: 'smartpy_sp_tez',
        type: 'token',
        caption: 'sp.tez(42)',
        snippet: `sp.tez(\${1:42})`
    }],

    'sp.mutez': [{
        name: 'smartpy_sp_mutez',
        type: 'token',
        caption: 'sp.mutez(42)',
        snippet: `sp.mutez(\${1:42})`
    }],

    'sp.sender': [{
        name: 'smartpy_sp_sender',
        type: 'token',
        caption: 'sp.sender',
        snippet: 'sp.sender'
    }],

    'sp.amount': [{
        name: 'smartpy_sp_amount',
        type: 'token',
        caption: 'sp.amount',
        snippet: 'sp.amount'
    }],

    'sp.balance': [{
        name: 'smartpy_sp_balance',
        type: 'token', 
        caption: 'sp.balance',
        snippet: 'sp.balance'
    }],

    'sp.address': [{
        name: 'smartpy_sp_address',
        type: 'token',
        caption: 'sp.address("tz1...")',
        snippet: 'sp.address("\${1:tz1...address}")'
    }],

    'sp.send': [{
        name: 'smartpy_sp_send',
        type: 'token',
        caption: 'sp.send(dest, amnt)',
        snippet: 'sp.send(\${1:destination_address}, \${2:amount})'    
    }],

    'set_delegate': [{
        name: 'smartpy_set_delegate',
        type: 'token',
        caption: 'set_delegate()',
        snippet: `sp.set_delegate(\${1:opt})`
    }],

    'type_mutez': [{
        name: 'smartpy_type_mutez',
        type: 'token',
        caption: 'sp.mutez',
        snippet: `sp.mutez`
    }],

/*Asserts, Booleans*/

    'raise': [{
        name: 'smartpy_raise',
        type: 'token',
        caption: 'raise(value)',
        snippet: `raise(\${1:value})`
    }],


    'assert': [{
        name: 'smartpy_assert',
        type: 'token',
        caption: 'assert cond',
        snippet: `assert \${1:condition}`
    }],

    'assert_error': [{
        name: 'smartpy_assert_error',
        type: 'token',
        caption: 'assert cond, err',
        snippet: `assert \${1:condition}, \${2:errorValue}`
    }],

    'and': [{
        name: 'smartpy_and',
        type: 'token',
        caption: 'and',
        snippet: `and`
    }],

    'or': [{
        name: 'smartpy_or',
        type: 'token',
        caption: 'or',
        snippet: `or`
    }],

    '^': [{
        name: 'smartpy_^',
        type: 'token',
        caption: '^',
        snippet: `^`
    }],

    'true': [{
        name: 'smartpy_true',
        type: 'token',
        caption: 'True',
        snippet: `True`
    }],

    'false': [{
        name: 'smartpy_false',
        type: 'token',
        caption: 'False',
        snippet: `False`
    }],

    '>': [{
        name: 'smartpy_>',
        type: 'token',
        caption: '>',
        snippet: `>`
    }],

    '<': [{
        name: 'smartpy_<',
        type: 'token',
        caption: '<',
        snippet: `<`
    }],

    '<=': [{
        name: 'smartpy_<=',
        type: 'token',
        caption: '<=',
        snippet: `<=`
    }],

    '>=': [{
        name: 'smartpy_>=',
        type: 'token',
        caption: '>=',
        snippet: `>=`
    }],

    '==': [{
        name: 'smartpy_==',
        type: 'token',
        caption: '==',
        snippet: `==`
    }],

    '!=': [{
        name: 'smartpy_!=',
        type: 'token',
        caption: '!=',
        snippet: `!=`
    }],

    'sp.bool': [{
        name: 'smartpy_sp_bool',
        type: 'token',
        caption: 'sp.bool',
        snippet: `sp.bool`
    }],





/* Options */

    'sp.option': [{
        name: 'smarpty_sp_option',
        type: 'token',
        caption: 'sp.option[v_type]',
        snippet: 'sp.option[\${1:v_type}]'
    }],

    'sp.Some': [{
        name: 'smartpy_sp_some',
        type: 'token',
        caption: 'sp.Some(value)',
        snippet: 'sp.Some(\${1:value})'
    }],

    'none': [{
        name: 'smartpy_none',
        type: 'token',
        caption: 'None',
        snippet: 'None'
    }],

    'unwrap_some': [{
        name: 'smartpy_unwrap_some',
        type: 'token',
        caption: 'opt.unwrap_some()',
        snippet: `\${1:opt}.unwrap_some()`
    }],

    'opt_is_none': [{
        name: 'smartpy_opt_is_none',
        type: 'token',
        caption: 'opt.is_none()',
        snippet: `\${1:opt}.is_none()`
    }],

    'opt_is_some': [{
        name: 'smartpy_opt_is_some',
        type: 'token',
        caption: 'opt.is_some()',
        snippet: `\${1:opt}.is_some()`
    }],

/*Inter-contract calls - On-chain view*/


    'sp.contract': [{
        name: 'smartpy_sp_contract',
        type: 'token',
        caption: 'sp.contract(p, ctr, e)',
        snippet: `sp.contract(\${1:parameterType}, \${2:contractAddress}, entrypoint = "\${3:entrypointName}").unwrap_some()`
    }],

    
    'sp.transfer': [{
        name: 'smartpy_sp_transfer',
        type: 'token',
        caption: 'sp.transfer(p, a, ctr)',
        snippet: `sp.transfer(\${1:parameterValue}, \${2:amount}, \${3:contract})`
    }],

    
    'sp.view': [{
        name: 'smartpy_sp_view',
        type: 'token',
        caption: 'sp.view',
        snippet: `sp.view("\${1:viewName}", \${2:contractAddress}, \${3:argument}, \${4:returnType})`
    }],

    
    '': [{
        name: 'smartpy_',
        type: 'token',
        caption: '',
        snippet: ``
    }],

/*Pairs - Tuples - Records*/

    'pair': [{
        name: 'smartpy_pair',
        type: 'token',
        caption: '(a, b)',
        snippet: `(\${1:a}, \${2:b})`
    }],

    'variables_pair': [{
        name: 'smartpy_variables_pair',
        type: 'token',
        caption: '(x, y) = pair',
        snippet: `(\${1:x}, \${2:y}) = \${3:pair}`
    }],

    'sp.fst': [{
        name: 'smartpy_fst',
        type: 'token',
        caption: 'sp.fst(pair)',
        snippet: `sp.fst(\${1:pair})`
    }],

    'sp.snd': [{
        name: 'smartpy_snd',
        type: 'token',
        caption: 'sp.snd(pair)',
        snippet: `sp.snd(\${1:pair})`
    }],

    'tuple': [{
        name: 'smartpy_tuple',
        type: 'token',
        caption: '(a, b, c, ...)',
        snippet: `(\${1:a}, \${2:b}, \${3:c})`
    }],

    'variables_tuple': [{
        name: 'smartpy_variables_tuple',
        type: 'token',
        caption: '(x, y, z, ...) = tuple',
        snippet: `(\${1:x}, \${2:y}, \${3:z}) = \${4:tuple}`
    }],

    'record': [{
        name: 'smartpy_record',
        type: 'token',
        caption: 'sp.record(f1 = x, ...)',
        snippet: `sp.record(\${1:field1} = \${2:x}, \${3:field2} = \${4:y})`

    }],

    'record_type': [{
        name: 'smartpy_record_type',
        type: 'token',
        caption: 'sp.record(f1 = t1, ...)',
        snippet: 'sp.record(\${1:field1} = \${2:type1}, \${3:field2} = \${4:type2})'
    }],

    'sp.pair': [{
        name: 'smartpy_sp_pair',
        type: 'token',
        caption: 'sp.pair[t1, t2]',
        snippet: `sp.pair[\${1:type1}, \${2:type2}]`
    }],

    'sp.tuple': [{
        name: 'smartpy_sp_tuple',
        type: 'token',
        caption: 'sp.tuple[t1, t2, t3, ...]',
        snippet: `sp.tuple[\${1:type1}, \${2:type2}, \${3:type3}]`
    }],




/*Maps / Big maps*/

    'map': [{
        name: 'smartpy_map',
        type: 'token',
        caption : 'm = {key1 : v1, ...}',
        snippet: `\${1:m} = {\${2:key1} = \${3:value1}, \${4:key2} = \${5:value2}}`
    }],

    'sp.big_map': [{
        name: 'smartpy_big_map',
        type: 'token',
        caption: 'm = sp.big_map({})',
        snippet: `\${1:m} = sp.big_map({})`
    }],

    'delete_map_entry': [{
        name: 'smartpy_delete_map_entry',
        type: 'token',
        caption : 'del m[key]',
        snippet: `del \${1:m}[\${2:key}]`
    }],

    'add_update_map_entry': [{
        name: 'smartpy_add_update_map_entry',
        type: 'token',
        caption : 'm[key] = val',
        snippet: `\${1:m}[\${2:key}] = \${3:newValue} `
    }],

    'access_map_entry': [{
        name: 'smartpy_access_map_entry',
        type: 'token',
        caption : 'm[key]',
        snippet: `\${1:m}[\${2:key}]`
    }],

    'check_map_key': [{
        name: 'smartpy_check_map_key',
        type: 'token',
        caption : 'm.contains(key)',
        snippet: `\${1:m}.contains(\${2:key})`
    }],

    'size_map': [{
        name: 'smartpy_size_map',
        type: 'token',
        caption : 'sp.len(m)',
        snippet: `sp.len(\${1:m})`
    }],

    'get_items': [{
        name: 'smartpy_get_items',
        type: 'token',
        caption : 'm.items()',
        snippet: `\${1:m}.items()`
    }],

    'get_keys': [{
        name: 'smartpy_get_keys',
        type: 'token',
        caption : 'm.keys()',
        snippet: `\${1:m}.keys()`
    }],

    'get_values': [{
        name: 'smartpy_get_values',
        type: 'token',
        caption : 'm.values()',
        snippet: `\${1:m}.values()`
    }],

    'type_map': [{
        name: 'smartpy_type_map',
        type: 'token',
        caption : 'sp.map[t_key, t_val]',
        snippet: `sp.map[\${1:type_key}, \${2:type_value}]`
    }],

    'type_big_map': [{
        name: 'smartpy_type_big_map',
        type: 'token',
        caption : 'sp.big_map[t_k, t_v]',
        snippet: `sp.big_map[\${1:type_key}, \${2:type_value}]`
    }],

/* Sets - Lists*/

    'list': [{
        name: 'smartpy_list',
        type: 'token',
        caption: 'lst = [v1, v2, v3, ...]',
        snippet: `\${1:lst} = [\${2:value1}, \${3:value2}, \${4:value3}]`,
    }],

    'list_size': [{
        name: 'smartpy_list_size',
        type: 'token',
        caption: 'len(lst)',
        snippet: `len(\${1:lst})`,
    }],

    'list_push': [{
        name: 'smartpy_list_push',
        type: 'token',
        caption: 'lst.push(val)',
        snippet: `\${1:lst}.push(\${2:value})`
    }],

    'sp.range': [{
        name: 'smartpy_sp_range',
        type: 'token',
        caption: 'sp.range(begin, end)',
        snippet: `sp.range(\${1:begin}, \${2:end})`
    }],

    'sp.sum': [{
        name: 'smartpy_sp_sum',
        type: 'token',
        caption: 'sp.sum(lst)',
        snippet: `sp.sum(\${1:lst})`
    }],

    'sp.list': [{
        name: 'smartpy_sp_list',
        type: 'token',
        caption: 'sp.list[type]',
        snippet: `sp.list[\${1:type}]`
    }],

    'set': [{
        name: 'smartpy_set',
        type: 'token',
        caption: '{value1, value2, ...}',
        snippet: `{\${1:value1}, \${2:value2}}`
    }],

    'sp.set': [{
        name: 'smartpy_sp_set',
        type: 'token',
        caption: 'sp.set[type]',
        snippet: `sp.set[\${1:type}]`
    }],

    'set_length': [{
        name: 'smartpy_set_length',
        type: 'token',
        caption: 'len(s)',
        snippet: `len(\${1:setName})`
    }],

    'set_contains': [{
        name: 'smartpy_set_contains',
        type: 'token',
        caption: 's.contains(v)',
        snippet: `\${1:setName}.contains(\${2:value})`
    }],

    'set_elements': [{
        name: 'smartpy_set_elements',
        type: 'token',
        caption: 's.elements()',
        snippet: `\${1:setName}.elements()`
    }],

    'set_add': [{
        name: 'smartpy_set_add',
        type: 'token',
        caption: 's.add(value)',
        snippet: `\${1:setName}.add(\${2:value})`
    }],

    'set_remove': [{
        name: 'smartpy_set_remove',
        type: 'token',
        caption: 's.remove(value)',
        snippet: `\${1:setName}.remove(\${2:value})`
    }],



/*Bytes*/

    'sp.bytes': [{
        name: 'smartpy_sp_bytes',
        type: 'token',
        caption: 'sp.bytes',
        snippet: `sp.bytes`
    }],

    'sp.slice': [{
        name: 'smartpy_sp_slice',
        type: 'token',
        caption: 'sp.slice(off, len, b)',
        snippet: `sp.slice(\${1:offset}, \${2:length}, \${3:bytes})`
    }],

    'sp.concat': [{
        name: 'smartpy_sp_concat',
        type: 'token',
        caption:'sp.concat([b1, b2])',
        snippet: `sp.concat([\${1:bytes1}, \${2:bytes2}])`
    }],

    'and_bytes': [{
        name: 'smartpy_and_bytes',
        type: 'token',
        caption: 'sp.and_bytes(b1, b2)',
        snippet: `sp.and_bytes(\${1:b1}, \${2:b2})`
    }],

    'or_bytes': [{
        name: 'smartpy_or_bytes',
        type: 'token',
        caption: 'sp.or_bytes(b1, b2)',
        snippet: `sp.or_bytes(\${1:b1}, \${2:b2})`
    }],


    'xor_bytes': [{
        name: 'smartpy_xor_bytes',
        type: 'token',
        caption: 'sp.xor_bytes(b1, b2)',
        snippet: `sp.xor_bytes(\${1:b1}, \${2:b2})`
    }],


    'invert_bytes': [{
        name: 'smartpy_invert_bytes',
        type: 'token',
        caption: 'sp.invert_bytes(b)',
        snippet: `sp.invert_bytes(\${1:bytes})`
    }],

    'lshift_bytes': [{
        name: 'smartpy_lshift_bytes',
        type: 'token',
        caption: 'sp.lshift_bytes(b, sft)',
        snippet: `sp.lshift_bytes(\${1:bytes}, \${2:shiftValue})`
    }],

    'rshift_bytes': [{
        name: 'smartpy_rshift_bytes',
        type: 'token',
        caption: 'sp.rshift_bytes(b, sft)',
        snippet: `sp.rshift_bytes(\${1:bytes}, \${2:shiftValue})`
    }]



};

const archetypeBlocksList = {
    'smart_contract': [{
        name: 'archetype_smart_contract',
        type: 'token',
        caption: 'Smart contract',
        snippet: `archetype \${1:name}
        
variable store : \${2:type} = \${3:value}`,
    }],
    'entry_point': [{
        name: 'archetype_entry_point',
        type: 'token',
        caption: 'Entry point',
        snippet: `entry make_call () {
  
}`,
    }],
};

const cameLIGOBlocksList = {
    'smart_contract': [{
        name: 'cameligo_smart_contract',
        type: 'token',
        caption: 'Smart contract',
        snippet: `type storage = \${1:type}

type return = operation list * storage

let main (store : storage) : return =
  ([] : operation list)`,
    }],
};

const jsLIGOBlocksList = {
    'smart_contract': [{
        name: 'jsligo_smart_contract',
        type: 'token',
        caption: 'Smart contract',
        snippet: `type storage = \${1:type}

type return_ = [list<operation>, storage];

let main = ([store]: [storage]) : return_ >= {
  return [
    list([]) as list<operation>
  ];
};`,
    }],
};

const michelsonBlocksList = {
    'smart_contract': [{
        name: 'michelson_smart_contract',
        type: 'token',
        caption: 'Smart contract',
        snippet: `storage \${1:type};
code
  {
    
  };`,
    }],
    'pairs': [{
        name: 'michelson_pairs_car',
        type: 'function',
        caption: 'CAR',
        snippet: `CAR;`,
    }, {
        name: 'michelson_pairs_nil',
        type: 'function',
        caption: 'NIL',
        snippet: `NIL operation;`,
    }, {
        name: 'michelson_pairs_car',
        type: 'function',
        caption: 'PAIR',
        snippet: `PAIR;`,
    }],
};

const smartContractsBlocksList = {
    smartpy: smartPyBlocksList,
    archetype: archetypeBlocksList,
    michelson: michelsonBlocksList,
    mligo: cameLIGOBlocksList,
    jsligo: jsLIGOBlocksList,
};

window.SmartContractConfig = {
    localLanguageStrings: {
        fr: {
            categories: {
                'smart_contract_contract': "Contract",
                'smart_contract_tests': "Testing",
                'smart_contract_int_nat': "Int, Nat",
                'smart_contract_types': "Other types",
                'smart_contract_arithmetic': "Arithmetic",
                'smart_contract_strings': "Strings",
                'smart_contract_timestamps': "Timestamps",
                'smart_contract_addresses_transactions': "Addresses, Tez",
                'smart_contract_asserts_booleans': "Asserts, Booleans",
                'smart_contract_options': "Options",
                'smart_contract_inter_contract': "Inter-contract",
                'smart_contract_pairs_tuples_records': "Pairs, Records",
                'smart_contract_maps_big_maps': "Maps, Big-maps",
                'smart_contract_lists_sets': 'Lists, Sets',
                'smart_contract_bytes': 'Bytes',
            },
            description: {

                /*Contract*/
                'smartpy_smartpy_import': "import smartpy, creates module",
                'smartpy_smart_contract': "creates contract",
                'smartpy_self_data_value': "storage initialization",

                
                /* Testing */
                'smartpy_contract_instantiation': "instantiate contract",
                'smartpy_test_unwrap_option': "unwrap option in test",
                'smartpy_test_account': "creates a test account",
                'smartpy_test_address': "address of test account",
                'smartpy_test_some': "specific syntax for tests",
                'smartpy_contract_data': "contract storage",
                'smartpy_contract_baker': "delegated baker",
				'smartpy_trace': "within entrypoint",

                /*Int - Nat - Tez */
                'smartpy_type_int': "creates an int value",
                'smartpy_sp_to_int': "converts nat to int",
                'smartpy_sp_is_nat': "sp.Some(a) if >= 0    None if < 0",
                'smartpy_sp_as_nat': "Fails if a < 0",
                'smartpy_sp_int': "type",

                /*Types*/
                'smartpy_sp_cast': "specifies val's type to help type inference", 
                'smartpy_my_type': "type definition (place in module only)",
                'smartpy_convert_to_tez': "converts int/nat to tez. Not recommended",
                'smartpy_sp_unit': "unit type",
                'smartpy_()': "unit value (nothing)",

                /*Arithmetic*/
                'smartpy_addition': "if the types are the same",
                'smartpy_sp_add': "if the types are different",
                'smartpy_divide': " integer division",
                'smartpy_sp_mod': "➔ remainder of a / b",
                'smartpy_sp_ediv': "➔ option on pair (quotient, remainder)",
                'smartpy_split_tokens': "➔ (a*q) / t as tez",

                /*Strings*/
                'smartpy_slice': "extracts a substring      returns an option",
                'smartpy_type_string': "type",

                /*Timestamps*/
                'smartpy_timestamp': "creates a timestamp as seconds since 1/1/1970",
                'smartpy_timestamp_from_utc': "creates a timestamp from a utc date",
                'smartpy_now': "timestamp of the block",
                'smartpy_difference_timestamp': "difference in seconds between timestamps",
                'smartpy_sp_timestamp': "type",


                /*Addresses - Transactions - Delegation*/
                'smartpy_sp_sender': "address of direct caller",
                'smartpy_sp_amount': "amount transferred to the contract by the caller",
                'smartpy_sp_balance': "balance of the contract",
                'smartpy_sp_address': " ➔ hard coded address",
                'smartpy_sp_send': "transfer of tez",
                'smartpy_type_mutez': "type",

                /*Asserts, Booleans*/
                'smartpy_raise': "fails immediately", 
                'smartpy_assert_error': "specifies error value",
                'smartpy_sp_bool': "type",
                'smartpy_^': "exclusive or",

                /*Options*/
                'smarpty_sp_option': "type",
                'smartpy_sp_some':"option with value",
                'smartpy_none': "option with no value",
                'smartpy_unwrap_some': "extract value of an option. Fails if None.",
                'smartpy_opt_is_none': "➔ opt == None",
                'smartpy_opt_is_some': "➔ opt != None",

                /*Inter-contract*/
                'smartpy_sp_contract': "obtains contract entrypoint",
                'smartpy_sp_transfer': "calls entrypoint",
                'smartpy_sp_view': "calls on-chain view",

                /*Pairs - Tuples - Records*/
                'smartpy_pair': "creates a pair",
                'smartpy_variables_pair': "destructures a pair into two variables",
                'smartpy_fst': "➔ first element",
                'smartpy_snd': "➔ second element",
                'smartpy_tuple': "creates a tuple",
                'smartpy_variables_tuple': "destructures a tuple",
                'smartpy_record': "creates a record",
                'smartpy_record_type': "type",
                
                /*Maps / Big-maps */
                'smartpy_map': "creates a map",
                'smartpy_type_map': "type",
                'smartpy_add_update_map_entry': "adds or updates an entry",
                'smartpy_access_map_entry': "gets entry value",
                'smartpy_check_map_key': "True if key is in m",
                'smartpy_size_map': "➔ number of elements (map only)",
                'smartpy_get_items': "➔ list of pairs (key, val)",
                'smartpy_get_keys': "➔ list of keys",
                'smartpy_get_values': "➔ list of values",

                /* Lists - Sets*/
                'smartpy_list': "list of values of the same type",
                'smartpy_list_push': "inserts at the beginning",
                'smartpy_sp_range': "➔[begin, ..., end - 1]",
                'smartpy_sp_sum': "➔ sum of all elements",
                'smartpy_set': "set of distincts values of the same type",
                'smartpy_sp_set': "type",
                'smartpy_sp_list': "type",
                'smartpy_set_elements': "➔ list of values",

                /* Bytes */
                'smartpy_sp_slice': "➔ sp.Some(extract)     or None if invalid",
                'smartpy_and_bytes': "binary AND of b1 and b2",
                'smartpy_invert_bytes': "inverts every bit",
                'smartpy_lshift_bytes': "left shift of b by sft bits",
                'smartpy_sp_bytes': "type"
            },
        },
    },
    notionsList: {
        // category: [list of notion names]
        "smart_contract_contract": ["smartpy_import", "smart_contract",  "self.data.value", "entry_point", "onchain_view"],
        "smart_contract_tests": ["test", "scenario_creation", "contract_instantiation", "adding_to_scenario", "test_account", "test_address", "public_key_hash", "public_key", "secret_key", "scenario.show", "scenario.verify", "scenario.verify_equal", "contract.data", "contract.balance", "contract.baker", "contract.address", "trace", "scenario.h", "test_some", "test_none", "test_unwrap_option"],
        "smart_contract_int_nat": ["sp.int", "sp.nat", "sp.to_int", "sp.is_nat", "sp.as_nat", "type_int", "type_nat", ],
        "smart_contract_types": ["sp.cast", "my_type", "convert_to_tez", "()", "sp.unit"],
        "smart_contract_arithmetic": ["addition", "sp.add", "substraction", "sp.sub", "multiply", "sp.mul", "divide", "sp.mod", "sp.ediv", "split_tokens"],
        "smart_contract_strings": ["string", "concatenate", "slice", "length", "type_string"],
        "smart_contract_timestamps": [ "sp.now",  "sp.timestamp", "timestamp_from_utc","sp.add_seconds", "sp.add_days", "difference_timestamp", "type_timestamp"],
        "smart_contract_addresses_transactions": ["sp.tez", "sp.mutez", "sp.sender", "sp.amount", "sp.balance", "sp.address", "sp.send", "type_mutez"],
        "smart_contract_asserts_booleans":["raise", "assert", "assert_error", "and", "or", "not", "^", "true", "false", ">", "<", "<=", ">=", "==", "!=", "sp.bool"],
        "smart_contract_options": ["sp.Some", "none", "unwrap_some", "opt_is_none", "opt_is_some", "sp.option"],
        "smart_contract_inter_contract": ["sp.contract", "sp.transfer", "sp.view"],
        "smart_contract_pairs_tuples_records": ["pair", "variables_pair", "sp.fst", "sp.snd", "tuple", "variables_tuple", "record", "record_type", "sp.pair", "sp.tuple"],
        "smart_contract_maps_big_maps": ["map", "sp.big_map", "delete_map_entry", "add_update_map_entry", "access_map_entry", "check_map_key", "size_map", "get_items", "get_keys", "get_values", "type_map", "type_big_map"],
        "smart_contract_lists_sets": ["list", "list_size", "list_push", "sp.range", "sp.sum", "sp.list", "set", "set_length", "set_contains", "set_elements", "set_add", "set_remove", "sp.set"],
        "smart_contract_bytes": ["sp.slice", "sp.concat", "and_bytes", "or_bytes", "xor_bytes", "invert_bytes", "lshift_bytes", "rshift_bytes", "sp.bytes"],
    },
    conceptsList: [

        {
            id: 'smartpy_import',
            name: 'smartpy_import',
            url: conceptBaseUrl + "#smart_smartpy_import"
        },

        {
            id: 'smart_contract', // Must be the name of the notion
            name: 'Lorem',
            url: conceptBaseUrl + '#smart_contracts_lorem', // Must be the value of data-id in the documentation
        },
        {
            id: 'entry_point',
            name: 'Ipsum',
            url: conceptBaseUrl + '#smart_contracts_ipsum',
        },

        {
            id: 'storage',
            name: 'storage',
            url: conceptBaseUrl + "#smart_storage"
        },

        {
            id: 'onchain_view',
            name: 'onchain_view',
            url: conceptBaseUrl + "#smart_onchain_view"
        },

/* Testing */
        {
            id: 'scenario_creation',
            name: 'scenario_creation',
            url: conceptBaseUrl + '#smart_scenario_creation'
        },

        {
            id: 'contract_instantiation',
            name: 'contract_instantiation',
            url: conceptBaseUrl + '#smart_contract_instantiation'
        },

        {
            id: 'adding_to_scenario',
            name: 'adding_to_scenario',
            url: conceptBaseUrl + '#smart_adding_to_scenario'
        },

        {
            id: 'test_unwrap_option',
            name: 'test_unwrap_option',
            url: conceptBaseUrl + "#smart_test_unwrap_option"
        },

        {
            id: 'test_account',
            name: 'test_account',
            url: conceptBaseUrl + "#smart_test_account"
        },

        {
            id: 'test_address',
            name: 'test_address',
            url: conceptBaseUrl + "#smart_test_address"
        },

        {
            id: 'public_key_hash',
            name: 'public_key_hash',
            url: conceptBaseUrl + "#smart_public_key_hash"
        },

        {
            id: 'public_key',
            name: 'public_key',
            url: conceptBaseUrl + "#smart_public_key"
        },

        {
            id: 'secret_key',
            name: 'secret_key',
            url: conceptBaseUrl + "#smart_secret_key"
        },

        {
            id: 'test_some',
            name: 'test_some',
            url: conceptBaseUrl + "#smart_test_some"
        },

        {
            id: 'scenario.verify',
            name: 'scenario.verify',
            url: conceptBaseUrl + "#smart_scenario_verify"
        },

        {
            id: 'scenario.verify_equal',
            name: 'scenario.verify_equal',
            url: conceptBaseUrl + "#smart_scenario.verify_equal"
        },

        {
            id: 'contract.data',
            name: 'contract.data',
            url: conceptBaseUrl + "#smart_contract.data"
        },

        {
            id: 'contract.balance',
            name: 'contract.balance',
            url: conceptBaseUrl + "#smart_contract.balance"
        },

        {
            id: 'contract.baker',
            name: 'contract.baker',
            url: conceptBaseUrl + "#smart_contract.baker"
        },

        {
            id: 'contract.address',
            name: 'contract.address',
            url: conceptBaseUrl + "#smart_contract.address"
        },

        {
            id: 'scenario.h',
            name: 'scenario.h',
            url: conceptBaseUrl + "#smart_scenario.h"
        },

        {
            id: 'test_none',
            name: 'test_none',
            url: conceptBaseUrl + "#smart_none"
        },

        {
            id: 'scenario.show',
            name: 'scenario.show',
            url: conceptBaseUrl + "#smart_scenario_show"
        },

        {
            id: 'trace',
            name: 'trace',
            url: conceptBaseUrl + "#smart_trace"
        },


/*Int - Nat - Tez*/

        {
            id: 'sp.int',
            name: 'sp.int',
            url: conceptBaseUrl + "#smart_contract_sp_int"
        },

        {
            id: 'sp.nat',
            name: 'sp.nat',
            url: conceptBaseUrl + "#smart_contract_sp_nat"
        },

        {
            id: 'sp.to_int',
            name: 'sp.to_int',
            url: conceptBaseUrl + '#smart_contract_sp_to_int',
        },

        {
            id: 'sp.is_nat',
            name: 'sp.is_nat',
            url: conceptBaseUrl + '#smart_contract_sp_is_nat'
        },

        {
            id: 'sp.as_nat',
            name: 'sp.as_nat',
            url: conceptBaseUrl + '#smart_contract_sp_as_nat'
        },

        {
            id: 'type_int',
            name: 'Int',
            url: conceptBaseUrl + '#smart_contract_int',
        },

        {
            id: 'type_nat',
            name: 'Nat',
            url: conceptBaseUrl + '#smart_contract_nat',
        },

/* Types */

        {
            id: 'sp.cast',
            name: 'sp.cast',
            url: conceptBaseUrl + "#smart_sp_cast"
        },

        {
            id: 'sp.unit',
            name: 'sp.unit',
            url: conceptBaseUrl + "#smart_sp_unit"
        },

        {
            id: '()',
            name: '()',
            url: conceptBaseUrl + "#smart_()"
        },

        {
            id: 'my_type',
            name: 'my_type',
            url: conceptBaseUrl + "#smart_my_type"
        },

        {
            id: 'convert_to_tez',
            name: 'convert_to_tez',
            url: conceptBaseUrl + "#smart_convert_to_tez"
        },

        {
            id: '',
            name: '',
            url: conceptBaseUrl + "#smart_"
        },

/*Arithmetic*/

        {
            id: 'addition',
            name: 'addition',
            url: conceptBaseUrl + '#smart_contract_add',
        },

        {
            id: 'sp.add',
            name: 'sp.add',
            url: conceptBaseUrl + '#smart_contract_sp_add',
        },

        {
            id: 'substraction',
            name: 'substraction',
            url: conceptBaseUrl + '#smart_contract_sub',
        },

        {
            id:'sp.sub',
            name:'sp.sub',
            url: conceptBaseUrl + '#smart_contract_sp_sub'
        },

        {
            id: 'multiply',
            name: 'multiply',
            url: conceptBaseUrl + '#smart_contract_mul',
        },

        {
            id: 'sp.mul',
            name: 'sp.mul',
            url: conceptBaseUrl + '#smart_contract_sp_mul'
        },

        {
            id: 'modulo',
            name: 'modulo',
            url: conceptBaseUrl + '#smart_contract_modulo',
        },

        {
            id: 'ediv',
            name: 'ediv',
            url: conceptBaseUrl + '#smart_contract_ediv',
        },

        {
            id: 'split_tokens',
            name: 'split Tokens',
            url: conceptBaseUrl + "#smart_contract_split_tokens",
        },

/*Strings*/

        {
            id: 'type_string',
            name: 'type_string',
            url: conceptBaseUrl + '#smart_contract_string'
        },

        {
            id: 'string',
            name: 'type_string',
            url: conceptBaseUrl + "#smart_type_string"
        },

        {
            id: 'concatenate',
            name: 'concatenate Strings',
            url: conceptBaseUrl + '#smart_contract_string'
        },

        {
            id: 'slice',
            name: 'slice',
            url: conceptBaseUrl + '#smart_contract_slice'
        },

        {
            id: 'length_string',
            name: 'length_string',
            url: conceptBaseUrl + '#smart_contract_slice'
        },



/*Timestamps*/

        {
            id: 'type_timestamp',
            name: 'timestamp',
            url: conceptBaseUrl + '#smart_contract_string'
        },

        {
            id: 'sp.now',
            name: 'sp.now',
            url: conceptBaseUrl + '#smart_sp_now'
        },

        {
            id: 'timestamp_from_utc',
            name: 'timestamp_from_utc',
            url: conceptBaseUrl + '#smart_timestamp_from_utc'
        },

        {
            id: 'sp.add_seconds',
            name: 'sp.add_seconds',
            url: conceptBaseUrl + '#smart_add_seconds'
        },

        {
            id: 'sp.add_days',
            name: 'sp.add_days',
            url: conceptBaseUrl + '#smart_add_days'
        },

        {
            id: 'difference_timestamp',
            name: 'difference_timestamp',
            url: conceptBaseUrl  + '#smart_difference_timestamp'
        },

        {
            id: 'type_timestamp',
            name: 'sp.timestamp',
            url: conceptBaseUrl + '#smart_contract_timestamp',
        },


/*Addresses - Transactions - Delegation*/

        {
            id: 'sp.tez',
            name: 'sp.tez',
            url: conceptBaseUrl + '#smart_contract_sp_tez'
        },

        {
            id: 'sp.mutez',
            name: 'sp.mutez',
            url: conceptBaseUrl + '#smart_contract_sp_mutez'
        },

        {
            id: 'sp.sender',
            name: 'sp.sender',
            url: conceptBaseUrl + '#smart_sp_sender'
        },

        {
            id: 'sp.amount',
            name: 'sp.amount',
            url: conceptBaseUrl + "#smart_sp_amount"
        },

        {
            id: 'sp.balance',
            name: 'sp.balance', 
            url: conceptBaseUrl + "#smart_sp_balance"
        },


        {
            id: 'sp.address',
            name: 'sp.address',
            url: conceptBaseUrl + "#smart_sp_address"
        },

        {
            id: 'sp.send',
            name: 'sp.send',
            url: conceptBaseUrl + "#smart_sp_send"
        },

        {
            id: 'type_mutez',
            name: 'type_mutez',
            url: conceptBaseUrl + "#smart_type_mutez"
        },

/* Asserts, Booleans*/

        {
            id: 'assert',
            name: 'assert',
            url: conceptBaseUrl + "#smart_assert"
        },

        {
            id: 'assert_error',
            name: 'assert_error',
            url: conceptBaseUrl + "#smart_assert_error"
        },

        {
            id: 'and',
            name: 'and',
            url: conceptBaseUrl + "#smart_and"
        },

        {
            id: 'or',
            name: 'or',
            url: conceptBaseUrl + "#smart_or"
        },

        {
            id: 'not',
            name: 'not',
            url: conceptBaseUrl + "#smart_not"
        },

        {
            id: '^',
            name: '^',
            url: conceptBaseUrl + "#smart_^"
        },

        {
            id: 'true',
            name: 'true',
            url: conceptBaseUrl + "#smart_true"
        },

        {
            id: 'false',
            name: 'false',
            url: conceptBaseUrl + "#smart_false"
        },

        {
            id: '>',
            name: '>',
            url: conceptBaseUrl + "#smart_>"
        },

        {
            id: '<',
            name: '<',
            url: conceptBaseUrl + "#smart_<"
        },

        {
            id: '<=',
            name: '<=',
            url: conceptBaseUrl + "#smart_<="
        },

        {
            id: '>=',
            name: '>=',
            url: conceptBaseUrl + "#smart_>="
        },

        {
            id: '==',
            name: '==',
            url: conceptBaseUrl + "#smart_=="
        },

        {
            id: '!=',
            name: '!=',
            url: conceptBaseUrl + "#smart_!="
        },

        {
            id: 'sp.bool',
            name: 'sp.bool',
            url: conceptBaseUrl + "#smart_sp_bool"
        },


/* Options */

        {
            id: 'sp.option',
            name: 'sp.option',
            url: conceptBaseUrl + "#smart_sp_option"
        },

        {
            id: 'sp.some',
            name: 'sp.some',
            url: conceptBaseUrl + "#smart_sp_some"
        },

        {
            id: 'none',
            name: 'none',
            url: conceptBaseUrl + "#smart_none"
        },

        {
            id: 'unwrap_some',
            name: 'unwrap_some',
            url: conceptBaseUrl + "#smart_unwrap_some"
        },

        {
            id: 'x_is_none',
            name: 'x_is_none',
            url: conceptBaseUrl + "#smart_x_is_none"
        },

        {
            id: 'x_is_some',
            name: 'x_is_some',
            url: conceptBaseUrl + "#smart_x_is_some"
        },

/*Inter-contract*/

        {
            id: 'sp.contract',
            name: 'sp.contract',
            url: conceptBaseUrl + "#smart_sp_contract"
        },

        {
            id: 'sp.transfer',
            name: 'sp.transfer',
            url: conceptBaseUrl + "#smart_sp_transfer"
        },

        {
            id: 'sp.view',
            name: 'sp.view',
            url: conceptBaseUrl + "#smart_sp_view"
        },

/*Pairs - Tuples - Records*/

        {
            id: 'pair',
            name: 'pair',
            url: conceptBaseUrl + "#smart_pair"
        },

        {
            id: 'variables_pair',
            name: 'variables_pair',
            url: conceptBaseUrl + "#smart_variables_pair"
        },

        {
            id: 'sp.fst',
            name: 'sp.fst',
            url: conceptBaseUrl + "#smart_sp_fst"
        },

        {
            id: 'sp.snd',
            name: 'sp.snd',
            url: conceptBaseUrl + "#smart_sp_snd"
        },

        {
            id: 'tuple',
            name: 'tuple',
            url: conceptBaseUrl + "#smart_tuple"
        },

        {
            id: 'variables_tuple',
            name: 'variables_tuple',
            url: conceptBaseUrl + "#smart_variables_tuple"
        },

        {
            id: 'record',
            name: 'record',
            url: conceptBaseUrl + "#smart_record"
        },

        {
            id: 'record_type',
            name: 'record_type',
            url: conceptBaseUrl + "#smart_record_type"
        },

        {
            id: 'sp.pair',
            name: 'sp.pair',
            url: conceptBaseUrl + "#smart_sp_pair"
        },

        {
            id: 'sp.tuple',
            name: 'sp.tuple',
            url: conceptBaseUrl + "#smart_sp_tuple"
        },


/*Maps / Big-maps*/
        
        {
            id: 'map',
            name: 'map',
            url: conceptBaseUrl + "#smart_map"
        },

        {
            id: 'big_map',
            name: 'big_map',
            url: conceptBaseUrl + "#smart_big_map"
        },

        {
            id: 'type_map',
            name: 'type_map',
            url: conceptBaseUrl + "#smart_type_map"
        },

        {
            id: 'type_big_map',
            name: 'type_big_map',
            url: conceptBaseUrl + "#smart_type_big_map"
        },

        {
            id: 'delete_map_entry',
            name: 'delete_map_entry',
            url: conceptBaseUrl + "#smart_delete_map_entry"
        },

        {
            id: 'add_update_map_entry',
            name: 'add_update_map_entry',
            url: conceptBaseUrl + "#smart_add_update_map_entry"
        },

        {
            id: 'access_map_entry',
            name: 'access_map_entry',
            url: conceptBaseUrl + "#smart_access_map_entry"
        },

        {
            id: 'check_map_key',
            name: 'check_map_key',
            url: conceptBaseUrl + "#smart_check_map_key"
        },

        {
            id: 'size_map',
            name: 'size_map',
            url: conceptBaseUrl + "#smart_size_map"
            
        },

        {
            id: 'get_items',
            name: 'get_items',
            url: conceptBaseUrl + "#smart_get_items"
            
        },

        {
            id: 'get_keys',
            name: 'get_keys',
            url: conceptBaseUrl + "#smart_get_keys"
            
        },

        {
            id: 'get_values',
            name: 'get_values',
            url: conceptBaseUrl + "#smart_get_values"
            
        },

/* Sets, Lists*/

        {
            id: 'list',
            name: 'list',
            url: conceptBaseUrl + "#smart_list"
        },

        {
            id: 'list_size',
            name: 'list_size',
            url: conceptBaseUrl + "#smart_list_size"
        },

        {
            id: 'list_push',
            name: 'list_push',
            url: conceptBaseUrl + "#smart_list_push"
        },

        {
            id: 'sp.range',
            name: 'sp.range',
            url: conceptBaseUrl + "#smart_sp_range"
        },

        {
            id: 'sp.sum',
            name: 'sp.sum',
            url: conceptBaseUrl + "#smart_sp_sum"
        },
        {
            id: 'sp.list',
            name: 'sp.list',
            url: conceptBaseUrl + "#smart_sp_list"
        },

        {
            id: 'set',
            name: 'set',
            url: conceptBaseUrl + "#smart_set"
        },

        {
            id: 'sp.set',
            name: 'sp.set',
            url: conceptBaseUrl + "#smart_sp_set"
        },

        {
            id: 'set_length',
            name: 'set_length',
            url: conceptBaseUrl + "#smart_set_length"
        },

        {
            id: 'set_contains',
            name: 'set_contains',
            url: conceptBaseUrl + "#smart_set_contains"
        },

        {
            id: 'set_elements',
            name: 'set_elements',
            url: conceptBaseUrl + "#smart_set_elements"
        },

        {
            id: 'set_add',
            name: 'set_add',
            url: conceptBaseUrl + "#smart_set_add"
        },

        {
            id: 'set_remove',
            name: 'set_remove',
            url: conceptBaseUrl + "#smart_set_remove"
        },

/* Bytes */

        {
            id: 'sp.bytes',
            name: 'sp.bytes',
            url: conceptBaseUrl + "#smart_sp_bytes"
        },

        {
            id: 'sp.slice',
            name: 'sp.slice',
            url: conceptBaseUrl + "#smart_sp_slice"
        },

        {
            id: 'sp.concat',
            name: 'sp.concat',
            url: conceptBaseUrl + "#smart_sp_concat"
        },

        {
            id: 'and_bytes',
            name: 'adn_bytes',
            url: conceptBaseUrl + "#smart_and_bytes"
        },

        {
            id: 'or_bytes',
            name: 'or_bytes',
            url: conceptBaseUrl + "#smart_or_bytes"
        },

        {
            id: 'xor_bytes',
            name: 'xor_bytes',
            url: conceptBaseUrl + "#smart_xor_bytes"
        },

        {
            id: 'invert_bytes',
            name: 'invert_bytes',
            url: conceptBaseUrl + "#smart_invert_bytes"
        },

        {
            id: 'lshift_bytes',
            name: 'lshift_bytes',
            url: conceptBaseUrl + "#smart_lshift_bytes"
        },

        {
            id: 'rshift_bytes',
            name: 'rshift_bytes',
            url: conceptBaseUrl + "#smart_rshift_bytes"
        },

],
    smartContractsBlocksList: smartContractsBlocksList,
};
