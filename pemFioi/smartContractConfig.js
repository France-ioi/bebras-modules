const conceptBaseUrl = (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//'
    + 'static4.castor-informatique.fr/help/smart_contracts.html';

const smartPyBlocksList = {
    'smart_contract': [{
        name: 'smartpy_smart_contract',
        type: 'token',
        caption: 'Smart contract',
        snippet: `import smartpy as sp

class \${1:name}(sp.Contract):
    def __init__(self, value):
        self.init(storage=value)

sp.add_compilation_target("default", \${1:name}())`,
    }],
    'entry_point': [{
        name: 'smartpy_entry_point',
        type: 'token',
        caption: 'Entry point',
        snippet: `@sp.entry_point
def make_call(self):
    `,
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

let main = ([store]: [storage]) : return_ => {
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
                'smart_contract_main_blocks': "Main blocks",
                'smart_contract_types': "Types",
            },
            description: {
            },
        },
    },
    notionsList: {
        // category: [list of notion names]
        "smart_contract_main_blocks": ["smart_contract", "entry_point"],
        "smart_contract_types": ["pairs"],
    },
    conceptsList: [
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
    ],
    smartContractsBlocksList: smartContractsBlocksList,
};
