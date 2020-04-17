var PythonVariableValue = function PythonVariableValue(props) {
    if (props.cur instanceof Sk.builtin.list) {
        var nbElements = props.cur.v.length;

        var elements = [];
        for (var idx = 0; idx < props.cur.v.length; idx++) {
            var old = undefined;
            if (props.old && props.old instanceof Sk.builtin.list) {
                old = props.old.v[idx];
            }

            elements.push({
                cur: props.cur.v[idx],
                old: old
            });
        }

        return React.createElement(
            React.Fragment,
            null,
            '[',
            elements.map(function (element, index) {
                return React.createElement(
                    'span',
                    { key: index },
                    React.createElement(PythonVariableValue, { cur: element.cur, old: element.old }),
                    index + 1 < nbElements ? ', ' : null
                );
            }),
            ']'
        );
    }

    if (props.cur instanceof Sk.builtin.str) {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                'span',
                null,
                '"',
                props.cur.v,
                '"'
            ),
            props.old && props.cur.v !== props.old.v ? React.createElement(
                'span',
                { className: 'value-previous' },
                '"',
                props.old.v,
                '"'
            ) : null
        );
    }

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'span',
            null,
            props.cur.v
        ),
        props.old && props.cur.v !== props.old.v ? React.createElement(
            'span',
            { className: 'value-previous' },
            props.old.v
        ) : null
    );
};
