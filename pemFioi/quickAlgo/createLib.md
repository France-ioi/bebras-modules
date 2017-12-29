- comment faire tourner ça en local
- créer la base de sa lib: copier l'exemple et changer x et y
- créer un exo qui utilise sa lib
- ajouter un premier bloc basique et l'utiliser dans son sujet
- comment gérer son propre affichage. exemples de raphael et processing
- gérer la validation (faire attention au mode display)
- types de paramètres, valeurs de retours
- blocs avec valeurs par défaut
- blocs avec plusieurs nombres de paramètres possibles
- comment faire des blocs custom (voir la doc de blockly ?)
- gestion des chaînes / traductions

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

…

## Create an exercise for testing

…

## Create your first block

…

## Manage the display

…

## Check end conditions

… (with and without display)

## Block configuration

### Parameter types and return values

…

### Default values

…

## Texts and translations

…
