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
            // round trip this trought json so we actually copy everything
            // without keeping any references to objects
            return JSON.parse(JSON.stringify(this.Store));
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

            return JSON.stringify(state1) === JSON.stringify(state1);
        }
}