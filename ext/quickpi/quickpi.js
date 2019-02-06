
var getQuickPiConnection = function (userName) {
    this.pythonLib = "";
    this.raspiServer = "";
    this.wsSession = null;
    this.resultsCallback = null;
    this.commandMode = false;
    this.userName = userName;
    this.sessionTainted = false;

    this.connect = function(ipaddress, onConnect, onDisconnect) {
        if (this.wsSession != null) {
            return;
        }

        url = "ws://" + ipaddress + ":5000/api/v1/commands";

        this.wsSession = new WebSocket(url);

        this.wsSession.onopen = function () {
            var command =
            {
                "command": "grabLock",
                "username": userName
            }

            wsSession.send(JSON.stringify(command));

            onConnect();
        }

        this.wsSession.onmessage = function (evt) {
            if (commandMode && resultsCallback != null) {
                tempCallback = resultsCallback;
                resultsCallback = null;
                tempCallback(evt.data);

            }
            //if (evt.data != "none")
            //appendOutput(evt.data + "\n");
        }

        this.wsSession.onclose = function () {
            this.wsSession = null;
            this.commandMode = false;
            this.sessionTainted = false;
            onDisconnect();
        }
    }

    this.fetchPythonLib = function(doAfter) {
        fetch('../../modulesquickpilib.py')
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                this.pythonLib = text;
                doAfter();
            });
    }

    this.executeProgram = function (pythonProgram) {
        if (this.wsSession == null)
            return;

        if (this.pythonLib === "") {
            fetchPythonLib(function () { executeProgram(pythonProgram) });
            return;
        }

        this.commandMode = false;

        var fullProgram = this.pythonLib + pythonProgram;
        var command =
        {
            "command": "startRunMode",
            "program": fullProgram
        }

        this.wsSession.send(JSON.stringify(command));
    }

    this.stopProgram = function() {
        if (this.wsSession != null) {
            var command =
            {
                "command": "stopAll",
            }

            this.wsSession.send(JSON.stringify(command));
        }
    }

    this.releaseLock = function() {
        if (this.wsSession == null)
            return;

        if (this.wsSession != null) {
            var command =
            {
                "command": "close",
            }

            this.wsSession.send(JSON.stringify(command));
        }
    }

    this.startNewSession = function() {
        if (this.wsSession == null)
            return;

        if (this.commandMode && !this.sessionTainted)
            return;

        if (this.pythonLib === "") {
            fetchPythonLib(startNewSession);
            return;
        }

        this.commandMode = true;
        this.sessionTainted = false;

        var command =
        {
            "command": "startCommandMode",
            "library": this.pythonLib
        }

        this.wsSession.send(JSON.stringify(command));
    }

    this.sendCommand = function (command, callback) {

        if (this.wsSession != null && this.resultsCallback == null) {
            var command =
            {
                "command": "execLine",
                "line": command
            }

            this.sessionTainted = true;
            this.resultsCallback = callback;
            this.wsSession.send(JSON.stringify(command));
        }
    }


    return this;
}