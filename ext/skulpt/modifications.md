The quickAlgo version of skulpt.min.js includes modifications to the source
file compile.js, in order to call reportValue on each assignation.

It consists in replacing

    $loc.varName = value;

with

    $loc.varName = window.currentPythonRunner.reportValue(value, 'varName');

The modification is done four times, in the code around line 2100 of
compile.js, to modify the Store cases for each operation.

A diff between skulpt.min.js and skulpt.quickAlgo.min.js (at the time of the
creation of this file) can help seeing those changes.


The debugger has also been modified to fix a bug with step-by-step while using
user-defined functions : the line 257 has been added to pass the return value
to the children.
