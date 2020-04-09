class quickPiStore {
        constructor() {
            this.Store = {};
        }

        write(prefix, value)
        {
            this.Store[prefix] = value;
        }
    
        read(prefix, value)
        {
            return this.Store[prefix];
        }

        getStateData() {
            var state = {};

            Object.assign(state, this.Store);

            return state;
        }

        static renderDifferences(expectedState, state)
        {
            var mainDiv = document.createElement("div");

            for (var p in expectedState)
            {
                if (expectedState.hasOwnProperty(p) && !state.hasOwnProperty(p)) {

                    var div = document.createElement("div");
                    $(div).text("Missing key " + p);
                    $(mainDiv).append(div);
                }

                if (expectedState[p] != state[p]) {
                    var div = document.createElement("div");

                    var wrongValue = "Key: {0} value {1} is different {2}.";
                    var message = wrongValue.format(p, expectedState[p], state[p]);

                    $(div).text(message);
                    $(mainDiv).append(div);
                }
            }

            for (var p in state)
            {
                if (state.hasOwnProperty(p) && !expectedState.hasOwnProperty(p)) {
                    var div = document.createElement("div");
                    $(div).text("Not expected key " + p);
                    $(mainDiv).append(div);
                }
            }

            return mainDiv;
        }

        static compareState(state1, state2)
        {
            if (state1 == null &&
                state2 == null)
                return true;

            if (state1 == null ||
                state2 == null)
                return false;

            for (var p in state1)
            {
                if (state1.hasOwnProperty(p) && !state2.hasOwnProperty(p))
                    return false;

                if (Array.isArray(state1[p]))
                {
                    if (!Array.isArray(state2[p]))
                        return false;

                    if (state1[p].length != state2[p].length)
                        return false;

                    for (var i = 0; i < state1[p].length; i++) {
                        if (state1[p][i] != state2[p][i])
                            return false;
                    }
                }
                else 
                {
                    if (state1[p] != state2[p])
                        return false;
                }
            }

            for (var p in state2)
            {
                if (state2.hasOwnProperty(p) && !state1.hasOwnProperty(p))
                    return false;
            }

            return true;
        }
}