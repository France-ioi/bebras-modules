/*!
 * @author John Ropas
 * @since 29/12/2016
 */


function PythonInterpreter() {

  this.output = '';
  this.callback = '';
  this.code = '';
  this.input = '';
  this.execLimit = 1000;

  this.onError = function (error) {
    callback({
      error: error.toString()
    });
  };

  this.onOutput = function (_output) {
    this.output += _output;
  };

  this.onSuccess = function () {
    callback({
      output: output_text
    });
  };

  this.configure = function() {
    Sk.execLimit = 1000;
    Sk.configure({
      output: this.onOutput
    });

  };

  this.run = function(programText, inputText, callback) {
    this.input = inputText;
    this.code = programText;
    this.callback = callback;
    var myPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody("<stdin>", false, programText, true);
    });
    myPromise.then(this.onSuccess.bind(this), this.onError.bind(this));
  };

}

CodeEditor.Interpreter.PythonInterpreter = PythonInterpreter;

