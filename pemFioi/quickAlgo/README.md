# quickAlgo

quickAlgo is a type of bebras task that lets users code a program in Blockly,
Scratch or Python, to solve interactive problems such as moving a Robot
collecting and dropping objects. The interface executes the code browser-side,
displays the current status of the task being solved during the execution, and
the end result.

It supports configuring the blocks / functions available, step-by-step
execution while highlighting the current block / instruction, and a plethora of
options to configure its behavior. It can also be used as a library for Blockly
or Scratch edition and translation into Python ;
[TaskPlatform](https://github.com/France-ioi/TaskPlatform) and its editor
[fioi-editor2](https://github.com/France-ioi/fioi-editor2) use it for Blockly
and Scratch edition.


## task.js options

A typical task will use a task.js defining the options and data for the task.

**This documentation is still being written.**

### Level-specific options

Each option can be directly the corresponding value, or an object with a key
for each difficulty of the task (basic, easy, medium, hard), for instance,
`maxInstructions` can be defined as :
```
maxInstructions: 20
maxInstructions: { easy: 20, medium: 30, hard: 40 }
```

In the second case, `maxInstructions` will be 20 for the easy level, 30 for the
medium one, and 40 for the hard one.

Options which are an object or an array can also have a `shared` key when set
as level-specific options, for instance :
```
hideControls: {
  easy: {nextStep: true, goToEnd: true},
  shared: {speedSlider: true}
}
```

The keys or array items from the `shared` key will be added to the value defined
for each level.

### gridInfos options

#### hideControls

Type : object

Allows to hide some controls from the user. Set a key to `true` to hide it.
(Partly supported in the old interface, fully supported in the mobileFirst
interface.)

Possible keys (all booleans) :

* `restart` : Hides the "restart" button
* `saveOrLoad` : Hides the program save and load buttons
* `loadBestAnswer` : Hides the "load your best answer" button
* `speedSlider` : Hides the speed slider
* `backToFirst` : Hides the `|<<` "back to first" button
* `nextStep` : Hides the `>|` step button
* `goToEnd` : Hides the `>|` "go to end" button

#### introMaxHeight

Type : string, default `"33%"`

Max height the task intro can take in the "desktop" layout of the responsive
interface.

#### includeBlocks

Type : object

Defines which Blockly blocks are allowed for the task. This will be
automatically translated into blocks for Scratch and authorized syntax for
Python.

Check section below for more information.

#### maxListSize

Type : int, default 100

Maximum allowed list size (only supported in Blockly and Scratch).

#### scrollbars

Type : boolean, default `true`

Displays scrollbars (only supported in Blockly and Scratch).

#### zoom

Type : object

Allow to add zoom controls or change the default zoom (only supported in
Blockly and Scratch).

Possible keys :

* `controls` (boolean, default `false`) : display zoom buttons
* `scale` (float, default `1`, or `1.1` if `maxInstructions <= 20`) : zoom
scale as a multiplier (`1` is the normal scale)

For example:
```
zoom: {
   controls: true,
   scale: 0.5
},
```

### includeBlocks options

#### variables

Type : list

Preset a list of variables which will be available to the user. If `'*'` is
present in this list, or if the category `variables` is allowed through
`includeBlocks.standardBlocks.wholeCategories`, the user will be able to create
new variables as well.

#### variablesOnlyBlocks

Type : list, default all allowed

Lists the variable operation blocks to allow among :

* `get` : get the value of a variable
* `set` : set the value of a variable
* `incr` : increment the value of a variable by a value

Example : `["get", "set"]`
