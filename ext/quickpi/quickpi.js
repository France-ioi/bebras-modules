g_instance = null;

var getQuickPiConnection = function (userName, _onConnect, _onDisconnect, pythonLibPath) {
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    if (g_instance) {
        return g_instance;
    }

    this.pythonLib = "";
    this.pythonLibPath = pythonLibPath;
    this.raspiServer = "";
    this.wsSession = null;
    this.resultsCallback = null;
    this.commandMode = false;
    this.userName = userName;
    this.sessionTainted = false;
    this.connected = false;
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;
    this.locked = "";
    this.pingInterval = null;
    this.pingsWithoutPong = 0;
    this.oninstalled = null;
    this.commandQueue = [];

    this.connect = function(ipaddress) {
        if (this.wsSession != null) {
            return;
        }

        url = "ws://" + ipaddress + ":5000/api/v1/commands";
        this.locked = "";
        this.pingsWithoutPong = 0;
        this.commandQueue = [];

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

            pingInterval = setInterval(function() {
                var command =
                {
                    "command": "ping"
                }

                if (pingsWithoutPong > 2)
                {
                    wsSession.close();
                    onclose();
                } else {
                    pingsWithoutPong++;
                    wsSession.send(JSON.stringify(command));
                    lastPingSend = + new Date();
                }

                }, 1000);

        }

        this.wsSession.onmessage = function (evt) {
            var message = JSON.parse(evt.data);

            if (message.command == "locked") {
                locked = message.lockedby;
            } else if (message.command == "pong") {
                pingsWithoutPong = 0;
            } else if (message.command == "installed") {

                if (oninstalled != null)
                    oninstalled();

            } else if (message.command == "startCommandMode") {
                if (commandQueue.length > 0)
                {
                    var command = commandQueue.shift();

                    sendCommand(command.command, command.callback);
                }
            } else if (message.command == "execLineresult") {
                if (commandMode && resultsCallback != null) {
                    tempCallback = resultsCallback;
                    resultsCallback = null;
                    tempCallback(message.result);

                    if (commandQueue.length > 0)
                    {
                        var command = commandQueue.shift();

                        sendCommand(command.command, command.callback);
                    }
                }
            }
        }

        this.wsSession.onclose = function () {

            if (wsSession != null) {
                clearInterval(pingInterval);
                pingInterval = null;

                wsSession = null;
                commandMode = false;
                sessionTainted = false;

                onDisconnect(connected);

                connected = false;
            }
        }
    }

    this.onclose = function() {
        clearInterval(pingInterval);
        pingInterval = null;

        wsSession = null;
        commandMode = false;
        sessionTainted = false;

        onDisconnect(connected);

        connected = false;
    }

    this.fetchPythonLib = function(doAfter) {
        fetch(this.pythonLibPath)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                this.pythonLib = text;
                doAfter();
            });
    }

    this.wasLocked = function()
    {
        if (this.locked)
            return true;

        return false;
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


    this.installProgram = function (pythonProgram, oninstall) {
        if (this.wsSession == null)
            return;

        if (this.pythonLib === "") {
            fetchPythonLib(function () { installProgram(pythonProgram, oninstall) });
            return;
        }

        this.commandMode = false;
        this.oninstalled = oninstall;

        var fullProgram = this.pythonLib + pythonProgram;
        var command =
        {
            "command": "install",
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

        this.commandQueue = [];
        this.wsSession.send(JSON.stringify(command));
    }

    this.sendCommand = function (command, callback) {
        if (this.wsSession != null) {
            if (this.resultsCallback == null) {
                if (!this.commandMode) {
                    this.startNewSession();

                    this.commandQueue.push ({
                        command: command,
                        callback: callback
                    });    
                } else { 

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
            else {
                this.commandQueue.push ({
                    command: command,
                    callback: callback
                });
            }
        }
    }


    g_instance = this;
    return this;
}