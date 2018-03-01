var getContext = function(display, infos) {

    var language_strings = {
        fr: {
            categories: {
                database: 'Database'
            },
            label: {
                loadTable: 'loadTable(%1)',
                loadTableFromCsv: 'loadTableFromCsv(%1, %2)',
                getRecords: 'getRecords(%1)',
                selectByColumn: 'selectByColumn(%1, %2, %3)',
                selectByFunction: 'selectByFunction(%1, %2)',
                getColumn: 'getColumn(%1, %2)',
                sortByColumn: 'sortByColumn(%1, %2, %3)',
                sortByFunction: 'sortByFunction(%1, %2)',
                selectColumns: 'selectColumns(%1, %2)',
                joinTables: 'joinTables(%1, %2, %3, %4, %5)',
                displayTable: 'displayTable(%1, %2)',
                updateWhere: 'updateWhere(%1, %2, %3)',
                insertRecord: 'insertRecord(%1, %2)',
                unionTables: 'unionTables(%1, %2)',
                displayRecord: 'displayRecord(%1)',
                displayTableOnMap: 'displayTableOnMap(%1, %2, %3, %4)'
            },
            code: {
                loadTable: 'loadTable',
                loadTableFromCsv: 'loadTableFromCsv',
                getRecords: 'getRecords',
                selectByColumn: 'selectByColumn',
                selectByFunction: 'selectByFunction',
                getColumnL: 'getColumn',
                sortByColumn: 'sortByColumn',
                sortByFunction: 'sortByFunction',
                selectColumns: 'selectColumns',
                joinTables: 'joinTables',
                displayTable: 'displayTable',
                updateWhere: 'updateWhere',
                insertRecord: 'insertRecord',
                unionTables: 'unionTables',
                displayRecord: 'displayRecord',
                displayTableOnMap: 'displayTableOnMap'
            },
            description: {
                loadTable: 'loadTable',
                loadTableFromCsv: 'loadTableFromCsv',
                getRecords: 'getRecords',
                selectByColumn: 'selectByColumn',
                selectByFunction: 'selectByFunction',
                getColumnL: 'getColumn',
                sortByColumn: 'sortByColumn',
                sortByFunction: 'sortByFunction',
                selectColumns: 'selectColumns',
                joinTables: 'joinTables',
                displayTable: 'displayTable',
                updateWhere: 'updateWhere',
                insertRecord: 'insertRecord',
                unionTables: 'unionTables',
                displayRecord: 'displayRecord',
                displayTableOnMap: 'displayTableOnMap'
            },
            startingBlockName: "Programme",
            constantLabel: {
                asc: 'asc',
                desc: 'desc',
                inner: 'inner',
                outer: 'outer',
                left: 'left',
                right: 'right'
            },
            messages: {
                tableNotFound: 'Table not found: ',
                invalidResult: ''
            },
            ui: {
                'btn_files_repository': 'Add CSV files...',
                'files_repository': {
                    'caption': 'CSV files list',
                    'hint': 'Use file number as param for loadTableFromCsv function. Allowed CSV files with ; delimiter only.',
                    'add': 'Add',
                    'incompatible_browser': 'Incompatible browser'
                }
            }
        }
    }



    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(language_strings)
    var task_tables = {};
    var files, db_helper;
    var ready = false;

    context.reset = function(taskInfos) {
        if(!context.display) return;

        if(taskInfos) {
            task_tables = taskInfos.tables || {};
        }

        if(ready) return;
        ready = true;

        files = new FilesRepository({
            extensions: '.csv',
            parent: $('#taskContent'),
            strings: strings.ui.files_repository
        });

        db_helper = new DatabaseHelper(
            Object.assign({
                parent: $('#grid')
            }, infos.databaseOptions)
        );


        var html =
            '<div id="db_controls" style="text-align: left;">' +
                '<button class="btn btn-xs" style="float: right" id="btn_files">' + strings.ui.btn_files_repository + '</button>' +
            '</div>';
        $('#testSelector').prepend($(html))
        $('#btn_files').click(function() {
            files.show();
        })
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}
    context.changeDelay = function(actionDelay) {}
    context.onExecutionEnd = function() {}


    context.expectTable = function(name) {
        if(name in task_tables) {
            var table = Table(task_tables[name]);
            db_helper.validateDisplay(table);
        }
    }


    context.database = {

        loadTable: function(name, callback) {
            if(!task_tables[name]) throw new Error(strings.messages.tableNotFound + name);
            callback(
                Table(task_tables[name])
            );
        },


        loadTableFromCsv: function(fileNumber, types, callback) {
            var file = files.getFile(fileNumber - 1);
            var types_arr = Array.from(types.properties);
            db_helper.loadCsv(file, types_arr, function(table) {
                context.waitDelay(function() {
                    callback(table)
                });
            });
        },

        getRecords: function(table, callback) {
            callback(
                table.getRecords()
            );
        },

        selectByColumn: function(table, columnName, value, callback) {
            callback(
                table.selectByColumn(columnName, value)
            );
        },

        selectByFunction: function(table, filterFunction, callback) {
            callback(
                table.selectByFunction(filterFunction)
            );
        },

        getColumn: function(record, columnName, callback) {
            if(columnName in record) {
                callback(record[columnName]);
            } else {
                throw new Error('Column ' + columnName + ' not found');
            }
        },

        sortByColumn: function(table, columnName, direction, callback) {
            callback(
                table.sortByColumn(columnName, direction)
            );
        },

        sortByFunction: function(table, compareFunction, callback) {
            callback(
                table.sortByFunction(compareFunction)
            )
        },

        selectColumns: function(table, columns, callback) {
            callback(
                table.selectColumns(columns)
            )
        },

        joinTables: function(table1, column1, table2, column2, type, callback) {
            callback(
                table1.join(column1, table2, column2, type)
            )
        },

        displayTable: function(table, columns, callback) {
            var columns_arr = Array.from(columns.properties);
            db_helper.displayTable(
                table.selectColumns(columns_arr)
            )
            callback();
        },

        updateWhere: function(table, filterFunction, updateFunction, callback) {
            callback(
                table.updateWhere(filterFunction, updateFunction)
            );
        },

        insertRecord: function(table, record, callback) {
            callback(
                table.insertRecord(record)
            );
        },

        unionTables: function(table1, table2, callback) {
            callback(
                table1.union(table2)
            );
        },

        displayRecord: function(record, callback) {
            var res = {
                columnNames: Object.keys(record),
                records: [
                    Object.values(record),
                ]
            }
            res.columnTypes = Array.apply(null, Array(length)).map(function() {
                return 'string';
            })
            var table = Table(res)
            db_helper.displayTable(table);
            callback();
        },


        displayTableOnMap: function(table, nameColumn, longitudeColumn, latitudeColumn, callback) {
            db_helper.displayTableOnMap(
                table.selectColumns(nameColumn, longitudeColumn, latitudeColumn),
                function() {
                    context.waitDelay(callback);
                }
            );
        }
    }



    context.customBlocks = {
        database: {
            database: [
                { name: 'loadTable',
                    params: ['String'],
                    params_names: ['table_name'],
                    yieldsValue: true
                },
                { name: 'loadTableFromCsv',
                    params: ['String', 'Block'],
                    params_names: ['file', 'columnTypes'],
                    yieldsValue: true
                },
                { name: 'getRecords',
                    params: ['Block'],
                    params_names: ['table'],
                    yieldsValue: true
                },
                { name: 'selectByColumn',
                    params: ['Block', 'String', 'String'],
                    params_names: ['table', 'columnName', 'value'],
                    yieldsValue: true
                },
                { name: 'selectByFunction',
                    params: ['Block', 'String'],
                    params_names: ['table', 'filterFunction'],
                    yieldsValue: true
                },
                { name: 'getColumn',
                    params: ['String', 'String'],
                    params_names: ['record', 'columnName'],
                    yieldsValue: true
                },
                { name: 'sortByColumn',
                    params: ['Block', 'String', 'SortOrder'],
                    params_names: ['table', 'columnName', 'direction'],
                    yieldsValue: true
                },
                { name: 'sortByFunction',
                    params: ['Block', 'String'],
                    params_names: ['table', 'compareFunction'],
                    yieldsValue: true
                },
                { name: 'selectColumns',
                    params: ['Block', 'String'],
                    params_names: ['table', 'columns'],
                    yieldsValue: true
                },
                { name: 'joinTables',
                    params: ['Block', 'String', 'Block', 'String', 'JoinType'],
                    params_names: ['table', 'columnName', 'table', 'columnName', 'type'],
                    yieldsValue: true
                },
                { name: 'updateWhere',
                    params: ['Block', 'String', 'String'],
                    params_names: ['table', 'filterFunction', 'updateFunction'],
                    yieldsValue: true
                },
                { name: 'insertRecord',
                    params: ['Block', 'String'],
                    params_names: ['table', 'record'],
                    yieldsValue: true
                },
                { name: 'unionTables',
                    params: ['Block', 'Block'],
                    params_names: ['table', 'table'],
                    yieldsValue: true
                },
                { name: 'displayTable',
                    params: ['Block', 'Block'],
                    params_names: ['table', 'columns'],
                },
                { name: 'displayRecord',
                    params: ['Block'],
                    params_names: ['record']
                },
                { name: 'displayTableOnMap',
                    params: ['Block', 'String','String', 'String'],
                    params_names: ['table', 'nameColumn', 'longitudeColumn', 'latitudeColumn'],
                }
            ]
        }
    }

    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
        'Block': { bType: 'input_value', fName: 'BLOCK', defVal: '' },
        'SortOrder': { bType: 'field_dropdown', defVal: 'asc', options: [
            [strings.constantLabel.asc, 'asc'],
            [strings.constantLabel.desc, 'desc']
        ]},
        'JoinType': { bType: 'field_dropdown', defVal: 'inner', options: [
            [strings.constantLabel.inner, 'inner'],
            [strings.constantLabel.outer, 'outer'],
            [strings.constantLabel.left, 'left'],
            [strings.constantLabel.right, 'right']
        ]}
    }

    BlocksHelper.convertBlocks(context, 'database', typeData);

    return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('database', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['database', getContext]);
}
