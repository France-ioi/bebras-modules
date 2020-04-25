# Skulpt Analysis module for python tasks

## Add the skulpt analysis to a task

In task/index.html, load the python_analysis module that is available from importModules 1.5 :

```
  importModules([
    ...'python-analysis'...
  ]);
```

Note : The module will be loaded only if the python language is selected.

In task/task.js, the "variables" whole category must be selected :

```
  ...
  subTask.gridInfos = {
    ...
    includeBlocks: {
      ...
      standardBlocks: {
        ...
        wholeCategories: [..."variables"...],
      }
      ...
    }
    ...
  }
  ...
```

## Modify the React components related to analysis display

The components are written using javascript ES6 and compiled using babel, their source code are within the **source-components-es6** directory.

If you need to make any modifications to the components, modify the ES6 files, then **from the <MODULES_DIR>/ext/codecast**,
which is the directory you are reading this file, run the following commands :

Install the babel tools and the required plugins :

    npm install --save-dev @babel/core @babel/cli @babel/preset-react

Then, generate the files :

    npx babel source-components-es6 --out-dir components --presets @babel/env,@babel/preset-react --plugins @babel/plugin-proposal-class-properties
