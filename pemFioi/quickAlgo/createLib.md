# Manual: create a new quickAlgo library

## Get the Bebras environment

The preferred way uses [Git](https://www.git-scm.com/downloads) which allows you to easily stay up to date
with the Bebras resources and to submit your work, but you can also simply download the environment with your browser.

*  **With Git:**

   You must get the [bebras-tasks](https://github.com/France-ioi/bebras-tasks) repository
   along with the [bebras-modules](https://github.com/France-ioi/bebras-modules) submodule.

   Using the command line, you can write the following command:

   ```sh
   git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/France-ioi/bebras-tasks.git
   ```

*  **Without Git:**

   Go to the [bebras-tasks](https://github.com/France-ioi/bebras-tasks) repository homepage,
   click on the ‘Clone or download’ button and select the link ‘Download ZIP’.
   Once it is downloaded, unzip your `bebras-modules` folder.

   Download the zipped [bebras-modules](https://github.com/France-ioi/bebras-modules) repository the same way,
   then put the extracted directory inside the `bebras-tasks` main folder and name it `modules`.
   The `bebras-modules` downloaded directory (should be `bebras-modules-master`) must be put
   as a `modules` folder inside the `bebras-tasks` directory, i.e. it must be renamed to simply `modules`
   and replace the initially present `modules` folder in the `bebras-tasks` directory.

You can ensure it works by opening any task as a file `index.html` in a subfolder of `bebras-tasks`
(for instance you can open `2014/2014-RU-04-carrot-storehouses/index_en.html`).

## Setup your library

The file `blocklyTemplate_lib.js` within the folder `modules/pemFioi` is a library with simple settings,
ready to be used for a new library. You can create your library as a copy of this file,
replacing `Template` with the name of your library in the filename.
For instance, your new file will be named `blocklyMyLib_lib.js`.

In the file, you’ll see the following sections, all inside a `getContext` function, with the given identifiers:
1. Localized strings: `localLanguageStrings`
2. Basic initializations: `context`, `strings`, `context.template`
3. Context management functions: `context.{funcName}` (`reset`, `resetDisplay`, `updateScale`, `unload`)
4. Your library’s functions: `context.template.{funcName}`
5. Block definitions: `context.customBlocks`, `context.provideBlocklyColours`
6. Python constant definitions: `context.customConstants`

Many comments (`// end-line` or `/* multi-line */`) provide information about those elements.
You can of course remove them whenever they are useless for you.

The `getContext` function receives parameters:
* `infos` is the `subTask.gridInfos` defined in the task;
* `display` is a boolean which indicates if the context should be displayed in the DOM or is internal.

The object returned by the `quickAlgoContext` function has both variables as members `infos` and `display`.

You should start by changing every occurrence of the word `template` to the name of your library.

Then you must specify an importing rule for your library:
open one of the `importModules-*.js` files (the one you want to use; currently 1.1 is recommended),
duplicate the line of `blockly-template` and edit the words `template` and `Template` to refer to your library.
Your new rule should look like this:
```js
'blockly-myLib': {src: modulesPath+"/pemFioi/blocklyMyLib_lib.js", id: "blocklyMyLib_lib"},
```

At the end of this step, your library can already be used.

## Initiate a task for testing

Shaping your library will be much easier if you can test it along the way.

In the folder `module_testing`, a subfolder `test-template` contains an exercise that tests
the `blockly-template` library. Make a copy of this folder, changing `template` to `myLib`
or your actual name as usual. Then enter your new folder.

In the file `index.html`:
* change the `window.stringsLanguage` value to the code of the user language you want, e.g. `'en'`;
* ensure the `importModules-*.js` included script is the one you chose at the previous step;
* at the end of the `importModules(…)` statement, change `blockly-template` to the name
  of your importing rule;
* you may specify a title for your task in the `<title>` and `<h1>` tags,
  and user instructions in the `<div id="taskIntro">` tag.

In the `task.js` file, change the word `template` to the name of your library.

From there, you can open the file `index.html` in your browser and have fun
with the three effectless blocks.

## Program your first block

Firstly, you should add data in your `context.myLib` variable. Your blocks will register internally
their effect on this data so that it can be checked for the task’s validation.

Then create the function that will realize the action of your block.
It must be a member of `context.myLib` and must have an additional `callback` parameter.
The callback must be called at the end of your function for quickAlgo to work. Inside this function:
* alter the data inside `context.myLib`;
* if `context.display` is available, do the necessary display changes in the `$('#grid')`;
* call the callback with `context.waitDelay(callback)`.

Your block must eventually be listed in the `context.customBlocks` object with prototype information.
Just imitate the given examples: your function should be included in a namespace
(usually the name of your library) and a category, and may have parameters and a return value.

As an example, the code below show parts of an `amicable` library that has a block which checks
if two given numbers are amicable and sets a global variable to `false` if they are not.
It uses colored text as a graphic result for the user.

```js
context.amicable = {
   allAmicable: true,
   testedPairs: 0
};

context.reset = function(taskInfos) {
   context.amicable.allAmicable = true;
   context.amicable.testedPairs = 0;
   if (context.display) context.resetDisplay();
}

context.resetDisplay = function() {
   $('#grid').empty();
   context.blocklyHelper.updateSize();
   context.updateScale();
}

// ...

context.amicable.testPair = function(nb1, nb2, callback) {
   var divisSum1 = 0, divisSum2 = 0;
   for (var divis = 2; divis < Math.floor(Math.max(nb1, nb2) / 2); divis++) {
      if (nb1 % divis == 0) divisSum1 += divis;
      if (nb2 % divis == 0) divisSum2 += divis;
   }
   if (divisSum1 != divisSum2) context.amicable.allAmicable = false;
   context.amicable.testedPairs++;

   if (context.display) {
      $('#grid').append(
         divisSum1 == divisSum2 ?
            $('<div>').css('color', 'green').text(nb1 + " and " + nb2 + " are amicable.") :
            $('<div>').css('color', 'red').text(nb1 + " and " + nb2 + " are not amicable!"));
   }

   context.waitDelay(callback);
}

// ...

context.customBlocks = {
   amicable: {
      testing: [
         { name: 'testPair', params: [null, null] }
      ]
   }
};
```

For the block to be usable in your task, you must add it in `task.js`,
in `subTask.gridInfos.includeBlocks.generatedBlocks` as `namespace: ["block"]`.
In the case of the `testPair` block of the `amicable` library it looks like:
```js
subTask.gridInfos = {
   // ...
   includeBlocks: {
      // ...
      generatedBlocks: {
         amicable: ["testPair"]
      }
      // ...
   }
   // ...
};
```

Additionnally, you may specify a color for the category (for `testPair` it’s `testing`)
in the `context.provideBlocklyColours` function.

Finally, in `localLanguageStrings`, you must specify texts for Blockly and Python.
Continuing with our example:
```js
var localLanguageStrings = {
   en: {
      label: {
         testPair: "test if %1 and %2 are amicable"
      },
      code: {
         testPair: "testPair"
      }
   }
};
```
* `label` is for the block. `%1`, `%2`, etc. are required placeholders for the parameters.
* `code` is the function name in Python.

Now, you should have a fully functional block.

Summary of the steps:
1. Initialize the necessary data in the `context.myLib` variable.
2. Create the function as a member of `context.myLib`.
3. List the block in `context.customBlocks` inside `namespace.category`.
4. Add it in `task.js` in `subTask.gridInfos.includeBlocks.generatedBlocks` inside `namespace`.
5. Optionally specify a color for the category in `context.provideBlocklyColours`.
6. Put localized strings in `localLanguageStrings`.

## Manage the display

… (use Raphael and Processing as examples)

## Check end conditions

Your library should provide functions that are outside of the context
to check if a context has reached the winning state or an invalid state.
Such functions should throw the relevant message to the user, with the `throw` keyword.

For the amicable library, we could have the following function:
```js
var amicableCheckEndConditions = {
   checkAllAmicable: function(context, lastTurn) {
      if (!context.amicable.allAmicable) {
         throw("You gave a pair that is not composed of amicable numbers!");
      } else if (lastTurn) {
         throw("All numbers have been tested and they’re all amicable.");
      }
      return true;
   }
};
```

The `lastTurn` parameter is a boolean which indicates if the checking
is done after all blocks have been run.

If the function has nothing to say, it should return `true`.

The function you use in your task must be specified in `task.js`, in `subTask.gridInfos.checkEndCondition`:
```js
subTask.gridInfos = {
   // ...
   checkEndEveryTurn: true,
   checkEndCondition: amicableCheckEndConditions.checkAllAmicable
   // ...
};
```

The `checkEndEveryTurn` controls whether the program should be checked for each block.
If it’s `false`, the `lastTurn` parameter given to the checking function will always be `true`.

Note that the checking function might receive a context that has no display,
so you should not scan the display to do your checking.
All the data which has to be checked must be stored within variables that a display-less context has.

## Define advanced blocks

### Parameter types and return values

…

### Default values

…

### Custom blocks

… (link to Blockly doc)

## Texts and translations

…
