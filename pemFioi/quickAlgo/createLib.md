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

…

## Manage the display

… (use Raphael and Processing as examples)

## Check end conditions

… (with and without display)

## Define advanced blocks

### Parameter types and return values

…

### Default values

…

### Custom blocks

… (link to Blockly doc)

## Texts and translations

…
