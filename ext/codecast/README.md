# Skulpt Analysis module for python tasks

## Add the skulpt analysis to a task

In task/index.html, load the <MODULES_DIR>/ext/codecast/loader.js and execute **loadPythonAnalysisModules()**  :

```
  ...
  <script class="remove" type="text/javascript">
    var modulesPath = '../../../_common/modules/'
    importModules(...);
    ...
  </script>

  <script class="remove" type="text/javascript" src="../../../_common/modules/ext/codecast/loader.js"></script>
  <script class="remove" type="text/javascript">
      loadPythonAnalysisModules();
  </script>
  ...
```

## Modify the React components related to analysis display

The components are written using javascript ES6 and their source code is within the **source-components-es6** directory.

If you need to make any modifications to the components, modify the ES6 files, then **from the <MODULES_DIR>/ext/codecast**,
which is the directory you are reading this file, the run the following commands :

    npx babel source-components-es6 --out-dir components --presets react-app/prod

