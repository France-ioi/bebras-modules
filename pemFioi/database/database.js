function DatabaseHelper(options) {

    var defaults = {
        date_format: 'YYYY-MM-DD',
        csv_delimiter: ';',
        render_row_height: '20px',
        render_max_rows: 10,
        parent: null
    }

    options = Object.assign(defaults, options || {})


    this.loadCsv = function(file, types, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var res = {
                columnTypes: types,
                records: []
            }
            var lines = reader.result.split(/\r\n|\n/);
            for(var i=0, line; line=lines[i]; i++) {
                if(i === 0) {
                    res.columnNames = line.split(options.csv_delimiter);
                } else {
                    res.records.push(line.split(options.csv_delimiter));
                }
            }
            callback(Table(res));
        }
        reader.readAsText(file);
    },



    // render table
    this.formatValue = function(value, type) {
        if(value === null) {
            return 'NULL';
        }
        switch(type) {
            case 'number':
            case 'string':
            case 'date':
                return value;
            case 'image':
                return '<img style="height: ' + options.render_row_height + '" src="' + value + '"/>'
        }
        return '';
    }



    this.renderTable = function(table, reference_table) {
        var html = '<div class="database">';

        var rows = table.params().records;
        if(rows.length > options.render_max_rows) {
            rows = rows.slice(0, options.render_max_rows);
            html += 'Only the first ' + options.render_max_rows + ' records are displayed';
        }

        html +=
            '<table><tr><th>' +
            table.params().columnNames.join('</th><th>') +
            '</th></tr>';

        var reference_rows = reference_table ? reference_table.params().records : null;
        var valid_value = true;
        var valid_all = true;
        var types = table.params().columnTypes;
        for(var i=0, row; row = rows[i]; i++) {
            html += '<tr>';
            for(var j=0; j<row.length; j++) {
                var value = row[j];
                if(reference_rows) {
                    valid_value = valid_value && reference_rows[i] && reference_rows[i][j] === value;
                }
                valid_all = valid_all && valid_value;
                html +=
                    '<td style="height: ' + options.render_row_height +
                    '" class="' + (valid_value ? 'valid' : 'invalid') + '">' +
                    this.formatValue(value, types[j]) +
                    '</td>';

            }
            html += '</tr>';
        }

        html += '</table></div>';
        options.parent.html(html);
        if(reference_rows && reference_rows.length != rows.length) {
            throw new Error('Some results are missing or extra records added');
        }
        if(!valid_all) {
            throw new Error('Incorrect results');
        }
    }



    this.displayTable = function(table) {
        this.table = table;
        this.renderTable(table);
    }



    this.validateDisplay = function(reference_table) {
        if(!this.table) return;
        if(this.table.params().columnNames.length != reference_table.params().columnNames.length) {
            throw new Error('Incorrect results');
        }

        var res = this.renderTable(this.table, reference_table);
        if(res !== true) {
            throw new Error(res);
        }
    }



    // render map

    this.displayTableOnMap = function(table, callback) {
        //TODO
        callback();
    }

}




function Table(params) {


    function nullRow(length) {
        return Array.apply(null, Array(length)).map(function() {
            return null;
        })
    }


    function rowToObject(row) {
        var res = {};
        for(var i=0, name; name=params.columnNames[i]; i++) {
            res[name] = row[i];
        }
        return res;
    }

    function objectToRow(obj) {
        var res = [];
        params.columnNames.map(function(column, idx) {
            res[idx] = column in obj ? obj[column] : null;
        })
        return res;
    }


    function cloneParams(clone_records) {
        return {
            columnNames: params.columnNames.slice(),
            columnTypes: params.columnTypes.slice(),
            records: clone_records ? params.records.slice() : []
        }
    }



    // TODO: check this
    function stableSort(arr, compare) {
        var index = {}, idx = 0;
        arr.map(function(row) {
            index[row.join('\r')] = idx++;
        });
        return arr.slice().sort(function(a, b){
            var result = compare(a, b);
            return result === 0 ? index[b.join('\r')] - index[a.join('\r')] : result;
        });
    }


    function formatColumn(value, idx) {
        if(value === null) {
            return 'NULL';
        }
        switch(params.columnTypes[idx]) {
            case 'number':
            case 'string':
            case 'date':
                return value;
            case 'image':
                return '<img style="height: 20px" src="' + value + '"/>'
        }
        return '';
    }


    var joinRecords = {

        left: function(params1, idx1, params2, idx2, skip_matches) {
            var res = [];
            params1.records.map(function(row1) {
                var right = nullRow(params2.columnNames.length);
                for(var i=0, row2; row2 = params2.records[i]; i++) {
                    if(row1[idx1] === row2[idx2]) {
                        right = skip_matches ? false : row2;
                        break;
                    }
                }
                if(right !== false) {
                    res.push(row1.concat(right));
                }
            })
            return res;
        },

        right: function(params1, idx1, params2, idx2) {
            return params2.records.map(function(row2) {
                var left = nullRow(params1.columnNames.length);
                for(var i=0, row1; row1 = params1.records[i]; i++) {
                    if(row1[idx1] === row2[idx2]) {
                        left = row1;
                        break;
                    }
                }
                return left.concat(row2);
            })
        },

        inner: function(params1, idx1, params2, idx2) {
            var res = [];
            params1.records.map(function(row1) {
                params2.records.map(function(row2) {
                    if(row1[idx1] === row2[idx2]) {
                        res.push(row1.concat(row2));
                    }
                })
            })
            return res;
        },

        outer: function(params1, idx1, params2, idx2) {
            var left_join = this.left(params1, idx1, params2, idx2, true);
            var right_join = this.right(params1, idx1, params2, idx2);
            return left_join.concat(right_join);
        }
    }



    return {

        params: function() {
            return params;
        },

        columnIndex: function(name) {
            var idx = params.columnNames.indexOf(name);
            if(idx === -1) throw new Error('Column ' + name + ' not found');
            return idx;
        },


        dump: function() {
            var res = params.records.map(function(row) {
                return row.map(formatColumn);
            });
            res.unshift(params.columnNames.slice());
            return res;
        },


        // task interface

        getRecords: function() {
            var res = [];
            params.records.map(function(row) {
                res.push(rowToObject(row));
            });
            return res;
        },


        selectByColumn: function(columnName, value) {
            var idx = this.columnIndex(columnName);
            var res = cloneParams();
            res.records = params.records.filter(function(row) {
                return row[idx] == value;
            })
            return Table(res);
        },


        selectByFunction: function(filterFunction) {
            var res = cloneParams();
            res.records = params.records.filter(function(row) {
                return filterFunction(rowToObject(row));
            })
            return Table(res);
        },


        sortByColumn: function(columnName, direction) {
            var res = cloneParams();
            var idx = this.columnIndex(columnName);
            var cb = direction == 'ask' ? [1, -1] : [-1, 1];

            res.records = stableSort(params.records, function(a, b) {
                if(a[idx] === b[idx]) return 0;
                return a[idx] > b[idx] ? cb[0] : cb[1];
            });
            return Table(res);
        },


        sortByFunction: function(compareFunction) {
            var res = cloneParams();
            res.records = stableSort(params.records, function(a, b) {
                return compareFunction(
                    rowToObject(a),
                    rowToObject(b)
                );
            });
            return Table(res);
        },


        selectColumns: function(columns) {
            var res = {
                columnNames: [],
                columnTypes: [],
                records: []
            }

            var idxs = [], idx, self = this;
            columns.map(function(col) {
                if(!(col instanceof Array)) {
                    col = [col, col]
                }
                idx = self.columnIndex(col[0]);
                idxs.push(idx);
                res.columnNames.push(col[1]);
                res.columnTypes.push(params.columnTypes[idx]);
            })
            params.records.map(function(row) {
                var new_row = [];
                idxs.map(function(idx) {
                    new_row.push(row[idx]);
                })
                res.records.push(new_row);
            })
            return Table(res);
        },


        updateWhere: function(filterFunction, updateFunction) {
            var res = cloneParams();
            res.records = params.records.map(function(row) {
                var obj = rowToObject(row);
                if(filterFunction(obj)) {
                    return objectToRow(
                        updateFunction(obj)
                    );
                }
                return row.slice();
            })
            return Table(res);
        },


        insertRecord: function(record) {
            var res = cloneParams(true);
            res.records.push(
                objectToRow(record)
            );
            return Table(res);
        },


        union: function(table) {
            var columns_diff = JSON.stringify(params.columnNames) !== JSON.stringify(table.params().columnNames);
            var types_diff = JSON.stringify(params.columnTypes) !== JSON.stringify(table.params().columnTypes);

            if(columns_diff || types_diff) {
                throw new Error('Attemp to create union tables with different columns');
            }
            var res = cloneParams();
            res.records = params.records.concat(table.params().records);
            return Table(res);
        },


        join: function(column1, table2, column2, type) {
            var params2 = table2.params();
            var idx1 = this.columnIndex(column1);
            var idx2 = table2.columnIndex(column2);

            var res = {
                columnTypes: params.columnTypes.concat(params2.columnTypes),
                records: []
            }
            res.columnNames =
                params.columnNames.map(function(column) {
                    return 'table1_' + column;
                }).concat(params2.columnNames.map(function(column) {
                    return 'table2_' + column;
                }));

            res.records = joinRecords[type](params, idx1, params2, idx2);
            return Table(res);
        }

    }

}