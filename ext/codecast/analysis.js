var skulptAnalysisDebug = false;

/**
 * Transforms the skulpt state (the suspensions) to something readable with the variables content.
 *
 * @param {Array} suspensions   The skulpt suspensions.
 * @param {Object} lastAnalysis The last analysis (this function on the precedent step).
 *
 * @returns {Object|null}
 */
var analyseSkulptState = function analyseSkulptState(suspensions, lastAnalysis) {
    if (skulptAnalysisDebug) {
        console.log('[¥¥¥¥¥¥¥] Building analysis');
        console.log(suspensions);
        console.log(lastAnalysis);
    }

    if (suspensions.length === 0) {
        return null;
    }

    var functionCallStack = Immutable.List();
    for (var suspensionIdx = 0; suspensionIdx < suspensions.length; suspensionIdx++) {
        var suspension = suspensions[suspensionIdx];
        if (!isProgramSuspension(suspension)) {
            continue;
        }

        var lastScopeAnalysis = null;
        if (lastAnalysis && lastAnalysis.functionCallStack.size > suspensionIdx) {
            lastScopeAnalysis = lastAnalysis.functionCallStack.get(suspensionIdx);
        }

        var analysedScope = analyseSkulptScope(suspension, lastScopeAnalysis);
        analysedScope.key = suspensionIdx;

        functionCallStack = functionCallStack.push(analysedScope);
    }

    var analysis = {
        functionCallStack: functionCallStack
    };

    if (skulptAnalysisDebug) {
        console.log('[¥¥¥¥¥¥¥] End of building analysis');
        console.log(analysis);
    }

    return Object.freeze(analysis);
};

/**
 * Transforms the skulpt scope (one suspension) to something readable with the variables content.
 *
 * @param {Object} suspension   The skulpt suspension.
 * @param {Object} lastAnalysis The last analysis (this function on the precedent step and the same scope).
 *
 * @returns {Object}
 */
var analyseSkulptScope = function analyseSkulptScope(suspension, lastAnalysis) {
    if (skulptAnalysisDebug) {
        console.log('////// Analyse scope...');
        console.log(suspension);
        console.log(lastAnalysis);
    }

    var variables = Immutable.Map();

    var name = suspension._name;
    if (name === '<module>') {
        name = '';
    }

    var args = suspension._argnames;

    // If $loc is empty, we are in a function's scope.
    if (Object.keys(suspension.$loc).length === 0 && suspension.$loc.constructor === Object) {
        var variableNames = sortArgumentsFirst(filterInternalVariables(Object.keys(suspension.$tmps)), args);
        for (var variableIdx in variableNames) {
            var variableName = variableNames[variableIdx];
            var value = suspension.$tmps[variableName];

            if (value instanceof Sk.builtin.func) {
                continue;
            }

            var lastValue = null;
            if (lastAnalysis) {
                lastValue = lastAnalysis.variables.get(variableName);
                if (lastValue) {
                    lastValue = lastValue.cur;
                } else {
                    lastValue = undefined;
                }
            }
            // const newValue = cloneSkuptValue(value);
            // const valueWithPrevious = valuesWithPrevious(newValue, lastValue);

            // variables = variables.set(variableName, valueWithPrevious);

            variables = variables.set(variableName, {
                cur: value,
                old: lastValue
            });
        }
    } else {
        // Global scope.
        var _variableNames = sortArgumentsFirst(filterInternalVariables(Object.keys(suspension.$loc)), args);
        for (var _variableIdx in _variableNames) {
            var _variableName = _variableNames[_variableIdx];
            var _value = suspension.$loc[_variableName];

            if (_value instanceof Sk.builtin.func) {
                continue;
            }

            var _lastValue = null;
            if (lastAnalysis) {
                _lastValue = lastAnalysis.variables.get(_variableName);
                if (_lastValue) {
                    _lastValue = _lastValue.cur;
                } else {
                    _lastValue = undefined;
                }
            }
            // const newValue = cloneSkuptValue(value);
            // const valueWithPrevious = valuesWithPrevious(newValue, lastValue);

            // variables = variables.set(variableName, valueWithPrevious);

            variables = variables.set(_variableName, {
                cur: _value,
                old: _lastValue
            });
        }
    }

    var analysis = {
        variables: variables,
        name: name,
        args: args
    };

    if (skulptAnalysisDebug) {
        console.log('////// End of analyse scope...');
        console.log(analysis);
    }

    return analysis;
};

/**
 * Gets the values with the new and previous value.
 *
 * @param {*} newValue
 * @param {*} oldValue
 *
 * @return {*}
 */
var valuesWithPrevious = function valuesWithPrevious(newValue, oldValue) {
    if (skulptAnalysisDebug) {
        console.log(newValue, oldValue);
    }

    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
        var values = [];
        var maxIdx = Math.max(newValue.length, oldValue.length);
        for (var idx = 0; idx < maxIdx; idx++) {
            var curNewValue = undefined;
            if (newValue.length > idx) {
                curNewValue = newValue[idx];
            }
            var curOldValue = undefined;
            if (oldValue.length > idx) {
                curOldValue = oldValue[idx];
            }

            values.push(valuesWithPrevious(curNewValue, curOldValue));
        }

        return values;
    } else if (Array.isArray(oldValue)) {
        return {
            cur: newValue,
            old: undefined
        };
    } else if (Array.isArray(newValue)) {
        var _values = [];
        for (var _idx = 0; _idx < newValue.length; _idx++) {
            _values.push(valuesWithPrevious(newValue[_idx], undefined));
        }

        return _values;
    } else {
        var newOldValue = undefined;
        if (oldValue) {
            newOldValue = oldValue.cur;
        }
        return {
            cur: newValue,
            old: newOldValue
        };
    }
};

/**
 * Checks whether a suspension is a program's suspension.
 * It can also be only a promise encapsulated in a suspension when certain functions are called.
 *
 * @param {Object} suspension The suspension.
 *
 * @returns {boolean}
 */
var isProgramSuspension = function(suspension) {
    return suspension.hasOwnProperty('$lineno');
};

/**
 * Clone a skulpt value.
 *
 * @param {Object} value The skulpt bultin object.
 *
 * @returns {[]|*}
 */
var cloneSkuptValue = function cloneSkuptValue(value) {
    if (Array.isArray(value)) {
        var values = [];
        for (var idx = 0; idx < value.length; idx++) {
            values.push(cloneSkuptValue(value[idx]));
        }

        return values;
    } else if (value.hasOwnProperty('v')) {
        return cloneSkuptValue(value.v);
    } else {
        return value;
    }
};

// To filter the internal variables of Skulpt.
var variablesBeginWithIgnore = ['__name__', '__doc__', '__package__', '__file__', '$compareres', '$loadgbl', '$binop', '__refs__'];
/**
 * Filter the variable names by removing those useed internally by Skulpt.
 *
 * @param {Array} variableNames The names.
 *
 * @returns {Array}
 */
var filterInternalVariables = function filterInternalVariables(variableNames) {
    return variableNames.filter(function (name) {
        var ignore = false;
        for (var variableBeginWithIgnoreIdx in variablesBeginWithIgnore) {
            var variableBeginWithIgnore = variablesBeginWithIgnore[variableBeginWithIgnoreIdx];
            if (name.indexOf(variableBeginWithIgnore) === 0) {
                return false;
            }
        }

        return true;
    });
};

/**
 * Sort by putting arguments first.
 *
 * @param {Array} variableNames The variable names.
 * @param {Array} args          The arguments.
 *
 * @return {Array}
 */
var sortArgumentsFirst = function sortArgumentsFirst(variableNames, args) {
    return variableNames.sort(function (a, b) {
        var aIsArg = args.indexOf(a) !== -1;
        var bIsArg = args.indexOf(b) !== -1;

        if (aIsArg && !bIsArg) {
            return -1;
        } else if (bIsArg && !aIsArg) {
            return 1;
        }

        return a.localeCompare(b);
    });
};
