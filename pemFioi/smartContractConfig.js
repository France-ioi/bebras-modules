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
        name: 'smartpy_import',
        type: 'token',
        caption: 'def main():',
        snippet: `import smartpy as sp

@sp.module
def main():
	`
    }],


    'smartpy_contract_creation': [{
        name: 'smartpy_contract_creation',
        type: 'token',
        caption: 'class ctr(sp.Contract)',
        snippet: `
    class \${1:name}(sp.Contract):
        def __init__(self):
			`,
    }],

    'smartpy_self_data_value': [{
        name: 'smartpy_self_data_value',
        type: 'token',
        caption: 'self.data.value = ...',
        snippet: `self.data.\${1:valueName} = \${2:value}`
    }],

    'smartpy_entry_point': [{
        name: 'smartpy_entry_point',
        type: 'token',
        caption: '@sp.entrypoint',
        snippet: `@sp.entrypoint
def \${1:entrypointName}(self):
    `,
    }],

    'smartpy_onchain_view': [{
        name: 'smartpy_onchain_view',
        type: 'token',
        caption: '@sp.onchain_view',
        snippet: `class \${1:contractName}(sp.Contract):
        
        @sp.onchain_view()
        def \${2:methodName}(self,...):
        `
    }],



/* Test */

        'smartpy_test_starter': [{
        name: 'smartpy_test_starter',
        type: 'token',
        caption: '@sp.add_test',
        snippet: `@sp.add_test(name = "\${1:name of your test}")
def \${2:test_name}():
        `,
    }],

    'smartpy_scenario_creation': [{
        name: 'smartpy_scenario_creation',
        type: 'token',
        caption: 'sp.test_scenario',
        snippet: `\${1:scenario_name} = sp.test_scenario(main)`,
    }],

    'smartpy_contract_instantiation': [{
        name: 'smartpy_contract_instantiation',
        type: 'token',
        caption: 'c = main.ctr(...)',
        snippet: `\${1:instanceName} = main.\${2:contractName}(\${3:initialStorage})`
    }],

    'smartpy_adding_to_scenario': [{
        name: 'smartpy_adding_to_scenario',
        type: 'token',
        caption: 'scenario += c',
        snippet: `\${1:scenario_name} += \${2:instanceName}`
    }],

    'smartpy_test_unwrap_option': [{
        name: 'smartpy_test_unwrap_option',
        type: 'token',
        caption: 'opt.open_some()',
        snippet: `\${1:optionName}.open_some()`
    }],

    'smartpy_test_account': [{
        name: 'smartpy_test_account',
        type: 'token',
        caption: 'sp.test_account(a)',
        snippet: `sp.test_account(\${1:accountName})`
    }],

    'smartpy_test_address': [{
        name: 'smartpy_test_address',
        type: 'token',
        caption: 'acc.address',
        snippet: `\${1:accountName}.address`
    }],

    'smartpy_public_key_hash': [{
        name: 'smartpy_public_key_hash',
        type: 'token',
        caption: 'acc.public_key_hash',
        snippet: `\${1:accountName}.public_key_hash`
    }],


    'smartpy_public_key': [{
        name: 'smartpy_public_key',
        type: 'token',
        caption: 'acc.public_key',
        snippet: `\${1:accountName}.public_key`
    }],


    'smartpy_secret_key': [{
        name: 'smartpy_secret_key',
        type: 'token',
        caption: 'acc.secret_key',
        snippet: `\${1:accountName}.secret_key`
    }],


    'smartpy_test_some': [{
        name: 'smartpy_test_some',
        type: 'token',
        caption: 'sp.some(value)',
        snippet: `sp.some(\${1:value})`
    }],

    'smartpy_scenario_verify': [{
        name: 'smartpy_scenario_verify',
        type: 'token',
        caption: 'scenario.verifiy(cond)',
        snippet: `scenario.verify(\${1:condition})`
    }],

    'smartpy_scenario_verify_equal': [{
        name: 'smartpy_scenario_verify_equal',
        type: 'token',
        caption: 'scenario.verifiy_equal(a, b)',
        snippet: `scenario.verify_equal(\${1:value1}, \${2:value2})`
    }],

    'smartpy_scenario_show': [{
        name: 'smartpy_scenario_show',
        type: 'token',
        caption: 'scenario.show(value)',
        snippet: `scenario.show(\${1:value})`
    }],

    'smartpy_contract_data': [{
        name: 'smartpy_contract_data',
        type: 'token',
        caption: 'contract.data.value',
        snippet: `\${1:contractName}.data.\${2:value}`
    }],

    'smartpy_contract_entrypointcall': [{
        name: 'smartpy_contract_entrypointcall',
        type: 'token',
        caption: 'contract.entrypoint',
        snippet: `\${1:contractName}.\${2:entrypoint}`
    }],

    'smartpy_contract_balance': [{
        name: 'smartpy_contract_balance',
        type: 'token',
        caption: 'contract.balance',
        snippet: `\${1:contractName}.balance`
    }],

    'smartpy_contract_baker': [{
        name: 'smartpy_contract_baker',
        type: 'token',
        caption: 'contract.baker',
        snippet: `\${1:contractName}.baker`
    }],

    'smartpy_contract_address': [{
        name: 'smartpy_contract_address',
        type: 'token',
        caption: 'contract.address',
        snippet: `\${1:contractName}.address`
    }],

    'smartpy_trace': [{
        name: 'smartpy_trace',
        type: 'token',
        caption: 'trace(value)',
        snippet: `trace(\${1:value})`
    }],

    'smartpy_scenario_h': [{
        name: 'smartpy_scenario_h',
        type: 'token',
        caption: 'scenario.h1',
        snippet: `scenario.h1("\${1:scenario_name")`
    }],

    'smartpy_test_none': [{
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

    'int_declaration': [{
        name: 'int_declaration',
        type: 'token',
        caption: 'sp.int(42)',
        snippet: `sp.int(\${1:42})`
    }],

    'nat_declaration': [{
        name: 'nat_declaration',
        type: 'token',
        caption: 'sp.nat(42)',
        snippet: `sp.nat(\${1:42})`
    }],

    'smartpy_to_int': [{
        name: 'smartpy_to_int',
        type: 'token',
        caption: 'sp.to_int(a)',
        snippet: `sp.to_int(\${1:a})`
    }],

    'smartpy_is_nat': [{
        name: 'smartpy_is_nat',
        type: 'token',
        caption: 'sp.is_nat(a)',
        snippet: `sp.is_nat(\${1:a})`
    }],

    'smartpy_as_nat': [{
        name: 'smartpy_as_nat',
        type: 'token',
        caption: 'sp.as_nat(a)',
        snippet: `sp.as_nat(\${1:a})`
    }],

    'int_type': [{
        name: 'int_type',
        type: 'token',
        caption: 'sp.int',
        snippet: `sp.int`
    }],

    'nat_type': [{
        name: 'nat_type',
        type: 'token',
        caption: 'sp.nat',
        snippet: `sp.nat`
    }],

/* Types */

    'smartpy_sp_cast': [{
        name: 'smartpy_sp_cast',
        type: 'token',
        caption: 'sp.cast(val, type)',
        snippet: `sp.cast(\${1:value}, \${2:type})`
    }],

    'unit_type': [{
        name: 'unit_type',
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


    'custom_type': [{
        name: 'custom_type',
        type: 'token',
        caption: 'my_type:type = ...',
        snippet: `my_type:type = \${1:type_definition}`
    }],


    'smartpy_convert_to_tez': [{
        name: 'smartpy_convert_to_tez',
        type: 'token',
        caption: 'sp.mul(n, sp.tez(x))',
        snippet: `sp.mul(\${1:value1}, sp.tez(1))`
    }],



/*Arithmetic*/

    'addition': [{
        name: 'addition', 
        type: 'token',
        caption: 'a + b',
        snippet: `\${1:a} + \${2:b}`
    }],

    'addition_multitypes': [{
        name: 'addition_multitypes',
        type: 'token',
        caption: 'sp.add(a, b)',
        snippet: `sp.add(\${1:a}, \${2:b})`
    }],

    'substraction': [{
        name: 'substraction',
        type: 'token',
        caption: 'a - b',
        snippet: `\${1:a} - \${2:b}`
    }],

    'substraction_multitypes': [{
        name: 'substraction_multitypes',
        type: 'token',
        caption: 'sp.sub(a, b)',
        snippet: `sp.sub(\${1:a}, \${2:b})`
    }],

    'multiply': [{
        name: 'multiply',
        type: 'token',
        caption: 'a * b',
        snippet: `\${1:a} * \${2:b}`
    }],

    'multiplication_multitypes': [{
        name: 'multiplication_multitypes',
        type: 'token',
        caption: 'sp.mul(a, b)',
        snippet: `sp.mul(\${1:a}, \${2:b})`
    }],

    'divide': [{
        name: 'divide',
        type: 'token',
        caption: 'a / b',
        snippet: `\${1:a} / \${2:b}`
    }],

    'modulo_multitypes': [{
        name: 'modulo_multitypes',
        type: 'token',
        caption: 'sp.mod(a, b)',
        snippet: `sp.mod(\${1:a}, \${2:b})`
    }],

    'euclidian_multitypes': [{
        name: 'euclidian_multitypes',
        type: 'token',
        caption: 'sp.ediv(a, b)',
        snippet: `sp.ediv(\${1:x}, \${2:y})`
    }],

    'smartpy_split_tokens': [{
        name: 'smartpy_split_tokens',
        type: 'token',
        caption: 'sp.split_tokens(a, q, t)',
        snippet: `sp.split_tokens(\${1:amount}, \${2:quantity}, \${3:totalQuantity})`
    }],

    'shorthand_operators': [{
        name: 'shorthand_operators',
        type: 'token',
        caption: '+=, -=,  %=, *=',
        snippet: '\${1:+}='
    }],

/*Strings*/

    'string_type': [{
        name: 'string_type',
        type: 'token',
        caption: 'sp.string',
        snippet: `sp.string`
    }],

    'string': [{
        name: 'string',
        type: 'token',
        caption: '"example"',
        snippet: `"\${1:example}"`
    }],


    'string_concatenate': [{
        name: 'string_concatenate',
        type: 'token',
        caption: 'sp.concat([a, b])',
        snippet: `sp.concat([\${1:string1}, \${2:string2}])`
    }],

    'smartpy_slice': [{
        name: 'smartpy_slice',
        type: 'token',
        caption: 'sp.slice(off, len, txt)',
        snippet: `sp.slice(\${1:offset}, \${2:length}, \${3:text})`
    }],

    'length': [{
        name: 'length',
        type: 'token',
        caption: 'sp.len(a)',
        snippet: `sp.len(\${1:text})`
    }],

    'string_addition': [{
        name: 'string_addition',
        type: 'token',
        caption: 'str1 + str2',
        snippet: '\${1:string} + \${2:string}'
    }],


/*Timestamps*/

    'timestamp_from_seconds': [{
        name: 'timestamp_from_seconds',
        type: 'token', 
        caption: 'sp.timestamp(nbSec)',
        snippet: `sp.timestamp(\${1:nbSeconds})`
    }],

    'current_timestamp': [{
        name: 'current_timestamp',
        type: 'token',
        caption: 'sp.now',
        snippet: `sp.now`
    }],

    'smartpy_timestamp_from_utc': [{
        name: 'smartpy_timestamp_from_utc',
        type: 'token',
        caption: '…from_utc(y, m, d,…)',
        snippet: `sp.timestamp_from_utc(\${1:year}, \${2:month}, \${3:day}, \${4:hours}, \${5:minutes}, \${6:seconds})`
    }],

    'smartpy_add_seconds': [{
        name: 'smartpy_add_seconds',
        type: 'token',
        caption: 'sp.add_seconds(t, s)',
        snippet: `sp.add_seconds(\${1:timestamp}, \${2:nbSeconds})`
    }],

    'smartpy_add_days': [{
        name: 'smartpy_add_days',
        type: 'token',
        caption: 'sp.add_days(t, d)',
        snippet: `sp.add_days(\${1:timestamp}, \${2:nbDays})`
    }],

    'difference_timestamp': [{
        name: 'difference_timestamp',
        type: 'token',
        caption: 't1 - t2',
        snippet: `\${1:timestamp1} - \${2:timestamp2}`
    }],

    'timestamp_type': [{
        name: 'timestamp_type',
        type: 'token',
        caption: 'sp.timestamp',
        snippet: `sp.timestamp`
    }],


/*Addresses - Transactions -delegation */

    'tez': [{
        name: 'tez',
        type: 'token',
        caption: 'sp.tez(42)',
        snippet: `sp.tez(\${1:42})`
    }],

    'mutez': [{
        name: 'mutez',
        type: 'token',
        caption: 'sp.mutez(42)',
        snippet: `sp.mutez(\${1:42})`
    }],

    'sender': [{
        name: 'sender',
        type: 'token',
        caption: 'sp.sender',
        snippet: 'sp.sender'
    }],

    'amount': [{
        name: 'amount',
        type: 'token',
        caption: 'sp.amount',
        snippet: 'sp.amount'
    }],

    'balance': [{
        name: 'balance',
        type: 'token', 
        caption: 'sp.balance',
        snippet: 'sp.balance'
    }],

    'address': [{
        name: 'address',
        type: 'token',
        caption: 'sp.address("tz1...")',
        snippet: 'sp.address("\${1:tz1...address}")'
    }],

    'send_tez': [{
        name: 'smartpy_sp_send',
        type: 'token',
        caption: 'sp.send(dest, amnt)',
        snippet: 'sp.send(\${1:destination_address}, \${2:amount})'    
    }],

    'smartpy_set_delegate': [{
        name: 'smartpy_set_delegate',
        type: 'token',
        caption: 'set_delegate()',
        snippet: `sp.set_delegate(\${1:opt})`
    }],

    'type_mutez': [{
        name: 'mutez_type',
        type: 'token',
        caption: 'sp.mutez',
        snippet: `sp.mutez`
    }],

/*Asserts, Booleans*/

    'smartpy_raise': [{
        name: 'smartpy_raise',
        type: 'token',
        caption: 'raise(value)',
        snippet: `raise(\${1:value})`
    }],


    'assert': [{
        name: 'assert',
        type: 'token',
        caption: 'assert cond',
        snippet: `assert \${1:condition}`
    }],

    'assert_message': [{
        name: 'assert_message',
        type: 'token',
        caption: 'assert cond, err',
        snippet: `assert \${1:condition}, \${2:errorValue}`
    }],

    'and': [{
        name: 'and',
        type: 'token',
        caption: 'and',
        snippet: `and`
    }],

    'or': [{
        name: 'or',
        type: 'token',
        caption: 'or',
        snippet: `or`
    }],

    '^': [{
        name: '^',
        type: 'token',
        caption: '^',
        snippet: `^`
    }],

    'true': [{
        name: 'true',
        type: 'token',
        caption: 'True',
        snippet: `True`
    }],

    'false': [{
        name: 'false',
        type: 'token',
        caption: 'False',
        snippet: `False`
    }],

    '>': [{
        name: '>',
        type: 'token',
        caption: '>',
        snippet: `>`
    }],

    '<': [{
        name: '<',
        type: 'token',
        caption: '<',
        snippet: `<`
    }],

    'less_or_equal': [{
        name: 'less_or_equal',
        type: 'token',
        caption: '<=',
        snippet: `<=`
    }],

    'more_or_equal': [{
        name: 'more_or_equal',
        type: 'token',
        caption: '>=',
        snippet: `>=`
    }],

    'equal_comparator': [{
        name: 'equal_comparator',
        type: 'token',
        caption: '==',
        snippet: `==`
    }],

    '!=': [{
        name: '!=',
        type: 'token',
        caption: '!=',
        snippet: `!=`
    }],

    'boolean_type': [{
        name: 'boolean_type',
        type: 'token',
        caption: 'sp.bool',
        snippet: `sp.bool`
    }],





/* Options */

    'option': [{
        name: 'option',
        type: 'token',
        caption: 'sp.option[v_type]',
        snippet: 'sp.option[\${1:v_type}]'
    }],

    'some': [{
        name: 'some',
        type: 'token',
        caption: 'sp.Some(value)',
        snippet: 'sp.Some(\${1:value})'
    }],

    'none': [{
        name: 'none',
        type: 'token',
        caption: 'None',
        snippet: 'None'
    }],

    'smartpy_unwrap_some': [{
        name: 'smartpy_unwrap_some',
        type: 'token',
        caption: 'opt.unwrap_some()',
        snippet: `\${1:opt}.unwrap_some()`
    }],

    'smartpy_opt_is_none': [{
        name: 'smartpy_opt_is_none',
        type: 'token',
        caption: 'opt.is_none()',
        snippet: `\${1:opt}.is_none()`
    }],

    'smartpy_opt_is_some': [{
        name: 'smartpy_opt_is_some',
        type: 'token',
        caption: 'opt.is_some()',
        snippet: `\${1:opt}.is_some()`
    }],

/*Inter-contract calls - On-chain view*/


    'contract_call': [{
        name: 'contract_call',
        type: 'token',
        caption: 'sp.contract(p, ctr, e)',
        snippet: `sp.contract(\${1:parameterType}, \${2:contractAddress}, entrypoint = "\${3:entrypointName}").unwrap_some()`
    }],

    
    'transfer_of_tez': [{
        name: 'transfer_of_tez',
        type: 'token',
        caption: 'sp.transfer(p, a, ctr)',
        snippet: `sp.transfer(\${1:parameterValue}, \${2:amount}, \${3:contract})`
    }],

    
    'smartpy_sp_view': [{
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
        name: 'pair',
        type: 'token',
        caption: '(a, b)',
        snippet: `(\${1:a}, \${2:b})`
    }],

    'variables_pair': [{
        name: 'variables_pair',
        type: 'token',
        caption: '(x, y) = pair',
        snippet: `(\${1:x}, \${2:y}) = \${3:pair}`
    }],

    'first_element_pair': [{
        name: 'first_element_pair',
        type: 'token',
        caption: 'sp.fst(pair)',
        snippet: `sp.fst(\${1:pair})`
    }],

    'second_element_pair': [{
        name: 'second_element_pair',
        type: 'token',
        caption: 'sp.snd(pair)',
        snippet: `sp.snd(\${1:pair})`
    }],

    'tuple': [{
        name: 'tuple',
        type: 'token',
        caption: '(a, b, c, ...)',
        snippet: `(\${1:a}, \${2:b}, \${3:c})`
    }],

    'variables_tuple': [{
        name: 'variables_tuple',
        type: 'token',
        caption: '(x, y, z, ...) = tuple',
        snippet: `(\${1:x}, \${2:y}, \${3:z}) = \${4:tuple}`
    }],

    'record': [{
        name: 'record',
        type: 'token',
        caption: 'sp.record(f1 = x, ...)',
        snippet: `sp.record(\${1:field1} = \${2:x}, \${3:field2} = \${4:y})`

    }],

    'record_type': [{
        name: 'record_type',
        type: 'token',
        caption: 'sp.record(f1 = t1, ...)',
        snippet: 'sp.record(\${1:field1} = \${2:type1}, \${3:field2} = \${4:type2})'
    }],

    'pair_type': [{
        name: 'pair_type',
        type: 'token',
        caption: 'sp.pair[t1, t2]',
        snippet: `sp.pair[\${1:type1}, \${2:type2}]`
    }],

    'tuple_type': [{
        name: 'tuple_type',
        type: 'token',
        caption: 'sp.tuple[t1, t2, t3, ...]',
        snippet: `sp.tuple[\${1:type1}, \${2:type2}, \${3:type3}]`
    }],




/*Maps / Big maps*/

    'map': [{
        name: 'map',
        type: 'token',
        caption : 'm = {key1 : v1, ...}',
        snippet: `\${1:m} = {\${2:key1} = \${3:value1}, \${4:key2} = \${5:value2}}`
    }],

    'smartpy_big_map': [{
        name: 'smartpy_big_map',
        type: 'token',
        caption: 'm = sp.big_map({})',
        snippet: `\${1:m} = sp.big_map({})`
    }],

    'delete_map_entry': [{
        name: 'delete_map_entry',
        type: 'token',
        caption : 'del m[key]',
        snippet: `del \${1:m}[\${2:key}]`
    }],

    'update_map_entry': [{
        name: 'update_map_entry',
        type: 'token',
        caption : 'm[key] = val',
        snippet: `\${1:m}[\${2:key}] = \${3:newValue} `
    }],

    'access_map_entry': [{
        name: 'access_map_entry',
        type: 'token',
        caption : 'm[key]',
        snippet: `\${1:m}[\${2:key}]`
    }],

    'check_map_key': [{
        name: 'check_map_key',
        type: 'token',
        caption : 'm.contains(key)',
        snippet: `\${1:m}.contains(\${2:key})`
    }],

    'size_map': [{
        name: 'size_map',
        type: 'token',
        caption : 'sp.len(m)',
        snippet: `sp.len(\${1:m})`
    }],

    'smartpy_get_items': [{
        name: 'smartpy_get_items',
        type: 'token',
        caption : 'm.items()',
        snippet: `\${1:m}.items()`
    }],

    'smartpy_get_keys': [{
        name: 'smartpy_get_keys',
        type: 'token',
        caption : 'm.keys()',
        snippet: `\${1:m}.keys()`
    }],

    'smartpy_get_values': [{
        name: 'smartpy_get_values',
        type: 'token',
        caption : 'm.values()',
        snippet: `\${1:m}.values()`
    }],

    'type_map': [{
        name: 'type_map',
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
        name: 'list',
        type: 'token',
        caption: 'lst = [v1, v2, v3, ...]',
        snippet: `\${1:lst} = [\${2:value1}, \${3:value2}, \${4:value3}]`,
    }],

    'list_size': [{
        name: 'list_size',
        type: 'token',
        caption: 'len(lst)',
        snippet: `len(\${1:lst})`,
    }],

    'list_push': [{
        name: 'list_push',
        type: 'token',
        caption: 'lst.push(val)',
        snippet: `\${1:lst}.push(\${2:value})`
    }],

    'smartpy_sp_range': [{
        name: 'smartpy_sp_range',
        type: 'token',
        caption: 'sp.range(begin, end)',
        snippet: `sp.range(\${1:begin}, \${2:end})`
    }],

    'smartpy_sp_sum': [{
        name: 'smartpy_sp_sum',
        type: 'token',
        caption: 'sp.sum(lst)',
        snippet: `sp.sum(\${1:lst})`
    }],

    'list_type': [{
        name: 'list_type',
        type: 'token',
        caption: 'sp.list[type]',
        snippet: `sp.list[\${1:type}]`
    }],

    'set': [{
        name: 'set',
        type: 'token',
        caption: '{value1, value2, ...}',
        snippet: `{\${1:value1}, \${2:value2}}`
    }],

    'set_type': [{
        name: 'set_type',
        type: 'token',
        caption: 'sp.set[type]',
        snippet: `sp.set[\${1:type}]`
    }],

    'smartpy_set_length': [{
        name: 'smartpy_set_length',
        type: 'token',
        caption: 'len(s)',
        snippet: `len(\${1:setName})`
    }],

    'smartpy_set_contains': [{
        name: 'smartpy_set_contains',
        type: 'token',
        caption: 's.contains(v)',
        snippet: `\${1:setName}.contains(\${2:value})`
    }],

    'smartpy_set_elements': [{
        name: 'smartpy_set_elements',
        type: 'token',
        caption: 's.elements()',
        snippet: `\${1:setName}.elements()`
    }],

    'smartpy_set_add': [{
        name: 'smartpy_set_add',
        type: 'token',
        caption: 's.add(value)',
        snippet: `\${1:setName}.add(\${2:value})`
    }],

    'smartpy_set_remove': [{
        name: 'smartpy_set_remove',
        type: 'token',
        caption: 's.remove(value)',
        snippet: `\${1:setName}.remove(\${2:value})`
    }],



/*Bytes*/

    'bytes': [{
        name: 'bytes',
        type: 'token',
        caption: 'sp.bytes',
        snippet: `sp.bytes`
    }],

    'smartpy_sp_slice': [{
        name: 'smartpy_sp_slice',
        type: 'token',
        caption: 'sp.slice(off, len, b)',
        snippet: `sp.slice(\${1:offset}, \${2:length}, \${3:bytes})`
    }],

    'smartpy_sp_concat': [{
        name: 'smartpy_sp_concat',
        type: 'token',
        caption:'sp.concat([b1, b2])',
        snippet: `sp.concat([\${1:bytes1}, \${2:bytes2}])`
    }],

    'smartpy_and_bytes': [{
        name: 'smartpy_and_bytes',
        type: 'token',
        caption: 'sp.and_bytes(b1, b2)',
        snippet: `sp.and_bytes(\${1:b1}, \${2:b2})`
    }],

    'smartpy_or_bytes': [{
        name: 'smartpy_or_bytes',
        type: 'token',
        caption: 'sp.or_bytes(b1, b2)',
        snippet: `sp.or_bytes(\${1:b1}, \${2:b2})`
    }],


    'smartpy_xor_bytes': [{
        name: 'smartpy_xor_bytes',
        type: 'token',
        caption: 'sp.xor_bytes(b1, b2)',
        snippet: `sp.xor_bytes(\${1:b1}, \${2:b2})`
    }],


    'smartpy_invert_bytes': [{
        name: 'smartpy_invert_bytes',
        type: 'token',
        caption: 'sp.invert_bytes(b)',
        snippet: `sp.invert_bytes(\${1:bytes})`
    }],

    'smartpy_lshift_bytes': [{
        name: 'smartpy_lshift_bytes',
        type: 'token',
        caption: 'sp.lshift_bytes(b, sft)',
        snippet: `sp.lshift_bytes(\${1:bytes}, \${2:shiftValue})`
    }],

    'smartpy_rshift_bytes': [{
        name: 'smartpy_rshift_bytes',
        type: 'token',
        caption: 'sp.rshift_bytes(b, sft)',
        snippet: `sp.rshift_bytes(\${1:bytes}, \${2:shiftValue})`
    }],

/* Basic Python*/

    'smartpy_if': [{
        name: 'smartpy_if',
        type: 'token',
        caption: 'if cond:',
        snippet: `if \${1:condition}:`
    }],

    'smartpy_else': [{
        name: 'smartpy_else',
        type: 'token',
        caption: 'else:',
        snippet: `else:`
    }],

    'smartpy_elif': [{
        name: 'smartpy_elif',
        type: 'token',
        caption: 'elif cond:',
        snippet: `elif \${1:condition}:`
    }],

    'smartpy_while': [{
        name: 'smartpy_while',
        type: 'token',
        caption: 'while cond:',
        snippet: `while \${1:condition}:`
    }],

    'smartpy_for': [{
        name: 'smartpy_for',
        type: 'token',
        caption: 'for ...:',
        snippet: `for \${1:value} in \${2:range}: `
    }],

    'smartpy_variable_affectation': [{
        name: 'smartpy_variable',
        type: 'token',
        caption: 'variable = ',
        snippet: `\${1:variableName} = `
    }],


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
                'smart_contract_basic_python': 'Basic Python',
            },
            description: {

                /*Contract*/
                'smartpy_import': "import smartpy, creates module",
                'smartpy_contract_creation': "creates contract",
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
                'int_declaration': "creates an int value",
                'smartpy_to_int': "converts nat to int",
                'smartpy_is_nat': "sp.Some(a) if >= 0    None if < 0",
                'smartpy_as_nat': "Fails if a < 0",
                'int_type': "type",

                /*Types*/
                'smartpy_sp_cast': "specifies val's type to help type inference", 
                'custom_type': "type definition (place in module only)",
                'smartpy_convert_to_tez': "converts int/nat to tez. Not recommended",
                'unit_type': "unit type",
                'smartpy_()': "unit value (nothing)",

                /*Arithmetic*/
                'addition': "if the types are the same",
                'addition_multitypes': "if the types are different",
                'divide': " integer division",
                'modulo_multitypes': "➔ remainder of a / b",
                'euclidian_multitypes': "➔ option on pair (quotient, remainder)",
                'smartpy_split_tokens': "➔ (a*q) / t as tez",
                'shorthand_operators': "shorthand operators",

                /*Strings*/
                'smartpy_slice': "extracts a substring      returns an option",
                'string_type': "type",

                /*Timestamps*/
                'timestamp_from_seconds': "creates a timestamp as seconds since 1/1/1970",
                'smartpy_timestamp_from_utc': "creates a timestamp from a utc date",
                'current_timestamp': "timestamp of the block",
                'difference_timestamp': "difference in seconds between timestamps",
                'timestamp_type': "type",


                /*Addresses - Transactions - Delegation*/
                'sender': "address of direct caller",
                'amount': "amount transferred to the contract by the caller",
                'balance': "balance of the contract",
                'address': " ➔ hard coded address",
                'smartpy_sp_send': "transfer of tez",
                'mutez_type': "type",

                /*Asserts, Booleans*/
                'smartpy_raise': "fails immediately", 
                'assert_message': "specifies error value",
                'boolean_type': "type",
                '^': "exclusive or",

                /*Options*/
                'option': "type",
                'some':"option with value",
                'none': "option with no value",
                'smartpy_unwrap_some': "extract value of an option. Fails if None.",
                'smartpy_opt_is_none': "➔ opt == None",
                'smartpy_opt_is_some': "➔ opt != None",

                /*Inter-contract*/
                'contract_call': "obtains contract entrypoint",
                'transfer_of_tez': "calls entrypoint",
                'smartpy_sp_view': "calls on-chain view",

                /*Pairs - Tuples - Records*/
                'pair': "creates a pair",
                'variables_pair': "destructures a pair into two variables",
                'first_element_pair': "➔ first element",
                'second_element_pair': "➔ second element",
                'tuple': "creates a tuple",
                'variables_tuple': "destructures a tuple",
                'record': "creates a record",
                'record_type': "type",
                
                /*Maps / Big-maps */
                'map': "creates a map",
                'type_map': "type",
                'update_map_entry': "adds or updates an entry",
                'access_map_entry': "gets entry value",
                'check_map_key': "True if key is in m",
                'size_map': "➔ number of elements (map only)",
                'smartpy_get_items': "➔ list of pairs (key, val)",
                'smartpy_get_keys': "➔ list of keys",
                'smartpy_get_values': "➔ list of values",

                /* Lists - Sets*/
                'list': "list of values of the same type",
                'list_push': "inserts at the beginning",
                'smartpy_sp_range': "➔[begin, ..., end - 1]",
                'smartpy_sp_sum': "➔ sum of all elements",
                'set': "set of distincts values of the same type",
                'set_type': "type",
                'list_type': "type",
                'smartpy_set_elements': "➔ list of values",

                /* Bytes */
                'smartpy_sp_slice': "➔ sp.Some(extract)     or None if invalid",
                'smartpy_and_bytes': "binary AND of b1 and b2",
                'smartpy_invert_bytes': "inverts every bit",
                'smartpy_lshift_bytes': "left shift of b by sft bits",
                'bytes': "type"
            },
        },
    },
    notionsList: {
        // category: [list of notion names]
        "smart_contract_contract": [
            "smartpy_import", 
            "smartpy_contract_creation",
            "smartpy_self_data_value",
            "smartpy_entry_point", 
            "smartpy_onchain_view"
        ],

        "smart_contract_tests": [
            "smartpy_test_starter", 
            "smartpy_scenario_creation", 
            "smartpy_contract_instantiation", 
            "smartpy_adding_to_scenario", 
            "smartpy_contract_entrypointcall", 
            "smartpy_test_account", 
            "smartpy_test_address", 
            "smartpy_public_key_hash", 
            "smartpy_public_key", 
            "smartpy_secret_key", 
            "smartpy_scenario_show", 
            "smartpy_scenario_verify", 
            "smartpy_scenario_verify_equal", 
            "smartpy_contract_data", 
            "smartpy_contract_balance", 
            "smartpy_contract_baker", 
            "smartpy_contract_address", 
            "smartpy_trace", 
            "smartpy_scenario_h", 
            "smartpy_test_some", 
            "smartpy_test_none", 
            "smartpy_test_unwrap_option"
        ],

        "smart_contract_int_nat": [
            "int_declaration", 
            "nat_declaration", 
            "smartpy_to_int", 
            "smartpy_is_nat", 
            "smartpy_as_nat", 
            "int_type", 
            "nat_type", 
        ],

        "smart_contract_types": [
            "smartpy_sp_cast", 
            "custom_type", 
            "smartpy_convert_to_tez", 
            "()", 
            "unit_type"
        ],  

        "smart_contract_arithmetic": [
            "addition", 
            "addition_multitypes", 
            "substraction", 
            "substraction_multitypes", 
            "multiply", 
            "multiplication_multitypes", 
            "divide",
            "modulo_multitypes", 
            "euclidian_multitypes", 
            "smartpy_split_tokens", 
            "shorthand_operators"
        ],        

        "smart_contract_strings": [
            "string", 
            "string_concatenate", 
            "smartpy_slice", "length", 
            "string_addition", 
            "string_type"
        ],

        "smart_contract_timestamps": [
            "current_timestamp",  
            "timestamp_from_seconds", 
            "smartpy_timestamp_from_utc",
            "smartpy_add_seconds", 
            "smartpy_add_days", 
            "difference_timestamp", 
            "timestamp_type"
        ],          

        "smart_contract_addresses_transactions": [
            "sp.tez", 
            "sp.mutez", 
            "sender", 
            "amount", 
            "balance", 
            "address", 
            "send_tez", 
            "smartpy_set_delegate", 
            "type_mutez"
        ],

        "smart_contract_asserts_booleans":[
            "smartpy_raise", 
            "assert", 
            "assert_message", 
            "and", 
            "or", 
            "not", 
            "^", 
            "true", 
            "false", 
            ">", 
            "<", 
            "less_or_equal", 
            "more_or_equal", 
            "equal_comparator", 
            "!=", 
            "boolean_type"
        ],

        "smart_contract_options": [
            "some", 
            "none", 
            "smartpy_unwrap_some", 
            "smartpy_opt_is_none", 
            "smartpy_opt_is_some", 
            "option"
        ],

        "smart_contract_inter_contract": [
            "contract_call", 
            "transfer_of_tez", 
            "smartpy_sp_view"
        ],

        "smart_contract_pairs_tuples_records": [
            "pair", 
            "variables_pair", 
            "first_element_pair", 
            "second_element_pair", 
            "tuple", 
            "variables_tuple", 
            "record", 
            "record_type", 
            "pair_type", 
            "tuple_type"
        ],       
       
        "smart_contract_maps_big_maps": [
            "map", 
            "smartpy_big_map", 
            "delete_map_entry", 
            "update_map_entry", 
            "access_map_entry", 
            "check_map_key",
            "size_map", 
            "smartpy_get_items", 
            "smartpy_get_keys", 
            "smartpy_get_values", 
            "type_map", 
            "type_big_map"
        ],    
        
        "smart_contract_lists_sets": [
            "list", 
            "list_size", 
            "list_push", 
            "smartpy_sp_range", 
            "smartpy_sp_sum", 
            "list_type", 
            "set", 
            "smartpy_set_length", 
            "smartpy_set_contains", 
            "smartpy_set_elements", 
            "smartpy_set_add", 
            "smartpy_set_remove",
            "set_type"
        ],  
        
        "smart_contract_bytes": [
            "smartpy_sp_slice", 
            "smartpy_sp_concat", 
            "smartpy_and_bytes", 
            "smartpy_or_bytes", 
            "smartpy_xor_bytes", 
            "smartpy_invert_bytes", 
            "smartpy_lshift_bytes", 
            "smartpy_rshift_bytes", 
            "bytes"
        ],

        "smart_contract_basic_python": [
            "smartpy_if", 
            "smartpy_else", 
            "smartpy_elif", 
            "smartpy_while", 
            "smartpy_for", 
            "smartpy_variable"
        ]
    },


    conceptsList: [

        {id: 'contract', name:'Smart contract', isCategory: true},

        {
            id: 'smartpy_import',
            name: 'Smartpy import',
            url: conceptBaseUrl + "#smartpy_import",
            categoryId: 'contract'
        },

        {
            id: 'smartpy_contract_creation', // Must be the name of the notion
            name: 'Contract creation',
            url: conceptBaseUrl + '#smartpy_contract_creation', // Must be the value of data-id in the documentation
            categoryId: 'contract'
        },


        {
            name: 'Storage initialization',
            id: 'smartpy_self_data_value',
            url: conceptBaseUrl + '#smartpy_self_data_value',
            categoryId: 'contract'
            
        },

        {
            id: 'smartpy_entry_point',
            name: 'Entrypoint',
            url: conceptBaseUrl + '#smartpy_entry_point',
            categoryId: 'contract'
        },


        {
            id: 'smartpy_onchain_view',
            name: 'Onchain view',
            url: conceptBaseUrl + "#smartpy_onchain_view",
            categoryId: 'contract'
        },

/* Testing */

        {id: 'testing', name:'Testing', isBase: true, isCategory: true},

        {
            id: 'smartpy_test_starter',
            name: 'Test starter',
            url: conceptBaseUrl + '#smartpy_test_starter',
            categoryId: 'testing'
        },

        {
            id: 'smartpy_scenario_creation',
            name: 'Scenario creation',
            url: conceptBaseUrl + '#smartpy_scenario_creation',
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_instantiation',
            name: 'Contract instanciation',
            url: conceptBaseUrl + '#smartpy_contract_instantiation',
            categoryId: 'testing'
        },

        {
            id: 'smartpy_adding_to_scenario',
            name: 'Adding to scenario',
            url: conceptBaseUrl + '#smartpy_adding_to_scenario',
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_entrypointcall',
            name: 'Call an entrypoint',
            url: conceptBaseUrl + '#smartpy_contract_entrypointcall',
            categoryId: 'testing'
        },

        {
            id: 'smartpy_test_unwrap_option',
            name: 'Test unwrap option',
            url: conceptBaseUrl + "#smartpy_test_unwrap_option",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_test_account',
            name: 'Test account',
            url: conceptBaseUrl + "#smartpy_test_account",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_test_address',
            name: 'Address for test',
            url: conceptBaseUrl + "#smartpy_test_address",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_public_key_hash',
            name: 'Public key hash',
            url: conceptBaseUrl + "#smartpy_public_key_hash",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_public_key',
            name: 'Public key',
            url: conceptBaseUrl + "#smartpy_public_key",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_secret_key',
            name: 'Secret key',
            url: conceptBaseUrl + "#smartpy_secret_key",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_test_some',
            name: 'Some in tests',
            url: conceptBaseUrl + "#smartpy_test_some",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_scenario_verify',
            name: 'Verify a value in tests',
            url: conceptBaseUrl + "#smartpy_scenario_verify",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_scenario_verify_equal',
            name: 'Verify equality without arithmetic',
            url: conceptBaseUrl + "#smartpy_scenario_verify_equal",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_data',
            name: 'Contract storage',
            url: conceptBaseUrl + "#smartpy_contract_data",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_balance',
            name: 'Contract balance in tests',
            url: conceptBaseUrl + "#smartpy_contract_balance",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_baker',
            name: 'Contract baker in tests',
            url: conceptBaseUrl + "#smartpy_contract_baker",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_contract_address',
            name: 'Contract address in tests',
            url: conceptBaseUrl + "#smartpy_contract_address",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_scenario_h',
            name: 'Scenario title',
            url: conceptBaseUrl + "#smartpy_scenario_h",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_test_none',
            name: 'None for test',
            url: conceptBaseUrl + "#smartpy_test_none",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_scenario_show',
            name: 'Scenario show',
            url: conceptBaseUrl + "#smartpy_scenario_show",
            categoryId: 'testing'
        },

        {
            id: 'smartpy_trace',
            name: 'Trace',
            url: conceptBaseUrl + "#smartpy_trace",
            categoryId: 'testing'
        },


/*Int - Nat - Tez*/

        {id: 'int_nat', name:'Int, Nat', isBase: true, isCategory: true},

        {
            id: 'int_declaration',
            name: 'Int value',
            url: conceptBaseUrl + "#int_declaration",
            categoryId: 'int_nat'
        },

        {
            id: 'nat_declaration',
            name: 'Nat declaration',
            url: conceptBaseUrl + "#nat_declaration",
            categoryId: 'int_nat'
        },

        {
            id: 'sp_to_int',
            name: 'sp_to_int',
            url: conceptBaseUrl + '#sp_to_int',
            categoryId: 'int_nat'
        },

        {
            id: 'sp_is_nat',
            name: 'sp_is_nat',
            url: conceptBaseUrl + '#sp_is_nat',
            categoryId: 'int_nat'
        },

        {
            id: 'sp_as_nat',
            name: 'sp_as_nat',
            url: conceptBaseUrl + '#sp_as_nat',
            categoryId: 'int_nat'
        },

        {
            id: 'int_type',
            name: 'int_type',
            url: conceptBaseUrl + '#int_type',
            categoryId: 'int_nat'
        },

        {
            id: 'nat_type',
            name: 'nat_type',
            url: conceptBaseUrl + '#nat_type',
            categoryId: 'int_nat'
        },

/* Types */

        {
            id: 'smartpy_sp_cast',
            name: 'smartpy_sp_cast',
            url: conceptBaseUrl + "#smartpy_sp_cast"
        },

        {
            id: 'unit_type',
            name: 'unit_type',
            url: conceptBaseUrl + "#unit_type"
        },

        {
            id: '()',
            name: '()',
            url: conceptBaseUrl + "#()"
        },

        {
            id: 'custom_type',
            name: 'custom_type',
            url: conceptBaseUrl + "#custom_type"
        },

        {
            id: 'smartpy_convert_to_tez',
            name: 'smartpy_convert_to_tez',
            url: conceptBaseUrl + "#convert_to_tez"
        },

        {
            id: '',
            name: '',
            url: conceptBaseUrl + "#smart_"
        },

/*Arithmetic*/

        {id: 'arithmetic', name:'Arithmetic', isBase: true, isCategory: true},

        {
            id: 'addition',
            name: 'Addition',
            url: conceptBaseUrl + '#addition',
            categoryId: 'arithmetic'
        },

        {
            id: 'addition_multitypes',
            name: 'Addition multitypes',
            url: conceptBaseUrl + '#addition_multitypes',
            categoryId: 'arithmetic'
        },

        {
            id: 'substraction',
            name: 'Substraction',
            url: conceptBaseUrl + '#substraction',
            categoryId: 'arithmetic'
        },

        {
            id:'substraction_multitypes',
            name:'Substraction multitypes',
            url: conceptBaseUrl + '#substraction_multitypes',
            categoryId: 'arithmetic'
        },

        {
            id: 'multiply',
            name: 'Multiplication',
            url: conceptBaseUrl + '#multiply',
            categoryId: 'arithmetic'
        },

        {
            id: 'multiplication_multitypes',
            name: 'Multiplication multitypes',
            url: conceptBaseUrl + '#multiplication_multitypes',
            categoryId: 'arithmetic'
        },

        {
            id: 'modulo',
            name: 'Modulo',
            url: conceptBaseUrl + '#modulo',
            categoryId: 'arithmetic'
        },

        {
            id: 'divide',
            name: 'Division',
            url: conceptBaseUrl + '#divide',
            categoryId: 'arithmetic'
        },

        {
            id: 'euclidian_multitypes',
            name: 'Euclidian division multitypes',
            url: conceptBaseUrl + '#euclidian_multitypes',
            categoryId: 'arithmetic'
        },

        {
            id: 'smartpy_split_tokens',
            name: 'Split tokens',
            url: conceptBaseUrl + "#smartpy_split_tokens",
            categoryId: 'arithmetic'
        },

        {
            id: 'shorthand_operators',
            name: 'Shorthand operators',
            url: conceptBaseUrl + "#shorthand_operators",
            categoryId: 'arithmetic'
        },

/*Strings*/

        {id: 'strings', name:'Strings', isBase: true, isCategory: true},


        {
            id: 'string',
            name: 'String',
            url: conceptBaseUrl + "#string",
            categoryId: 'strings'
        },

        {
            id: 'string_concatenate',
            name: 'String concatenation',
            url: conceptBaseUrl + '#string_concatenate',
            categoryId: 'strings'
        },

        {
            id: 'smartpy_slice',
            name: 'String slice',
            url: conceptBaseUrl + '#smartpy_slice',
            categoryId: 'strings'
        },

        {
            id: 'length',
            name: 'String length',
            url: conceptBaseUrl + '#length',
            categoryId: 'strings'
        },

        {
            id: 'string_addition',
            name: 'String addition',
            url: conceptBaseUrl + "#string_addition",
            categoryId: 'strings'
        },

        {
            id: 'string_type',
            name: 'String type',
            url: conceptBaseUrl + '#string_type',
            categoryId: 'strings'
        },


/*Timestamps*/

        {
            id: 'timestamp_from_seconds',
            name: 'timestamp_from_seconds',
            url: conceptBaseUrl + '#timestamp_from_seconds'
        },

        {
            id: 'current_timestamp',
            name: 'current_timestamp',
            url: conceptBaseUrl + '#current_timestamp'
        },

        {
            id: 'smartpy_timestamp_from_utc',
            name: 'smartpy_timestamp_from_utc',
            url: conceptBaseUrl + '#smartpy_timestamp_from_utc'
        },

        {
            id: 'smartpy_add_seconds',
            name: 'smartpy_add_seconds',
            url: conceptBaseUrl + '#smartpy_add_seconds'
        },

        {
            id: 'smartpy_add_days',
            name: 'smartpy_add_days',
            url: conceptBaseUrl + '#smartpy_add_days'
        },

        {
            id: 'difference_timestamp',
            name: 'difference_timestamp',
            url: conceptBaseUrl  + '#difference_timestamp'
        },

        {
            id: 'timestamp_type',
            name: 'timestamp_type',
            url: conceptBaseUrl + '#timestamp_type',
        },


/*Addresses - Transactions - Delegation*/

        {
            id: 'tez',
            name: 'tez',
            url: conceptBaseUrl + '#tez'
        },

        {
            id: 'mutez',
            name: 'mutez',
            url: conceptBaseUrl + '#mutez'
        },

        {
            id: 'sender',
            name: 'sender',
            url: conceptBaseUrl + '#sender'
        },

        {
            id: 'amount',
            name: 'amount',
            url: conceptBaseUrl + "#amount"
        },

        {
            id: 'balance',
            name: 'balance', 
            url: conceptBaseUrl + "#balance"
        },


        {
            id: 'address',
            name: 'address',
            url: conceptBaseUrl + "#address"
        },

        {
            id: 'send_tez',
            name: 'send_tez',
            url: conceptBaseUrl + "#smart_sp_send"
        },

        {
            id: 'smartpy_set_delegate',
            name: 'smartpy_set_delegate',
            url: conceptBaseUrl + '#smartpy_set_delegate'
        },

        {
            id: 'type_mutez',
            name: 'type_mutez',
            url: conceptBaseUrl + "#type_mutez"
        },

/* Asserts, Booleans*/

        {id: 'asserts_booleans', name:'Asserts, Booleans', isBase: true, isCategory: true},

        {
            id: 'raise',
            name: 'Raise',
            url: conceptBaseUrl + "#raise",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'assert',
            name: 'Assert',
            url: conceptBaseUrl + "#assert",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'assert_message',
            name: 'Assert with error value',
            url: conceptBaseUrl + "#assert_message",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'and',
            name: 'And',
            url: conceptBaseUrl + "#and",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'or',
            name: 'Or',
            url: conceptBaseUrl + "#or",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'not',
            name: 'Not',
            url: conceptBaseUrl + "#not",
            categoryId: 'asserts_booleans'
        },

        {
            id: '^',
            name: '^',
            url: conceptBaseUrl + "#^",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'true',
            name: 'True',
            url: conceptBaseUrl + "#true",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'false',
            name: 'False',
            url: conceptBaseUrl + "#false",
            categoryId: 'asserts_booleans'
        },

        {
            id: '>',
            name: '>',
            url: conceptBaseUrl + "#>",
            categoryId: 'asserts_booleans'
        },

        {
            id: '<',
            name: '<',
            url: conceptBaseUrl + "#<",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'less_or_equal',
            name: '<=',
            url: conceptBaseUrl + "#less_or_equal",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'more_or_equal',
            name: '>=',
            url: conceptBaseUrl + "#more_or_equal",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'equal_comparator',
            name: '==',
            url: conceptBaseUrl + "#equal_comparator",
            categoryId: 'asserts_booleans'
        },

        {
            id: '!=',
            name: '!=',
            url: conceptBaseUrl + "#!=",
            categoryId: 'asserts_booleans'
        },

        {
            id: 'boolean_type',
            name: 'Boolean type',
            url: conceptBaseUrl + "#boolean_type",
            categoryId: 'asserts_booleans'
        },


/* Options */

        {
            id: 'option',
            name: 'option',
            url: conceptBaseUrl + "#option"
        },

        {
            id: 'some',
            name: 'some',
            url: conceptBaseUrl + "#some"
        },

        {
            id: 'none',
            name: 'none',
            url: conceptBaseUrl + "#none"
        },

        {
            id: 'smartpy_unwrap_some',
            name: 'smartpy_unwrap_some',
            url: conceptBaseUrl + "#smartpy_unwrap_some"
        },

        {
            id: 'smartpy_opt_is_none',
            name: 'smartpy_opt_is_none',
            url: conceptBaseUrl + "#smartpy_opt_is_none"
        },

        {
            id: 'smartpy_opt_is_some',
            name: 'smartpy_opt_is_some',
            url: conceptBaseUrl + "#smartpy_opt_is_some"
        },

/*Inter-contract*/

        {
            id: 'contract_call',
            name: 'contract_call',
            url: conceptBaseUrl + "#contract_call"
        },

        {
            id: 'transfer_of_tez',
            name: 'transfer_of_tez',
            url: conceptBaseUrl + "#transfer_of_tez"
        },

        {
            id: 'smartpy_sp_view',
            name: 'smartpy_sp_view',
            url: conceptBaseUrl + "#smartpy_sp_view"
        },

/*Pairs - Tuples - Records*/

        {
            id: 'pair',
            name: 'pair',
            url: conceptBaseUrl + "#pair"
        },

        {
            id: 'variables_pair',
            name: 'variables_pair',
            url: conceptBaseUrl + "#variables_pair"
        },

        {
            id: 'first_element_pair',
            name: 'first_element_pair',
            url: conceptBaseUrl + "#first_element_pair"
        },

        {
            id: 'second_element_pair',
            name: 'second_element_pair',
            url: conceptBaseUrl + "#second_element_pair"
        },

        {
            id: 'tuple',
            name: 'tuple',
            url: conceptBaseUrl + "#tuple"
        },

        {
            id: 'variables_tuple',
            name: 'variables_tuple',
            url: conceptBaseUrl + "#variables_tuple"
        },

        {
            id: 'record',
            name: 'record',
            url: conceptBaseUrl + "#record"
        },

        {
            id: 'record_type',
            name: 'record_type',
            url: conceptBaseUrl + "#record_type"
        },

        {
            id: 'pair_type',
            name: 'pair_type',
            url: conceptBaseUrl + "#pair_type"
        },

        {
            id: 'tuple_type',
            name: 'tuple_type',
            url: conceptBaseUrl + "#tuple_type"
        },


/*Maps / Big-maps*/
        
        {
            id: 'map',
            name: 'map',
            url: conceptBaseUrl + "#map"
        },

        {
            id: 'smartpy_big_map',
            name: 'smartpy_big_map',
            url: conceptBaseUrl + "#smartpy_big_map"
        },

        {
            id: 'type_map',
            name: 'type_map',
            url: conceptBaseUrl + "#type_map"
        },

        {
            id: 'type_big_map',
            name: 'type_big_map',
            url: conceptBaseUrl + "#type_big_map"
        },

        {
            id: 'delete_map_entry',
            name: 'delete_map_entry',
            url: conceptBaseUrl + "#delete_map_entry"
        },

        {
            id: 'update_map_entry',
            name: 'update_map_entry',
            url: conceptBaseUrl + "#update_map_entry"
        },

        {
            id: 'access_map_entry',
            name: 'access_map_entry',
            url: conceptBaseUrl + "#access_map_entry"
        },

        {
            id: 'check_map_key',
            name: 'check_map_key',
            url: conceptBaseUrl + "#check_map_key"
        },

        {
            id: 'size_map',
            name: 'size_map',
            url: conceptBaseUrl + "#size_map"
            
        },

        {
            id: 'smartpy_get_items',
            name: 'smartpy_get_items',
            url: conceptBaseUrl + "#smartpy_get_items"
            
        },

        {
            id: 'smartpy_get_keys',
            name: 'smartpy_get_keys',
            url: conceptBaseUrl + "#smartpy_get_keys"
            
        },

        {
            id: 'smartpy_get_values',
            name: 'smartpy_get_values',
            url: conceptBaseUrl + "#smartpy_get_values"
            
        },

/* Sets, Lists*/

        {
            id: 'list',
            name: 'list',
            url: conceptBaseUrl + "#list"
        },

        {
            id: 'list_size',
            name: 'list_size',
            url: conceptBaseUrl + "#list_size"
        },

        {
            id: 'list_push',
            name: 'list_push',
            url: conceptBaseUrl + "#list_push"
        },

        {
            id: 'smartpy_sp_range',
            name: 'smartpy_sp_range',
            url: conceptBaseUrl + "#smartpy_sp_range"
        },

        {
            id: 'smartpy_sp_sum',
            name: 'smartpy_sp_sum',
            url: conceptBaseUrl + "#smartpy_sp_sum"
        },
        {
            id: 'smartpy_list_type',
            name: 'smartpy_list_type',
            url: conceptBaseUrl + "#smartpy_list_type"
        },

        {
            id: 'set',
            name: 'set',
            url: conceptBaseUrl + "#set"
        },

        {
            id: 'set_type',
            name: 'set_type',
            url: conceptBaseUrl + "#set_type"
        },

        {
            id: 'smartpy_set_length',
            name: 'smartpy_set_length',
            url: conceptBaseUrl + "#smartpy_set_length"
        },

        {
            id: 'smartpy_set_contains',
            name: 'smartpy_set_contains',
            url: conceptBaseUrl + "#smartpy_set_contains"
        },

        {
            id: 'smartpy_set_elements',
            name: 'smartpy_set_elements',
            url: conceptBaseUrl + "#smartpy_set_elements"
        },

        {
            id: 'smartpy_set_add',
            name: 'smartpy_set_add',
            url: conceptBaseUrl + "#smartpy_set_add"
        },

        {
            id: 'smartpy_set_remove',
            name: 'smartpy_set_remove',
            url: conceptBaseUrl + "#smartpy_set_remove"
        },

/* Bytes */

        {
            id: 'bytes',
            name: 'bytes',
            url: conceptBaseUrl + "#bytes"
        },

        {
            id: 'smartpy_sp_slice',
            name: 'smartpy_sp_slice',
            url: conceptBaseUrl + "#smartpy_sp_slice"
        },

        {
            id: 'smartpy_sp_concat',
            name: 'smartpy_sp_concat',
            url: conceptBaseUrl + "#smartpy_sp_concat"
        },

        {
            id: 'smartpy_and_bytes',
            name: 'smartpy_and_bytes',
            url: conceptBaseUrl + "#smartpy_and_bytes"
        },

        {
            id: 'smartpy_or_bytes',
            name: 'smartpy_or_bytes',
            url: conceptBaseUrl + "#smartpy_or_bytes"
        },

        {
            id: 'smartpy_xor_bytes',
            name: 'smartpy_xor_bytes',
            url: conceptBaseUrl + "#smartpy_xor_bytes"
        },

        {
            id: 'smartpy_invert_bytes',
            name: 'smartpy_invert_bytes',
            url: conceptBaseUrl + "#smartpy_invert_bytes"
        },

        {
            id: 'smartpy_lshift_bytes',
            name: 'smartpy_lshift_bytes',
            url: conceptBaseUrl + "#smartpy_lshift_bytes"
        },

        {
            id: 'smartpy_rshift_bytes',
            name: 'smartpy_rshift_bytes',
            url: conceptBaseUrl + "#smartpy_rshift_bytes"
        },


/* Basic Python */

        {
            id: 'smartpy_if',
            name: 'smartpy_if',
            url: conceptBaseUrl + "#smartpy_if"
        },

        {
            id: 'smartpy_else',
            name: 'smartpy_else',
            url: conceptBaseUrl + "#smartpy_else"
        },

        {
            id: 'smartpy_elif',
            name: 'smartpy_elif',
            url: conceptBaseUrl + "#smartpy_elif"
        },

        {
            id: 'smartpy_while',
            name: 'smartpy_while',
            url: conceptBaseUrl + "#smartpy_while"
        },

        {
            id: 'smartpy_for',
            name: 'smartpy_for',
            url: conceptBaseUrl + "#smartpy_for"
        },

        {
            id: 'smartpy_variable',
            name: 'smartpy_variable',
            url: conceptBaseUrl + "#smartpy_variable"
        },

    ],


    smartContractsBlocksList: smartContractsBlocksList,
};



