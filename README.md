# Compiled directory of JS includes for bebras tasks

This repository contains a static directory structure used in [Bebras tasks](https://github.com/France-ioi/bebras-tasks).

This would be usually considered bad (or outdated) practice, but it addresses a requirement: allow people who are not experts in JavaScript tools (who cannot install `npm`, `bower`, etc.) to have a development environment for Bebras tasks.

## Bundles

To optimise loading of files, this directory also contains bundles, which can be used in place of importing the corresponding JS files.

To define a bundle, you must, in `importModules*.js` :

* add how to import the bundle to `importableModules`
* add the list of modules this bundle includes in `bundledModules`

and then, include, in `gulpfile.js`, the list of files to include in this bundle.

The command
```
gulp bundles
```
will then generate all bundles into the subfolder `bundles/`.

While testing this feature, bundles are loaded by `importModules*.js` only if `window.useBundles` is `true`.

### TODO

- find a better solution?
- use proper name for task-pr and platform-pr
- make a small .html requiring all modules, to give an example of IDs for all
- package syntaxHighlighter 3.0.9
- package json3
- package recent versions of jquery and jquery-ui
- package minify versions of custom js (integrationAPI, etc.)
