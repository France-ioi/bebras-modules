'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var vm = require('node:vm');

var ROOT = path.join(__dirname, '..', '..');

function jqueryExtend() {
   var deep = false;
   var args = Array.prototype.slice.call(arguments);
   if (typeof args[0] === 'boolean') {
      deep = args.shift();
   }
   var target = args.shift() || {};
   for (var s = 0; s < args.length; s++) {
      var source = args[s];
      if (!source) {
         continue;
      }
      for (var key in source) {
         if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue;
         }
         var value = source[key];
         if (deep && value && typeof value === 'object' && !Array.isArray(value)) {
            if (!target[key] || typeof target[key] !== 'object') {
               target[key] = {};
            }
            jqueryExtend(true, target[key], value);
         } else {
            target[key] = value;
         }
      }
   }
   return target;
}

function loadRobotLib() {
   var sandbox = {};
   sandbox.window = sandbox;
   sandbox.console = console;
   sandbox.$ = function() {
      return {
         attr: function() {
            return 'x/icon.png';
         },
         html: function() {},
         width: function() {},
         height: function() {}
      };
   };
   sandbox.$.extend = jqueryExtend;

   vm.createContext(sandbox);
   vm.runInContext(
      fs.readFileSync(path.join(ROOT, 'pemFioi/quickAlgo/context.js'), 'utf8'),
      sandbox,
      { filename: 'context.js' }
   );
   vm.runInContext(
      fs.readFileSync(path.join(ROOT, 'pemFioi/blocklyRobot_lib-1.1.js'), 'utf8'),
      sandbox,
      { filename: 'blocklyRobot_lib-1.1.js' }
   );
   return sandbox;
}

function minimalInfos() {
   return {
      newBlocks: [],
      itemTypes: {
         robot: { num: 2, isRobot: true, side: 60, nbStates: 1, zOrder: 2 },
         wall: { num: 1, isObstacle: true, side: 60, zOrder: 0 }
      },
      cellSide: 60,
      bagInit: undefined
   };
}

function validGrid() {
   return {
      tiles: [
         [1, 1, 1],
         [1, 2, 1],
         [1, 1, 1]
      ],
      initItems: []
   };
}

function createContext() {
   var sandbox = loadRobotLib();
   var context = sandbox.getContext(false, minimalInfos());
   return { sandbox: sandbox, context: context };
}

test('reset(validGrid) sets dimensions and places items including the robot', function() {
   var created = createContext();
   var context = created.context;
   var grid = validGrid();

   context.reset(grid);

   assert.equal(context.nbRows, 3);
   assert.equal(context.nbCols, 3);
   assert.ok(context.items.length > 0);
   var robot = context.getRobot();
   assert.ok(robot);
   assert.equal(robot.row, 1);
   assert.equal(robot.col, 1);
   assert.equal(robot.isRobot, true);
});

test('reset({}) on a fresh context does not throw and leaves items empty', function() {
   var created = createContext();
   var context = created.context;

   assert.doesNotThrow(function() {
      context.reset({});
   });
   assert.equal(context.items.length, 0);
   assert.equal(context.tiles, undefined);
});

test('reset({}) after a valid grid keeps grid, dimensions and robot start', function() {
   var created = createContext();
   var context = created.context;
   var grid = validGrid();

   context.reset(grid);
   var itemsBefore = context.items.length;
   context.nbMoves = 7;
   context.lost = true;
   context.success = true;
   var robot = context.getRobot();
   robot.row = 0;
   robot.col = 0;

   context.reset({});

   assert.equal(context.nbRows, 3);
   assert.equal(context.nbCols, 3);
   assert.deepEqual(context.tiles, grid.tiles);
   assert.equal(context.items.length, itemsBefore);
   assert.equal(context.nbMoves, 0);
   assert.equal(context.lost, false);
   assert.equal(context.success, false);
   robot = context.getRobot();
   assert.ok(robot);
   assert.equal(robot.row, 1);
   assert.equal(robot.col, 1);
});

test('reset() with no argument after a grid, and on a fresh context', function() {
   var withGrid = createContext();
   withGrid.context.reset(validGrid());
   assert.doesNotThrow(function() {
      withGrid.context.reset();
   });
   var robot = withGrid.context.getRobot();
   assert.ok(robot);
   assert.equal(robot.row, 1);
   assert.equal(robot.col, 1);

   var fresh = createContext();
   assert.doesNotThrow(function() {
      fresh.context.reset();
   });
   assert.equal(fresh.context.items.length, 0);
});

test('getInnerState / reloadInnerState after reset({}) restores items, nbMoves and bag', function() {
   var created = createContext();
   var context = created.context;
   context.reset(validGrid());

   context.nbMoves = 4;
   context.bag = [{ type: 'wall', side: 60 }];
   var robot = context.getRobot();
   robot.row = 1;
   robot.col = 0;
   var saved = JSON.parse(JSON.stringify(context.getInnerState()));

   context.reset({});
   assert.equal(context.nbMoves, 0);
   assert.equal(context.bag.length, 0);
   robot = context.getRobot();
   assert.ok(robot);
   assert.equal(robot.row, 1);
   assert.equal(robot.col, 1);

   context.reloadInnerState(saved);
   assert.equal(context.nbMoves, 4);
   assert.equal(context.bag.length, 1);
   assert.equal(context.bag[0].type, 'wall');
   assert.ok(context.items.length > 0);
   robot = context.getRobot();
   assert.ok(robot);
   assert.equal(robot.row, 1);
   assert.equal(robot.col, 0);
});
