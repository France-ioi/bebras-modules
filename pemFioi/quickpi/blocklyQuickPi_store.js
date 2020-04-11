class quickPiStore {
        constructor(connected) {
            this.Store = {};
            this.connected = true;
        }

        rwpassword = "dummy";

        write(prefix, key, value)
        {
            this.Store[key] = value;
        }
    
        read(prefix, key, value)
        {
            return this.Store[key];
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
                    $(div).text("La clé n'existe pas : " + p);
                    $(mainDiv).append(div);
                }

                if (expectedState[p] != state[p]) {
                    var div = document.createElement("div");

                    var wrongValue = "Clé {0} : la valeur {2} n'est pas celle attendue, {1}.";
                    var message = wrongValue.format(p, expectedState[p], state[p]);

                    $(div).text(message);
                    $(mainDiv).append(div);
                }
            }

            for (var p in state)
            {
                if (state.hasOwnProperty(p) && !expectedState.hasOwnProperty(p)) {
                    var div = document.createElement("div");
                    $(div).text("La clé " + p + " n'est pas une clé attendue");
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

            return JSON.stringify(state1) === JSON.stringify(state2);
        }
}