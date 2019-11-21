var getContext = function(display, infos, curLevel) {

    var language_strings = {
        en: {
            categories: {
                database: 'Database'
            },
            label: {
                loadTable: 'loadTable(%1)',
                loadTableFromCsv: 'loadTableFromCsv(%1)',
                loadTableFromCsvWithTypes: 'loadTableFromCsv(%1, %2)',
                getRecords: 'getRecords(%1)',
                selectByColumn: 'selectByColumn(%1, %2, %3)',
                selectByFunction: 'selectByFunction(%1, %2)',
                selectTopRows: 'selectTopRows(%1, %2)',
                getColumn: 'getColumn(%1, %2)',
                sortByColumn: 'sortByColumn(%1, %2, %3)',
                sortByFunction: 'sortByFunction(%1, %2)',
                selectColumns: 'selectColumns(%1, %2)',
                joinTables: 'joinTables(%1, %2, %3, %4, %5)',
                displayTable: 'displayTable(%1)',
                updateWhere: 'updateWhere(%1, %2, %3)',
                insertRecord: 'insertRecord(%1, %2)',
                unionTables: 'unionTables(%1, %2)',
                displayRecord: 'displayRecord(%1)',
                displayTableOnMap: 'displayTableOnMap(%1, %2, %3, %4)',
                printConsole: 'printConsole(%1)',
                displayTableOnGraph: 'displayTableOnGraph(%1, %2, %3, %4, %5)',
                displayTablesOnGraph: 'displayTablesOnGraph(%1, %2, %3, %4, %5, %6, %7)'
            },
            code: {
                loadTable: 'loadTable',
                loadTableFromCsv: 'loadTableFromCsv',
                loadTableFromCsvWithTypes: 'loadTableFromCsvWithTypes',
                getRecords: 'getRecords',
                selectByColumn: 'selectByColumn',
                selectByFunction: 'selectByFunction',
                selectTopRows: 'selectTopRows',
                getColumn: 'getColumn',
                sortByColumn: 'sortByColumn',
                sortByFunction: 'sortByFunction',
                selectColumns: 'selectColumns',
                joinTables: 'joinTables',
                displayTable: 'displayTable',
                updateWhere: 'updateWhere',
                insertRecord: 'insertRecord',
                unionTables: 'unionTables',
                displayRecord: 'displayRecord',
                displayTableOnMap: 'displayTableOnMap',
                printConsole: 'printConsole',
                displayTableOnGraph: 'displayTableOnGraph',
                displayTablesOnGraph: 'displayTablesOnGraph'
            },
            description: {
                loadTable: 'EN text text %loadTable(...) text %loadTable loadTable',
                loadTableFromCsv: 'loadTableFromCsv()',
                loadTableFromCsvWithTypes: 'loadTableFromCsvWithTypes()',
                getRecords: 'getRecords()',
                selectByColumn: 'selectByColumn()',
                selectByFunction: 'selectByFunction()',
                selectTopRows: 'selectTopRows()',
                getColumn: 'getColumn()',
                sortByColumn: 'sortByColumn()',
                sortByFunction: 'sortByFunction()',
                selectColumns: 'selectColumns()',
                joinTables: 'joinTables()',
                displayTable: 'displayTable()',
                updateWhere: 'updateWhere()',
                insertRecord: 'insertRecord()',
                unionTables: 'unionTables()',
                displayRecord: 'displayRecord()',
                displayTableOnMap: 'displayTableOnMap()',
                printConsole: 'printConsole()',
                displayTableOnGraph: 'displayTableOnGraph()',
                displayTablesOnGraph: 'displayTablesOnGraph()'
            },
            startingBlockName: "Programme",
            constantLabel: {
                asc: 'asc',
                desc: 'desc',
                inner: 'inner',
                outer: 'outer',
                left: 'left',
                right: 'right',
                line: 'line chart',
                bar: 'bar graph',
                plot: 'scatter plot'
            },
            messages: {
                table_not_found: 'Table not found: ',
                file_not_found: 'CSV file not found: ',
                incorrect_results: 'Incorrect results',
                some_results_missing: 'Some results are missing',
                success: 'Success'
            },
            ui: {
                'btn_diplay_table': 'Display',
                'btn_files_repository': 'Add CSV files...',
                'files_repository': {
                    'caption': 'CSV files list',
                    'hint': 'Use file number as param for loadTableFromCsv function. Allowed CSV files with ; delimiter only.',
                    'add': 'Add',
                    'incompatible_browser': 'Incompatible browser',
                    'confirm_overwrite': 'Overwrite files?',
                    'file_not_found': 'File not found: '
                },
                'db_helper': {
                    'renderer_html_rows_limit': 'Only the first %1 records are displayed'
                }
            }
        },
        fr: {
            categories: {
                database: 'Base de données'
            },
            label: {
                loadTable: 'charger la table(%1)',
                loadTableFromCsv: 'charger la table depuis le csv(%1)',
                loadTableFromCsvWithTypes: 'charger la table avec types depuis le csv(%1, %2)',
                getRecords: 'getRecords(%1)',
                selectByColumn: 'filtrer selon la colonne(%1, %2, %3)',
                selectByFunction: 'filtrer selon la fonction(%1, %2)',
                selectTopRows: 'sélectionner les lignes du haut(%1, %2)',
                getColumn: 'getColumn(%1, %2)',
                sortByColumn: 'trier selon la colonne(%1, %2, %3)',
                sortByFunction: 'sortByFunction(%1, %2)',
                selectColumns: 'sélectionner les colonnes(%1, %2)',
                joinTables: 'joindre les tables(%1, %2, %3, %4, %5)',
                displayTable: 'afficher la table(%1)',
                updateWhere: 'updateWhere(%1, %2, %3)',
                insertRecord: 'insérer l\'enregistrement(%1, %2)',
                unionTables: 'unionTables(%1, %2)',
                displayRecord: 'afficher l\'enregistrement(%1)',
                displayTableOnMap: 'visualiser la table sur une carte(%1, %2, %3, %4)',
                printConsole: 'afficher dans la console(%1)',
                displayTableOnGraph: 'visualiser la table sur un graphe(%1, %2, %3, %4, %5)',
                displayTablesOnGraph: 'visualiser les tables sur un graphe(%1, %2, %3, %4, %5, %6, %7)'
            },
            code: {
                loadTable: 'loadTable',
                loadTableFromCsv: 'loadTableFromCsv',
                loadTableFromCsvWithTypes: 'loadTableFromCsvWithTypes',
                getRecords: 'getRecords',
                selectByColumn: 'selectByColumn',
                selectByFunction: 'selectByFunction',
                selectTopRows: 'selectTopRows',
                getColumn: 'getColumn',
                sortByColumn: 'sortByColumn',
                sortByFunction: 'sortByFunction',
                selectColumns: 'selectColumns',
                joinTables: 'joinTables',
                displayTable: 'displayTable',
                updateWhere: 'updateWhere',
                insertRecord: 'insertRecord',
                unionTables: 'unionTables',
                displayRecord: 'displayRecord',
                displayTableOnMap: 'displayTableOnMap',
                printConsole: 'printConsole',
                displayTableOnGraph: 'displayTableOnGraph',
                displayTablesOnGraph: 'displayTablesOnGraph'
            },
            description: {
                loadTable: '%loadTable(tableName) : retourne la table dont le nom est passé en paramètre sous forme de chaîne de caractères.',
                loadTableFromCsv: '%loadTableFromCsv()',
                loadTableFromCsvWithTypes: '%loadTableFromCsvWithTypes()',
                getRecords: '%getRecords()',
                selectByColumn: 'selectByColumn(table, columnName, value) : retourne une table avec les enregistrements de la table initiale, qui ont la valeur \'value\' dans la colonne \'columnName\'.',
                selectByFunction: '%selectByFunction()',
                selectTopRows: '%selectTopRows()',
                getColumn: '%getColumn()',
                sortByColumn: '%sortByColumn(table,columnName,direction) : retourne une table avec les enregistrements de la table initiale triés. Le deuxième paramètre est une chaîne de caractères qui indique la colonne à considérer pour le tri. Le tri peut être ascendant: "asc" ou descendant: "desc".',
                sortByFunction: '%sortByFunction()',
                selectColumns: '%selectColumns(table,columnsList) : retourne une table constituée des colonnes de la table initiale qui sont listées en second paramètre. L’ordre des colonnes de la table retournée est celui des éléments de la liste passée en paramètre.',
                joinTables: '%joinTables(table1, column1, table2, column2, type) : retourne une table qui est la jointure des deux tables passées en paramètre. La jointure se fait sur les colonnes \'column1\' et \'column2\'. Le type est à choisir parmi \'inner\', \'outer\', \'left\' et \'right\'.',
                displayTable: '%displayTable(table) : permet d\'afficher la table passée en paramètre dans la zone de visualisation.',
                updateWhere: '%updateWhere()',
                insertRecord: '%insertRecord()',
                unionTables: '%unionTables()',
                displayRecord: '%displayRecord()',
                displayTableOnMap: '%displayTableOnMap(table,nameColumn,longitudeColumn,latitudeColumn) : permet de visualiser les éléments de la colonne passée en deuxième paramètre sur une carte.',
                printConsole: '%printConsole()',
                displayTableOnGraph: '%displayTableOnGraph()',
                displayTablesOnGraph: '%displayTablesOnGraph()'
            },
            startingBlockName: "Programme",
            constantLabel: {
                asc: 'asc',
                desc: 'desc',
                inner: 'inner',
                outer: 'outer',
                left: 'left',
                right: 'right',
                line: 'courbe',
                bar: 'barres',
                plot: 'points'
            },
            messages: {
                table_not_found: '' +
                    'Table non trouvée: ',
                file_not_found: 'CSV file non trouvée: ',
                incorrect_results: 'Résultats incorrects',
                some_results_missing: 'Il manque une partie des résultats',
                success: 'Succès'
            },
            ui: {
                'btn_diplay_table': 'Visualiser',
                'btn_files_repository': 'Ajouter des CSV...',
                'files_repository': {
                    'caption': 'Liste des fichiers CSV',
                    'hint': 'Utilisez le numéro de fichier comme paramètre de la fonction loadTableFromCsv. Seuls les fichiers CSV utilisant ; comme délimiteur sont acceptés.',
                    'add': 'Ajouter',
                    'incompatible_browser': 'Navigateur incompatible',
                    'confirm_overwrite': 'Overwrite files?',
                    'file_not_found': 'File not found: '
                },
                'db_helper': {
                    'renderer_html_rows_limit': 'Seuls les %1 premiers enregistrements sont affichés'
                }
            }
        }
    }
    language_strings = BlocksHelper.mutateBlockStrings(
        language_strings,
        infos.blocksLanguage
    )

    var context = quickAlgoContext(display, infos)

    var strings = context.setLocalLanguageStrings(language_strings)
    var task_tables = {};
    var ready = false;

    var conceptBaseUrl = window.location.protocol + '//static4.castor-informatique.fr/help/index.html';
    context.conceptList = [
        {id: 'database_introduction', name: 'Database - introduction', url: conceptBaseUrl+'#database_introduction'},
        {id: 'database_load', name: 'Tables - chargement', url: conceptBaseUrl+'#database_load'},
        {id: 'database_visualisation', name: 'Tables - visualisation', url: conceptBaseUrl+'#database_visualisation'},
        {id: 'database_process', name: 'Tables - manipulation', url: conceptBaseUrl+'#database_process'},
    ];


    // Tell quickAlgoInterface to display message popups as inline
    context.inlinePopupMessage = true;


    var tables_list = {

        elements: {},
        tables: {},
        callback: null,


        init: function(params) {
            this.elements.box = $('<div class="pull_left" style="display: none"></div>');

            this.elements.select = $('<select></select>');
            this.elements.box.append(this.elements.select);

            var btn = $('<button class="btn">' + strings.ui.btn_diplay_table + '</button>');
            btn.on('click', this.displayTable.bind(this));
            this.elements.box.append(btn);

            var visible = this.renderOptions(params.tables) > 0;
            this.elements.box.toggle(visible);

            params.parent.prepend(this.elements.box);

            this.callback = params.callback;
        },


        displayTable: function() {
            var opt = this.elements.select.find('option:selected');
            this.callback(opt.val());
        },


        renderOptions: function(tables) {
            var cnt = 0;
            this.elements.select.empty();
            for(var name in tables.task) {
                if(tables.task[name].public) {
                    this.elements.select.append('<option value="'+ name +'">' + name + '</option>');
                    cnt++;
                }
            }
            return cnt;
        }
    }



    context.reset = function(taskInfos) {
        if(taskInfos) {
            task_tables = taskInfos.tables || {};
        }

        if(ready) {
            return;
        }
        ready = true;


        task_files.initLevel({
            strings: strings.ui.files_repository,
            level: curLevel
        });

        if(context.display) {
            window.db_helper && window.db_helper.destroy();
        }

        window.db_helper = new DatabaseHelper(
            Object.assign({
                parent: $('#grid'),
                strings: strings.ui.db_helper
            }, infos.databaseConfig)
        );


        if(!context.display) return;

        $('#grid').prepend('<div id="database_controls"></div>');

        if(!infos.databaseConfig['disable_csv_import']) {
            var btn = $('<button class="btn pull_right" id="btn_files">' + strings.ui.btn_files_repository + '</button>');
            btn.click(function() {
                task_files.open();
            })
            $('#database_controls').append(btn)
        }

        tables_list.init({
            parent: $('#database_controls'),
            callback: function(filename, is_imported) {
                if(is_imported) {
                    var file = task_files.getFile(filename);
                    db_helper.loadCsv(file, [], function(table) {
                        db_helper.displayTable(table, true);
                    });
                } else {
                    var table = Table(task_tables[filename]);
                    db_helper.displayTable(table, true);
                }
            },
            tables: {
                task: task_tables,
                imported: []
            }
        });


        /*
        context.blocklyHelper.loadExample({
            blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="xLC,-=/@KAQ[.hz?OV:h" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="displayTable" id="VdvCAZO?CsIU?U_arMsl"><value name="PARAM_0"><block type="loadTable" id="HbABJ+[UOm0O(0`[}+S7"><value name="PARAM_0"><shadow type="text" id="2QX-i)zyR}Znz+D/vI3R"><field name="TEXT">test_table</field></shadow></value></block></value></block></next></block></xml>'
        });
        */



        //subTask.blocklyHelper.loadExample(exampleObj ? exampleObj : subTask.levelGridInfos.example);
        /*
                //test html render
                setTimeout(function() {
                    context.database.loadTable('test_table', function(table, callback) {
                        context.database.displayTable(table, null, function() {
                            context.expectTable('valid_table')
                        });
                    })
                }, 1500);
        */
        /*
                //test map render
                setTimeout(function() {
                    context.database.loadTable('valid_table3', function(table, callback) {
                        context.database.displayTableOnMap(table, 'nom', 'longitude', 'latitude', function() {
                            context.expectTable('valid_table3');
                        });

                    })
                }, 500)
        */
    }




    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}


    context.expectTable = function(name) {
        if(name in task_tables) {
            var table = Table(task_tables[name]);
            var status = db_helper.validateResultByTable(table);
            if(status === true) {
                context.success = true;
                throw strings.messages.success;
                return;
            }
            context.success = false;
            throw new Error(strings.messages[status]);
        } else {
            context.success = false;
            console.error('Table not found: ' + name)
        }
    }

    context.expectHash = function(hash) {
        var status = db_helper.validateResultByHash(hash);
        if(status === true) {
            context.success = true;
            throw strings.messages.success;
            return;
        }
        context.success = false;
        throw new Error(strings.messages[status]);
    }




    context.database = {

        loadTable: function(name, callback) {
            if(!task_tables[name] || !task_tables[name].public) throw new Error(strings.messages.table_not_found + name);
            context.waitDelay(callback, Table(task_tables[name]));
        },


        loadTableFromCsvWithTypes: function(filename, types, callback) {
            if(infos.databaseConfig['disable_csv_import']) {
                throw new Error('CSV import disabled');
            }
            var file = task_files.getFile(filename);
            if(file === null) {
                throw new Error(strings.messages.file_not_found + fileNumber);
            }
            var types_arr = Array.from(types);
            db_helper.loadCsv(file, types_arr, function(table) {
                context.waitDelay(callback, table);
            });
        },

        loadTableFromCsv: function(filename, callback) {
            context.database.loadTableFromCsvWithTypes(filename, [], callback);
        },

        getRecords: function(table, callback) {
            context.waitDelay(callback, table.getRecords());
        },

        selectByColumn: function(table, columnName, value, callback) {
            context.waitDelay(callback, table.selectByColumn(columnName, value));
        },

        selectByFunction: function(table, filterFunction, callback) {
            table.selectByFunction(filterFunction, function(val) {
                context.waitDelay(callback, val);
            });
        },

        selectTopRows: function(table, amount, callback) {
            context.waitDelay(callback, table.selectTopRows(amount));
        },

        getColumn: function(record, columnName, callback) {
            if(columnName in record) {
                context.waitDelay(callback, record[columnName]);
            } else {
                throw new Error('Column ' + columnName + ' not found');
            }
        },

        sortByColumn: function(table, columnName, direction, callback) {
            context.waitDelay(callback, table.sortByColumn(columnName, direction));
        },

        sortByFunction: function(table, compareFunction, callback) {
            table.sortByFunction(compareFunction, function(val) {
                context.waitDelay(callback, val);
            });
        },

        selectColumns: function(table, columns, callback) {
            context.waitDelay(callback, table.selectColumns(columns));
        },

        joinTables: function(table1, column1, table2, column2, type, callback) {
            context.waitDelay(callback, table1.join(column1, table2, column2, type));
        },

        displayTable: function(table, callback) {
            if (Array.isArray(table)) {table = db_helper.listToTable(table);}
            db_helper.displayTable(table, context.display);
            context.waitDelay(callback);
        },

        updateWhere: function(table, filterFunction, updateFunction, callback) {
            context.waitDelay(callback, table.updateWhere(filterFunction, updateFunction));
        },

        insertRecord: function(table, record, callback) {
            context.waitDelay(callback, table.insertRecord(record));
        },

        unionTables: function(table1, table2, callback) {
            context.waitDelay(callback, table1.union(table2));
        },

        displayRecord: function(record, callback) {
            var res = {
                columnNames: Object.keys(record),
                records: [
                    Object.values(record),
                ]
            };
            res.columnTypes = Array.apply(null, Array(res.records[0].length)).map(function() {
                return 'string';
            });
            var table = Table(res);
            db_helper.displayTable(table, context.display);
            context.waitDelay(callback);
        },

        displayTableOnMap: function(table, nameColumn, longitudeColumn, latitudeColumn, callback) {
            db_helper.displayTableOnMap(
                table.selectColumns([nameColumn, longitudeColumn, latitudeColumn]),
                context.display
            );
            context.waitDelay(callback);
        },

        printConsole: function(text, callback) {
            db_helper.displayConsole(text, context.display);
            context.waitDelay(callback);
        },

        displayTableOnGraph: function(table, nameColumn, minY, maxY, type, callback) {
            if (Array.isArray(table)) {table = db_helper.listToTable(table);nameColumn = 'value';}
            db_helper.displayTableOnGraph(
                table.selectColumns([nameColumn]),
                minY,maxY,type,context.display
            );
            context.waitDelay(callback);
        },

        displayTablesOnGraph: function(table, nameColumn1, minX, maxX, nameColumn2, minY, maxY, callback) {
            if (Array.isArray(table)) {table = db_helper.listToTable(table);nameColumn1 = 'index';nameColumn2 = 'value';}
            db_helper.displayTablesOnGraph(
                table.selectColumns([nameColumn1,nameColumn2]),
                minX, maxX, minY, maxY
            );
            context.waitDelay(callback);
        },
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
                    params: ['String'],
                    params_names: ['file', 'columnTypes'],
                    yieldsValue: true
                },
                { name: 'loadTableFromCsvWithTypes',
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
                    params: ['Block', 'Function'],
                    params_names: ['table', 'filterFunction'],
                    yieldsValue: true
                },
                { name: 'selectTopRows',
                    params: ['Block', 'Number'],
                    params_names: ['table', 'amount'],
                    yieldsValue: true
                },
                { name: 'getColumn',
                    params: ['Block', 'String'],
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
                    params: ['Block', 'Block'],
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
                    params: ['Block', 'Block'],
                    params_names: ['table', 'record'],
                    yieldsValue: true
                },
                { name: 'unionTables',
                    params: ['Block', 'Block'],
                    params_names: ['table', 'table'],
                    yieldsValue: true
                },
                { name: 'displayTable',
                    params: ['Block'],
                    params_names: ['table'],
                },
                { name: 'displayRecord',
                    params: ['Block'],
                    params_names: ['record']
                },
                { name: 'displayTableOnMap',
                    params: ['Block', 'String','String', 'String'],
                    params_names: ['table', 'nameColumn', 'longitudeColumn', 'latitudeColumn'],
                },
                { name: 'displayTableOnGraph',
                    params: ['Block', 'String', 'Number', 'Number', 'GraphType'],
                    params_names: ['table', 'nameColumn', 'minY', 'maxY', 'type'],
                },
                { name: 'displayTablesOnGraph',
                    params: ['Block', 'String', 'Number', 'Number', 'String', 'Number', 'Number'],
                    params_names: ['table', 'nameColumn1', 'minX', 'maxX', 'nameColumn2', 'minY', 'maxY'],
                },
            ],
            texts: [
                { name: 'printConsole',
                    params: ['String'],
                    params_names: ['text'],
                },
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
        'GraphType': { bType: 'field_dropdown', defVal: 'line', options: [
                [strings.constantLabel.line, 'line'],
                [strings.constantLabel.bar, 'bar'],
                [strings.constantLabel.plot, 'plot']
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


window.task_files = new FilesRepository({
    reader: 'text',
    extensions: '.csv'
});
