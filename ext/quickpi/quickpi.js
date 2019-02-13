
g_instance = null;

var getQuickPiConnection = function (userName, _onConnect, _onDisconnect) {
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    if (g_instance) {
        return g_instance;
    }

    this.pythonLib = "";
    this.raspiServer = "";
    this.wsSession = null;
    this.resultsCallback = null;
    this.commandMode = false;
    this.userName = userName;
    this.sessionTainted = false;
    this.connected = false;
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    this.connect = function(ipaddress) {
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

            connected = true;
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
            wsSession = null;
            commandMode = false;
            sessionTainted = false;
            connected = false;

            onDisconnect(this.connect);
            
        }
    }

    this.fetchPythonLib = function(doAfter) {
        fetch('../../modules/ext/quickpi/quickpilib.py')
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                this.pythonLib = text;
                doAfter();
            });
    }

    this.isConnecting = function () {
        return this.wsSession != null;
    }

    this.isConnected = function () {
        return this.connected;
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


    g_instance = this;
    return this;
}