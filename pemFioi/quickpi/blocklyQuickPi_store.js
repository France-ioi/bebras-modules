class quickPiStore {
        constructor(connected) {
            this.Store = {};
            this.connected = true;
            this.rwpassword = "dummy";
        }

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
            var strings = window.task.displayedSubTask.context.setLocalLanguageStrings(localLanguageStrings);
            var mainDiv = document.createElement("div");

            for (var p in expectedState)
            {
                if (expectedState.hasOwnProperty(p) && !state.hasOwnProperty(p)) {

                    var div = document.createElement("div");
                    $(div).text(strings.messages.cloudKeyNotExists.format(p));
                    $(mainDiv).append(div);
                }

                if (expectedState[p] != state[p]) {
                    var div = document.createElement("div");

                    var wrongValue = "Clé {0} : la valeur {2} n'est pas celle attendue, {1}.";
                    var message = strings.messages.cloudWrongValue.format(p, expectedState[p], state[p]);

                    $(div).text(message);
                    $(mainDiv).append(div);
                }
            }

            for (var p in state)
            {
                if (state.hasOwnProperty(p) && !expectedState.hasOwnProperty(p)) {
                    var div = document.createElement("div");
                    $(div).text(strings.messages.cloudUnexpectedKey.format(p));
                    $(mainDiv).append(div);
                }
            }

            return mainDiv;
        }

        static compareState(state1, state2)
        {
            return deepEqual(state1, state2);
        }
}