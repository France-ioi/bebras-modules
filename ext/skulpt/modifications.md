The quickAlgo version of skulpt.min.js includes modifications to the source
file compile.js, in order to call reportValue on each assignation.

It consists in replacing

    $loc.varName = value;

with

    $loc.varName = window.currentPythonRunner.reportValue(value, 'varName');

See https://github.com/France-ioi/skulpt
