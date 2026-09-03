var getContext = function(display, infos, curLevel) {

    var language_strings = {
        en: {
            categories: {
                database: 'Database',
                histogram: 'Histograms'
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
                displayTablesOnGraph: 'displayTablesOnGraph(%1, %2, %3, %4, %5, %6, %7)',
                initHistogram: 'initHistogram(%1, %2)',
                setHistogramBar: 'setHistogramBar(%1, %2, %3)'
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
                displayTablesOnGraph: 'displayTablesOnGraph',
                initHistogram: 'initHistogram',
                setHistogramBar: 'setHistogramBar'
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
                displayTablesOnGraph: 'displayTablesOnGraph()',
                initHistogram: 'initHistogram()',
                setHistogramBar: 'setHistogramBar()'                
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
                database: 'Base de données',
                histogram: 'Histograms'
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
                displayTablesOnGraph: 'visualiser les tables sur un graphe(%1, %2, %3, %4, %5, %6, %7)',
                initHistogram: 'initHistogram(%1, %2)',
                setHistogramBar: 'setHistogramBar(%1, %2, %3)'                
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
                displayTablesOnGraph: 'displayTablesOnGraph',
                initHistogram: 'initHistogram',
                setHistogramBar: 'setHistogramBar'                
            },
            description: {
                loadTable: '%loadTable(tableName) : renvoie la table dont le nom est passé en paramètre sous forme de chaîne de caractères.',
                loadTableFromCsv: '%loadTableFromCsv(csvFileName) : renvoie une table avec les données du fichier csv entré en paramètre sous forme de chaîne de caractères.',
                loadTableFromCsvWithTypes: '%loadTableFromCsvWithTypes()',
                getRecords: '%getRecords()',
                selectByColumn: 'selectByColumn(table, columnName, value) : renvoie une table avec les enregistrements de la table initiale, qui ont la valeur \'value\' dans la colonne \'columnName\'.',
                selectByFunction: '%selectByFunction()',
                selectTopRows: '%selectTopRows(table, nbRows) : renvoie une table avec les nbRows premiers enregistrements de la table initiale.',
                getColumn: '%getColumn()',
                sortByColumn: '%sortByColumn(table,columnName,direction) : renvoie une table avec les enregistrements de la table initiale triés. Le deuxième paramètre est une chaîne de caractères qui indique la colonne à considérer pour le tri. Le tri peut être ascendant: "asc" ou descendant: "desc".',
                sortByFunction: '%sortByFunction()',
                selectColumns: '%selectColumns(table,columnsList) : renvoie une table constituée des colonnes de la table initiale qui sont listées en second paramètre. L’ordre des colonnes de la table retournée est celui des éléments de la liste passée en paramètre.',
                joinTables: '%joinTables(table1, column1, table2, column2, type) : renvoie une table qui est la jointure des deux tables passées en paramètre. La jointure se fait sur les colonnes \'column1\' et \'column2\'. Le type est à choisir parmi \'inner\', \'outer\', \'left\' et \'right\'.',
                displayTable: '%displayTable(table) : permet d\'afficher la table passée en paramètre dans la zone de visualisation.',
                updateWhere: '%updateWhere()',
                insertRecord: '%insertRecord(table, record) : renvoie la table initiale avec l\'enregistrement passé en paramètre ajouté. Cet enregistrement est entré sous la forme d\'une liste.',
                unionTables: '%unionTables()',
                displayRecord: '%displayRecord()',
                displayTableOnMap: '%displayTableOnMap(table,nameColumn,longitudeColumn,latitudeColumn) : permet de visualiser les éléments de la colonne passée en deuxième paramètre sur une carte.',
                printConsole: '%printConsole()',
                displayTableOnGraph: '%displayTableOnGraph()',
                displayTablesOnGraph: '%displayTablesOnGraph()',
                initHistogram: '%initHistogram()',
                setHistogramBar: '%setHistogramBar()'                
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
        },
        nl: {
            categories: {
                database: 'Database',
                histogram: 'Histogrammen'
            },
            label: {
                loadTable: 'laad tabel(%1)',
                loadTableFromCsv: 'laad tabel uit csv(%1)',
                loadTableFromCsvWithTypes: 'laad tabel met types uit csv(%1, %2)',
                getRecords: 'getRecords(%1)',
                selectByColumn: 'filter op kolom(%1, %2, %3)',
                selectByFunction: 'filter op functie(%1, %2)',
                selectTopRows: 'selecteer bovenste rijen(%1, %2)',
                getColumn: 'getColumn(%1, %2)',
                sortByColumn: 'sorteer op kolom(%1, %2, %3)',
                sortByFunction: 'sortByFunction(%1, %2)',
                selectColumns: 'selecteer kolommen(%1, %2)',
                joinTables: 'verbind tabellen(%1, %2, %3, %4, %5)',
                displayTable: 'toon tabel(%1)',
                updateWhere: 'updateWhere(%1, %2, %3)',
                insertRecord: 'voeg record toe(%1, %2)',
                unionTables: 'unionTables(%1, %2)',
                displayRecord: 'toon record(%1)',
                displayTableOnMap: 'toon tabel op kaart(%1, %2, %3, %4)',
                printConsole: 'schrijf naar console(%1)',
                displayTableOnGraph: 'toon tabel op grafiek(%1, %2, %3, %4, %5)',
                displayTablesOnGraph: 'toon tabellen op grafiek(%1, %2, %3, %4, %5, %6, %7)',
                initHistogram: 'initHistogram(%1, %2)',
                setHistogramBar: 'setHistogramBar(%1, %2, %3)'
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
                displayTablesOnGraph: 'displayTablesOnGraph',
                initHistogram: 'initHistogram',
                setHistogramBar: 'setHistogramBar'
            },
            description: {
                loadTable: '%loadTable(tableName) : geeft de tabel terug waarvan de naam als tekenreeks is doorgegeven.',
                loadTableFromCsv: '%loadTableFromCsv(csvFileName) : geeft een tabel terug met de gegevens uit het csv-bestand dat als tekenreeks is doorgegeven.',
                loadTableFromCsvWithTypes: '%loadTableFromCsvWithTypes()',
                getRecords: '%getRecords()',
                selectByColumn: 'selectByColumn(table, columnName, value) : geeft een tabel terug met de records van de oorspronkelijke tabel die de waarde \'value\' hebben in de kolom \'columnName\'.',
                selectByFunction: '%selectByFunction()',
                selectTopRows: '%selectTopRows(table, nbRows) : geeft een tabel terug met de eerste nbRows records van de oorspronkelijke tabel.',
                getColumn: '%getColumn()',
                sortByColumn: '%sortByColumn(table,columnName,direction) : geeft een tabel terug met de records van de oorspronkelijke tabel, gesorteerd. De tweede parameter is een tekenreeks die de kolom voor de sortering aangeeft. De sortering kan oplopend zijn: "asc" of aflopend: "desc".',
                sortByFunction: '%sortByFunction()',
                selectColumns: '%selectColumns(table,columnsList) : geeft een tabel terug die bestaat uit de kolommen van de oorspronkelijke tabel die in de tweede parameter staan. De volgorde van de kolommen in de teruggegeven tabel is die van de elementen in de doorgegeven lijst.',
                joinTables: '%joinTables(table1, column1, table2, column2, type) : geeft een tabel terug die de join is van de twee doorgegeven tabellen. De join gebeurt op de kolommen \'column1\' en \'column2\'. Het type kies je uit \'inner\', \'outer\', \'left\' en \'right\'.',
                displayTable: '%displayTable(table) : toont de doorgegeven tabel in het visualisatiegebied.',
                updateWhere: '%updateWhere()',
                insertRecord: '%insertRecord(table, record) : geeft de oorspronkelijke tabel terug met het doorgegeven record toegevoegd. Dit record wordt als een lijst doorgegeven.',
                unionTables: '%unionTables()',
                displayRecord: '%displayRecord()',
                displayTableOnMap: '%displayTableOnMap(table,nameColumn,longitudeColumn,latitudeColumn) : toont de elementen van de kolom die als tweede parameter is doorgegeven op een kaart.',
                printConsole: '%printConsole()',
                displayTableOnGraph: '%displayTableOnGraph()',
                displayTablesOnGraph: '%displayTablesOnGraph()',
                initHistogram: '%initHistogram()',
                setHistogramBar: '%setHistogramBar()'
            },
            startingBlockName: "Programma",
            constantLabel: {
                asc: 'asc',
                desc: 'desc',
                inner: 'inner',
                outer: 'outer',
                left: 'left',
                right: 'right',
                line: 'lijndiagram',
                bar: 'staafdiagram',
                plot: 'puntenwolk'
            },
            messages: {
                table_not_found: 'Tabel niet gevonden: ',
                file_not_found: 'CSV-bestand niet gevonden: ',
                incorrect_results: 'Foute resultaten',
                some_results_missing: 'Er ontbreken resultaten',
                success: 'Gelukt'
            },
            ui: {
                'btn_diplay_table': 'Tonen',
                'btn_files_repository': 'CSV-bestanden toevoegen...',
                'files_repository': {
                    'caption': 'Lijst van CSV-bestanden',
                    'hint': 'Gebruik het bestandsnummer als parameter voor de functie loadTableFromCsv. Enkel CSV-bestanden met ; als scheidingsteken zijn toegelaten.',
                    'add': 'Toevoegen',
                    'incompatible_browser': 'Incompatibele browser',
                    'confirm_overwrite': 'Bestanden overschrijven?',
                    'file_not_found': 'Bestand niet gevonden: '
                },
                'db_helper': {
                    'renderer_html_rows_limit': 'Alleen de eerste %1 records worden getoond'
                }
            }
        },
        de: {
            categories: {
                database: 'Datenbank',
                histogram: 'Histogramme'
            },
            label: {
                loadTable: 'Tabelle laden(%1)',
                loadTableFromCsv: 'Tabelle aus CSV laden(%1)',
                loadTableFromCsvWithTypes: 'Tabelle mit Typen aus CSV laden(%1, %2)',
                getRecords: 'getRecords(%1)',
                selectByColumn: 'nach Spalte filtern(%1, %2, %3)',
                selectByFunction: 'nach Funktion filtern(%1, %2)',
                selectTopRows: 'obere Zeilen auswählen(%1, %2)',
                getColumn: 'getColumn(%1, %2)',
                sortByColumn: 'nach Spalte sortieren(%1, %2, %3)',
                sortByFunction: 'sortByFunction(%1, %2)',
                selectColumns: 'Spalten auswählen(%1, %2)',
                joinTables: 'Tabellen verbinden(%1, %2, %3, %4, %5)',
                displayTable: 'Tabelle anzeigen(%1)',
                updateWhere: 'updateWhere(%1, %2, %3)',
                insertRecord: 'Datensatz einfügen(%1, %2)',
                unionTables: 'unionTables(%1, %2)',
                displayRecord: 'Datensatz anzeigen(%1)',
                displayTableOnMap: 'Tabelle auf Karte anzeigen(%1, %2, %3, %4)',
                printConsole: 'in Konsole ausgeben(%1)',
                displayTableOnGraph: 'Tabelle auf Diagramm anzeigen(%1, %2, %3, %4, %5)',
                displayTablesOnGraph: 'Tabellen auf Diagramm anzeigen(%1, %2, %3, %4, %5, %6, %7)',
                initHistogram: 'initHistogram(%1, %2)',
                setHistogramBar: 'setHistogramBar(%1, %2, %3)'
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
                displayTablesOnGraph: 'displayTablesOnGraph',
                initHistogram: 'initHistogram',
                setHistogramBar: 'setHistogramBar'
            },
            description: {
                loadTable: '%loadTable(tableName) : gibt die Tabelle zurück, deren Name als Zeichenkette übergeben wurde.',
                loadTableFromCsv: '%loadTableFromCsv(csvFileName) : gibt eine Tabelle mit den Daten der als Zeichenkette übergebenen CSV-Datei zurück.',
                loadTableFromCsvWithTypes: '%loadTableFromCsvWithTypes()',
                getRecords: '%getRecords()',
                selectByColumn: 'selectByColumn(table, columnName, value) : gibt eine Tabelle mit den Datensätzen der Ausgangstabelle zurück, die in der Spalte \'columnName\' den Wert \'value\' haben.',
                selectByFunction: '%selectByFunction()',
                selectTopRows: '%selectTopRows(table, nbRows) : gibt eine Tabelle mit den ersten nbRows Datensätzen der Ausgangstabelle zurück.',
                getColumn: '%getColumn()',
                sortByColumn: '%sortByColumn(table,columnName,direction) : gibt eine Tabelle mit den sortierten Datensätzen der Ausgangstabelle zurück. Der zweite Parameter ist eine Zeichenkette, die die Spalte für die Sortierung angibt. Die Sortierung kann aufsteigend ("asc") oder absteigend ("desc") sein.',
                sortByFunction: '%sortByFunction()',
                selectColumns: '%selectColumns(table,columnsList) : gibt eine Tabelle zurück, die aus den in der zweiten Parameterliste angegebenen Spalten der Ausgangstabelle besteht. Die Reihenfolge der Spalten entspricht der der Listenelemente.',
                joinTables: '%joinTables(table1, column1, table2, column2, type) : gibt eine Tabelle zurück, die der Join der beiden übergebenen Tabellen ist. Der Join erfolgt über die Spalten \'column1\' und \'column2\'. Der Typ ist einer von \'inner\', \'outer\', \'left\' und \'right\'.',
                displayTable: '%displayTable(table) : zeigt die übergebene Tabelle im Visualisierungsbereich an.',
                updateWhere: '%updateWhere()',
                insertRecord: '%insertRecord(table, record) : gibt die Ausgangstabelle mit dem hinzugefügten Datensatz zurück. Der Datensatz wird als Liste übergeben.',
                unionTables: '%unionTables()',
                displayRecord: '%displayRecord()',
                displayTableOnMap: '%displayTableOnMap(table,nameColumn,longitudeColumn,latitudeColumn) : zeigt die Elemente der als zweiten Parameter übergebenen Spalte auf einer Karte an.',
                printConsole: '%printConsole()',
                displayTableOnGraph: '%displayTableOnGraph()',
                displayTablesOnGraph: '%displayTablesOnGraph()',
                initHistogram: '%initHistogram()',
                setHistogramBar: '%setHistogramBar()'
            },
            startingBlockName: "Programm",
            constantLabel: {
                asc: 'asc',
                desc: 'desc',
                inner: 'inner',
                outer: 'outer',
                left: 'left',
                right: 'right',
                line: 'Liniendiagramm',
                bar: 'Balkendiagramm',
                plot: 'Streudiagramm'
            },
            messages: {
                table_not_found: 'Tabelle nicht gefunden: ',
                file_not_found: 'CSV-Datei nicht gefunden: ',
                incorrect_results: 'Falsche Ergebnisse',
                some_results_missing: 'Es fehlen Ergebnisse',
                success: 'Erfolg'
            },
            ui: {
                'btn_diplay_table': 'Anzeigen',
                'btn_files_repository': 'CSV-Dateien hinzufügen...',
                'files_repository': {
                    'caption': 'Liste der CSV-Dateien',
                    'hint': 'Verwende die Dateinummer als Parameter für die Funktion loadTableFromCsv. Nur CSV-Dateien mit ; als Trennzeichen sind erlaubt.',
                    'add': 'Hinzufügen',
                    'incompatible_browser': 'Inkompatibler Browser',
                    'confirm_overwrite': 'Dateien überschreiben?',
                    'file_not_found': 'Datei nicht gefunden: '
                },
                'db_helper': {
                    'renderer_html_rows_limit': 'Nur die ersten %1 Datensätze werden angezeigt'
                }
            }
        }
    }

    var context = quickAlgoContext(display, infos)

    var strings = context.setLocalLanguageStrings(language_strings)
    var task_tables = {};
    var displayed_element = null;
    var current_histogram = null;
    var ready = false;
    var innerState = {};

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


    var wrapper;
    var tables_cache = [null];

    context.reset = function(taskInfos) {
        if(wrapper) {
            wrapper.removeClass('highlight-result');
        }
        if(taskInfos) {
            task_tables = taskInfos.tables || {};
        }


        task_files.initLevel({
            strings: strings.ui.files_repository,
            level: curLevel
        });

        if(context.display) {
            window.db_helper && window.db_helper.destroy();
        }

        wrapper = $('<div class="renderers_wrapper"></div>');
        if (context.display) {
            $('#grid').empty().append(wrapper);
        }

        window.db_helper = new DatabaseHelper(
            Object.assign({
                parent: wrapper,
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
                wrapper.addClass('highlight-result');
                if(is_imported) {
                    var file = task_files.getFile(filename);
                    db_helper.loadCsv(file, [], function(table) {
                        db_helper.displayTable(table, true);
                    });
                } else {
                    var table = Table(task_tables[filename].data);
                    db_helper.displayTable(table, true);
                }
            },
            tables: {
                task: task_tables,
                imported: []
            }
        });
    }

    context.getInnerState = function() {
        innerState.tables_cache = tables_cache.map(function (table) {
            return null !== table ? table.params() : null;
        });
        innerState.displayed_element = displayed_element;
        innerState.current_histogram = current_histogram;

        return innerState;
    };

    context.implementsInnerState = function () {
        return true;
    }

    context.reloadInnerState = function(data) {
        innerState = data;
        tables_cache = data.tables_cache.map(function (params) {
            return null !== params ? new Table(params) : null;
        });
        displayed_element = data.displayed_element;
        current_histogram = data.current_histogram;
        if (displayed_element && 'table' === displayed_element.elementType) {
            db_helper.displayTable(new Table(displayed_element.table), context.display);
        } else if (displayed_element && 'histogram' === displayed_element.elementType) {
            db_helper.initHistogram(displayed_element.histogram.records_amount, displayed_element.histogram.max_value, context.display);
            for (var i = 0; i < displayed_element.histogram.records_amount; i++) {
                db_helper.setHistogramBar(i, displayed_element.histogram.values[i].label, displayed_element.histogram.values[i].value, context.display);
            }
        } else if (displayed_element && 'table_on_map' === displayed_element.elementType) {
            db_helper.displayTableOnMap(
                new Table(displayed_element.table),
                context.display
            );
        } else if (displayed_element && 'table_on_graph' === displayed_element.elementType) {
            db_helper.displayTableOnGraph(
                new Table(displayed_element.table),
                displayed_element.minY,
                displayed_element.maxY,
                displayed_element.type,
                context.display
            );
        } else if (displayed_element && 'tables_on_graph' === displayed_element.elementType) {
            db_helper.displayTableOnGraph(
                new Table(displayed_element.table),
                displayed_element.minX,
                displayed_element.maxX,
                displayed_element.minY,
                displayed_element.maxY
            );
        }
    };


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}


    context.expectTable = function(name) {
        if(name in task_tables) {
            var table = Table(task_tables[name].data);
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

    context.expectHistogram = function(data) {
        var status = db_helper.validateHistogram(data);
        if(status === true) {
            context.success = true;
            throw strings.messages.success;
            return;
        }
        context.success = false;
        throw new Error(strings.messages[status]);
    }


    function saveTable(table) {
        tables_cache.push(table);
        return tables_cache.length - 1;
    }
    function loadTable(idx) {
        return tables_cache[idx];
    }


    context.database = {

        loadTable: function(name, callback) {
            if(!task_tables[name] || !task_tables[name].public) throw new Error(strings.messages.table_not_found + name);
            var table = Table(task_tables[name].data);
            context.waitDelay(
                callback, 
                saveTable(table)
            );
            //callback(Table(task_tables[name].data));
        },


        loadTableFromCsvWithTypes: function(filename, types, callback) {
            if(infos.databaseConfig['disable_csv_import']) {
                throw new Error('CSV import disabled');
            }
            var file = task_files.getFile(filename);
            if(file === null) {
                throw new Error(strings.messages.file_not_found + fileNumber);
            }
            var types_arr = Array.prototype.slice.call(types);
            var cb = context.runner.waitCallback(callback);
            db_helper.loadCsv(file, types_arr, function(table) {
                cb(saveTable(table));
            });
        },

        loadTableFromCsv: function(filename, callback) {
            context.database.loadTableFromCsvWithTypes(filename, [], callback);
        },

        getRecords: function(table, callback) {
            context.waitDelay(
                callback, 
                loadTable(table).getRecords()
            );
        },

        selectByColumn: function(table, columnName, value, callback) {
            var new_table = loadTable(table).selectByColumn(columnName, value);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        selectByFunction: function(table, filterFunction, callback) {
            loadTable(table).selectByFunction(filterFunction, function(new_table) {
                context.waitDelay(
                    callback, 
                    saveTable(new_table)
                );
            });
        },

        selectTopRows: function(table, amount, callback) {
            var new_table = loadTable(table).selectTopRows(amount);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        getColumn: function(record, columnName, callback) {
            if(columnName in record) {
                context.waitDelay(callback, record[columnName]);
            } else {
                throw new Error('Column ' + columnName + ' not found');
            }
        },

        sortByColumn: function(table, columnName, direction, callback) {
            var new_table = loadTable(table).sortByColumn(columnName, direction);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        sortByFunction: function(table, compareFunction, callback) {
            loadTable(table).sortByFunction(compareFunction, function(new_table) {
                context.waitDelay(
                    callback, 
                    saveTable(new_table)
                );
            });
        },

        selectColumns: function(table, columns, callback) {
            var new_table = loadTable(table).selectColumns(columns)
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        joinTables: function(table1, column1, table2, column2, type, callback) {
            var new_table = loadTable(table1).join(column1, loadTable(table2), column2, type);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        displayTable: function(table, callback) {
            if(Array.isArray(table)) {
                table = db_helper.listToTable(table);
            } else {
                table = loadTable(table);
            }
            db_helper.displayTable(table, context.display);
            displayed_element = {elementType: 'table', table: table.params()};
            context.waitDelay(callback);
        },

        updateWhere: function(table, filterFunction, updateFunction, callback) {
            var new_table = loadTable(table).updateWhere(filterFunction, updateFunction);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        insertRecord: function(table, record, callback) {
            var new_table = loadTable(table).insertRecord(record);
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
        },

        unionTables: function(table1, table2, callback) {
            var new_table = loadTable(table1).union(loadTable(table2))
            context.waitDelay(
                callback, 
                saveTable(new_table)
            );
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
            displayed_element = {elementType: 'table', table: table.params()};
            context.waitDelay(callback);
        },

        displayTableOnMap: function(table, nameColumn, longitudeColumn, latitudeColumn, callback) {
            db_helper.displayTableOnMap(
                loadTable(table).selectColumns([nameColumn, longitudeColumn, latitudeColumn]),
                context.display
            );
            displayed_element = {elementType: 'table_on_map', table: loadTable(table).selectColumns([nameColumn, longitudeColumn, latitudeColumn]).params()};
            context.waitDelay(callback);
        },

        printConsole: function(text, callback) {
            db_helper.displayConsole(text, context.display);
            context.waitDelay(callback);
        },

        displayTableOnGraph: function(table, nameColumn, minY, maxY, type, callback) {
            if (Array.isArray(table)) {
                table = db_helper.listToTable(table);
                nameColumn = 'value';
            } else {
                table = loadTable(table);
            }
            db_helper.displayTableOnGraph(
                table.selectColumns([nameColumn]),
                minY,maxY,type,context.display
            );
            displayed_element = {elementType: 'table_on_graph', table: table.selectColumns([nameColumn]).params(), minY: minY, maxY: maxY, type: type};
            context.waitDelay(callback);
        },

        displayTablesOnGraph: function(table, nameColumn1, minX, maxX, nameColumn2, minY, maxY, callback) {
            if (Array.isArray(table)) {
                table = db_helper.listToTable(table);
                nameColumn1 = 'index';
                nameColumn2 = 'value';
            } else {
                table = loadTable(table);
            }
            db_helper.displayTablesOnGraph(
                table.selectColumns([nameColumn1,nameColumn2]),
                minX, maxX, minY, maxY
            );
            displayed_element = {elementType: 'tables_on_graph', table: table.selectColumns([nameColumn1,nameColumn2]).params(), minX: minX, maxX: maxX, minY: minY, maxY: maxY};
            context.waitDelay(callback);
        },


        // Histogram
        initHistogram: function(records_amount, max_value, callback) {
            db_helper.initHistogram(records_amount, max_value, context.display);
            var values = [];
            for (var i = 0; i < records_amount; i++) {
                values.push({label: '', value: 0});
            }
            current_histogram = {records_amount: records_amount, max_value: max_value, values: values};
            displayed_element = {elementType: 'histogram', histogram: current_histogram};
            context.waitDelay(callback);
        },

        setHistogramBar: function(record_idx, label, value, callback) {
            db_helper.setHistogramBar(record_idx, label, value, context.display);
            current_histogram.values[record_idx] = {label: label, value: value};
            displayed_element = {elementType: 'histogram', histogram: current_histogram};
            context.waitDelay(callback);
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
            ],
            histogram: [
                { name: 'initHistogram',
                    params: ['Number', 'Number'],
                    params_names: ['records_amount', 'max_value'],
                },
                { name: 'setHistogramBar',
                    params: ['Number', 'String', 'Number'],
                    params_names: ['record_idx', 'label', 'value'],
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
