var db = {


    loadTable: function(name) {

    },


    loadTableFromCsv: function(csv_content, types) {

    },


    joinTables: function(table1, column1, table2, column2, type) {
        //Type can be “inner”, “outer”, “left”, “right”. (inner by default)
        // enum in blockly block

    },


    displayTable: function(table, columns) {
        var res = columns ? table.selectColumns(columns) : table;
        return res.dump();
    },


    unionTables: function(table1, table2) {

    },


    displayRecord: function(record) {

    },


    // ????
    getColumn(record, columnName) {
        if(columnName in record) {
            return record[columnName]
        }
        throw new Error('Column ' + columnName + ' not found');
    },


    displayTableOnMap: function(table, nameColumn, longitudeColumn, latitudeColumn) {

    }

}




function Table(params) {


    function columnIndex(name) {
        var idx = params.columnNames.indexOf(name);
        if(idx === -1) throw new Error('Column ' + name + ' not found');
        return idx;
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
        for(var name in obj) {
            if(!obj.hasOwnProperty(name)) continue;
            var idx = columnIndex(name);
            res[idx] = obj[name];
        }
        if(res.length != params.columnNames.length) {
            throw new Error('Columns count mismatch');
        }
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
            index[row.join('')] = idx++;
        });
        arr.sort(function(a, b){
            var result = compare(a, b);
            return result === 0 ? index[b.join('')] - index[a.join('')] : result;
        });
        return arr;
    }


    return {


        columns: function() {
            return params.columnNames;
        },


        dump: function() {
            var data = params.records.slice();
            data.unshift(params.columnNames);
            var res = '';
            data.map(function(row) {
                res += row.join(';\t') + '\n';
            })
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
            var idx = columnIndex(columnName);
            var res = cloneParams();
            params.records.map(function(row) {
                if(row[idx] == value) {
                    res.records.push(row);
                }
            })
            return Table(res);
        },


        selectByFunction: function(filterFunction) {
            var res = cloneParams();
            params.records.map(function(row) {
                if(filterFunction(rowToObject(row))) {
                    res.records.push(row);
                }
            })
            return Table(res);
        },


        sortByColumn: function(columnName, direction) {
            var res = cloneParams();
            var idx = columnIndex(columnName);
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

            var idxs = [], idx;
            columns.map(function(col) {
                if(!(col instanceof Array)) {
                    col = [col, col]
                }
                idx = columnIndex(col[0]);
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
            params.records.map(function(row) {
                var obj = rowToObject(row);
                if(filterFunction(obj)) {
                    var new_row = objectToRow(
                        updateFunction(obj)
                    );
                    res.records.push(new_row);
                } else {
                    res.records.push(row.slice());
                }
            })
            return Table(res);
        },


        insertRecord: function(record) {
            var res = cloneParams(true);
            res.records.push(
                objectToRow(record)
            );
            return Table(res);
        }



    }

}