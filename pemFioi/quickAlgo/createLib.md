# Manual: create a new quickAlgo library

## Setup the Bebras environment

The preferred way uses [Git](https://www.git-scm.com/downloads) which allows you to easily keep up to date
with the Bebras resources and to submit your work, but you can also make it work with simple downloads with your browser.

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

   Download the zipped [bebras-modules](https://github.com/France-ioi/bebras-modules) repository the same way.
   Then put the extracted directory inside the `bebras-tasks` main folder and name it `modules`.
   The `bebras-modules` downloaded directory (should be `bebras-modules-master`) must be put
   as a `modules` folder inside the `bebras-tasks` directory, i.e. it must be renamed to simply `modules`
   and replace the initially present `modules` folder in the `bebras-tasks` directory.

You can ensure it works by opening any exercise as a file `index.html` in all the subfolders of `bebras-tasks`
except `demo_files` and `modules`.

## Setup your library

The file `blocklyExample_lib.js` within the folder `modules/pemFioi` is a library with simple settings,
ready to be used for a new library. You can create your library as a copy of this file
replacing `Example` by the codename of your library in the filename.

In the file, you’ll see the following sections:
* display strings (`localLanguageStrings`);
* basic variables (`context`, `strings`, `context.example`);
* context management functions (`reset`, `resetDisplay`, `updateScale`, `unload`);
* your library’s functions (`context.example.anything`);
* block definitions (`context.customBlocks`);
* Python constant definitions (`context.customContants`).

Many comments (after `//` or within `/*` and `*/`) provide information about each element.
You might preferably remove them to finalize your library.

Firstly, you should change every occurrence of the word `example` to the codename of your library.

…

## Create an exercise for testing

…

## Experiment with your first block

…

## Manage the display

… (use Raphael and Processing as examples)

## Check end conditions

… (with and without display)

## Block configuration

### Parameter types and return values

…

### Default values

…

### Custom blocks

… (link to Blockly doc)

## Texts and translations

…
