var boardProgramming = (function (exports) {

  var AbstractBoard = /*#__PURE__*/ function() {
      function AbstractBoard() {
          this.strings = {};
          this.defaultSubBoard = 'quickpi';
      }
      var _proto = AbstractBoard.prototype;
      _proto.init = function init(selector, onUserEvent) {};
      _proto.setStrings = function setStrings(strings) {
          this.strings = strings;
      };
      _proto.getCurrentBoard = function getCurrentBoard(board) {
          return this.getBoardDefinitions().find(function(element) {
              if (board === element.name) return element;
          });
      };
      _proto.getCustomBlocks = function getCustomBlocks(context, strings) {
          return {
              customBlocks: {}
          };
      };
      return AbstractBoard;
  }();

  var ConnectionMethod;
  (function(ConnectionMethod) {
      ConnectionMethod["Local"] = "local";
      ConnectionMethod["Wifi"] = "wifi";
      ConnectionMethod["WebSerial"] = "web_serial";
      ConnectionMethod["Usb"] = "usb";
      ConnectionMethod["Bluetooth"] = "bt";
  })(ConnectionMethod || (ConnectionMethod = {}));

  var buzzerSound = {
      context: null,
      default_freq: 200,
      channels: {},
      muted: {},
      getContext: function getContext() {
          if (!this.context) {
              // @ts-ignore
              this.context = 'AudioContext' in window || 'webkitAudioContext' in window ? new (window.AudioContext || window.webkitAudioContext)() : null;
          }
          return this.context;
      },
      startOscillator: function startOscillator(freq) {
          var o = this.context.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          o.connect(this.context.destination);
          o.start();
          return o;
      },
      start: function start(channel, freq) {
          if (freq === void 0) freq = this.default_freq;
          if (!this.channels[channel]) {
              this.channels[channel] = {
                  muted: false
              };
          }
          if (this.channels[channel].freq === freq) {
              return;
          }
          var context = this.getContext();
          if (!context) {
              return;
          }
          this.stop(channel);
          if (freq == 0 || this.channels[channel].muted) {
              return;
          }
          this.channels[channel].oscillator = this.startOscillator(freq);
          this.channels[channel].freq = freq;
      },
      stop: function stop(channel) {
          if (this.channels[channel]) {
              this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
              delete this.channels[channel].oscillator;
              delete this.channels[channel].freq;
          }
      },
      mute: function mute(channel) {
          if (!this.channels[channel]) {
              this.channels[channel] = {
                  muted: true
              };
              return;
          }
          this.channels[channel].muted = true;
          this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
          delete this.channels[channel].oscillator;
      },
      unmute: function unmute(channel) {
          if (!this.channels[channel]) {
              this.channels[channel] = {
                  muted: false
              };
              return;
          }
          this.channels[channel].muted = false;
          if (this.channels[channel].freq) {
              this.channels[channel].oscillator = this.startOscillator(this.channels[channel].freq);
          }
      },
      isMuted: function isMuted(channel) {
          if (this.channels[channel]) {
              return this.channels[channel].muted;
          }
          return false;
      },
      stopAll: function stopAll() {
          for(var channel in this.channels){
              if (this.channels.hasOwnProperty(channel)) {
                  this.stop(channel);
              }
          }
      }
  };

  function _type_of$2(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function arrayContains(array, needle) {
      for(var index in array){
          if (needle == array[index]) {
              return true;
          }
      }
      return false;
  }
  /**
   * This method allow us to verify if the current value is primitive. A primitive is a string or a number or boolean
   * (any value that can be safely compared
   * @param obj The object to check if it is a primitive or not
   * @return {boolean} true if object is primitive, false otherwise
   */ function isPrimitive(obj) {
      return obj !== Object(obj);
  }
  /**
   * THis function allow us to compare two objects. Do not call with {@code null} or {@code undefined}
   * Be careful! Do not use this with circular objects.
   * @param obj1 The first object to compare
   * @param obj2 The second object to compare
   * @return {boolean} true if objects are equals, false otherwise.
   */ function deepEqual(obj1, obj2) {
      if (obj1 === obj2) return true;
      // if one is primitive and not the other, then we can return false. If both are primitive, then the up
      // comparison can return true
      if (isPrimitive(obj1) || isPrimitive(obj2)) return false;
      if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
      // compare objects with same number of keys
      for(var key in obj1){
          if (!(key in obj2)) return false; //other object doesn't have this prop
          if (!deepEqual(obj1[key], obj2[key])) return false;
      }
      return true;
  }
  function deepSubsetEqual(obj1, obj2) {
      if (obj1 === obj2) return true;
      // if one is primitive and not the other, then we can return false. If both are primitive, then the up
      // comparison can return true
      if (isPrimitive(obj1) || isPrimitive(obj2)) return false;
      // compare objects with same number of keys
      for(var key in obj2){
          if (!(key in obj1)) return false; //other object doesn't have this prop
          if (!deepSubsetEqual(obj1[key], obj2[key])) return false;
      }
      return true;
  }
  function getImg(filename) {
      // Get the path to an image stored in bebras-modules
      return (window.modulesPath ? window.modulesPath : '../../modules/') + 'img/quickpi/' + filename;
  }
  function deepMerge() {
      for(var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++){
          objects[_key] = arguments[_key];
      }
      var isObject = function(obj) {
          return obj && (typeof obj === "undefined" ? "undefined" : _type_of$2(obj)) === 'object';
      };
      return objects.reduce(function(prev, obj) {
          Object.keys(obj).forEach(function(key) {
              var pVal = prev[key];
              var oVal = obj[key];
              if (Array.isArray(pVal) && Array.isArray(oVal)) {
                  var _pVal;
                  prev[key] = (_pVal = pVal).concat.apply(_pVal, [].concat(oVal));
              } else if (isObject(pVal) && isObject(oVal)) {
                  prev[key] = deepMerge(pVal, oVal);
              } else {
                  prev[key] = oVal;
              }
          });
          return prev;
      }, {});
  }
  function textEllipsis(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  var LocalQuickStore = /*#__PURE__*/ function() {
      function LocalQuickStore() {
          this.connected = false;
          this.Store = {};
          this.connected = true;
          this.rwpassword = "dummy";
      }
      var _proto = LocalQuickStore.prototype;
      _proto.write = function write(prefix, key, value) {
          this.Store[key] = value;
      };
      _proto.read = function read(prefix, key, value) {
          return this.Store[key];
      };
      _proto.getStateData = function getStateData() {
          // round trip this trought json so we actually copy everything
          // without keeping any references to objects
          return JSON.parse(JSON.stringify(this.Store));
      };
      LocalQuickStore.renderDifferences = function renderDifferences(expectedState, state) {
          var strings = window.task.displayedSubTask.context.setLocalLanguageStrings(window.localLanguageStrings);
          var mainDiv = document.createElement("div");
          for(var p in expectedState){
              if (expectedState.hasOwnProperty(p) && !state.hasOwnProperty(p)) {
                  var div = document.createElement("div");
                  $(div).text(strings.messages.cloudKeyNotExists.format(p));
                  $(mainDiv).append(div);
              }
              if (expectedState[p] != state[p]) {
                  var div1 = document.createElement("div");
                  var message = strings.messages.cloudWrongValue.format(p, expectedState[p], state[p]);
                  $(div1).text(message);
                  $(mainDiv).append(div1);
              }
          }
          for(var p1 in state){
              if (state.hasOwnProperty(p1) && !expectedState.hasOwnProperty(p1)) {
                  var div2 = document.createElement("div");
                  $(div2).text(strings.messages.cloudUnexpectedKey.format(p1));
                  $(mainDiv).append(div2);
              }
          }
          return mainDiv;
      };
      LocalQuickStore.compareState = function compareState(state1, state2) {
          return deepEqual(state1, state2);
      };
      return LocalQuickStore;
  }();

  var QuickStore = /*#__PURE__*/ function() {
      function QuickStore(rwidentifier, rwpassword) {
          this.url = 'https://cloud.quick-pi.org';
          this.connected = false;
          this.rwidentifier = rwidentifier;
          this.rwpassword = rwpassword;
          this.connected = !!rwpassword;
      }
      var _proto = QuickStore.prototype;
      _proto.read = function read(identifier, key, callback) {
          var data = {
              prefix: identifier,
              key: key
          };
          this.post('/api/data/read', data, callback);
      };
      _proto.write = function write(identifier, key, value, callback) {
          if (identifier !== this.rwidentifier) {
              callback({
                  sucess: false,
                  message: "Écriture sur un identifiant en lecture seule : " + identifier
              });
          } else {
              var data = {
                  prefix: identifier,
                  password: this.rwpassword,
                  key: key,
                  value: JSON.stringify(value)
              };
              this.post('/api/data/write', data, callback);
          }
      };
      _proto.post = function post(path, data, callback) {
          $.ajax({
              type: 'POST',
              url: this.url + path,
              crossDomain: true,
              data: data,
              dataType: 'json',
              success: callback
          });
      };
      return QuickStore;
  }();

  if (!window.OffscreenCanvas) {
      window.OffscreenCanvas = function OffscreenCanvas1(width, height) {
          var _this = this;
          this.canvas = document.createElement("canvas");
          this.canvas.width = width;
          this.canvas.height = height;
          this.canvas.convertToBlob = function() {
              return new Promise(function(resolve) {
                  _this.canvas.toBlob(resolve);
              });
          };
          return this.canvas;
      };
  }
  var screenImageData = /*#__PURE__*/ function() {
      function screenImageData() {
          this.isDrawingData = true;
          this.imagedata = [];
      }
      var _proto = screenImageData.prototype;
      _proto.addData = function addData(scale, data) {
          this.imagedata.push({
              scale: scale,
              data: data
          });
      };
      _proto.getData = function getData(scale) {
          for(var i = 0; i < this.imagedata.length; i++){
              if (this.imagedata[i].scale == scale) return this.imagedata[i].data;
          }
          return null;
      };
      return screenImageData;
  }();
  var screenDrawing = /*#__PURE__*/ function() {
      function screenDrawing(onScreenCanvas) {
          this.width = 128;
          this.height = 32;
          this.scales = [
              0.5,
              1,
              2
          ];
          this.canvas = [
              null,
              null,
              null
          ];
          this.resetCanvas();
          this.noFillStatus = false;
          this.noStrokeStatus = false;
      }
      var _proto = screenDrawing.prototype;
      _proto.resetCanvas = function resetCanvas() {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this.canvas[i] = new OffscreenCanvas(this.width * scale, this.height * scale);
              var ctx = this.canvas[i].getContext('2d');
              ctx.imageSmoothingEnabled = false;
              ctx.fillStyle = "white";
              ctx.fillRect(0, 0, this.canvas[i].width, this.canvas[i].height);
              ctx.fillStyle = "black";
              ctx.strokeStyle = "black";
              ctx.lineWidth = scale;
          }
      };
      _proto.getStateData = function getStateData() {
          var imageData = new screenImageData();
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              var ctx = this.canvas[i].getContext('2d');
              var imagedata = ctx.getImageData(0, 0, this.canvas[i].width, this.canvas[i].height);
              imageData.addData(scale, imagedata);
          }
          return imageData;
      };
      _proto.fill = function fill(color) {
          this.noFillStatus = false;
          for(var i = 0; i < this.scales.length; i++){
              var canvas = this.canvas[i];
              var ctx = canvas.getContext('2d');
              if (color) ctx.fillStyle = "black";
              else ctx.fillStyle = "white";
          }
      };
      _proto.noFill = function noFill(color) {
          this.noFillStatus = true;
      };
      _proto.stroke = function stroke(color) {
          this.noStrokeStatus = false;
          for(var i = 0; i < this.scales.length; i++){
              var canvas = this.canvas[i];
              var ctx = canvas.getContext('2d');
              if (color) ctx.strokeStyle = "black";
              else ctx.strokeStyle = "white";
          }
      };
      _proto.noStroke = function noStroke(color) {
          this.noStrokeStatus = true;
      };
      _proto._drawPoint = function _drawPoint(canvas, scale, x, y) {
          var ctx = canvas.getContext('2d');
          ctx.fillRect(scale * x, scale * y, scale * 1, scale * 1);
      };
      _proto.drawPoint = function drawPoint(x, y) {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this._drawPoint(this.canvas[i], scale, x, y);
          }
      };
      _proto.isPointSet = function isPointSet(x, y) {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              if (scale == 1) {
                  var ctx = this.canvas[i].getContext('2d');
                  var imagedata = ctx.getImageData(0, 0, this.canvas[i].width, this.canvas[i].height);
                  var basepos = (x + y * this.canvas[i].width) * 4;
                  var r = imagedata.data[basepos];
                  var g = imagedata.data[basepos + 1];
                  var b = imagedata.data[basepos + 2];
                  imagedata.data[basepos + 3];
                  if (r != 255 && g != 255 && b != 255) return true;
                  break;
              }
          }
          return false;
      };
      _proto._drawLine = function _drawLine(canvas, scale, x0, y0, x1, y1) {
          var ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(scale * x0, scale * y0);
          ctx.lineTo(scale * x1, scale * y1);
          ctx.closePath();
          ctx.stroke();
      };
      _proto.drawLine = function drawLine(x0, y0, x1, y1) {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this._drawLine(this.canvas[i], scale, x0, y0, x1, y1);
          }
      };
      _proto._drawRectangle = function _drawRectangle(canvas, scale, x0, y0, width, height) {
          var ctx = canvas.getContext('2d');
          if (!this.noFillStatus) {
              ctx.fillRect(scale * x0, scale * y0, scale * width, scale * height);
          }
          if (!this.noStrokeStatus) {
              ctx.strokeRect(scale * x0, scale * y0, scale * width, scale * height);
          }
      };
      _proto.drawRectangle = function drawRectangle(x0, y0, width, height) {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this._drawRectangle(this.canvas[i], scale, x0, y0, width, height);
          }
      };
      _proto._drawCircle = function _drawCircle(canvas, scale, x0, y0, diameter) {
          var ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.arc(scale * x0, scale * y0, scale * diameter / 2, 0, Math.PI * 2);
          ctx.closePath();
          if (!this.noFillStatus) {
              ctx.fill();
          }
          if (!this.noStrokeStatus) {
              ctx.stroke();
          }
      };
      _proto.drawCircle = function drawCircle(x0, y0, diameter) {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this._drawCircle(this.canvas[i], scale, x0, y0, diameter);
          }
      };
      _proto._clearScreen = function _clearScreen(canvas, scale) {
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "black";
          ctx.strokeStyle = "black";
      };
      _proto.clearScreen = function clearScreen() {
          for(var i = 0; i < this.scales.length; i++){
              var scale = this.scales[i];
              this._clearScreen(this.canvas[i], scale);
          }
      };
      _proto.copyToCanvas = function copyToCanvas(canvas, scale) {
          for(var i = 0; i < this.scales.length; i++){
              var currentScale = this.scales[i];
              if (currentScale == scale) {
                  var ctx = canvas.getContext('2d');
                  ctx.drawImage(this.canvas[i], 0, 0, this.canvas[i].width, this.canvas[i].height, 0, 0, canvas.width, canvas.height);
              }
          }
      };
      screenDrawing.renderToCanvas = function renderToCanvas(state, canvas, scale) {
          var ctx = canvas.getContext('2d');
          ctx.putImageData(state.getData(scale), 0, 0);
      };
      screenDrawing.renderDifferences = function renderDifferences(dataExpected, dataWrong, canvas, scale) {
          var ctx = canvas.getContext('2d');
          var expectedData = dataExpected.getData(scale);
          var actualData = dataWrong.getData(scale);
          var newData = ctx.createImageData(canvas.width, canvas.height);
          for(var i = 0; i < newData.data.length; i += 4){
              var actualSet = false;
              var expectedSet = false;
              if (expectedData.data[i + 0] != 255 && expectedData.data[i + 1] != 255 && expectedData.data[i + 2] != 255) {
                  expectedSet = true;
              }
              if (actualData.data[i + 0] != 255 && actualData.data[i + 1] != 255 && actualData.data[i + 2] != 255) {
                  actualSet = true;
              }
              if (expectedSet && actualSet) {
                  newData.data[i + 0] = 0;
                  newData.data[i + 1] = 0;
                  newData.data[i + 2] = 0;
              } else if (expectedSet) {
                  newData.data[i + 0] = 100;
                  newData.data[i + 1] = 100;
                  newData.data[i + 2] = 100;
              } else if (actualSet) {
                  newData.data[i + 0] = 255;
                  newData.data[i + 1] = 0;
                  newData.data[i + 2] = 0;
              } else {
                  newData.data[i + 0] = 255;
                  newData.data[i + 1] = 255;
                  newData.data[i + 2] = 255;
              }
              newData.data[i + 3] = 255;
          }
          ctx.putImageData(newData, 0, 0);
      };
      return screenDrawing;
  }();

  function _type_of$1(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function quickpiModuleDefinition(context, strings) {
      var sensorHandler = context.sensorHandler;
      var blockDefinitions = {
          sensors: [
              {
                  name: "currentTime",
                  yieldsValue: 'int'
              },
              {
                  name: "waitForButton",
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("button")
                          }
                      ]
                  }
              },
              {
                  name: "isButtonPressed",
                  yieldsValue: 'bool'
              },
              {
                  name: "isButtonPressedWithName",
                  yieldsValue: 'bool',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("button")
                          }
                      ]
                  }
              },
              {
                  name: "buttonWasPressed",
                  yieldsValue: 'bool',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("button")
                          }
                      ]
                  }
              },
              {
                  name: "onButtonPressed",
                  params: [
                      "String",
                      "Statement"
                  ],
                  blocklyInit: function blocklyInit() {
                      return function() {
                          this.setColour(context.blocklyHelper.getDefaultColours().categories["sensors"]);
                          this.appendDummyInput("PARAM_0").appendField(strings.label.onButtonPressed).appendField(new window.Blockly.FieldDropdown(sensorHandler.getSensorNames("button")), 'PARAM_0').appendField(strings.label.onButtonPressedEnd);
                          this.appendStatementInput("PARAM_1").setCheck(null).appendField(strings.label.onButtonPressedDo);
                          this.setPreviousStatement(false);
                          this.setNextStatement(false);
                          this.setOutput(null);
                      };
                  },
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("button")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  }
              },
              {
                  name: "readTemperature",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("temperature")
                          }
                      ]
                  }
              },
              {
                  name: "readRotaryAngle",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("potentiometer")
                          }
                      ]
                  }
              },
              {
                  name: "readDistance",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("range")
                          }
                      ]
                  }
              },
              {
                  name: "readLightIntensity",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("light")
                          }
                      ]
                  }
              },
              {
                  name: "readHumidity",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("humidity")
                          }
                      ]
                  }
              },
              {
                  name: "readAcceleration",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": [
                                  [
                                      "x",
                                      "x"
                                  ],
                                  [
                                      "y",
                                      "y"
                                  ],
                                  [
                                      "z",
                                      "z"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "computeRotation",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": [
                                  [
                                      "pitch",
                                      "pitch"
                                  ],
                                  [
                                      "roll",
                                      "roll"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "readSoundLevel",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("sound")
                          }
                      ]
                  }
              },
              {
                  name: "readMagneticForce",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": [
                                  [
                                      "x",
                                      "x"
                                  ],
                                  [
                                      "y",
                                      "y"
                                  ],
                                  [
                                      "z",
                                      "z"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "computeCompassHeading",
                  yieldsValue: 'int'
              },
              {
                  name: "readInfraredState",
                  yieldsValue: 'bool',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("irrecv")
                          }
                      ]
                  }
              },
              {
                  name: "readIRMessage",
                  yieldsValue: 'string',
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("irrecv")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='readIRMessage'>" + "<value name='PARAM_1'><shadow type='math_number'><field name='NUM'>10000</field></shadow></value>" + "</block>"
              },
              {
                  name: "readAngularVelocity",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": [
                                  [
                                      "x",
                                      "x"
                                  ],
                                  [
                                      "y",
                                      "y"
                                  ],
                                  [
                                      "z",
                                      "z"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "setGyroZeroAngle"
              },
              {
                  name: "computeRotationGyro",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": [
                                  [
                                      "x",
                                      "x"
                                  ],
                                  [
                                      "y",
                                      "y"
                                  ],
                                  [
                                      "z",
                                      "z"
                                  ]
                              ]
                          }
                      ]
                  }
              }
          ],
          actuator: [
              {
                  name: "turnLedOn"
              },
              {
                  name: "turnLedOff"
              },
              {
                  name: "turnBuzzerOn"
              },
              {
                  name: "turnBuzzerOff"
              },
              {
                  name: "setLedState",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          },
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_1",
                              "options": [
                                  [
                                      strings.messages.on.toUpperCase(),
                                      "1"
                                  ],
                                  [
                                      strings.messages.off.toUpperCase(),
                                      "0"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "setLedMatrixOne",
                  params: [
                      "String",
                      "Number",
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_2"
                          },
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_3",
                              "options": [
                                  [
                                      strings.messages.on.toUpperCase(),
                                      "1"
                                  ],
                                  [
                                      strings.messages.off.toUpperCase(),
                                      "0"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "setBuzzerState",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("buzzer")
                          },
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_1",
                              "options": [
                                  [
                                      strings.messages.on.toUpperCase(),
                                      "1"
                                  ],
                                  [
                                      strings.messages.off.toUpperCase(),
                                      "0"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "setBuzzerNote",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("buzzer")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='setBuzzerNote'>" + "<value name='PARAM_1'><shadow type='math_number'><field name='NUM'>200</field></shadow></value>" + "</block>"
              },
              {
                  name: "getBuzzerNote",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("buzzer")
                          }
                      ]
                  }
              },
              {
                  name: "setLedBrightness",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='setLedBrightness'>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "getLedBrightness",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          }
                      ]
                  }
              },
              {
                  name: "isLedOn",
                  yieldsValue: 'bool'
              },
              {
                  name: "isLedOnWithName",
                  yieldsValue: 'bool',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          }
                      ]
                  }
              },
              {
                  name: "isBuzzerOn",
                  yieldsValue: 'bool'
              },
              {
                  name: "isBuzzerOnWithName",
                  yieldsValue: 'bool',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("buzzer")
                          }
                      ]
                  }
              },
              {
                  name: "toggleLedState",
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("led")
                          }
                      ]
                  }
              },
              {
                  name: "setServoAngle",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("servo")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='setServoAngle'>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "getServoAngle",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("servo")
                          }
                      ]
                  }
              },
              {
                  name: "setContinousServoDirection",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("servo")
                          },
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_1",
                              "options": [
                                  [
                                      "forward",
                                      "1"
                                  ],
                                  [
                                      "backwards",
                                      "-1"
                                  ],
                                  [
                                      "stop",
                                      "0"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "setInfraredState",
                  params: [
                      "String",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("irtrans")
                          },
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_1",
                              "options": [
                                  [
                                      strings.messages.on.toUpperCase(),
                                      "1"
                                  ],
                                  [
                                      strings.messages.off.toUpperCase(),
                                      "0"
                                  ]
                              ]
                          }
                      ]
                  }
              },
              {
                  name: "sendIRMessage",
                  params: [
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_dropdown",
                              "name": "PARAM_0",
                              "options": sensorHandler.getSensorNames("irtrans")
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              "text": ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='sendIRMessage'>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "presetIRMessage",
                  params: [
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              "text": ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              "text": ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='presetIRMessage'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "sleep",
                  params: [
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              "value": 0
                          }
                      ]
                  },
                  blocklyXml: "<block type='sleep'>" + "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1000</field></shadow></value>" + "</block>"
              }
          ],
          display: [
              {
                  name: "displayText",
                  params: [
                      "String",
                      "String"
                  ],
                  variants: [
                      [
                          null
                      ],
                      [
                          null,
                          null
                      ]
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              "text": ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='displayText'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>" + strings.messages.hello + "</field> </shadow></value>" + "</block>"
              },
              {
                  name: "displayText2Lines",
                  params: [
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              "text": ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              "text": ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='displayText2Lines'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>" + strings.messages.hello + "</field> </shadow></value>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "drawPoint",
                  params: [
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='drawPoint'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "isPointSet",
                  yieldsValue: 'bool',
                  params: [
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          }
                      ]
                  },
                  blocklyXml: "<block type='isPointSet'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "drawLine",
                  params: [
                      "Number",
                      "Number",
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_2"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_3"
                          }
                      ]
                  },
                  blocklyXml: "<block type='drawLine'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "drawRectangle",
                  params: [
                      "Number",
                      "Number",
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_2"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_3"
                          }
                      ]
                  },
                  blocklyXml: "<block type='drawRectangle'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "drawCircle",
                  params: [
                      "Number",
                      "Number",
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1"
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_2"
                          }
                      ]
                  },
                  blocklyXml: "<block type='drawCircle'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" + "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "clearScreen"
              },
              {
                  name: "updateScreen"
              },
              {
                  name: "autoUpdate",
                  params: [
                      "Boolean"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          }
                      ]
                  },
                  blocklyXml: "<block type='autoUpdate'>" + "<value name='PARAM_0'><shadow type='logic_boolean'></shadow></value>" + "</block>"
              },
              {
                  name: "fill",
                  params: [
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          }
                      ]
                  },
                  blocklyXml: "<block type='fill'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "noFill"
              },
              {
                  name: "stroke",
                  params: [
                      "Number"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0"
                          }
                      ]
                  },
                  blocklyXml: "<block type='stroke'>" + "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" + "</block>"
              },
              {
                  name: "noStroke"
              }
          ],
          internet: [
              {
                  name: "getTemperatureFromCloud",
                  yieldsValue: 'int',
                  params: [
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "field_input",
                              "name": "PARAM_0",
                              text: "Paris"
                          }
                      ]
                  },
                  blocklyXml: "<block type='getTemperatureFromCloud'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "connectToCloudStore",
                  params: [
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              text: ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              text: ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='connectToCloudStore'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "writeToCloudStore",
                  params: [
                      "String",
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              text: ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              text: ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_2",
                              text: ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='writeToCloudStore'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "<value name='PARAM_2'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              },
              {
                  name: "readFromCloudStore",
                  yieldsValue: 'string',
                  params: [
                      "String",
                      "String"
                  ],
                  blocklyJson: {
                      "args0": [
                          {
                              "type": "input_value",
                              "name": "PARAM_0",
                              text: ""
                          },
                          {
                              "type": "input_value",
                              "name": "PARAM_1",
                              text: ""
                          }
                      ]
                  },
                  blocklyXml: "<block type='readFromCloudStore'>" + "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" + "</block>"
              }
          ]
      };
      var getTemperatureFromCloudURl = "https://cloud.quick-pi.org/cache/weather.php";
      var getTemperatureFromCloudSupportedTowns = [];
      // setup the supported towns
      $.get(getTemperatureFromCloudURl + "?q=" + "supportedtowns", function(towns) {
          getTemperatureFromCloudSupportedTowns = JSON.parse(towns);
      });
      // We create a cache so there is less calls to the api and we get the results of the temperature faster
      var getTemperatureFromCloudCache = {};
      var blockImplementations = {
          turnLedOn: function turnLedOn(callback) {
              var sensor = sensorHandler.findSensorByType("led");
              context.registerQuickPiEvent(sensor.name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("turnLedOn()", cb);
              }
          },
          turnLedOff: function turnLedOff(callback) {
              var sensor = sensorHandler.findSensorByType("led");
              context.registerQuickPiEvent(sensor.name, false);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("turnLedOff()", cb);
              }
          },
          setLedMatrixOne: function setLedMatrixOne(name, i, j, state, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (i < 0 || i > 5 || j < 0 || j > 5) {
                  throw "invalid led position";
              }
              sensor.state[i][j] = state ? 1 : 0;
              context.registerQuickPiEvent(name, sensor.state);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var command = "setLedMatrixState(\"" + name + "\"," + JSON.stringify(sensor.state) + ")";
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          turnBuzzerOn: function turnBuzzerOn(callback) {
              context.registerQuickPiEvent("buzzer1", true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("turnBuzzerOn()", cb);
              }
          },
          turnBuzzerOff: function turnBuzzerOff(callback) {
              context.registerQuickPiEvent("buzzer1", false);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("turnBuzzerOff()", cb);
              }
          },
          waitForButton: function waitForButton(name, callback) {
              //        context.registerQuickPiEvent("button", "D22", "wait", false);
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading) {
                  context.advanceToNextRelease("button", sensor.port);
                  context.waitDelay(callback);
              } else if (context.offLineMode) {
                  if (sensor) {
                      var cb = context.runner.waitCallback(callback);
                      sensor.onPressed = function() {
                          cb();
                      };
                  } else {
                      context.waitDelay(callback);
                  }
              } else {
                  var cb1 = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("waitForButton(\"" + name + "\")", cb1);
              }
          },
          isButtonPressed: function isButtonPressed(arg1, arg2) {
              var callback;
              var sensor;
              var name;
              if (typeof arg2 == "undefined") {
                  // no arguments
                  callback = arg1;
                  sensor = sensorHandler.findSensorByType("button");
                  name = sensor.name;
              } else {
                  callback = arg2;
                  sensor = sensorHandler.findSensorByName(arg1, true);
                  name = arg1;
              }
              if (!context.display || context.autoGrading || context.offLineMode) {
                  if (sensor.type == "stick") {
                      context.getSensorState(name);
                      var stickDefinition = sensorHandler.findSensorDefinition(sensor);
                      var buttonstate = stickDefinition.getButtonState(name, sensor.state);
                      context.runner.noDelay(callback, buttonstate);
                  } else {
                      var state1 = context.getSensorState(name);
                      context.runner.noDelay(callback, state1);
                  }
              } else {
                  var cb = context.runner.waitCallback(callback);
                  if (sensor.type == "stick") {
                      var stickDefinition1 = sensorHandler.findSensorDefinition(sensor);
                      sensor.getLiveState(function(returnVal) {
                          sensor.state = returnVal;
                          sensorHandler.drawSensor(sensor);
                          var buttonstate = stickDefinition1.getButtonState(name, sensor.state);
                          cb(buttonstate);
                      });
                  } else {
                      sensor.getLiveState(function(returnVal) {
                          sensor.state = returnVal != "0";
                          sensorHandler.drawSensor(sensor);
                          cb(returnVal != "0");
                      });
                  }
              }
          },
          buttonWasPressed: function buttonWasPressed(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.getSensorState(name);
                  var wasPressed = !!sensor.wasPressed;
                  sensor.wasPressed = false;
                  context.runner.noDelay(callback, wasPressed);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("buttonWasPressed(\"" + name + "\")", function(returnVal) {
                      cb(returnVal != "0");
                  });
              }
          },
          setLedState: function setLedState(name, state, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              var command = "setLedState(\"" + sensor.port + "\"," + (state ? "True" : "False") + ")";
              context.registerQuickPiEvent(name, state ? true : false);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          setBuzzerState: function setBuzzerState(name, state, callback) {
              sensorHandler.findSensorByName(name, true);
              var command = "setBuzzerState(\"" + name + "\"," + (state ? "True" : "False") + ")";
              context.registerQuickPiEvent(name, state ? true : false);
              if (context.display) {
                  state ? buzzerSound.start(name) : buzzerSound.stop(name);
              }
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          isBuzzerOn: function isBuzzerOn(arg1, arg2) {
              var callback = arg2;
              var sensor = sensorHandler.findSensorByName(arg1, true);
              if (typeof arg2 == "undefined") {
                  // no arguments
                  callback = arg1;
                  sensor = sensorHandler.findSensorByType("buzzer");
              }
              var command = "isBuzzerOn(\"" + sensor.name + "\")";
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState("buzzer1");
                  context.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          setBuzzerNote: function setBuzzerNote(name, frequency, callback) {
              sensorHandler.findSensorByName(name, true);
              var command = "setBuzzerNote(\"" + name + "\"," + frequency + ")";
              context.registerQuickPiEvent(name, frequency);
              if (context.display && context.offLineMode) {
                  buzzerSound.start(name, frequency);
              }
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          getBuzzerNote: function getBuzzerNote(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              var command = "getBuzzerNote(\"" + name + "\")";
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback, sensor.state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          setLedBrightness: function setLedBrightness(name, level, callback) {
              sensorHandler.findSensorByName(name, true);
              if ((typeof level === "undefined" ? "undefined" : _type_of$1(level)) == "object") {
                  level = level.valueOf();
              }
              var command = "setLedBrightness(\"" + name + "\"," + level + ")";
              context.registerQuickPiEvent(name, level);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          getLedBrightness: function getLedBrightness(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              var command = "getLedBrightness(\"" + name + "\")";
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback, sensor.state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          isLedOn: function isLedOn(arg1, arg2) {
              var callback = arg2;
              var sensor = sensorHandler.findSensorByName(arg1, true);
              if (typeof arg2 == "undefined") {
                  // no arguments
                  callback = arg1;
                  sensor = sensorHandler.findSensorByType("led");
              }
              var command = "getLedState(\"" + sensor.name + "\")";
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback, sensor.state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          toggleLedState: function toggleLedState(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              var command = "toggleLedState(\"" + name + "\")";
              var state = sensor.state;
              context.registerQuickPiEvent(name, !state);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      return returnVal != "0";
                  });
              }
          },
          displayText: function displayText(line1, arg2, arg3) {
              var line2 = arg2;
              var callback = arg3;
              if (typeof arg3 == "undefined") {
                  // Only one argument
                  line2 = null;
                  callback = arg2;
              }
              var sensor = sensorHandler.findSensorByType("screen");
              var command = "displayText(\"" + line1 + "\", \"\")";
              context.registerQuickPiEvent(sensor.name, {
                  line1: line1,
                  line2: line2
              });
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(retval) {
                      cb();
                  });
              }
          },
          readTemperature: function readTemperature(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.runner.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          sleep: function sleep(time, callback) {
              context.increaseTimeBy(time);
              if (!context.display || context.autoGrading) {
                  context.runner.noDelay(callback);
              } else {
                  context.runner.waitDelay(callback, null, time);
              }
          },
          setServoAngle: function setServoAngle(name, angle, callback) {
              sensorHandler.findSensorByName(name, true);
              if (angle > 180) angle = 180;
              else if (angle < 0) angle = 0;
              context.registerQuickPiEvent(name, angle);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var command = "setServoAngle(\"" + name + "\"," + angle + ")";
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          getServoAngle: function getServoAngle(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              var command = "getServoAngle(\"" + name + "\")";
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback, sensor.state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      returnVal = parseFloat(returnVal);
                      cb(returnVal);
                  });
              }
          },
          setContinousServoDirection: function setContinousServoDirection(name, direction, callback) {
              sensorHandler.findSensorByName(name, true);
              var angle = 90;
              if (direction > 0) {
                  angle = 0;
              } else if (direction < 0) {
                  angle = 180;
              }
              context.registerQuickPiEvent(name, angle);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var command = "setServoAngle(\"" + name + "\"," + angle + ")";
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand(command, cb);
              }
          },
          readRotaryAngle: function readRotaryAngle(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          readDistance: function readDistance(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          readLightIntensity: function readLightIntensity(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          readHumidity: function readHumidity(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.waitDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          currentTime: function currentTime(callback) {
              var millis = new Date().getTime();
              if (context.autoGrading) {
                  millis = context.currentTime;
              }
              context.runner.waitDelay(callback, millis);
          },
          getTemperatureFromCloud: function getTemperatureFromCloud(location, callback) {
              var url = getTemperatureFromCloudURl;
              if (!arrayContains(getTemperatureFromCloudSupportedTowns, location)) throw strings.messages.getTemperatureFromCloudWrongValue.format(location);
              var cache = getTemperatureFromCloudCache;
              if (cache[location] != undefined && (Date.now() - cache[location].lastUpdate) / 1000 / 60 < 10) {
                  context.waitDelay(callback, cache[location].temperature);
                  return;
              }
              var cb = context.runner.waitCallback(callback);
              $.get(url + "?q=" + location, function(data) {
                  // If the server return invalid it mean that the town given is not supported
                  if (data === "invalid") {
                      // This only happen when the user give an invalid town to the server, which should never happen because
                      // the validity of the user input is checked above.
                      cb(0);
                  } else {
                      cache[location] = {
                          lastUpdate: Date.now(),
                          temperature: data
                      }, cb(data);
                  }
              });
          },
          initScreenDrawing: function initScreenDrawing(sensor) {
              if (!sensor.screenDrawing) sensor.screenDrawing = new screenDrawing(sensor.canvas);
          },
          drawPoint: function drawPoint(x, y, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.drawPoint(x, y);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "drawPoint(" + x + "," + y + ")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          isPointSet: function isPointSet(x, y, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              var value = sensor.screenDrawing.isPointSet(x, y);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback, value);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "isPointSet(" + x + "," + y + ")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          drawLine: function drawLine(x0, y0, x1, y1, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.drawLine(x0, y0, x1, y1);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "drawLine(" + x0 + "," + y0 + "," + x1 + "," + y1 + ")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          drawRectangle: function drawRectangle(x0, y0, width, height, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.drawRectangle(x0, y0, width, height);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "drawRectangle(" + x0 + "," + y0 + "," + width + "," + height + ")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          drawCircle: function drawCircle(x0, y0, diameter, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.drawCircle(x0, y0, diameter, diameter);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "drawCircle(" + x0 + "," + y0 + "," + diameter + ")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          clearScreen: function clearScreen(callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.clearScreen();
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "clearScreen()";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          updateScreen: function updateScreen(callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "updateScreen()";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          autoUpdate: function autoUpdate(autoupdate, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "autoUpdate(\"" + (autoupdate ? "True" : "False") + "\")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          fill: function fill(color, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.fill(color);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "fill(\"" + color + "\")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          noFill: function noFill(callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.noFill();
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "NoFill()";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          stroke: function stroke(color, callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.stroke(color);
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "stroke(\"" + color + "\")";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          noStroke: function noStroke(callback) {
              var sensor = sensorHandler.findSensorByType("screen");
              context.quickpi.initScreenDrawing(sensor);
              sensor.screenDrawing.noStroke();
              context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "noStroke()";
                  context.quickPiConnection.sendCommand(command, function() {
                      cb();
                  });
              }
          },
          readAcceleration: function readAcceleration(axis, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("accelerometer");
                  var index = 0;
                  if (axis == "x") index = 0;
                  else if (axis == "y") index = 1;
                  else if (axis == "z") index = 2;
                  var state = context.getSensorState(sensor.name);
                  if (Array.isArray(state)) context.waitDelay(callback, state[index]);
                  else context.waitDelay(callback, 0);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "readAcceleration(\"" + axis + "\")";
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      cb(Number(returnVal));
                  });
              }
          },
          computeRotation: function computeRotation(rotationType, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("accelerometer");
                  var zsign = 1;
                  var result = 0;
                  if (sensor.state[2] < 0) zsign = -1;
                  if (rotationType == "pitch") {
                      result = 180 * Math.atan2(sensor.state[0], zsign * Math.sqrt(sensor.state[1] * sensor.state[1] + sensor.state[2] * sensor.state[2])) / Math.PI;
                  } else if (rotationType == "roll") {
                      result = 180 * Math.atan2(sensor.state[1], zsign * Math.sqrt(sensor.state[0] * sensor.state[0] + sensor.state[2] * sensor.state[2])) / Math.PI;
                  }
                  result = Math.round(result);
                  context.waitDelay(callback, result);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var command = "computeRotation(\"" + rotationType + "\")";
                  context.quickPiConnection.sendCommand(command, function(returnVal) {
                      cb(returnVal);
                  });
              }
          },
          readSoundLevel: function readSoundLevel(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.runner.noDelay(callback, state);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          readMagneticForce: function readMagneticForce(axis, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("magnetometer");
                  var index = 0;
                  if (axis == "x") index = 0;
                  else if (axis == "y") index = 1;
                  else if (axis == "z") index = 2;
                  context.waitDelay(callback, sensor.state[index]);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var sensor1 = sensorHandler.findSensorByType("magnetometer");
                  sensor1.getLiveState(function(returnVal) {
                      sensor1.state = returnVal;
                      sensorHandler.drawSensor(sensor1);
                      if (axis == "x") returnVal = returnVal[0];
                      else if (axis == "y") returnVal = returnVal[1];
                      else if (axis == "z") returnVal = returnVal[2];
                      cb(returnVal);
                  });
              }
          },
          computeCompassHeading: function computeCompassHeading(callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("magnetometer");
                  var heading = Math.atan2(sensor.state[0], sensor.state[1]) * (180 / Math.PI) + 180;
                  heading = Math.round(heading);
                  context.runner.noDelay(callback, heading);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var sensor1 = sensorHandler.findSensorByType("magnetometer");
                  context.quickPiConnection.sendCommand("readMagnetometerLSM303C()", function(returnVal) {
                      sensor1.state = JSON.parse(returnVal);
                      sensorHandler.drawSensor(sensor1);
                      returnVal = Math.atan2(sensor1.state[0], sensor1.state[1]) * (180 / Math.PI) + 180;
                      returnVal = Math.floor(returnVal);
                      cb(returnVal);
                  }, true);
              }
          },
          readInfraredState: function readInfraredState(name, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var state = context.getSensorState(name);
                  context.runner.noDelay(callback, state ? true : false);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.getLiveState(function(returnVal) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                      cb(returnVal);
                  });
              }
          },
          setInfraredState: function setInfraredState(name, state, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              context.registerQuickPiEvent(name, !!state);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.setLiveState(state, cb);
              }
          },
          onButtonPressed: function onButtonPressed(name, func, callback) {
              sensorHandler.findSensorByName(name, true);
              context.waitForEvent(function(callback) {
                  context.quickpi.isButtonPressed(name, callback);
              }, func);
              context.waitDelay(callback);
          },
          //// Gyroscope
          readAngularVelocity: function readAngularVelocity(axis, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("gyroscope");
                  var index = 0;
                  if (axis == "x") index = 0;
                  else if (axis == "y") index = 1;
                  else if (axis == "z") index = 2;
                  context.waitDelay(callback, sensor.state[index]);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  var sensor1 = context.findSensor("gyroscope", "i2c");
                  sensor1.getLiveState(function(returnVal) {
                      sensor1.state = returnVal;
                      sensorHandler.drawSensor(sensor1);
                      if (axis == "x") returnVal = returnVal[0];
                      else if (axis == "y") returnVal = returnVal[1];
                      else if (axis == "z") returnVal = returnVal[2];
                      cb(returnVal);
                  });
              }
          },
          setGyroZeroAngle: function setGyroZeroAngle(callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("gyroscope");
                  sensor.rotationAngles = [
                      0,
                      0,
                      0
                  ];
                  sensor.lastSpeedChange = new Date();
                  context.runner.noDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("setGyroZeroAngle()", function(returnVal) {
                      cb();
                  }, true);
              }
          },
          computeRotationGyro: function computeRotationGyro(axis, callback) {
              if (!context.display || context.autoGrading || context.offLineMode) {
                  var sensor = sensorHandler.findSensorByType("gyroscope");
                  var ret = 0;
                  if (sensor.rotationAngles != undefined) {
                      for(var i = 0; i < 3; i++)sensor.rotationAngles[i] += sensor.state[i] * ((+new Date() - sensor.lastSpeedChange) / 1000);
                      sensor.lastSpeedChange = new Date();
                      if (axis == "x") ret = sensor.rotationAngles[0];
                      else if (axis == "y") ret = sensor.rotationAngles[1];
                      else if (axis == "z") ret = sensor.rotationAngles[2];
                  }
                  context.runner.noDelay(callback, ret);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.findSensor("gyroscope", "i2c");
                  context.quickPiConnection.sendCommand("computeRotationGyro()", function(returnVal) {
                      //sensor.state = returnVal;
                      //sensorHandler.drawSensor(sensor);
                      returnVal = JSON.parse(returnVal);
                      if (axis == "x") returnVal = returnVal[0];
                      else if (axis == "y") returnVal = returnVal[1];
                      else if (axis == "z") returnVal = returnVal[2];
                      cb(returnVal);
                  }, true);
              }
          },
          connectToCloudStore: function connectToCloudStore(prefix, password, callback) {
              var sensor = sensorHandler.findSensorByType("cloudstore");
              if (!context.display || context.autoGrading) {
                  sensor.quickStore = new LocalQuickStore();
              } else {
                  sensor.quickStore = new QuickStore(prefix, password);
              }
              context.runner.noDelay(callback, 0);
          },
          writeToCloudStore: function writeToCloudStore(identifier, key, value, callback) {
              var sensor = sensorHandler.findSensorByType("cloudstore");
              if (!sensor.quickStore || !sensor.quickStore.connected) {
                  context.success = false;
                  throw "Cloud store not connected";
              }
              if (!context.display || context.autoGrading) {
                  sensor.quickStore.write(identifier, key, value);
                  context.registerQuickPiEvent(sensor.name, sensor.quickStore.getStateData());
                  context.runner.noDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.quickStore.write(identifier, key, value, function(data) {
                      if (!data || !data.success) {
                          if (data && data.message) context.failImmediately = "cloudstore: " + data.message;
                          else context.failImmediately = "Error trying to communicate with cloud store";
                      }
                      cb();
                  });
              }
          },
          readFromCloudStore: function readFromCloudStore(identifier, key, callback) {
              var sensor = sensorHandler.findSensorByType("cloudstore");
              if (!sensor.quickStore) {
                  if (!context.display || context.autoGrading) {
                      sensor.quickStore = new LocalQuickStore();
                  } else {
                      sensor.quickStore = new QuickStore();
                  }
              }
              if (!context.display || context.autoGrading) {
                  var state = context.getSensorState(sensor.name);
                  var value = "";
                  if (state.hasOwnProperty(key)) {
                      value = state[key];
                  } else {
                      context.success = false;
                      throw "Key not found";
                  }
                  sensor.quickStore.write(identifier, key, value);
                  context.registerQuickPiEvent(sensor.name, sensor.quickStore.getStateData());
                  context.runner.noDelay(callback, value);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  sensor.quickStore.read(identifier, key, function(data) {
                      var value = "";
                      if (data && data.success) {
                          try {
                              value = JSON.parse(data.value);
                          } catch (err) {
                              value = data.value;
                          }
                      } else {
                          if (data && data.message) context.failImmediately = "cloudstore: " + data.message;
                          else context.failImmediately = "Error trying to communicate with cloud store";
                      }
                      cb(value);
                  });
              }
          },
          readIRMessage: function readIRMessage(name, timeout, callback) {
              var sensor = sensorHandler.findSensorByName(name, true);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.getSensorState(name);
                  var cb = context.runner.waitCallback(callback);
                  sensor.waitingForIrMessage = function(command) {
                      clearTimeout(sensor.waitingForIrMessageTimeout);
                      sensor.waitingForIrMessage = null;
                      cb(command);
                  };
                  sensor.waitingForIrMessageTimeout = setTimeout(function() {
                      if (sensor.waitingForIrMessage) {
                          sensor.waitingForIrMessage = null;
                          cb("none");
                      }
                  }, timeout);
              } else {
                  var cb1 = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("readIRMessage(\"irrec1\", " + timeout + ")", function(returnVal) {
                      if (typeof returnVal === 'string') returnVal = returnVal.replace(/['"]+/g, '');
                      cb1(returnVal);
                  }, true);
              }
          },
          sendIRMessage: function sendIRMessage(name, preset, callback) {
              sensorHandler.findSensorByName(name, true);
              //context.registerQuickPiEvent(name, state ? true : false);
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("sendIRMessage(\"irtran1\", \"" + preset + "\")", function(returnVal) {
                      cb();
                  }, true);
              }
          },
          presetIRMessage: function presetIRMessage(preset, data, callback) {
              //let sensor = sensorHandler.findSensorByName(name, true);
              //context.registerQuickPiEvent(name, state ? true : false);
              if (!context.remoteIRcodes) context.remoteIRcodes = {};
              context.remoteIRcodes[preset] = data;
              if (!context.display || context.autoGrading || context.offLineMode) {
                  context.waitDelay(callback);
              } else {
                  var cb = context.runner.waitCallback(callback);
                  context.quickPiConnection.sendCommand("presetIRMessage(\"" + preset + "\", \"" + JSON.stringify(JSON.parse(data)) + "\")", function(returnVal) {
                      cb();
                  }, true);
              }
          }
      };
      blockImplementations.isButtonPressedWithName = blockImplementations.isButtonPressed;
      blockImplementations.isLedOnWithName = blockImplementations.isLedOn;
      blockImplementations.displayText2Lines = blockImplementations.displayText;
      blockImplementations.isBuzzerOnWithName = blockImplementations.isBuzzerOn;
      return {
          blockDefinitions: blockDefinitions,
          blockImplementations: blockImplementations
      };
  }

  function thingzAccelerometerModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          classDefinitions: {
              sensors: {
                  Accel: {
                      blocks: [
                          {
                              name: "get_x",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          },
                          {
                              name: "get_y",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          },
                          {
                              name: "get_z",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Accel: {
                  get_x: function get_x(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readAcceleration('x', callback);
                  },
                  get_y: function get_y(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readAcceleration('y', callback);
                  },
                  get_z: function get_z(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readAcceleration('z', callback);
                  }
              }
          },
          classInstances: {
              accelerometer: 'Accel'
          }
      };
  }

  function thingzButtonsModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          classDefinitions: {
              sensors: {
                  Button: {
                      blocks: [
                          {
                              name: "is_pressed",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Boolean"
                              }
                          }
                      ]
                  },
                  ButtonTouch: {
                      blocks: [
                          {
                              name: "is_touched",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Boolean"
                              }
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Button: {
                  is_pressed: function is_pressed(self, callback) {
                      quickPiModuleDefinition.blockImplementations.isButtonPressedWithName(self.__variableName, callback);
                  }
              },
              ButtonTouch: {
                  is_touched: function is_touched(self, callback) {
                      quickPiModuleDefinition.blockImplementations.isButtonPressedWithName(self.__variableName, callback);
                  }
              }
          },
          classInstances: {
              button_a: 'Button',
              button_b: 'Button',
              touch_n: 'ButtonTouch',
              touch_s: 'ButtonTouch',
              touch_e: 'ButtonTouch',
              touch_w: 'ButtonTouch'
          }
      };
  }

  function thingzTemperatureModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          blockDefinitions: {
              sensors: [
                  {
                      name: 'temperature',
                      yieldsValue: 'int'
                  }
              ]
          },
          blockImplementations: {
              temperature: function temperature(callback) {
                  var sensor = context.sensorHandler.findSensorByType('temperature');
                  quickPiModuleDefinition.blockImplementations.readTemperature(sensor.name, callback);
              }
          }
      };
  }

  function thingzLedModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          classDefinitions: {
              sensors: {
                  Led: {
                      blocks: [
                          {
                              name: 'read_light_level',
                              yieldsValue: 'int'
                          }
                      ]
                  }
              },
              actuator: {
                  Led: {
                      blocks: [
                          {
                              name: "set_colors",
                              params: [
                                  "Number",
                                  "Number",
                                  "Number"
                              ]
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Led: {
                  set_colors: function set_colors(self, red, green, blue, callback) {
                      var sensor = context.sensorHandler.findSensorByType('ledrgb');
                      var newState = [
                          red,
                          green,
                          blue
                      ];
                      context.registerQuickPiEvent(sensor.name, newState);
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          sensor.setLiveState(newState, cb);
                      }
                  },
                  read_light_level: function read_light_level(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('light');
                      quickPiModuleDefinition.blockImplementations.readLightIntensity(sensor.name, callback);
                  }
              }
          },
          classInstances: {
              led: 'Led'
          }
      };
  }

  function _ts_generator$8(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function machinePinModuleDefinition(context, strings) {
      return {
          classDefinitions: {
              actuator: {
                  Pin: {
                      defaultInstanceName: 'pin',
                      init: {
                          variants: [
                              [
                                  "Number"
                              ],
                              [
                                  "Number",
                                  "Number"
                              ]
                          ]
                      },
                      blocks: [
                          {
                              name: "on"
                          },
                          {
                              name: "off"
                          }
                      ],
                      constants: [
                          {
                              name: "IN",
                              value: 1
                          },
                          {
                              name: "OUT",
                              value: 3
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Pin: {
                  __constructor: function __constructor() {
                      var args, self, pinNumber, mode;
                      var _arguments = arguments;
                      return _ts_generator$8(this, function(_state) {
                          args = [].concat(_arguments);
                          args.pop();
                          self = args[0], pinNumber = args[1], mode = args[2];
                          self.pinNumber = pinNumber;
                          self.mode = mode != null ? mode : 3; // Pin.OUT
                          return [
                              2
                          ];
                      });
                  },
                  on: function on(self, callback) {
                      var sensor = context.sensorHandler.findSensorByPort("D" + self.pinNumber);
                      if (!sensor) {
                          throw "There is no sensor connected to the digital port D" + self.pinNumber;
                      }
                      var sensorDef = context.sensorHandler.findSensorDefinition(sensor);
                      if (!sensorDef.disablePinControl) {
                          context.registerQuickPiEvent(sensor.name, true);
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var command = "turnPortOn(\"" + sensor.name + "\")";
                          var cb = context.runner.waitCallback(callback);
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  },
                  off: function off(self, callback) {
                      var sensor = context.sensorHandler.findSensorByPort("D" + self.pinNumber);
                      if (!sensor) {
                          throw "There is no sensor connected to the digital port D" + self.pinNumber;
                      }
                      var command = "turnPortOff(\"" + sensor.name + "\")";
                      var sensorDef = context.sensorHandler.findSensorDefinition(sensor);
                      if (!sensorDef.disablePinControl) {
                          context.registerQuickPiEvent(sensor.name, false);
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  }
              }
          }
      };
  }

  function _ts_generator$7(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function machinePwmModuleDefinition(context, strings) {
      return {
          classDefinitions: {
              actuator: {
                  PWM: {
                      defaultInstanceName: 'pwm',
                      init: {
                          params: [
                              null,
                              "Number",
                              "Number"
                          ]
                      },
                      blocks: [
                          {
                              name: "duty",
                              params: [
                                  "Number"
                              ]
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              PWM: {
                  __constructor: function __constructor(self, pin, freq, duty) {
                      return _ts_generator$7(this, function(_state) {
                          self.pin = pin;
                          self.freq = freq;
                          self.currentDuty = duty;
                          return [
                              2
                          ];
                      });
                  },
                  duty: function duty(self, duty, callback) {
                      var sensor = context.sensorHandler.findSensorByPort("D" + self.pin.pinNumber);
                      if (!sensor) {
                          throw "There is no sensor connected to the digital port D" + self.pin.pinNumber;
                      }
                      var sensorDef = context.sensorHandler.findSensorDefinition(sensor);
                      if (!sensorDef.getStateFromPwm) {
                          throw "This sensor may not be controlled by a PWM";
                      }
                      var newState = sensorDef.getStateFromPwm(duty);
                      var command = "pwmDuty(" + self.pin.pinNumber + ", " + duty + ")";
                      self.currentDuty = duty;
                      context.registerQuickPiEvent(sensor.name, newState);
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  }
              }
          }
      };
  }

  function timeSleepModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          blockDefinitions: {
              actuator: [
                  {
                      name: "sleep",
                      params: [
                          "Number"
                      ],
                      blocklyJson: {
                          "args0": [
                              {
                                  "type": "input_value",
                                  "name": "PARAM_0",
                                  "value": 0
                              }
                          ]
                      },
                      blocklyXml: "<block type='sleep'>" + "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1</field></shadow></value>" + "</block>"
                  },
                  {
                      name: "sleep_ms",
                      params: [
                          "Number"
                      ],
                      blocklyJson: {
                          "args0": [
                              {
                                  "type": "input_value",
                                  "name": "PARAM_0",
                                  "value": 0
                              }
                          ]
                      },
                      blocklyXml: "<block type='sleep'>" + "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1</field></shadow></value>" + "</block>"
                  },
                  {
                      name: "sleep_us",
                      params: [
                          "Number"
                      ],
                      blocklyJson: {
                          "args0": [
                              {
                                  "type": "input_value",
                                  "name": "PARAM_0",
                                  "value": 0
                              }
                          ]
                      },
                      blocklyXml: "<block type='sleep'>" + "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1</field></shadow></value>" + "</block>"
                  }
              ]
          },
          blockImplementations: {
              sleep: function sleep(time, callback) {
                  quickPiModuleDefinition.blockImplementations.sleep(time * 1000, callback);
              },
              sleep_ms: function sleep_ms(time, callback) {
                  quickPiModuleDefinition.blockImplementations.sleep(time, callback);
              },
              sleep_us: function sleep_us(time, callback) {
                  quickPiModuleDefinition.blockImplementations.sleep(time / 1000, callback);
              }
          }
      };
  }

  var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Generator: Adobe Illustrator 21.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e%3csvg version='1.1' id='galaxia' inkscape:version='1.3.2 (091e20e%2c 2023-11-25%2c custom)' sodipodi:docname='galaxia.svg' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 162.1 255.3' style='enable-background:new 0 0 162.1 255.3%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:none%3bstroke:%238A8989%3b%7d .st1%7bfill:%23B8E986%3b%7d .st2%7bfill:url(%23SVGID_1_)%3b%7d .st3%7bfill:url(%23Path-10_1_)%3b%7d .st4%7bfill:%232E5E95%3b%7d .st5%7bfill:url(%23rect3_2_)%3b%7d .st6%7bfill:url(%23rect2_1_)%3b%7d .st7%7bfill:url(%23rect2-2_1_)%3b%7d .st8%7bfill:%234A4A4A%3b%7d .st9%7bfill:%23333333%3b%7d .st10%7bfill:%230B356F%3b%7d .st11%7bfill:%23101010%3bstroke:white%3bstroke-width:1.603%3b%7d .st12%7bfill:%23111111%3b%7d .st13%7bfill:url(%23screen-reflect_1_)%3b%7d .st14%7bfill:%23101010%3b%7d .st15%7bfill:url(%23rect1-3-6_2_)%3b%7d .st16%7bfill:%236AA2F0%3b%7d .st17%7bfill:url(%23front_1_)%3b%7d .st18%7bfill:url(%23button-sys-top_1_)%3b%7d .st19%7bfill:url(%23rect1-3-6-8_2_)%3b%7d .st20%7bfill:%230B356F%3bfill-opacity:0%3bstroke:white%3bstroke-width:0.5%3bstroke-linejoin:round%3b%7d .st21%7bfill:url(%23path11_1_)%3b%7d .st22%7bfill:url(%23path11-9_1_)%3b%7d .st23%7bfill:url(%23path11-7_1_)%3b%7d .st24%7bfill:url(%23path11-5_1_)%3b%7d .st25%7bfill:url(%23path11-78_1_)%3b%7d .st26%7bfill:url(%23rect12_1_)%3b%7d .st27%7bfill:url(%23rect12-9_1_)%3b%7d .st28%7bfill:url(%23rect12-0_1_)%3b%7d .st29%7bfill:url(%23rect12-5_1_)%3b%7d .st30%7bfill:url(%23rect12-91_1_)%3b%7d .st31%7bfill:url(%23rect12-2_1_)%3b%7d .st32%7bfill:url(%23rect12-00_1_)%3b%7d .st33%7bfill:url(%23rect12-59_1_)%3b%7d .st34%7bfill:url(%23rect12-50_1_)%3b%7d .st35%7bfill:url(%23rect12-8_1_)%3b%7d .st36%7bfill:url(%23rect12-01_1_)%3b%7d .st37%7bfill:url(%23rect12-502_1_)%3b%7d .st38%7bfill:url(%23rect12-57_1_)%3b%7d .st39%7bfill:url(%23rect12-3_1_)%3b%7d .st40%7bfill:url(%23rect12-4_1_)%3b%7d .st41%7bfill:url(%23rect12-31_1_)%3b%7d .st42%7bfill:url(%23rect12-5023_1_)%3b%7d .st43%7bfill:url(%23rect12-010_1_)%3b%7d .st44%7bfill:url(%23rect12-82_1_)%3b%7d .st45%7bfill:url(%23rect12-915_1_)%3b%7d .st46%7bfill:white%3b%7d .st47%7bfont-family:'Arial'%3b%7d .st48%7bfont-size:15.8224px%3b%7d .st49%7bfont-size:5.356px%3b%7d .st50%7bfill:none%3bstroke:white%3bstroke-width:0.5%3bstroke-miterlimit:10%3b%7d .st51%7bfill:none%3bstroke:white%3bstroke-width:0.2%3bstroke-miterlimit:10%3b%7d%3c/style%3e%3cg id='led-component'%3e %3cpath id='led-wire-4' inkscape:original-d='m 138.99653%2c85.032809 c 0%2c1.413629 0%2c2.827256 0%2c4.240885' inkscape:path-effect='%23path-effect8' class='st0' d=' M85%2c21.5c0%2c1.5%2c0%2c3%2c0%2c4.4'/%3e %3cpath id='led-wire-3' inkscape:original-d='m 138.99653%2c85.032809 c 0%2c1.413629 0%2c2.827256 0%2c4.240885' inkscape:path-effect='%23path-effect8-2' class='st0' d=' M92%2c21.5c0%2c1.5%2c0%2c3%2c0%2c4.4'/%3e %3cpath id='led-wire-2' inkscape:original-d='m 138.99653%2c85.032809 c 0%2c1.413629 0%2c2.827256 0%2c4.240885' inkscape:path-effect='%23path-effect8-5' class='st0' d=' M88.5%2c21.5c0%2c1.5%2c0%2c3%2c0%2c4.4'/%3e %3cpath id='led-wire-1' inkscape:original-d='m 138.99653%2c85.032809 c 0%2c1.413629 0%2c2.827256 0%2c4.240885' inkscape:path-effect='%23path-effect8-1' class='st0' d=' M95.4%2c21.5c0%2c1.5%2c0%2c3%2c0%2c4.4'/%3e %3cpath id='led' inkscape:label='led' sodipodi:nodetypes='cccccc' class='st1' d='M90%2c0c-3.8%2c0.1-6.7%2c3.4-6.7%2c7.2 c0%2c4.1-0.1%2c8.7-0.1%2c13c0%2c0.9%2c0.8%2c1.7%2c1.7%2c1.7h10.7c0.9%2c0%2c1.7-0.8%2c1.7-1.7L97.1%2c6.9C97.1%2c3%2c93.9-0.1%2c90%2c0z'/%3e %3cg id='led-reflect'%3e %3clinearGradient id='SVGID_1_' gradientUnits='userSpaceOnUse' x1='90.3304' y1='2.7957' x2='95.3505' y2='7.6366'%3e %3cstop offset='0' style='stop-color:white'/%3e %3cstop offset='0.9991' style='stop-color:white%3bstop-opacity:0'/%3e %3c/linearGradient%3e %3cpath class='st2' d='M94.4%2c8.5c-0.6%2c0-1-0.4-1-1c0-1.6-1.3-2.9-2.9-2.9c-0.6%2c0-1-0.4-1-1s0.4-1%2c1-1c2.7%2c0%2c4.9%2c2.2%2c4.9%2c4.9 C95.4%2c8.1%2c94.9%2c8.5%2c94.4%2c8.5z'/%3e %3c/g%3e %3cg id='led-filament'%3e %3cg id='E.03.f---Concours---QuickPI-_x28_connection-error_x29_' transform='translate(-315%2c -448)'%3e %3cg id='Group-11' transform='translate(302%2c 419)'%3e %3clinearGradient id='Path-10_1_' gradientUnits='userSpaceOnUse' x1='-569.5046' y1='659.9916' x2='-569.5046' y2='659.3275' gradientTransform='matrix(17 0 0 -11.6073 9784.9883 7700.646)'%3e %3cstop offset='0' style='stop-color:%232E5E95%3bstop-opacity:0.4'/%3e %3cstop offset='1' style='stop-color:%232E5E95%3bstop-opacity:0'/%3e %3c/linearGradient%3e %3cpath id='Path-10' class='st3' d='M97.8%2c46.7v-1.2c0-0.5%2c0.2-0.9%2c0.5-1.2c0.3-0.3%2c0.5-0.8%2c0.5-1.2v-2.5c0-0.4%2c0.3-0.7%2c0.7-0.7 h0.2c0.2%2c0%2c0.4%2c0.2%2c0.4%2c0.4c0%2c0.2%2c0.2%2c0.4%2c0.4%2c0.4h5.5c0.2%2c0%2c0.4-0.2%2c0.4-0.4c0-0.2%2c0.2-0.4%2c0.4-0.4h0.4c0.5%2c0%2c0.8%2c0.4%2c0.8%2c0.8 v2.3c0%2c0.5%2c0.2%2c0.9%2c0.5%2c1.2s0.5%2c0.8%2c0.5%2c1.2v1.2c0%2c0.5-0.4%2c0.9-0.9%2c0.9h0c-0.5%2c0-0.9-0.4-0.9-0.9c0-0.6-0.2-1.1-0.6-1.5 l-0.3-0.3c-0.6-0.6-0.7-1.4-0.4-2.1l0.3-0.7c0.1-0.2%2c0-0.4-0.2-0.4c0%2c0-0.1%2c0-0.1%2c0c-0.3%2c0-0.6%2c0.1-0.9%2c0.2l-2.6%2c1.5 c-0.7%2c0.4-1.4%2c0.9-1.9%2c1.5l-0.3%2c0.3c-0.4%2c0.4-0.6%2c0.9-0.6%2c1.5c0%2c0.5-0.4%2c0.9-0.9%2c0.9h0C98.2%2c47.6%2c97.8%2c47.2%2c97.8%2c46.7z'/%3e %3c/g%3e %3c/g%3e %3c/g%3e%3c/g%3e%3cg id='board'%3e %3cpath id='rect3_1_' class='st4' d='M24.5%2c20.8c-2.9%2c0-5.3%2c2.3-5.3%2c5.2v224c0%2c2.9%2c2.3%2c5.2%2c5.3%2c5.2h132.4c2.9%2c0%2c5.2-2.3%2c5.2-5.2v-224 c0-2.9-2.3-5.2-5.2-5.2h-55.6c-0.7%2c4.2-1.5%2c8.4-2.2%2c12.6H81.3L80%2c20.8H24.5z'/%3e %3clinearGradient id='rect3_2_' gradientUnits='userSpaceOnUse' x1='25.97' y1='17.2623' x2='154.47' y2='240.2623'%3e %3cstop offset='0' style='stop-color:%236BAAF4'/%3e %3cstop offset='1' style='stop-color:%234A90E2'/%3e %3c/linearGradient%3e %3cpath id='rect3' class='st5' d='M24.5%2c12.4c-2.9%2c0-5.3%2c2.4-5.3%2c5.3v224c0%2c2.9%2c2.4%2c5.2%2c5.2%2c5.2h132.4c2.9%2c0%2c5.2-2.4%2c5.2-5.2v-224 c0-2.9-2.3-5.2-5.2-5.2h-52.1c-2%2c0-3.7%2c1.4-4.1%2c3.4c-0.4%2c2.1-0.7%2c4.2-1.1%2c6.3c-0.3%2c1.6-1.7%2c2.9-3.4%2c2.9H84.4 c-1.8%2c0-3.2-1.3-3.4-3.1l-0.6-5.8c-0.2-2.1-2-3.7-4.1-3.7H24.5z'/%3e%3c/g%3e%3cg id='cable'%3e %3clinearGradient id='rect2_1_' gradientUnits='userSpaceOnUse' x1='-297.9723' y1='421.476' x2='-294.3843' y2='421.476' gradientTransform='matrix(2.8346 0 0 -2.8346 844.646 1236.2024)'%3e %3cstop offset='0' style='stop-color:black%3bstop-opacity:0'/%3e %3cstop offset='0.5' style='stop-color:black'/%3e %3cstop offset='1' style='stop-color:black'/%3e %3c/linearGradient%3e %3crect id='rect2' y='39.1' class='st6' width='10.2' height='4.7'/%3e %3clinearGradient id='rect2-2_1_' gradientUnits='userSpaceOnUse' x1='17.6471' y1='44.5313' x2='17.6471' y2='37.7196'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect2-2' x='16' y='37.2' class='st7' width='3.2' height='8.5'/%3e %3crect id='rect2-2_2_' x='16' y='44.7' class='st8' width='3.2' height='1'/%3e %3cpath id='rect2-2-4' sodipodi:nodetypes='sccsssss' d='M12.3%2c36.2l5.8%2c0c0%2c2.7%2c0%2c10.5%2c0%2c10.5h-5.8c-1.4%2c0-2.5-1.1-2.5-2.4v-5.8 C9.8%2c37.3%2c10.9%2c36.3%2c12.3%2c36.2L12.3%2c36.2z'/%3e %3cpath id='rect2-2-4_1_' sodipodi:nodetypes='sccsssss' class='st9' d='M12.3%2c36.2l5.8%2c0c0%2c2.2%2c0%2c8.7%2c0%2c8.7h-5.8 c-1.4%2c0-2.5-0.9-2.5-2v-4.8C9.8%2c37.1%2c10.9%2c36.2%2c12.3%2c36.2L12.3%2c36.2z'/%3e%3c/g%3e%3cg id='Screen'%3e %3cpath id='rect1_1_' class='st10' d='M36.3%2c43.4h109.5c3.4%2c0%2c6.2%2c2.8%2c6.2%2c6.2v78c0%2c3.4-2.8%2c6.2-6.2%2c6.2H36.3c-3.4%2c0-6.2-2.8-6.2-6.2 v-78C30.1%2c46.2%2c32.9%2c43.4%2c36.3%2c43.4z'/%3e %3cpath id='rect1' class='st11' d='M36.3%2c40.4h109.5c3.4%2c0%2c6.2%2c2.8%2c6.2%2c6.2v78c0%2c3.4-2.8%2c6.2-6.2%2c6.2H36.3c-3.4%2c0-6.2-2.8-6.2-6.2 v-78C30.1%2c43.2%2c32.9%2c40.4%2c36.3%2c40.4z'/%3e %3cpath id='screen-inner' class='st12' d='M142.1%2c124.3H40.9c-1.6%2c0-2.9-1.3-2.9-2.9V49.7c0-1.6%2c1.3-2.9%2c2.9-2.9h101.2 c1.6%2c0%2c2.9%2c1.3%2c2.9%2c2.9v71.6C145%2c123%2c143.7%2c124.3%2c142.1%2c124.3z'/%3e %3clinearGradient id='screen-reflect_1_' gradientUnits='userSpaceOnUse' x1='134.4387' y1='126.9072' x2='40.0091' y2='36.3318'%3e %3cstop offset='0' style='stop-color:%2367696B'/%3e %3cstop offset='0.9997' style='stop-color:%23B1B3B4%3bstop-opacity:0'/%3e %3c/linearGradient%3e %3cpath id='screen-reflect' inkscape:label='screen-inner' class='st13' d='M40.8%2c46.8h101.1c1.7%2c0%2c3.2%2c1.4%2c3.2%2c3.2L40.8%2c124.3 c-1.7%2c0-3.2-1.4-3.2-3.2V50C37.6%2c48.3%2c39%2c46.8%2c40.8%2c46.8z'/%3e %3crect id='rect5' x='26.6' y='46.8' class='st14' width='7.8' height='76.3'/%3e %3crect id='rect5-8' x='24' y='60.4' class='st8' width='10.8' height='52.3'/%3e %3crect id='rect5-8_1_' x='31.7' y='60.4' class='st9' width='3.1' height='52.3'/%3e%3c/g%3e%3cg id='button-a'%3e %3cpath id='rect1-3-6_1_' class='st8' d='M121.7%2c142.2h28c1%2c0%2c1.9%2c0.8%2c1.9%2c1.9V171c0%2c1-0.8%2c1.9-1.9%2c1.9h-28c-1%2c0-1.9-0.8-1.9-1.9 v-26.9C119.8%2c143.1%2c120.7%2c142.2%2c121.7%2c142.2z'/%3e %3clinearGradient id='rect1-3-6_2_' gradientUnits='userSpaceOnUse' x1='135.6954' y1='141.1228' x2='135.6954' y2='171.3371'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='rect1-3-6' class='st15' d='M121.7%2c140.5h28c1%2c0%2c1.9%2c0.8%2c1.9%2c1.9v26.9c0%2c1-0.8%2c1.9-1.9%2c1.9h-28c-1%2c0-1.9-0.8-1.9-1.9 v-26.9C119.8%2c141.3%2c120.7%2c140.5%2c121.7%2c140.5z'/%3e %3cellipse id='path2' class='st8' cx='123.8' cy='144.1' rx='2.1' ry='2'/%3e %3cellipse id='path2-3' class='st8' cx='147.5' cy='144.1' rx='2.1' ry='2'/%3e %3cellipse id='path2-3-1' class='st8' cx='147.5' cy='167.6' rx='2.1' ry='2'/%3e %3cellipse id='path2-3-1-2' class='st8' cx='123.8' cy='167.6' rx='2.1' ry='2'/%3e %3ccircle id='button-a-bot' inkscape:label='button-a-bot' class='st10' cx='135.7' cy='155.8' r='10.9'%3e %3c/circle%3e %3ccircle id='button-a-top' inkscape:label='button-a-top' class='st16' cx='135.7' cy='153.2' r='10.9'%3e %3c/circle%3e%3c/g%3e%3cg id='button-sys'%3e %3cpath id='shadow' class='st8' d='M137.5%2c17.8h16.3c0.6%2c0%2c1.1%2c0.5%2c1.1%2c1.1v15.7c0%2c0.6-0.5%2c1.1-1.1%2c1.1h-16.3c-0.6%2c0-1.1-0.5-1.1-1.1 V18.9C136.4%2c18.3%2c136.9%2c17.8%2c137.5%2c17.8z'/%3e %3clinearGradient id='front_1_' gradientUnits='userSpaceOnUse' x1='145.6426' y1='16.181' x2='145.6426' y2='33.4903'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='front' class='st17' d='M137.5%2c16.4h16.3c0.6%2c0%2c1.1%2c0.5%2c1.1%2c1.1v15.7c0%2c0.6-0.5%2c1.1-1.1%2c1.1h-16.3c-0.6%2c0-1.1-0.5-1.1-1.1 V17.5C136.4%2c16.9%2c136.9%2c16.4%2c137.5%2c16.4z'/%3e %3cellipse id='path2-5' class='st8' cx='138.7' cy='18.4' rx='1.2' ry='1.2'/%3e %3cellipse id='path2-3-9' class='st8' cx='152.6' cy='18.4' rx='1.2' ry='1.2'/%3e %3cellipse id='path2-3-1-6' class='st8' cx='152.6' cy='32.2' rx='1.2' ry='1.2'/%3e %3cellipse id='path2-3-1-2-6' class='st8' cx='138.7' cy='32.2' rx='1.2' ry='1.2'/%3e %3ccircle id='button-sys-bot' inkscape:label='button-sys-bot' class='st10' cx='145.6' cy='25.3' r='6.4'%3e %3c/circle%3e %3clinearGradient id='button-sys-top_1_' gradientUnits='userSpaceOnUse' x1='140.2529' y1='23.3427' x2='151.8014' y2='23.3427'%3e %3cstop offset='0' style='stop-color:%236BAAF4'/%3e %3cstop offset='1' style='stop-color:%234A90E2'/%3e %3c/linearGradient%3e %3ccircle id='button-sys-top' inkscape:label='button-sys-top' class='st18' cx='145.6' cy='23.3' r='6.4'%3e %3c/circle%3e%3c/g%3e%3cg id='button-b'%3e %3cpath id='rect1-3-6-8_1_' class='st8' d='M121.7%2c185.3h28c1%2c0%2c1.9%2c0.8%2c1.9%2c1.9v26.9c0%2c1-0.8%2c1.9-1.9%2c1.9h-28c-1%2c0-1.9-0.8-1.9-1.9 v-26.9C119.8%2c186.1%2c120.7%2c185.3%2c121.7%2c185.3z'/%3e %3clinearGradient id='rect1-3-6-8_2_' gradientUnits='userSpaceOnUse' x1='135.6954' y1='184.2388' x2='135.6954' y2='214.7807'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='rect1-3-6-8' class='st19' d='M121.7%2c183.6h28c1%2c0%2c1.9%2c0.8%2c1.9%2c1.9v26.9c0%2c1-0.8%2c1.9-1.9%2c1.9h-28c-1%2c0-1.9-0.8-1.9-1.9 v-26.9C119.8%2c184.4%2c120.7%2c183.6%2c121.7%2c183.6z'/%3e %3cellipse id='path2-8' class='st8' cx='123.8' cy='187.1' rx='2.1' ry='2'/%3e %3cellipse id='path2-3-12' class='st8' cx='147.5' cy='187.1' rx='2.1' ry='2'/%3e %3cellipse id='path2-3-1-1' class='st8' cx='147.5' cy='210.7' rx='2.1' ry='2'/%3e %3cellipse id='path2-3-1-2-4' class='st8' cx='123.8' cy='210.7' rx='2.1' ry='2'/%3e %3ccircle id='button-b-bot' inkscape:label='button-b-bot' class='st10' cx='135.7' cy='198.9' r='10.9'%3e %3c/circle%3e %3ccircle id='button-b-top' inkscape:label='button-b-top' class='st16' cx='135.7' cy='196.2' r='10.9'%3e %3c/circle%3e%3c/g%3e%3cpath id='pad-left' inkscape:label='pad-left' class='st20' d='M36.5%2c149.8c-6.9%2c7.1-10.8%2c16.6-10.8%2c26.5c0%2c9.8%2c3.8%2c19.2%2c10.6%2c26.3 l17.3-17.3c-2.2-2.5-3.4-5.7-3.4-9c0-3.4%2c1.3-6.7%2c3.6-9.2L36.5%2c149.8z'/%3e%3cpath id='pad-up' inkscape:label='pad-up' class='st20' d='M90.9%2c148.2c-7.1-6.9-16.6-10.8-26.5-10.8c-9.8%2c0-19.2%2c3.8-26.3%2c10.6 l17.3%2c17.3c2.5-2.2%2c5.7-3.4%2c9-3.4c3.4%2c0%2c6.7%2c1.3%2c9.2%2c3.6L90.9%2c148.2z'/%3e%3cpath id='pad-right' inkscape:label='pad-right' class='st20' d='M92.1%2c203c6.9-7.1%2c10.8-16.6%2c10.8-26.5c0-9.8-3.8-19.2-10.6-26.3 L75%2c167.4c2.2%2c2.5%2c3.4%2c5.7%2c3.4%2c9c0%2c3.4-1.3%2c6.7-3.6%2c9.2L92.1%2c203z'/%3e%3cpath id='pad-down' inkscape:label='pad-down' class='st20' d='M37.5%2c204.2c7.1%2c6.9%2c16.6%2c10.8%2c26.5%2c10.8c9.8%2c0%2c19.2-3.8%2c26.3-10.6 l-17.3-17.3c-2.5%2c2.2-5.7%2c3.4-9%2c3.4c-3.4%2c0-6.7-1.3-9.2-3.6L37.5%2c204.2z'/%3e%3cg id='connection'%3e %3crect id='rect14' x='20.3' y='245.3' class='st16' width='5.1' height='5.5'/%3e %3crect id='rect14-5' x='156.3' y='245.3' class='st16' width='5.1' height='5.5'/%3e %3crect id='rect14-0-7' x='66.6' y='245.3' class='st16' width='16.6' height='5.5'/%3e %3crect id='rect14-0-7-3' x='36.7' y='245.3' class='st16' width='16.6' height='5.5'/%3e %3crect id='rect14-0-7-6' x='98.2' y='245.3' class='st16' width='16.6' height='5.5'/%3e %3crect id='rect14-0-7-5' x='128.2' y='245.3' class='st16' width='16.6' height='5.5'/%3e %3clinearGradient id='path11_1_' gradientUnits='userSpaceOnUse' x1='30.939' y1='250.2664' x2='30.939' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='path11' class='st21' d='M30.9%2c223.9c-4.5%2c0-8.1%2c3.6-8.1%2c8.1c0%2c7%2c0%2c12.7%2c0%2c18.9h2.5l0.8-3h9.3l0.9%2c3H39l0-18.9 C39%2c227.5%2c35.4%2c223.9%2c30.9%2c223.9L30.9%2c223.9z'/%3e %3clinearGradient id='path11-9_1_' gradientUnits='userSpaceOnUse' x1='59.3629' y1='250.2664' x2='59.3629' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='path11-9' class='st22' d='M59.4%2c223.9c-4.5%2c0-8.1%2c3.6-8.1%2c8.1c0%2c7%2c0%2c12.7%2c0%2c18.9h2.5l0.8-3h9.3l0.9%2c3h2.6l0-18.9 C67.4%2c227.5%2c63.8%2c223.9%2c59.4%2c223.9L59.4%2c223.9z'/%3e %3clinearGradient id='path11-7_1_' gradientUnits='userSpaceOnUse' x1='90.7304' y1='250.2664' x2='90.7304' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='path11-7' class='st23' d='M90.7%2c223.9c-4.5%2c0-8.1%2c3.6-8.1%2c8.1c0%2c7%2c0%2c12.7%2c0%2c18.9h2.5l0.8-3h9.3l0.9%2c3h2.6l0-18.9 C98.8%2c227.5%2c95.2%2c223.9%2c90.7%2c223.9L90.7%2c223.9z'/%3e %3clinearGradient id='path11-5_1_' gradientUnits='userSpaceOnUse' x1='122.0979' y1='250.2664' x2='122.0979' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='path11-5' class='st24' d='M122.1%2c223.9c-4.5%2c0-8.1%2c3.6-8.1%2c8.1c0%2c7%2c0%2c12.7%2c0%2c18.9h2.5l0.8-3h9.3l0.9%2c3h2.6l0-18.9 C130.2%2c227.5%2c126.6%2c223.9%2c122.1%2c223.9L122.1%2c223.9z'/%3e %3clinearGradient id='path11-78_1_' gradientUnits='userSpaceOnUse' x1='150.5217' y1='250.2664' x2='150.5217' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3cpath id='path11-78' class='st25' d='M150.5%2c223.9c-4.5%2c0-8.1%2c3.6-8.1%2c8.1c0%2c7%2c0%2c12.7%2c0%2c18.9h2.5l0.8-3h9.3l0.9%2c3h2.6l0-18.9 C158.6%2c227.5%2c155%2c223.9%2c150.5%2c223.9L150.5%2c223.9z'/%3e %3clinearGradient id='rect12_1_' gradientUnits='userSpaceOnUse' x1='160.6279' y1='250.2664' x2='160.6279' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12' x='159.1' y='234.4' class='st26' width='3' height='16.5'/%3e %3clinearGradient id='rect12-9_1_' gradientUnits='userSpaceOnUse' x1='137.7817' y1='250.2664' x2='137.7817' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-9' x='136.6' y='234.4' class='st27' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-0_1_' gradientUnits='userSpaceOnUse' x1='134.838' y1='250.2664' x2='134.838' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-0' x='133.6' y='234.4' class='st28' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-5_1_' gradientUnits='userSpaceOnUse' x1='131.8944' y1='250.2664' x2='131.8944' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-5' x='130.7' y='234.4' class='st29' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-91_1_' gradientUnits='userSpaceOnUse' x1='140.7253' y1='250.2664' x2='140.7253' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-91' x='139.5' y='234.4' class='st30' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-2_1_' gradientUnits='userSpaceOnUse' x1='112.3015' y1='250.2664' x2='112.3015' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-2' x='111.1' y='234.4' class='st31' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-00_1_' gradientUnits='userSpaceOnUse' x1='109.3578' y1='250.2664' x2='109.3578' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-00' x='108.1' y='234.4' class='st32' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-59_1_' gradientUnits='userSpaceOnUse' x1='106.4142' y1='250.2664' x2='106.4142' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-59' x='105.2' y='234.4' class='st33' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-50_1_' gradientUnits='userSpaceOnUse' x1='103.4706' y1='250.2664' x2='103.4706' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-50' x='102.2' y='234.4' class='st34' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-8_1_' gradientUnits='userSpaceOnUse' x1='100.5269' y1='250.2664' x2='100.5269' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-8' x='99.3' y='234.4' class='st35' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-01_1_' gradientUnits='userSpaceOnUse' x1='80.9339' y1='250.2664' x2='80.9339' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-01' x='79.7' y='234.4' class='st36' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-502_1_' gradientUnits='userSpaceOnUse' x1='77.9903' y1='250.2664' x2='77.9903' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-502' x='76.8' y='234.4' class='st37' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-57_1_' gradientUnits='userSpaceOnUse' x1='75.0467' y1='250.2664' x2='75.0467' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-57' x='73.8' y='234.4' class='st38' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-3_1_' gradientUnits='userSpaceOnUse' x1='72.103' y1='250.2664' x2='72.103' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-3' x='70.9' y='234.4' class='st39' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-4_1_' gradientUnits='userSpaceOnUse' x1='69.1594' y1='250.2664' x2='69.1594' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-4' x='67.9' y='234.4' class='st40' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-31_1_' gradientUnits='userSpaceOnUse' x1='49.5665' y1='250.2664' x2='49.5665' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-31' x='48.3' y='234.4' class='st41' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-5023_1_' gradientUnits='userSpaceOnUse' x1='46.6229' y1='250.2664' x2='46.6229' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-5023' x='45.4' y='234.4' class='st42' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-010_1_' gradientUnits='userSpaceOnUse' x1='43.6792' y1='250.2664' x2='43.6792' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-010' x='42.4' y='234.4' class='st43' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-82_1_' gradientUnits='userSpaceOnUse' x1='40.7355' y1='250.2664' x2='40.7355' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-82' x='39.5' y='234.4' class='st44' width='2.5' height='16.5'/%3e %3clinearGradient id='rect12-915_1_' gradientUnits='userSpaceOnUse' x1='20.8083' y1='250.2664' x2='20.8083' y2='223.0977'%3e %3cstop offset='0' style='stop-color:%23FAFAFA'/%3e %3cstop offset='1' style='stop-color:%23B1B3B4'/%3e %3c/linearGradient%3e %3crect id='rect12-915' x='19.3' y='234.4' class='st45' width='3.1' height='16.5'/%3e %3ccircle id='path12' class='st8' cx='30.9' cy='232.3' r='6.6'/%3e %3ccircle id='path12-2' class='st8' cx='59.4' cy='232.3' r='6.6'/%3e %3ccircle id='path12-7' class='st8' cx='90.7' cy='232.3' r='6.6'/%3e %3ccircle id='path12-4' class='st8' cx='122.1' cy='232.3' r='6.6'/%3e %3ccircle id='path12-23' class='st8' cx='150.5' cy='232.3' r='6.6'/%3e %3cpath class='st14' d='M37.6%2c232.3c0%2c0.2%2c0%2c0.4%2c0%2c0.6c-0.3-3.4-3.1-6.1-6.6-6.1s-6.3%2c2.7-6.6%2c6.1c0-0.2%2c0-0.4%2c0-0.6 c0-3.7%2c3-6.7%2c6.6-6.7S37.6%2c228.6%2c37.6%2c232.3z'/%3e %3cpath class='st14' d='M66%2c232.3c0%2c0.2%2c0%2c0.4%2c0%2c0.6c-0.3-3.4-3.1-6.1-6.6-6.1c-3.5%2c0-6.3%2c2.7-6.6%2c6.1c0-0.2%2c0-0.4%2c0-0.6 c0-3.7%2c3-6.7%2c6.6-6.7C63%2c225.6%2c66%2c228.6%2c66%2c232.3z'/%3e %3cpath class='st14' d='M97.4%2c232.3c0%2c0.2%2c0%2c0.4%2c0%2c0.6c-0.3-3.4-3.1-6.1-6.6-6.1c-3.5%2c0-6.3%2c2.7-6.6%2c6.1c0-0.2%2c0-0.4%2c0-0.6 c0-3.7%2c3-6.7%2c6.6-6.7C94.4%2c225.6%2c97.4%2c228.6%2c97.4%2c232.3z'/%3e %3cpath class='st14' d='M128.7%2c232.3c0%2c0.2%2c0%2c0.4%2c0%2c0.6c-0.3-3.4-3.1-6.1-6.6-6.1c-3.5%2c0-6.3%2c2.7-6.6%2c6.1c0-0.2%2c0-0.4%2c0-0.6 c0-3.7%2c3-6.7%2c6.6-6.7C125.8%2c225.6%2c128.7%2c228.6%2c128.7%2c232.3z'/%3e %3cpath class='st14' d='M157.2%2c232.3c0%2c0.2%2c0%2c0.4%2c0%2c0.6c-0.3-3.4-3.1-6.1-6.6-6.1c-3.5%2c0-6.3%2c2.7-6.6%2c6.1c0-0.2%2c0-0.4%2c0-0.6 c0-3.7%2c3-6.7%2c6.6-6.7C154.2%2c225.6%2c157.2%2c228.6%2c157.2%2c232.3z'/%3e%3c/g%3e%3ctext transform='matrix(1 0 0 1 104.5744 148.2085)' class='st46 st47 st48'%3eA%3c/text%3e%3ctext transform='matrix(1 0 0 1 108.1418 28.5307)' class='st46 st47 st49'%3eSYST%c3%88ME%3c/text%3e%3ctext transform='matrix(1 0 0 1 104.3547 219.7241)' class='st46 st47 st48'%3eB%3c/text%3e%3cg id='Arrow-A'%3e %3cpath id='path135' class='st46' d='M115.4%2c157.9l-1.5%2c0.9V157L115.4%2c157.9z'/%3e %3cpath class='st50' d='M113.9%2c157.9c-2.8%2c0-5.1-2.2-5.1-5'/%3e%3c/g%3e%3cg id='Arrow-B'%3e %3cpath id='path135-3' class='st46' d='M115.4%2c196.8l-1.5%2c0.9v-1.8L115.4%2c196.8z'/%3e %3cpath class='st50' d='M108.9%2c201.9c0-2.8%2c2.2-5.1%2c5-5.1'/%3e%3c/g%3e%3cg id='Arrow-Sys'%3e %3cpath class='st51' d='M126.8%2c22.7c0.7-2.7%2c3.4-4.4%2c6.1-3.7'/%3e %3cg%3e %3cpolygon class='st46' points='132.4%2c19.4 134.6%2c19.4 132.7%2c18.3 '/%3e %3c/g%3e%3c/g%3e%3c/svg%3e";

  function _extends$4() {
      _extends$4 = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source){
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      };
      return _extends$4.apply(this, arguments);
  }
  function _ts_generator$6(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function networkWlanModuleDefinition(context, strings) {
      return {
          constants: [
              {
                  name: 'STA_IF',
                  value: 0
              },
              {
                  name: 'AP_IF',
                  value: 1
              }
          ],
          classDefinitions: {
              actuator: {
                  WLAN: {
                      defaultInstanceName: 'wlan',
                      init: {
                          params: [
                              "Number"
                          ]
                      },
                      blocks: [
                          {
                              name: "active",
                              params: [
                                  "Boolean"
                              ]
                          },
                          {
                              name: "scan"
                          },
                          {
                              name: "connect",
                              params: [
                                  "String",
                                  "String"
                              ]
                          },
                          {
                              name: "disconnect"
                          },
                          {
                              name: "isconnected",
                              yieldsValue: "bool"
                          },
                          {
                              name: "ifconfig",
                              yieldsValue: "String"
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              WLAN: {
                  __constructor: function __constructor(self, interfaceId) {
                      return _ts_generator$6(this, function(_state) {
                          self.interface = interfaceId;
                          return [
                              2
                          ];
                      });
                  },
                  active: function active(self, active, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var cb = context.runner.waitCallback(callback);
                          setTimeout(function() {
                              context.registerQuickPiEvent(sensor.name, _extends$4({}, sensor.state, {
                                  active: !!active
                              }));
                              cb();
                          }, 500);
                      } else {
                          var cb1 = context.runner.waitCallback(callback);
                          var command = 'wifiSetActive("' + sensor.name + '", ' + (active ? 1 : 0) + ")";
                          context.quickPiConnection.sendCommand(command, cb1);
                      }
                  },
                  scan: function scan(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var _sensor_state;
                          if (!((_sensor_state = sensor.state) == null ? void 0 : _sensor_state.active)) {
                              throw strings.messages.wifiNotActive;
                          }
                          context.registerQuickPiEvent(sensor.name, _extends$4({}, sensor.state, {
                              scanning: true
                          }));
                          var cb = context.runner.waitCallback(callback);
                          setTimeout(function() {
                              context.registerQuickPiEvent(sensor.name, _extends$4({}, sensor.state, {
                                  scanning: false
                              }));
                              cb();
                          }, 1000);
                      } else {
                          var cb1 = context.runner.waitCallback(callback);
                          var command = "wifiScan(\"" + sensor.name + "\")";
                          context.quickPiConnection.sendCommand(command, function(result) {
                              cb1(JSON.parse(result));
                          });
                      }
                  },
                  connect: function connect(self, ssid, password, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var _sensor_state;
                          if (!((_sensor_state = sensor.state) == null ? void 0 : _sensor_state.active)) {
                              throw strings.messages.wifiNotActive;
                          }
                          var cb = context.runner.waitCallback(callback);
                          setTimeout(function() {
                              context.registerQuickPiEvent(sensor.name, _extends$4({}, sensor.state, {
                                  connected: true,
                                  ssid: ssid,
                                  password: password
                              }));
                              cb();
                          }, 500);
                      } else {
                          var cb1 = context.runner.waitCallback(callback);
                          var command = "wifiConnect(\"" + sensor.name + "\", \"" + ssid + "\", \"" + password + "\")";
                          context.quickPiConnection.sendCommand(command, cb1);
                      }
                  },
                  disconnect: function disconnect(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var _sensor_state;
                          if (!((_sensor_state = sensor.state) == null ? void 0 : _sensor_state.active)) {
                              throw strings.messages.wifiNotActive;
                          }
                          var cb = context.runner.waitCallback(callback);
                          setTimeout(function() {
                              context.registerQuickPiEvent(sensor.name, _extends$4({}, sensor.state, {
                                  connected: false,
                                  ssid: null,
                                  password: null
                              }));
                              cb();
                          }, 500);
                      } else {
                          var cb1 = context.runner.waitCallback(callback);
                          var command = "wifiDisconnect(\"" + sensor.name + "\")";
                          context.quickPiConnection.sendCommand(command, cb1);
                      }
                  },
                  isconnected: function isconnected(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var state = context.getSensorState(sensor.name);
                          context.runner.noDelay(callback, !!state.connected);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          var command = "wifiIsConnected(\"" + sensor.name + "\")";
                          context.quickPiConnection.sendCommand(command, function(returnVal) {
                              cb(!!returnVal);
                          });
                      }
                  },
                  ifconfig: function ifconfig(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('wifi');
                      if (!sensor) {
                          throw "There is no Wi-Fi sensor.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var state = context.getSensorState(sensor.name);
                          if (!(state == null ? void 0 : state.active)) {
                              throw strings.messages.wifiNotActive;
                          }
                          var ips = [
                              '192.168.1.4',
                              '255.255.255.0',
                              '192.168.1.1',
                              '8.8.8.8'
                          ];
                          context.runner.noDelay(callback, ips);
                      } else {
                          var command = "wifiIfConfig(\"" + sensor.name + "\")";
                          var cb = context.runner.waitCallback(callback);
                          context.quickPiConnection.sendCommand(command, function(result) {
                              cb(JSON.parse(result));
                          });
                      }
                  }
              }
          }
      };
  }

  function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$4(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _extends$3() {
      _extends$3 = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source){
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      };
      return _extends$3.apply(this, arguments);
  }
  function _ts_generator$5(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function getRealValue(object) {
      if (!object) {
          return object;
      }
      if (object.toJSON) {
          return object.toJSON();
      }
      return object;
  }
  function formatString(str) {
      return str.replace(/"/g, '\\"');
  }
  function requestsModuleDefinition(context, strings) {
      function makeRequest(sensor, fetchParameters, callback) {
          return _makeRequest.apply(this, arguments);
      }
      function _makeRequest() {
          _makeRequest = _async_to_generator$4(function(sensor, fetchParameters, callback) {
              var fetchUrl, fetchArguments, _sensor_state, result, e, text, command, _fetchArguments_headers, _fetchArguments_body, _fetchArguments_headers1;
              return _ts_generator$5(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          fetchUrl = fetchParameters.url;
                          fetchArguments = _extends$3({
                              method: fetchParameters.method,
                              headers: getRealValue(fetchParameters.headers)
                          }, fetchParameters.body ? {
                              body: getRealValue(fetchParameters.body)
                          } : {});
                          if (!(!context.display || context.autoGrading || context.offLineMode)) return [
                              3,
                              6
                          ];
                          if (!((_sensor_state = sensor.state) == null ? void 0 : _sensor_state.active)) {
                              throw strings.messages.wifiNotActive;
                          }
                          context.registerQuickPiEvent(sensor.name, _extends$3({}, sensor.state, {
                              lastRequest: _extends$3({
                                  url: fetchUrl
                              }, fetchArguments)
                          }));
                          result = null;
                          _state.label = 1;
                      case 1:
                          _state.trys.push([
                              1,
                              3,
                              ,
                              4
                          ]);
                          return [
                              4,
                              fetch(fetchUrl, _extends$3({}, fetchArguments, fetchArguments.body ? {
                                  body: new URLSearchParams(fetchArguments.body)
                              } : {}))
                          ];
                      case 2:
                          // @ts-ignore
                          result = _state.sent();
                          return [
                              3,
                              4
                          ];
                      case 3:
                          e = _state.sent();
                          console.error(e);
                          throw strings.messages.networkRequestFailed.format(fetchParameters.url);
                      case 4:
                          return [
                              4,
                              result.text()
                          ];
                      case 5:
                          text = _state.sent();
                          callback({
                              __className: 'Response',
                              arguments: [
                                  result.status,
                                  text
                              ]
                          });
                          return [
                              3,
                              8
                          ];
                      case 6:
                          if ('GET' === fetchArguments.method) {
                              command = 'requestsGet("' + sensor.name + '", "' + formatString(fetchUrl) + "\", '" + formatString(JSON.stringify((_fetchArguments_headers = fetchArguments.headers) != null ? _fetchArguments_headers : {})) + "')";
                          } else {
                              command = 'requestsPost("' + sensor.name + '", "' + formatString(fetchUrl) + "\", '" + formatString(JSON.stringify((_fetchArguments_body = fetchArguments.body) != null ? _fetchArguments_body : {})) + "', '" + formatString(JSON.stringify((_fetchArguments_headers1 = fetchArguments.headers) != null ? _fetchArguments_headers1 : {})) + "')";
                          }
                          return [
                              4,
                              new Promise(function(resolve, reject) {
                                  context.quickPiConnection.sendCommand(command, function(result) {
                                      try {
                                          var _JSON_parse = JSON.parse(result), status = _JSON_parse[0], text = _JSON_parse[1];
                                          callback({
                                              __className: 'Response',
                                              arguments: [
                                                  status,
                                                  text
                                              ]
                                          });
                                          resolve();
                                      } catch (e) {
                                          console.error(result);
                                          reject(result);
                                      }
                                  });
                              })
                          ];
                      case 7:
                          _state.sent();
                          _state.label = 8;
                      case 8:
                          return [
                              2
                          ];
                  }
              });
          });
          return _makeRequest.apply(this, arguments);
      }
      return {
          classDefinitions: {
              actuator: {
                  Response: {
                      defaultInstanceName: 'response',
                      init: {
                          params: [
                              "Number",
                              "String"
                          ],
                          hidden: true
                      },
                      blocks: [
                          {
                              name: "json"
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Response: {
                  __constructor: function __constructor(self, statusCode, text) {
                      return _ts_generator$5(this, function(_state) {
                          self.status_code = statusCode;
                          self.text = text;
                          return [
                              2
                          ];
                      });
                  },
                  json: function json(self) {
                      return _ts_generator$5(this, function(_state) {
                          try {
                              return [
                                  2,
                                  JSON.parse(self.text)
                              ];
                          } catch (e) {
                              console.error(e);
                              throw strings.messages.nonValidJson;
                          }
                          return [
                              2
                          ];
                      });
                  }
              }
          },
          blockDefinitions: {
              actuator: [
                  {
                      name: 'get',
                      variants: [
                          [
                              "String"
                          ],
                          [
                              "String",
                              null
                          ]
                      ],
                      yieldsValue: 'string'
                  },
                  {
                      name: 'post',
                      variants: [
                          [
                              "String",
                              null
                          ],
                          [
                              "String",
                              null,
                              null
                          ]
                      ],
                      yieldsValue: 'string'
                  }
              ]
          },
          blockImplementations: {
              get: function get() {
                  var args = [].concat(arguments);
                  var callback = args.pop();
                  var url = args[0], headers = args[1];
                  var sensor = context.sensorHandler.findSensorByType('wifi');
                  if (!sensor) {
                      throw "There is no Wi-Fi sensor to make the request.";
                  }
                  var cb = context.runner.waitCallback(callback);
                  return makeRequest(sensor, {
                      method: 'GET',
                      url: url,
                      headers: headers
                  }, cb);
              },
              post: function post() {
                  var args = [].concat(arguments);
                  var callback = args.pop();
                  var url = args[0], data = args[1], headers = args[2];
                  var sensor = context.sensorHandler.findSensorByType('wifi');
                  if (!sensor) {
                      throw "There is no Wi-Fi sensor to make the request.";
                  }
                  var cb = context.runner.waitCallback(callback);
                  return makeRequest(sensor, {
                      method: 'POST',
                      url: url,
                      headers: headers,
                      body: data
                  }, cb);
              }
          }
      };
  }

  function jsonModuleDefinition(context, strings) {
      return {
          blockDefinitions: {
              actuator: [
                  {
                      name: 'dumps',
                      params: [
                          null
                      ],
                      yieldsValue: 'string'
                  }
              ]
          },
          blockImplementations: {
              dumps: function dumps(params, callback) {
                  var serialized = JSON.stringify(params);
                  context.waitDelay(callback, serialized);
              }
          }
      };
  }

  function machinePulseModuleDefinition(context, strings) {
      return {
          blockDefinitions: {
              sensors: [
                  {
                      name: 'time_pulse_us',
                      params: [
                          null,
                          'Number',
                          'Number'
                      ],
                      yieldsValue: 'int'
                  }
              ]
          },
          blockImplementations: {
              time_pulse_us: function time_pulse_us(pin, pulseLevel, timeoutUs, callback) {
                  var sensor = context.sensorHandler.findSensorByPort("D" + pin.pinNumber);
                  if (!sensor) {
                      throw "There is no sensor connected to the digital port D" + pin.pinNumber;
                  }
                  var command = "getTimePulseUs(\"" + sensor.name + ('", ' + pulseLevel + ", " + timeoutUs + ")");
                  if (!context.display || context.autoGrading || context.offLineMode) {
                      var distance = context.getSensorState(sensor.name);
                      var duration = distance / 343 * 2 / 100 * 1e6;
                      context.waitDelay(callback, duration);
                  } else {
                      var cb = context.runner.waitCallback(callback);
                      context.quickPiConnection.sendCommand(command, cb);
                  }
              }
          }
      };
  }

  function getSessionStorage(name) {
      // Use a try in case it gets blocked
      try {
          return sessionStorage[name];
      } catch (e) {
          return null;
      }
  }
  function setSessionStorage(name, value) {
      // Use a try in case it gets blocked
      try {
          sessionStorage[name] = value;
      } catch (e) {}
  }

  var galaxiaPythonLib = '\n\ntry:\n    sensorTable\nexcept:\n    sensorTable = []\n\nfrom thingz import *\nfrom machine import *\nfrom time import *\nfrom network import *\nfrom requests import *\nfrom json import *\n\nservo_angle = {}\ndistance_last_value = {}\n\ndef normalizePin(pin):\n    returnpin = 0\n    hadporttype = False\n\n    pin = str(pin)\n\n    if pin.isdigit():\n        returnpin = pin\n    elif len(pin) >= 2 and pin[0].isalpha() and pin[1:].isdigit():\n        returnpin = pin[1:]\n    elif pin.upper().startswith("I2C"):\n        returnpin = pin[3:]\n    else:\n        returnpin = normalizePin(nameToPin(pin))\n\n    return int(returnpin)\n\ndef nameToPin(name):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor["port"]\n\n    return 0\n\ndef nameToDef(name, type):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor\n\n    for sensor in sensorTable:\n        if sensor["type"] == type:\n            return sensor\n\n    return None\n\ndef readAcceleration(axis):\n    if axis == "x":\n        val = accelerometer.get_x()\n    elif axis == "y":\n        val = accelerometer.get_y()\n    elif axis == "z":\n        val = accelerometer.get_z()\n    else:\n        throw("Unknown axis")\n    return round(val/100, 1)\n\ndef readAccelBMI160():\n    return [readAcceleration("x"), readAcceleration("y"), readAcceleration("z")]\n\ndef readMagneticForce(axis):\n    if axis == "x":\n        val = compass.get_x()\n    elif axis == "y":\n        val = compass.get_y()\n    elif axis == "z":\n        val = compass.get_z()\n    else:\n        throw("Unknown axis")\n    return round(val/100, 1)\n\ndef readMagnetometerLSM303C(allowcalibration=True):\n    return [readMagneticForce("x"), readMagneticForce("y"), readMagneticForce("z")]\n\ndef setLedState(pin, state):\n    pin = normalizePin(pin)\n\n    led = Pin(pin, Pin.OUT)\n    if state:\n        led.on()\n    else:\n        led.off()\n\ndef readLightIntensity(pin):\n    return led.read_light_level()\n\ndef readTemperature(pin):\n    return temperature()\n\ndef turnLedOn():\n    setLedState("led", 1)\n\ndef turnLedOff():\n    setLedState("led", 0)\n\ndef setLedRgbState(pin, rgb):\n    led.set_colors(rgb[0], rgb[1], rgb[2])\n\ndef setLedDimState(pin, state):\n    pwmDuty(pin, int(state*1023))\n \ndef isButtonPressed(name):\n    if name == "button_a":\n        return button_a.is_pressed()\n    elif name == "button_b":\n        return button_b.is_pressed()\n    elif name == "touch_n":\n        return touch_n.is_touched()\n    elif name == "touch_s":\n        return touch_s.is_touched()\n    elif name == "touch_e":\n        return touch_e.is_touched()\n    elif name == "touch_w":\n        return touch_w.is_touched()\n    else:\n        throw("Unknown button")\n        \ndef setServoAngle(pin, angle):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        print(pin)\n        servo_angle[pin] = 0\n\n        angle = int(angle)\n\n        if angle < 0:\n            angle = 0\n        elif angle > 180:\n            angle = 180\n            \n        pin = PWM(Pin(pin), freq=50, duty=0)\n        pin.duty(int(0.025*1023 + (angle*0.1*1023)/180))\n        \ndef getServoAngle(pin):\n    pin = normalizePin(pin)\n    angle = 0\n\n    try:\n        angle = servo_angle[pin]\n    except:\n        pass\n\n    return angle\n\ndef pwmDuty(pin, duty):\n    pin = normalizePin(pin)\n    if pin != 0:\n        print(pin)\n        print(duty)\n        pinElement = PWM(Pin(pin), freq=50, duty=0)\n        pinElement.duty(duty)\n\ndef turnPortOn(pin):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        pinElement = Pin(pin, Pin.OUT)\n        pinElement.on()\n\ndef turnPortOff(pin):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        pinElement = Pin(pin, Pin.OUT)\n        pinElement.off()\n        \ndef getTimePulseUs(pin, pulseLevel, timeoutUs):\n    pin = normalizePin(pin)\n    if pin != 0:\n        echo = Pin(pin, Pin.IN)\n        \n        return time_pulse_us(echo, pulseLevel, timeoutUs)\n        \ndef readDistance(pin):\n  pin = normalizePin(pin)\n  if pin != 0:\n      trig = Pin(pin, Pin.OUT)\n      trig.off()\n      sleep_us(2)\n      trig.on()\n      sleep_us(10)\n      trig.off()\n      echo = Pin(pin, Pin.IN)\n      timeout_us = 30000\n      duration = time_pulse_us(echo, 1, timeout_us)/1e6 # t_echo in seconds\n      \n      last_value = 0\n      try:\n          last_value = distance_last_value[pin]\n      except:\n          pass\n        \n      if duration > 0:\n          distance = round(343 * duration/2 * 100, 1)\n          distance_last_value[pin] = distance\n          \n          return distance\n      else:\n          return last_value\n          \ndef wifiSetActive(sensor, active):\n    wlan = WLAN(STA_IF)\n    wlan.active(True if 1 == active else False)\n          \ndef wifiConnect(sensor, ssid, password):\n    wlan = WLAN(STA_IF)\n    wlan.disconnect()\n    wlan.connect(ssid, password)\n\ndef wifiDisconnect(sensor):\n    wlan = WLAN(STA_IF)\n    wlan.disconnect()\n \ndef wifiIsConnected(sensor):\n    wlan = WLAN(STA_IF)\n    \n    return wlan.isconnected()\n    \ndef wifiGetActive(sensor):\n    wlan = WLAN(STA_IF)\n    \n    return wlan.active()\n\ndef wifiGetStatus(sensor):\n    wlan = WLAN(STA_IF)\n    \n    return [wlan.active(), wlan.status(), wlan.config(\'essid\')]\n\ndef wifiIfConfig(sensor):\n    wlan = WLAN(STA_IF)\n    \n    return wlan.ifconfig()\n    \ndef wifiScan(sensor):\n    wlan = WLAN(STA_IF)\n    \n    return wlan.scan()\n\ndef requestsGet(sensor, url, headers):\n    response = get(url, headers=loads(headers))\n    \n    return [response.status_code, response.text]\n\ndef requestsPost(sensor, url, data, headers):\n    response = post(url, data=loads(data), headers=loads(headers))\n    \n    return [response.status_code, response.text]\n\n';

  var galaxiaRequestsModule = '\nimport socket\n\n\nclass Response:\n    def __init__(self, f):\n        self.raw = f\n        self.encoding = "utf-8"\n        self._cached = None\n\n    def close(self):\n        if self.raw:\n            self.raw.close()\n            self.raw = None\n        self._cached = None\n\n    @property\n    def content(self):\n        if self._cached is None:\n            try:\n                self._cached = self.raw.read()\n            finally:\n                self.raw.close()\n                self.raw = None\n        return self._cached\n\n    @property\n    def text(self):\n        return str(self.content, self.encoding)\n\n    def json(self):\n        import json\n\n        return json.loads(self.content)\n\n\ndef request(\n    method,\n    url,\n    data=None,\n    json=None,\n    headers=None,\n    stream=None,\n    auth=None,\n    timeout=None,\n    parse_headers=True,\n):\n    if headers is None:\n        headers = {}\n\n    redirect = None  # redirection url, None means no redirection\n    chunked_data = data and getattr(data, "__next__", None) and not getattr(data, "__len__", None)\n\n    if auth is not None:\n        import binascii\n\n        username, password = auth\n        formated = b"{}:{}".format(username, password)\n        formated = str(binascii.b2a_base64(formated)[:-1], "ascii")\n        headers["Authorization"] = "Basic {}".format(formated)\n\n    try:\n        proto, dummy, host, path = url.split("/", 3)\n    except ValueError:\n        proto, dummy, host = url.split("/", 2)\n        path = ""\n    if proto == "http:":\n        port = 80\n    elif proto == "https:":\n        import tls\n\n        port = 443\n    else:\n        raise ValueError("Unsupported protocol: " + proto)\n\n    if ":" in host:\n        host, port = host.split(":", 1)\n        port = int(port)\n\n    ai = socket.getaddrinfo(host, port, 0, socket.SOCK_STREAM)\n    ai = ai[0]\n\n    resp_d = None\n    if parse_headers is not False:\n        resp_d = {}\n\n    s = socket.socket(ai[0], socket.SOCK_STREAM, ai[2])\n\n    if timeout is not None:\n        # Note: settimeout is not supported on all platforms, will raise\n        # an AttributeError if not available.\n        s.settimeout(timeout)\n\n    try:\n        s.connect(ai[-1])\n        if proto == "https:":\n            context = tls.SSLContext(tls.PROTOCOL_TLS_CLIENT)\n            context.verify_mode = tls.CERT_NONE\n            s = context.wrap_socket(s, server_hostname=host)\n        s.write(b"%s /%s HTTP/1.0\\r\\n" % (method, path))\n\n        if "Host" not in headers:\n            headers["Host"] = host\n\n        if json is not None:\n            assert data is None\n            from json import dumps\n\n            data = dumps(json)\n\n            if "Content-Type" not in headers:\n                headers["Content-Type"] = "application/json"\n\n        if data:\n            if chunked_data:\n                if "Transfer-Encoding" not in headers and "Content-Length" not in headers:\n                    headers["Transfer-Encoding"] = "chunked"\n            elif "Content-Length" not in headers:\n                headers["Content-Length"] = str(len(data))\n\n        if "Connection" not in headers:\n            headers["Connection"] = "close"\n\n        # Iterate over keys to avoid tuple alloc\n        for k in headers:\n            s.write(k)\n            s.write(b": ")\n            s.write(headers[k])\n            s.write(b"\\r\\n")\n\n        s.write(b"\\r\\n")\n\n        if data:\n            if chunked_data:\n                if headers.get("Transfer-Encoding", None) == "chunked":\n                    for chunk in data:\n                        s.write(b"%x\\r\\n" % len(chunk))\n                        s.write(chunk)\n                        s.write(b"\\r\\n")\n                    s.write("0\\r\\n\\r\\n")\n                else:\n                    for chunk in data:\n                        s.write(chunk)\n            else:\n                s.write(data)\n\n        l = s.readline()\n        # print(l)\n        l = l.split(None, 2)\n        if len(l) < 2:\n            # Invalid response\n            raise ValueError("HTTP error: BadStatusLine:\\n%s" % l)\n        status = int(l[1])\n        reason = ""\n        if len(l) > 2:\n            reason = l[2].rstrip()\n        while True:\n            l = s.readline()\n            if not l or l == b"\\r\\n":\n                break\n            # print(l)\n            if l.startswith(b"Transfer-Encoding:"):\n                if b"chunked" in l:\n                    raise ValueError("Unsupported " + str(l, "utf-8"))\n            elif l.startswith(b"Location:") and not 200 <= status <= 299:\n                if status in [301, 302, 303, 307, 308]:\n                    redirect = str(l[10:-2], "utf-8")\n                else:\n                    raise NotImplementedError("Redirect %d not yet supported" % status)\n            if parse_headers is False:\n                pass\n            elif parse_headers is True:\n                l = str(l, "utf-8")\n                k, v = l.split(":", 1)\n                resp_d[k] = v.strip()\n            else:\n                parse_headers(l, resp_d)\n    except OSError:\n        s.close()\n        raise\n\n    if redirect:\n        s.close()\n        if status in [301, 302, 303]:\n            return request("GET", redirect, None, None, headers, stream)\n        else:\n            return request(method, redirect, data, json, headers, stream)\n    else:\n        resp = Response(s)\n        resp.status_code = status\n        resp.reason = reason\n        if resp_d is not None:\n            resp.headers = resp_d\n        return resp\n\n\ndef head(url, **kw):\n    return request("HEAD", url, **kw)\n\n\ndef get(url, **kw):\n    return request("GET", url, **kw)\n\n\ndef post(url, **kw):\n    return request("POST", url, **kw)\n\n\ndef put(url, **kw):\n    return request("PUT", url, **kw)\n\n\ndef patch(url, **kw):\n    return request("PATCH", url, **kw)\n\n\ndef delete(url, **kw):\n    return request("DELETE", url, **kw)\n';

  function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$3(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _ts_generator$4(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function _ts_values$1(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function() {
              if (o && i >= o.length) o = void 0;
              return {
                  value: o && o[i++],
                  done: !o
              };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function getSerial$1(filters) {
      return _getSerial$1.apply(this, arguments);
  }
  function _getSerial$1() {
      _getSerial$1 = _async_to_generator$3(function(filters) {
          var allPorts, savedBoard, port, info;
          return _ts_generator$4(this, function(_state) {
              switch(_state.label){
                  case 0:
                      return [
                          4,
                          navigator.serial.getPorts()
                      ];
                  case 1:
                      allPorts = _state.sent();
                      savedBoard = getSessionStorage('galaxia_board');
                      if (null !== savedBoard) {
                          port = allPorts.find(function(port) {
                              return savedBoard === JSON.stringify(port.getInfo());
                          });
                      }
                      if (!!port) return [
                          3,
                          3
                      ];
                      return [
                          4,
                          navigator.serial.requestPort({
                              filters: filters
                          })
                      ];
                  case 2:
                      port = _state.sent();
                      _state.label = 3;
                  case 3:
                      return [
                          4,
                          port.open({
                              baudRate: 115200
                          })
                      ];
                  case 4:
                      _state.sent();
                      info = port.getInfo();
                      setSessionStorage('galaxia_board', JSON.stringify(info));
                      return [
                          2,
                          port
                      ];
              }
          });
      });
      return _getSerial$1.apply(this, arguments);
  }
  function serialWrite$1(port, data) {
      return _serialWrite$1.apply(this, arguments);
  }
  function _serialWrite$1() {
      _serialWrite$1 = _async_to_generator$3(function(port, data) {
          var writer, encoder;
          return _ts_generator$4(this, function(_state) {
              switch(_state.label){
                  case 0:
                      writer = port.writable.getWriter();
                      encoder = new TextEncoder();
                      return [
                          4,
                          writer.write(encoder.encode(data))
                      ];
                  case 1:
                      _state.sent();
                      return [
                          4,
                          writer.ready
                      ];
                  case 2:
                      _state.sent();
                      writer.releaseLock();
                      return [
                          2
                      ];
              }
          });
      });
      return _serialWrite$1.apply(this, arguments);
  }
  var GalaxiaConnection = /*#__PURE__*/ function() {
      function GalaxiaConnection(userName, _onConnect, _onDisconnect, _onChangeBoard) {
          this.connecting = false;
          this.connected = false;
          this.releasing = false;
          this.currentOutputLine = '';
          this.currentOutput = "";
          this.executing = false;
          this._onConnect = _onConnect;
          this._onDisconnect = _onDisconnect;
          this._onChangeBoard = _onChangeBoard;
          this.resetProperties();
      }
      var _proto = GalaxiaConnection.prototype;
      _proto.resetProperties = function resetProperties() {
          this.connecting = false;
          this.connected = false;
          this.releasing = false;
          this.serial = null;
          this.currentOutput = "";
          this.currentOutputLine = '';
          this.outputCallback = null;
          this.executionQueue = [];
          this.executing = false;
          this.releaseTimeout = null;
          this.currentExecutionCallback = null;
          this.currentOutputId = "";
          this.nbCommandsExecuted = 0;
      };
      _proto.onDisconnect = function onDisconnect(wasConnected, wrongversion) {
          if (wrongversion === void 0) wrongversion = false;
          this.releaseLock();
          this._onDisconnect.apply(this, arguments);
      };
      _proto.onChangeBoard = function onChangeBoard(board) {
          this._onChangeBoard.apply(this, arguments);
      };
      _proto.processGalaxiaOutput = function processGalaxiaOutput(data) {
          var text = new TextDecoder().decode(data);
          this.currentOutputLine += text;
          var currentLines = this.currentOutputLine.split('\r\n');
          if (currentLines.length > 1) {
              this.currentOutputLine = [].concat(currentLines).pop();
              var linesToAdd = currentLines.slice(0, -1).join('\r\n');
              this.currentOutput += linesToAdd + '\r\n';
              {
                  console.log(linesToAdd);
              }
          }
          var lines = this.currentOutput.split('\r\n');
          this.currentOutput = lines.join('\r\n');
          window.currentOutput = this.currentOutput;
          if (this.outputCallback && this.currentOutputLine.startsWith('>>> ') && lines[lines.length - 2].startsWith(this.currentOutputId)) {
              this.outputCallback(lines[lines.length - 4]);
              this.outputCallback = null;
          }
      };
      _proto.connect = function connect(url) {
          var _this = this;
          return _async_to_generator$3(function() {
              return _ts_generator$4(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _this.resetProperties();
                          _this.connecting = true;
                          _state.label = 1;
                      case 1:
                          _state.trys.push([
                              1,
                              3,
                              ,
                              4
                          ]);
                          return [
                              4,
                              getSerial$1([
                                  {
                                      usbProductId: 0x4003,
                                      usbVendorId: 0x303A
                                  }
                              ])
                          ];
                      case 2:
                          _this.serial = _state.sent();
                          return [
                              3,
                              4
                          ];
                      case 3:
                          _state.sent();
                          _this.connecting = false;
                          _this._onDisconnect(false);
                          return [
                              2
                          ];
                      case 4:
                          _this.serial.addEventListener('disconnect', function() {
                              _this.connected = false;
                              _this.onDisconnect(true);
                          });
                          _this.serialStartRead(_this.serial);
                          return [
                              4,
                              _this.transferPythonLib()
                          ];
                      case 5:
                          _state.sent();
                          _this.connecting = false;
                          _this.connected = true;
                          _this._onConnect();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.serialStartRead = function serialStartRead(port) {
          var _this = this;
          return _async_to_generator$3(function() {
              var _ref, value, done;
              return _ts_generator$4(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _this.reader = port.readable.getReader();
                          _state.label = 1;
                      case 1:
                          return [
                              4,
                              _this.reader.read()
                          ];
                      case 2:
                          _ref = _state.sent(), value = _ref.value, done = _ref.done;
                          _this.processGalaxiaOutput(value);
                          if (done || _this.releasing) {
                              _this.reader.cancel();
                              return [
                                  3,
                                  3
                              ];
                          }
                          return [
                              3,
                              1
                          ];
                      case 3:
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.transferPythonLib = function transferPythonLib() {
          var _this = this;
          return _async_to_generator$3(function() {
              return _ts_generator$4(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          return [
                              4,
                              _this.transferModule('fioilib.py', galaxiaPythonLib)
                          ];
                      case 1:
                          _state.sent();
                          return [
                              4,
                              _this.transferModule('requests.py', galaxiaRequestsModule)
                          ];
                      case 2:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f = open(\"main.py\", \"w\")\r\nf.write(" + JSON.stringify(mainLib$1).replace(/\n/g, "\r\n") + ")\r\nf.close()\r\n", resolve);
                              })
                          ];
                      case 3:
                          _state.sent();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.transferModule = function transferModule(moduleFile, moduleContent) {
          var _this = this;
          return _async_to_generator$3(function() {
              var _loop, size, numChunks, i, o;
              return _ts_generator$4(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _loop = function(i, o) {
                              var chunk;
                              return _ts_generator$4(this, function(_state) {
                                  switch(_state.label){
                                      case 0:
                                          chunk = moduleContent.substring(o, o + size);
                                          return [
                                              4,
                                              new Promise(function(resolve) {
                                                  return _this.executeSerial("f.write(" + JSON.stringify(chunk).replace(/\n/g, "\r\n") + ")\r\n", resolve);
                                              })
                                          ];
                                      case 1:
                                          _state.sent();
                                          return [
                                              2
                                          ];
                                  }
                              });
                          };
                          size = 1200; // Max 1kb size
                          numChunks = Math.ceil(moduleContent.length / size);
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial('f = open("' + moduleFile + '", "w")\r\n', resolve);
                              })
                          ];
                      case 1:
                          _state.sent();
                          i = 0, o = 0;
                          _state.label = 2;
                      case 2:
                          if (!(i < numChunks)) return [
                              3,
                              5
                          ];
                          return [
                              5,
                              _ts_values$1(_loop(i, o))
                          ];
                      case 3:
                          _state.sent();
                          _state.label = 4;
                      case 4:
                          ++i, o += size;
                          return [
                              3,
                              2
                          ];
                      case 5:
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f.close()\r\n", resolve);
                              })
                          ];
                      case 6:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial('exec(open("' + moduleFile + '", "r").read())\r\n', resolve);
                              })
                          ];
                      case 7:
                          _state.sent();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.isAvailable = function isAvailable(ipaddress, callback) {
          callback(ipaddress == "localhost");
      };
      _proto.onclose = function onclose() {};
      _proto.wasLocked = function wasLocked() {};
      _proto.isConnecting = function isConnecting() {
          return this.connecting;
      };
      _proto.isConnected = function isConnected() {
          return this.connected;
      };
      _proto.executeProgram = function executeProgram(pythonProgram) {
      // TODO
      };
      _proto.installProgram = function installProgram(pythonProgram, oninstall) {
          this.transferModule('program.py', pythonProgram).then(oninstall);
      };
      _proto.runDistributed = function runDistributed(pythonProgram, graphDefinition, oninstall) {
          return;
      };
      _proto.stopProgram = function stopProgram() {
      // TODO
      };
      _proto.releaseLock = function releaseLock() {
          var _this = this;
          if (!this.serial) {
              return;
          }
          this.releasing = true;
          var _this1 = this;
          var endRelease = /*#__PURE__*/ _async_to_generator$3(function() {
              return _ts_generator$4(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          if (!_this1.releaseTimeout) {
                              return [
                                  2
                              ];
                          }
                          _this1.reader.cancel().catch(function() {});
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return setTimeout(resolve, 100);
                              })
                          ];
                      case 1:
                          _state.sent();
                          _this1.serial.close();
                          _this1.serial = null;
                          _this1.connecting = null;
                          _this1.connected = null;
                          _this1.releaseTimeout = null;
                          _this1.onDisconnect(false);
                          return [
                              2
                          ];
                  }
              });
          });
          serialWrite$1(this.serial, "\x04").then(function() {
              _this.reader.closed.then(function() {
                  // For some reason, if we don't use a timeout, the reader is still locked and we can't close the serial port
                  setTimeout(endRelease, 100);
              });
          });
          this.releaseTimeout = setTimeout(endRelease, 5000);
      };
      _proto.startNewSession = function startNewSession() {
      // TODO
      };
      _proto.startTransaction = function startTransaction() {
      // TODO
      };
      _proto.endTransaction = function endTransaction() {
      // TODO
      };
      _proto.executeSerial = function executeSerial(command, callback) {
          var _this = this;
          if (this.executing) {
              this.executionQueue.push([
                  command,
                  callback
              ]);
              return;
          }
          this.executing = true;
          var that = this;
          this.nbCommandsExecuted += 1;
          if (this.nbCommandsExecuted > 500) {
              this.executionQueue.push([
                  "\x04",
                  function() {}
              ]);
              this.executionQueue.push([
                  "exec(open(\"fioilib.py\", \"r\").read())\r\n",
                  function() {}
              ]);
              this.nbCommandsExecuted = 0;
          }
          this.currentOutputId = Math.random().toString(36).substring(7);
          this.currentExecutionCallback = callback;
          serialWrite$1(this.serial, command + "\r\nprint(\"" + this.currentOutputId + "\")\r\n").then(function() {
              that.outputCallback = function(data) {
                  if (_this.currentExecutionCallback) {
                      _this.currentExecutionCallback(data);
                  }
                  that.executing = false;
                  if (that.executionQueue.length > 0) {
                      var _that_executionQueue_shift = that.executionQueue.shift(), _$command = _that_executionQueue_shift[0], _$callback = _that_executionQueue_shift[1];
                      _this.executeSerial(_$command, _$callback);
                  }
              };
          });
      };
      _proto.genericSendCommand = function genericSendCommand(command, callback) {
          this.executeSerial("print(dumps(" + command + "))", function(data) {
              var convertedData = data;
              if ('false' === data) {
                  convertedData = false;
              } else if ('true' === data) {
                  convertedData = true;
              }
              callback(convertedData);
          });
      };
      _proto.sendCommand = function sendCommand(command, callback) {
          if (-1 !== command.indexOf('sensorTable =')) {
              this.executeSerial(command, callback);
              return;
          }
          this.genericSendCommand(command, callback);
      };
      return GalaxiaConnection;
  }();
  var mainLib$1 = '\nimport os\nfrom machine import *\nfrom thingz import *\n\nprogram_exists = False\n\ntry:\n    open("program.py", "r").close()\n    program_exists = True\nexcept OSError:\n    pass\n\nif button_a.is_pressed() and button_b.is_pressed():\n    if program_exists:\n        print("Removing program")\n        os.remove("program.py")\nelif program_exists:\n    exec(open("fioilib.py", "r").read(), globals())\n    exec(open("program.py", "r").read(), globals())\n\n'/*f = open("main.py", "w")
  f.write("""
  from machine import *
  from thingz import *
  import os
  if button_a.is_pressed() and button_b.is_pressed():
      if os.path.exists("main.py"):
          print("Removing")
          os.remove("main.py")
  else:
      print("Hello, world!")
  """)
  f.close()*/ ;

  function thingzCompassModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          classDefinitions: {
              sensors: {
                  Compass: {
                      blocks: [
                          {
                              name: "get_x",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          },
                          {
                              name: "get_y",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          },
                          {
                              name: "get_z",
                              yieldsValue: true,
                              blocklyJson: {
                                  output: "Number"
                              }
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Compass: {
                  get_x: function get_x(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readMagneticForce('x', callback);
                  },
                  get_y: function get_y(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readMagneticForce('y', callback);
                  },
                  get_z: function get_z(self, callback) {
                      quickPiModuleDefinition.blockImplementations.readMagneticForce('z', callback);
                  }
              }
          },
          classInstances: {
              compass: 'Compass'
          }
      };
  }

  function _array_like_to_array$7(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _unsupported_iterable_to_array$7(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$7(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$7(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$7(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$7(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function mergeModuleDefinitions(moduleDefinitions) {
      var moduleDefinitionToBoardBlocks = {
          'classDefinitions': 'customClasses',
          'classInstances': 'customClassInstances',
          'classImplementations': 'customClassImplementations',
          'blockImplementations': 'customBlockImplementations',
          'blockDefinitions': 'customBlocks',
          'constants': 'customConstants'
      };
      var toBeMerged = {};
      var addToMerge = function(boardCustomBlockName, moduleName, moduleDef) {
          if (!(boardCustomBlockName in toBeMerged)) {
              toBeMerged[boardCustomBlockName] = {};
          }
          if (!(moduleName in toBeMerged[boardCustomBlockName])) {
              toBeMerged[boardCustomBlockName][moduleName] = [];
          }
          toBeMerged[boardCustomBlockName][moduleName].push(moduleDef);
      };
      for(var _iterator = _create_for_of_iterator_helper_loose$7(Object.entries(moduleDefinitions)), _step; !(_step = _iterator()).done;){
          var _step_value = _step.value, moduleName = _step_value[0], moduleSelfDefinitions = _step_value[1];
          for(var _iterator1 = _create_for_of_iterator_helper_loose$7(moduleSelfDefinitions), _step1; !(_step1 = _iterator1()).done;){
              var moduleSelfDefinition = _step1.value;
              for(var _iterator2 = _create_for_of_iterator_helper_loose$7(Object.entries(moduleDefinitionToBoardBlocks)), _step2; !(_step2 = _iterator2()).done;){
                  var _step_value1 = _step2.value, moduleDefinitionName = _step_value1[0], boardCustomBlockName = _step_value1[1];
                  if (moduleSelfDefinition[moduleDefinitionName]) {
                      addToMerge(boardCustomBlockName, moduleName, moduleSelfDefinition[moduleDefinitionName]);
                  }
              }
          }
      }
      var boardCustomBlocks = {};
      for(var _iterator3 = _create_for_of_iterator_helper_loose$7(Object.entries(toBeMerged)), _step3; !(_step3 = _iterator3()).done;){
          var _step_value2 = _step3.value, boardCustomBlockName1 = _step_value2[0], elements = _step_value2[1];
          boardCustomBlocks[boardCustomBlockName1] = {};
          for(var _iterator4 = _create_for_of_iterator_helper_loose$7(Object.entries(elements)), _step4; !(_step4 = _iterator4()).done;){
              var _step_value3 = _step4.value, moduleName1 = _step_value3[0], moduleDefinitionsList = _step_value3[1];
              boardCustomBlocks[boardCustomBlockName1][moduleName1] = deepMerge.apply(void 0, [].concat(moduleDefinitionsList));
          }
      }
      return boardCustomBlocks;
  }

  function _array_like_to_array$6(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$2(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _inherits$p(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$p(subClass, superClass);
  }
  function _set_prototype_of$p(o, p) {
      _set_prototype_of$p = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$p(o, p);
  }
  function _unsupported_iterable_to_array$6(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$6(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$6(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$6(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$6(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _ts_generator$3(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var galaxiaSvgInline = null;
  var galaxiaConnection = null;
  var GalaxiaBoard = /*#__PURE__*/ function(AbstractBoard) {
      _inherits$p(GalaxiaBoard, AbstractBoard);
      function GalaxiaBoard() {
          var _this;
          _this = AbstractBoard.apply(this, arguments) || this;
          _this.buttonStatesUpdators = {};
          _this.defaultSubBoard = 'galaxia';
          _this.galaxiaSvg = null;
          _this.initialized = false;
          _this.innerState = {};
          return _this;
      }
      var _proto = GalaxiaBoard.prototype;
      _proto.init = function init(selector, onUserEvent) {
          this.onUserEvent = onUserEvent;
          this.importGalaxia(selector);
          return this.updateState.bind(this);
      };
      _proto.fetchGalaxiaCard = function fetchGalaxiaCard() {
          return _async_to_generator$2(function() {
              return _ts_generator$3(this, function(_state) {
                  // Cache results
                  if (!galaxiaSvgInline) {
                      galaxiaSvgInline = decodeURIComponent(img$1.substring(img$1.indexOf(',') + 1));
                  }
                  return [
                      2,
                      galaxiaSvgInline
                  ];
              });
          })();
      };
      _proto.importGalaxia = function importGalaxia(selector) {
          var _this = this;
          return _async_to_generator$2(function() {
              var svgData;
              return _ts_generator$3(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          return [
                              4,
                              _this.fetchGalaxiaCard()
                          ];
                      case 1:
                          svgData = _state.sent();
                          $(selector).html(svgData).css('user-select', 'none');
                          _this.galaxiaSvg = $(selector + ' svg');
                          _this.initInteraction();
                          _this.displayInnerState();
                          _this.initialized = true;
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.initInteraction = function initInteraction() {
          this.galaxiaSvg.attr('width', "100%");
          this.galaxiaSvg.attr('height', "100%");
          var buttonIds = {
              a: 'button_a',
              b: 'button_b',
              sys: 'button_sys'
          };
          for(var _iterator = _create_for_of_iterator_helper_loose$6(Object.entries(buttonIds)), _step; !(_step = _iterator()).done;){
              var _step_value = _step.value, buttonId = _step_value[0], buttonName = _step_value[1];
              this.bindPushButton(buttonId, buttonName);
          }
          var padIds = {
              up: 'touch_n',
              down: 'touch_s',
              left: 'touch_w',
              right: 'touch_e'
          };
          for(var _iterator1 = _create_for_of_iterator_helper_loose$6(Object.entries(padIds)), _step1; !(_step1 = _iterator1()).done;){
              var _step_value1 = _step1.value, padId = _step_value1[0], padName = _step_value1[1];
              this.bindPadButton(padId, padName);
          }
      };
      _proto.bindPushButton = function bindPushButton(buttonId, buttonName) {
          var that = this;
          var buttons = this.galaxiaSvg.find('#button-' + buttonId + '-top, #button-' + buttonId + '-bot');
          var buttonTop = buttons.filter('#button-' + buttonId + '-top');
          var buttonBot = buttons.filter('#button-' + buttonId + '-bot');
          var colorTop = buttons.filter('#button-' + buttonId + '-top').css('fill');
          var colorBot = buttons.filter('#button-' + buttonId + '-bot').css('fill');
          var buttonDown = function buttonDown(isSet) {
              buttonTop.css('fill', 'transparent');
              buttonBot.css('fill', colorTop);
              if (isSet !== true && !that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, true);
              }
              that.innerState[buttonName] = true;
          };
          var buttonUp = function buttonUp(isSet) {
              buttonTop.css('fill', colorTop);
              buttonBot.css('fill', colorBot);
              if (isSet !== true && that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, false);
              }
              that.innerState[buttonName] = false;
          };
          buttons.mousedown(buttonDown);
          buttons.mouseup(buttonUp);
          buttons.mouseleave(buttonUp);
          this.buttonStatesUpdators[buttonName] = {
              'down': buttonDown,
              'up': buttonUp
          };
      };
      _proto.bindPadButton = function bindPadButton(buttonId, buttonName) {
          var that = this;
          var button = this.galaxiaSvg.find('#pad-' + buttonId);
          var buttonDown = function buttonDown(isSet) {
              button.css('fill-opacity', '1');
              if (isSet !== true && !that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, true);
              }
              that.innerState[buttonName] = true;
          };
          var buttonUp = function buttonUp(isSet) {
              button.css('fill-opacity', '0');
              if (isSet !== true && that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, false);
              }
              that.innerState[buttonName] = false;
          };
          button.mousedown(buttonDown);
          button.mouseup(buttonUp);
          button.mouseleave(buttonUp);
          this.buttonStatesUpdators[buttonName] = {
              'down': buttonDown,
              'up': buttonUp
          };
      };
      _proto.setLed = function setLed(color) {
          if (!this.initialized || !color) {
              return;
          }
          var led = this.galaxiaSvg.find('#led');
          led.css('fill', Array.isArray(color) ? "rgb(" + color.join(',') + ")" : '#d3d3d3');
      };
      _proto.setConnected = function setConnected(isConnected) {
          if (!this.initialized) {
              return;
          }
          var cable = this.galaxiaSvg.find('#cable');
          cable.toggle(isConnected);
      };
      _proto.updateState = function updateState(sensor) {
          if (sensor === 'connected') {
              this.innerState.connected = true;
              this.setConnected(true);
          } else if (sensor === 'disconnected') {
              this.innerState.connected = false;
              this.setConnected(false);
          } else if (sensor.name.substring(0, 7) == 'button_' || sensor.name.substring(0, 6) == 'touch_') {
              this.innerState[sensor.name] = sensor.state;
              if (!this.initialized) {
                  return;
              }
              this.buttonStatesUpdators[sensor.name][sensor.state ? 'down' : 'up'](true);
          } else if (sensor.type === 'ledrgb') {
              if (sensor.state) {
                  this.innerState.led = sensor.state;
              } else {
                  this.innerState.led = null;
              }
              this.setLed(this.innerState.led);
          }
      };
      _proto.displayInnerState = function displayInnerState() {
          // The display might be reset so we need to keep it up to date
          for(var id in this.buttonStatesUpdators){
              this.buttonStatesUpdators[id][this.innerState[id] ? 'down' : 'up'](true);
          }
          this.setLed(this.innerState.led || 'transparent');
          this.setConnected(this.innerState.connected);
      };
      _proto.getBoardDefinitions = function getBoardDefinitions() {
          return [
              {
                  name: "galaxia",
                  image: "quickpihat.png",
                  portTypes: {
                      "D": [
                          0,
                          1,
                          2,
                          6,
                          7,
                          8,
                          12,
                          13,
                          14,
                          15,
                          16,
                          19,
                          20
                      ],
                      "A": [
                          0,
                          1,
                          2,
                          6,
                          7,
                          8,
                          12,
                          13,
                          14,
                          15,
                          16,
                          19,
                          20
                      ]
                  },
                  builtinSensors: [
                      {
                          type: "ledrgb",
                          suggestedName: 'led'
                      },
                      {
                          type: "button",
                          suggestedName: 'button_a'
                      },
                      {
                          type: "button",
                          suggestedName: 'button_b'
                      },
                      {
                          type: "button",
                          suggestedName: 'touch_n'
                      },
                      {
                          type: "button",
                          suggestedName: 'touch_s'
                      },
                      {
                          type: "button",
                          suggestedName: 'touch_e'
                      },
                      {
                          type: "button",
                          suggestedName: 'touch_w'
                      }
                  ]
              }
          ];
      };
      _proto.getAvailableConnectionMethods = function getAvailableConnectionMethods() {
          return [
              ConnectionMethod.WebSerial
          ];
      };
      _proto.getConnection = function getConnection() {
          if (!galaxiaConnection) {
              galaxiaConnection = function galaxiaConnection(userName, _onConnect, _onDisconnect, _onChangeBoard) {
                  return new GalaxiaConnection(userName, _onConnect, _onDisconnect, _onChangeBoard);
              };
          }
          return galaxiaConnection;
      };
      _proto.getCustomBlocks = function getCustomBlocks(context, strings) {
          var accelerometerModule = thingzAccelerometerModuleDefinition(context, strings);
          var compassModule = thingzCompassModuleDefinition(context, strings);
          var buttonModule = thingzButtonsModuleDefinition(context, strings);
          var temperatureModule = thingzTemperatureModuleDefinition(context, strings);
          var ledModule = thingzLedModuleDefinition(context, strings);
          var pinModule = machinePinModuleDefinition(context);
          var pwmModule = machinePwmModuleDefinition(context);
          var pulseModule = machinePulseModuleDefinition(context);
          var timeModule = timeSleepModuleDefinition(context, strings);
          var wlanModule = networkWlanModuleDefinition(context, strings);
          var requestsModule = requestsModuleDefinition(context, strings);
          var jsonModule = jsonModuleDefinition(context);
          return mergeModuleDefinitions({
              thingz: [
                  accelerometerModule,
                  compassModule,
                  buttonModule,
                  ledModule,
                  temperatureModule
              ],
              machine: [
                  pinModule,
                  pwmModule,
                  pulseModule
              ],
              network: [
                  wlanModule
              ],
              requests: [
                  requestsModule
              ],
              time: [
                  timeModule
              ],
              json: [
                  jsonModule
              ]
          });
      };
      return GalaxiaBoard;
  }(AbstractBoard);
  var galaxiaBoard = new GalaxiaBoard();

  var langFr = {
      label: {
          // Labels for the blocks
          sleep: "attendre %1 millisecondes",
          currentTime: "temps écoulé en millisecondes",
          turnLedOn: "allumer la LED",
          turnLedOff: "éteindre la LED",
          setLedState: "passer la LED %1 à %2 ",
          toggleLedState: "inverser la LED %1",
          setLedMatrixOne: "passer la LED %1 en position %2, %3 à %4",
          isLedOn: "LED allumée",
          isLedOnWithName: "LED %1 allumée",
          setLedBrightness: "mettre la luminosité de %1 à %2",
          getLedBrightness: "lire la luminosité de %1",
          setLedColors: "mettre la couleur de %1 à r:%2 g:%3 b:%4",
          turnBuzzerOn: "allumer le buzzer",
          turnBuzzerOff: "éteindre le buzzer",
          setBuzzerState: "mettre le buzzer %1 à %2",
          isBuzzerOn: "buzzer allumé",
          isBuzzerOnWithName: "buzzer %1 allumé",
          setBuzzerNote: "jouer la fréquence %2Hz sur %1",
          getBuzzerNote: "fréquence du buzzer %1",
          isButtonPressed: "bouton enfoncé",
          isButtonPressedWithName: "bouton  %1 enfoncé",
          waitForButton: "attendre une pression sur le bouton",
          buttonWasPressed: "le bouton a été enfoncé",
          onButtonPressed: "quand le bouton",
          onButtonPressedEnd: "est enfoncé",
          onButtonPressedDo: "faire",
          displayText: "afficher %1",
          displayText2Lines: "afficher Ligne 1 : %1 Ligne 2 : %2",
          readTemperature: "température ambiante",
          getTemperatureFromCloud: "temperature de la ville %1",
          readRotaryAngle: "état du potentiomètre %1",
          readDistance: "distance mesurée par %1",
          readLightIntensity: "intensité lumineuse",
          readHumidity: "humidité ambiante",
          setServoAngle: "mettre le servo %1 à l'angle %2",
          getServoAngle: "angle du servo %1",
          setContinousServoDirection: "la direction du servo continu  %1 %2",
          drawPoint: "dessiner un pixel en x₀: %1 y₀: %2",
          isPointSet: "pixel affiché en x₀: %1 y₀: %2",
          drawLine: "ligne x₀: %1 y₀: %2 x₁: %3 y₁: %4",
          drawRectangle: "rectangle x₀: %1 y₀: %2 largeur₀: %3 hauteur₀: %4",
          drawCircle: "cercle x₀: %1 y₀: %2 diamètre₀: %3",
          clearScreen: "effacer tout l'écran",
          updateScreen: "mettre à jour l'écran",
          autoUpdate: "mode de mise à jour automatique de l'écran",
          fill: "mettre la couleur de remplissage à %1",
          noFill: "ne pas remplir les formes",
          stroke: "mettre la couleur de tracé à %1",
          noStroke: "ne pas dessiner les contours",
          readAcceleration: "accélération en (m/s²) dans l'axe %1",
          computeRotation: "calcul de l'angle de rotation (°) sur l'accéléromètre %1",
          readSoundLevel: "volume sonore",
          readMagneticForce: "champ magnétique (µT) sur %1",
          computeCompassHeading: "direction de la boussole en (°)",
          readInfraredState: "infrarouge détecté sur %1",
          setInfraredState: "mettre l'émetteur infrarouge %1 à %2",
          // Gyroscope
          readAngularVelocity: "vitesse angulaire (°/s) du gyroscope %1",
          setGyroZeroAngle: "initialiser le gyroscope à l'état zéro",
          computeRotationGyro: "calculer la rotation du gyroscope %1",
          //Internet store
          connectToCloudStore: "se connecter au cloud. Identifiant %1 Mot de passe %2",
          writeToCloudStore: "écrire dans le cloud : identifiant %1 clé %2 valeur %3",
          readFromCloudStore: "lire dans le cloud : identifiant %1 clé %2",
          // IR Remote
          readIRMessage: "attendre un message IR nom : %1 pendant : %2 ms",
          sendIRMessage: "envoi du message préparé IR nommé %2 sur %1",
          presetIRMessage: "préparer un message IR de nom %1 et contenu %2"
      },
      code: {
          // Names of the functions in Python, or Blockly translated in JavaScript
          turnLedOn: "turnLedOn",
          turnLedOff: "turnLedOff",
          setLedState: "setLedState",
          setLedMatrixOne: "setLedMatrixOne",
          isButtonPressed: "isButtonPressed",
          isButtonPressedWithName: "isButtonPressed",
          waitForButton: "waitForButton",
          buttonWasPressed: "buttonWasPressed",
          onButtonPressed: "onButtonPressed",
          toggleLedState: "toggleLedState",
          displayText: "displayText",
          displayText2Lines: "displayText",
          readTemperature: "readTemperature",
          sleep: "sleep",
          setServoAngle: "setServoAngle",
          readRotaryAngle: "readRotaryAngle",
          readDistance: "readDistance",
          readLightIntensity: "readLightIntensity",
          readHumidity: "readHumidity",
          currentTime: "currentTime",
          getTemperatureFromCloud: "getTemperatureFromCloud",
          isLedOn: "isLedOn",
          isLedOnWithName: "isLedOn",
          setBuzzerNote: "setBuzzerNote",
          getBuzzerNote: "getBuzzerNote",
          setLedBrightness: "setLedBrightness",
          getLedBrightness: "getLedBrightness",
          setLedColors: "setLedColors",
          getServoAngle: "getServoAngle",
          setBuzzerState: "setBuzzerState",
          turnBuzzerOn: "turnBuzzerOn",
          turnBuzzerOff: "turnBuzzerOff",
          isBuzzerOn: "isBuzzerOn",
          isBuzzerOnWithName: "isBuzzerOn",
          drawPoint: "drawPoint",
          isPointSet: "isPointSet",
          drawLine: "drawLine",
          drawRectangle: "drawRectangle",
          drawCircle: "drawCircle",
          clearScreen: "clearScreen",
          updateScreen: "updateScreen",
          autoUpdate: "autoUpdate",
          fill: "fill",
          noFill: "noFill",
          stroke: "stroke",
          noStroke: "noStroke",
          readAcceleration: "readAcceleration",
          computeRotation: "computeRotation",
          readSoundLevel: "readSoundLevel",
          readMagneticForce: "readMagneticForce",
          computeCompassHeading: "computeCompassHeading",
          readInfraredState: "readInfraredState",
          setInfraredState: "setInfraredState",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity",
          setGyroZeroAngle: "setGyroZeroAngle",
          computeRotationGyro: "computeRotationGyro",
          //Internet store
          connectToCloudStore: "connectToCloudStore",
          writeToCloudStore: "writeToCloudStore",
          readFromCloudStore: "readFromCloudStore",
          // IR Remote
          readIRMessage: "readIRMessage",
          sendIRMessage: "sendIRMessage",
          presetIRMessage: "presetIRMessage",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection"
      },
      description: {
          // Descriptions of the functions in Python (optional)
          turnLedOn: "turnLedOn() allume la LED",
          turnLedOff: "turnLedOff() éteint la LED",
          isButtonPressed: "isButtonPressed() retourne True si le bouton est enfoncé, False sinon",
          isButtonPressedWithName: "isButtonPressed(button) retourne True si le bouton est enfoncé, False sinon",
          waitForButton: "waitForButton(button) met en pause l'exécution jusqu'à ce que le bouton soit appuyé",
          buttonWasPressed: "buttonWasPressed(button) indique si le bouton a été appuyé depuis le dernier appel à cette fonction",
          onButtonPressed: "onButtonPressed(button, fonction) appelle la fonction indiquée lorsque le bouton est appuyé",
          setLedState: "setLedState(led, state) modifie l'état de la LED : True pour l'allumer, False pour l'éteindre",
          setLedMatrixOne: "setLedMatrixOne(x, y, state) modifie l'état d'une LED de la matrice",
          toggleLedState: "toggleLedState(led) inverse l'état de la LED",
          displayText: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
          displayText2Lines: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
          readTemperature: "readTemperature(thermometer) retourne la température ambiante",
          sleep: "sleep(milliseconds) met en pause l'exécution pendant une durée en ms",
          setServoAngle: "setServoAngle(servo, angle) change l'angle du servomoteur",
          readRotaryAngle: "readRotaryAngle(potentiometer) retourne la position potentiomètre",
          readDistance: "readDistance(distanceSensor) retourne la distance mesurée",
          readLightIntensity: "readLightIntensity(lightSensor) retourne l'intensité lumineuse",
          readHumidity: "readHumidity(hygrometer) retourne l'humidité ambiante",
          currentTime: "currentTime() temps en millisecondes depuis le début du programme",
          setLedBrightness: "setLedBrightness(led, brightness) règle l'intensité lumineuse de la LED",
          getLedBrightness: "getLedBrightness(led) retourne l'intensité lumineuse de la LED",
          setLedColors: "setLedColors(led, r, g, b) règle la couleur de la LED",
          getServoAngle: "getServoAngle(servo) retourne l'angle du servomoteur",
          isLedOn: "isLedOn() retourne True si la LED est allumée, False si elle est éteinte",
          isLedOnWithName: "isLedOn(led) retourne True si la LED est allumée, False sinon",
          turnBuzzerOn: "turnBuzzerOn() allume le buzzer",
          turnBuzzerOff: "turnBuzzerOff() éteint le buzzer",
          isBuzzerOn: "isBuzzerOn() retourne True si le buzzer est allumé, False sinon",
          isBuzzerOnWithName: "isBuzzerOn(buzzer) retourne True si le buzzer est allumé, False sinon",
          setBuzzerState: "setBuzzerState(buzzer, state) modifie l'état du buzzer: True pour allumé, False sinon",
          setBuzzerNote: "setBuzzerNote(buzzer, frequency) fait sonner le buzzer à la fréquence indiquée",
          getBuzzerNote: "getBuzzerNote(buzzer) retourne la fréquence actuelle du buzzer",
          getTemperatureFromCloud: "getTemperatureFromCloud(town) retourne la température dans la ville donnée",
          drawPoint: "drawPoint(x, y) dessine un point de un pixel aux coordonnées données",
          isPointSet: "isPointSet(x, y) retourne True si le point aux coordonées x, y est actif",
          drawLine: "drawLine(x0, y0, x1, y1) dessine un segment commençant en x0, y0 jusqu'à x1, y1",
          drawRectangle: "drawRectangle(x0, y0, width, height) dessine un rectangle, de coin haut gauche (x0,y0)",
          drawCircle: "drawCircle(x0, y0, diameter) dessine un cercle de centre x0, y0 et de diamètre donné",
          clearScreen: "clearScreen() efface le contenu de l'écran",
          updateScreen: "updateScreen() mettre à jour l'écran",
          autoUpdate: "autoUpdate(auto) change le mode d'actualisation de l'écran",
          fill: "fill(color) Remplir les formes avec la couleur donnée",
          noFill: "noFill() Ne pas remplir les formes",
          stroke: "stroke(color) dessiner les bords des figures avec la couleur donnée",
          noStroke: "noStroke() ne pas dessiner les bordures des figures",
          readAcceleration: "readAcceleration(axis) lit l'accélération en m/s² sur l'axe (X, Y ou Z)",
          computeRotation: "computeRotation(axis) calcule l'angle de rotation en degrés sur l'accéléromètre",
          readSoundLevel: "readSoundLevel(port) retourne le volume ambiant",
          readMagneticForce: "readMagneticForce(axis) retourne le champ magnétique (µT) sur l'axe (X, Y ou Z)",
          computeCompassHeading: "computeCompassHeading() retourne la direction de la boussole en degrés",
          readInfraredState: "readInfraredState(IRReceiver) retourne True si un signal infra-rouge est détecté, False sinon",
          setInfraredState: "setInfraredState(IREmitter, state) modifie l'état de l'émetteur : True pour l'allumer, False pour l'éteindre",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity(axis) retourne la vitesse engulairee (°/s) du gyroscope",
          setGyroZeroAngle: "setGyroZeroAngle() initialize le gyroscope à l'état 0",
          computeRotationGyro: "computeRotationGyro(axis) calcule la rotation du gyroscope en degrés",
          //Internet store
          connectToCloudStore: "connectToCloudStore(identifier, password) se connecter au cloud avec le nom d'utilisateur et le mot de passe donnés",
          writeToCloudStore: "writeToCloudStore(identifier, key, value) écrire une valeur sur une clé dans le cloud",
          readFromCloudStore: "readFromCloudStore(identifier, key) retourne la valeur lue dans le cloud de la clé donnée",
          // IR Remote
          readIRMessage: "readIRMessage(irrec, timeout) attends un message infrarouge pendant le temps donné en millisecondes et le renvois",
          sendIRMessage: "sendIRMessage(irtrans, name) envoi un message infrarouge précédement configurer avec le nom donné",
          presetIRMessage: "presetIRMessage(name, data) configure un message infrarouge de nom name et de donné data",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection(servo, direction)",
          // Galaxia
          "accelerometer.get_x": "accelerometer.get_x() retourne la valeur de l'accélération sur l'axe X",
          "led.set_colors": "led.set_colors(red, green, blue) description",
          "pin.__constructor": "pin = Pin(pinNumber, mode) description",
          "pin.on": "pin.on() description",
          "pin.off": "pin.off() description",
          "pwm.__constructor": "pwm = PWM(pin, freq, duty) description",
          "pwm.duty": "pwm.duty(duty) description",
          "wlan.__constructor": "wlan = WLAN(interface) description",
          "wlan.active": "wlan.active(active) description",
          "wlan.connect": "wlan.connect(ssid, password) description",
          dumps: "dumps(content) description",
          get: "get(url) description",
          post: "post(url, data, headers) description",
          sleep_us: "sleep_us(microseconds) met en pause l'exécution pendant une durée en microsec"
      },
      constant: {},
      startingBlockName: "Programme",
      messages: {
          sensorNotFound: "Accès à un capteur ou actuateur inexistant : {0}.",
          manualTestSuccess: "Test automatique validé.",
          testSuccess: "Bravo ! La sortie est correcte",
          wrongState: "Test échoué : <code>{0}</code> a été dans l'état {1} au lieu de {2} à t={3}ms.",
          wrongStateDrawing: "Test échoué : <code>{0}</code> diffère de {1} pixels par rapport à l'affichage attendu à t={2}ms.",
          wrongStateSensor: "Test échoué : votre programme n'a pas lu l'état de <code>{0}</code> après t={1}ms.",
          programEnded: "Programme terminé.",
          piPlocked: "L'appareil est verrouillé. Déverrouillez ou redémarrez.",
          cantConnect: "Impossible de se connecter à l'appareil.",
          wrongVersion: "Votre Raspberry Pi a une version trop ancienne, mettez le à jour.",
          cardDisconnected: "La carte a été déconnectée.",
          sensorInOnlineMode: "Vous ne pouvez pas agir sur les capteurs en mode connecté.",
          actuatorsWhenRunning: "Impossible de modifier les actionneurs lors de l'exécution d'un programme",
          cantConnectoToUSB: 'Tentative de connexion par USB en cours, veuillez brancher votre Raspberry sur le port USB <i class="fas fa-circle-notch fa-spin"></i>',
          cantConnectoToBT: 'Tentative de connection par Bluetooth, veuillez connecter votre appareil au Raspberry par Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
          canConnectoToUSB: "Connecté en USB.",
          canConnectoToBT: "Connecté en Bluetooth.",
          noPortsAvailable: "Aucun port compatible avec ce {0} n'est disponible (type {1})",
          sensor: "capteur",
          actuator: "actionneur",
          removeConfirmation: "Êtes-vous certain de vouloir retirer ce capteur ou actuateur?",
          remove: "Retirer",
          keep: "Garder",
          minutesago: "Last seen {0} minutes ago",
          hoursago: "Last seen more than one hour ago",
          drawing: "dessin",
          timeLabel: "Temps",
          seconds: "secondes",
          changeBoard: "Changer de carte",
          connect: "Connecter",
          install: "Installer",
          config: "Config",
          remoteControl: "Contrôle à distance",
          simulator: "Simulateur",
          raspiConfig: "Configuration de la carte",
          local: "Local",
          schoolKey: "Indiquez un identifiant d'école",
          connectList: "Sélectionnez un appareil à connecter dans la liste suivante",
          enterIpAddress: "ou entrez son adesse IP",
          getPiList: "Obtenir la liste",
          connectTroughtTunnel: "Connecter à travers le France-ioi tunnel",
          connectToLocalhost: "Connecter l'interface à la machine sur laquelle tourne ce navigateur",
          connectToWindowLocation: "Connecter à la carte depuis lequel cette page est chargée",
          connectToDevice: "Connecter l'appareil",
          disconnectFromDevice: "Déconnecter",
          removeSensor: "Supprimer",
          irReceiverTitle: "Recevoir des codes infrarouges",
          directIrControl: "Dirigez votre télécommande vers votre carte QuickPi et appuyez sur un des boutons",
          getIrCode: "Recevoir un code",
          closeDialog: "Fermer",
          irRemoteControl: "Télécommande IR",
          noIrPresets: "Veuillez utiliser la fonction de préparation de messages IR pour ajouter des commandes de télécommande",
          irEnableContinous: "Activer l'émission IR en continu",
          irDisableContinous: "Désactiver l'émission IR en continu",
          connectToLocalHost: "Connecter l'interface à la machine sur laquelle tourne ce navigateur",
          up: "up",
          down: "down",
          left: "left",
          right: "right",
          center: "center",
          on: "On",
          off: "Off",
          grovehat: "Grove Base Hat for Raspberry Pi",
          quickpihat: "France IOI QuickPi Hat",
          pinohat: "Raspberry Pi without hat",
          led: "LED",
          ledrgb: "LED RGB",
          leddim: "LED variable",
          blueled: "LED bleue",
          greenled: "LED verte",
          orangeled: "LED orange",
          redled: "LED rouge",
          buzzer: "Buzzer",
          grovebuzzer: "Grove Buzzer",
          quickpibuzzer: "Quick Pi Passive Buzzer",
          servo: "Servo Motor",
          screen: "Screen",
          grove16x2lcd: "Grove 16x2 LCD",
          oled128x32: "128x32 Oled Screen",
          irtrans: "IR Transmiter",
          button: "Button",
          wifi: "Wi-Fi",
          fivewaybutton: "5 way button",
          tempsensor: "Temperature sensor",
          groveanalogtempsensor: "Grove Analog tempeature sensor",
          quickpigyrotempsensor: "Quick Pi Accelerometer+Gyroscope temperature sensor",
          dht11tempsensor: "DHT11 Tempeature Sensor",
          potentiometer: "Potentiometer",
          lightsensor: "Light sensor",
          distancesensor: "Capteur de distance",
          timeofflightranger: "Time of flight distance sensor",
          ultrasonicranger: "Capteur de distance à ultrason",
          humiditysensor: "Humidity sensor",
          soundsensor: "Sound sensor",
          accelerometerbmi160: "Accelerometer sensor (BMI160)",
          gyrobmi160: "Gyropscope sensor (BMI160)",
          maglsm303c: "Magnetometer sensor (LSM303C)",
          irreceiver: "IR Receiver",
          cloudstore: "Cloud Store",
          addcomponent: "Ajouter un composant",
          selectcomponent: "Sélectionnez un composant à ajouter à votre carte et attachez-le à un port.",
          add: "Ajouter",
          builtin: "(builtin)",
          chooseBoard: "Choisissez votre carte",
          nameandports: "Noms et ports des capteurs et actionneurs QuickPi",
          name: "Name",
          port: "Port",
          state: "State",
          cloudTypes: {
              object: "Dictionnaire",
              array: "Tableau",
              boolean: "Booléen",
              number: "Nombre",
              string: "Chaîne de caractère"
          },
          cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.",
          cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud",
          cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud",
          cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}",
          cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.",
          cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu",
          cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.",
          cloudKeyNotExists: "La clé n'existe pas : {0} ",
          cloudWrongValue: "Clé {0} : la valeur {2} n'est pas celle attendue, {1}.",
          cloudUnexpectedKey: "La clé {0} n'est pas une clé attendue",
          hello: "Bonjour",
          getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} n'est pas une ville supportée par getTemperatureFromCloud",
          wifiNotActive: "Le Wi-Fi n'est pas activé. Activez le Wi-Fi pour faire cette opération.",
          wifiSsid: "SSID :",
          wifiPassword: "Mot de passe :",
          wifiEnable: "Activer",
          wifiDisable: "Désactiver",
          wifiConnect: "Connecter",
          wifiDisconnect: "Déconnecter",
          wifiStatusDisabled: "Désactivé",
          wifiStatusDisconnected: "Déconnecté",
          wifiStatusConnected: "Connecté",
          wifiStatus: "Statut :",
          wifiHeaders: "En-têtes :",
          wifiBody: "Contenu :",
          wifiWrongCredentials: "Test échoué : <code>{0}</code> a essayé de se connecter avec les identifiants \"{1}\" au lieu de \"{2}\" à t={3}ms.",
          wifiNoRequest: "Test échoué : <code>{0}</code> n'a pas effectué de requête à t={1}ms.",
          wifiWrongMethod: "Test échoué : <code>{0}</code> a effectué une requête avec la méthode \"{1}\" à t={3}ms, la méthode attendue était \"{2}\".",
          wifiWrongUrl: "Test échoué : <code>{0}</code> a effectué une requête à l'URL \"{1}\" à t={3}ms, l'URL attendue était \"{2}\".",
          wifiWrongHeader: "Test échoué : <code>{0}</code> a effectué une requête avec le header \"{1}\" valant \"{2}\" à t={4}ms, la valeur attendue était \"{3}\".",
          wifiWrongBody: "Test échoué : <code>{0}</code> a effectué une requête avec le paramètre \"{1}\" valant \"{2}\" à t={4}ms, la valeur attendue était \"{3}\".",
          wifiUnknownError: "Test échoué : <code>{0}</code> a été dans un état incorrect à t={1}ms.",
          insteadOf: "au lieu de",
          wifiNoRequestShort: "pas de requête",
          networkRequestFailed: "La requête à la page {0} a échoué.",
          networkResponseInvalidJson: "Cette réponse n'est pas au format JSON.",
          experiment: "Expérimenter",
          validate: "Valider",
          validate1: "Valider 1",
          validate2: "Valider 2",
          validate3: "Valider 3",
          cancel: "Annuler",
          areYouSure: "Vous êtes sûr ?",
          yes: "Oui",
          no: "Non",
          // sensorNameBuzzer: "buzzer",
          sensorNameBuzzer: "buzz",
          sensorNameLed: "led",
          sensorNameLedRgb: "ledRgb",
          sensorNameLedDim: "ledDim",
          // sensorNameRedLed: "redled",
          sensorNameRedLed: "Rled",
          // sensorNameGreenLed: "greenled",
          sensorNameGreenLed: "Gled",
          // sensorNameBlueLed: "blueled",
          sensorNameBlueLed: "Bled",
          // sensorNameOrangeLed: "orangeled",
          sensorNameOrangeLed: "Oled",
          sensorNameScreen: "screen",
          sensorNameIrTrans: "irtran",
          sensorNameIrRecv: "irrec",
          sensorNameMicrophone: "micro",
          sensorNameTemperature: "temp",
          sensorNameGyroscope: "gyroscope",
          sensorNameMagnetometer: "magneto",
          // sensorNameDistance: "distance",
          sensorNameDistance: "dist",
          sensorNameAccelerometer: "accel",
          // sensorNameButton: "button",
          sensorNameButton: "but",
          sensorNameLight: "light",
          sensorNameStick: "stick",
          sensorNameServo: "servo",
          sensorNameHumidity: "humidity",
          sensorNamePotentiometer: "pot",
          sensorNameCloudStore: "cloud",
          sensorNameWifi: "wifi",
          selectOption: "Sélectionnez une rubrique…",
          components: "Composants",
          connection: "Connexion",
          display: "Affichage",
          displayPrompt: "Afficher par nom de composant ou nom de port ?",
          componentNames: "Nom de composant",
          portNames: "Nom de port"
      },
      concepts: {
          quickpi_start: 'Créer un programme',
          quickpi_validation: 'Valider son programme',
          quickpi_buzzer: 'Buzzer',
          quickpi_led: 'LEDs',
          quickpi_button: 'Boutons et manette',
          quickpi_screen: 'Écran',
          quickpi_draw: 'Dessiner',
          quickpi_range: 'Capteur de distance',
          quickpi_servo: 'Servomoteur',
          quickpi_thermometer: 'Thermomètre',
          quickpi_microphone: 'Microphone',
          quickpi_light_sensor: 'Capteur de luminosité',
          quickpi_accelerometer: 'Accéléromètre',
          quickpi_wait: 'Gestion du temps',
          quickpi_magneto: 'Magnétomètre',
          quickpi_ir_receiver: 'Récepteur infrarouge',
          quickpi_ir_emitter: 'Émetteur infrarouge',
          quickpi_potentiometer: "Potentiomètre",
          quickpi_gyroscope: "Gyroscope",
          quickpi_cloud: 'Stockage dans le cloud'
      }
  };

  var langEs = {
      label: {
          // Labels for the blocks
          sleep: "esperar %1 milisegundos",
          currentTime: "tiempo transcurrido en milisegundos",
          turnLedOn: "encender el LED",
          turnLedOff: "apagar el LED",
          setLedState: "cambiar el LED %1 a %2 ",
          toggleLedState: "invertir el estado del LED %1",
          isLedOn: "LED encendido",
          isLedOnWithName: "LED %1 encendido",
          setLedBrightness: "Cambiar el brillo de %1 a %2",
          getLedBrightness: "Obtener el brillo de %1",
          turnBuzzerOn: "encender el zumbador",
          turnBuzzerOff: "apagar el zumbador",
          setBuzzerState: "cambiar el zumbador %1 a %2",
          isBuzzerOn: "zumbador encendido",
          isBuzzerOnWithName: "zumbador %1 encendido",
          setBuzzerNote: "frequencia de reproducción %2Hz en %1",
          getBuzzerNote: "frequncia del zumbador %1",
          isButtonPressed: "botón presionado",
          isButtonPressedWithName: "botón  %1 presionado",
          waitForButton: "esperar a que se presione un botón",
          buttonWasPressed: "el botón ha sido presionado",
          displayText: "desplegar texto %1",
          displayText2Lines: "desplegar texto Linea 1 : %1 Linea 2 : %2",
          readTemperature: "temperatura ambiente",
          getTemperatureFromCloud: "temperatura de la ciudad %1",
          readRotaryAngle: "estado del potenciómetro %1",
          readDistance: "distancia medida por %1",
          readLightIntensity: "intensidad de luz",
          readHumidity: "humedad ambiental",
          setServoAngle: "cambiar el ángulo de el servo %1 a %2°",
          getServoAngle: "ángulo del servo %1",
          drawPoint: "dibuja un pixel",
          isPointSet: "este pixel esta dibujado",
          drawLine: "linea desde x₀: %1 y₀: %2 hasta x₁: %3 y₁: %4",
          drawRectangle: "rectángulo  x: %1 y: %2 largo: %3 alto: %4",
          drawCircle: "circulo x₀: %1 y₀: %2 diametro: %3",
          clearScreen: "limpiar toda la pantalla",
          updateScreen: "actualizar pantalla",
          autoUpdate: "modo de actualización de pantalla automática",
          fill: "establecer el color de fondo en %1",
          noFill: "no rellenar figuras",
          stroke: "color de los bordes %1",
          noStroke: "no dibujar los contornos",
          readAcceleration: "aceleración en m/s² en el eje %1",
          computeRotation: "cálculo del ángulo de rotación (°) en el acelerómetro %1",
          readSoundLevel: "volumen de sonido",
          readMagneticForce: "campo magnético (µT) en %1",
          computeCompassHeading: "dirección de la brújula en (°)",
          readInfraredState: "infrarrojos detectados en %1",
          setInfraredState: "cambiar emisor de infrarrojos %1 a %2",
          // Gyroscope
          readAngularVelocity: "velocidad angular (°/s) del guroscopio %1",
          setGyroZeroAngle: "inicializar el giroscopio a estado cero",
          computeRotationGyro: "calcular la rotación del giroscopio %1",
          //Internet store
          connectToCloudStore: "conectar a la nube. Usuario %1 Contraseña %2",
          writeToCloudStore: "escribir en la nube : Usuario %1 llave %2 valor %3",
          readFromCloudStore: "leer de la nube : Usuario %1 lave %2",
          // IR Remote
          readIRMessage: "esperar un mensaje de infrarrojos : %1 durante : %2 ms",
          sendIRMessage: "enviar el mensaje por infrarrojos %2 por %1",
          presetIRMessage: "preparar un mensaje de infrarrojos con el nombre %1 y el contenido %2",
          //Continous servo
          setContinousServoDirection: "cambiar la dirección del servomotor continuo %1 %2"
      },
      code: {
          // Names of the functions in Python, or Blockly translated in JavaScript
          turnLedOn: "turnLedOn",
          turnLedOff: "turnLedOff",
          setLedState: "setLedState",
          isButtonPressed: "isButtonPressed",
          isButtonPressedWithName: "isButtonPressed",
          waitForButton: "waitForButton",
          buttonWasPressed: "buttonWasPressed",
          toggleLedState: "toggleLedState",
          displayText: "displayText",
          displayText2Lines: "displayText",
          readTemperature: "readTemperature",
          sleep: "sleep",
          setServoAngle: "setServoAngle",
          readRotaryAngle: "readRotaryAngle",
          readDistance: "readDistance",
          readLightIntensity: "readLightIntensity",
          readHumidity: "readHumidity",
          currentTime: "currentTime",
          getTemperatureFromCloud: "getTemperatureFromCloud",
          isLedOn: "isLedOn",
          isLedOnWithName: "isLedOn",
          setBuzzerNote: "setBuzzerNote",
          getBuzzerNote: "getBuzzerNote",
          setLedBrightness: "setLedBrightness",
          getLedBrightness: "getLedBrightness",
          getServoAngle: "getServoAngle",
          setBuzzerState: "setBuzzerState",
          turnBuzzerOn: "turnBuzzerOn",
          turnBuzzerOff: "turnBuzzerOff",
          isBuzzerOn: "isBuzzerOn",
          isBuzzerOnWithName: "isBuzzerOn",
          drawPoint: "drawPoint",
          isPointSet: "isPointSet",
          drawLine: "drawLine",
          drawRectangle: "drawRectangle",
          drawCircle: "drawCircle",
          clearScreen: "clearScreen",
          updateScreen: "updateScreen",
          autoUpdate: "autoUpdate",
          fill: "fill",
          noFill: "noFill",
          stroke: "stroke",
          noStroke: "noStroke",
          readAcceleration: "readAcceleration",
          computeRotation: "computeRotation",
          readSoundLevel: "readSoundLevel",
          readMagneticForce: "readMagneticForce",
          computeCompassHeading: "computeCompassHeading",
          readInfraredState: "readInfraredState",
          setInfraredState: "setInfraredState",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity",
          setGyroZeroAngle: "setGyroZeroAngle",
          computeRotationGyro: "computeRotationGyro",
          //Internet store
          connectToCloudStore: "connectToCloudStore",
          writeToCloudStore: "writeToCloudStore",
          readFromCloudStore: "readFromCloudStore",
          // IR Remote
          readIRMessage: "readIRMessage",
          sendIRMessage: "sendIRMessage",
          presetIRMessage: "presetIRMessage",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection"
      },
      description: {
          // Descriptions of the functions in Python (optional)
          turnLedOn: "turnLedOn() enciende el LED",
          turnLedOff: "turnLedOff() apaga el led LED",
          isButtonPressed: "isButtonPressed() devuelve True si el boton esta presionado, False de otra manera",
          isButtonPressedWithName: "isButtonPressed(button) devuelve True si el boton esta presionado, False de otra manera",
          waitForButton: "waitForButton(button) pausa la ejecución hasta que se presiona el botón",
          buttonWasPressed: "buttonWasPressed(button) indica si se ha pulsado el botón desde la última llamada a esta función",
          setLedState: "setLedState(led, state) modifica el estado del LED: True para encenderlo, False para apagarlo",
          toggleLedState: "toggleLedState(led) invierte el estado del LED",
          displayText: "displayText(line1, line2) muestra una o dos líneas de texto. line2 es opcional",
          displayText2Lines: "displayText(line1, line2) muestra una o dos líneas de texto. line2 es opcional",
          readTemperature: "readTemperature(thermometer) devuelve la temperatura ambiente",
          sleep: "sleep(milliseconds) pausa la ejecución por un tiempo en milisegundos",
          setServoAngle: "setServoAngle(servo, angle) cambiar el ángulo del servomotor",
          readRotaryAngle: "readRotaryAngle(potentiometer) devuelve la posición del potenciómetro",
          readDistance: "readDistance(distanceSensor) devuelve la distancia medida",
          readLightIntensity: "readLightIntensity(lightSensor) devuelve la intensidad de la luz",
          readHumidity: "readHumidity(hygrometer) devuelve la humedad ambiental",
          currentTime: "currentTime() tiempo en milisegundos desde el inicio del programa",
          setLedBrightness: "setLedBrightness(led, brightness) ajusta la intensidad de la luz del LED",
          getLedBrightness: "getLedBrightness(led) devuelve la intensidad de luz del LED",
          getServoAngle: "getServoAngle(servo) devuelve el ángulo del servomotor",
          isLedOn: "isLedOn() devuelve True si el LED está encendido, False si está apagado",
          isLedOnWithName: "isLedOn(led) devuelve True si el LED está encendido, False si está apagado",
          turnBuzzerOn: "turnBuzzerOn() enciende el zumbador",
          turnBuzzerOff: "turnBuzzerOff() apaga el zumbador",
          isBuzzerOn: "isBuzzerOn() devuelve True si el zumbador está encendido, False si está apagado",
          isBuzzerOnWithName: "isBuzzerOn(buzzer) devuelve True si el zumbador está encendido, False si está apagado",
          setBuzzerState: "setBuzzerState(buzzer, state) modifica el estado del zumbador: Verdadero para encendido, Falso para apagado",
          setBuzzerNote: "setBuzzerNote(buzzer, frequency) suena el zumbador en la frecuencia indicada",
          getBuzzerNote: "getBuzzerNote(buzzer) devuelve la frecuencia actual del zumbador",
          getTemperatureFromCloud: "getTemperatureFromCloud(town) obtiene la temperatura de la ciudad",
          drawPoint: "drawPoint(x, y) dibuja un punto en las coordenadas x, y",
          isPointSet: "isPointSet(x, y) devuelve True se dibujó sobre el punto x, y, False de lo contrario",
          drawLine: "drawLine(x0, y0, x1, y1) dibuja una linea empezando desde el punto x0, x1, hasta el punto x1, y1",
          drawRectangle: "drawRectangle(x0, y0, width, height) dibuja un rectángulo empezando en el punto x0, y0 con el ancho y altura dados",
          drawCircle: "drawCircle(x0, y0, diameter) dibuja un circulo con centro en x0, y0 y el diametro dado",
          clearScreen: "clearScreen() limpia toda la pantalla",
          updateScreen: "updateScreen() actualiza los contenidos de la pantalla",
          autoUpdate: "autoUpdate(auto) cambia el modo de actualización de pantalla automatica",
          fill: "fill(color) rellenar las figuras con el color dado",
          noFill: "noFill() no rellenar las figuras",
          stroke: "stroke(color) dibujar los bordes de las figuras con el color dado",
          noStroke: "noStroke() no dibujar los bordes de las figuras",
          readAcceleration: "readAcceleration(axis) leer la acceleración (m/s²) en el eje (X, Y o Z)",
          computeRotation: "computeRotation(axis) calcular el ángulo de rotación (°) en el acelerómetro",
          readSoundLevel: "readSoundLevel(port) devuelve el volumen del sonido ambiente",
          readMagneticForce: "readMagneticForce(axis) devuelve el campo magnético (µT) en el eje (X, Y o Z)",
          computeCompassHeading: "computeCompassHeading() devuelve la dirección de la brujula en grados",
          readInfraredState: "readInfraredState() devuelve True si se detecta una señal infrarroja, Falso de otra manera",
          setInfraredState: "setInfraredState(state) si se le pasa True enciende el transmisor infrarrojo, Falso lo apaga",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity(axis) devuelve la velocidad angular (°/s) del gyroscopio",
          setGyroZeroAngle: "setGyroZeroAngle() inicializa el giroscopio a estado cero",
          computeRotationGyro: "computeRotationGyro(axis) calcula la rotación del giroscopio (°)",
          //Internet store
          connectToCloudStore: "connectToCloudStore(identifier, password) se conecta a la nube con el usuario y password dados",
          writeToCloudStore: "writeToCloudStore(identifier, key, value) escribe un valor a un llave en la nube",
          readFromCloudStore: "readFromCloudStore(identifier, key) devuelve un valor leido de la nube de la llave dada",
          // IR Remote
          readIRMessage: "readIRMessage(irrec, timeout) espera por un mensaje infrarrojo y lo devuelve durante el tiempo dado en milisegundos",
          sendIRMessage: "sendIRMessage(irtrans, name) envia un mensaje infrarrojo previamente configurado con el nombre dado",
          presetIRMessage: "presetIRMessage(name, data) configura un mensaje infrarrojo con el nombre y datos dados",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection(servo, direction) cambia la dirección de un servomotor"
      },
      constant: {},
      startingBlockName: "Programa",
      messages: {
          sensorNotFound: "Acceso a un componente inexistente: {0}.",
          manualTestSuccess: "Prueba automática validada.",
          testSuccess: "Bien hecho! El resultado es correcto",
          wrongState: "Prueba fallida: <code>{0}</code> estaba en etado {1} en lugar de {2} en t={3}ms.",
          wrongStateDrawing: "Prueba fallida: <code>{0}</code> difiere en {1} píxeles de la visualización esperada en t = {2} ms.",
          wrongStateSensor: "Prueba fallida: su programa no leyó el estado de <code>{0}</code> después de t = {1} ms.",
          programEnded: "Programa completado.",
          piPlocked: "El dispositivo está bloqueado. Desbloquear o reiniciar.",
          cantConnect: "No puede conectarse al dispositivo.",
          wrongVersion: "El software en tu Raspberry Pi es demasiado antiguo, actualízalo.",
          cardDisconnected: "La tarjeta ha sido desconectada.",
          sensorInOnlineMode: "No se pueden modificar sensores en modo conectado.",
          actuatorsWhenRunning: "No se pueden cambiar los actuadores mientras se ejecuta un programa",
          cantConnectoToUSB: 'Intentado conectarse por USB, conecta tu Raspberry Pi al puerto USB <i class="fas fa-circle-notch fa-spin"></i>',
          cantConnectoToBT: 'Intentando conectarse por Bluetooth, conecta tu Raspberry Pi por Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
          canConnectoToUSB: "USB Conectado.",
          canConnectoToBT: "Bluetooth Conectado.",
          noPortsAvailable: "No hay ningún puerto compatible con {0} disponible (type {1})",
          sensor: "Sensor",
          actuator: "Actuador",
          removeConfirmation: "¿Estás seguro de que deseas quitar este componente?",
          remove: "Eliminar",
          keep: "Mantener",
          minutesago: "Visto por última vez hace {0} minutos",
          hoursago: "Visto por ultima vez hace mas de una hora",
          drawing: "dibujando",
          timeLabel: "Tiempo",
          seconds: "segundos",
          changeBoard: "Cambiar tablero",
          connect: "Conectar",
          install: "Instalar",
          config: "Configuración",
          raspiConfig: "Configuración de tu tablero",
          local: "Local",
          schoolKey: "Ingresa una identificación de la escuela",
          connectList: "Selecciona un dispositivo para conectarte de la siguiente lista",
          enterIpAddress: "o ingresa una dirección IP",
          getPiList: "Obtener la lista",
          connectTroughtTunnel: "Conéctate a través del túnel de France-ioi",
          connectToLocalhost: "Conectarse al dispositivo que ejecuta este navegador",
          connectToWindowLocation: "Conéctate al tablero desde la que se carga esta página",
          connectToDevice: "Conectar al dispositivo",
          disconnectFromDevice: "Desconectar",
          irReceiverTitle: "Recibir códigos infrarrojos",
          directIrControl: "Apunta tu control remoto a tu tablero QuickPi y presiona uno de los botones",
          getIrCode: "Recibir un código",
          closeDialog: "Cerrar",
          irRemoteControl: "Control remoto Infrarrojo",
          noIrPresets: "Utiliza la función de preparación de mensajes IR para agregar comandos de control remoto",
          irEnableContinous: "Activar la emisión IR continua",
          irDisableContinous: "Desactivar la emisión IR continua",
          getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} is not a town supported by getTemperatureFromCloud",
          wifiNotActive: "El wifi no está activado. Active Wi-Fi para hacer esto.",
          wifiSsid: "SSID:",
          wifiPassword: "Contraseña:",
          wifiEnable: "Activar",
          wifiDisable: "Desactivar",
          wifiConnect: "Conectar",
          wifiDisconnect: "Desconectar",
          wifiStatusDisabled: "Desactivado",
          wifiStatusDisconnected: "Desconectado",
          wifiStatusConnected: "Conectado",
          wifiStatus: "Estado:",
          networkRequestFailed: "Error en la solicitud a la página {0}.",
          networkResponseInvalidJson: "Esta respuesta no está en formato JSON.",
          up: "arriba",
          down: "abajo",
          left: "izquierda",
          right: "derecha",
          center: "centro",
          on: "Encendido",
          off: "Apagado",
          grovehat: "Sombrero Grove para Raspberry Pi",
          quickpihat: "Sobrero QuickPi de France IOI",
          pinohat: "Raspberry Pi sin sombrero",
          led: "LED",
          ledrgb: "LED RGB",
          leddim: "LED regulable",
          blueled: "LED azul",
          greenled: "LED verde",
          orangeled: "LED naranja",
          redled: "LED rojo",
          buzzer: "Zumbador",
          grovebuzzer: "Zumbador Grove",
          quickpibuzzer: "Zumbador passive de QuickPi",
          servo: "Motor Servo",
          screen: "Pantalla",
          grove16x2lcd: "Pantalla Grove 16x2",
          oled128x32: "Pantalla 128x32 Oled",
          irtrans: "Transmisor de infrarrojos",
          button: "Botón",
          wifi: "Wi-Fi",
          fivewaybutton: "Botón de 5 direcciones",
          tempsensor: "Sensor de temperatura",
          groveanalogtempsensor: "Sensor de temperatura analógico Grove",
          quickpigyrotempsensor: "Sensor de temperaturea en el Acelerometro y Gyroscopio de QuickPi",
          dht11tempsensor: "Sensor de Temperatura DHT11",
          potentiometer: "Potenciómetro",
          lightsensor: "Sensor de luz",
          distancesensor: "Sensor de distancia",
          timeofflightranger: "Sensor de distancia por rebote de luz",
          ultrasonicranger: "Sensor de distancia por últrasonido",
          humiditysensor: "Sensor de humedad",
          soundsensor: "Sensor de sonido",
          accelerometerbmi160: "Acelerómetro (BMI160)",
          gyrobmi160: "Giroscopio (BMI160)",
          maglsm303c: "Magnetómetro (LSM303C)",
          irreceiver: "Receptor de infrarrojos",
          cloudstore: "Almacenamiento en la nube",
          addcomponent: "Agregar componente",
          selectcomponent: "Selecciona un componente para agregar a tu tablero y conéctalo a un puerto.",
          add: "Agregar",
          builtin: "(incorporado)",
          chooseBoard: "Elije tu tablero",
          nameandports: "Nombres y puertos de sensores y actuadores QuickPi",
          name: "Nombre",
          port: "Puerto",
          state: "Estado",
          cloudTypes: {
              object: "Dictionario",
              array: "Arreglo",
              boolean: "Booleano",
              number: "Nombre",
              string: "Cadena de caracteres"
          },
          cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.",
          cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud",
          cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud",
          cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}",
          cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.",
          cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu",
          cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.",
          cloudKeyNotExists: "La llave no existe : {0} ",
          cloudWrongValue: "Llave {0}: el valor {2} no es el esperado, {1}.",
          cloudUnexpectedKey: "La llave {0} no es una llave esperada",
          hello: "Hola",
          experiment: "Experimentar",
          validate: "Validar",
          validate1: "Validar 1",
          validate2: "Validar 2",
          validate3: "Validar 3",
          // sensorNameBuzzer: "timbre",
          sensorNameBuzzer: "tim",
          sensorNameLed: "led",
          sensorNameLedRgb: "ledRgb",
          sensorNameLedDim: "ledDim",
          sensorNameRedLed: "ledrojo",
          sensorNameGreenLed: "ledverde",
          sensorNameBlueLed: "ledazul",
          sensorNameScreen: "pantalla",
          sensorNameIrTrans: "tranir",
          sensorNameIrRecv: "recir",
          sensorNameMicrophone: "micro",
          sensorNameTemperature: "temp",
          sensorNameGyroscope: "gyro",
          sensorNameMagnetometer: "magneto",
          // sensorNameDistance: "distancia",
          sensorNameDistance: "dist",
          sensorNameAccelerometer: "acel",
          sensorNameButton: "boton",
          sensorNameLight: "luz",
          sensorNameStick: "stick",
          sensorNameServo: "servo",
          sensorNameHumidity: "humedad",
          sensorNamePotentiometer: "pot",
          sensorNameCloudStore: "nube",
          sensorNameWifi: "wifi"
      },
      concepts: {
          quickpi_start: 'Crea tu primer programa y ejecútalo',
          quickpi_validation: 'Prueba y valida tus programas',
          quickpi_buzzer: 'Zumbador',
          quickpi_led: 'LEDs o diodos electroluminiscentes',
          quickpi_button: 'Botón',
          quickpi_screen: 'Pantalla',
          quickpi_draw: 'Dibujar sobre la pantalla',
          quickpi_range: 'Sensor de distancia',
          quickpi_servo: 'Servo motor',
          quickpi_thermometer: 'Termómetro',
          quickpi_microphone: 'Micrófono',
          quickpi_light_sensor: 'Sensor de luz',
          quickpi_accelerometer: 'Acelerómetro',
          quickpi_wait: 'Gestión del tiempo',
          quickpi_magneto: 'Magnetómetro',
          quickpi_ir_receiver: 'Receptor de infrarrojos',
          quickpi_ir_emitter: 'Emisor de infrarrojos',
          quickpi_potentiometer: "Potenciómetro",
          quickpi_gyroscope: "giroscopio",
          quickpi_cloud: 'Almacenamiento en la nube'
      }
  };

  var langIt = {
      label: {
          // Labels for the blocks
          sleep: "attendi %1 millisecondei",
          currentTime: "tempo calcolato in millisecondi",
          turnLedOn: "accendi il LED",
          turnLedOff: "spegni il LED",
          setLedState: "passa il LED da %1 a %2 ",
          toggleLedState: "inverti il LED %1",
          isLedOn: "LED acceso",
          isLedOnWithName: "LED %1 acceso",
          setLedBrightness: "imposta la luminosità da %1 a %2",
          getLedBrightness: "leggi la luminosità di %1",
          turnBuzzerOn: "accendi il cicalino",
          turnBuzzerOff: "spegni il cicalino",
          setBuzzerState: "imposta il cicalino %1 a %2",
          isBuzzerOn: "cicalino acceso",
          isBuzzerOnWithName: "cicalino %1 acceso",
          setBuzzerNote: "suona la frequenza %2Hz su %1",
          getBuzzerNote: "frequenza del cicalino %1",
          isButtonPressed: "pulsante premuto",
          isButtonPressedWithName: "pulsante %1 premuto",
          waitForButton: "attendi una pressione sul pulsante",
          buttonWasPressed: "il pulsante è stato premuto",
          displayText: "mostra %1",
          displayText2Lines: "mostra Riga 1 : %1 Riga 2 : %2",
          readTemperature: "temperatura ambiente",
          getTemperatureFromCloud: "temperatura della cità %1",
          readRotaryAngle: "stato del potenziometro %1",
          readDistance: "distanza misurata all'%1",
          readLightIntensity: "intensità luminosa",
          readHumidity: "umidità ambiente",
          setServoAngle: "metti il servomotore %1 all'angolo %2",
          getServoAngle: "angolo del servomotore %1",
          setContinousServoDirection: "imposta la direzione continua del servo %1 %2",
          drawPoint: "draw pixel",
          isPointSet: "is pixel set in screen",
          drawLine: "riga x₀: %1 y₀: %2 x₁: %3 y₁: %4",
          drawRectangle: "rettangolo x₀: %1 y₀: %2 larghezza₀: %3 altezza₀: %4",
          drawCircle: "cerchio x₀: %1 y₀: %2 diametro₀: %3",
          clearScreen: "cancella tutta la schermata",
          updateScreen: "aggiorna schermata",
          autoUpdate: "aggiornamento automatico della schermata",
          fill: "metti il colore di fondo a %1",
          noFill: "non riempire le forme",
          stroke: "impostare il colore del percorso a %1",
          noStroke: "non disegnare i contorni",
          readAcceleration: "accelerazione in (m/s²) nell'asse %1",
          computeRotation: "calcolo dell'angolo di rotazione (°) sull'accelerometro %1",
          readSoundLevel: "volume sonoro",
          readMagneticForce: "campo magnetico (µT) su %1",
          computeCompassHeading: "direzione della bussola in (°)",
          readInfraredState: "infrarosso rilevato su %1",
          setInfraredState: "imposta il trasmettitore a infrarossi %1 a %2",
          // Gyroscope
          readAngularVelocity: "velocità angolare (°/s) del giroscopio %1",
          setGyroZeroAngle: "inizializza il giroscopio allo stato zero",
          computeRotationGyro: "calcola la rotazione del giroscopio %1",
          //Internet store
          connectToCloudStore: "connettersi al cloud. Nome utente %1 Password %2",
          writeToCloudStore: "scrivi nel cloud : id %1 chiave %2 valore %3",
          readFromCloudStore: "leggi nel cloud : id %1 chiave %2",
          // IR Remote
          readIRMessage: "attendi un messaggio IR nome : %1 per : %2 ms",
          sendIRMessage: "invio del messaggio prepato IR nominato %2 su %1",
          presetIRMessage: "prepara un messaggio IR con il nome %1 e contenuto %2"
      },
      code: {
          // Names of the functions in Python, or Blockly translated in JavaScript
          turnLedOn: "turnLedOn",
          turnLedOff: "turnLedOff",
          setLedState: "setLedState",
          setLedMatrixOne: "setLedMatrixOne",
          isButtonPressed: "isButtonPressed",
          isButtonPressedWithName: "isButtonPressed",
          waitForButton: "waitForButton",
          buttonWasPressed: "buttonWasPressed",
          toggleLedState: "toggleLedState",
          displayText: "displayText",
          displayText2Lines: "displayText",
          readTemperature: "readTemperature",
          sleep: "sleep",
          setServoAngle: "setServoAngle",
          readRotaryAngle: "readRotaryAngle",
          readDistance: "readDistance",
          readLightIntensity: "readLightIntensity",
          readHumidity: "readHumidity",
          currentTime: "currentTime",
          getTemperatureFromCloud: "getTemperatureFromCloud",
          isLedOn: "isLedOn",
          isLedOnWithName: "isLedOn",
          setBuzzerNote: "setBuzzerNote",
          getBuzzerNote: "getBuzzerNote",
          setLedBrightness: "setLedBrightness",
          getLedBrightness: "getLedBrightness",
          getServoAngle: "getServoAngle",
          setBuzzerState: "setBuzzerState",
          turnBuzzerOn: "turnBuzzerOn",
          turnBuzzerOff: "turnBuzzerOff",
          isBuzzerOn: "isBuzzerOn",
          isBuzzerOnWithName: "isBuzzerOn",
          drawPoint: "drawPoint",
          isPointSet: "isPointSet",
          drawLine: "drawLine",
          drawRectangle: "drawRectangle",
          drawCircle: "drawCircle",
          clearScreen: "clearScreen",
          updateScreen: "updateScreen",
          autoUpdate: "autoUpdate",
          fill: "fill",
          noFill: "noFill",
          stroke: "stroke",
          noStroke: "noStroke",
          readAcceleration: "readAcceleration",
          computeRotation: "computeRotation",
          readSoundLevel: "readSoundLevel",
          readMagneticForce: "readMagneticForce",
          computeCompassHeading: "computeCompassHeading",
          readInfraredState: "readInfraredState",
          setInfraredState: "setInfraredState",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity",
          setGyroZeroAngle: "setGyroZeroAngle",
          computeRotationGyro: "computeRotationGyro",
          //Internet store
          connectToCloudStore: "connectToCloudStore",
          writeToCloudStore: "writeToCloudStore",
          readFromCloudStore: "readFromCloudStore",
          // IR Remote
          readIRMessage: "readIRMessage",
          sendIRMessage: "sendIRMessage",
          presetIRMessage: "presetIRMessage",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection"
      },
      description: {
          // Descriptions of the functions in Python (optional)
          turnLedOn: "turnLedOn() accendi il LED",
          turnLedOff: "turnLedOff() spegni il LED",
          isButtonPressed: "isButtonPressed() riporta True se il pulsante è premuto, False nel caso contrario",
          isButtonPressedWithName: "isButtonPressed(button) riporta True se il pulsante è premuto, False se non lo è",
          waitForButton: "waitForButton(button) sospende l'esecuzione fino a quando non viene premuto il pulsante",
          buttonWasPressed: "buttonWasPressed(button) indica se il tasto è stato premuto dall'ultima volta che questa funzione è stata utilizzata.",
          setLedState: "setLedState(led, state) modifica lo stato del LED : True per accenderlo, False per spegnerlo",
          toggleLedState: "toggleLedState(led) inverte lo stato del LED",
          displayText: "displayText(line1, line2) mostra una o due righe di testo. La line2 è opzionale",
          displayText2Lines: "displayText(line1, line2) mostra una o due righe di testo. La line2 è opzionale",
          readTemperature: "readTemperature(thermometer) riporta la temperatura ambiente",
          sleep: "sleep(milliseconds) mette in pausa l'esecuzione per una durata in ms",
          setServoAngle: "setServoAngle(servo, angle) cambia l'angolo del servomotore",
          readRotaryAngle: "readRotaryAngle(potentiometer) riporta la posizione del potenziometro",
          readDistance: "readDistance(distanceSensor) riporta la distanza misurata",
          readLightIntensity: "readLightIntensity(lightSensor) riporta l'intensità luminosa",
          readHumidity: "readHumidity(hygrometer) riporta l'umidità dell'ambiente",
          currentTime: "currentTime() tempo in millisecondi dall'avvio del programma",
          setLedBrightness: "setLedBrightness(led, brightness) regola l'intensità luminosa del LED",
          getLedBrightness: "getLedBrightness(led) riporta l'intensità luminosa del LED",
          getServoAngle: "getServoAngle(servo) riporta l'angolo del servomotore",
          isLedOn: "isLedOn() riporta True se il LED è acceso, False se è spento",
          isLedOnWithName: "isLedOn(led) riporta True se il LED è acceso, False se è spento",
          turnBuzzerOn: "turnBuzzerOn() accende il cicalino",
          turnBuzzerOff: "turnBuzzerOff() spegne il cicalino",
          isBuzzerOn: "isBuzzerOn() riporta True se il cicalino è acceso, False se è spento",
          isBuzzerOnWithName: "isBuzzerOn(buzzer) riporta True se il cicalino è acceso, False se è spento",
          setBuzzerState: "setBuzzerState(buzzer, state) modifica lo stato del cicalino: True per acceso, False nel caso contrario",
          setBuzzerNote: "setBuzzerNote(buzzer, frequency) fa suonare il cicalino alla frequenza indicata",
          getBuzzerNote: "getBuzzerNote(buzzer) riporta la frequenza attuale del cicalino",
          getTemperatureFromCloud: "getTemperatureFromCloud(town) get the temperature from the town given",
          drawPoint: "drawPoint(x, y) draw a point of 1 pixel at given coordinates",
          isPointSet: "isPointSet(x, y) return True if the point at coordinates x, y is on",
          drawLine: "drawLine(x0, y0, x1, y1) draw a line starting at x0, y0 to x1, y1",
          drawRectangle: "drawRectangle(x0, y0, width, height) disegna un rettangolo, con angolo in alto a sinistra (x0,y0)",
          drawCircle: "drawCircle(x0, y0, diameter) draw a circle of center x0, y0 and of given diameter",
          clearScreen: "clearScreen() cancella il contenuto della schermata",
          updateScreen: "updateScreen() update screen content",
          autoUpdate: "autoUpdate(auto) change the screen actualisation mode",
          fill: "fill(color) fill the shapes with the color given",
          noFill: "noFill() do not fill the shapes",
          stroke: "stroke(color) draw the borders of shapes with the color given",
          noStroke: "noStroke() do not draw the borders of shapes",
          readAcceleration: "readAcceleration(axis) read the acceleration (m/s²) in the axis (X, Y or Z)",
          computeRotation: "computeRotation(axis) compute the rotation angle (°) in the accelerometro",
          readSoundLevel: "readSoundLevel(port) return the ambien sound",
          readMagneticForce: "readMagneticForce(axis) return the magnetic force (µT) in the axis (X, Y ou Z)",
          computeCompassHeading: "computeCompassHeading() return the compass direction in degres",
          readInfraredState: "readInfraredState(IRReceiver) riporta True se viene rilevato un segnale infrarosso, False nel caso in contrario",
          setInfraredState: "setInfraredState(IREmitter, state) modifica lo stato del trasmettitore : True per accenderlo, False per spegnerlo",
          // Gyroscope
          readAngularVelocity: "readAngularVelocity(axis) return the angular speed (°/s) of the gyroscope",
          setGyroZeroAngle: "setGyroZeroAngle() initialize the gyroscope at the 0 state",
          computeRotationGyro: "computeRotationGyro(axis) compute the rotations of the gyroscope in degres",
          //Internet store
          connectToCloudStore: "connectToCloudStore(identifier, password) connect to cloud store with the given username and password",
          writeToCloudStore: "writeToCloudStore(identifier, key, value) write a value at a key to the cloud",
          readFromCloudStore: "readFromCloudStore(identifier, key) read the value at the given key from the cloud",
          // IR Remote
          readIRMessage: "readIRMessage(irrec, timeout) wait for an IR message during the given time and then return it",
          sendIRMessage: "sendIRMessage(irtrans, name) send an IR message previously configured with the given name",
          presetIRMessage: "presetIRMessage(name, data) configure an IR message with the given name and data",
          //Continous servo
          setContinousServoDirection: "setContinousServoDirection(servo, direction)"
      },
      constant: {},
      startingBlockName: "Programma",
      messages: {
          sensorNotFound: "Accesso a un sensore o attuatore inesistente : {0}.",
          manualTestSuccess: "Test automatico convalidato.",
          testSuccess: "Bravo ! Il risultato è corretto",
          wrongState: "Test fallito : <code>{0}</code> è rimasto nello stato {1} invece di {2} a t={3}ms.",
          wrongStateDrawing: "Test fallito : <code>{0}</code> differisce di {1} pixel rispetto alla visualizzazione prevista a t={2}ms.",
          wrongStateSensor: "Test fallito : il tuo programma non ha letto lo stato di <code>{0}</code> dopo t={1}ms.",
          programEnded: "programma terminato.",
          piPlocked: "L'unità è bloccata. Sbloccare o riavviare.",
          cantConnect: "Impossibile connettersi all'apparecchio.",
          wrongVersion: "Il tuo Raspberry Pi è una versione troppo vecchia, aggiornala.",
          cardDisconnected: "La scheda è stata disconnessa.",
          sensorInOnlineMode: "Non è possibile agire sui sensori in modalità connessa.",
          actuatorsWhenRunning: "Impossibile modificare gli azionatori durante l'esecuzione di un programma",
          cantConnectoToUSB: 'Tentativo di connessione via USB in corso, si prega di collegare il Raspberry alla porta USB. <i class="fas fa-circle-notch fa-spin"></i>',
          cantConnectoToBT: 'Tentativo di connessione via Bluetooth, si prega di collegare il dispositivo al Raspberry via Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
          canConnectoToUSB: "Connesso via USB.",
          canConnectoToBT: "Connesso via Bluetooth.",
          noPortsAvailable: "Non è disponibile alcuna porta compatibile con questo {0} (type {1})",
          sensor: "sensore",
          actuator: "azionatore",
          removeConfirmation: "Sei sicuro di voler rimuovere questo sensore o attuatore?",
          remove: "Rimuovi",
          keep: "Tieni",
          minutesago: "Last seen {0} minutes ago",
          hoursago: "Last seen more than one hour ago",
          drawing: "disegno",
          timeLabel: "Tempo",
          seconds: "secondi",
          changeBoard: "Cambia scheda",
          connect: "Connetti",
          install: "Installa",
          config: "Config",
          raspiConfig: "Configurazione del scheda",
          local: "Local",
          schoolKey: "Indica un ID scolastico",
          connectList: "Seleziona un apparecchio da connettere nel seguente elenco",
          enterIpAddress: "o inserisci il tuo indirizzo IP",
          getPiList: "Ottieni l'elenco",
          connectTroughtTunnel: "Collegamento attraverso il canale France-ioi",
          connectToLocalhost: "Collegamento dell'interfaccia al computer su cui funziona questo browser",
          connectToWindowLocation: "Connettiti al Rasberry Pi da cui è stata caricata questa pagina",
          connectToDevice: "Connetti l'apparecchio",
          disconnectFromDevice: "Disconnetti",
          irReceiverTitle: "Ricevi codici infrarossi",
          directIrControl: "Punta il telecomando verso la scheda QuickPi e premi uno dei tasti.s",
          getIrCode: "Ricevi un codice",
          closeDialog: "Chiudi",
          irRemoteControl: "Telecomando IR",
          noIrPresets: "Si prega di utilizzare la funzione di preparazione dei messaggi IR per aggiungere comandi di controllo remoto.",
          irEnableContinous: "Attiva la trasmissione IR continua",
          irDisableContinous: "Disattiva la trasmissione IR continua",
          connectToLocalHost: "Collegamento dell'interfaccia alla periferica su cui funziona questo browser",
          up: "up",
          down: "down",
          left: "left",
          right: "right",
          center: "center",
          on: "On",
          off: "Off",
          getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} is not a town supported by getTemperatureFromCloud",
          wifiNotActive: "Il Wi-Fi non è attivato. Attiva il Wi-Fi per farlo.",
          wifiSsid: "SSID:",
          wifiPassword: "Password:",
          wifiEnable: "Activare",
          wifiDisable: "Disabilitare",
          wifiConnect: "Connetti",
          wifiDisconnect: "Disconnetti",
          wifiStatusDisabled: "Disabilitato",
          wifiStatusDisconnected: "Disconnesso",
          wifiStatusConnected: "Connesso",
          wifiStatus: "Stato:",
          networkRequestFailed: "La richiesta alla pagina {0} non è riuscita.",
          networkResponseInvalidJson: "Questa risposta non è in formato JSON.",
          grovehat: "Grove Base Hat for Raspberry Pi",
          quickpihat: "France IOI QuickPi Hat",
          pinohat: "Raspberry Pi without hat",
          led: "LED",
          ledrgb: "LED RGB",
          leddim: "LED dimmerabile",
          blueled: "LED blu",
          greenled: "LED verde",
          orangeled: "LED arancione",
          redled: "LED rosso",
          buzzer: "Buzzer",
          grovebuzzer: "Grove Buzzer",
          quickpibuzzer: "Quick Pi Passive Buzzer",
          servo: "Servomotore",
          screen: "Screen",
          grove16x2lcd: "Grove 16x2 LCD",
          oled128x32: "128x32 Oled Screen",
          irtrans: "IR Transmiter",
          button: "Button",
          wifi: "Wi-Fi",
          fivewaybutton: "5 way button",
          tempsensor: "Temperature sensor",
          groveanalogtempsensor: "Grove Analog tempeature sensor",
          quickpigyrotempsensor: "Quick Pi Accelerometer+Gyroscope temperature sensor",
          dht11tempsensor: "DHT11 Tempeature Sensor",
          potentiometer: "Potentiometer",
          lightsensor: "Light sensor",
          distancesensor: "Sensore di distanza",
          timeofflightranger: "Time of flight distance sensor",
          ultrasonicranger: "Sensore di distanza a ultrasuoni",
          humiditysensor: "Humidity sensor",
          soundsensor: "Sound sensor",
          accelerometerbmi160: "Accelerometer sensor (BMI160)",
          gyrobmi160: "Gyropscope sensor (BMI160)",
          maglsm303c: "Magnetometer sensor (LSM303C)",
          irreceiver: "IR Receiver",
          cloudstore: "Cloud Store",
          addcomponent: "Aggiungi un componente",
          selectcomponent: "Seleziona un componente da aggiungere alla tua scheda e collegalo a una porta.",
          add: "Aggiungi",
          builtin: "(builtin)",
          chooseBoard: "Scegli la tua scheda",
          nameandports: "Nomi e porte dei sensori e azionatori QuickPi",
          name: "Name",
          port: "Port",
          state: "State",
          cloudTypes: {
              object: "Dictionnaire",
              array: "Tableau",
              boolean: "Booléen",
              number: "Nombre",
              string: "Chaîne de caractère" // TODO: translate
          },
          cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.",
          cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud",
          cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud",
          cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}",
          cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.",
          cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu",
          cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.",
          cloudKeyNotExists: "La chiave non esiste : {0} ",
          cloudWrongValue: "Chiave {0} : il valore {2} non è quello previsto, {1}.",
          cloudUnexpectedKey: "La chiave {0} non è una chiave prevista",
          hello: "Buongiorno",
          experiment: "Testa",
          validate: "Convalida",
          validate1: "Convalida 1",
          validate2: "Convalida 2",
          validate3: "Convalida 3",
          sensorNameBuzzer: "buzzer",
          sensorNameLed: "led",
          sensorNameLedRgb: "ledRgb",
          sensorNameLedDim: "ledDim",
          sensorNameRedLed: "redled",
          sensorNameGreenLed: "greenled",
          sensorNameBlueLed: "blueled",
          sensorNameOrangeLed: "orangeled",
          sensorNameScreen: "screen",
          sensorNameIrTrans: "irtran",
          sensorNameIrRecv: "irrec",
          sensorNameMicrophone: "micro",
          sensorNameTemperature: "temp",
          sensorNameGyroscope: "gyroscope",
          sensorNameMagnetometer: "magneto",
          // sensorNameDistance: "distance",
          sensorNameDistance: "dist",
          sensorNameAccelerometer: "accel",
          sensorNameButton: "button",
          sensorNameLight: "light",
          sensorNameStick: "stick",
          sensorNameServo: "servo",
          sensorNameHumidity: "humidity",
          sensorNamePotentiometer: "pot",
          sensorNameCloudStore: "cloud",
          sensorNameWifi: "wifi"
      },
      concepts: {
          quickpi_start: 'Crea un programma',
          quickpi_validation: 'Convalida il tuo programma',
          quickpi_buzzer: 'Cicalino',
          quickpi_led: 'LED',
          quickpi_button: 'Pulsanti e joystick',
          quickpi_screen: 'Schermo',
          quickpi_draw: 'Disegna',
          quickpi_range: 'Sensore di distanza',
          quickpi_servo: 'Servomotore',
          quickpi_thermometer: 'Termometro',
          quickpi_microphone: 'Microfono',
          quickpi_light_sensor: 'Sensore di luminosità',
          quickpi_accelerometer: 'Accelerometro',
          quickpi_wait: 'Gestione del tempo',
          quickpi_magneto: 'Magnetometro',
          quickpi_ir_receiver: 'Ricevitore a infrarossi',
          quickpi_ir_emitter: 'Emettitore a infrarossi',
          quickpi_potentiometer: "Potenziometro",
          quickpi_gyroscope: "giroscopio",
          quickpi_cloud: 'Memorizzazione nel cloud'
      }
  };

  var quickPiLocalLanguageStrings = {
      fr: langFr,
      es: langEs,
      it: langIt,
      none: {
          comment: {
              // Comments for each block, used in the auto-generated documentation for task writers
              turnLedOn: "Turns on the light",
              turnLedOff: "Turns off the light",
              isButtonPressed: "Returns the state of a button, Pressed means True and not pressed means False",
              waitForButton: "Stops program execution until a button is pressed",
              buttonWasPressed: "Returns true if the button has been pressed and will clear the value",
              setLedState: "Change led state in the given port",
              setLedMatrixOne: "Change led state in the given port",
              toggleLedState: "If led is on, turns it off, if it's off turns it on",
              isButtonPressedWithName: "Returns the state of a button, Pressed means True and not pressed means False",
              displayText: "Display text in LCD screen",
              displayText2Lines: "Display text in LCD screen (two lines)",
              readTemperature: "Read Ambient temperature",
              sleep: "pause program execute for a number of seconds",
              setServoAngle: "Set servo motor to an specified angle",
              readRotaryAngle: "Read state of potentiometer",
              readDistance: "Read distance using ultrasonic sensor",
              readLightIntensity: "Read light intensity",
              readHumidity: "lire l'humidité ambiante",
              currentTime: "returns current time",
              setBuzzerState: "sonnerie",
              getTemperatureFromCloud: "Get temperature from town",
              setBuzzerNote: "Set buzzer note",
              getBuzzerNote: "Get buzzer note",
              setLedBrightness: "Set Led Brightness",
              getLedBrightness: "Get Led Brightness",
              setLedColors: "Set Led Colors",
              getServoAngle: "Get Servo Angle",
              isLedOn: "Get led state",
              isLedOnWithName: "Get led state",
              turnBuzzerOn: "Turn Buzzer on",
              turnBuzzerOff: "Turn Buzzer off",
              isBuzzerOn: "Is Buzzer On",
              isBuzzerOnWithName: "get buzzer state",
              drawPoint: "drawPoint",
              isPointSet: "isPointSet",
              drawLine: "drawLine",
              drawRectangle: "drawRectangle",
              drawCircle: "drawCircle",
              clearScreen: "clearScreen",
              updateScreen: "updateScreen",
              autoUpdate: "autoUpdate",
              fill: "fill",
              noFill: "noFill",
              stroke: "stroke",
              noStroke: "noStroke",
              readAcceleration: "readAcceleration",
              computeRotation: "computeRotation",
              readSoundLevel: "readSoundLevel",
              readMagneticForce: "readMagneticForce",
              computeCompassHeading: "computeCompassHeading",
              readInfraredState: "readInfraredState",
              setInfraredState: "setInfraredState",
              // Gyroscope
              readAngularVelocity: "readAngularVelocity",
              setGyroZeroAngle: "setGyroZeroAngle",
              computeRotationGyro: "computeRotationGyro",
              //Internet store
              connectToCloudStore: "connectToCloudStore",
              writeToCloudStore: "writeToCloudStore",
              readFromCloudStore: "readFromCloudStore",
              // IR Remote
              readIRMessage: "readIRMessage",
              sendIRMessage: "sendIRMessage",
              presetIRMessage: "presetIRMessage",
              //Continous servo
              setContinousServoDirection: "setContinousServoDirection"
          }
      }
  };

  var g_instance = null;
  var NEED_VERSION = 2;
  var getQuickPiConnection = function getQuickPiConnection(userName, _onConnect, _onDisconnect, _onChangeBoard) {
      this.onConnect = _onConnect;
      this.onDisconnect = _onDisconnect;
      if (g_instance) {
          return g_instance;
      }
      this.raspiServer = "";
      this.wsSession = null;
      this.transaction = false;
      this.resultsCallbackArray = null;
      this.commandMode = false;
      this.userName = userName;
      this.sessionTainted = false;
      this.connected = false;
      this.onConnect = _onConnect;
      this.onDisconnect = _onDisconnect;
      this.onChangeBoard = _onChangeBoard;
      this.locked = "";
      this.pingInterval = null;
      this.pingsWithoutPong = 0;
      this.oninstalled = null;
      this.commandQueue = [];
      this.seq = 0;
      this.wrongVersion = false;
      this.onDistributedEvent = null;
      this.connect = function(url) {
          var _this = this;
          if (this.wsSession != null) {
              return;
          }
          this.locked = "";
          this.pingsWithoutPong = 0;
          this.commandQueue = [];
          this.resultsCallbackArray = [];
          this.wrongVersion = false;
          this.seq = Math.floor(Math.random() * 65536);
          this.wsSession = new WebSocket(url);
          this.wsSession.onopen = function() {
              var command = {
                  "command": "grabLock",
                  "username": userName,
                  "detectionLib": pythonLibDetection
              };
              _this.wsSession.send(JSON.stringify(command));
          };
          this.wsSession.onmessage = function(evt) {
              var message = JSON.parse(evt.data);
              if (message.command == "hello") {
                  var version = 0;
                  if (message.version) version = message.version;
                  if (version < NEED_VERSION) {
                      _this.wrongVersion = true;
                      _this.wsSession.close();
                      _this.onclose();
                  } else {
                      var replaceLib = pythonLibHash != message.libraryHash;
                      if (replaceLib) _this.transferPythonLib();
                      else {
                          var command = {
                              "command": "pythonLib",
                              "replaceLib": false
                          };
                          _this.wsSession.send(JSON.stringify(command));
                      }
                      _this.connected = true;
                      _this.onConnect();
                      _this.pingInterval = setInterval(function() {
                          var command = {
                              "command": "ping"
                          };
                          if (_this.pingsWithoutPong > 8) {
                              _this.wsSession.close();
                              _this.onclose();
                          } else {
                              _this.pingsWithoutPong++;
                              _this.wsSession.send(JSON.stringify(command));
                              _this.lastPingSend = +new Date();
                          }
                      }, 4000);
                      if (_this.onChangeBoard && message.board) {
                          _this.onChangeBoard(message.board);
                      }
                  }
              }
              if (message.command == "locked") {
                  _this.locked = message.lockedby;
              } else if (message.command == "pong") {
                  _this.pingsWithoutPong = 0;
              } else if (message.command == "installed") {
                  if (_this.oninstalled != null) _this.oninstalled();
              } else if (message.command == "startCommandMode") {
                  if (_this.commandQueue.length > 0) {
                      var command1 = _this.commandQueue.shift();
                      _this.resultsCallbackArray = [];
                      _this.sendCommand(command1.command, command1.callback);
                  }
              } else if (message.command == "execLineresult") {
                  if (_this.commandMode) {
                      //console.log("Result seq: " + message.seq);
                      if (_this.resultsCallbackArray && _this.resultsCallbackArray.length > 0) {
                          //console.log("resultsCallbackArray has elements")
                          if (message.seq >= _this.resultsCallbackArray[0].seq) {
                              //console.log("we under the seq");
                              var callbackelement = null;
                              var found = false;
                              while(_this.resultsCallbackArray.length > 0){
                                  callbackelement = _this.resultsCallbackArray.shift();
                                  if (callbackelement.seq == message.seq) {
                                      //console.log("we found it " + callbackelement.command, message.seq );
                                      found = true;
                                      break;
                                  }
                              }
                              if (found) {
                                  callbackelement.callback(message.result);
                              }
                          }
                      }
                      if (_this.commandQueue.length > 0 && !_this.transaction) {
                          var command2 = _this.commandQueue.shift();
                          _this.sendCommand(command2.command, command2.callback);
                      }
                  }
              } else if (message.command == "closed") {
                  if (_this.wsSession) {
                      _this.wsSession.close();
                  }
              } else if (message.command == "distributedEvent") {
                  if (_this.onDistributedEvent) _this.onDistributedEvent(message.event);
              }
          };
          this.wsSession.onclose = function(event) {
              if (_this.wsSession != null) {
                  clearInterval(_this.pingInterval);
                  _this.pingInterval = null;
                  _this.wsSession = null;
                  _this.commandMode = false;
                  _this.sessionTainted = false;
                  _this.connected = false;
                  _this.onDisconnect(_this.connected, _this.wrongVersion);
              }
          };
      };
      this.transferPythonLib = function() {
          var size = 10 * 1025; // Max 5KbSize
          var numChunks = Math.ceil(pythonLib.length / size);
          for(var i = 0, o = 0; i < numChunks; ++i, o += size){
              var chunk = pythonLib.substr(o, size);
              var command = {
                  "command": "pythonLib",
                  "replaceLib": true,
                  "library": chunk,
                  "last": numChunks - 1 == i
              };
              this.wsSession.send(JSON.stringify(command));
          }
      };
      this.isAvailable = function(ipaddress, callback) {
          this.url = "ws://" + ipaddress + ":5000/api/v1/commands";
          try {
              var websocket = new WebSocket(this.url);
              websocket.onopen = function() {
                  websocket.onclose = null;
                  websocket.close();
                  callback(true);
              };
              websocket.onclose = function() {
                  callback(false);
              };
          } catch (err) {
              callback(false);
          }
      };
      this.onclose = function() {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
          this.wsSession = null;
          this.commandMode = false;
          this.sessionTainted = false;
          this.connected = false;
          this.onDisconnect(this.connected, this.wrongVersion);
      };
      this.wasLocked = function() {
          if (this.locked) return true;
          return false;
      };
      this.isConnecting = function() {
          return this.wsSession != null;
      };
      this.isConnected = function() {
          return this.connected;
      };
      this.executeProgram = function(pythonProgram) {
          if (this.wsSession == null) return;
          this.commandMode = false;
          var fullProgram = pythonLib + pythonProgram;
          var command = {
              "command": "startRunMode",
              "program": fullProgram
          };
          this.wsSession.send(JSON.stringify(command));
      };
      this.installProgram = function(pythonProgram, oninstall) {
          if (this.wsSession == null) return;
          this.commandMode = false;
          this.oninstalled = oninstall;
          var fullProgram = pythonProgram;
          var command = {
              "command": "install",
              "program": fullProgram
          };
          this.wsSession.send(JSON.stringify(command));
      };
      this.runDistributed = function(pythonProgram, graphDefinition, oninstall) {
          if (this.wsSession == null) return;
          this.commandMode = false;
          this.oninstalled = oninstall;
          var fullProgram = pythonLib + pythonProgram;
          var command = {
              "command": "rundistributed",
              "program": fullProgram,
              "graph": graphDefinition
          };
          this.wsSession.send(JSON.stringify(command));
      };
      this.stopProgram = function() {
          if (this.wsSession != null) {
              var command = {
                  "command": "stopAll"
              };
              this.wsSession.send(JSON.stringify(command));
          }
      };
      this.releaseLock = function() {
          if (this.wsSession == null) return;
          if (this.wsSession != null) {
              var command = {
                  "command": "close"
              };
              this.wsSession.send(JSON.stringify(command));
          }
      };
      this.startNewSession = function() {
          if (this.wsSession == null) return;
          if (this.commandMode && !this.sessionTainted) return;
          this.resultsCallbackArray = [];
          this.commandMode = true;
          this.sessionTainted = false;
          var command = {
              "command": "startCommandMode"
          };
          this.commandQueue = [];
          this.wsSession.send(JSON.stringify(command));
      };
      this.startTransaction = function() {
          this.transaction = true;
      };
      this.endTransaction = function() {
          var messages = [];
          this.resultsCallbackArray = [];
          for(var i = 0; i < this.commandQueue.length; i++){
              this.seq++;
              messages.push({
                  "command": "execLine",
                  "line": this.commandQueue[i].command,
                  "seq": this.seq,
                  "long": this.commandQueue[i].long ? true : false
              });
              //console.log("trans seq: " + seq);
              this.resultsCallbackArray.push({
                  "seq": this.seq,
                  "callback": this.commandQueue[i].callback,
                  "command": this.commandQueue[i].command
              });
              this.sessionTainted = true;
          }
          this.commandQueue = [];
          var command = {
              "command": "transaction",
              "messages": messages
          };
          this.wsSession.send(JSON.stringify(command));
          this.transaction = false;
      };
      this.sendCommand = function(command, callback, long) {
          if (this.wsSession != null && this.wsSession.readyState == 1) {
              if (!this.transaction) {
                  if (!this.commandMode) {
                      this.startNewSession();
                      console.log("..............................");
                      this.commandQueue.push({
                          "command": command,
                          "callback": callback,
                          "long": long ? true : false
                      });
                  } else {
                      this.seq++;
                      var commandobj = {
                          "command": "execLine",
                          "line": command,
                          "seq": this.seq,
                          "long": long ? true : false
                      };
                      //console.log("send command ", command, seq);
                      //console.log("Sending seq: " + seq);
                      this.resultsCallbackArray.push({
                          "seq": this.seq,
                          "callback": callback,
                          "command": command
                      });
                      this.sessionTainted = true;
                      this.wsSession.send(JSON.stringify(commandobj));
                  }
              } else {
                  this.commandQueue.push({
                      command: command,
                      callback: callback
                  });
              }
          }
      };
      g_instance = this;
      return this;
  };
  var pythonLib = '\ntry:\n    sensorTable\nexcept:\n    sensorTable = []\n\n\nimport RPi.GPIO as GPIO\nimport time\nimport smbus\nimport math\nimport pigpio\nimport threading\nimport argparse\n\nGPIO.setmode(GPIO.BCM)\nGPIO.setwarnings(False)\n\nled_brightness = {}\nbuzzer_frequency = {}\nservo_angle = {}\n\nbutton_interrupt_enabled = {}\nbutton_was_pressed = {}\nservo_object = {}\nservo_last_value = {}\npin_state = {}\n\nDHT11_last_value = {}\n\ndistance_last_value = {}\n\npassive_buzzer_last_value = {}\n\nscreenLine1 = None\nscreenLine2 = None\n\noleddisp = None\noledfont = None\noledimage = None\noleddraw = None\noledwidth = 128\noledheight = 32\noledautoupdate = True\n\n\nvl53l0x = None\n\nenabledBMI160 = False\nisBMX160 = False\nenabledLSM303C = False\n\ncompassOffset = None\ncompassScale = None\n\n\npi = pigpio.pi()\n\nparser = argparse.ArgumentParser()\nparser.add_argument(\'--nodeid\', action=\'store\')\nargs = parser.parse_args()\nnodeId = args.nodeid\n\n\ndef nameToPin(name):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor["port"]\n\n    return 0\n\ndef nameToDef(name, type):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor\n\n    for sensor in sensorTable:\n        if sensor["type"] == type:\n            return sensor\n\n    return None\n\ndef normalizePin(pin):\n    returnpin = 0\n    hadporttype = False\n\n    pin = str(pin)\n\n    if pin.isdigit():\n        returnpin = pin\n    elif len(pin) >= 2 and pin[0].isalpha() and pin[1:].isdigit():\n        returnpin = pin[1:]\n    elif pin.upper().startswith("I2C"):\n        returnpin = pin[3:]\n    else:\n        returnpin = normalizePin(nameToPin(pin))\n\n    return int(returnpin)\n\ndef getSensorChannel(name):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor["channel"]\n\n    return 0\n\n\n\ndef cleanupPin(pin):\n        pi.set_mode(pin, pigpio.INPUT)\n\ndef changePinState(pin, state):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        state = int(state)\n\n        pin_state[pin] = state\n\n        cleanupPin(pin)\n        GPIO.setup(pin, GPIO.OUT)\n        if state:\n            GPIO.output(pin, GPIO.HIGH)\n        else:\n            GPIO.output(pin, GPIO.LOW)\n\ndef getPinState(pin):\n    pin = normalizePin(pin)\n    state = 0\n\n    try:\n        state = pin_state[pin]\n    except:\n        pass\n\n    return state\n\n\ndef getBuzzerState(pin):\n    return getPinState(pin)\n\ndef isLedOn(pin=4):\n    return getPinState(pin)\n\ndef getLedState(pin):\n    return getPinState(pin)\n\n\ndef turnLedOn(pin=4):\n	changePinState(pin, 1)\n\ndef turnLedOff(pin=4):\n	changePinState(pin, 0)\n\ndef setLedState(pin, state):\n    changePinState(pin, state)\n\ndef toggleLedState(pin):\n    pin = normalizePin(pin)\n\n    GPIO.setup(pin, GPIO.OUT)\n    if GPIO.input(pin):\n        GPIO.output(pin, GPIO.LOW)\n    else:\n        GPIO.output(pin, GPIO.HIGH)\n\ndef buzzOn(pin):\n  changePinState(pin, 1)\n\ndef buzzOff(pin):\n  changePinState(pin, 0)\n\ndef magnetOn(pin):\n  changePinState(pin, 1)\n\ndef magnetOff(pin):\n  changePinState(pin, 0)\n\ndef isButtonPressed(pin=None):\n    if pin == None:\n        pin = "button1"\n\n    pin = normalizePin(pin)\n\n    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    return GPIO.input(pin)\n\ndef waitForButton(pin):\n    pin = normalizePin(pin)\n    cleanupPin(pin)\n    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    while not GPIO.input(pin):\n        time.sleep(0.01)\n    time.sleep(0.1) # debounce\n\ndef buttonWasPressedCallback(pin):\n    button_was_pressed[pin] = 1\n\ndef buttonWasPressed(pin):\n    pin = normalizePin(pin)\n    init = False\n    try:\n        init = button_interrupt_enabled[pin]\n    except:\n        pass\n\n    if not init:\n        button_interrupt_enabled[pin] = True\n        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n        GPIO.add_event_detect(pin, GPIO.FALLING, callback=buttonWasPressedCallback, bouncetime=300)\n\n    wasPressed = 0\n\n    try:\n        wasPressed = button_was_pressed[pin]\n        button_was_pressed[pin] = 0\n    except:\n            pass\n\n    return wasPressed\n\ndef initVL53():\n    global vl53l0x\n\n    try:\n        vl53l0x = VL53L0X()\n    except:\n        vl53l0x = None\n\n\ndef readDistanceVL53(pin):\n    global vl53l0x\n    distance = 0\n    justinit = False\n\n    if vl53l0x == None:\n        initVL53()\n\n        if vl53l0x is not None:\n            justinit = True\n\n    try:\n        distance = vl53l0x.range / 10\n    except:\n        try:\n            if not justinit:\n                initVL53()\n                distance = vl53l0x.range / 10\n        except:\n            pass\n\n    return distance\n\nusleep = lambda x: time.sleep(x / 1000000.0)\n\n_TIMEOUT1 = 1000\n_TIMEOUT2 = 10000\n\ndef readDistanceUltrasonic(pin):\n    pin = normalizePin(pin)\n\n    cleanupPin(pin)\n\n    last_value = 0\n    try:\n        last_value = distance_last_value[pin]\n    except:\n        pass\n\n    GPIO.setup(pin, GPIO.OUT)\n    GPIO.output(pin, GPIO.LOW)\n    usleep(2)\n    GPIO.output(pin, GPIO.HIGH)\n    usleep(10)\n    GPIO.output(pin, GPIO.LOW)\n\n    GPIO.setup(pin, GPIO.IN)\n\n    t0 = time.time()\n    count = 0\n    while count < _TIMEOUT1:\n        if GPIO.input(pin):\n            break\n        count += 1\n    if count >= _TIMEOUT1:\n        return last_value\n\n    t1 = time.time()\n    count = 0\n    while count < _TIMEOUT2:\n        if not GPIO.input(pin):\n            break\n        count += 1\n    if count >= _TIMEOUT2:\n        return last_value\n\n    t2 = time.time()\n\n    dt = int((t1 - t0) * 1000000)\n    if dt > 530:\n        return last_value\n\n    distance = ((t2 - t1) * 1000000 / 29 / 2)    # cm\n\n    distance = round(distance, 1)\n\n    distance_last_value[pin] = distance\n\n    return distance\n\ndef initOLEDScreen():\n    global oleddisp\n    global oledfont\n    global oledimage\n    global oleddraw\n\n    if oleddisp == None:\n        from luma.core.interface.serial import i2c\n        from luma.core.render import canvas\n        from luma.oled.device import ssd1306\n        from PIL import Image, ImageDraw, ImageFont\n\n        # Reset the screen\n        RESET=21\n        GPIO.setup(RESET, GPIO.OUT)\n        GPIO.output(RESET, 0)\n        time.sleep(0.01)\n        GPIO.output(RESET, 1)\n\n\n        serial = i2c(port=1, address=0x3C)\n        oleddisp = ssd1306(serial, width=oledwidth, height=oledheight)\n        oleddisp.cleanup = lambda _: True\n\n        oledfont = ImageFont.load_default()\n        oledimage = Image.new(\'1\', (oledwidth, oledheight))\n        oleddraw = ImageDraw.Draw(oledimage)\n\n        oleddisp.display(oledimage)\n\n# Address 0x3c\ndef displayTextOled(line1, line2=""):\n    global oleddisp\n    global oledfont\n    global oledimage\n    global oleddraw\n\n    initOLEDScreen()\n\n    # This will allow arguments to be numbers\n    line1 = str(line1)\n\n    if line2:\n        line2 = str(line2)\n    else:\n        line2 = ""\n\n    oleddraw.rectangle((0, 0, oledwidth, oledheight), outline=0, fill=0)\n\n    oleddraw.text((0, 0), line1, font=oledfont, fill=255)\n    oleddraw.text((0, 15), line2, font=oledfont, fill=255)\n\n    updateScreen()\n\ndef displayTextOledAtPos(line1, x, y, fill=255):\n    global oleddisp\n    global oledfont\n    global oledimage\n    global oleddraw\n\n    initOLEDScreen()\n\n    # This will allow arguments to be numbers\n    line1 = str(line1)\n\n    oleddraw.text((x, y), line1, font=oledfont, fill=fill)\n\n    updateScreen()\n\ndef autoUpdate(autoupdate):\n    global oledautoupdate\n\n    oledautoupdate = bool(autoupdate)\n\ndef updateScreen():\n    global oleddisp\n    global oledimage\n\n    oleddisp.display(oledimage)\n\nfillcolor = 255\nstrokecolor = 255\n\ndef fill(color):\n    global fillcolor\n\n    if int(color) > 0:\n        fillcolor = 255\n    else:\n        fillcolor = 0\n\ndef noFill():\n    global fillcolor\n    fillcolor = None\n\ndef stroke(color):\n    global strokecolor\n\n    if int(color) > 0:\n        strokecolor = 255\n    else:\n        strokecolor = 0\n\ndef noStroke():\n    global strokecolor\n    strokecolor = None\n\ndef drawPoint(x, y):\n    global oleddraw\n    global strokecolor\n\n    initOLEDScreen()\n\n    oleddraw.point((x, y), fill=strokecolor)\n\n    global oledautoupdate\n    if oledautoupdate:\n        updateScreen()\n\ndef drawText(x, y, text):\n    global oleddisp\n    global oledfont\n    global oledimage\n    global oleddraw\n\n    initOLEDScreen()\n\n    # This will allow arguments to be numbers\n    text = str(text)\n\n    oleddraw.text((x, y), text, font=oledfont, fill=strokecolor)\n\n    updateScreen()\n\n\ndef drawLine(x0, y0, x1, y1):\n    global oleddraw\n    global strokecolor\n\n    initOLEDScreen()\n\n    oleddraw.line((x0, y0, x1, y1), fill=strokecolor)\n\n    global oledautoupdate\n    if oledautoupdate:\n        updateScreen()\n\ndef drawRectangle(x0, y0, width, height):\n    global oleddraw\n    global fillcolor\n    global strokecolor\n\n    initOLEDScreen()\n    oleddraw.rectangle((x0, y0, x0 + width - 1, y0 + height - 1), fill=fillcolor, outline=strokecolor)\n\n    global oledautoupdate\n    if oledautoupdate:\n        updateScreen()\n\ndef drawCircle(x0, y0, diameter):\n    global oleddraw\n    global fillcolor\n    global strokecolor\n\n    initOLEDScreen()\n\n    radius = diameter / 2\n\n    boundx0 = x0 - radius\n    boundy0 = y0 - radius\n\n    boundx1 = x0 + radius\n    boundy1 = y0 + radius\n\n    oleddraw.ellipse((boundx0, boundy0, boundx1, boundy1), fill=fillcolor, outline=strokecolor)\n\n    global oledautoupdate\n    if oledautoupdate:\n        updateScreen()\n\ndef clearScreen():\n    global oleddraw\n\n    initOLEDScreen()\n\n    oleddraw.rectangle((0, 0, oledwidth, oledheight), outline=0, fill=0)\n\n    global oledautoupdate\n    if oledautoupdate:\n        updateScreen()\n\ndef isPointSet(x, y):\n    global oleddraw\n    global oledimage\n\n    initOLEDScreen()\n\n    pixels = oledimage.load()\n\n    return pixels[x,y] > 0\n\ndef i2c_write_data(port, address, register, data):\n    issofti2c = False\n    print("------------------------->", "i2c_write_data")\n    if (\'softi2c\' in globals()) and (str(port) in softi2c):\n\n        print("------------------------->", "Soft i2c")\n\n        issofti2c = True\n        softsda = softi2c[str(port)][1]\n        softscl = softi2c[str(port)][0]\n\n    if port == 0:\n        bus = smbus.SMBus(1)\n        bus.write_byte_data(address, register, data)\n    else:\n        print("------------------------->", "SOFT I2C", "SDA: ", softsda, "SCL: ", softscl)\n        try:\n            pi.bb_i2c_close(softsda)\n        except:\n            pass\n\n        pi.bb_i2c_open(softsda, softscl, 10000)\n\n        commandlist = [4,               # Set the address to next byte\n                       address,         # I2c address\n                       2,               # Stop condition\n                       7,               # Write the next byte of data\n                       1 + len(data),   # Write 1 byte of data\n                       register         # Payload (register address)\n                       ]\n        commandlist.extend(data)\n        commandlist.extend([3, 0])\n\n        pi.bb_i2c_zip(softsda, commandlist)\n        pi.bb_i2c_close(softsda)\n\n\ndef displayText16x2(line1, line2="", port=0):\n    global screenLine1\n    global screenLine2\n\n    if line1 == screenLine1 and line2 == screenLine2:\n        return\n\n    screenLine1 = line1\n    screenLine2 = line2\n\n    address = 0x3e\n    port = 3\n    #bus = smbus.SMBus(1)\n\n    i2c_write_data(port, address, 0x80, 0x01) #clear\n    time.sleep(0.05)\n    i2c_write_data(port, address, 0x80, 0x08 | 0x04) # display on, no cursor\n    i2c_write_data(port, address, 0x80, 0x28) # two lines\n    time.sleep(0.05)\n\n    # This will allow arguments to be numbers\n    line1 = str(line1)\n    line2 = str(line2)\n\n    count = 0\n    for c in line1:\n        i2c_write_data(port, address, 0x40, ord(c))\n        count += 1\n        if count == 16:\n            break\n\n    i2c_write_data(port, address, 0x80, 0xc0) # Next line\n    count = 0\n    for c in line2:\n        i2c_write_data(port, address, 0x40, ord(c))\n        count += 1\n        if count == 16:\n            break\n\ndef motorRun(name, speed):\n    GROVE_MOTOR_DRIVER_DEFAULT_I2C_ADDR         = 0x14\n    GROVE_MOTOR_DRIVER_I2C_CMD_BRAKE            = 0x00\n    GROVE_MOTOR_DRIVER_I2C_CMD_STOP             = 0x01\n    GROVE_MOTOR_DRIVER_I2C_CMD_CW               = 0x02\n    GROVE_MOTOR_DRIVER_I2C_CMD_CCW              = 0x03\n    GROVE_MOTOR_DRIVER_I2C_CMD_STANDBY          = 0x04\n    GROVE_MOTOR_DRIVER_I2C_CMD_NOT_STANDBY      = 0x05\n    GROVE_MOTOR_DRIVER_I2C_CMD_STEPPER_RUN = 0x06\n    GROVE_MOTOR_DRIVER_I2C_CMD_STEPPER_STOP     = 0x07\n    GROVE_MOTOR_DRIVER_I2C_CMD_STEPPER_KEEP_RUN = 0x08\n    GROVE_MOTOR_DRIVER_I2C_CMD_SET_ADDR         = 0x11\n\n    MOTOR_CHA = 0\n    MOTOR_CHB = 1\n\n    FULL_STEP = 0\n    WAVE_DRIVE = 1\n    HALF_STEP = 2\n    MICRO_STEPPING = 3\n\n    if speed > 255:\n        speed = 255\n    elif speed < -255:\n        speed = -255\n\n\n    port = normalizePin(name)\n    channel = int(getSensorChannel(name))\n\n    cmd = GROVE_MOTOR_DRIVER_I2C_CMD_CW\n    if speed < 0:\n        cmd = GROVE_MOTOR_DRIVER_I2C_CMD_CCW\n        speed = -1 * speed\n\n    i2c_write_data(port, GROVE_MOTOR_DRIVER_DEFAULT_I2C_ADDR, cmd, [channel, speed])\n\nGroveMultiChannelRelayState = 0x00\n\ndef setRelayState(name, state):\n    global GroveMultiChannelRelayState\n\n    port = normalizePin(name)\n    channel = int(getSensorChannel(name))\n\n    if state:\n        GroveMultiChannelRelayState = GroveMultiChannelRelayState | (0x01 << channel)\n    else:\n        GroveMultiChannelRelayState = GroveMultiChannelRelayState & (~(0x01 << channel))\n\n    print("--------------->name", name, "port", port, "GroveMultiChannelRelayState", GroveMultiChannelRelayState)\n\n    CMD_CHANNEL_CTRL = 0x10\n\n    i2c_write_data(port, 0x11, CMD_CHANNEL_CTRL, [GroveMultiChannelRelayState])\n\ndef readBarometricPressure(name):\n    pass\n\ndef setServoAngle(pin, angle):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        servo_angle[pin] = 0\n\n        angle = int(angle)\n\n        if angle < 0:\n            angle = 0\n        elif angle > 180:\n            angle = 180\n\n        pulsewidth = (angle * 11.11) + 500\n        pi.set_servo_pulsewidth(pin, pulsewidth)\n\ndef getServoAngle(pin):\n    pin = normalizePin(pin)\n    angle = 0\n\n    try:\n        angle = servo_angle[pin]\n    except:\n        pass\n\n    return angle\n\ndef setContinousServoDirection(pin, direction):\n    if direction > 0:\n        angle = 0\n    elif direction < 0:\n        angle = 180\n    else:\n        angle = 90\n\n    setServoAngle(pin, angle)\n\n\ndef readGrovePiADC(pin):\n    pin = normalizePin(pin)\n\n    reg = 0x30 + pin\n    address = 0x04\n\n    try:\n        bus = smbus.SMBus(1)\n        bus.write_byte(address, reg)\n        return bus.read_word_data(address, reg)\n    except:\n        return 0\n\n\ndef sleep(sleep_time):\n	sleep_time = float(sleep_time)\n	time.sleep(sleep_time/1000)\n\ndef reportBlockValue(id, state):\n    return state\n\n\nclass DHT11Result:\n    \'DHT11 sensor result returned by DHT11.read() method\'\n\n    ERR_NO_ERROR = 0\n    ERR_MISSING_DATA = 1\n    ERR_CRC = 2\n\n    error_code = ERR_NO_ERROR\n    temperature = -1\n    humidity = -1\n\n    def __init__(self, error_code, temperature, humidity):\n        self.error_code = error_code\n        self.temperature = temperature\n        self.humidity = humidity\n\n    def is_valid(self):\n        return self.error_code == DHT11Result.ERR_NO_ERROR\n\n# Taken from https://github.com/szazo/DHT11_Python\nclass DHT11:\n    \'DHT11 sensor reader class for Raspberry\'\n\n    __pin = 0\n\n    def __init__(self, pin):\n        self.__pin = pin\n\n    def read(self):\n        GPIO.setup(self.__pin, GPIO.OUT)\n\n        # send initial high\n        self.__send_and_sleep(GPIO.HIGH, 0.05)\n\n        # pull down to low\n        self.__send_and_sleep(GPIO.LOW, 0.02)\n\n        # change to input using pull up\n        GPIO.setup(self.__pin, GPIO.IN, GPIO.PUD_UP)\n\n        # collect data into an array\n        data = self.__collect_input()\n\n        # parse lengths of all data pull up periods\n        pull_up_lengths = self.__parse_data_pull_up_lengths(data)\n\n        # if bit count mismatch, return error (4 byte data + 1 byte checksum)\n        if len(pull_up_lengths) != 40:\n            return DHT11Result(DHT11Result.ERR_MISSING_DATA, 0, 0)\n\n        # calculate bits from lengths of the pull up periods\n        bits = self.__calculate_bits(pull_up_lengths)\n\n        # we have the bits, calculate bytes\n        the_bytes = self.__bits_to_bytes(bits)\n\n        # calculate checksum and check\n        checksum = self.__calculate_checksum(the_bytes)\n        if the_bytes[4] != checksum:\n            return DHT11Result(DHT11Result.ERR_CRC, 0, 0)\n\n        # ok, we have valid data, return it\n        return DHT11Result(DHT11Result.ERR_NO_ERROR, the_bytes[2], the_bytes[0])\n\n    def __send_and_sleep(self, output, sleep):\n        GPIO.output(self.__pin, output)\n        time.sleep(sleep)\n\n    def __collect_input(self):\n        # collect the data while unchanged found\n        unchanged_count = 0\n\n        # this is used to determine where is the end of the data\n        max_unchanged_count = 100\n\n        last = -1\n        data = []\n        while True:\n            current = GPIO.input(self.__pin)\n            data.append(current)\n            if last != current:\n                unchanged_count = 0\n                last = current\n            else:\n                unchanged_count += 1\n                if unchanged_count > max_unchanged_count:\n                    break\n\n        return data\n\n    def __parse_data_pull_up_lengths(self, data):\n        STATE_INIT_PULL_DOWN = 1\n        STATE_INIT_PULL_UP = 2\n        STATE_DATA_FIRST_PULL_DOWN = 3\n        STATE_DATA_PULL_UP = 4\n        STATE_DATA_PULL_DOWN = 5\n\n        state = STATE_INIT_PULL_DOWN\n\n        lengths = [] # will contain the lengths of data pull up periods\n        current_length = 0 # will contain the length of the previous period\n\n        for i in range(len(data)):\n\n            current = data[i]\n            current_length += 1\n\n            if state == STATE_INIT_PULL_DOWN:\n                if current == GPIO.LOW:\n                    # ok, we got the initial pull down\n                    state = STATE_INIT_PULL_UP\n                    continue\n                else:\n                    continue\n            if state == STATE_INIT_PULL_UP:\n                if current == GPIO.HIGH:\n                    # ok, we got the initial pull up\n                    state = STATE_DATA_FIRST_PULL_DOWN\n                    continue\n                else:\n                    continue\n            if state == STATE_DATA_FIRST_PULL_DOWN:\n                if current == GPIO.LOW:\n                    # we have the initial pull down, the next will be the data pull up\n                    state = STATE_DATA_PULL_UP\n                    continue\n                else:\n                    continue\n            if state == STATE_DATA_PULL_UP:\n                if current == GPIO.HIGH:\n                    # data pulled up, the length of this pull up will determine whether it is 0 or 1\n                    current_length = 0\n                    state = STATE_DATA_PULL_DOWN\n                    continue\n                else:\n                    continue\n            if state == STATE_DATA_PULL_DOWN:\n                if current == GPIO.LOW:\n                    # pulled down, we store the length of the previous pull up period\n                    lengths.append(current_length)\n                    state = STATE_DATA_PULL_UP\n                    continue\n                else:\n                    continue\n\n        return lengths\n\n    def __calculate_bits(self, pull_up_lengths):\n        # find shortest and longest period\n        shortest_pull_up = 1000\n        longest_pull_up = 0\n\n        for i in range(0, len(pull_up_lengths)):\n            length = pull_up_lengths[i]\n            if length < shortest_pull_up:\n                shortest_pull_up = length\n            if length > longest_pull_up:\n                longest_pull_up = length\n\n        # use the halfway to determine whether the period it is long or short\n        halfway = shortest_pull_up + (longest_pull_up - shortest_pull_up) / 2\n        bits = []\n\n        for i in range(0, len(pull_up_lengths)):\n            bit = False\n            if pull_up_lengths[i] > halfway:\n                bit = True\n            bits.append(bit)\n\n        return bits\n\n    def __bits_to_bytes(self, bits):\n        the_bytes = []\n        byte = 0\n\n        for i in range(0, len(bits)):\n            byte = byte << 1\n            if (bits[i]):\n                byte = byte | 1\n            else:\n                byte = byte | 0\n            if ((i + 1) % 8 == 0):\n                the_bytes.append(byte)\n                byte = 0\n\n        return the_bytes\n\n    def __calculate_checksum(self, the_bytes):\n        return the_bytes[0] + the_bytes[1] + the_bytes[2] + the_bytes[3] & 255\n\n\ndef readTemperatureDHT11(pin):\n    pin = normalizePin(pin)\n    haveold = False\n\n    try:\n        lasttime = DHT11_last_value[pin]["time"]\n        haveold = True\n        if time.time() - lasttime < 2:\n            return DHT11_last_value[pin]["temperature"]\n    except:\n        pass\n\n\n    instance = DHT11(pin=pin)\n    result = instance.read()\n    if result.is_valid():\n        DHT11_last_value[pin] = {\n            "time": time.time(),\n            "temperature": result.temperature,\n            "humidity": result.humidity\n        }\n        return result.temperature\n    elif haveold:\n        return DHT11_last_value[pin]["temperature"]\n\n    return 0\n\ndef readHumidity(pin):\n    pin = normalizePin(pin)\n    haveold = False\n\n    try:\n        lasttime = DHT11_last_value[pin]["time"]\n        haveold = True\n        if time.time() - lasttime < 2:\n            return DHT11_last_value[pin]["humidity"]\n    except:\n        pass\n\n\n    instance = DHT11(pin=pin)\n    result = instance.read()\n    if result.is_valid():\n        DHT11_last_value[pin] = {\n            "time": time.time(),\n            "temperature": result.temperature,\n            "humidity": result.humidity\n        }\n        return result.humidity\n    elif haveold:\n        return DHT11_last_value[pin]["humidity"]\n\n    return 0\n\ndef currentTime():\n    return time.time() * 1000\n\n\nBMI160_DEVICE_ADDRESS = 0x68\nBMI160_REGA_USR_CHIP_ID      = 0x00\nBMI160_REGA_USR_ACC_CONF_ADDR     = 0x40\nBMI160_REGA_USR_ACC_RANGE_ADDR    = 0x41\nBMI160_REGA_USR_GYR_CONF_ADDR     = 0x42\nBMI160_REGA_USR_GYR_RANGE_ADDR    = 0x43\nBMI160_REGA_CMD_CMD_ADDR          =   0x7e\nBMI160_REGA_CMD_EXT_MODE_ADDR     =   0x7f\nBMI160_REGA_TEMPERATURE           = 0x20\n\nBMX160_MAGN_CONFIG_ADDR         = (0x44)\nBMX160_MAGN_RANGE_ADDR          = (0x4B)\nBMX160_MAGN_IF_0_ADDR           = (0x4C)\nBMX160_MAGN_IF_1_ADDR           = (0x4D)\nBMX160_MAGN_IF_2_ADDR           = (0x4E)\nBMX160_MAGN_IF_3_ADDR           = (0x4F)\nBMX160_MAGN_ODR_ADDR            = (0x44)\n\nCMD_SOFT_RESET_REG      = 0xb6\nCMD_PMU_ACC_SUSPEND     = 0x10\nCMD_PMU_ACC_NORMAL      = 0x11\nCMD_PMU_ACC_LP1         = 0x12\nCMD_PMU_ACC_LP2         = 0x13\nCMD_PMU_GYRO_SUSPEND    = 0x14\nCMD_PMU_GYRO_NORMAL     = 0x15\nCMD_PMU_GYRO_FASTSTART  = 0x17\n\nBMX160_MAGN_NORMAL_MODE               = 0x19\nBMX160_MAGN_ODR_25HZ                  = 0x06\n\nBMX160_MAGN_SUSPEND_MODE              = 0x18\nBMX160_MAGN_NORMAL_MODE               = 0x19\nBMX160_MAGN_LOWPOWER_MODE             = 0x1A\n\nBMI160_USER_DATA_14_ADDR = 0X12 # accel x\nBMI160_USER_DATA_15_ADDR = 0X13 # accel x\nBMI160_USER_DATA_16_ADDR = 0X14 # accel y\nBMI160_USER_DATA_17_ADDR = 0X15 # accel y\nBMI160_USER_DATA_18_ADDR = 0X16 # accel z\nBMI160_USER_DATA_19_ADDR = 0X17 # accel z\n\nBMI160_USER_DATA_8_ADDR  = 0X0C # gyr x\nBMI160_USER_DATA_9_ADDR  = 0X0D # gyr x\nBMI160_USER_DATA_10_ADDR = 0X0E # gyr y\nBMI160_USER_DATA_11_ADDR = 0X0F # gyr y\nBMI160_USER_DATA_12_ADDR = 0X10 # gyr z\nBMI160_USER_DATA_13_ADDR = 0X11 # gyr z\n\nBMI160_USER_DATA_0_ADDR  = 0X04 # mag x\nBMI160_USER_DATA_1_ADDR  = 0X05 # mag x\nBMI160_USER_DATA_2_ADDR  = 0X06 # mag y\nBMI160_USER_DATA_3_ADDR  = 0X07 # mag y\nBMI160_USER_DATA_4_ADDR  = 0X08 # mag z\nBMI160_USER_DATA_5_ADDR  = 0X09 # mag z\n\n\ndef initBMX160Mag():\n    bus = smbus.SMBus(1)\n\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, BMX160_MAGN_NORMAL_MODE)\n    time.sleep(0.00065) # datasheet says wait for 650microsec\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_0_ADDR, 0x80)\n    # put mag into sleep mode\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x01)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x4B)\n    # set x-y to regular power preset\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x04)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x51)\n    # set z to regular preset\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x0E)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x52)\n    # prepare MAG_IF[1-3] for mag_if data mode\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x02)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x4C)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_1_ADDR, 0x42)\n    # Set ODR to 25 Hz\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_ODR_ADDR, BMX160_MAGN_ODR_25HZ)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_0_ADDR, 0x00)\n    # put in low power mode.\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, BMX160_MAGN_NORMAL_MODE)\n\n\ndef initBMI160():\n    global isBMX160\n\n    bus = smbus.SMBus(1)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_ACC_CONF_ADDR, 0x25)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_ACC_RANGE_ADDR, 0x5)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_GYR_CONF_ADDR, 0x26)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_GYR_RANGE_ADDR, 0x1)\n\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_SOFT_RESET_REG)\n\n    time.sleep(0.1)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_PMU_ACC_NORMAL) # Enable ACCEL\n    time.sleep(0.0038)\n    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_PMU_GYRO_NORMAL)  ## Enable Gyro\n    time.sleep(0.080)\n\n    chipid = bus.read_i2c_block_data(0x68, 0x00, 1)\n\n    try:\n        isBMX160 = chipid[0] == 216\n    except:\n        pass\n\n    if isBMX160:\n        initBMX160Mag()\n    \n\ndef readAccelBMI160():\n    global enabledBMI160\n\n    try:\n        if not enabledBMI160:\n            enabledBMI160 = True\n            initBMI160()\n\n        bus = smbus.SMBus(1)\n        acc_value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_14_ADDR, 6)\n        acc_x =  (acc_value[1] << 8) | acc_value[0]\n        acc_y =  (acc_value[3] << 8) | acc_value[2]\n        acc_z =  (acc_value[5] << 8) | acc_value[4]\n\n        if acc_x & 0x8000 != 0:\n            acc_x -= 1 << 16\n\n        if acc_y & 0x8000 != 0:\n            acc_y -= 1 << 16\n\n        if acc_z & 0x8000 != 0:\n            acc_z -= 1 << 16\n\n        acc_x = float(acc_x)  / 16384.0 * 9.81;\n        acc_y = float(acc_y)  / 16384.0 * 9.81;\n        acc_z = float(acc_z) / 16384.0 * 9.81;\n\n        return [round(acc_x, 1), round(acc_y, 1), round(acc_z, 1)]\n    except:\n        enabledBMI160 = False\n        return [0, 0, 0]\n\ndef readAcceleration(axis):\n    acceleration = readAccelBMI160()\n\n    if axis.lower() == "x":\n        return acceleration[0]\n    elif axis.lower() == "y":\n        return acceleration[1]\n    elif axis.lower() == "z":\n        return acceleration[2]\n\n    return 0\n\ndef computeRotation(rotationType):\n    acceleration = readAccelBMI160()\n    zsign = 1\n\n    if acceleration[2] < 0:\n        zsign = -1\n\n    if rotationType.lower() == "pitch":\n        pitch = 180 * math.atan2 (acceleration[0], zsign * math.sqrt(acceleration[1]*acceleration[1] + acceleration[2]*acceleration[2]))/math.pi\n\n        return int(pitch)\n    elif rotationType.lower() == "roll":\n        roll = 180 * math.atan2 (acceleration[1], zsign * math.sqrt(acceleration[0]*acceleration[0] + acceleration[2]*acceleration[2]))/math.pi\n\n        return int(roll)\n\n    return 0\n\n\n\ndef readGyroBMI160():\n    global enabledBMI160\n\n    try:\n        if not enabledBMI160:\n            enabledBMI160 = True\n            initBMI160()\n\n        bus = smbus.SMBus(1)\n        value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_8_ADDR, 15)\n        x =  (value[1] << 8) | value[0]\n        y =  (value[3] << 8) | value[2]\n        z =  (value[5] << 8) | value[4]\n\n        time = (value[14] << 16) | (value[13] << 8) | value[12]\n\n        if x & 0x8000 != 0:\n            x -= 1 << 16\n\n        if y & 0x8000 != 0:\n            y -= 1 << 16\n\n        if z & 0x8000 != 0:\n            z -= 1 << 16\n\n        x = float(x)  * 0.030517578125;\n        y = float(y)  * 0.030517578125;\n        z = float(z)  * 0.030517578125;\n\n        return [x, y, z, time]\n    except:\n        enabledBMI160 = False\n        return [0, 0, 0]\n\ndef twos_comp(val, bits):\n        # Calculate the 2s complement of int:val #\n        if(val&(1<<(bits-1)) != 0):\n                val = val - (1<<bits)\n        return val\n\ndef readTemperatureBMI160(pin):\n    global enabledBMI160\n\n    try:\n        if not enabledBMI160:\n            enabledBMI160 = True\n            initBMI160()\n\n        bus = smbus.SMBus(1)\n        temp_value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_TEMPERATURE, 2)\n\n\n        temp = twos_comp(temp_value[1] << 8 | temp_value[0], 16)\n\n        temp = (temp * 0.0019073486328125) + 22.5\n\n#        if temp & 0x8000:\n            #temp = (23.0 - ((0x10000 - temp)/512.0));\n#        else:\n#            temp = ((temp/512.0) + 23.0);\n\n        return temp\n    except:\n        enabledBMI160 = False\n        return 0\n\nACC_I2C_ADDR = 0x1D\nMAG_I2C_ADDR = 0x1E\n\nCTRL_REG1               = 0x20\nCTRL_REG2               = 0x21\nCTRL_REG3               = 0x22\nCTRL_REG4               = 0x23\nCTRL_REG5               = 0x24\n\nCTRL_REG1_A = 0x20\nCTRL_REG2_A = 0x21\nCTRL_REG3_A = 0x22\nCTRL_REG4_A = 0x23\nCTRL_REG5_A = 0x24\nCTRL_REG6_A = 0x25\nCTRL_REG7_A = 0x26\n\nMAG_OUTX_L     = 0x28\nMAG_OUTX_H     = 0x29\nMAG_OUTY_L     = 0x2A\nMAG_OUTY_H     = 0x2B\nMAG_OUTZ_L     = 0x2C\nMAG_OUTZ_H     = 0x2D\n\n\ndef initLSM303C():\n    bus = smbus.SMBus(1)\n\n    ## Magnetometer\n    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG1, 0x7E) # X, Y High performace, Data rate 80hz\n    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG4, 0x0C) # Z High performace\n    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG5, 0x40)\n    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG3, 0x00)\n\n    ## Accelerometer\n    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG5_A, 0x40)\n    time.sleep(0.05)\n    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG4_A, 0x0C)\n    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG1_A, 0xBF) # High resolution, 100Hz output, enable all three axis\n\n\ndef readMagnetometerLSM303C(allowcalibration=True, calibratedvalues=True):\n    global enabledLSM303C\n    global compassOffset\n    global compassScale\n    global enabledBMI160\n    global isBMX160\n\n    try:\n        if not enabledBMI160:\n            initBMI160()\n            enabledBMI160 = True\n\n        if not isBMX160:\n            if not enabledLSM303C:\n                enabledLSM303C = True\n                initLSM303C()\n\n        if compassOffset is None or compassScale is None:\n            loadCompassCalibration()\n\n        if allowcalibration:\n            if compassOffset is None or compassScale is None:\n                calibrateCompassGame()\n\n        bus = smbus.SMBus(1)\n\n        if isBMX160:\n            value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_0_ADDR, 6)\n        else:\n            value = bus.read_i2c_block_data(MAG_I2C_ADDR, MAG_OUTX_L, 6)\n\n        X =  twos_comp((value[1] << 8) | value[0], 16)\n        Y =  twos_comp((value[3] << 8) | value[2], 16)\n        Z =  twos_comp((value[5] << 8) | value[4], 16)\n\n        X = X * 0.048828125\n        Y = Y * 0.048828125\n        Z = Z * 0.048828125\n\n        if (compassOffset is not None) and (compassScale is not None) and calibratedvalues:\n            X = round((X + compassOffset[0]) * compassScale[0], 0)\n            Y = round((Y + compassOffset[1]) * compassScale[1], 0)\n            Z = round((Z + compassOffset[2])* compassScale[2], 0)\n\n        return [X, Y, Z]\n    except:\n        enabledLSM303C = False\n        return [0, 0, 0]\n\ndef computeCompassHeading():\n    values = readMagnetometerLSM303C()\n\n    heading = math.atan2(values[0],values[1])*(180/math.pi) + 180\n\n    return heading\n\n\ndef reaAccelerometerLSM303C():\n    global enabledLSM303C\n\n    try:\n        if not enabledLSM303C:\n            enabledLSM303C = True\n            initLSM303C()\n\n        bus = smbus.SMBus(1)\n\n        value = bus.read_i2c_block_data(ACC_I2C_ADDR, MAG_OUTX_L, 6)\n\n        X =  twos_comp((value[1] << 8) | value[0], 16)\n        Y =  twos_comp((value[3] << 8) | value[2], 16)\n        Z =  twos_comp((value[5] << 8) | value[4], 16)\n\n        X = round(X * 0.00059814453125, 2)\n        Y = round(Y * 0.00059814453125, 2)\n        Z =  round(Z * 0.00059814453125, 2)\n\n        return [X, Y, Z]\n    except:\n        enabledLSM303C = False\n        return [0, 0, 0]\n\ndef readMagneticForce(axis):\n    maneticforce = readMagnetometerLSM303C()\n\n    if axis.lower() == "x":\n        return maneticforce[0]\n    elif axis.lower() == "y":\n        return maneticforce[1]\n    elif axis.lower() == "z":\n        return maneticforce[2]\n\n    return 0\n\n\ndef readStick(pinup, pindown, pinleft, pinright, pincenter):\n    pinup = normalizePin(pinup)\n    pindown = normalizePin(pindown)\n    pinleft = normalizePin(pinleft)\n    pinright = normalizePin(pinright)\n    pincenter = normalizePin(pincenter)\n\n\n    GPIO.setup(pinup, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    GPIO.setup(pindown, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    GPIO.setup(pinleft, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    GPIO.setup(pinright, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n    GPIO.setup(pincenter, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)\n\n    return [GPIO.input(pinup),\n            GPIO.input(pindown),\n            GPIO.input(pinleft),\n            GPIO.input(pinright),\n            GPIO.input(pincenter)]\n\ndef setInfraredState(pin, state):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        state = int(state)\n\n        cleanupPin(pin)\n\n        pi.set_mode(pin, pigpio.OUTPUT)\n\n        pi.wave_clear()\n        pi.wave_tx_stop()\n\n        if state:\n            wf = []\n\n            wf.append(pigpio.pulse(1<<pin, 0, 13))\n            wf.append(pigpio.pulse(0, 1<<pin, 13))\n\n            pi.wave_add_generic(wf)\n\n            a = pi.wave_create()\n\n            pi.wave_send_repeat(a)\n\ndef changeActiveBuzzerState(pin, state):\n    changePinState(pin, state)\n\n\ndef changePassiveBuzzerState(pin, state):\n    pin = normalizePin(pin)\n    laststate = 255\n\n    try:\n        laststate = passive_buzzer_last_value[pin]\n    except:\n        pass\n\n    state = int(state)\n\n    pin_state[pin] = state\n    if state != laststate:\n        passive_buzzer_last_value[pin] = state\n        pi.set_mode(pin, pigpio.OUTPUT)\n\n        pi.wave_clear()\n        pi.wave_tx_stop()\n\n        if state:\n            wf = []\n\n            wf.append(pigpio.pulse(1<<pin, 0, 500))\n            wf.append(pigpio.pulse(0, 1<<pin, 500))\n\n            pi.wave_add_generic(wf)\n\n            a = pi.wave_create()\n\n            pi.wave_send_repeat(a)\n        else:\n            GPIO.setup(pin, GPIO.OUT)\n            GPIO.output(pin, GPIO.LOW)\n\n\n\ndef getBuzzerNote(pin):\n    pin = normalizePin(pin)\n    frequency = 0\n\n    try:\n        frequency = buzzer_frequency[pin]\n    except:\n        pass\n\n    return frequency\n\n\ndef setLedBrightness(pin, level):\n    pin = normalizePin(pin)\n\n    if level > 1:\n        level = 1\n\n    led_brightness [pin] = level\n\n    pi.set_mode(pin, pigpio.OUTPUT)\n\n    pi.set_mode(pin, pigpio.OUTPUT)\n    pi.set_PWM_frequency(pin,1000)\n    pi.set_PWM_range(pin, 4000)\n\n    dutycycle = int(4000 * level);\n    pi.set_PWM_dutycycle(pin, dutycycle)\n\ndef getLedBrightness(pin):\n    pin = normalizePin(pin)\n    level = 0\n\n    try:\n        level = led_brightness[pin]\n    except:\n        pass\n\n    return level\n\n\ndef readADCADS1015(pin, gain=1):\n    ADS1x15_CONFIG_GAIN = {\n        2/3: 0x0000, # +/- 6.144V\n        1:   0x0200, # +/- 4.096v\n        2:   0x0400, # +/- 2.048v\n        4:   0x0600, # +/- 1.024v\n        8:   0x0800, # +/- 0.512v\n        16:  0x0A00 # +/- 0.256v\n    }\n\n    ADS1x15_GAIN_MAX_VOLTAGE = {\n        2/3: 6.144,\n        1:   4.096,\n        2:   2.048,\n        4:   1.024,\n        8:   0.512,\n        16:  0.256\n    }\n\n\n    ADS1015_CONFIG_DR = {\n        128:   0x0000,\n        250:   0x0020,\n        490:   0x0040,\n        920:   0x0060,\n        1600:  0x0080,\n        2400:  0x00A0,\n        3300:  0x00C0\n    }\n\n    ADS1x15_CONFIG_MUX_OFFSET      = 12\n    ADS1x15_CONFIG_OS_SINGLE       = 0x8000\n    ADS1x15_CONFIG_MODE_SINGLE      = 0x0100\n    ADS1x15_CONFIG_COMP_QUE_DISABLE = 0x0003\n    ADS1x15_POINTER_CONFIG = 0x01\n    ADS1x15_POINTER_CONVERSION     = 0x00\n    ADS1x15_CONFIG_MODE_CONTINUOUS  = 0x0000\n\n    bus = smbus.SMBus(1)\n\n    address = 0x48\n\n    pin = normalizePin(pin)\n\n    mux = pin + 0x04\n    gainbits = ADS1x15_CONFIG_GAIN[gain]\n    data_rate = 0x00C0 #3.3ksps\n\n    config = ADS1x15_CONFIG_OS_SINGLE\n    config |= (mux & 0x07) << ADS1x15_CONFIG_MUX_OFFSET\n    config |= gainbits\n    config |= ADS1x15_CONFIG_MODE_CONTINUOUS\n    config |= data_rate\n    config |= ADS1x15_CONFIG_COMP_QUE_DISABLE\n\n    value = 0\n\n    try:\n        bus.write_i2c_block_data(address, ADS1x15_POINTER_CONFIG, [(config >> 8) & 0xFF, config & 0xFF])\n\n        time.sleep(0.001)\n\n        result = bus.read_i2c_block_data(address, ADS1x15_POINTER_CONVERSION, 2)\n\n        value = twos_comp(result[0] << 8 | result[1], 16)\n\n        max = ADS1x15_GAIN_MAX_VOLTAGE[gain];\n\n        # Normalize the value so that 0v is 0 and 3.3v is 999\n        value = value / (32768. / max  * 3.3 / 1000.)\n\n        if value < 0:\n            value = 0\n\n        if value > 999:\n            value = 999\n    except:\n        pass\n\n    return value\n\n\ndef readSoundLevel(pin):\n    pin = normalizePin(pin)\n    max = -25000\n    min = 25000\n\n    for i in range(20):\n        val = int(readADCADS1015(pin, 16))\n\n        if val > max:\n            max = val\n\n        if val < min:\n            min = val\n\n    return max - min\n\nadcHandler = [\n    {\n        "type": "grovepi",\n        "handler": readGrovePiADC\n    },\n    {\n        "type": "ads1015",\n        "handler": readADCADS1015\n    }\n]\n\n\ndef readADC(pin):\n    try:\n        for handler in adcHandler:\n            if handler["type"] == currentADC:\n                return handler["handler"](pin)\n    except:\n        pass\n\n    return 0\n\ndef readTemperatureGroveAnalog(pin):\n    B = 4275.\n    R0 = 100000.\n\n    val = readADC(pin)\n\n    if val == 0:\n        return 0\n\n    r = 1000. / val - 1.\n    r = R0 * r\n\n    return round(1. / (math.log10(r / R0) / B + 1 / 298.15) - 273.15, 1)\n\n\ndef readRotaryAngle(pin):\n	return int(readADC(pin) / 10)\n\ndef readSoundSensor(pin):\n	return int(readADC(pin) / 10)\n\ndef readLightIntensity(pin):\n	return int((readADC(pin) + 1)/ 10)\n\nsensorHandler = [\n    {\n        "type": "screen",\n        "subType": "oled128x32",\n        "handler": displayTextOled\n    },\n    {\n        "type": "screen",\n        "subType": "16x2lcd",\n        "handler": displayText16x2\n    },\n    {\n        "type": "range",\n        "subType": "vl53l0x",\n        "handler": readDistanceVL53\n    },\n    {\n        "type": "range",\n        "subType": "ultrasonic",\n        "handler": readDistanceUltrasonic\n    },\n    {\n        "type": "temperature",\n        "subType": "BMI160",\n        "handler": readTemperatureBMI160\n    },\n    {\n        "type": "temperature",\n        "subType": "groveanalog",\n        "handler": readTemperatureGroveAnalog\n    },\n    {\n        "type": "temperature",\n        "subType": "DHT11",\n        "handler": readTemperatureDHT11\n    },\n    {\n        "type": "buzzer",\n        "subType": "passive",\n        "handler": changePassiveBuzzerState\n    },\n    {\n        "type": "buzzer",\n        "subType": "active",\n        "handler": changeActiveBuzzerState\n    },\n]\n\ndef nameToHandler(name, type):\n    sensor =  nameToDef(name, "range")\n\n    if sensor is not None:\n        for handler in sensorHandler:\n            if handler["type"] == type and "subType" in sensor and handler["subType"] == sensor["subType"]:\n                return [sensor, handler["handler"]]\n    return None\n\n\ndef readDistance(name):\n    ret =  nameToHandler(name, "range")\n\n    if ret is not None:\n        sensor = ret[0]\n        handler = ret[1]\n\n        return handler(name)\n\n    return 0\n\n\ndef displayText(line1, line2=""):\n    ret =  nameToHandler("screen1", "screen")\n    sensor =  nameToDef("screen1", "screen")\n\n    if ret is not None:\n        sensor = ret[0]\n        handler = ret[1]\n\n        return handler(line1, line2)\n\ndef displayText2Lines(line1, line2=""):\n    return displayText(line1, line2)\n\ndef readTemperature(name):\n    ret =  nameToHandler(name, "temperature")\n\n    if ret is not None:\n        sensor = ret[0]\n        handler = ret[1]\n\n        return round(handler(name), 1)\n\n    return 0\n\ndef setBuzzerState(name, state):\n    ret =  nameToHandler(name, "buzzer")\n\n    pin = normalizePin(name)\n    pin_state[pin] = state\n    if ret is not None:\n        sensor = ret[0]\n        handler = ret[1]\n\n        return handler(name, state)\n\n    return 0\n\ndef setBuzzerNote(pin, frequency):\n    pin = normalizePin(pin)\n\n    pi.set_mode(pin, pigpio.OUTPUT)\n\n    buzzer_frequency [pin] = level\n\n    pi.wave_clear()\n    pi.wave_tx_stop()\n\n    wf = []\n\n    if frequency == 0:\n        pi.wave_tx_stop()\n        GPIO.setup(pin, GPIO.OUT)\n        GPIO.output(pin, GPIO.LOW)\n    else:\n        delay = int(1000000/frequency/2)\n\n        wf.append(pigpio.pulse(1<<pin, 0, delay))\n        wf.append(pigpio.pulse(0, 1<<pin, delay))\n\n        pi.wave_add_generic(wf)\n\n        a = pi.wave_create()\n\n        pi.wave_send_repeat(a)\n\ndef turnBuzzerOn(pin=12):\n    setBuzzerState("buzzer1", 1)\n\ndef turnBuzzerOff(pin=12):\n    setBuzzerState("buzzer1", 0)\n\ndef isBuzzerOn(pin=12):\n    pin = normalizePin(pin)\n    state = 0\n\n    try:\n        state = pin_state[pin]\n    except:\n        pass\n\n    return state\n\n\ndef setBuzzerAudioOutput(value):\n    if value:\n        pi.set_mode(12, pigpio.ALT0) # 12 is PWM0\n    else:\n        pi.set_mode(12, pigpio.ALT1) # 12 normal\n\n\ndef getBuzzerAudioOutput():\n    if pi.get_mode(12) == pigpio.ALT0:\n        return 1\n\n    return 0\n\n\ndef dSquared(c, s):\n    dx = c[0] - s[0]\n    dy = c[1] - s[1]\n    dz = c[2] - s[2]\n\n    return (dx*dx) + (dy*dy) + (dz*dz)\n\ndef measureScore(c, data):\n	minD = 0\n	maxD = 0\n\n	minD = maxD = dSquared(c, data[0])\n	for row in data[1:]:\n		d = dSquared(c, row)\n\n		if d < minD:\n			minD = d\n\n		if d > maxD:\n			maxD = d\n\n	return maxD - minD\n\ndef spherify(centre, data):\n	radius = 0\n	scaleX = 0.0\n	scaleY = 0.0\n	scaleZ = 0.0\n\n	scale = 0.0\n	weightX = 0.0\n	weightY = 0.0\n	weightZ = 0.0\n\n	for row in data:\n		d = math.sqrt(dSquared(centre, row))\n\n	if d > radius:\n		radius = d\n\n	# Now, for each data point, determine a scalar multiplier for the vector between the centre and that point that\n	# takes the point onto the surface of the enclosing sphere.\n	for row in data:\n		# Calculate the distance from this point to the centre of the sphere\n		d = math.sqrt(dSquared(centre, row))\n\n		# Now determine a scalar multiplier that, when applied to the vector to the centre,\n                # will place this point on the surface of the sphere.\n		s = (radius / d) - 1\n\n		scale = max(scale, s)\n\n                # next, determine the scale effect this has on each of our components.\n		dx = (row[0] - centre[0])\n		dy = (row[1] - centre[1])\n		dz = (row[2] - centre[2])\n\n		weightX += s * abs(dx / d)\n		weightY += s * abs(dy / d)\n		weightZ += s * abs(dz / d)\n\n	wmag = math.sqrt((weightX * weightX) + (weightY * weightY) + (weightZ * weightZ))\n\n	scaleX = 1.0 + scale * (weightX / wmag)\n	scaleY = 1.0 + scale * (weightY / wmag)\n	scaleZ = 1.0 + scale * (weightZ / wmag)\n\n	scale = [0, 0, 0]\n	scale[0] = int((1024 * scaleX))\n	scale[1] = int((1024 * scaleY))\n	scale[2] = int((1024 * scaleZ))\n\n	centre[0] = centre[0]\n	centre[1] = centre[1]\n	centre[2] = centre[2]\n\n	return [scale, centre, radius]\n\ndef approximateCentre(data):\n	samples = len(data)\n	centre = [0, 0, 0]\n\n	for row in data:\n		for i in range(3):\n			centre[i] = centre[i] + row[i]\n\n	for i in range(3):\n		centre[i] = int(centre[i] / samples)\n\n\n	#print("centre", centre)\n\n	c = centre\n	best = [0, 0, 0]\n	t = [0, 0,0]\n	score = measureScore(c, data)\n	#print("initial score", score)\n	CALIBRATION_INCREMENT = 10\n	while True:\n		for x in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):\n			for y in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):\n				for z in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):\n					t = c\n					t[0] += x\n					t[1] += y\n					t[2] += z\n					s = measureScore(t, data)\n					#print("try", t, "score", s)\n					if (s < score):\n						score = s\n						best = t\n						print(best)\n\n\n		if (best[0] == c[0]) and (best[1] == c[1]) and (best[2] == c[2]):\n			#print("best is equal to centre", best, c)\n			break\n\n		#print(best)\n		c = best\n\n	return c\n\n\ndef calibrateCompass(data):\n    centre = approximateCentre(data)\n    return spherify(centre, data)\n\ndef loadCompassCalibration():\n    offset = None\n    scale = None\n    try:\n        f = open("/mnt/data/compasscalibration.txt", \'r\')\n        x = f.readline()\n        f.close()\n\n        values = x.split(",")\n\n        if len(values) == 6:\n            offset = [float(values[0]), float(values[1]), float(values[2])]\n            scale = [float(values[3]), float(values[4]), float(values[5])]\n\n        if offset is not None and scale is not None:\n            global compassOffset\n            global compassScale\n\n            compassOffset = offset\n            compassScale = scale\n\n            return [offset, scale]\n    except:\n        pass\n\n    return None\n\ndef saveCompassCalibration(scale, offset):\n    f = open("/mnt/data/compasscalibration.txt", "w+")\n\n    f.write(str(offset[0]) + ","\n             + str(offset[1]) + ","\n             + str(offset[2]) + ","\n             + str(scale[0]) + ","\n             + str(scale[1]) + ","\n             + str(scale[2]) + "\\n")\n\n    f.close()\n\ndef calibrateCompassGame():\n    n = 7\n    scale = 4\n\n    rect = [[0 for x in range(n)] for y in range(n)]\n\n    autoUpdate(False)\n\n    done = False\n    rect_offset_x = 97\n    rect_offset_y = 1\n\n    fill(1)\n    drawText(0, 0, "Rotate the board")\n\n    stroke(1)\n    fill(0)\n    drawRectangle(rect_offset_x - 1, rect_offset_y - 1, (n * scale) + 2, (n * scale) + 2)\n    updateScreen()\n\n    cursor_color = 0\n\n    data = []\n\n    start = time.time()\n    while not done and (time.time() - start) < 30:\n        magvalues =  readMagnetometerLSM303C(False, False)\n        if isBMX160:\n            accelvalues = readAccelBMI160()\n        else:\n            accelvalues =  reaAccelerometerLSM303C()\n        \n        x_accel = accelvalues[0] / 9.8\n        y_accel = accelvalues[1] / 9.8\n\n        data.append(magvalues)\n\n        x_rect = int((x_accel + 1) * (n / 2))\n        y_rect = int((y_accel + 1) * (n / 2))\n\n        if (x_rect >= n):\n            x_rect = n - 1\n        if (x_rect < 0):\n            x_rect = 0\n\n        if (y_rect >= n):\n            y_rect = n - 1\n        if (y_rect < 0):\n            y_rect = 0\n\n        rect[x_rect][y_rect] = 1\n\n	    #print(x_rect, x_accel, y_rect, y_accel)\n\n        done = True # Asume we are done\n        for x in range(n):\n            for y in range(n):\n                if rect[x][y] == 0:\n                    done = False\n                stroke(rect[x][y])\n                fill(rect[x][y])\n\n                if x_rect == x and y_rect == y:\n                    fill(cursor_color)\n                    stroke(cursor_color)\n                    if cursor_color == 1:\n                        cursor_color = 0\n                    else:\n                        cursor_color = 1\n\n                drawRectangle((x * scale) + rect_offset_x,\n					        (y * scale) + rect_offset_y,\n                            scale, scale)\n        updateScreen()\n\n    result = calibrateCompass(data)\n\n    saveCompassCalibration(result[0], result[1])\n\n    global compassOffset\n    global compassScale\n\n    compassOffset = result[0]\n    compassScale = result[1]\n\ngyro_angles = [0, 0, 0]\ngyro_calibration = [0, 0, 0]\nstop_gyro = False\ngyro_thread = None\ngyro_angles_lock = None\n\ndef setGyroZeroAngle():\n    global angles\n    global calibration\n    global gyro_thread\n    global gyro_angles_lock\n\n    if gyro_thread is None:\n        gyro_angles = [0, 0, 0]\n        calibrationsamples = 500\n        samples = 0\n        while samples < calibrationsamples:\n            values = readGyroBMI160()\n\n            gyro_calibration[0] += values[0]\n            gyro_calibration[1] += values[1]\n            gyro_calibration[2] += values[2]\n            samples += 1\n\n        gyro_calibration[0] /= samples\n        gyro_calibration[1] /= samples\n        gyro_calibration[2] /= samples\n\n        gyro_angles_lock = threading.Lock()\n\n        gyro_thread = threading.Thread(target=gyroThread)\n        gyro_thread.start()\n    else:\n        gyro_angles_lock.acquire(True)\n        angles = [0, 0, 0]\n        gyro_angles_lock.release()\n\n\ndef computeRotationGyro():\n    global gyro_angles\n\n    return [int(gyro_angles[0]), int(gyro_angles[1]), int(gyro_angles[2])]\n\ndef gyroThread():\n    global gyro_angles\n    global gyro_calibration\n    global stop_gyro\n\n    lasttime = readGyroBMI160()[3]\n    start = time.time()\n\n    while True:\n        if stop_gyro:\n            break\n        values = readGyroBMI160()\n\n        dt = (values[3] - lasttime) * 3.9e-5\n        lasttime = values[3]\n\n        gyro_angles_lock.acquire(True)\n        gyro_angles[0] += (values[0] - gyro_calibration[0]) * dt\n        gyro_angles[1] += (values[1] - gyro_calibration[1]) * dt\n        gyro_angles[2] += (values[2] - gyro_calibration[2]) * dt\n        gyro_angles_lock.release()\n     \n# Begin getTemperatureFromCloud\n   \ngetTemperatureCloudUrl = "https://cloud.quick-pi.org/cache/weather.php"\ngetTemperatureSupportedTowns = None\n\ndef _getTemperatureSupportedTowns():\n    import requests\n    import json\n\n    return json.loads(requests.get(getTemperatureCloudUrl + "?q=supportedtowns").text)\n\ngetTemperatureCache = {}\n\ndef getTemperatureFromCloud(town):\n    import requests\n    global getTemperatureSupportedTowns\n\n    if getTemperatureSupportedTowns is None:\n        getTemperatureSupportedTowns = _getTemperatureSupportedTowns()\n    \n    current_milli_time = lambda: int(round(time.time() * 1000))\n\n    if not town in getTemperatureSupportedTowns:\n        return "Not supported"\n\n    if town in getTemperatureCache:\n        # lower than 10 minutes\n        if ((current_milli_time() - getTemperatureCache[town]["lastUpdate"]) / 1000) / 60 < 10:\n            return getTemperatureCache[town]["temperature"]\n\n    ret = requests.get(getTemperatureCloudUrl + "?q=" + town).text\n\n    getTemperatureCache[town] = {}\n    getTemperatureCache[town]["lastUpdate"] = current_milli_time()\n    getTemperatureCache[town]["temperature"] = ret\n\n    return ret\n\n# End getTemperatureFromCloud\n\nquickpi_cloudstoreurl = \'http://cloud.quick-pi.org\'\nquickpi_cloudstoreid = ""\nquickpi_cloudstorepw = ""\n\ndef connectToCloudStore(identifier, password):\n        global quickpi_cloudstoreid\n        global quickpi_cloudstorepw\n\n        quickpi_cloudstoreid = identifier\n        quickpi_cloudstorepw = password\n\ndef writeToCloudStore(identifier, key, value):\n        import requests\n        import json\n\n        global quickpi_cloudstoreid\n        global quickpi_cloudstorepw\n\n        data = { "prefix": identifier,\n                "password": quickpi_cloudstorepw,\n                "key": key,\n                "value": json.dumps(value) }\n\n        ret = requests.post(quickpi_cloudstoreurl + \'/api/data/write\', data = data)\n\n        pass\n\ndef readFromCloudStore(identifier, key):\n        import requests\n        import json\n\n        value = 0\n        data = {\'prefix\': identifier, \'key\': key};\n\n        ret = requests.post(quickpi_cloudstoreurl + \'/api/data/read\', data = data)\n\n        #print (ret.json())\n        if ret.json()["success"]:\n                try:\n                        value = json.loads(ret.json()["value"])\n                except:\n                        value = ret.json()["value"]\n\n        return value\n\ndef getNodeID():\n    return nodeId\n\ndef getNeighbors():\n    import json\n    import requests\n    global nodeId\n\n    ret = requests.post(\'http://localhost:5000/api/v1/getNeighbors/{}\'.format(nodeId))\n\n    return ret.json()\n    \n\ndef getNextMessage():\n    import requests\n    global nodeId\n    while True:\n        ret = requests.post(\'http://localhost:5000/api/v1/getNextMessage/{}\'.format(nodeId))\n        returnData = ret.json()\n        if returnData["hasmessage"]:\n            print(returnData["hasmessage"])\n            return returnData["value"]\n    \n        time.sleep(1)\n\ndef sendMessage(toNodeId, message):\n    import requests\n    global nodeId\n    data = {\'fromId\': nodeId,\n            \'message\': message }\n\n    ret = requests.post(\'http://localhost:5000/api/v1/sendMessage/{}\'.format(toNodeId), json = data)\n\ndef submitAnswer(answer):\n    import requests\n    global nodeId\n    data = { \'answer\': answer }\n\n    ret = requests.post(\'http://localhost:5000/api/v1/submitAnswer/{}\'.format(nodeId), json = data)\n\n    print(ret)\n\nlast_tick = 0\nin_code = False\ncode = []\nfetching_code = False\nIRGPIOTRANS = 22\nIRGPIO = 23\nPOST_MS = 15\nPOST_US    = POST_MS * 1000\nPRE_MS     = 200\nPRE_US     = PRE_MS  * 1000\nSHORT = 10\nTOLERANCE  = 25\nTOLER_MIN =  (100 - TOLERANCE) / 100.0\nTOLER_MAX =  (100 + TOLERANCE) / 100.0\nGLITCH = 250\nFREQ = 38.0\nGAP_MS     = 100\nGAP_S      = GAP_MS  / 1000.0\n\n\ninstalled_callback = False\n\nIR_presets = {}\n\ndef IR_compare(p1, p2):\n   """\n   Check that both recodings correspond in pulse length to within\n   TOLERANCE%.  If they do average the two recordings pulse lengths.\n\n   Input\n\n        M    S   M   S   M   S   M    S   M    S   M\n   1: 9000 4500 600 560 600 560 600 1700 600 1700 600\n   2: 9020 4570 590 550 590 550 590 1640 590 1640 590\n\n   Output\n\n   A: 9010 4535 595 555 595 555 595 1670 595 1670 595\n   """\n   if len(p1) != len(p2):\n      return False\n\n   for i in range(len(p1)):\n      v = p1[i] / p2[i]\n      if (v < TOLER_MIN) or (v > TOLER_MAX):\n         return False\n\n   for i in range(len(p1)):\n       p1[i] = int(round((p1[i]+p2[i])/2.0))\n\n   return True\n\ndef IR_normalise(c):\n   entries = len(c)\n   p = [0]*entries # Set all entries not processed.\n   for i in range(entries):\n      if not p[i]: # Not processed?\n         v = c[i]\n         tot = v\n         similar = 1.0\n\n         # Find all pulses with similar lengths to the start pulse.\n         for j in range(i+2, entries, 2):\n            if not p[j]: # Unprocessed.\n               if (c[j]*TOLER_MIN) < v < (c[j]*TOLER_MAX): # Similar.\n                  tot = tot + c[j]\n                  similar += 1.0\n\n         # Calculate the average pulse length.\n         newv = round(tot / similar, 2)\n         c[i] = newv\n\n         # Set all similar pulses to the average value.\n         for j in range(i+2, entries, 2):\n            if not p[j]: # Unprocessed.\n               if (c[j]*TOLER_MIN) < v < (c[j]*TOLER_MAX): # Similar.\n                  c[j] = newv\n                  p[j] = 1\n\ndef IR_end_of_code():\n   global code, fetching_code, SHORT\n   if len(code) > SHORT:\n      IR_normalise(code)\n      fetching_code = False\n   else:\n      code = []\n\ndef IR_callback(gpio, level, tick):\n    global last_tick, in_code, code, fetching_code, IRGPIO, POST_MS, POST_US, PRE_US\n\n    if level != pigpio.TIMEOUT:\n        edge = pigpio.tickDiff(last_tick, tick)\n        last_tick = tick\n\n        if fetching_code:\n            if (edge > PRE_US) and (not in_code): # Start of a code.\n                in_code = True\n                pi.set_watchdog(IRGPIO, POST_MS) # Start watchdog.\n\n            elif (edge > POST_US) and in_code: # End of a code.\n                in_code = False\n                pi.set_watchdog(IRGPIO, 0) # Cancel watchdog.\n                IR_end_of_code()\n\n            elif in_code:\n                code.append(edge)\n\n    else:\n        pi.set_watchdog(IRGPIO, 0) # Cancel watchdog.\n        if in_code:\n            in_code = False\n            IR_end_of_code()\n\ndef readIRMessageCode(sensorname, timeout):\n    global IRGPIO, fetching_code, code, installed_callback, GLITCH\n\n    if not installed_callback:\n        pi.set_mode(IRGPIO, pigpio.INPUT) # IR RX connected to this GPIO.\n        pi.set_glitch_filter(IRGPIO, GLITCH) # Ignore glitches.\n        cb = pi.callback(IRGPIO, pigpio.EITHER_EDGE, IR_callback)\n\n        installed_callback = True\n\n    fetching_code = True\n\n    start = time.time()\n    while fetching_code:\n        time.sleep(0.1)\n        if time.time() - start > timeout/1000:\n            break\n\n    returncode = code\n    code = []\n    return returncode\n\ndef readIRMessage(remotecode, timeout):\n    start = time.time()\n\n    while time.time() - start < timeout / 1000:\n        code = readIRMessageCode(remotecode, timeout)\n\n        for presetname, presetcode in IR_presets.items():\n            if IR_compare(presetcode, code):\n                return presetname\n\n    return ""\n\ndef IR_carrier(gpio, frequency, micros):\n    """\n    Generate carrier square wave.\n    """\n    wf = []\n    cycle = 1000.0 / frequency\n    cycles = int(round(micros/cycle))\n    on = int(round(cycle / 2.0))\n    sofar = 0\n    for c in range(cycles):\n       target = int(round((c+1)*cycle))\n       sofar += on\n       off = target - sofar\n       sofar += off\n       wf.append(pigpio.pulse(1<<gpio, 0, on))\n       wf.append(pigpio.pulse(0, 1<<gpio, off))\n    return wf\n \ndef sendIRMessage(sensorname, name):\n    global IRGPIOTRANS, FREQ\n\n    try:\n        time.sleep(0.20) ## FIXME I need this otherwise this won\'t work if I read the distance sensor first ...\n        pi.set_mode(IRGPIOTRANS, pigpio.OUTPUT)\n        pi.wave_add_new()\n\n        emit_time = time.time()\n\n        code = IR_presets[name]\n\n        marks_wid = {}\n        spaces_wid = {}\n\n        wave = [0]*len(code)\n\n        for i in range(0, len(code)):\n            ci = int(code[i])\n            if i & 1: # Space\n                if ci not in spaces_wid:\n                    pi.wave_add_generic([pigpio.pulse(0, 0, ci)])\n                    spaces_wid[ci] = pi.wave_create()\n                wave[i] = spaces_wid[ci]\n            else: # Mark\n                if ci not in marks_wid:\n                    wf = IR_carrier(IRGPIOTRANS, FREQ, ci)\n                    pi.wave_add_generic(wf)\n                    marks_wid[ci] = pi.wave_create()\n                wave[i] = marks_wid[ci]\n\n        delay = emit_time - time.time()\n\n        if delay > 0.0:\n            time.sleep(delay)\n        \n        pi.wave_chain(wave)\n\n        while pi.wave_tx_busy():\n            time.sleep(0.002)\n\n        emit_time = time.time() + GAP_S\n\n        for i in marks_wid:\n            pi.wave_delete(marks_wid[i])\n\n        marks_wid = {}\n\n        for i in spaces_wid:\n            pi.wave_delete(spaces_wid[i])\n\n        spaces_wid = {}\n    except Exception  as e:\n        pass\n        print("------------------------------------------>", e)\n        \ndef presetIRMessage(name, data):\n    import json\n    global IR_presets\n\n    IR_presets[name] = json.loads(data)\n\n# SPDX-FileCopyrightText: 2017 Tony DiCola for Adafruit Industries\n#\n# SPDX-License-Identifier: MIT\n\nimport math\n\n\n# Configuration constants:\n_SYSRANGE_START = 0x00\n_SYSTEM_THRESH_HIGH = 0x0C\n_SYSTEM_THRESH_LOW = 0x0E\n_SYSTEM_SEQUENCE_CONFIG = 0x01\n_SYSTEM_RANGE_CONFIG = 0x09\n_SYSTEM_INTERMEASUREMENT_PERIOD = 0x04\n_SYSTEM_INTERRUPT_CONFIG_GPIO = 0x0A\n_GPIO_HV_MUX_ACTIVE_HIGH = 0x84\n_SYSTEM_INTERRUPT_CLEAR = 0x0B\n_RESULT_INTERRUPT_STATUS = 0x13\n_RESULT_RANGE_STATUS = 0x14\n_RESULT_CORE_AMBIENT_WINDOW_EVENTS_RTN = 0xBC\n_RESULT_CORE_RANGING_TOTAL_EVENTS_RTN = 0xC0\n_RESULT_CORE_AMBIENT_WINDOW_EVENTS_REF = 0xD0\n_RESULT_CORE_RANGING_TOTAL_EVENTS_REF = 0xD4\n_RESULT_PEAK_SIGNAL_RATE_REF = 0xB6\n_ALGO_PART_TO_PART_RANGE_OFFSET_MM = 0x28\n_I2C_SLAVE_DEVICE_ADDRESS = 0x8A\n_MSRC_CONFIG_CONTROL = 0x60\n_PRE_RANGE_CONFIG_MIN_SNR = 0x27\n_PRE_RANGE_CONFIG_VALID_PHASE_LOW = 0x56\n_PRE_RANGE_CONFIG_VALID_PHASE_HIGH = 0x57\n_PRE_RANGE_MIN_COUNT_RATE_RTN_LIMIT = 0x64\n_FINAL_RANGE_CONFIG_MIN_SNR = 0x67\n_FINAL_RANGE_CONFIG_VALID_PHASE_LOW = 0x47\n_FINAL_RANGE_CONFIG_VALID_PHASE_HIGH = 0x48\n_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT = 0x44\n_PRE_RANGE_CONFIG_SIGMA_THRESH_HI = 0x61\n_PRE_RANGE_CONFIG_SIGMA_THRESH_LO = 0x62\n_PRE_RANGE_CONFIG_VCSEL_PERIOD = 0x50\n_PRE_RANGE_CONFIG_TIMEOUT_MACROP_HI = 0x51\n_PRE_RANGE_CONFIG_TIMEOUT_MACROP_LO = 0x52\n_SYSTEM_HISTOGRAM_BIN = 0x81\n_HISTOGRAM_CONFIG_INITIAL_PHASE_SELECT = 0x33\n_HISTOGRAM_CONFIG_READOUT_CTRL = 0x55\n_FINAL_RANGE_CONFIG_VCSEL_PERIOD = 0x70\n_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI = 0x71\n_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_LO = 0x72\n_CROSSTALK_COMPENSATION_PEAK_RATE_MCPS = 0x20\n_MSRC_CONFIG_TIMEOUT_MACROP = 0x46\n_SOFT_RESET_GO2_SOFT_RESET_N = 0xBF\n_IDENTIFICATION_MODEL_ID = 0xC0\n_IDENTIFICATION_REVISION_ID = 0xC2\n_OSC_CALIBRATE_VAL = 0xF8\n_GLOBAL_CONFIG_VCSEL_WIDTH = 0x32\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_0 = 0xB0\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_1 = 0xB1\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_2 = 0xB2\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_3 = 0xB3\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_4 = 0xB4\n_GLOBAL_CONFIG_SPAD_ENABLES_REF_5 = 0xB5\n_GLOBAL_CONFIG_REF_EN_START_SELECT = 0xB6\n_DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD = 0x4E\n_DYNAMIC_SPAD_REF_EN_START_OFFSET = 0x4F\n_POWER_MANAGEMENT_GO1_POWER_FORCE = 0x80\n_VHV_CONFIG_PAD_SCL_SDA__EXTSUP_HV = 0x89\n_ALGO_PHASECAL_LIM = 0x30\n_ALGO_PHASECAL_CONFIG_TIMEOUT = 0x30\n_VCSEL_PERIOD_PRE_RANGE = 0\n_VCSEL_PERIOD_FINAL_RANGE = 1\n\nimport smbus2\n\nbus = smbus2.SMBus(1)\n\n\ndef _decode_timeout(val):\n    # format: "(LSByte * 2^MSByte) + 1"\n    return float(val & 0xFF) * math.pow(2.0, ((val & 0xFF00) >> 8)) + 1\n\n\ndef _encode_timeout(timeout_mclks):\n    # format: "(LSByte * 2^MSByte) + 1"\n    timeout_mclks = int(timeout_mclks) & 0xFFFF\n    ls_byte = 0\n    ms_byte = 0\n    if timeout_mclks > 0:\n        ls_byte = timeout_mclks - 1\n        while ls_byte > 255:\n            ls_byte >>= 1\n            ms_byte += 1\n        return ((ms_byte << 8) | (ls_byte & 0xFF)) & 0xFFFF\n    return 0\n\n\ndef _timeout_mclks_to_microseconds(timeout_period_mclks, vcsel_period_pclks):\n    macro_period_ns = ((2304 * (vcsel_period_pclks) * 1655) + 500) // 1000\n    return ((timeout_period_mclks * macro_period_ns) + (macro_period_ns // 2)) // 1000\n\n\ndef _timeout_microseconds_to_mclks(timeout_period_us, vcsel_period_pclks):\n    macro_period_ns = ((2304 * (vcsel_period_pclks) * 1655) + 500) // 1000\n    return ((timeout_period_us * 1000) + (macro_period_ns // 2)) // macro_period_ns\n\n\nclass VL53L0X:\n    """Driver for the VL53L0X distance sensor."""\n\n    # Class-level buffer for reading and writing data with the sensor.\n    # This reduces memory allocations but means the code is not re-entrant or\n    # thread safe!\n    _BUFFER = bytearray(3)\n\n    def __init__(self, address=41, io_timeout_s=0):\n        # pylint: disable=too-many-statements\n        self.io_timeout_s = io_timeout_s\n        self._i2c_address = address\n\n\n        # Check identification registers for expected values.\n        # From section 3.2 of the datasheet.\n        if (\n            self._read_u8(0xC0) != 0xEE\n            or self._read_u8(0xC1) != 0xAA\n            or self._read_u8(0xC2) != 0x10\n        ):\n            raise RuntimeError(\n                "Failed to find expected ID register values. Check wiring!"\n            )\n        # Initialize access to the sensor.  This is based on the logic from:\n        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp\n        # Set I2C standard mode.\n        for pair in ((0x88, 0x00), (0x80, 0x01), (0xFF, 0x01), (0x00, 0x00)):\n            self._write_u8(pair[0], pair[1])\n        self._stop_variable = self._read_u8(0x91)\n        for pair in ((0x00, 0x01), (0xFF, 0x00), (0x80, 0x00)):\n            self._write_u8(pair[0], pair[1])\n        # disable SIGNAL_RATE_MSRC (bit 1) and SIGNAL_RATE_PRE_RANGE (bit 4)\n        # limit checks\n        config_control = self._read_u8(_MSRC_CONFIG_CONTROL) | 0x12\n        self._write_u8(_MSRC_CONFIG_CONTROL, config_control)\n        # set final range signal rate limit to 0.25 MCPS (million counts per\n        # second)\n        self.signal_rate_limit = 0.25\n        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xFF)\n        spad_count, spad_is_aperture = self._get_spad_info()\n        # The SPAD map (RefGoodSpadMap) is read by\n        # VL53L0X_get_info_from_device() in the API, but the same data seems to\n        # be more easily readable from GLOBAL_CONFIG_SPAD_ENABLES_REF_0 through\n        # _6, so read it from there.\n        ref_spad_map = bytearray(7)\n        ref_spad_map[0] = _GLOBAL_CONFIG_SPAD_ENABLES_REF_0\n\n#        self._device.write(ref_spad_map, end=1)\n#        self._device.readinto(ref_spad_map, start=1)\n\n        result = bus.read_i2c_block_data(address, ref_spad_map[0], len(ref_spad_map) - 1)\n\n        for i in range(len(result)):\n            ref_spad_map[i + 1] = result[i]\n\n        for pair in (\n            (0xFF, 0x01),\n            (_DYNAMIC_SPAD_REF_EN_START_OFFSET, 0x00),\n            (_DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD, 0x2C),\n            (0xFF, 0x00),\n            (_GLOBAL_CONFIG_REF_EN_START_SELECT, 0xB4),\n        ):\n            self._write_u8(pair[0], pair[1])\n\n        first_spad_to_enable = 12 if spad_is_aperture else 0\n        spads_enabled = 0\n        for i in range(48):\n            if i < first_spad_to_enable or spads_enabled == spad_count:\n                # This bit is lower than the first one that should be enabled,\n                # or (reference_spad_count) bits have already been enabled, so\n                # zero this bit.\n                ref_spad_map[1 + (i // 8)] &= ~(1 << (i % 8))\n            elif (ref_spad_map[1 + (i // 8)] >> (i % 8)) & 0x1 > 0:\n                spads_enabled += 1\n#       self._device.write(ref_spad_map)\n        bus.write_i2c_block_data(address, ref_spad_map[0], ref_spad_map[1:])\n        for pair in (\n            (0xFF, 0x01),\n            (0x00, 0x00),\n            (0xFF, 0x00),\n            (0x09, 0x00),\n            (0x10, 0x00),\n            (0x11, 0x00),\n            (0x24, 0x01),\n            (0x25, 0xFF),\n            (0x75, 0x00),\n            (0xFF, 0x01),\n            (0x4E, 0x2C),\n            (0x48, 0x00),\n            (0x30, 0x20),\n            (0xFF, 0x00),\n            (0x30, 0x09),\n            (0x54, 0x00),\n            (0x31, 0x04),\n            (0x32, 0x03),\n            (0x40, 0x83),\n            (0x46, 0x25),\n            (0x60, 0x00),\n            (0x27, 0x00),\n            (0x50, 0x06),\n            (0x51, 0x00),\n            (0x52, 0x96),\n            (0x56, 0x08),\n            (0x57, 0x30),\n            (0x61, 0x00),\n            (0x62, 0x00),\n            (0x64, 0x00),\n            (0x65, 0x00),\n            (0x66, 0xA0),\n            (0xFF, 0x01),\n            (0x22, 0x32),\n            (0x47, 0x14),\n            (0x49, 0xFF),\n            (0x4A, 0x00),\n            (0xFF, 0x00),\n            (0x7A, 0x0A),\n            (0x7B, 0x00),\n            (0x78, 0x21),\n            (0xFF, 0x01),\n            (0x23, 0x34),\n            (0x42, 0x00),\n            (0x44, 0xFF),\n            (0x45, 0x26),\n            (0x46, 0x05),\n            (0x40, 0x40),\n            (0x0E, 0x06),\n            (0x20, 0x1A),\n            (0x43, 0x40),\n            (0xFF, 0x00),\n            (0x34, 0x03),\n            (0x35, 0x44),\n            (0xFF, 0x01),\n            (0x31, 0x04),\n            (0x4B, 0x09),\n            (0x4C, 0x05),\n            (0x4D, 0x04),\n            (0xFF, 0x00),\n            (0x44, 0x00),\n            (0x45, 0x20),\n            (0x47, 0x08),\n            (0x48, 0x28),\n            (0x67, 0x00),\n            (0x70, 0x04),\n            (0x71, 0x01),\n            (0x72, 0xFE),\n            (0x76, 0x00),\n            (0x77, 0x00),\n            (0xFF, 0x01),\n            (0x0D, 0x01),\n            (0xFF, 0x00),\n            (0x80, 0x01),\n            (0x01, 0xF8),\n            (0xFF, 0x01),\n            (0x8E, 0x01),\n            (0x00, 0x01),\n            (0xFF, 0x00),\n            (0x80, 0x00),\n        ):\n            self._write_u8(pair[0], pair[1])\n\n        self._write_u8(_SYSTEM_INTERRUPT_CONFIG_GPIO, 0x04)\n        gpio_hv_mux_active_high = self._read_u8(_GPIO_HV_MUX_ACTIVE_HIGH)\n        self._write_u8(\n            _GPIO_HV_MUX_ACTIVE_HIGH, gpio_hv_mux_active_high & ~0x10\n        )  # active low\n        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)\n        self._measurement_timing_budget_us = self.measurement_timing_budget\n        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xE8)\n        self.measurement_timing_budget = self._measurement_timing_budget_us\n        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0x01)\n\n        self._perform_single_ref_calibration(0x40)\n        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0x02)\n        self._perform_single_ref_calibration(0x00)\n        # "restore the previous Sequence Config"\n        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xE8)\n\n    def _read_u8(self, address):\n        # Read an 8-bit unsigned value from the specified 8-bit address.\n#        self._BUFFER[0] = address & 0xFF\n#        self._device.write(self._BUFFER, end=1)\n#        self._device.readinto(self._BUFFER, end=1)\n        result = bus.read_i2c_block_data(self._i2c_address, address & 0xFF, 1)\n\n        return result[0]\n\n\n    def _read_u16(self, address):\n        # Read a 16-bit BE unsigned value from the specified 8-bit address.\n#        with self._device:\n#            self._BUFFER[0] = address & 0xFF\n#            self._device.write(self._BUFFER, end=1)\n#            self._device.readinto(self._BUFFER)\n\n#        msg = smbus2.i2c_msg.read(_i2c_address, 2)\n#        result = bus.i2c_rdwr(msg)\n       result = bus.read_i2c_block_data(self._i2c_address, address & 0xFF, 2)\n\n\n       return (result[0] << 8) | result[1]\n\n    def _write_u8(self, address, val):\n        # Write an 8-bit unsigned value to the specified 8-bit address.\n#        with self._device:\n#            self._BUFFER[0] = address & 0xFF\n#        self._BUFFER[1] = val & 0xFF\n#        self._device.write(self._BUFFER, end=2)\n        bus.write_byte_data(self._i2c_address, address & 0xFF, val & 0xFF)\n\n    def _write_u16(self, address, val):\n        # Write a 16-bit BE unsigned value to the specified 8-bit address.\n#        with self._device:\n#            self._BUFFER[0] = address & 0xFF\n#            self._BUFFER[1] = (val >> 8) & 0xFF\n#            self._BUFFER[2] = val & 0xFF\n#            self._device.write(self._BUFFER)\n        self._BUFFER[1] = (val >> 8) & 0xFF\n        self._BUFFER[2] = val & 0xFF\n\n        bus.write_i2c_block_data(self._i2c_address, address & 0xFF, self._BUFFER[1:3])\n\n\n    def _get_spad_info(self):\n        # Get reference SPAD count and type, returned as a 2-tuple of\n        # count and boolean is_aperture.  Based on code from:\n        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp\n        for pair in ((0x80, 0x01), (0xFF, 0x01), (0x00, 0x00), (0xFF, 0x06)):\n            self._write_u8(pair[0], pair[1])\n        self._write_u8(0x83, self._read_u8(0x83) | 0x04)\n        for pair in (\n            (0xFF, 0x07),\n            (0x81, 0x01),\n            (0x80, 0x01),\n            (0x94, 0x6B),\n            (0x83, 0x00),\n        ):\n            self._write_u8(pair[0], pair[1])\n        start = time.monotonic()\n        while self._read_u8(0x83) == 0x00:\n            if (\n                self.io_timeout_s > 0\n                and (time.monotonic() - start) >= self.io_timeout_s\n            ):\n                raise RuntimeError("Timeout waiting for VL53L0X!")\n        self._write_u8(0x83, 0x01)\n        tmp = self._read_u8(0x92)\n        count = tmp & 0x7F\n        is_aperture = ((tmp >> 7) & 0x01) == 1\n        for pair in ((0x81, 0x00), (0xFF, 0x06)):\n            self._write_u8(pair[0], pair[1])\n        self._write_u8(0x83, self._read_u8(0x83) & ~0x04)\n        for pair in ((0xFF, 0x01), (0x00, 0x01), (0xFF, 0x00), (0x80, 0x00)):\n            self._write_u8(pair[0], pair[1])\n        return (count, is_aperture)\n\n    def _perform_single_ref_calibration(self, vhv_init_byte):\n        # based on VL53L0X_perform_single_ref_calibration() from ST API.\n        self._write_u8(_SYSRANGE_START, 0x01 | vhv_init_byte & 0xFF)\n        start = time.monotonic()\n        while (self._read_u8(_RESULT_INTERRUPT_STATUS) & 0x07) == 0:\n            if (\n                self.io_timeout_s > 0\n                and (time.monotonic() - start) >= self.io_timeout_s\n            ):\n                raise RuntimeError("Timeout waiting for VL53L0X!")\n        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)\n        self._write_u8(_SYSRANGE_START, 0x00)\n\n    def _get_vcsel_pulse_period(self, vcsel_period_type):\n        # pylint: disable=no-else-return\n        # Disable should be removed when refactor can be tested\n        if vcsel_period_type == _VCSEL_PERIOD_PRE_RANGE:\n            val = self._read_u8(_PRE_RANGE_CONFIG_VCSEL_PERIOD)\n            return (((val) + 1) & 0xFF) << 1\n        elif vcsel_period_type == _VCSEL_PERIOD_FINAL_RANGE:\n            val = self._read_u8(_FINAL_RANGE_CONFIG_VCSEL_PERIOD)\n            return (((val) + 1) & 0xFF) << 1\n        return 255\n\n    def _get_sequence_step_enables(self):\n        # based on VL53L0X_GetSequenceStepEnables() from ST API\n        sequence_config = self._read_u8(_SYSTEM_SEQUENCE_CONFIG)\n        tcc = (sequence_config >> 4) & 0x1 > 0\n        dss = (sequence_config >> 3) & 0x1 > 0\n        msrc = (sequence_config >> 2) & 0x1 > 0\n        pre_range = (sequence_config >> 6) & 0x1 > 0\n        final_range = (sequence_config >> 7) & 0x1 > 0\n        return (tcc, dss, msrc, pre_range, final_range)\n\n    def _get_sequence_step_timeouts(self, pre_range):\n        # based on get_sequence_step_timeout() from ST API but modified by\n        # pololu here:\n        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp\n        pre_range_vcsel_period_pclks = self._get_vcsel_pulse_period(\n            _VCSEL_PERIOD_PRE_RANGE\n        )\n        msrc_dss_tcc_mclks = (self._read_u8(_MSRC_CONFIG_TIMEOUT_MACROP) + 1) & 0xFF\n        msrc_dss_tcc_us = _timeout_mclks_to_microseconds(\n            msrc_dss_tcc_mclks, pre_range_vcsel_period_pclks\n        )\n        pre_range_mclks = _decode_timeout(\n            self._read_u16(_PRE_RANGE_CONFIG_TIMEOUT_MACROP_HI)\n        )\n        pre_range_us = _timeout_mclks_to_microseconds(\n            pre_range_mclks, pre_range_vcsel_period_pclks\n        )\n        final_range_vcsel_period_pclks = self._get_vcsel_pulse_period(\n            _VCSEL_PERIOD_FINAL_RANGE\n        )\n        final_range_mclks = _decode_timeout(\n            self._read_u16(_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI)\n        )\n        if pre_range:\n            final_range_mclks -= pre_range_mclks\n        final_range_us = _timeout_mclks_to_microseconds(\n            final_range_mclks, final_range_vcsel_period_pclks\n        )\n        return (\n            msrc_dss_tcc_us,\n            pre_range_us,\n            final_range_us,\n            final_range_vcsel_period_pclks,\n            pre_range_mclks,\n        )\n\n    @property\n    def signal_rate_limit(self):\n        """The signal rate limit in mega counts per second."""\n        val = self._read_u16(_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT)\n        # Return value converted from 16-bit 9.7 fixed point to float.\n        return val / (1 << 7)\n\n    @signal_rate_limit.setter\n    def signal_rate_limit(self, val):\n        assert 0.0 <= val <= 511.99\n        # Convert to 16-bit 9.7 fixed point value from a float.\n        val = int(val * (1 << 7))\n        self._write_u16(_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT, val)\n\n    @property\n    def measurement_timing_budget(self):\n        """The measurement timing budget in microseconds."""\n        budget_us = 1910 + 960  # Start overhead + end overhead.\n        tcc, dss, msrc, pre_range, final_range = self._get_sequence_step_enables()\n        step_timeouts = self._get_sequence_step_timeouts(pre_range)\n        msrc_dss_tcc_us, pre_range_us, final_range_us, _, _ = step_timeouts\n        if tcc:\n            budget_us += msrc_dss_tcc_us + 590\n        if dss:\n            budget_us += 2 * (msrc_dss_tcc_us + 690)\n        elif msrc:\n            budget_us += msrc_dss_tcc_us + 660\n        if pre_range:\n            budget_us += pre_range_us + 660\n        if final_range:\n            budget_us += final_range_us + 550\n        self._measurement_timing_budget_us = budget_us\n        return budget_us\n\n    @measurement_timing_budget.setter\n    def measurement_timing_budget(self, budget_us):\n        # pylint: disable=too-many-locals\n        assert budget_us >= 20000\n        used_budget_us = 1320 + 960  # Start (diff from get) + end overhead\n        tcc, dss, msrc, pre_range, final_range = self._get_sequence_step_enables()\n        step_timeouts = self._get_sequence_step_timeouts(pre_range)\n        msrc_dss_tcc_us, pre_range_us, _ = step_timeouts[:3]\n        final_range_vcsel_period_pclks, pre_range_mclks = step_timeouts[3:]\n        if tcc:\n            used_budget_us += msrc_dss_tcc_us + 590\n        if dss:\n            used_budget_us += 2 * (msrc_dss_tcc_us + 690)\n        elif msrc:\n            used_budget_us += msrc_dss_tcc_us + 660\n        if pre_range:\n            used_budget_us += pre_range_us + 660\n        if final_range:\n            used_budget_us += 550\n            # "Note that the final range timeout is determined by the timing\n            # budget and the sum of all other timeouts within the sequence.\n            # If there is no room for the final range timeout, then an error\n            # will be set. Otherwise the remaining time will be applied to\n            # the final range."\n            if used_budget_us > budget_us:\n                raise ValueError("Requested timeout too big.")\n            final_range_timeout_us = budget_us - used_budget_us\n            final_range_timeout_mclks = _timeout_microseconds_to_mclks(\n                final_range_timeout_us, final_range_vcsel_period_pclks\n            )\n            if pre_range:\n                final_range_timeout_mclks += pre_range_mclks\n            self._write_u16(\n                _FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI,\n                _encode_timeout(final_range_timeout_mclks),\n            )\n            self._measurement_timing_budget_us = budget_us\n\n    @property\n    def range(self):\n        """Perform a single reading of the range for an object in front of\n        the sensor and return the distance in millimeters.\n        """\n        # Adapted from readRangeSingleMillimeters &\n        # readRangeContinuousMillimeters in pololu code at:\n        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp\n        for pair in (\n            (0x80, 0x01),\n            (0xFF, 0x01),\n            (0x00, 0x00),\n            (0x91, self._stop_variable),\n            (0x00, 0x01),\n            (0xFF, 0x00),\n            (0x80, 0x00),\n            (_SYSRANGE_START, 0x01),\n        ):\n            self._write_u8(pair[0], pair[1])\n        start = time.monotonic()\n        while (self._read_u8(_SYSRANGE_START) & 0x01) > 0:\n            if (\n                self.io_timeout_s > 0\n                and (time.monotonic() - start) >= self.io_timeout_s\n            ):\n                raise RuntimeError("Timeout waiting for VL53L0X!")\n        start = time.monotonic()\n        while (self._read_u8(_RESULT_INTERRUPT_STATUS) & 0x07) == 0:\n            if (\n                self.io_timeout_s > 0\n                and (time.monotonic() - start) >= self.io_timeout_s\n            ):\n                raise RuntimeError("Timeout waiting for VL53L0X!")\n        # assumptions: Linearity Corrective Gain is 1000 (default)\n        # fractional ranging is not enabled\n        range_mm = self._read_u16(_RESULT_RANGE_STATUS + 10)\n        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)\n        return range_mm\n\n';
  var pythonLibDetection = '\nimport RPi.GPIO as GPIO\nimport pigpio\nimport time\nimport smbus\n\n#quickpi_expected_i2c = [0x1d, 0x1e, 0x29, 0x3c, 0x48, 0x68]\nquickpi_expected_base_i2c = [0x29, 0x3c, 0x48, 0x68]\n\ngrove_expected_i2c = [0x04]\nGPIO.setwarnings(False)\n\ndef listi2cDevices():\n        #Set the screen pin high so that the screen can be detected\n        RESET=21\n        GPIO.setmode(GPIO.BCM)\n        GPIO.setup(RESET, GPIO.OUT)\n        time.sleep(0.01)\n        GPIO.output(RESET, 1)\n\n        pi = pigpio.pi()\n\n        i2c_present = []\n        for device in range(128):\n                h = pi.i2c_open(1, device)\n                try:\n                        pi.i2c_read_byte(h)\n                        i2c_present.append(device)\n                except:\n                        pass\n                pi.i2c_close(h)\n\n        pi.stop()\n\n        return i2c_present\n\ndef detectBoard():\n        i2cdevices = listi2cDevices()\n\n        if i2cdevices == grove_expected_i2c:\n                return "grovepi"\n        else:\n                hasbasesensors = True\n                for dev in quickpi_expected_base_i2c:\n                        if dev not in i2cdevices:\n                                hasbasesensors = False\n\n                if hasbasesensors:\n                        if (0x1d in i2cdevices) and (0x1e in i2cdevices):\n                                return "quickpi" # This is a quickpi with standalone magnetometer\n\n                        else:\n                                bus = smbus.SMBus(1)\n                                chipid = bus.read_i2c_block_data(0x68, 0x00, 1)\n                                if chipid[0] == 216:\n                                        return "quickpi" # This a quickpi with a bmx160 (accel, gyro and mag combo)\n\n\n        if len(i2cdevices) == 0:\n                return "none"\n        else:\n                return "unknow"\n';
  function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32(a << s | a >>> 32 - s, b);
  }
  function ff(a, b, c, d, x, s, t) {
      return cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
      return cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function md51(s) {
      var n = s.length, state = [
          1732584193,
          -271733879,
          -1732584194,
          271733878
      ], i;
      for(i = 64; i <= s.length; i += 64){
          md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      var tail = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
      ];
      for(i = 0; i < s.length; i++)tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      tail[i >> 2] |= 0x80 << (i % 4 << 3);
      if (i > 55) {
          md5cycle(state, tail);
          for(i = 0; i < 16; i++)tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
  }
  /* there needs to be support for Unicode here,
   * unless we pretend that we can redefine the MD-5
   * algorithm for multi-byte characters (perhaps
   * by adding every four 16-bit characters and
   * shortening the sum to 32 bits). Otherwise
   * I suggest performing MD-5 as if every character
   * was two bytes--e.g., 0040 0025 = @%--but then
   * how will an ordinary MD-5 sum be matched?
   * There is no way to standardize text to something
   * like UTF-8 before transformation; speed cost is
   * utterly prohibitive. The JavaScript standard
   * itself needs to look at this: it should start
   * providing access to strings as preformed UTF-8
   * 8-bit unsigned value arrays.
   */ function md5blk(s) {
      var md5blks = [], i; /* Andy King said do it this way. */ 
      for(i = 0; i < 64; i += 4){
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
  }
  var hex_chr = '0123456789abcdef'.split('');
  function rhex(n) {
      var s = '', j = 0;
      for(; j < 4; j++)s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
      return s;
  }
  function hex(x) {
      for(var i = 0; i < x.length; i++)x[i] = rhex(x[i]);
      return x.join('');
  }
  function md5(s) {
      return hex(md51(s));
  }
  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */ function add32(a, b) {
      return a + b & 0xFFFFFFFF;
  }
  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') ;
  var pythonLibHash = md5(pythonLib);

  function _inherits$o(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$o(subClass, superClass);
  }
  function _set_prototype_of$o(o, p) {
      _set_prototype_of$o = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$o(o, p);
  }
  var QuickPiBoard = /*#__PURE__*/ function(AbstractBoard) {
      _inherits$o(QuickPiBoard, AbstractBoard);
      function QuickPiBoard() {
          return AbstractBoard.apply(this, arguments);
      }
      var _proto = QuickPiBoard.prototype;
      _proto.getBoardDefinitions = function getBoardDefinitions() {
          return [
              {
                  name: "grovepi",
                  image: "grovepihat.png",
                  adc: "grovepi",
                  portTypes: {
                      "D": [
                          5,
                          16,
                          18,
                          22,
                          24,
                          26
                      ],
                      "A": [
                          0,
                          2,
                          4,
                          6
                      ],
                      "i2c": [
                          "i2c"
                      ]
                  },
                  default: [
                      {
                          type: "screen",
                          suggestedName: this.strings.messages.sensorNameScreen + "1",
                          port: "i2c",
                          subType: "16x2lcd"
                      },
                      {
                          type: "led",
                          suggestedName: this.strings.messages.sensorNameLed + "1",
                          port: 'D5',
                          subType: "blue"
                      },
                      {
                          type: "servo",
                          suggestedName: this.strings.messages.sensorNameServo + "1",
                          port: "D16"
                      },
                      {
                          type: "range",
                          suggestedName: this.strings.messages.sensorNameDistance + "1",
                          port: "D18",
                          subType: "ultrasonic"
                      },
                      {
                          type: "button",
                          suggestedName: this.strings.messages.sensorNameButton + "1",
                          port: "D22"
                      },
                      {
                          type: "humidity",
                          suggestedName: this.strings.messages.sensorNameHumidity + "1",
                          port: "D24"
                      },
                      {
                          type: "buzzer",
                          suggestedName: this.strings.messages.sensorNameBuzzer + "1",
                          port: "D26",
                          subType: "active"
                      },
                      {
                          type: "temperature",
                          suggestedName: this.strings.messages.sensorNameTemperature + "1",
                          port: 'A0',
                          subType: "groveanalog"
                      },
                      {
                          type: "potentiometer",
                          suggestedName: this.strings.messages.sensorNamePotentiometer + "1",
                          port: "A4"
                      },
                      {
                          type: "light",
                          suggestedName: this.strings.messages.sensorNameLight + "1",
                          port: "A6"
                      }
                  ]
              },
              {
                  name: "quickpi",
                  image: "quickpihat.png",
                  adc: "ads1015",
                  portTypes: {
                      "D": [
                          5,
                          16,
                          24
                      ],
                      "A": [
                          0
                      ]
                  },
                  builtinSensors: [
                      {
                          type: "screen",
                          subType: "oled128x32",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameScreen + "1"
                      },
                      {
                          type: "led",
                          subType: "red",
                          port: "D4",
                          suggestedName: this.strings.messages.sensorNameRedLed + "1"
                      },
                      {
                          type: "led",
                          subType: "green",
                          port: "D17",
                          suggestedName: this.strings.messages.sensorNameGreenLed + "1"
                      },
                      {
                          type: "led",
                          subType: "blue",
                          port: "D27",
                          suggestedName: this.strings.messages.sensorNameBlueLed + "1"
                      },
                      {
                          type: "irtrans",
                          port: "D22",
                          suggestedName: this.strings.messages.sensorNameIrTrans + "1"
                      },
                      {
                          type: "irrecv",
                          port: "D23",
                          suggestedName: this.strings.messages.sensorNameIrRecv + "1"
                      },
                      {
                          type: "sound",
                          port: "A1",
                          suggestedName: this.strings.messages.sensorNameMicrophone + "1"
                      },
                      {
                          type: "buzzer",
                          subType: "passive",
                          port: "D12",
                          suggestedName: this.strings.messages.sensorNameBuzzer + "1"
                      },
                      {
                          type: "accelerometer",
                          subType: "BMI160",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameAccelerometer + "1"
                      },
                      {
                          type: "gyroscope",
                          subType: "BMI160",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameGyroscope + "1"
                      },
                      {
                          type: "magnetometer",
                          subType: "LSM303C",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameMagnetometer + "1"
                      },
                      {
                          type: "temperature",
                          subType: "BMI160",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameTemperature + "1"
                      },
                      {
                          type: "range",
                          subType: "vl53l0x",
                          port: "i2c",
                          suggestedName: this.strings.messages.sensorNameDistance + "1"
                      },
                      {
                          type: "button",
                          port: "D26",
                          suggestedName: this.strings.messages.sensorNameButton + "1"
                      },
                      {
                          type: "light",
                          port: "A2",
                          suggestedName: this.strings.messages.sensorNameLight + "1"
                      },
                      {
                          type: "stick",
                          port: "D7",
                          suggestedName: this.strings.messages.sensorNameStick + "1"
                      }
                  ]
              },
              {
                  name: "pinohat",
                  image: "pinohat.png",
                  adc: [
                      "ads1015",
                      "none"
                  ],
                  portTypes: {
                      "D": [
                          5,
                          16,
                          24
                      ],
                      "A": [
                          0
                      ],
                      "i2c": [
                          "i2c"
                      ]
                  }
              }
          ];
      };
      _proto.getAvailableConnectionMethods = function getAvailableConnectionMethods() {
          return [
              ConnectionMethod.Local,
              ConnectionMethod.Wifi,
              ConnectionMethod.Usb,
              ConnectionMethod.Bluetooth
          ];
      };
      _proto.getConnection = function getConnection() {
          return getQuickPiConnection;
      };
      _proto.getCustomBlocks = function getCustomBlocks(context, strings) {
          var quickpiModule = quickpiModuleDefinition(context, strings);
          return mergeModuleDefinitions({
              quickpi: [
                  quickpiModule
              ]
          });
      };
      return QuickPiBoard;
  }(AbstractBoard);
  var quickPiBoard = new QuickPiBoard();

  function showasConnecting(context) {
      $('#piconnectprogress').show();
      $('#piinstallcheck').hide();
      $('#piinstallprogresss').hide();
      $("#piconnectprogressicon").show();
      $("#piconnectwifiicon").hide();
      if (context.sensorStateListener) {
          context.sensorStateListener('disconnected');
      }
  }

  function getConnectionDialogHTML(availableConnectionMethods, strings, boardDefinitions, sensorDefinitions) {
      var allConnectionMethods = [
          {
              name: ConnectionMethod.Local,
              icon: 'fas fa-location-arrow',
              label: strings.messages.local
          },
          {
              name: ConnectionMethod.Wifi,
              icon: 'fa fa-wifi',
              label: 'WiFi'
          },
          {
              name: ConnectionMethod.Usb,
              icon: 'fab fa-usb',
              label: 'USB'
          },
          {
              name: ConnectionMethod.Bluetooth,
              icon: 'fab fa-bluetooth-b',
              label: 'Bluetooth'
          },
          {
              name: ConnectionMethod.WebSerial,
              icon: 'fa fa-network-wired',
              label: 'WebSerial'
          }
      ];
      return '\n    <div id="quickpiViewer" class="content connectPi qpi" style="display: block;">\n       <div class="content">\n          <div class="panel-heading">\n             <h2 class="sectionTitle">\n                <span class="iconTag">\n                  <i class="icon fas fa-list-ul">\n                  </i>\n                </span>\n                ' + strings.messages.raspiConfig + '       \n             </h2>\n             <div class="exit" id="picancel">\n                <i class="icon fas fa-times">\n                </i>\n             </div>\n          </div>\n          <div class="panel-body">\n             <div class="navigation">\n                <div class="navigationContent">\n                   <input type="checkbox" id="showNavigationContent" role="button">\n                   <ul>\n                      <li id="qpi-portsnames">\n                         ' + strings.messages.display + '\n                      </li>\n                      <li id="qpi-components">\n                         ' + strings.messages.components + "\n                      </li>\n                      " + (boardDefinitions.length > 1 ? '\n                      <li id="qpi-change-board">' + strings.messages.changeBoard + "</li>\n                      " : '') + '\n                      <li id="qpi-connection" class="selected">\n                         ' + strings.messages.connection + '\n                      </li>\n                   </ul>\n                </div>\n             </div>\n             <div class="viewer">\n                <div id="qpi-uiblock-portsnames" class="hiddenContent viewerInlineContent" >\n                   ' + strings.messages.displayPrompt + '\n                   <div class="switchRadio btn-group" id="pi-displayconf">\n                      <button type="button" class="btn active" id="picomponentname">\n                      <i class="fas fa-microchip icon">\n                      </i>\n                      ' + strings.messages.componentNames + '</button>\n                      <button type="button" class="btn" id="piportname">\n                      <i class="fas fa-plug icon">\n                      </i>\n                      ' + strings.messages.portNames + "</button>\n                   </div>\n                   <div id='example_sensor'>\n                      <span id='name'>\n                        " + sensorDefinitions[17].suggestedName + "1</span>\n                      <span id='port'>\n                        " + sensorDefinitions[17].portType + "5</span>\n                      <img src=" + getImg(sensorDefinitions[17].selectorImages[0]) + '>\n                      </span>\n                   </div>\n                </div>\n                <div id="qpi-uiblock-components" class="hiddenContent viewerInlineContent" >\n                   <div id="tabs">\n                      <div id="tabs_back"></div>\n                      <div id=\'remove_tab\' class=\'tab selected\'>\n                         ' + strings.messages.removeSensor + "\n                      </div>\n                      <div id='add_tab' class='tab'>\n                         " + strings.messages.add + '\n                      </div>\n                   </div>\n                   <div id="remove_cont">\n                      <div id="sensorGrid"></div>\n                      <div class=\'buttonContainer\' >\n                         <button id="piremovesensor" class="btn">\n                         <i class="fas fa-trash icon">\n                         </i>\n                         ' + strings.messages.removeSensor + '</button>\n                      </div>\n                   </div>\n                   <div id="add_cont" class=\'hiddenContent\' >\n                      <div id="addSensorGrid"></div>\n                      <div class=\'buttonContainer\' >\n                         <button id="piaddsensor" class="btn">\n                         <i class="fas fa-plus icon">\n                         </i>\n                         ' + strings.messages.add + '</button>\n                      </div>\n                   </div>\n                </div>\n                <div id="qpi-uiblock-change-board" class="hiddenContent viewerInlineContent">\n                   <div class="panel-body">\n                      <div id=boardlist>\n                      </div>\n                   </div>\n                </div>\n                <div id="qpi-uiblock-connection" class="hiddenContent viewerInlineContent">\n                   <div class="switchRadio btn-group" id="piconsel">\n                      ' + allConnectionMethods.filter(function(connectionMethod) {
          return availableConnectionMethods.includes(connectionMethod.name);
      }).map(function(connectionMethod) {
          return '\n                          <button type="button" class="btn" id="picon' + connectionMethod.name + '">\n                             <i class="' + connectionMethod.icon + ' icon"></i>\n                              ' + connectionMethod.label + "\n                          </button>";
      }) + '\n                   </div>\n                   <div id="pischoolcon">\n                      <div class="form-group">\n                         <label id="pischoolkeylabel">\n                         ' + strings.messages.schoolKey + '</label>\n                         <div class="input-group">\n                            <div class="input-group-prepend">\n                               Aa\n                            </div>\n                            <input type="text" id="schoolkey" class="form-control">\n                         </div>\n                      </div>\n                      <div class="form-group">\n                         <label id="pilistlabel">\n                         ' + strings.messages.connectList + '</label>\n                         <div class="input-group">\n                            <button class="input-group-prepend" id=pigetlist disabled>\n                            ' + strings.messages.getPiList + '</button>\n                            <select id="pilist" class="custom-select" disabled>\n                            </select>\n                         </div>\n                      </div>\n                      <div class="form-group">\n                         <label id="piiplabel">\n                         ' + strings.messages.enterIpAddress + '</label>\n                         <div class="input-group">\n                            <div class="input-group-prepend">\n                               123\n                            </div>\n                            <input id=piaddress type="text" class="form-control">\n                         </div>\n                      </div>\n                      <div>\n                         <input id="piusetunnel" disabled type="checkbox">\n                         ' + strings.messages.connectTroughtTunnel + '               \n                      </div>\n                   </div>\n                   <div id="panel-body-usbbt">\n                      <label id="piconnectionlabel">\n                      </label>\n                   </div>\n                   <div id="panel-body-local">\n                      <label id="piconnectionlabellocal">\n                      </label>\n                      <div id="piconnectolocalhost">\n                         <input type="radio" id="piconnectolocalhostcheckbox" name="pilocalconnectiontype" value="localhost">\n                         ' + strings.messages.connectToLocalhost + '               \n                      </div>\n                      <div id="piconnectocurrenturl">\n                         <input type="radio" id="piconnectocurrenturlcheckbox" name="pilocalconnectiontype" value="currenturl">\n                         ' + strings.messages.connectToWindowLocation + '               \n                      </div>\n                   </div>\n                   <div class="inlineButtons">\n                      <button id="piconnectok" class="btn">\n                        <i id="piconnectprogressicon" class="fas fa-spinner fa-spin icon"></i>\n                        <i id="piconnectwifiicon" class="fa fa-link icon"></i>\n                        ' + strings.messages.connectToDevice + '\n                      </button>\n                      <button id="pirelease" class="btn">\n                        <i class="fa fa-times icon"></i>\n                        ' + strings.messages.disconnectFromDevice + "\n                      </button>\n                   </div>\n                </div>\n             </div>\n          </div>\n       </div>\n    </div>\n    ";
  }

  function _array_like_to_array$5(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _unsupported_iterable_to_array$5(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$5(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$5(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$5(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$5(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var AbstractSensor = function AbstractSensor(sensorData, context, strings) {
      this.context = context;
      this.strings = strings;
      for(var _iterator = _create_for_of_iterator_helper_loose$5(Object.entries(sensorData)), _step; !(_step = _iterator()).done;){
          var _step_value = _step.value, key = _step_value[0], value = _step_value[1];
          this[key] = value;
      }
  };

  function _inherits$n(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$n(subClass, superClass);
  }
  function _set_prototype_of$n(o, p) {
      _set_prototype_of$n = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$n(o, p);
  }
  var SensorLed = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$n(SensorLed, AbstractSensor);
      function SensorLed() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'led';
          return _this;
      }
      var _proto = SensorLed.prototype;
      _proto.setLiveState = function setLiveState(state, callback) {
          var ledstate = state ? 1 : 0;
          var command = "setLedState(\"" + this.name + "\"," + ledstate + ")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.getInitialState = function getInitialState() {
          return false;
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var fadeopacity = param.fadeopacity, sensorAttr = param.sensorAttr, imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, state1x = param.state1x, state1y = param.state1y;
          if (this.stateText) this.stateText.remove();
          if (this.state == null) this.state = 0;
          if (!this.ledoff || sensorHandler.isElementRemoved(this.ledoff)) {
              this.ledoff = this.context.paper.image(getImg('ledoff.png'), imgx, imgy, imgw, imgh);
              this.focusrect.click(function() {
                  if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                      _this.state = !_this.state;
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.drawSensor(_this);
                  } else {
                      sensorHandler.actuatorsInRunningModeError();
                  }
              });
          }
          if (!this.ledon || sensorHandler.isElementRemoved(this.ledon)) {
              var imagename = "ledon-";
              if (this.subType) imagename += this.subType;
              else imagename += "red";
              imagename += ".png";
              this.ledon = this.context.paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
          }
          this.ledon.attr(sensorAttr);
          this.ledoff.attr(sensorAttr);
          if (this.showAsAnalog) {
              this.stateText = this.context.paper.text(state1x, state1y, this.state);
          } else {
              if (this.state) {
                  this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.on.toUpperCase());
              } else {
                  this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.off.toUpperCase());
              }
          }
          if (this.state) {
              this.ledon.attr({
                  "opacity": fadeopacity
              });
              this.ledoff.attr({
                  "opacity": 0
              });
          } else {
              this.ledon.attr({
                  "opacity": 0
              });
              this.ledoff.attr({
                  "opacity": fadeopacity
              });
          }
          // let x = typeof sensor.state;
          if (typeof this.state == 'number') {
              this.ledon.attr({
                  "opacity": this.state * fadeopacity
              });
              this.ledoff.attr({
                  "opacity": fadeopacity
              });
          }
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
      };
      SensorLed.getDefinition = function getDefinition(context, strings) {
          return {
              name: "led",
              suggestedName: strings.messages.sensorNameLed,
              description: strings.messages.led,
              isAnalog: false,
              isSensor: false,
              portType: "D",
              selectorImages: [
                  "ledon-red.png"
              ],
              valueType: "boolean",
              pluggable: true,
              getPercentageFromState: function getPercentageFromState(state) {
                  if (state) return 1;
                  else return 0;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return 1;
                  else return 0;
              },
              getStateString: function getStateString(state) {
                  return state ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase();
              },
              subTypes: [
                  {
                      subType: "blue",
                      description: strings.messages.blueled,
                      selectorImages: [
                          "ledon-blue.png"
                      ],
                      suggestedName: strings.messages.sensorNameBlueLed
                  },
                  {
                      subType: "green",
                      description: strings.messages.greenled,
                      selectorImages: [
                          "ledon-green.png"
                      ],
                      suggestedName: strings.messages.sensorNameGreenLed
                  },
                  {
                      subType: "orange",
                      description: strings.messages.orangeled,
                      selectorImages: [
                          "ledon-orange.png"
                      ],
                      suggestedName: strings.messages.sensorNameOrangeLed
                  },
                  {
                      subType: "red",
                      description: strings.messages.redled,
                      selectorImages: [
                          "ledon-red.png"
                      ],
                      suggestedName: strings.messages.sensorNameRedLed
                  }
              ]
          };
      };
      return SensorLed;
  }(AbstractSensor);

  function _inherits$m(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$m(subClass, superClass);
  }
  function _set_prototype_of$m(o, p) {
      _set_prototype_of$m = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$m(o, p);
  }
  var SensorLedRgb = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$m(SensorLedRgb, AbstractSensor);
      function SensorLedRgb() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'ledrgb';
          return _this;
      }
      var _proto = SensorLedRgb.prototype;
      _proto.setLiveState = function setLiveState(state, callback) {
          var command = 'setLedRgbState("' + this.name + '", [' + state.join(', ') + "])";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.getInitialState = function getInitialState() {
          return [
              0,
              0,
              0
          ];
      };
      _proto.draw = function draw(sensorHandler, param) {
          var sensorAttr = param.sensorAttr, imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, state1x = param.state1x, state1y = param.state1y, juststate = param.juststate;
          if (this.stateText) this.stateText.remove();
          if (this.state == null) this.state = 0;
          if (!this.ledimage || sensorHandler.isElementRemoved(this.ledimage)) {
              var imagename = "ledoff.png";
              this.ledimage = this.context.paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
          }
          if (!this.ledcolor || sensorHandler.isElementRemoved(this.ledcolor)) {
              this.ledcolor = this.context.paper.circle();
          }
          this.ledimage.attr(sensorAttr);
          this.ledcolor.attr(sensorAttr);
          this.ledcolor.attr({});
          this.ledcolor.attr({
              "cx": imgx + imgw / 2,
              "cy": imgy + imgh * 0.3,
              "r": imgh * 0.15,
              fill: this.state ? "rgb(" + this.state.join(',') + ")" : 'none',
              stroke: 'none',
              opacity: 0.5
          });
          this.stateText = this.context.paper.text(state1x, state1y, "" + (this.state ? this.state.join(',') : ''));
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 255);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          sensorHandler.getSensorDrawer().drawMultipleTimeLine(this, state, expectedState, type, drawParameters);
      };
      SensorLedRgb.getDefinition = function getDefinition(context, strings) {
          return {
              name: "ledrgb",
              suggestedName: strings.messages.sensorNameLedRgb,
              description: strings.messages.ledrgb,
              isAnalog: true,
              isSensor: false,
              portType: "D",
              selectorImages: [
                  "ledon-red.png"
              ],
              valueType: "object",
              valueMin: 0,
              valueMax: 255,
              pluggable: true,
              getPercentageFromState: function getPercentageFromState(state) {
                  if (state) return state / 255;
                  else return 0;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return Math.round(percentage * 255);
                  else return 0;
              },
              getStateString: function getStateString(state) {
                  return "[" + state.join(', ') + "]";
              }
          };
      };
      return SensorLedRgb;
  }(AbstractSensor);

  function _inherits$l(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$l(subClass, superClass);
  }
  function _set_prototype_of$l(o, p) {
      _set_prototype_of$l = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$l(o, p);
  }
  var SensorLedDim = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$l(SensorLedDim, AbstractSensor);
      function SensorLedDim() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'leddim';
          return _this;
      }
      var _proto = SensorLedDim.prototype;
      _proto.setLiveState = function setLiveState(state, callback) {
          var command = "setLedDimState(\"" + this.name + "\"," + state + ")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.getInitialState = function getInitialState() {
          return 0;
      };
      _proto.draw = function draw(sensorHandler, param) {
          var fadeopacity = param.fadeopacity, sensorAttr = param.sensorAttr, imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, state1x = param.state1x, state1y = param.state1y, juststate = param.juststate;
          if (this.stateText) this.stateText.remove();
          if (this.state == null) this.state = 0;
          if (!this.ledoff || sensorHandler.isElementRemoved(this.ledoff)) {
              this.ledoff = this.context.paper.image(getImg('ledoff.png'), imgx, imgy, imgw, imgh);
          }
          if (!this.ledon || sensorHandler.isElementRemoved(this.ledon)) {
              var imagename = "ledon-";
              if (this.subType) imagename += this.subType;
              else imagename += "red";
              imagename += ".png";
              this.ledon = this.context.paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
          }
          this.ledon.attr(sensorAttr);
          this.ledoff.attr(sensorAttr);
          this.stateText = this.context.paper.text(state1x, state1y, Math.round(100 * this.state) + '%');
          if (this.state) {
              this.ledon.attr({
                  "opacity": fadeopacity
              });
              this.ledoff.attr({
                  "opacity": 0
              });
          } else {
              this.ledon.attr({
                  "opacity": 0
              });
              this.ledoff.attr({
                  "opacity": fadeopacity
              });
          }
          if (typeof this.state == 'number') {
              this.ledon.attr({
                  "opacity": this.state * fadeopacity
              });
              this.ledoff.attr({
                  "opacity": fadeopacity
              });
          }
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
          if (!this.context.autoGrading && (!this.context.runner || !this.context.runner.isRunning())) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 1);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorLedDim.getDefinition = function getDefinition(context, strings) {
          return {
              name: "leddim",
              suggestedName: strings.messages.sensorNameLedDim,
              description: strings.messages.ledDim,
              isAnalog: true,
              isSensor: false,
              portType: "D",
              selectorImages: [
                  "ledon-red.png"
              ],
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 1,
              getPercentageFromState: function getPercentageFromState(state) {
                  return state;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return percentage;
              },
              getStateFromPwm: function getStateFromPwm(duty) {
                  return duty / 1023;
              },
              getStateString: function getStateString(state) {
                  return Math.round(state * 100) + "%";
              }
          };
      };
      return SensorLedDim;
  }(AbstractSensor);

  function drawBubbleTimeline(sensor, sensorHandler, state, expectedState, type, drawParameters, drawBubble) {
      var startx = drawParameters.startx, ypositionmiddle = drawParameters.ypositionmiddle, color = drawParameters.color, strokewidth = drawParameters.strokewidth;
      var sensorDef = sensorHandler.findSensorDefinition(this);
      if (type != "actual" || !sensor.lastState || !sensorDef.compareState(sensor.lastState, state)) {
          console.trace('draw bubble', {
              state: state,
              expectedState: expectedState,
              type: type,
              drawParameters: drawParameters
          });
          this.lastWifiState = state;
          var stateBubble = sensor.context.paper.text(startx, ypositionmiddle + 10, '\uf27a');
          stateBubble.attr({
              "font": "Font Awesome 5 Free",
              "stroke": color,
              "fill": color,
              "font-size": strokewidth * 2 + "px"
          });
          stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
          stateBubble.node.style.fontWeight = "bold";
          var showPopup = function(event) {
              if (!sensor.showingTooltip) {
                  var bubbleHtmlElement = drawBubble();
                  displayTooltip(event, bubbleHtmlElement);
                  sensor.showingTooltip = true;
              }
          };
          $(stateBubble.node).mouseenter(showPopup);
          $(stateBubble.node).click(showPopup);
          $(stateBubble.node).mouseleave(function(event) {
              sensor.showingTooltip = false;
              $('#screentooltip').remove();
          });
          drawParameters.drawnElements.push(stateBubble);
          sensor.context.sensorStates.push(stateBubble);
      } else {
          drawParameters.deleteLastDrawnElements = false;
      }
  }
  function displayTooltip(event, mainDiv) {
      $("body").append('<div id="screentooltip"></div>');
      $('#screentooltip').css("position", "absolute").css("border", "1px solid gray").css("background-color", "#efefef").css("padding", "3px").css("z-index", "1000").css("left", event.clientX + 2).css("top", event.clientY + 2).append(mainDiv);
  }

  function _inherits$k(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$k(subClass, superClass);
  }
  function _set_prototype_of$k(o, p) {
      _set_prototype_of$k = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$k(o, p);
  }
  var SensorLedMatrix = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$k(SensorLedMatrix, AbstractSensor);
      function SensorLedMatrix() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'ledmatrix';
          return _this;
      }
      var _proto = SensorLedMatrix.prototype;
      _proto.setLiveState = function setLiveState(state, callback) {
          var stateString = state.map(function(a) {
              return a.join('');
          }).join(':');
          var command = 'ledMatrixShowImage("' + this.name + '", Image("' + stateString + '"))';
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.getInitialState = function getInitialState() {
          return [
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ]
          ];
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh;
          if (this.stateText) this.stateText.remove();
          if (!this.state || !this.state.length) this.state = [
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ],
              [
                  0,
                  0,
                  0,
                  0,
                  0
              ]
          ];
          var ledmatrixOnAttr = {
              fill: 'red',
              stroke: 'transparent',
              opacity: 0
          };
          var ledmatrixOffAttr = {
              fill: 'lightgray',
              stroke: 'darkgray'
          };
          if (!this.ledmatrixOff || sensorHandler.isElementRemoved(this.ledmatrixOff[0][0])) {
              this.ledmatrixOff = [];
              this.ledmatrixOn = [];
              for(var y = 0; y < 5; y++){
                  this.ledmatrixOff[y] = [];
                  this.ledmatrixOn[y] = [];
                  for(var x = 0; x < 5; x++){
                      this.ledmatrixOff[y][x] = this.context.paper.rect(imgx + imgw / 5 * x, imgy + imgh / 5 * y, imgw / 5, imgh / 5);
                      this.ledmatrixOff[y][x].attr(ledmatrixOffAttr);
                      this.ledmatrixOn[y][x] = this.context.paper.rect(imgx + imgw / 5 * x, imgy + imgh / 5 * y, imgw / 5, imgh / 5);
                      this.ledmatrixOn[y][x].attr(ledmatrixOnAttr);
                  }
              }
          }
          for(var y1 = 0; y1 < 5; y1++){
              for(var x1 = 0; x1 < 5; x1++){
                  this.ledmatrixOn[y1][x1].attr({
                      opacity: this.state[y1][x1] / 10
                  });
              }
          }
          var ledMatrixListener = function(imgx, imgy, imgw, imgh, sensor) {
              return function(e) {
                  if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                      var x = Math.floor((e.offsetX - imgx) / (imgw / 5));
                      var y = Math.floor((e.offsetY - imgy) / (imgh / 5));
                      sensor.state[y][x] = (sensor.state[y][x] + 1) % 10;
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.drawSensor(_this);
                      if ((!_this.context.runner || !_this.context.runner.isRunning()) && !_this.context.offLineMode) {
                          _this.setLiveState(_this.state, function() {});
                      }
                  } else {
                      sensorHandler.actuatorsInRunningModeError();
                  }
              };
          };
          this.focusrect.unclick();
          this.focusrect.click(ledMatrixListener(imgx, imgy, imgw, imgh, this));
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          var drawBubble = function() {
              var table = "<table>\n        " + state.map(function(line, y) {
                  return "<tr>\n            " + line.map(function(cell, x) {
                      return '<td style="width: 20px; height: 20px; position: relative; background: lightgrey; border: solid 1px darkgrey">\n                <div style="top: 0; left: 0; right: 0; bottom: 0; position: absolute; background: red; opacity: ' + state[y][x] / 10 + '"></div>\n              </td>';
                  }).join('') + "\n          </tr>";
              }).join('') + "\n        </table>";
              var div = document.createElement("div");
              $(div).html(table);
              return div;
          };
          drawBubbleTimeline(this, sensorHandler, state, expectedState, type, drawParameters, drawBubble);
      };
      SensorLedMatrix.getDefinition = function getDefinition(context, strings) {
          return {
              name: "ledmatrix",
              suggestedName: strings.messages.sensorNameLedMatrix,
              description: strings.messages.ledmatrix,
              isAnalog: false,
              isSensor: false,
              portType: "D",
              selectorImages: [
                  "ledon-red.png"
              ],
              valueType: "boolean",
              pluggable: true,
              getStateString: function getStateString(state) {
                  return '';
              },
              getWrongStateString: function getWrongStateString(failInfo) {
                  if (!failInfo.expected || !failInfo.actual) {
                      return null; // Use default message
                  }
                  var nbDiff = 0;
                  for(var y = 0; y < 5; y++){
                      for(var x = 0; x < 5; x++){
                          if (failInfo.expected[y][x] !== failInfo.actual[y][x]) {
                              nbDiff++;
                          }
                      }
                  }
                  return strings.messages.wrongStateDrawing.format(failInfo.name, nbDiff, failInfo.time);
              }
          };
      };
      return SensorLedMatrix;
  }(AbstractSensor);

  function _inherits$j(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$j(subClass, superClass);
  }
  function _set_prototype_of$j(o, p) {
      _set_prototype_of$j = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$j(o, p);
  }
  var SensorButton = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$j(SensorButton, AbstractSensor);
      function SensorButton() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'button';
          return _this;
      }
      var _proto = SensorButton.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("isButtonPressed(\"" + this.name + "\")", function(retVal) {
              if ('boolean' === typeof retVal) {
                  callback(retVal);
              } else {
                  var intVal = parseInt(retVal, 10);
                  callback(intVal != 0);
              }
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh; param.juststate; var fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y, sensorAttr = param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.buttonon || sensorHandler.isElementRemoved(this.buttonon)) this.buttonon = this.context.paper.image(getImg('buttonon.png'), imgx, imgy, imgw, imgh);
          if (!this.buttonoff || sensorHandler.isElementRemoved(this.buttonoff)) this.buttonoff = this.context.paper.image(getImg('buttonoff.png'), imgx, imgy, imgw, imgh);
          if (this.state == null) this.state = false;
          this.buttonon.attr(sensorAttr);
          this.buttonoff.attr(sensorAttr);
          if (this.state) {
              this.buttonon.attr({
                  "opacity": fadeopacity
              });
              this.buttonoff.attr({
                  "opacity": 0
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.on.toUpperCase());
          } else {
              this.buttonon.attr({
                  "opacity": 0
              });
              this.buttonoff.attr({
                  "opacity": fadeopacity
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.off.toUpperCase());
          }
          if (!this.context.autoGrading && !this.buttonon.node.onmousedown) {
              this.focusrect.node.onmousedown = function() {
                  if (_this.context.offLineMode) {
                      _this.state = true;
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.getSensorDrawer().drawSensor(_this);
                  } else sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              };
              this.focusrect.node.onmouseup = function() {
                  if (_this.context.offLineMode) {
                      _this.state = false;
                      _this.wasPressed = true;
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.getSensorDrawer().drawSensor(_this);
                      if (_this.onPressed) _this.onPressed();
                  } else sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              };
              this.focusrect.node.ontouchstart = this.focusrect.node.onmousedown;
              this.focusrect.node.ontouchend = this.focusrect.node.onmouseup;
          }
      };
      SensorButton.getDefinition = function getDefinition(context, strings) {
          return {
              name: "button",
              suggestedName: strings.messages.sensorNameButton,
              description: strings.messages.button,
              isAnalog: false,
              isSensor: true,
              portType: "D",
              valueType: "boolean",
              pluggable: true,
              selectorImages: [
                  "buttonoff.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  if (state) return 1;
                  else return 0;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return 1;
                  else return 0;
              }
          };
      };
      return SensorButton;
  }(AbstractSensor);

  function _inherits$i(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$i(subClass, superClass);
  }
  function _set_prototype_of$i(o, p) {
      _set_prototype_of$i = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$i(o, p);
  }
  var SensorBuzzer = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$i(SensorBuzzer, AbstractSensor);
      function SensorBuzzer() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'buzzer';
          return _this;
      }
      var _proto = SensorBuzzer.prototype;
      _proto.getInitialState = function getInitialState() {
          return false;
      };
      _proto.setLiveState = function setLiveState(state, callback) {
          var ledstate = state ? 1 : 0;
          var command = "setBuzzerState(\"" + this.name + "\"," + ledstate + ")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y, sensorAttr = param.sensorAttr;
          if (typeof this.state == 'number' && this.state != 0 && this.state != 1) {
              buzzerSound.start(this.name, this.state);
          } else if (this.state) {
              buzzerSound.start(this.name);
          } else {
              buzzerSound.stop(this.name);
          }
          if (!juststate) {
              if (this.muteBtn) {
                  this.muteBtn.remove();
              }
              // let muteBtnSize = w * 0.15;
              var muteBtnSize = imgw * 0.3;
              this.muteBtn = this.context.paper.text(imgx + imgw * 0.8, imgy + imgh * 0.8, buzzerSound.isMuted(this.name) ? "\uf6a9" : "\uf028");
              this.muteBtn.node.style.fontWeight = "bold";
              this.muteBtn.node.style.cursor = "default";
              this.muteBtn.node.style.MozUserSelect = "none";
              this.muteBtn.node.style.WebkitUserSelect = "none";
              this.muteBtn.attr({
                  "font-size": muteBtnSize + "px",
                  fill: buzzerSound.isMuted(this.name) ? "lightgray" : "#468DDF",
                  "font-family": '"Font Awesome 5 Free"',
                  'text-anchor': 'start',
                  "cursor": "pointer"
              });
              this.muteBtn.getBBox();
              this.muteBtn.click(function() {
                  if (buzzerSound.isMuted(_this.name)) {
                      buzzerSound.unmute(_this.name);
                  } else {
                      buzzerSound.mute(_this.name);
                  }
                  sensorHandler.getSensorDrawer().drawSensor(_this);
              });
              this.muteBtn.toFront();
          }
          if (!this.buzzeron || sensorHandler.isElementRemoved(this.buzzeron)) this.buzzeron = this.context.paper.image(getImg('buzzer-ringing.png'), imgx, imgy, imgw, imgh);
          if (!this.buzzeroff || sensorHandler.isElementRemoved(this.buzzeroff)) {
              this.buzzeroff = this.context.paper.image(getImg('buzzer.png'), imgx, imgy, imgw, imgh);
              this.focusrect.click(function() {
                  if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                      _this.state = !_this.state;
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.getSensorDrawer().drawSensor(_this);
                  } else {
                      sensorHandler.actuatorsInRunningModeError();
                  }
              });
          }
          if (this.state) {
              if (!this.buzzerInterval) {
                  this.buzzerInterval = setInterval(function() {
                      if (!_this.removed) {
                          _this.ringingState = !_this.ringingState;
                          sensorHandler.getSensorDrawer().drawSensor(_this, true, true);
                      } else {
                          clearInterval(_this.buzzerInterval);
                      }
                  }, 100);
              }
          } else {
              if (this.buzzerInterval) {
                  clearInterval(this.buzzerInterval);
                  this.buzzerInterval = null;
                  this.ringingState = null;
              }
          }
          this.buzzeron.attr(sensorAttr);
          this.buzzeroff.attr(sensorAttr);
          var drawState = this.state;
          if (this.ringingState != null) drawState = this.ringingState;
          if (drawState) {
              this.buzzeron.attr({
                  "opacity": fadeopacity
              });
              this.buzzeroff.attr({
                  "opacity": 0
              });
          } else {
              this.buzzeron.attr({
                  "opacity": 0
              });
              this.buzzeroff.attr({
                  "opacity": fadeopacity
              });
          }
          if (this.stateText) this.stateText.remove();
          var stateText = sensorHandler.findSensorDefinition(this).getStateString(this.state);
          this.stateText = this.context.paper.text(state1x, state1y, stateText);
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
      };
      SensorBuzzer.getDefinition = function getDefinition(context, strings) {
          return {
              name: "buzzer",
              suggestedName: strings.messages.sensorNameBuzzer,
              description: strings.messages.buzzer,
              isAnalog: false,
              isSensor: false,
              portType: "D",
              selectorImages: [
                  "buzzer-ringing.png"
              ],
              valueType: "boolean",
              getPercentageFromState: function getPercentageFromState(state, sensor) {
                  if (sensor.showAsAnalog) {
                      return (state - sensor.minAnalog) / (sensor.maxAnalog - sensor.minAnalog);
                  } else {
                      if (state) return 1;
                      else return 0;
                  }
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return 1;
                  else return 0;
              },
              getStateString: function getStateString(state) {
                  if (typeof state == 'number' && state != 1 && state != 0) {
                      return state.toString() + "Hz";
                  }
                  return state ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase();
              },
              subTypes: [
                  {
                      subType: "active",
                      description: strings.messages.grovebuzzer,
                      pluggable: true
                  },
                  {
                      subType: "passive",
                      description: strings.messages.quickpibuzzer
                  }
              ]
          };
      };
      return SensorBuzzer;
  }(AbstractSensor);

  function _inherits$h(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$h(subClass, superClass);
  }
  function _set_prototype_of$h(o, p) {
      _set_prototype_of$h = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$h(o, p);
  }
  function generateIrRemoteDialog(strings) {
      return "<div class=\"content qpi\">" + "   <div class=\"panel-heading\">" + "       <h2 class=\"sectionTitle\">" + "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" + strings.messages.irRemoteControl + "       </h2>" + "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" + "   </div>" + "   <div id=\"sensorPicker\" class=\"panel-body\">" + "       <div id=\"piremotemessage\" >" + "       </div>" + "       <div id=\"piremotecontent\" >" + "       </div>" + "   </div>" + "   <div class=\"singleButton\">" + "       <button id=\"picancel2\" class=\"btn btn-centered\"><i class=\"icon fa fa-check\"></i>" + strings.messages.closeDialog + "</button>" + "   </div>" + "</div>";
  }
  var SensorIrTrans = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$h(SensorIrTrans, AbstractSensor);
      function SensorIrTrans() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'irtrans';
          return _this;
      }
      var _proto = SensorIrTrans.prototype;
      _proto.setLiveState = function setLiveState(state, callback) {
          var ledstate = state ? 1 : 0;
          var command = "setInfraredState(\"" + this.name + "\"," + ledstate + ")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh; param.juststate; var fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y, sensorAttr = param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.ledon || sensorHandler.isElementRemoved(this.ledon)) {
              this.ledon = this.context.paper.image(getImg("irtranson.png"), imgx, imgy, imgw, imgh);
          }
          var irRemoteDialog = generateIrRemoteDialog(this.strings);
          if (!this.ledoff || sensorHandler.isElementRemoved(this.ledoff)) {
              this.ledoff = this.context.paper.image(getImg('irtransoff.png'), imgx, imgy, imgw, imgh);
              this.focusrect.click(function() {
                  if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning()) && !_this.context.offLineMode) {
                      //sensor.state = !sensor.state;
                      //this.drawSensor(sensor);
                      window.displayHelper.showPopupDialog(irRemoteDialog, function() {
                          var _loop = function(code) {
                              addedSomeButtons = true;
                              _this.context.remoteIRcodes[code];
                              var btn = document.createElement("BUTTON");
                              var t = document.createTextNode(code);
                              btn.className = "btn";
                              btn.appendChild(t);
                              parentdiv.appendChild(btn);
                              var capturedcode = code;
                              var captureddata = _this.context.remoteIRcodes[code];
                              btn.onclick = function() {
                                  $('#popupMessage').hide();
                                  window.displayHelper.popupMessageShown = false;
                                  //if (sensor.waitingForIrMessage)
                                  //sensor.waitingForIrMessage(capturedcode);
                                  _this.context.quickPiConnection.sendCommand("presetIRMessage(\"" + capturedcode + "\", '" + captureddata + "')", function(returnVal) {});
                                  _this.context.quickPiConnection.sendCommand("sendIRMessage(\"irtran1\", \"" + capturedcode + "\")", function(returnVal) {});
                              };
                              count += 1;
                              if (count == 4) {
                                  count = 0;
                                  parentdiv = document.createElement("DIV");
                                  parentdiv.className = "form-group";
                                  remotecontent.appendChild(parentdiv);
                              }
                          };
                          $('#picancel').click(function() {
                              $('#popupMessage').hide();
                              window.displayHelper.popupMessageShown = false;
                          });
                          $('#picancel2').click(function() {
                              $('#popupMessage').hide();
                              window.displayHelper.popupMessageShown = false;
                          });
                          var addedSomeButtons = false;
                          var remotecontent = document.getElementById('piremotecontent');
                          var parentdiv = document.createElement("DIV");
                          parentdiv.className = "form-group";
                          remotecontent.appendChild(parentdiv);
                          var count = 0;
                          for(var code in _this.context.remoteIRcodes)_loop(code);
                          if (!addedSomeButtons) {
                              $('#piremotemessage').text(_this.strings.messages.noIrPresets);
                          }
                          var btn = document.createElement("BUTTON");
                          var t = document.createTextNode(_this.strings.messages.irEnableContinous);
                          if (_this.state) {
                              t = document.createTextNode(_this.strings.messages.irDisableContinous);
                          }
                          btn.className = "btn";
                          btn.appendChild(t);
                          parentdiv.appendChild(btn);
                          btn.onclick = function() {
                              $('#popupMessage').hide();
                              window.displayHelper.popupMessageShown = false;
                              _this.state = !_this.state;
                              sensorHandler.warnClientSensorStateChanged(_this);
                              sensorHandler.getSensorDrawer().drawSensor(_this);
                          };
                      });
                  } else {
                      sensorHandler.actuatorsInRunningModeError();
                  }
              });
          }
          this.ledon.attr(sensorAttr);
          this.ledoff.attr(sensorAttr);
          if (this.state) {
              this.ledon.attr({
                  "opacity": fadeopacity
              });
              this.ledoff.attr({
                  "opacity": 0
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.on.toUpperCase());
          } else {
              this.ledon.attr({
                  "opacity": 0
              });
              this.ledoff.attr({
                  "opacity": fadeopacity
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.off.toUpperCase());
          }
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              this.setLiveState(this.state, function() {});
          }
      };
      SensorIrTrans.getDefinition = function getDefinition(context, strings) {
          return {
              name: "irtrans",
              suggestedName: strings.messages.sensorNameIrTrans,
              description: strings.messages.irtrans,
              isAnalog: false,
              isSensor: true,
              portType: "D",
              valueType: "number",
              valueMin: 0,
              valueMax: 60,
              selectorImages: [
                  "irtranson.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 60;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 60);
              }
          };
      };
      return SensorIrTrans;
  }(AbstractSensor);

  function _inherits$g(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$g(subClass, superClass);
  }
  function _set_prototype_of$g(o, p) {
      _set_prototype_of$g = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$g(o, p);
  }
  var SensorScreen = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$g(SensorScreen, AbstractSensor);
      function SensorScreen() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'screen';
          return _this;
      }
      var _proto = SensorScreen.prototype;
      _proto.getInitialState = function getInitialState() {
          if (this.isDrawingScreen) return null;
          else return {
              line1: "",
              line2: ""
          };
      };
      _proto.setLiveState = function setLiveState(state, callback) {
          var line2 = state.line2;
          if (!line2) line2 = "";
          var command = "displayText(\"" + this.name + "\"," + state.line1 + "\", \"" + line2 + "\")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.draw = function draw(sensorHandler, drawParameters) {
          if (this.stateText) {
              this.stateText.remove();
              this.stateText = null;
          }
          var borderSize = 5;
          var screenScale = 1.5;
          if (drawParameters.w < 300) {
              screenScale = 1;
          }
          if (drawParameters.w < 150) {
              screenScale = 0.5;
          }
          // console.log(screenScale,w,h)
          var screenScalerSize = {
              width: 128 * screenScale,
              height: 32 * screenScale
          };
          borderSize = borderSize * screenScale;
          drawParameters.imgw = screenScalerSize.width + borderSize * 2;
          drawParameters.imgh = screenScalerSize.height + borderSize * 2;
          drawParameters.imgx = drawParameters.x - drawParameters.imgw / 2 + drawParameters.w / 2;
          drawParameters.imgy = drawParameters.y + (drawParameters.h - drawParameters.imgh) / 2 + drawParameters.h * 0.05;
          drawParameters.portx = drawParameters.imgx + drawParameters.imgw + borderSize;
          drawParameters.porty = drawParameters.imgy + drawParameters.imgh / 3;
          drawParameters.statesize = drawParameters.imgh / 3.5;
          if (!this.img || sensorHandler.isElementRemoved(this.img)) {
              this.img = this.context.paper.image(getImg('screen.png'), drawParameters.imgx, drawParameters.imgy, drawParameters.imgw, drawParameters.imgh);
          }
          this.img.attr({
              "x": drawParameters.imgx,
              "y": drawParameters.imgy,
              "width": drawParameters.imgw,
              "height": drawParameters.imgh,
              "opacity": drawParameters.fadeopacity
          });
          if (this.state) {
              if (this.state.isDrawingData) {
                  if (!this.screenrect || sensorHandler.isElementRemoved(this.screenrect) || !this.canvasNode) {
                      this.screenrect = this.context.paper.rect(drawParameters.imgx, drawParameters.imgy, screenScalerSize.width, screenScalerSize.height);
                      this.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                      this.canvasNode.setAttribute("x", drawParameters.imgx + borderSize); //Set rect data
                      this.canvasNode.setAttribute("y", drawParameters.imgy + borderSize); //Set rect data
                      this.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                      this.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data
                      this.context.paper.canvas.appendChild(this.canvasNode);
                      this.canvas = document.createElement("canvas");
                      this.canvas.id = "screencanvas";
                      this.canvas.width = screenScalerSize.width;
                      this.canvas.height = screenScalerSize.height;
                      this.canvasNode.appendChild(this.canvas);
                  }
                  $(this.canvas).css({
                      opacity: drawParameters.fadeopacity
                  });
                  this.canvasNode.setAttribute("x", drawParameters.imgx + borderSize); //Set rect data
                  this.canvasNode.setAttribute("y", drawParameters.imgy + borderSize); //Set rect data
                  this.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                  this.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data
                  this.screenrect.attr({
                      "x": drawParameters.imgx + borderSize,
                      "y": drawParameters.imgy + borderSize,
                      "width": 128,
                      "height": 32
                  });
                  this.screenrect.attr({
                      "opacity": 0
                  });
                  var quickPiModuleDefinition = quickpiModuleDefinition(this.context, this.strings);
                  quickPiModuleDefinition.blockImplementations.initScreenDrawing(this);
                  //sensor.screenDrawing.copyToCanvas(sensor.canvas, screenScale);
                  screenDrawing.renderToCanvas(this.state, this.canvas, screenScale);
              } else {
                  var statex = drawParameters.imgx + drawParameters.imgw * .05;
                  var statey = drawParameters.imgy + drawParameters.imgh * .2;
                  if (this.state.line1.length > 16) this.state.line1 = this.state.line1.substring(0, 16);
                  if (this.state.line2 && this.state.line2.length > 16) this.state.line2 = this.state.line2.substring(0, 16);
                  if (this.canvasNode) {
                      $(this.canvasNode).remove();
                      this.canvasNode = null;
                  }
                  this.stateText = this.context.paper.text(statex, statey, this.state.line1 + "\n" + (this.state.line2 ? this.state.line2 : ""));
                  drawParameters.stateanchor = "start";
                  this.stateText.attr("");
              }
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          var _this = this;
          var startx = drawParameters.startx, ypositionmiddle = drawParameters.ypositionmiddle, color = drawParameters.color, strokewidth = drawParameters.strokewidth, ypositiontop = drawParameters.ypositiontop;
          var sensorDef = sensorHandler.findSensorDefinition(this);
          if (type != "actual" || !this.lastScreenState || !sensorDef.compareState(this.lastScreenState, state)) {
              this.lastScreenState = state;
              var stateBubble;
              if (state.isDrawingData) {
                  stateBubble = this.context.paper.text(startx, ypositiontop + 10, '\uf303');
                  stateBubble.attr({
                      "font": "Font Awesome 5 Free",
                      "stroke": color,
                      "fill": color,
                      "font-size": 4 * 2 + "px"
                  });
                  stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                  stateBubble.node.style.fontWeight = "bold";
                  $(stateBubble.node).css("z-index", "1");
                  var showPopup = function(event) {
                      if (!_this.showingTooltip) {
                          $("body").append('<div id="screentooltip"></div>');
                          $('#screentooltip').css("position", "absolute");
                          $('#screentooltip').css("border", "1px solid gray");
                          $('#screentooltip').css("background-color", "#efefef");
                          $('#screentooltip').css("padding", "3px");
                          $('#screentooltip').css("z-index", "1000");
                          $('#screentooltip').css("width", "262px");
                          $('#screentooltip').css("height", "70px");
                          $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);
                          var canvas = document.createElement("canvas");
                          canvas.id = "tooltipcanvas";
                          canvas.width = 128 * 2;
                          canvas.height = 32 * 2;
                          $('#screentooltip').append(canvas);
                          $(canvas).css("position", "absolute");
                          $(canvas).css("z-index", "1500");
                          $(canvas).css("left", 3).css("top", 3);
                          if (expectedState && type == "wrong") {
                              screenDrawing.renderDifferences(expectedState, state, canvas, 2);
                          } else {
                              screenDrawing.renderToCanvas(state, canvas, 2);
                          }
                          _this.showingTooltip = true;
                      }
                  };
                  $(stateBubble.node).mouseenter(showPopup);
                  $(stateBubble.node).click(showPopup);
                  $(stateBubble.node).mouseleave(function(event) {
                      _this.showingTooltip = false;
                      $('#screentooltip').remove();
                  });
              } else {
                  stateBubble = this.context.paper.text(startx, ypositionmiddle + 10, '\uf27a');
                  stateBubble.attr({
                      "font": "Font Awesome 5 Free",
                      "stroke": color,
                      "fill": color,
                      "font-size": strokewidth * 2 + "px"
                  });
                  stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                  stateBubble.node.style.fontWeight = "bold";
                  var showPopup1 = function() {
                      if (!_this.tooltip) {
                          _this.tooltipText = _this.context.paper.text(startx, ypositionmiddle + 50, state.line1 + "\n" + (state.line2 ? state.line2 : ""));
                          var textDimensions = _this.tooltipText.getBBox();
                          _this.tooltip = _this.context.paper.rect(textDimensions.x - 15, textDimensions.y - 15, textDimensions.width + 30, textDimensions.height + 30);
                          _this.tooltip.attr({
                              "stroke": "black",
                              "stroke-width": 2,
                              "fill": "white"
                          });
                          _this.tooltipText.toFront();
                      }
                  };
                  stateBubble.click(showPopup1);
                  stateBubble.hover(showPopup1, function() {
                      if (_this.tooltip) {
                          _this.tooltip.remove();
                          _this.tooltip = null;
                      }
                      if (_this.tooltipText) {
                          _this.tooltipText.remove();
                          _this.tooltipText = null;
                      }
                  });
              }
              drawParameters.drawnElements.push(stateBubble);
              this.context.sensorStates.push(stateBubble);
          } else {
              drawParameters.deleteLastDrawnElements = false;
          }
      };
      SensorScreen.getDefinition = function getDefinition(context, strings) {
          return {
              name: "screen",
              suggestedName: strings.messages.sensorNameScreen,
              description: strings.messages.screen,
              isAnalog: false,
              isSensor: false,
              cellsAmount: function cellsAmount(paper) {
                  // console.log(paper.width)
                  if (context.board == 'grovepi') {
                      return 2;
                  }
                  if (paper.width < 250) {
                      return 4;
                  } else if (paper.width < 350) {
                      return 3;
                  }
                  if (context.compactLayout) return 3;
                  else return 2;
              },
              portType: "i2c",
              valueType: "object",
              selectorImages: [
                  "screen.png"
              ],
              compareState: function compareState(state1, state2) {
                  // Both are null are equal
                  if (state1 == null && state2 == null) return true;
                  // If only one is null they are different
                  if (state1 == null && state2 || state1 && state2 == null) return false;
                  if (state1.isDrawingData != state2.isDrawingData) return false;
                  if (state1 && state1.isDrawingData) {
                      // They are ImageData objects
                      // The image data is RGBA so there are 4 bits per pixel
                      var data1 = state1.getData(1).data;
                      var data2 = state2.getData(1).data;
                      for(var i = 0; i < data1.length; i += 4){
                          if (data1[i] != data2[i] || data1[i + 1] != data2[i + 1] || data1[i + 2] != data2[i + 2] || data1[i + 3] != data2[i + 3]) return false;
                      }
                      return true;
                  } else {
                      // Otherwise compare the strings
                      return state1.line1 == state2.line1 && (state1.line2 == state2.line2 || !state1.line2 && !state2.line2);
                  }
              },
              getStateString: function getStateString(state) {
                  if (!state) {
                      return '""';
                  }
                  if (state.isDrawingData) return strings.messages.drawing;
                  else return '"' + state.line1 + (state.line2 ? " / " + state.line2 : "") + '"';
              },
              getWrongStateString: function getWrongStateString(failInfo) {
                  if (!failInfo.expected || !failInfo.expected.isDrawingData || !failInfo.actual || !failInfo.actual.isDrawingData) {
                      return null; // Use default message
                  }
                  var data1 = failInfo.expected.getData(1).data;
                  var data2 = failInfo.actual.getData(1).data;
                  var nbDiff = 0;
                  for(var i = 0; i < data1.length; i += 4){
                      if (data1[i] != data2[i]) {
                          nbDiff += 1;
                      }
                  }
                  return strings.messages.wrongStateDrawing.format(failInfo.name, nbDiff, failInfo.time);
              },
              subTypes: [
                  {
                      subType: "16x2lcd",
                      description: strings.messages.grove16x2lcd,
                      pluggable: true
                  },
                  {
                      subType: "oled128x32",
                      description: strings.messages.oled128x32
                  }
              ]
          };
      };
      return SensorScreen;
  }(AbstractSensor);

  function _inherits$f(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$f(subClass, superClass);
  }
  function _set_prototype_of$f(o, p) {
      _set_prototype_of$f = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$f(o, p);
  }
  var SensorServo = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$f(SensorServo, AbstractSensor);
      function SensorServo() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'servo';
          return _this;
      }
      var _proto = SensorServo.prototype;
      _proto.getInitialState = function getInitialState() {
          return 0;
      };
      _proto.setLiveState = function setLiveState(state, callback) {
          var command = "setServoAngle(\"" + this.name + "\"," + state + ")";
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('servo.png'), imgx, imgy, imgw, imgh);
          if (!this.pale || sensorHandler.isElementRemoved(this.pale)) this.pale = this.context.paper.image(getImg('servo-pale.png'), imgx, imgy, imgw, imgh);
          if (!this.center || sensorHandler.isElementRemoved(this.center)) this.center = this.context.paper.image(getImg('servo-center.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.pale.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "transform": "",
              "opacity": fadeopacity
          });
          this.center.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.pale.rotate(this.state);
          if (this.state == null) this.state = 0;
          this.state = Math.round(this.state);
          this.stateText = this.context.paper.text(state1x, state1y, this.state + "°");
          if ((!this.context.runner || !this.context.runner.isRunning()) && !this.context.offLineMode) {
              if (!this.updatetimeout) {
                  this.updatetimeout = setTimeout(function() {
                      _this.setLiveState(_this.state, function() {});
                      _this.updatetimeout = null;
                  }, 100);
              }
          }
          if (!this.context.autoGrading && (!this.context.runner || !this.context.runner.isRunning())) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 180);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorServo.getDefinition = function getDefinition(context, strings) {
          return {
              name: "servo",
              suggestedName: strings.messages.sensorNameServo,
              description: strings.messages.servo,
              isAnalog: true,
              isSensor: false,
              portType: "D",
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 180,
              selectorImages: [
                  "servo.png",
                  "servo-pale.png",
                  "servo-center.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 180;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 180);
              },
              getStateString: function getStateString(state) {
                  return "" + state + "°";
              },
              getStateFromPwm: function getStateFromPwm(pwmDuty) {
                  return 180 * (pwmDuty - 0.025 * 1023) / (0.1 * 1023);
              }
          };
      };
      return SensorServo;
  }(AbstractSensor);

  function _inherits$e(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$e(subClass, superClass);
  }
  function _set_prototype_of$e(o, p) {
      _set_prototype_of$e = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$e(o, p);
  }
  var gpios = [
      10,
      9,
      11,
      8,
      7
  ];
  var SensorStick = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$e(SensorStick, AbstractSensor);
      function SensorStick() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'stick';
          return _this;
      }
      var _proto = SensorStick.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          "readStick(" + gpios.join() + ")";
          this.context.quickPiConnection.sendCommand("readStick(" + gpios.join() + ")", function(retVal) {
              var array = JSON.parse(retVal);
              callback(array);
          });
      };
      _proto.draw = function draw(sensorHandler, drawParameters) {
          var _this = this;
          var imgx = drawParameters.imgx, imgy = drawParameters.imgy, imgw = drawParameters.imgw, imgh = drawParameters.imgh, fadeopacity = drawParameters.fadeopacity, state1x = drawParameters.state1x, state1y = drawParameters.state1y;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('stick.png'), imgx, imgy, imgw, imgh);
          if (!this.imgup || sensorHandler.isElementRemoved(this.imgup)) this.imgup = this.context.paper.image(getImg('stickup.png'), imgx, imgy, imgw, imgh);
          if (!this.imgdown || sensorHandler.isElementRemoved(this.imgdown)) this.imgdown = this.context.paper.image(getImg('stickdown.png'), imgx, imgy, imgw, imgh);
          if (!this.imgleft || sensorHandler.isElementRemoved(this.imgleft)) this.imgleft = this.context.paper.image(getImg('stickleft.png'), imgx, imgy, imgw, imgh);
          if (!this.imgright || sensorHandler.isElementRemoved(this.imgright)) this.imgright = this.context.paper.image(getImg('stickright.png'), imgx, imgy, imgw, imgh);
          if (!this.imgcenter || sensorHandler.isElementRemoved(this.imgcenter)) this.imgcenter = this.context.paper.image(getImg('stickcenter.png'), imgx, imgy, imgw, imgh);
          var a = {
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": 0
          };
          this.img.attr(a).attr("opacity", fadeopacity);
          this.imgup.attr(a);
          this.imgdown.attr(a);
          this.imgleft.attr(a);
          this.imgright.attr(a);
          this.imgcenter.attr(a);
          if (this.stateText) this.stateText.remove();
          if (!this.state) this.state = [
              false,
              false,
              false,
              false,
              false
          ];
          // let stateString = "\n";
          var stateString = "";
          var click = false;
          if (this.state[0]) {
              stateString += this.strings.messages.up.toUpperCase() + "\n";
              this.imgup.attr({
                  "opacity": 1
              });
              click = true;
          }
          if (this.state[1]) {
              stateString += this.strings.messages.down.toUpperCase() + "\n";
              this.imgdown.attr({
                  "opacity": 1
              });
              click = true;
          }
          if (this.state[2]) {
              stateString += this.strings.messages.left.toUpperCase() + "\n";
              this.imgleft.attr({
                  "opacity": 1
              });
              click = true;
          }
          if (this.state[3]) {
              stateString += this.strings.messages.right.toUpperCase() + "\n";
              this.imgright.attr({
                  "opacity": 1
              });
              click = true;
          }
          if (this.state[4]) {
              stateString += this.strings.messages.center.toUpperCase() + "\n";
              this.imgcenter.attr({
                  "opacity": 1
              });
              click = true;
          }
          if (!click) {
              stateString += "...";
          }
          this.stateText = this.context.paper.text(state1x, state1y, stateString);
          if (this.portText) this.portText.remove();
          drawParameters.drawPortText = false;
          if (this.portText) this.portText.remove();
          if (!this.context.autoGrading) {
              var gpios = sensorHandler.findSensorDefinition(this).gpios;
              var min = 255;
              var max = 0;
              for(var i = 0; i < gpios.length; i++){
                  if (gpios[i] > max) max = gpios[i];
                  if (gpios[i] < min) min = gpios[i];
              }
              $('#stickupstate').text(this.state[0] ? this.strings.messages.on.toUpperCase() : this.strings.messages.off.toUpperCase());
              $('#stickdownstate').text(this.state[1] ? this.strings.messages.on.toUpperCase() : this.strings.messages.off.toUpperCase());
              $('#stickleftstate').text(this.state[2] ? this.strings.messages.on.toUpperCase() : this.strings.messages.off.toUpperCase());
              $('#stickrightstate').text(this.state[3] ? this.strings.messages.on.toUpperCase() : this.strings.messages.off.toUpperCase());
              $('#stickcenterstate').text(this.state[4] ? this.strings.messages.on.toUpperCase() : this.strings.messages.off.toUpperCase());
          /*
                        sensor.portText = this.context.paper.text(state1x, state1y, "D" + min.toString() + "-D" + max.toString() + "?");
                        sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "blue" });
                        sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                        let b = sensor.portText._getBBox();
                        sensor.portText.translate(0, b.height / 2);

                        let stickPortsDialog = `
                        <div class="content qpi">
                        <div class="panel-heading">
                            <h2 class="sectionTitle">
                                <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                                Noms et ports de la manette
                            </h2>
                            <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                        </div>
                        <div id="sensorPicker" class="panel-body">
                            <label></label>
                            <div class="flex-container">
                            <table style="display:table-header-group;">
                            <tr>
                            <th>Name</th>
                            <th>Port</th>
                            <th>State</th>
                            <th>Direction</th>
                            </tr>
                            <tr>
                            <td><label id="stickupname"></td><td><label id="stickupport"></td><td><label id="stickupstate"></td><td><label id="stickupdirection"><i class="fas fa-arrow-up"></i></td>
                            </tr>
                            <tr>
                            <td><label id="stickdownname"></td><td><label id="stickdownport"></td><td><label id="stickdownstate"></td><td><label id="stickdowndirection"><i class="fas fa-arrow-down"></i></td>
                            </tr>
                            <tr>
                            <td><label id="stickleftname"></td><td><label id="stickleftport"></td><td><label id="stickleftstate"></td><td><label id="stickleftdirection"><i class="fas fa-arrow-left"></i></td>
                            </tr>
                            <tr>
                            <td><label id="stickrightname"></td><td><label id="stickrightport"></td><td><label id="stickrightstate"></td><td><label id="stickrightdirection"><i class="fas fa-arrow-right"></i></td>
                            </tr>
                            <tr>
                            <td><label id="stickcentername"></td><td><label id="stickcenterport"></td><td><label id="stickcenterstate"></td><td><label id="stickcenterdirection"><i class="fas fa-circle"></i></td>
                            </tr>
                            </table>
                            </div>
                        </div>
                        <div class="singleButton">
                            <button id="picancel2" class="btn btn-centered"><i class="icon fa fa-check"></i>Fermer</button>
                        </div>
                    </div>
                        `;

                        sensor.portText.click(() => {
                            window.displayHelper.showPopupDialog(stickPortsDialog);

                            $('#picancel').click(() => {
                                $('#popupMessage').hide();
                                window.displayHelper.popupMessageShown = false;
                            });

                            $('#picancel2').click(() => {
                                $('#popupMessage').hide();
                                window.displayHelper.popupMessageShown = false;
                            });

                            $('#stickupname').text(sensor.name + ".up");
                            $('#stickdownname').text(sensor.name + ".down");
                            $('#stickleftname').text(sensor.name + ".left");
                            $('#stickrightname').text(sensor.name + ".right");
                            $('#stickcentername').text(sensor.name + ".center");

                            $('#stickupport').text("D" + gpios[0]);
                            $('#stickdownport').text("D" + gpios[1]);
                            $('#stickleftport').text("D" + gpios[2]);
                            $('#stickrightport').text("D" + gpios[3]);
                            $('#stickcenterport').text("D" + gpios[4]);

                            $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                            $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                            $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                            $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                            $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");

                        });
                        */ }
          function poinInRect(rect, x, y) {
              if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) return true;
              return false;
          }
          function moveRect(rect, x, y) {
              rect.left += x;
              rect.right += x;
              rect.top += y;
              rect.bottom += y;
          }
          this.focusrect.node.onmousedown = function(evt) {
              if (!_this.context.offLineMode) {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
                  return;
              }
              var e = evt.target;
              var dim = e.getBoundingClientRect();
              var rectsize = dim.width * .30;
              var rect = {
                  left: dim.left,
                  right: dim.left + rectsize,
                  top: dim.top,
                  bottom: dim.top + rectsize
              };
              // Up left
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[0] = true;
                  _this.state[2] = true;
              }
              // Up
              moveRect(rect, rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[0] = true;
              }
              // Up right
              moveRect(rect, rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[0] = true;
                  _this.state[3] = true;
              }
              // Right
              moveRect(rect, 0, rectsize);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[3] = true;
              }
              // Center
              moveRect(rect, -rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[4] = true;
              }
              // Left
              moveRect(rect, -rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[2] = true;
              }
              // Down left
              moveRect(rect, 0, rectsize);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[1] = true;
                  _this.state[2] = true;
              }
              // Down
              moveRect(rect, rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[1] = true;
              }
              // Down right
              moveRect(rect, rectsize, 0);
              if (poinInRect(rect, evt.clientX, evt.clientY)) {
                  _this.state[1] = true;
                  _this.state[3] = true;
              }
              sensorHandler.warnClientSensorStateChanged(_this);
              sensorHandler.getSensorDrawer().drawSensor(_this);
          };
          this.focusrect.node.onmouseup = function(evt) {
              if (!_this.context.offLineMode) {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
                  return;
              }
              _this.state = [
                  false,
                  false,
                  false,
                  false,
                  false
              ];
              sensorHandler.warnClientSensorStateChanged(_this);
              sensorHandler.getSensorDrawer().drawSensor(_this);
          };
          this.focusrect.node.ontouchstart = this.focusrect.node.onmousedown;
          this.focusrect.node.ontouchend = this.focusrect.node.onmouseup;
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          var startx = drawParameters.startx, color = drawParameters.color, strokewidth = drawParameters.strokewidth, stateLenght = drawParameters.stateLenght;
          var stateToFA = [
              "\uf062",
              "\uf063",
              "\uf060",
              "\uf061",
              "\uf111"
          ];
          var spacing = this.context.timeLineSlotHeight / 5;
          for(var i = 0; i < 5; i++){
              if (state && state[i]) {
                  var ypos = this.drawInfo.y + i * spacing;
                  var startingpath = [
                      "M",
                      startx,
                      ypos,
                      "L",
                      startx,
                      ypos
                  ];
                  var targetpath = [
                      "M",
                      startx,
                      ypos,
                      "L",
                      startx + stateLenght,
                      ypos
                  ];
                  var stateline = void 0;
                  if (type == "expected") {
                      stateline = this.context.paper.path(targetpath);
                  } else {
                      stateline = this.context.paper.path(startingpath);
                      stateline.animate({
                          path: targetpath
                      }, 200);
                  }
                  stateline.attr({
                      "stroke-width": 2,
                      "stroke": color,
                      "stroke-linejoin": "round",
                      "stroke-linecap": "round"
                  });
                  drawParameters.drawnElements.push(stateline);
                  this.context.sensorStates.push(stateline);
                  if (type == "expected") {
                      this.stateArrow = this.context.paper.text(startx, ypos + 7, stateToFA[i]);
                      this.context.sensorStates.push(this.stateArrow);
                      this.stateArrow.attr({
                          "text-anchor": "start",
                          "font": "Font Awesome 5 Free",
                          "stroke": color,
                          "fill": color,
                          "font-size": strokewidth * 2 + "px"
                      });
                      this.stateArrow.node.style.fontFamily = '"Font Awesome 5 Free"';
                      this.stateArrow.node.style.fontWeight = "bold";
                  }
              }
          }
      };
      SensorStick.getDefinition = function getDefinition(context, strings) {
          return {
              name: "stick",
              suggestedName: strings.messages.sensorNameStick,
              description: strings.messages.fivewaybutton,
              isAnalog: false,
              isSensor: true,
              portType: "D",
              valueType: "boolean",
              selectorImages: [
                  "stick.png"
              ],
              gpiosNames: [
                  "up",
                  "down",
                  "left",
                  "right",
                  "center"
              ],
              gpios: gpios,
              getPercentageFromState: function getPercentageFromState(state) {
                  if (state) return 1;
                  else return 0;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return 1;
                  else return 0;
              },
              compareState: function compareState(state1, state2) {
                  if (state1 == null && state2 == null) return true;
                  return state1[0] == state2[0] && state1[1] == state2[1] && state1[2] == state2[2] && state1[3] == state2[3] && state1[4] == state2[4];
              },
              getButtonState: function getButtonState(buttonname, state) {
                  if (state) {
                      var buttonparts = buttonname.split(".");
                      var actualbuttonmame = buttonname;
                      if (buttonparts.length == 2) {
                          actualbuttonmame = buttonparts[1];
                      }
                      var index = this.gpiosNames.indexOf(actualbuttonmame);
                      if (index >= 0) {
                          return state[index];
                      }
                  }
                  return false;
              },
              cellsAmount: function cellsAmount(paper) {
                  return 2;
              }
          };
      };
      return SensorStick;
  }(AbstractSensor);

  function _inherits$d(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$d(subClass, superClass);
  }
  function _set_prototype_of$d(o, p) {
      _set_prototype_of$d = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$d(o, p);
  }
  var SensorAccelerometer = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$d(SensorAccelerometer, AbstractSensor);
      function SensorAccelerometer() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'accelerometer';
          return _this;
      }
      var _proto = SensorAccelerometer.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readAccelBMI160()", function(val) {
              var array = JSON.parse(val);
              callback(array);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1y = param.state1y, cx = param.cx;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('accel.png'), imgx, imgy, imgw, imgh);
          // this.context.paper.rect(x,y,w,h)
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          if (this.stateText) this.stateText.remove();
          if (!this.state) {
              this.state = [
                  0,
                  0,
                  1
              ];
          }
          if (this.state) {
              try {
                  var str = "X: " + this.state[0] + " m/s²\nY: " + this.state[1] + " m/s²\nZ: " + this.state[2] + " m/s²";
                  this.stateText = this.context.paper.text(cx, state1y, str);
              } catch (e) {
              }
          // let bbox = sensor.stateText.getBBox();
          // sensor.stateText.attr("y",cy - bbox.height/2);
          }
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, -8 * 9.81, 8 * 9.81);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          sensorHandler.getSensorDrawer().drawMultipleTimeLine(this, state, expectedState, type, drawParameters);
      };
      SensorAccelerometer.getDefinition = function getDefinition(context, strings) {
          return {
              name: "accelerometer",
              suggestedName: strings.messages.sensorNameAccelerometer,
              description: strings.messages.accelerometerbmi160,
              isAnalog: true,
              isSensor: true,
              portType: "i2c",
              valueType: "object",
              valueMin: 0,
              valueMax: 100,
              step: 0.1,
              selectorImages: [
                  "accel.png"
              ],
              getStateString: function getStateString(state) {
                  if (state == null) return "0m/s²";
                  if (Array.isArray(state)) {
                      return "X: " + state[0] + "m/s² Y: " + state[1] + "m/s² Z: " + state[2] + "m/s²";
                  } else {
                      return state.toString() + "m/s²";
                  }
              },
              getPercentageFromState: function getPercentageFromState(state) {
                  var perc = (state + 78.48) / 156.96;
                  // console.log(state,perc)
                  return perc;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  var value = percentage * 156.96 - 78.48;
                  var state = parseFloat(value.toFixed(1));
                  // console.log(state)
                  return state;
              },
              cellsAmount: function cellsAmount(paper) {
                  return 2;
              }
          };
      };
      return SensorAccelerometer;
  }(AbstractSensor);

  function _inherits$c(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$c(subClass, superClass);
  }
  function _set_prototype_of$c(o, p) {
      _set_prototype_of$c = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$c(o, p);
  }
  var SensorClock = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$c(SensorClock, AbstractSensor);
      function SensorClock() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'clock';
          return _this;
      }
      var _proto = SensorClock.prototype;
      _proto.draw = function draw(sensorHandler, drawParameters) {
          var imgx = drawParameters.imgx, imgy = drawParameters.imgy, imgw = drawParameters.imgw, imgh = drawParameters.imgh, state1x = drawParameters.state1x, state1y = drawParameters.state1y;
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('clock.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh
          });
          this.stateText = this.context.paper.text(state1x, state1y, this.context.currentTime.toString() + "ms");
          drawParameters.drawPortText = false;
          drawParameters.drawName = false;
      };
      SensorClock.getDefinition = function getDefinition(context, strings) {
          return {
              name: "clock",
              description: strings.messages.cloudstore,
              isAnalog: false,
              isSensor: false,
              portType: "none",
              valueType: "object",
              selectorImages: [
                  "clock.png"
              ]
          };
      };
      return SensorClock;
  }(AbstractSensor);

  function _inherits$b(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$b(subClass, superClass);
  }
  function _set_prototype_of$b(o, p) {
      _set_prototype_of$b = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$b(o, p);
  }
  function _type_of(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var SensorCloudStore = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$b(SensorCloudStore, AbstractSensor);
      function SensorCloudStore() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'cloudstore';
          return _this;
      }
      var _proto = SensorCloudStore.prototype;
      _proto.draw = function draw(sensorHandler, drawParameters) {
          var imgx = drawParameters.imgx, imgy = drawParameters.imgy, imgw = drawParameters.imgw, imgh = drawParameters.imgh, scrolloffset = drawParameters.scrolloffset;
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('cloudstore.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh * 0.8,
              "opacity": scrolloffset ? 0.3 : 1
          });
          drawParameters.drawPortText = false;
      // drawName = false;
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          var _this = this;
          var startx = drawParameters.startx, ypositionmiddle = drawParameters.ypositionmiddle, color = drawParameters.color;
          var sensorDef = sensorHandler.findSensorDefinition(this);
          if (type != "actual" || !this.lastScreenState || !sensorDef.compareState(this.lastScreenState, state)) {
              this.lastScreenState = state;
              var stateBubble = this.context.paper.text(startx, ypositionmiddle + 10, '\uf044');
              stateBubble.attr({
                  "font": "Font Awesome 5 Free",
                  "stroke": color,
                  "fill": color,
                  "font-size": 4 * 2 + "px"
              });
              stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
              stateBubble.node.style.fontWeight = "bold";
              var showPopup = function(event) {
                  if (!_this.showingTooltip) {
                      $("body").append('<div id="screentooltip"></div>');
                      $('#screentooltip').css("position", "absolute");
                      $('#screentooltip').css("border", "1px solid gray");
                      $('#screentooltip').css("background-color", "#efefef");
                      $('#screentooltip').css("padding", "3px");
                      $('#screentooltip').css("z-index", "1000");
                      /*
            $('#screentooltip').css("width", "262px");
            $('#screentooltip').css("height", "70px");*/ $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);
                      if (expectedState && type == "wrong") {
                          var div = LocalQuickStore.renderDifferences(expectedState, state);
                          $('#screentooltip').append(div);
                      } else {
                          for(var property in state){
                              var div = document.createElement("div");
                              $(div).text(property + " = " + state[property]);
                              $('#screentooltip').append(div);
                          }
                      }
                      _this.showingTooltip = true;
                  }
              };
              $(stateBubble.node).mouseenter(showPopup);
              $(stateBubble.node).click(showPopup);
              $(stateBubble.node).mouseleave(function(event) {
                  _this.showingTooltip = false;
                  $('#screentooltip').remove();
              });
              drawParameters.drawnElements.push(stateBubble);
              this.context.sensorStates.push(stateBubble);
          } else {
              drawParameters.deleteLastDrawnElements = false;
          }
      };
      SensorCloudStore.getDefinition = function getDefinition(context, strings) {
          return {
              name: "cloudstore",
              suggestedName: strings.messages.sensorNameCloudStore,
              description: strings.messages.cloudstore,
              isAnalog: false,
              isSensor: false,
              // portType: "none",
              portType: "D",
              valueType: "object",
              selectorImages: [
                  "cloudstore.png"
              ],
              /*getInitialState: function(sensor) {
            return {};
        },*/ getWrongStateString: function getWrongStateString(failInfo) {
                  /**
           * Call this function when more.length > less.length. It will find the key that is missing inside of the
           * less array
           * @param more The bigger array, containing one or more key more than less
           * @param less Less, the smaller array, he has a key or more missing
           */ function getMissingKey(more, less) {
                      for(var i = 0; i < more.length; i++){
                          var found = false;
                          for(var j = 0; j < less.length; j++){
                              if (more[i] === less[j]) {
                                  found = true;
                                  break;
                              }
                          }
                          if (!found) return more[i];
                      }
                      // should never happen because length are different.
                      return null;
                  }
                  // the type of a value in comparison.
                  var valueType = {
                      // Primitive type are strings and integers
                      PRIMITIVE: "primitive",
                      ARRAY: "array",
                      DICTIONARY: "dictionary",
                      // if two values are of wrong type then this is returned
                      WRONG_TYPE: "wrong_type"
                  };
                  /**
           * This method allow us to compare two keys of the cloud and their values
           * @param actual The actual key that we have
           * @param expected The expected key that we have
           * @return An object containing the type of the return and the key that differ
           */ function compareKeys(actual, expected) {
                      function compareArrays(arr1, arr2) {
                          if (arr1.length != arr2.length) return false;
                          for(var i = 0; i < arr1.length; i++){
                              for(var j = 0; j < arr2.length; j++){
                                  if (arr1[i] !== arr2[i]) return false;
                              }
                          }
                          return true;
                      }
                      var actualKeys = Object.keys(actual);
                      for(var i = 0; i < actualKeys.length; i++){
                          var actualVal = actual[actualKeys[i]];
                          // they both have the same keys so we can do that.
                          var expectedVal = expected[actualKeys[i]];
                          if (isPrimitive(expectedVal)) {
                              // if string with int for example
                              if ((typeof expectedVal === "undefined" ? "undefined" : _type_of(expectedVal)) !== (typeof actualVal === "undefined" ? "undefined" : _type_of(actualVal))) {
                                  return {
                                      type: valueType.WRONG_TYPE,
                                      key: actualKeys[i]
                                  };
                              }
                              if (expectedVal !== actualVal) {
                                  return {
                                      type: valueType.PRIMITIVE,
                                      key: actualKeys[i]
                                  };
                              }
                          } else if (Array.isArray(expectedVal)) {
                              if (!Array.isArray(actualVal)) {
                                  return {
                                      type: valueType.WRONG_TYPE,
                                      key: actualKeys[i]
                                  };
                              }
                              if (!compareArrays(expectedVal, actualVal)) {
                                  return {
                                      type: valueType.ARRAY,
                                      key: actualKeys[i]
                                  };
                              }
                          // if we are in a dictionary
                          // method from: https://stackoverflow.com/questions/38304401/javascript-check-if-dictionary
                          } else if (expectedVal.constructor == Object) {
                              if (actualVal.constructor != Object) {
                                  return {
                                      type: valueType.WRONG_TYPE,
                                      key: actualKeys[i]
                                  };
                              }
                              if (!deepEqual(expectedVal, actualVal)) {
                                  return {
                                      type: valueType.DICTIONARY,
                                      key: actualKeys[i]
                                  };
                              }
                          }
                      }
                  }
                  if (!failInfo.expected && !failInfo.actual) return null;
                  var expected = failInfo.expected;
                  var actual = failInfo.actual;
                  var expectedKeys = Object.keys(expected);
                  var actualKeys = Object.keys(actual);
                  if (expectedKeys.length != actualKeys.length) {
                      if (expectedKeys.length > actualKeys.length) {
                          var missingKey = getMissingKey(expectedKeys, actualKeys);
                          return strings.messages.cloudMissingKey.format(missingKey);
                      } else {
                          var additionalKey = getMissingKey(actualKeys, expectedKeys);
                          return strings.messages.cloudMoreKey.format(additionalKey);
                      }
                  }
                  // This will return a key that is missing inside of expectedKeys if there is one, otherwise it will return null.
                  var unexpectedKey = getMissingKey(actualKeys, expectedKeys);
                  if (unexpectedKey) {
                      return strings.messages.cloudUnexpectedKeyCorrection.format(unexpectedKey);
                  }
                  var keyCompare = compareKeys(actual, expected);
                  switch(keyCompare.type){
                      case valueType.PRIMITIVE:
                          return strings.messages.cloudPrimitiveWrongKey.format(keyCompare.key, expected[keyCompare.key], actual[keyCompare.key]);
                      case valueType.WRONG_TYPE:
                          var typeActual = _type_of(actual[keyCompare.key]);
                          var typeExpected = _type_of(expected[keyCompare.key]);
                          // we need to check if it is an array or a dictionary
                          if (typeActual == "object") {
                              if (Array.isArray(actual[keyCompare.key])) typeActual = "array";
                          }
                          if (typeExpected == "object") {
                              if (Array.isArray(expected[keyCompare.key])) typeExpected = "array";
                          }
                          var typeActualTranslate = quickPiLocalLanguageStrings.fr.messages.cloudTypes[typeActual];
                          var typeExpectedTranslate = quickPiLocalLanguageStrings.fr.messages.cloudTypes[typeExpected];
                          return strings.messages.cloudWrongType.format(typeActualTranslate, keyCompare.key, typeExpectedTranslate);
                      case valueType.ARRAY:
                          return strings.messages.cloudArrayWrongKey.format(keyCompare.key);
                      case valueType.DICTIONARY:
                          return strings.messages.cloudDictionaryWrongKey.format(keyCompare.key);
                  }
              },
              compareState: function compareState(state1, state2) {
                  return LocalQuickStore.compareState(state1, state2);
              }
          };
      };
      return SensorCloudStore;
  }(AbstractSensor);

  var gyroscope3D = function() {
      var instance;
      function createInstance(width, height) {
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          // debug code start
          /*
      canvas.style.zIndex = 99999;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      document.body.appendChild(canvas);
      */ // debug code end
          try {
              var renderer = new window.zen3d.Renderer(canvas, {
                  antialias: true,
                  alpha: true
              });
          } catch (e) {
              return false;
          }
          renderer.glCore.state.colorBuffer.setClear(0, 0, 0, 0);
          var scene = new window.zen3d.Scene();
          var lambert = new window.zen3d.LambertMaterial();
          lambert.diffuse.setHex(0x468DDF);
          var cube_geometry = new window.zen3d.CubeGeometry(10, 2, 10);
          var cube = new window.zen3d.Mesh(cube_geometry, lambert);
          cube.position.x = 0;
          cube.position.y = 0;
          cube.position.z = 0;
          scene.add(cube);
          var ambientLight = new window.zen3d.AmbientLight(0xffffff, 2);
          scene.add(ambientLight);
          var pointLight = new window.zen3d.PointLight(0xffffff, 1, 100);
          pointLight.position.set(-20, 40, 10);
          scene.add(pointLight);
          var camera = new window.zen3d.Camera();
          camera.position.set(0, 13, 13);
          camera.lookAt(new window.zen3d.Vector3(0, 0, 0), new window.zen3d.Vector3(0, 1, 0));
          camera.setPerspective(45 / 180 * Math.PI, width / height, 1, 1000);
          scene.add(camera);
          return {
              resize: function resize(width, height) {
                  camera.setPerspective(45 / 180 * Math.PI, width / height, 1, 1000);
              },
              render: function render(ax, ay, az) {
                  cube.euler.x = Math.PI * ax / 360;
                  cube.euler.y = Math.PI * ay / 360;
                  cube.euler.z = Math.PI * az / 360;
                  renderer.render(scene, camera);
                  return canvas;
              }
          };
      }
      return {
          getInstance: function getInstance(width, height) {
              if (!instance) {
                  instance = createInstance(width, height);
              } else {
                  instance.resize(width, height);
              }
              return instance;
          }
      };
  }();

  function _inherits$a(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$a(subClass, superClass);
  }
  function _set_prototype_of$a(o, p) {
      _set_prototype_of$a = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$a(o, p);
  }
  var SensorGyroscope = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$a(SensorGyroscope, AbstractSensor);
      function SensorGyroscope() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'gyroscope';
          return _this;
      }
      var _proto = SensorGyroscope.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readGyroBMI160()", function(val) {
              var array = JSON.parse(val);
              array[0] = Math.round(array[0]);
              array[1] = Math.round(array[1]);
              array[2] = Math.round(array[2]);
              callback(array);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, cx = param.cx, state1y = param.state1y; param.sensorAttr;
          if (!this.state) {
              this.state = [
                  0,
                  0,
                  0
              ];
          }
          if (this.stateText) {
              this.stateText.remove();
          }
          var str = "X: " + this.state[0] + "°/s\nY: " + this.state[1] + "°/s\nZ: " + this.state[2] + "°/s";
          this.stateText = this.context.paper.text(cx, state1y, str);
          if (!this.previousState) this.previousState = [
              0,
              0,
              0
          ];
          if (this.rotationAngles != undefined) {
              // update the rotation angle
              for(var i = 0; i < 3; i++)this.rotationAngles[i] += this.previousState[i] * ((+new Date() - +this.lastSpeedChange) / 1000);
              this.lastSpeedChange = new Date();
          }
          this.previousState = this.state;
          var img3d = null;
          if (!this.context.autoGrading && this.context.offLineMode) {
              img3d = gyroscope3D.getInstance(imgw, imgh);
          }
          if (img3d) {
              if (!this.screenrect || sensorHandler.isElementRemoved(this.screenrect)) {
                  this.screenrect = this.context.paper.rect(imgx, imgy, imgw, imgh);
                  this.screenrect.attr({
                      "opacity": 0
                  });
                  this.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                  this.canvasNode.setAttribute("x", imgx);
                  this.canvasNode.setAttribute("y", imgy);
                  this.canvasNode.setAttribute("width", imgw);
                  this.canvasNode.setAttribute("height", imgh);
                  this.context.paper.canvas.appendChild(this.canvasNode);
                  this.canvas = document.createElement("canvas");
                  this.canvas.width = imgw;
                  this.canvas.height = imgh;
                  this.canvasNode.appendChild(this.canvas);
              }
              var sensorCtx = this.canvas.getContext('2d');
              sensorCtx.clearRect(0, 0, imgw, imgh);
              sensorCtx.drawImage(img3d.render(this.state[0], this.state[2], this.state[1]), 0, 0);
              if (!juststate) {
                  this.focusrect.drag(function(dx, dy, x, y, event) {
                      _this.state[0] = Math.max(-125, Math.min(125, _this.old_state[0] + dy));
                      _this.state[1] = Math.max(-125, Math.min(125, _this.old_state[1] - dx));
                      sensorHandler.warnClientSensorStateChanged(_this);
                      sensorHandler.getSensorDrawer().drawSensor(_this, true);
                  }, function() {
                      _this.old_state = _this.state.slice();
                  });
              }
          } else {
              if (!this.img || sensorHandler.isElementRemoved(this.img)) {
                  this.img = this.context.paper.image(getImg('gyro.png'), imgx, imgy, imgw, imgh);
              }
              this.img.attr({
                  "x": imgx,
                  "y": imgy,
                  "width": imgw,
                  "height": imgh,
                  "opacity": fadeopacity
              });
              if (!this.context.autoGrading && this.context.offLineMode) {
                  sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, -125, 125);
              } else {
                  this.focusrect.click(function() {
                      sensorHandler.getSensorDrawer().sensorInConnectedModeError();
                  });
                  sensorHandler.getSensorDrawer().removeSlider(this);
              }
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          sensorHandler.getSensorDrawer().drawMultipleTimeLine(this, state, expectedState, type, drawParameters);
      };
      SensorGyroscope.getDefinition = function getDefinition(context, strings) {
          return {
              name: "gyroscope",
              suggestedName: strings.messages.sensorNameGyroscope,
              description: strings.messages.gyrobmi160,
              isAnalog: true,
              isSensor: true,
              portType: "i2c",
              valueType: "object",
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "gyro.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return (state + 125) / 250;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 250) - 125;
              },
              cellsAmount: function cellsAmount(paper) {
                  return 2;
              }
          };
      };
      return SensorGyroscope;
  }(AbstractSensor);

  function _inherits$9(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$9(subClass, superClass);
  }
  function _set_prototype_of$9(o, p) {
      _set_prototype_of$9 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$9(o, p);
  }
  var SensorHumidity = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$9(SensorHumidity, AbstractSensor);
      function SensorHumidity() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'humidity';
          return _this;
      }
      var _proto = SensorHumidity.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readHumidity(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('humidity.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          if (this.state == null) this.state = 0;
          this.stateText = this.context.paper.text(state1x, state1y, this.state + "%");
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 100);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorHumidity.getDefinition = function getDefinition(context, strings) {
          return {
              name: "humidity",
              suggestedName: strings.messages.sensorNameHumidity,
              description: strings.messages.humiditysensor,
              isAnalog: true,
              isSensor: true,
              portType: "D",
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "humidity.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 100;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 100);
              }
          };
      };
      return SensorHumidity;
  }(AbstractSensor);

  function _inherits$8(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$8(subClass, superClass);
  }
  function _set_prototype_of$8(o, p) {
      _set_prototype_of$8 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$8(o, p);
  }
  var SensorIrRecv = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$8(SensorIrRecv, AbstractSensor);
      function SensorIrRecv() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'irrecv';
          return _this;
      }
      var _proto = SensorIrRecv.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("isButtonPressed(\"" + this.name + "\")", function(retVal) {
              if ('boolean' === typeof retVal) {
                  callback(retVal);
              } else {
                  var intVal = parseInt(retVal, 10);
                  callback(intVal == 0);
              }
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh; param.juststate; var fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y, sensorAttr = param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.buttonon || sensorHandler.isElementRemoved(this.buttonon)) this.buttonon = this.context.paper.image(getImg('irrecvon.png'), imgx, imgy, imgw, imgh);
          if (!this.buttonoff || sensorHandler.isElementRemoved(this.buttonoff)) this.buttonoff = this.context.paper.image(getImg('irrecvoff.png'), imgx, imgy, imgw, imgh);
          this.buttonon.attr(sensorAttr);
          this.buttonoff.attr(sensorAttr);
          if (this.state) {
              this.buttonon.attr({
                  "opacity": fadeopacity
              });
              this.buttonoff.attr({
                  "opacity": 0
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.on.toUpperCase());
          } else {
              this.buttonon.attr({
                  "opacity": 0
              });
              this.buttonoff.attr({
                  "opacity": fadeopacity
              });
              this.stateText = this.context.paper.text(state1x, state1y, this.strings.messages.off.toUpperCase());
          }
          var irRemoteDialog = generateIrRemoteDialog(this.strings);
          this.focusrect.click(function() {
              if (_this.context.offLineMode) {
                  window.displayHelper.showPopupDialog(irRemoteDialog, function() {
                      var _loop = function(code) {
                          addedSomeButtons = true;
                          _this.context.remoteIRcodes[code];
                          var btn = document.createElement("BUTTON");
                          var t = document.createTextNode(code);
                          btn.className = "btn";
                          btn.appendChild(t);
                          parentdiv.appendChild(btn);
                          var capturedcode = code;
                          btn.onclick = function() {
                              $('#popupMessage').hide();
                              window.displayHelper.popupMessageShown = false;
                              if (_this.waitingForIrMessage) _this.waitingForIrMessage(capturedcode);
                          };
                          count += 1;
                          if (count == 4) {
                              count = 0;
                              parentdiv = document.createElement("DIV");
                              parentdiv.className = "form-group";
                              remotecontent.appendChild(parentdiv);
                          }
                      };
                      $('#picancel').click(function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                      });
                      $('#picancel2').click(function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                      });
                      var addedSomeButtons = false;
                      var remotecontent = document.getElementById('piremotecontent');
                      var parentdiv = document.createElement("DIV");
                      parentdiv.className = "form-group";
                      remotecontent.appendChild(parentdiv);
                      var count = 0;
                      for(var code in _this.context.remoteIRcodes)_loop(code);
                      if (!addedSomeButtons) {
                          $('#piremotemessage').text(_this.strings.messages.noIrPresets);
                      }
                      var btn = document.createElement("BUTTON");
                      var t = document.createTextNode(_this.strings.messages.irEnableContinous);
                      if (_this.state) {
                          t = document.createTextNode(_this.strings.messages.irDisableContinous);
                      }
                      btn.className = "btn";
                      btn.appendChild(t);
                      parentdiv.appendChild(btn);
                      btn.onclick = function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                          _this.state = !_this.state;
                          sensorHandler.warnClientSensorStateChanged(_this);
                          sensorHandler.getSensorDrawer().drawSensor(_this);
                      };
                  });
              } else {
                  //this.sensorInConnectedModeError();
                  _this.context.stopLiveUpdate = true;
                  var irLearnDialog = "<div class=\"content qpi\">" + "   <div class=\"panel-heading\">" + "       <h2 class=\"sectionTitle\">" + "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" + _this.strings.messages.irReceiverTitle + "       </h2>" + "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" + "   </div>" + "   <div id=\"sensorPicker\" class=\"panel-body\">" + "       <div class=\"form-group\">" + "           <p>" + _this.strings.messages.directIrControl + "</p>" + "       </div>" + "       <div class=\"form-group\">" + "           <p id=piircode></p>" + "       </div>" + "   </div>" + "   <div class=\"singleButton\">" + "       <button id=\"piirlearn\" class=\"btn\"><i class=\"fa fa-wifi icon\"></i>" + _this.strings.messages.getIrCode + "</button>" + "       <button id=\"picancel2\" class=\"btn\"><i class=\"fa fa-times icon\"></i>" + _this.strings.messages.closeDialog + "</button>" + "   </div>" + "</div>";
                  window.displayHelper.showPopupDialog(irLearnDialog, function() {
                      $('#picancel').click(function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                          _this.context.stopLiveUpdate = false;
                      });
                      $('#picancel2').click(function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                          _this.context.stopLiveUpdate = false;
                      });
                      $('#piirlearn').click(function() {
                          $('#piirlearn').attr('disabled', 'disabled');
                          $("#piircode").text("");
                          _this.context.quickPiConnection.sendCommand("readIRMessageCode(\"irrec1\", 10000)", function(retval) {
                              $('#piirlearn').attr('disabled', null);
                              $("#piircode").text(retval);
                          });
                      });
                  });
              }
          });
      /*
      if (!this.context.autoGrading && !sensor.buttonon.node.onmousedown) {
          sensor.focusrect.node.onmousedown = () => {
              if (this.context.offLineMode) {
                  sensor.state = true;
                  this.drawSensor(sensor);
              } else
                  this.sensorInConnectedModeError();
          };


          sensor.focusrect.node.onmouseup = () => {
              if (this.context.offLineMode) {
                  sensor.state = false;
                  this.drawSensor(sensor);

                  if (sensor.onPressed)
                      sensor.onPressed();
              } else
                  this.sensorInConnectedModeError();
          }

          sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
          sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
      }*/ };
      SensorIrRecv.getDefinition = function getDefinition(context, strings) {
          return {
              name: "irrecv",
              suggestedName: strings.messages.sensorNameIrRecv,
              description: strings.messages.irreceiver,
              isAnalog: false,
              isSensor: true,
              portType: "D",
              valueType: "number",
              valueMin: 0,
              valueMax: 60,
              selectorImages: [
                  "irrecvon.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 60;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 60);
              }
          };
      };
      return SensorIrRecv;
  }(AbstractSensor);

  function _inherits$7(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$7(subClass, superClass);
  }
  function _set_prototype_of$7(o, p) {
      _set_prototype_of$7 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$7(o, p);
  }
  var SensorLight = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$7(SensorLight, AbstractSensor);
      function SensorLight() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'light';
          return _this;
      }
      var _proto = SensorLight.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readLightIntensity(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('light.png'), imgx, imgy, imgw, imgh);
          if (!this.moon || sensorHandler.isElementRemoved(this.moon)) this.moon = this.context.paper.image(getImg('light-moon.png'), imgx, imgy, imgw, imgh);
          if (!this.sun || sensorHandler.isElementRemoved(this.sun)) this.sun = this.context.paper.image(getImg('light-sun.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          if (this.state == null) this.state = 0;
          if (this.state > 50) {
              var opacity = (this.state - 50) * 0.02;
              this.sun.attr({
                  "x": imgx,
                  "y": imgy,
                  "width": imgw,
                  "height": imgh,
                  "opacity": opacity * .80 * fadeopacity
              });
              this.moon.attr({
                  "opacity": 0
              });
          } else {
              var opacity1 = (50 - this.state) * 0.02;
              this.moon.attr({
                  "x": imgx,
                  "y": imgy,
                  "width": imgw,
                  "height": imgh,
                  "opacity": opacity1 * .80 * fadeopacity
              });
              this.sun.attr({
                  "opacity": 0
              });
          }
          this.stateText = this.context.paper.text(state1x, state1y, this.state + "%");
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 100);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorLight.getDefinition = function getDefinition(context, strings) {
          return {
              name: "light",
              suggestedName: strings.messages.sensorNameLight,
              description: strings.messages.lightsensor,
              isAnalog: true,
              isSensor: true,
              portType: "A",
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "light.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 100;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 100);
              }
          };
      };
      return SensorLight;
  }(AbstractSensor);

  function _inherits$6(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$6(subClass, superClass);
  }
  function _set_prototype_of$6(o, p) {
      _set_prototype_of$6 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$6(o, p);
  }
  var SensorMagnetometer = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$6(SensorMagnetometer, AbstractSensor);
      function SensorMagnetometer() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'magnetometer';
          return _this;
      }
      var _proto = SensorMagnetometer.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readMagnetometerLSM303C(False)", function(val) {
              var array = JSON.parse(val);
              array[0] = Math.round(array[0]);
              array[1] = Math.round(array[1]);
              array[2] = Math.round(array[2]);
              callback(array);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, cx = param.cx, state1y = param.state1y;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('mag.png'), imgx, imgy, imgw, imgh);
          if (!this.needle || sensorHandler.isElementRemoved(this.needle)) this.needle = this.context.paper.image(getImg('mag-needle.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.needle.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "transform": "",
              "opacity": fadeopacity
          });
          if (!this.state) {
              this.state = [
                  0,
                  0,
                  0
              ];
          }
          if (this.state) {
              var heading = Math.atan2(this.state[0], this.state[1]) * (180 / Math.PI) + 180;
              this.needle.rotate(heading);
          }
          if (this.stateText) this.stateText.remove();
          if (this.state) {
              var str = "X: " + this.state[0] + " μT\nY: " + this.state[1] + " μT\nZ: " + this.state[2] + " μT";
              this.stateText = this.context.paper.text(cx, state1y, str);
          }
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, -1600, 1600);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          sensorHandler.getSensorDrawer().drawMultipleTimeLine(this, state, expectedState, type, drawParameters);
      };
      SensorMagnetometer.getDefinition = function getDefinition(context, strings) {
          return {
              name: "magnetometer",
              suggestedName: strings.messages.sensorNameMagnetometer,
              description: strings.messages.maglsm303c,
              isAnalog: true,
              isSensor: true,
              portType: "i2c",
              valueType: "object",
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "mag.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return (state + 1600) / 3200;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 3200) - 1600;
              },
              cellsAmount: function cellsAmount(paper) {
                  return 2;
              }
          };
      };
      return SensorMagnetometer;
  }(AbstractSensor);

  function _inherits$5(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$5(subClass, superClass);
  }
  function _set_prototype_of$5(o, p) {
      _set_prototype_of$5 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$5(o, p);
  }
  var SensorPotentiometer = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$5(SensorPotentiometer, AbstractSensor);
      function SensorPotentiometer() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'potentiometer';
          return _this;
      }
      var _proto = SensorPotentiometer.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readRotaryAngle(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('potentiometer.png'), imgx, imgy, imgw, imgh);
          if (!this.pale || sensorHandler.isElementRemoved(this.pale)) this.pale = this.context.paper.image(getImg('potentiometer-pale.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.pale.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "transform": "",
              "opacity": fadeopacity
          });
          if (this.state == null) this.state = 0;
          this.pale.rotate(this.state * 3.6);
          this.stateText = this.context.paper.text(state1x, state1y, this.state + "%");
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 100);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorPotentiometer.getDefinition = function getDefinition(context, strings) {
          return {
              name: "potentiometer",
              suggestedName: strings.messages.sensorNamePotentiometer,
              description: strings.messages.potentiometer,
              isAnalog: true,
              isSensor: true,
              portType: "A",
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "potentiometer.png",
                  "potentiometer-pale.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 100;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 100);
              }
          };
      };
      return SensorPotentiometer;
  }(AbstractSensor);

  function _inherits$4(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$4(subClass, superClass);
  }
  function _set_prototype_of$4(o, p) {
      _set_prototype_of$4 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$4(o, p);
  }
  var SensorRange = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$4(SensorRange, AbstractSensor);
      function SensorRange() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'range';
          return _this;
      }
      var _proto = SensorRange.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readDistance(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('range.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy - imgh * 0.1,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          if (this.state == null) this.state = 500;
          if (this.rangedistance) this.rangedistance.remove();
          if (this.rangedistancestart) this.rangedistancestart.remove();
          if (this.rangedistanceend) this.rangedistanceend.remove();
          var rangew;
          if (this.state < 30) {
              rangew = imgw * this.state / 100;
          } else {
              var firstpart = imgw * 30 / 100;
              var remaining = imgw - firstpart;
              rangew = firstpart + remaining * this.state * 0.0015;
          }
          var cx = imgx + imgw / 2;
          var cy = imgy + imgh * 0.85;
          var x1 = cx - rangew / 2;
          var x2 = cx + rangew / 2;
          var markh = 12;
          var y1 = cy - markh / 2;
          var y2 = cy + markh / 2;
          this.rangedistance = this.context.paper.path([
              "M",
              x1,
              cy,
              "H",
              x2
          ]);
          this.rangedistancestart = this.context.paper.path([
              "M",
              x1,
              y1,
              "V",
              y2
          ]);
          this.rangedistanceend = this.context.paper.path([
              "M",
              x2,
              y1,
              "V",
              y2
          ]);
          this.rangedistance.attr({
              "stroke-width": 4,
              "stroke": "#468DDF",
              "stroke-linecapstring": "round"
          });
          this.rangedistancestart.attr({
              "stroke-width": 4,
              "stroke": "#468DDF",
              "stroke-linecapstring": "round"
          });
          this.rangedistanceend.attr({
              "stroke-width": 4,
              "stroke": "#468DDF",
              "stroke-linecapstring": "round"
          });
          if (this.state >= 10) this.state = Math.round(this.state);
          this.stateText = this.context.paper.text(state1x, state1y, this.state + " cm");
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 500);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorRange.getDefinition = function getDefinition(context, strings) {
          return {
              name: "range",
              suggestedName: strings.messages.sensorNameDistance,
              description: strings.messages.distancesensor,
              isAnalog: true,
              isSensor: true,
              portType: "D",
              valueType: "number",
              valueMin: 0,
              valueMax: 5000,
              selectorImages: [
                  "range.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 500;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 500);
              },
              disablePinControl: true,
              subTypes: [
                  {
                      subType: "vl53l0x",
                      description: strings.messages.timeofflightranger,
                      portType: "i2c"
                  },
                  {
                      subType: "ultrasonic",
                      description: strings.messages.ultrasonicranger,
                      portType: "D",
                      pluggable: true
                  }
              ]
          };
      };
      return SensorRange;
  }(AbstractSensor);

  function _inherits$3(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$3(subClass, superClass);
  }
  function _set_prototype_of$3(o, p) {
      _set_prototype_of$3 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$3(o, p);
  }
  var SensorSound = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$3(SensorSound, AbstractSensor);
      function SensorSound(sensorData, context, strings) {
          var _this;
          _this = AbstractSensor.call(this, sensorData, context, strings) || this;
          _this.type = 'sound';
          if (undefined === _this.unit) {
              _this.unit = 'dB';
          }
          return _this;
      }
      var _proto = SensorSound.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readSoundLevel(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          console.log('unit', this.unit);
          if (this.stateText) this.stateText.remove();
          if (this.state == null) this.state = 0;
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('sound.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          // if we just do sensor.state, if it is equal to 0 then the state is not displayed
          if (this.state != null) {
              this.stateText = this.context.paper.text(state1x, state1y, this.state + (this.unit ? ' ' + this.unit : ''));
          }
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 60);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorSound.getDefinition = function getDefinition(context, strings) {
          return {
              name: "sound",
              suggestedName: strings.messages.sensorNameMicrophone,
              description: strings.messages.soundsensor,
              isAnalog: true,
              isSensor: true,
              portType: "A",
              valueType: "number",
              pluggable: true,
              valueMin: 0,
              valueMax: 100,
              selectorImages: [
                  "sound.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 100;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 100);
              }
          };
      };
      return SensorSound;
  }(AbstractSensor);

  function _inherits$2(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$2(subClass, superClass);
  }
  function _set_prototype_of$2(o, p) {
      _set_prototype_of$2 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$2(o, p);
  }
  var SensorTemperature = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$2(SensorTemperature, AbstractSensor);
      function SensorTemperature() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'temperature';
          return _this;
      }
      var _proto = SensorTemperature.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          this.context.quickPiConnection.sendCommand("readTemperature(\"" + this.name + "\")", function(val) {
              val = Math.round(val);
              callback(val);
          });
      };
      _proto.draw = function draw(sensorHandler, param) {
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, juststate = param.juststate, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y; param.sensorAttr;
          if (this.stateText) this.stateText.remove();
          if (this.state == null) this.state = 25; // FIXME
          if (!this.img || sensorHandler.isElementRemoved(this.img)) this.img = this.context.paper.image(getImg('temperature-cold.png'), imgx, imgy, imgw, imgh);
          if (!this.img2 || sensorHandler.isElementRemoved(this.img2)) this.img2 = this.context.paper.image(getImg('temperature-hot.png'), imgx, imgy, imgw, imgh);
          if (!this.img3 || sensorHandler.isElementRemoved(this.img3)) this.img3 = this.context.paper.image(getImg('temperature-overlay.png'), imgx, imgy, imgw, imgh);
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.img2.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          this.img3.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          var scale = imgh / 60;
          var cliph = scale * this.state;
          this.img2.attr({
              "clip-rect": imgx + "," + (imgy + imgh - cliph) + "," + imgw + "," + cliph
          });
          this.stateText = this.context.paper.text(state1x, state1y, this.state + " °C");
          if (!this.context.autoGrading && this.context.offLineMode) {
              sensorHandler.getSensorDrawer().setSlider(this, juststate, imgx, imgy, imgw, imgh, 0, 60);
          } else {
              this.focusrect.click(function() {
                  sensorHandler.getSensorDrawer().sensorInConnectedModeError();
              });
              sensorHandler.getSensorDrawer().removeSlider(this);
          }
      };
      SensorTemperature.getDefinition = function getDefinition(context, strings) {
          return {
              name: "temperature",
              suggestedName: strings.messages.sensorNameTemperature,
              description: strings.messages.tempsensor,
              isAnalog: true,
              isSensor: true,
              portType: "A",
              valueType: "number",
              valueMin: 0,
              valueMax: 60,
              selectorImages: [
                  "temperature-hot.png",
                  "temperature-overlay.png"
              ],
              getPercentageFromState: function getPercentageFromState(state) {
                  return state / 60;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  return Math.round(percentage * 60);
              },
              subTypes: [
                  {
                      subType: "groveanalog",
                      description: strings.messages.groveanalogtempsensor,
                      portType: "A",
                      pluggable: true
                  },
                  {
                      subType: "BMI160",
                      description: strings.messages.quickpigyrotempsensor,
                      portType: "i2c"
                  },
                  {
                      subType: "DHT11",
                      description: strings.messages.dht11tempsensor,
                      portType: "D",
                      pluggable: true
                  }
              ]
          };
      };
      return SensorTemperature;
  }(AbstractSensor);

  function _extends$2() {
      _extends$2 = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source){
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      };
      return _extends$2.apply(this, arguments);
  }
  function _inherits$1(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$1(subClass, superClass);
  }
  function _set_prototype_of$1(o, p) {
      _set_prototype_of$1 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$1(o, p);
  }
  var SensorWifi = /*#__PURE__*/ function(AbstractSensor) {
      _inherits$1(SensorWifi, AbstractSensor);
      function SensorWifi() {
          var _this;
          _this = AbstractSensor.apply(this, arguments) || this;
          _this.type = 'wifi';
          return _this;
      }
      var _proto = SensorWifi.prototype;
      _proto.getLiveState = function getLiveState(callback) {
          var _this = this;
          this.context.quickPiConnection.sendCommand('wifiGetStatus("' + this.name + '")', function(val) {
              var _JSON_parse = JSON.parse(val), active = _JSON_parse[0], status = _JSON_parse[1], ssid = _JSON_parse[2];
              callback(_extends$2({}, _this.state, {
                  active: active,
                  connected: 1010 === status,
                  connecting: 1001 === status,
                  ssid: ssid
              }));
          });
      };
      _proto.setLiveState = function setLiveState(state, callback) {
          var command = 'setWifiState("' + this.name + '", [0, 0, 0])';
          this.context.quickPiConnection.sendCommand(command, callback);
      };
      _proto.draw = function draw(sensorHandler, param) {
          var _this = this;
          var imgx = param.imgx, imgy = param.imgy, imgw = param.imgw, imgh = param.imgh, fadeopacity = param.fadeopacity, state1x = param.state1x, state1y = param.state1y;
          var _this_state, _this_state1, _this_state2, _this_state3, _this_state4;
          if (this.stateText) {
              this.stateText.remove();
          }
          if (!this.state) {
              this.state = {
                  active: false,
                  connected: false,
                  ssid: '',
                  password: '',
                  ssidInput: '',
                  passwordInput: ''
              };
          }
          var redrawModalState = function() {
              $('#wifi_ssid').val(_this.state.ssidInput);
              $('#wifi_password').val(_this.state.passwordInput);
              if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                  $('#wifi_ssid').prop('disabled', false);
                  $('#wifi_password').prop('disabled', false);
              } else {
                  $('#wifi_ssid').prop('disabled', true);
                  $('#wifi_password').prop('disabled', true);
              }
              if (_this.state.active) {
                  if (_this.state.connected) {
                      $('#wifi_enable').hide();
                      $('#wifi_disable').show();
                      $('#wifi_connect').hide();
                      $('#wifi_disconnect').show();
                  } else {
                      $('#wifi_enable').hide();
                      $('#wifi_disable').show();
                      $('#wifi_connect').show();
                      $('#wifi_disconnect').hide();
                  }
              } else {
                  $('#wifi_enable').show();
                  $('#wifi_disable').hide();
                  $('#wifi_connect').hide();
                  $('#wifi_disconnect').hide();
              }
              if (_this.state.activating) {
                  $('#wifi_activating').show();
                  $('#wifi_enable_icon').hide();
              } else {
                  $('#wifi_activating').hide();
                  $('#wifi_enable_icon').show();
              }
              if (_this.state.connecting) {
                  $('#wifi_connecting').show();
                  $('#wifi_connect_icon').hide();
              } else {
                  $('#wifi_connecting').hide();
                  $('#wifi_connect_icon').show();
              }
              var realStatus = !_this.state.active ? 'disabled' : _this.state.connected ? 'connected' : 'disconnected';
              $('#wifi_status').val(realStatus);
          };
          redrawModalState();
          if (!this.img || sensorHandler.isElementRemoved(this.img)) {
              this.img = this.context.paper.image(getImg('wifi.png'), imgx, imgy, imgw, imgh);
              this.focusrect.click(function() {
                  var wifiDialog = '\n        <div class="content qpi" id="wifi_dialog">\n          <div class="panel-heading" id="bim">\n            <h2 class="sectionTitle">\n              <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>\n              ' + _this.strings.messages.wifi + '\n            </h2>\n            <div class="exit" id="picancel">\n              <i class="icon fas fa-times"></i>\n            </div>\n          </div>\n          <div class="panel-body">\n            <div class="wifi-actuator">\n              <div class="form-group">\n                 <label id="ssidlabel">' + _this.strings.messages.wifiSsid + '</label>\n                 <div class="input-group">\n                    <div class="input-group-prepend">\n                       Aa\n                    </div>\n                    <input type="text" id="wifi_ssid" class="form-control">\n                 </div>\n              </div>\n               <div class="form-group">\n                 <label id="passwordlabel">' + _this.strings.messages.wifiPassword + '</label>\n                 <div class="input-group">\n                    <div class="input-group-prepend">\n                       Aa\n                    </div>\n                    <input type="text" id="wifi_password" class="form-control">\n                 </div>\n              </div>\n               <div class="wifi-button-group">\n                  <button id="wifi_disable" class="btn">\n                    <i id="piconnectwifiicon" class="fa fa-power-off icon"></i>\n                    ' + _this.strings.messages.wifiDisable + '\n                  </button>\n                  <button id="wifi_enable" class="btn">\n                    <i id="wifi_activating" class="fas fa-spinner fa-spin icon"> </i>\n                    <i id="wifi_enable_icon" class="fa fa-signal icon"></i>\n                    ' + _this.strings.messages.wifiEnable + '\n                  </button>\n                  <button id="wifi_connect" class="btn">\n                    <i id="wifi_connecting" class="fas fa-spinner fa-spin icon"> </i>\n                    <i id="wifi_connect_icon" class="fa fa-wifi icon"></i>\n                    ' + _this.strings.messages.wifiConnect + '\n                  </button>\n                   <button id="wifi_disconnect" class="btn">\n                    <i id="wifi_disable_icon" class="fa fa-wifi icon"></i>\n                    ' + _this.strings.messages.wifiDisconnect + '\n                  </button>\n               </div>\n            </div>    \n            <div class="wifi-sensor">\n             <div class="form-group">\n                 <label id="pilistlabel">' + _this.strings.messages.wifiStatus + '</label>\n                 <div class="input-group">\n                    <select id="wifi_status" class="custom-select">\n                      <option value="disabled">' + _this.strings.messages.wifiStatusDisabled + '</option>\n                      <option value="disconnected">' + _this.strings.messages.wifiStatusDisconnected + '</option>\n                      <option value="connected">' + _this.strings.messages.wifiStatusConnected + "</option>\n                    </select>\n                 </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      ";
                  var sendCommandAndFetchState = function(command) {
                      _this.context.quickPiConnection.sendCommand(command, function() {
                          _this.getLiveState(function(returnVal) {
                              _this.state = returnVal;
                              redrawModalState();
                              sensorHandler.drawSensor(_this);
                          });
                      });
                  };
                  window.displayHelper.showPopupDialog(wifiDialog, function() {
                      redrawModalState();
                      $('#picancel').click(function() {
                          $('#popupMessage').hide();
                          window.displayHelper.popupMessageShown = false;
                      });
                      $('#wifi_enable').click(function() {
                          if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                              if (!_this.context.display || _this.context.autoGrading || _this.context.offLineMode) {
                                  _this.state.activating = true;
                                  redrawModalState();
                                  setTimeout(function() {
                                      _this.state.activating = false;
                                      _this.state.active = true;
                                      sensorHandler.warnClientSensorStateChanged(_this);
                                      sensorHandler.getSensorDrawer().drawSensor(_this);
                                      redrawModalState();
                                  }, 500);
                              } else {
                                  var command = 'wifiSetActive("' + _this.name + '", 1)';
                                  _this.context.quickPiConnection.sendCommand(command, sendCommandAndFetchState);
                              }
                          } else {
                              sensorHandler.getSensorDrawer().actuatorsInRunningModeError();
                          }
                      });
                      $('#wifi_disable').click(function() {
                          if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                              if (!_this.context.display || _this.context.autoGrading || _this.context.offLineMode) {
                                  _this.state.active = false;
                                  _this.state.connected = false;
                                  sensorHandler.warnClientSensorStateChanged(_this);
                                  sensorHandler.getSensorDrawer().drawSensor(_this);
                                  redrawModalState();
                              } else {
                                  var command = 'wifiSetActive("' + _this.name + '", 0)';
                                  sendCommandAndFetchState(command);
                              }
                          } else {
                              sensorHandler.getSensorDrawer().actuatorsInRunningModeError();
                          }
                      });
                      $('#wifi_connect').click(function() {
                          if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                              if (!_this.context.display || _this.context.autoGrading || _this.context.offLineMode) {
                                  if (_this.state.connecting) {
                                      _this.state.connected = false;
                                      _this.state.connecting = false;
                                      sensorHandler.warnClientSensorStateChanged(_this);
                                      sensorHandler.getSensorDrawer().drawSensor(_this);
                                      redrawModalState();
                                  } else {
                                      _this.state.connecting = true;
                                      redrawModalState();
                                      setTimeout(function() {
                                          _this.state.connecting = false;
                                          _this.state.connected = true;
                                          sensorHandler.warnClientSensorStateChanged(_this);
                                          sensorHandler.getSensorDrawer().drawSensor(_this);
                                          redrawModalState();
                                      }, 500);
                                  }
                              } else {
                                  if (_this.state.connecting) {
                                      _this.state.connecting = false;
                                      var command = "wifiDisconnect(\"" + _this.name + "\")";
                                      sendCommandAndFetchState(command);
                                      redrawModalState();
                                  } else {
                                      var ssid = $('#wifi_ssid').val();
                                      var password = $('#wifi_password').val();
                                      _this.state.connecting = true;
                                      var command1 = "wifiConnect(\"" + _this.name + "\", \"" + ssid + "\", \"" + password + "\")";
                                      sendCommandAndFetchState(command1);
                                      redrawModalState();
                                  }
                              }
                          } else {
                              sensorHandler.getSensorDrawer().actuatorsInRunningModeError();
                          }
                      });
                      $('#wifi_disconnect').click(function() {
                          if (!_this.context.autoGrading && (!_this.context.runner || !_this.context.runner.isRunning())) {
                              if (!_this.context.display || _this.context.autoGrading || _this.context.offLineMode) {
                                  _this.state.connected = false;
                                  sensorHandler.warnClientSensorStateChanged(_this);
                                  sensorHandler.getSensorDrawer().drawSensor(_this);
                                  redrawModalState();
                              } else {
                                  var command = "wifiDisconnect(\"" + _this.name + "\")";
                                  sendCommandAndFetchState(command);
                              }
                          } else {
                              sensorHandler.getSensorDrawer().actuatorsInRunningModeError();
                          }
                      });
                      $('#wifi_ssid').on('input', function() {
                          _this.state.ssidInput = $('#wifi_ssid').val();
                          sensorHandler.warnClientSensorStateChanged(_this);
                          sensorHandler.getSensorDrawer().drawSensor(_this);
                      });
                      $('#wifi_password').on('input', function() {
                          _this.state.passwordInput = $('#wifi_password').val();
                          sensorHandler.warnClientSensorStateChanged(_this);
                          sensorHandler.getSensorDrawer().drawSensor(_this);
                      });
                      $('#wifi_status').on('change', function() {
                          var newStatus = $('#wifi_status').val();
                          if (!_this.context.autoGrading && _this.context.offLineMode) {
                              if ('disabled' === newStatus) {
                                  _this.state.active = false;
                                  _this.state.connected = false;
                              } else if ('disconnected' === newStatus) {
                                  _this.state.active = true;
                                  _this.state.connected = false;
                              } else if ('connected' === newStatus) {
                                  _this.state.active = true;
                                  _this.state.connected = true;
                              }
                              sensorHandler.warnClientSensorStateChanged(_this);
                              sensorHandler.getSensorDrawer().drawSensor(_this);
                              redrawModalState();
                          } else {
                              sensorHandler.getSensorDrawer().sensorInConnectedModeError();
                          }
                      });
                  });
              });
          }
          if (!this.active || sensorHandler.isElementRemoved(this.active)) this.active = this.context.paper.circle();
          var ssid = (_this_state = this.state) == null ? void 0 : _this_state.ssid;
          this.stateText = this.context.paper.text(state1x, state1y, ((_this_state1 = this.state) == null ? void 0 : _this_state1.scanning) ? '...' : ssid && ((_this_state2 = this.state) == null ? void 0 : _this_state2.connected) ? textEllipsis(ssid, 6) : '');
          this.img.attr({
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh,
              "opacity": fadeopacity
          });
          var color = 'grey';
          if ((_this_state3 = this.state) == null ? void 0 : _this_state3.connected) {
              color = 'green';
          } else if ((_this_state4 = this.state) == null ? void 0 : _this_state4.active) {
              color = 'red';
          }
          this.active.attr({
              "cx": imgx + imgw * 0.15,
              "cy": imgy + imgh * 0.1,
              "r": imgh * 0.15,
              fill: "" + color,
              stroke: 'none',
              opacity: 1
          });
      };
      _proto.drawTimelineState = function drawTimelineState(sensorHandler, state, expectedState, type, drawParameters) {
          var _this = this;
          var sensorDef = sensorHandler.findSensorDefinition(this);
          var drawBubble = function() {
              var textToDisplay = [];
              var renderNewLine = function(title, value, expectedValue) {
                  if (null !== expectedValue && undefined !== expectedValue && value !== expectedValue) {
                      textToDisplay.push((title ? title + ' "' + value + '"' : value) + " (" + _this.strings.messages.insteadOf + ' "' + expectedValue + '")');
                  } else {
                      textToDisplay.push("" + (title ? title + ' "' + value + '"' : value));
                  }
              };
              var expectedStatus = expectedState ? sensorDef.getStateString(expectedState) : null;
              var currentStatus = sensorDef.getStateString(state);
              var displayFieldsFrom = 'wrong' === type && expectedState ? expectedState : state;
              if ('connected' in displayFieldsFrom || 'active' in displayFieldsFrom) {
                  renderNewLine(_this.strings.messages.wifiStatus, currentStatus, expectedStatus);
              }
              if (displayFieldsFrom.ssid) {
                  renderNewLine(_this.strings.messages.wifiSsid, state.ssid, expectedState == null ? void 0 : expectedState.ssid);
              }
              if (displayFieldsFrom.password) {
                  renderNewLine(_this.strings.messages.wifiPassword, state.password, expectedState == null ? void 0 : expectedState.password);
              }
              if (displayFieldsFrom.lastRequest) {
                  var _expectedState_lastRequest, _expectedState_lastRequest1;
                  renderNewLine(null, (state == null ? void 0 : state.lastRequest) ? state.lastRequest.method + " " + state.lastRequest.url : _this.strings.messages.wifiNoRequestShort, (expectedState == null ? void 0 : expectedState.lastRequest) ? (expectedState == null ? void 0 : (_expectedState_lastRequest = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest.method) + " " + (expectedState == null ? void 0 : (_expectedState_lastRequest1 = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest1.url) : null);
                  if ((state == null ? void 0 : state.lastRequest) && displayFieldsFrom.lastRequest.headers) {
                      var _expectedState_lastRequest2, _expectedState_lastRequest3;
                      var _serializeFields;
                      renderNewLine(_this.strings.messages.wifiHeaders, "" + ((_serializeFields = serializeFields(state.lastRequest.headers)) != null ? _serializeFields : ''), (expectedState == null ? void 0 : (_expectedState_lastRequest2 = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest2.headers) ? "" + serializeFields(expectedState == null ? void 0 : (_expectedState_lastRequest3 = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest3.headers) : null);
                  }
                  if ((state == null ? void 0 : state.lastRequest) && displayFieldsFrom.lastRequest.body) {
                      var _expectedState_lastRequest4, _expectedState_lastRequest5;
                      var _serializeFields1, _expectedState_lastRequest_body;
                      renderNewLine(_this.strings.messages.wifiBody, "" + ((_serializeFields1 = serializeFields(state.lastRequest.body)) != null ? _serializeFields1 : ''), (expectedState == null ? void 0 : (_expectedState_lastRequest4 = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest4.body) ? "" + serializeFields((_expectedState_lastRequest_body = expectedState == null ? void 0 : (_expectedState_lastRequest5 = expectedState.lastRequest) == null ? void 0 : _expectedState_lastRequest5.body) != null ? _expectedState_lastRequest_body : {}) : null);
                  }
              }
              var div = document.createElement("div");
              $(div).html(textToDisplay.join('<br/>'));
              return div;
          };
          drawBubbleTimeline(this, sensorHandler, state, expectedState, type, drawParameters, drawBubble);
      };
      SensorWifi.getDefinition = function getDefinition(context, strings) {
          return {
              name: "wifi",
              suggestedName: strings.messages.sensorNameWifi,
              description: strings.messages.wifi,
              isAnalog: false,
              isSensor: true,
              portType: "D",
              selectorImages: [
                  "wifi.png"
              ],
              valueType: "object",
              valueMin: 0,
              valueMax: 100,
              pluggable: true,
              getPercentageFromState: function getPercentageFromState(state) {
                  if (state.active) {
                      if (state.connected) {
                          return 1;
                      }
                      return 0.5;
                  }
                  return 0;
              },
              getStateFromPercentage: function getStateFromPercentage(percentage) {
                  if (percentage) return 1;
                  else return 0;
              },
              getStateString: function getStateString(state) {
                  if (state.connected) {
                      return strings.messages.wifiStatusConnected;
                  }
                  if (state.active) {
                      return strings.messages.wifiStatusDisconnected;
                  }
                  return strings.messages.wifiStatusDisabled;
              },
              compareState: function compareState(state1, state2) {
                  if (state1 === null && state2 === null) {
                      return true;
                  }
                  if (null !== state1 && null === state2 || null !== state2 && null === state1) {
                      return false;
                  }
                  return deepSubsetEqual(state1, state2);
              },
              getWrongStateString: function getWrongStateString(failInfo) {
                  var actual = failInfo.actual, expected = failInfo.expected, name = failInfo.name, time = failInfo.time;
                  var expectedStatus = this.getStateString(expected);
                  var actualStatus = this.getStateString(actual);
                  if (undefined !== expected.active && actual.active !== expected.active || undefined !== expected.connected && actual.connected !== expected.connected) {
                      return strings.messages.wrongState.format(name, actualStatus, expectedStatus, time);
                  }
                  if (undefined !== expected.ssid && actual.ssid !== expected.ssid || undefined !== expected.password && actual.password !== expected.password) {
                      return strings.messages.wifiWrongCredentials.format(name, actual.ssid + ' / ' + actual.password, expected.ssid + ' / ' + expected.password, time);
                  }
                  if (undefined !== expected.lastRequest) {
                      if (!actual.lastRequest) {
                          return strings.messages.wifiNoRequest.format(name, time);
                      }
                      if (undefined !== expected.lastRequest.method && expected.lastRequest.method !== actual.lastRequest.method) {
                          return strings.messages.wifiWrongMethod.format(name, actual.lastRequest.method, expected.lastRequest.method, time);
                      }
                      if (undefined !== expected.lastRequest.url && expected.lastRequest.url !== actual.lastRequest.url) {
                          return strings.messages.wifiWrongUrl.format(name, actual.lastRequest.url, expected.lastRequest.url, time);
                      }
                      if (undefined !== expected.lastRequest.headers) {
                          for(var field in expected.lastRequest.headers){
                              var _actual_lastRequest_headers;
                              if (expected.lastRequest.headers[field] !== ((_actual_lastRequest_headers = actual.lastRequest.headers) == null ? void 0 : _actual_lastRequest_headers[field])) {
                                  var _actual_lastRequest_headers1;
                                  var _actual_lastRequest_headers_field;
                                  return strings.messages.wifiWrongHeader.format(name, field, (_actual_lastRequest_headers_field = (_actual_lastRequest_headers1 = actual.lastRequest.headers) == null ? void 0 : _actual_lastRequest_headers1[field]) != null ? _actual_lastRequest_headers_field : '', expected.lastRequest.headers[field], time);
                              }
                          }
                      }
                      if (undefined !== expected.lastRequest.body) {
                          for(var field1 in expected.lastRequest.body){
                              var _actual_lastRequest_body;
                              if (expected.lastRequest.body[field1] !== ((_actual_lastRequest_body = actual.lastRequest.body) == null ? void 0 : _actual_lastRequest_body[field1])) {
                                  var _actual_lastRequest_body1;
                                  var _actual_lastRequest_body_field;
                                  return strings.messages.wifiWrongBody.format(name, field1, (_actual_lastRequest_body_field = (_actual_lastRequest_body1 = actual.lastRequest.body) == null ? void 0 : _actual_lastRequest_body1[field1]) != null ? _actual_lastRequest_body_field : '', expected.lastRequest.body[field1], time);
                              }
                          }
                      }
                  }
                  return strings.messages.wifiUnknownError.format(name, time);
              }
          };
      };
      return SensorWifi;
  }(AbstractSensor);
  function serializeFields(fields) {
      if (!fields || 0 === Object.keys(fields).length) {
          return null;
      }
      return Object.entries(fields).map(function(param) {
          var key = param[0], value = param[1];
          return key + " = " + value;
      }).join(', ');
  }

  function _extends$1() {
      _extends$1 = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source){
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      };
      return _extends$1.apply(this, arguments);
  }
  var sensorsList = {
      accelerometer: SensorAccelerometer,
      button: SensorButton,
      buzzer: SensorBuzzer,
      clock: SensorClock,
      cloudstore: SensorCloudStore,
      gyroscope: SensorGyroscope,
      humidity: SensorHumidity,
      irrecv: SensorIrRecv,
      irtrans: SensorIrTrans,
      led: SensorLed,
      leddim: SensorLedDim,
      ledmatrix: SensorLedMatrix,
      ledrgb: SensorLedRgb,
      light: SensorLight,
      magnetometer: SensorMagnetometer,
      potentiometer: SensorPotentiometer,
      range: SensorRange,
      screen: SensorScreen,
      servo: SensorServo,
      sound: SensorSound,
      stick: SensorStick,
      temperature: SensorTemperature,
      wifi: SensorWifi
  };
  function createSensor(sensor, context, strings) {
      if (sensor.type in sensorsList) {
          return new sensorsList[sensor.type](sensor, context, strings);
      }
      return _extends$1({}, sensor);
  }

  function _array_like_to_array$4(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _unsupported_iterable_to_array$4(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$4(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$4(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$4(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$4(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function showConfig(param) {
      var context = param.context, strings = param.strings, mainBoard = param.mainBoard;
      var availableConnectionMethods = mainBoard.getAvailableConnectionMethods();
      if (!(context.localhostAvailable || context.windowLocationAvailable) && -1 !== availableConnectionMethods.indexOf(ConnectionMethod.Local)) {
          availableConnectionMethods.splice(availableConnectionMethods.indexOf(ConnectionMethod.Local), 1);
      }
      var boardDefinitions = mainBoard.getBoardDefinitions();
      var sensorHandler = context.sensorHandler;
      var sensorDefinitions = sensorHandler.getSensorDefinitions();
      var connectionDialogHTML = getConnectionDialogHTML(availableConnectionMethods, strings, boardDefinitions, sensorDefinitions);
      var customSensors = context.infos.customSensors;
      window.displayHelper.showPopupDialog(connectionDialogHTML, function() {
          var _loop = function() {
              var board = boardDefinitions[i];
              var image = document.createElement('img');
              image.src = getImg(board.image);
              $('#boardlist').append(image).append("&nbsp;&nbsp;");
              image.onclick = function() {
                  $('#popupMessage').hide();
                  window.displayHelper.popupMessageShown = false;
                  context.changeBoard(board.name);
              };
          };
          $(".simple-dialog").addClass("config");
          $('#popupMessage .navigationContent ul li').removeClass('selected');
          $('#popupMessage .navigationContent ul li[id=qpi-connection]').addClass('selected');
          $('#showNavigationContent').prop('checked', false);
          $('[id^=qpi-uiblock]').addClass("hiddenContent");
          $('#qpi-uiblock-connection').removeClass("hiddenContent");
          $("#piconnectprogressicon").hide();
          for(var i = 0; i < boardDefinitions.length; i++)_loop();
          for(var _iterator = _create_for_of_iterator_helper_loose$4(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              var sensorDefinition = sensorHandler.findSensorDefinition(sensor);
              addGridElement("sensorGrid", 0, sensor.name, sensor.name, sensorDefinition.selectorImages[0], sensor.port);
          }
          updateAddGrid();
          var usedPorts = [];
          var toRemove = [];
          var toAdd = [];
          function updateAddGrid() {
              // console.log("updateAddGrid")
              $("#addSensorGrid").empty();
              for(var iSensorDef = 0; iSensorDef < sensorDefinitions.length; iSensorDef++){
                  var sensorDefinition = sensorDefinitions[iSensorDef];
                  var id = sensorDefinition.name;
                  // console.log("new",id)
                  var name = sensorDefinition.description;
                  if (sensorDefinition.subTypes) {
                      for(var iSubType = 0; iSubType < sensorDefinition.subTypes.length; iSubType++){
                          var sub = sensorDefinition.subTypes[iSubType];
                          // @ts-ignore
                          if (!sensorDefinition.pluggable && !sub.pluggable) continue;
                          id = sensorDefinition.name + "_" + sub.subType;
                          var name1 = sub.description;
                          // @ts-ignore
                          var img = sub.selectorImages ? sub.selectorImages[0] : sensorDefinition.selectorImages[0];
                          // console.log(1,id)
                          addGridElement("addSensorGrid", 1, id, name1, img, "");
                      // console.log("+",id)
                      }
                  } else {
                      if (!sensorDefinition.pluggable || !sensorDefinition.selectorImages) continue;
                      // console.log("+",id)
                      addGridElement("addSensorGrid", 1, id, name, sensorDefinition.selectorImages[0], "");
                  }
              }
              var board = mainBoard.getCurrentBoard(context.board);
              if (board.builtinSensors) {
                  for(var i = 0; i < board.builtinSensors.length; i++){
                      var sensor = board.builtinSensors[i];
                      var sensorDefinition1 = sensorHandler.findSensorDefinition(sensor);
                      if (context.findSensor(sensor.type, sensor.port, false)) continue;
                      var id1 = sensorDefinition1.name + "_";
                      if (sensor.subType) id1 += sensor.subType;
                      id1 += "_" + sensor.port;
                      var name2 = sensorDefinition1.description + " " + strings.messages.builtin;
                      var img1 = sensorDefinition1.selectorImages[0];
                      addGridElement("addSensorGrid", 1, id1, name2, img1, "");
                  // console.log(3,id)
                  }
              }
              $("#addSensorGrid .sensorElement").click(function() {
                  var id = $(this).attr('id');
                  var sensorID = id.replace("qpi-add-sensor-parent-", "");
                  if ($(this).hasClass("selected")) {
                      changePort(sensorID, false);
                  } else {
                      showPortDialog(sensorID);
                  }
                  changeSelect(id);
              });
          }
          function addGridElement(gridID, add, idName, name, img, port) {
              // console.log(add,idName,name,img)
              var idType = add ? "add" : "remove";
              $('#' + gridID).append('\n        <span class="sensorElement ' + (!customSensors ? 'read-only' : '') + '" id="qpi-' + idType + "-sensor-parent-" + idName + "\">\n          <div class='name'>" + name + "</div>\n          " + getSensorImg(img) + "\n          <div class=\"sensorInfo\">\n            <span class='port'>" + port + "</span>\n            " + (customSensors ? '<input type="checkbox" id="qpi-' + idType + "-sensor-" + idName + '"/>' : '') + "\n          </div>\n        </span>");
          }
          function getSensorImg(img) {
              var html = "";
              html += "<img class=\"sensorImage\" src=" + getImg(img) + ">";
              switch(img){
                  case "servo.png":
                      html += "<img class=\"sensorImage\" src=" + getImg("servo-pale.png") + ">";
                      html += "<img class=\"sensorImage\" src=" + getImg("servo-center.png") + ">";
                      break;
                  case "potentiometer.png":
                      html += "<img class=\"sensorImage\" src=" + getImg("potentiometer-pale.png") + ">";
                      break;
                  case "mag.png":
                      html += "<img class=\"sensorImage\" src=" + getImg("mag-needle.png") + ">";
                      break;
              }
              return html;
          }
          $("#tabs .tab").click(function() {
              var id = $(this).attr("id");
              clickTab(id);
          });
          function clickTab(id) {
              // console.log("click tab"+id)
              var el = $("#" + id);
              if (el.hasClass("selected")) {
                  return;
              }
              if (id == "remove_tab" && toAdd.length > 0 || id == "add_tab" && toRemove.length > 0) {
                  showConfirmDialog(function() {
                      unselectSensors();
                      clickTab(id);
                  });
                  return;
              }
              el.addClass("selected");
              if (id == "remove_tab") {
                  $("#add_tab").removeClass("selected");
                  $("#remove_cont").removeClass("hiddenContent");
                  $("#add_cont").addClass("hiddenContent");
                  unselectSensors("add");
              } else {
                  $("#remove_tab").removeClass("selected");
                  $("#add_cont").removeClass("hiddenContent");
                  $("#remove_cont").addClass("hiddenContent");
                  unselectSensors("remove");
              }
          }
          $("#sensorGrid .sensorElement").click(function() {
              if (!customSensors) {
                  return;
              }
              var id = $(this).attr('id');
              changeSelect(id);
          });
          function changeSelect(id) {
              var add = id.includes("qpi-add");
              var arr = add ? toAdd : toRemove;
              var ele = $("#" + id);
              var inp = ele.children(".sensorInfo").children("input");
              if (ele.hasClass("selected")) {
                  ele.removeClass("selected");
                  inp.prop("checked", false);
                  if (arr.includes(id)) {
                      var index = arr.indexOf(id);
                      arr.splice(index, 1);
                  }
              } else {
                  ele.addClass("selected");
                  inp.prop("checked", true);
                  if (!arr.includes(id)) {
                      arr.push(id);
                  }
              }
          // console.log(arr)
          }
          function unselectSensors(type) {
              if (type === void 0) type = null;
              if (!type) {
                  unselectSensors("add");
                  unselectSensors("remove");
                  return;
              }
              var arr = type == "add" ? toAdd : toRemove;
              var clone = JSON.parse(JSON.stringify(arr));
              for(var _iterator = _create_for_of_iterator_helper_loose$4(clone), _step; !(_step = _iterator()).done;){
                  var id = _step.value;
                  changeSelect(id);
                  if (type == "add") {
                      var elID = id.replace("qpi-add-sensor-parent-", "");
                      changePort(elID, false);
                  }
              }
              if ('add' === type) {
                  toAdd = [];
              } else {
                  toRemove = [];
              }
          }
          if (customSensors) {
              $('#piaddsensor').click(addSensors);
          } else {
              $('#piaddsensor').hide();
              $('#piremovesensor').hide();
              $('#qpi-uiblock-components #tabs').hide();
          }
          $('#piremovesensor').click(function() {
              //$('#popupMessage').hide();
              //window.displayHelper.popupMessageShown = false;
              var removed = false;
              $('[id^=qpi-remove-sensor-]').each(function(index) {
                  if ($(this).is(':checked')) {
                      var sensorName = $(this).attr('id').replace("qpi-remove-sensor-", "");
                      var sensor = sensorHandler.findSensorByName(sensorName);
                      $("#qpi-remove-sensor-parent-" + sensorName).remove();
                      for(var _iterator = _create_for_of_iterator_helper_loose$4(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                          var otherSensor = _step.value;
                          if (otherSensor === sensor) {
                              sensor.removed = true;
                              context.sensorsList.all().splice(i, 1);
                          }
                      }
                      removed = true;
                  // console.log(sensorName);
                  }
              });
              unselectSensors("remove");
              if (removed) {
                  context.recreateDisplay = true;
                  context.resetDisplay();
                  updateAddGrid();
              }
          });
          function addSensors() {
              var added = false;
              $('[id^=qpi-add-sensor-]').each(function(index) {
                  if ($(this).is(':checked')) {
                      var id = $(this).attr('id');
                      var sensorID = id.replace("qpi-add-sensor-", "");
                      var params = sensorID.split("_");
                      // console.log(params)
                      var dummysensor = {
                          type: params[0]
                      };
                      if (params.length == 2) // @ts-ignore
                      dummysensor.subType = params[1];
                      var sensorDefinition = sensorHandler.findSensorDefinition(dummysensor);
                      var port = $("#qpi-add-sensor-parent-" + sensorID + " .port").text();
                      var name = sensorHandler.getNewSensorSuggestedName(sensorDefinition.suggestedName);
                      var newSensor = createSensor({
                          type: sensorDefinition.name,
                          subType: sensorDefinition.subType,
                          port: port,
                          name: name
                      }, context, strings);
                      context.sensorsList.add(newSensor);
                      added = true;
                  }
              });
              if (added) {
                  context.resetSensorTable();
                  // context.recreateDisplay = true;
                  context.resetDisplay();
                  updateAddGrid();
                  $('#popupMessage').hide();
                  window.displayHelper.popupMessageShown = false;
              }
          }
          function showMenu(id) {
              $('#popupMessage .navigationContent ul li').removeClass('selected');
              $('#popupMessage .navigationContent ul li[id=qpi-' + id + ']').addClass('selected');
              $('#showNavigationContent').prop('checked', false);
              $('#piconnectionlabel').hide();
              $('[id^=qpi-uiblock]').addClass("hiddenContent");
              $('#qpi-uiblock-' + id).removeClass("hiddenContent");
          }
          function showPortDialog(id) {
              // removePortDialog();
              var back = $("<div id='port_dialog_back'></div>");
              var dial = $("<div id='port_dialog'></div>");
              var params = id.split("_");
              var builtinport = false;
              var dummysensor = {
                  type: params[0]
              };
              if (params.length >= 2) {
                  if (params[1]) // @ts-ignore
                  dummysensor.subType = params[1];
              }
              if (params.length >= 3) builtinport = params[2];
              var sensorDefinition = sensorHandler.findSensorDefinition(dummysensor);
              // console.log(params);
              var html = "<div id='port_field'><span>" + strings.messages.port + "</span><select id='port_select' class=\"custom-select\">";
              // var portSelect = document.getElementById("selector-sensor-port");
              // $('#selector-sensor-port').empty();
              var hasPorts = false;
              if (builtinport) {
                  html += "<option value=" + builtinport + ">" + builtinport + "</option>";
                  hasPorts = true;
              } else {
                  var ports = mainBoard.getCurrentBoard(context.board).portTypes[sensorDefinition.portType];
                  // console.log(id,ports)
                  if (sensorDefinition.portType == "i2c") {
                      ports = [
                          "i2c"
                      ];
                  }
                  for(var iPort = 0; iPort < ports.length; iPort++){
                      var port = sensorDefinition.portType + ports[iPort];
                      if (sensorDefinition.portType == "i2c") port = "i2c";
                      if (!sensorHandler.isPortUsed(sensorDefinition.name, port) && !usedPorts.includes(port)) {
                          html += "<option value=" + port + ">" + port + "</option>";
                          // var option = document.createElement('option');
                          hasPorts = true;
                      }
                  }
              }
              html += "</select><label id=\"selector-label\"></label></div>";
              html += "<div id='buttons'><button id=\"validate\"><i class='icon fas fa-check'></i>" + strings.messages.validate + "</button>";
              html += "<button id=\"cancel\"><i class='icon fas fa-times'></i>" + strings.messages.cancel + "</button></div>";
              dial.html(html);
              $("#popupMessage").after(back, dial);
              if (!hasPorts) {
                  $('#buttons #validate').attr('disabled', 'disabled');
                  var object_function = strings.messages.actuator;
                  if (sensorDefinition.isSensor) object_function = strings.messages.sensor;
                  $('#selector-label').text(strings.messages.noPortsAvailable.format(object_function, sensorDefinition.portType));
                  $('#selector-label').show();
                  $('#port_field span, #port_field select').hide();
              } else {
                  $('#buttons #validate').attr('disabled', null);
                  $('#selector-label').hide();
                  $('#port_field span, #port_field select').show();
              }
              $("#port_dialog #cancel").click(function() {
                  removePortDialog();
                  var elID = "qpi-add-sensor-parent-" + id;
                  changeSelect(elID);
                  changePort(id, false);
              });
              $("#port_dialog #validate").click(function() {
                  var port = $("#port_select").val();
                  changePort(id, port);
                  removePortDialog();
              // console.log(port)
              });
          // $("#port_select").focusout(function(){console.log("focusout")})
          // $("#port_select").change(function(){console.log("change")})
          }
          function changePort(id, port) {
              var elID = "qpi-add-sensor-parent-" + id;
              if (port) {
                  $("#" + elID + " .port").text(port);
                  if (!usedPorts.includes(port)) {
                      usedPorts.push(port);
                  }
              } else {
                  var currPort = $("#" + elID + " .port").text();
                  var ind = usedPorts.indexOf(currPort);
                  if (ind >= 0) {
                      usedPorts.splice(ind, 1);
                  }
                  $("#" + elID + " .port").text("");
              }
          }
          function removePortDialog() {
              $("#port_dialog_back, #port_dialog").remove();
          }
          function showConfirmDialog(cb) {
              var back = $("<div id='port_dialog_back'></div>");
              var dial = $("<div id='port_dialog'></div>");
              var html = "<span>" + strings.messages.areYouSure + "</span>";
              html += "<div id='buttons'><button id=\"yes\">" + strings.messages.yes + "</button>";
              html += "<button id=\"no\">" + strings.messages.no + "</button></div>";
              dial.html(html);
              $("#popupMessage").after(back, dial);
              $("#port_dialog #no").click(function() {
                  removePortDialog();
              });
              $("#port_dialog #yes").click(function() {
                  if (cb) cb();
                  removePortDialog();
              });
          }
          $('#qpi-portsnames').click(clickMenu("portsnames"));
          $('#qpi-components').click(clickMenu("components"));
          $('#qpi-change-board').click(clickMenu("change-board"));
          $('#qpi-connection').click(clickMenu("connection"));
          function clickMenu(id) {
              return function() {
                  if (id != "components") {
                      if (toAdd.length > 0 || toRemove.length > 0) {
                          showConfirmDialog(function() {
                              unselectSensors();
                              clickMenu(id)();
                          });
                          return;
                      }
                  }
                  showMenu(id);
              };
          }
          if (context.offLineMode) {
              $('#pirelease').attr('disabled', 'disabled');
          } else {
              $('#pirelease').attr('disabled', null);
          }
          $('#piconnectionlabel').hide();
          $('#piaddress').on('input', function(e) {
              if (context.offLineMode) {
                  var content = $('#piaddress').val();
                  if (content) {
                      $('#piconnectok').attr('disabled', null);
                  } else {
                      $('#piconnectok').attr('disabled', 'disabled');
                  }
              }
          });
          if (getSessionStorage('pilist')) {
              populatePiList(JSON.parse(getSessionStorage('pilist')));
          }
          if (getSessionStorage('raspberryPiIpAddress')) {
              $('#piaddress').val(getSessionStorage('raspberryPiIpAddress'));
              $('#piaddress').trigger("input");
          }
          if (getSessionStorage('schoolkey')) {
              $('#schoolkey').val(getSessionStorage('schoolkey'));
              $('#pigetlist').attr('disabled', null);
          }
          function setLocalIp() {
              var localvalue = $('input[name=pilocalconnectiontype]:checked').val();
              if (localvalue == "localhost") {
                  $('#piaddress').val("localhost");
                  $('#piaddress').trigger("input");
              } else {
                  $('#piaddress').val(window.location.hostname);
                  $('#piaddress').trigger("input");
              }
          }
          $('input[type=radio][name=pilocalconnectiontype]').change(function() {
              setLocalIp();
          });
          function cleanUSBBTIP() {
              var ipaddress = $('#piaddress').val();
              if (ipaddress == "192.168.233.1" || ipaddress == "192.168.233.2" || ipaddress == "localhost" || ipaddress == window.location.hostname) {
                  $('#piaddress').val("");
                  $('#piaddress').trigger("input");
                  var schoolkey = $('#schoolkey').val();
                  // @ts-ignore
                  if (schoolkey.length > 1) $('#pigetlist').trigger("click");
              }
          }
          cleanUSBBTIP();
          $('#panel-body-local').hide();
          if (availableConnectionMethods.includes(ConnectionMethod.Local)) {
              if (!context.quickPiConnection.isConnected() || getSessionStorage('connectionMethod') == "LOCAL") {
                  $('#piconsel .btn').removeClass('active');
                  $('#piconlocal').addClass('active');
                  $('#pischoolcon').hide();
                  $('#piconnectionlabel').hide();
                  $('#panel-body-local').show();
                  setSessionStorage('connectionMethod', "LOCAL");
                  if (context.localhostAvailable && context.windowLocationAvailable) {
                      $("#piconnectolocalhostcheckbox").prop("checked", true);
                      setLocalIp();
                  } else if (context.localhostAvailable) {
                      $('#piconnectolocalhost').hide();
                      $('#piconnectocurrenturlcheckbox').hide();
                      setLocalIp();
                  } else if (context.windowLocationAvailable) {
                      $('#piconnectocurrenturl').hide();
                      $('#piconnectolocalhostcheckbox').hide();
                      setLocalIp();
                  }
              }
          } else {
              $('#panel-body-local').hide();
              $("#piconlocal").hide();
          }
          $('#piconnectok').click(function() {
              context.inUSBConnection = false;
              context.inBTConnection = false;
              $('#piconnectok').attr('disabled', 'disabled');
              $("#piconnectprogressicon").show();
              $("#piconnectwifiicon").hide();
              // $('#popupMessage').hide();
              // window.displayHelper.popupMessageShown = false;
              if ($('#piusetunnel').is(":checked")) {
                  var piname = $("#pilist option:selected").text().split("-")[0].trim();
                  var url = "ws://api.quick-pi.org/client/" + $('#schoolkey').val() + "-" + piname + "/api/v1/commands";
                  setSessionStorage('quickPiUrl', url);
                  context.quickPiConnection.connect(url);
              } else {
                  var ipaddress = $('#piaddress').val();
                  setSessionStorage('raspberryPiIpAddress', ipaddress);
                  showasConnecting(context);
                  var url = "ws://" + ipaddress + ":5000/api/v1/commands";
                  setSessionStorage('quickPiUrl', url);
                  context.quickPiConnection.connect(url);
              }
          });
          $('#pirelease').click(function() {
              context.inUSBConnection = false;
              context.inBTConnection = false;
              // $('#popupMessage').hide();
              // window.displayHelper.popupMessageShown = false;
              // IF connected release lock
              context.releasing = true;
              context.quickPiConnection.releaseLock();
          });
          $('#picancel').click(exitConfig);
          function exitConfig() {
              if (toAdd.length > 0 || toRemove.length > 0) {
                  showConfirmDialog(function() {
                      unselectSensors();
                      exitConfig();
                  });
                  return;
              }
              context.inUSBConnection = false;
              context.inBTConnection = false;
              $('#popupMessage').hide();
              window.displayHelper.popupMessageShown = false;
          }
          $('#schoolkey').on('input', function(e) {
              var schoolkey = $('#schoolkey').val();
              setSessionStorage('schoolkey', schoolkey);
              if (schoolkey) $('#pigetlist').attr('disabled', null);
              else $('#pigetlist').attr('disabled', 'disabled');
          });
          $('#pigetlist').click(function() {
              var schoolkey = $('#schoolkey').val();
              fetch('http://www.france-ioi.org/QuickPi/list.php?school=' + schoolkey).then(function(response) {
                  return response.json();
              }).then(function(jsonlist) {
                  populatePiList(jsonlist);
              });
          });
          // Select device connexion methods
          $('#piconsel .btn').click(function() {
              if (!context.quickPiConnection.isConnected()) {
                  if (!$(this).hasClass('active')) {
                      $('#piconsel .btn').removeClass('active');
                      $(this).addClass('active');
                  }
              }
          });
          function onPiconLocalClick() {
              context.inUSBConnection = false;
              context.inBTConnection = false;
              cleanUSBBTIP();
              if (!context.quickPiConnection.isConnected()) {
                  setLocalIp();
                  setSessionStorage('connectionMethod', "LOCAL");
                  $("#piconlocal").addClass('active');
                  $('#panel-body-local').show();
                  $('#pischoolcon').hide();
                  $('#piconnectionlabel').hide();
              }
          }
          function onPiconWifiClick() {
              context.inUSBConnection = false;
              context.inBTConnection = false;
              $("#piconwifi").addClass('active');
              cleanUSBBTIP();
              if (!context.quickPiConnection.isConnected()) {
                  setSessionStorage('connectionMethod', "WIFI");
                  $('#panel-body-local').hide();
                  $('#pischoolcon').show();
                  $('#piconnectionlabel').hide();
              }
          }
          function onPiconUsbClick() {
              $("#piconusb").addClass('active');
              if (!context.quickPiConnection.isConnected()) {
                  setSessionStorage('connectionMethod', "USB");
                  $('#piconnectok').attr('disabled', 'disabled');
                  $('#panel-body-local').hide();
                  $('#piconnectionlabel').show();
                  $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB);
                  $('#pischoolcon').hide();
                  $('#piaddress').val("192.168.233.1");
                  context.inUSBConnection = true;
                  context.inBTConnection = false;
                  function updateUSBAvailability(available) {
                      if (context.inUSBConnection && context.offLineMode) {
                          if (available) {
                              $('#piconnectok').attr('disabled', null);
                              $('#piconnectionlabel').text(strings.messages.canConnectoToUSB);
                          } else {
                              $('#piconnectok').attr('disabled', 'disabled');
                              $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB);
                          }
                          setTimeout(function() {
                              context.quickPiConnection.isAvailable("192.168.233.1", updateUSBAvailability);
                          }, 1000);
                      }
                  }
                  updateUSBAvailability(false);
              }
          }
          function onPiconBtClick() {
              $("#piconbt").addClass('active');
              $('#piconnectionlabel').show();
              if (!context.quickPiConnection.isConnected()) {
                  setSessionStorage('connectionMethod', "BT");
                  $('#piconnectok').attr('disabled', 'disabled');
                  $('#panel-body-local').hide();
                  $('#piconnectionlabel').show();
                  $('#piconnectionlabel').html(strings.messages.cantConnectoToBT);
                  $('#pischoolcon').hide();
                  $('#piaddress').val("192.168.233.2");
                  context.inUSBConnection = false;
                  context.inBTConnection = true;
                  function updateBTAvailability(available) {
                      if (context.inBTConnection && context.offLineMode) {
                          if (available) {
                              $('#piconnectok').attr('disabled', null);
                              $('#piconnectionlabel').text(strings.messages.canConnectoToBT);
                          } else {
                              $('#piconnectok').attr('disabled', 'disabled');
                              $('#piconnectionlabel').html(strings.messages.cantConnectoToBT);
                          }
                          setTimeout(function() {
                              context.quickPiConnection.isAvailable("192.168.233.2", updateBTAvailability);
                          }, 1000);
                      }
                  }
                  updateBTAvailability(false);
              }
          }
          function onPiconWebSerialClick() {
              $('#panel-body-local').hide();
              $('#piconnectionlabel').hide();
              $("#piconweb_serial").addClass('active');
              $('#pischoolcon').hide();
              if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                  setSessionStorage('connectionMethod', "web_serial");
                  $('#piconnectok').attr('disabled', null);
                  context.inUSBConnection = false;
                  context.inBTConnection = false;
              }
          }
          $('#piconnectok').attr('disabled', 'disabled');
          $('#piconlocal').click(onPiconLocalClick);
          $('#piconwifi').click(onPiconWifiClick);
          $('#piconusb').click(onPiconUsbClick);
          $('#piconbt').click(onPiconBtClick);
          $('#piconweb_serial').click(onPiconWebSerialClick);
          var _obj;
          var availableMethodsHandlers = (_obj = {}, _obj[ConnectionMethod.Local] = onPiconLocalClick, _obj[ConnectionMethod.Wifi] = onPiconWifiClick, _obj[ConnectionMethod.Usb] = onPiconUsbClick, _obj[ConnectionMethod.Bluetooth] = onPiconBtClick, _obj[ConnectionMethod.WebSerial] = onPiconWebSerialClick, _obj);
          var isConnected = context.quickPiConnection.isConnected();
          if (!isConnected) {
              setSessionStorage('connectionMethod', availableConnectionMethods[0].toLocaleUpperCase());
          }
          var _getSessionStorage;
          if (((_getSessionStorage = getSessionStorage('connectionMethod')) != null ? _getSessionStorage : '').toLocaleLowerCase() in availableMethodsHandlers) {
              availableMethodsHandlers[getSessionStorage('connectionMethod').toLocaleLowerCase()]();
          }
          if (isConnected) {
              if (getSessionStorage('connectionMethod') == "USB") {
                  $('#piconwifi').removeClass('active');
                  $('#piconusb').addClass('active');
                  $('#pischoolcon').hide();
                  $('#piaddress').val("192.168.233.1");
                  $('#piconnectok').attr('disabled', 'disabled');
                  $('#piconnectionlabel').show();
                  $('#piconnectionlabel').text(strings.messages.canConnectoToUSB);
                  context.inUSBConnection = true;
                  context.inBTConnection = false;
              } else if (getSessionStorage('connectionMethod') == "BT") {
                  $('#piconwifi').removeClass('active');
                  $('#piconbt').addClass('active');
                  $('#pischoolcon').hide();
                  $('#piaddress').val("192.168.233.2");
                  $('#piconnectok').attr('disabled', 'disabled');
                  $('#piconnectionlabel').show();
                  $('#piconnectionlabel').text(strings.messages.canConnectoToBT);
                  context.inUSBConnection = false;
                  context.inBTConnection = true;
              } else if (getSessionStorage('connectionMethod') == "LOCAL") {
                  $('#piconlocal').trigger("click");
              }
          }
          if (context.quickPiConnection.isConnecting()) {
              showasConnecting(context);
          }
          function populatePiList(jsonlist) {
              setSessionStorage('pilist', JSON.stringify(jsonlist));
              var select = document.getElementById("pilist");
              var first = true;
              $('#pilist').empty();
              $('#piusetunnel').attr('disabled', 'disabled');
              for(var i = 0; i < jsonlist.length; i++){
                  jsonlist[i];
                  var el = document.createElement("option");
                  var minutes = Math.round(jsonlist[i].seconds_since_ping / 60);
                  var timeago = "";
                  if (minutes < 60) timeago = strings.messages.minutesago.format(minutes);
                  else timeago = strings.messages.hoursago;
                  el.textContent = jsonlist[i].name + " - " + timeago;
                  el.value = jsonlist[i].ip;
                  select.appendChild(el);
                  if (first) {
                      $('#piaddress').val(jsonlist[i].ip);
                      $('#piaddress').trigger("input");
                      first = false;
                      $('#pilist').prop('disabled', false);
                      $('#piusetunnel').attr('disabled', null);
                  }
              }
          }
          $('#pilist').on('change', function() {
              // @ts-ignore
              $("#piaddress").val(this.value);
          });
          updatePiComponentButtons();
          $('#picomponentname').click(function() {
              context.useportforname = false;
              updatePiComponentButtons();
              //context.recreateDisplay = true;
              context.resetDisplay();
          });
          $('#piportname').click(function() {
              context.useportforname = true;
              updatePiComponentButtons();
              //context.recreateDisplay = true;
              context.resetDisplay();
          });
          function updatePiComponentButtons() {
              if (context.useportforname) {
                  $('#piportname').addClass('active');
                  $('#picomponentname').removeClass('active');
                  $('#example_sensor #port').show();
                  $('#example_sensor #name').hide();
              } else {
                  $('#picomponentname').addClass('active');
                  $('#piportname').removeClass('active');
                  $('#example_sensor #name').show();
                  $('#example_sensor #port').hide();
              }
          }
      });
  }

  var SensorDrawer = /*#__PURE__*/ function() {
      function SensorDrawer(context, strings, sensorDefinitions, sensorHandler) {
          this.context = context;
          this.strings = strings;
          this.sensorHandler = sensorHandler;
          this.sensorDefinitions = sensorDefinitions;
      }
      var _proto = SensorDrawer.prototype;
      _proto.sensorInConnectedModeError = function sensorInConnectedModeError() {
          window.displayHelper.showPopupMessage(this.strings.messages.sensorInOnlineMode, 'blanket');
      };
      _proto.actuatorsInRunningModeError = function actuatorsInRunningModeError() {
          window.displayHelper.showPopupMessage(this.strings.messages.actuatorsWhenRunning, 'blanket');
      };
      _proto.saveSensorStateIfNotRunning = function saveSensorStateIfNotRunning(sensor) {
          // save the sensor if we are not running
          if (!(this.context.runner && this.context.runner.isRunning())) {
              if (this._findFirst(this.sensorDefinitions, function(globalSensor) {
                  return globalSensor.name === sensor.type;
              }).isSensor) {
                  this.context.sensorsSaved[sensor.name] = {
                      state: Array.isArray(sensor.state) ? sensor.state.slice() : sensor.state,
                      screenDrawing: sensor.screenDrawing,
                      lastDrawnTime: sensor.lastDrawnTime,
                      lastDrawnState: sensor.lastDrawnState,
                      callsInTimeSlot: sensor.callsInTimeSlot,
                      lastTimeIncrease: sensor.lastTimeIncrease,
                      removed: sensor.removed,
                      quickStore: sensor.quickStore
                  };
              }
          }
      };
      _proto._findFirst = function _findFirst(array, func) {
          for(var i = 0; i < array.length; i++){
              if (func(array[i])) return array[i];
          }
          return undefined;
      };
      _proto.drawSensor = function drawSensor(sensor, juststate, donotmovefocusrect) {
          if (juststate === void 0) juststate = false;
          if (donotmovefocusrect === void 0) donotmovefocusrect = false;
          // console.log('draw sensor', sensor, this.context, this.context.paper);
          // console.log(sensor.type)
          this.saveSensorStateIfNotRunning(sensor);
          if (this.context.sensorStateListener) {
              this.context.sensorStateListener(sensor);
          }
          var fontWeight = "normal";
          if (this.context.paper == undefined || !this.context.display || !sensor.drawInfo) return;
          var scrolloffset = 0;
          var fadeopacity = 1;
          var w = sensor.drawInfo.width;
          var h = sensor.drawInfo.height;
          var x = sensor.drawInfo.x;
          var y = sensor.drawInfo.y;
          var cx = x + w / 2;
          var cy = y + h / 2;
          var imgh = h / 2;
          var imgw = imgh;
          var imgx = x - imgw / 2 + w / 2;
          var imgy = y + (h - imgh) / 2;
          var namex = x + w / 2;
          var namey = y + h / 8;
          var nameanchor = "middle";
          // this.context.paper.path(["M",x,namey,"H",x + w])
          var state1x = x + w / 2;
          var state1y = y + h - h / 8;
          var stateanchor = "middle";
          // this.context.paper.path(["M",x,state1y,"H",x + w])
          // console.log(state1y)
          if (sensor.type == "accelerometer" || sensor.type == "gyroscope" || sensor.type == "magnetometer" || sensor.type == "stick") {
              if (this.context.compactLayout) imgx = x + 5;
              else imgx = x - imgw / 4 + w / 4;
              var dx = w * 0.03;
              imgx = cx - imgw - dx;
              state1x = imgx + imgw + 10;
              state1y = y + h / 2;
              stateanchor = 'start';
              imgy += h * 0.05;
              state1y += h * 0.05;
          }
          if (sensor.type == "buzzer") {
              var sizeRatio = imgw / w;
              if (sizeRatio > 0.75) {
                  imgw = 0.75 * w;
                  imgh = imgw;
              }
          }
          var portx = state1x;
          var porty = imgy;
          var portsize = sensor.drawInfo.height * 0.11;
          // if (this.context.compactLayout)
          //     let statesize = sensor.drawInfo.height * 0.14;
          // else
          //     let statesize = sensor.drawInfo.height * 0.10;
          var namesize = sensor.drawInfo.height * 0.15;
          var statesize = namesize;
          portsize = namesize;
          var maxNameSize = 25;
          var maxStateSize = 20;
          // console.log(this.context.compactLayout,statesize)
          var drawPortText = false;
          var drawName = true;
          if (!sensor.focusrect || this.sensorHandler.isElementRemoved(sensor.focusrect)) {
              sensor.focusrect = this.context.paper.rect(imgx, imgy, imgw, imgh);
          }
          sensor.focusrect.attr({
              "fill": "468DDF",
              "fill-opacity": 0,
              "opacity": 0,
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh
          });
          if (this.context.autoGrading) {
              scrolloffset = $('#virtualSensors').scrollLeft();
              if (scrolloffset > 0) fadeopacity = 0.3;
              imgw = w * .80;
              imgh = sensor.drawInfo.height * .80;
              imgx = sensor.drawInfo.x + imgw * 0.75 + scrolloffset;
              imgy = sensor.drawInfo.y + sensor.drawInfo.height / 2 - imgh / 2;
              state1x = imgx + imgw * 1.2;
              state1y = imgy + imgh / 2;
              portx = x;
              porty = imgy + imgh / 2;
              portsize = imgh / 3;
              statesize = sensor.drawInfo.height * 0.2;
              namex = portx;
              namesize = portsize;
              nameanchor = "start";
          }
          namesize = Math.min(namesize, maxNameSize);
          statesize = Math.min(statesize, maxStateSize);
          {
              // namesize = h*0.12;
              statesize = namesize;
          // console.log(statesize)
          }
          var sensorAttr = {
              "x": imgx,
              "y": imgy,
              "width": imgw,
              "height": imgh
          };
          var drawParameters = {
              fadeopacity: fadeopacity,
              sensorAttr: sensorAttr,
              imgx: imgx,
              imgy: imgy,
              imgw: imgw,
              imgh: imgh,
              state1x: state1x,
              state1y: state1y,
              juststate: juststate,
              x: x,
              y: y,
              w: w,
              h: h,
              cx: cx,
              cy: cy,
              portx: portx,
              porty: porty,
              portsize: portsize,
              stateanchor: stateanchor,
              statesize: statesize,
              drawName: drawName,
              drawPortText: drawPortText,
              fontWeight: fontWeight,
              namex: namex,
              namey: namey,
              namesize: namesize,
              nameanchor: nameanchor,
              scrolloffset: scrolloffset
          };
          if (sensor.draw) {
              sensor.draw(this.sensorHandler, drawParameters);
          }
          if (sensor.stateText) {
              try {
                  var statecolor = "gray";
                  // if (this.context.compactLayout)
                  //     statecolor = "black";
                  // console.log(statesize)
                  sensor.stateText.attr({
                      "font-size": drawParameters.statesize,
                      'text-anchor': drawParameters.stateanchor,
                      'font-weight': drawParameters.fontWeight,
                      fill: statecolor
                  });
                  // let b = sensor.stateText._getBBox();
                  // sensor.stateText.translate(0, b.height/2);
                  sensor.stateText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
              } catch (err) {}
          }
          if (sensor.nameText) {
              sensor.nameText.remove();
          }
          if (drawParameters.drawName) {
              if (sensor.name) {
                  var sensorId = sensor.name;
                  if (this.context.useportforname) sensorId = sensor.port;
                  sensor.nameText = this.context.paper.text(drawParameters.namex, drawParameters.namey, sensorId);
                  // sensor.nameText = this.context.paper.text(namex, namey, sensor.name );
                  sensor.nameText.attr({
                      "font-size": drawParameters.namesize,
                      "font-weight": drawParameters.fontWeight,
                      'text-anchor': drawParameters.nameanchor,
                      fill: "#7B7B7B"
                  });
                  sensor.nameText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                  var bbox = sensor.nameText.getBBox();
                  if (bbox.width > w - 20) {
                      drawParameters.namesize = drawParameters.namesize * (w - 20) / bbox.width;
                      drawParameters.namey += drawParameters.namesize * (1 - (w - 20) / bbox.width);
                      sensor.nameText.attr({
                          "font-size": drawParameters.namesize,
                          y: drawParameters.namey
                      });
                  }
              }
          }
          if (!donotmovefocusrect) {
              // This needs to be in front of everything
              sensor.focusrect.toFront();
              if (sensor.muteBtn) sensor.muteBtn.toFront();
          }
          this.saveSensorStateIfNotRunning(sensor);
      };
      _proto.setSlider = function setSlider(sensor, juststate, imgx, imgy, imgw, imgh, min, max) {
          var _this = this;
          // console.log("setSlider",juststate)
          if (juststate) {
              if (Array.isArray(sensor.state)) {
                  for(var i = 0; i < sensor.state.length; i++){
                      if (sensor.sliders[i] == undefined) continue;
                      var percentage = this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.state[i], sensor);
                      var thumby = sensor.sliders[i].sliderdata.insiderecty + sensor.sliders[i].sliderdata.insideheight - sensor.sliders[i].sliderdata.thumbheight - percentage * sensor.sliders[i].sliderdata.scale;
                      sensor.sliders[i].thumb.attr('y', thumby);
                      sensor.sliders[i].slider.toFront();
                  }
              } else {
                  var percentage1 = this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);
                  var thumby1 = sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight - percentage1 * sensor.sliders[0].sliderdata.scale;
                  sensor.sliders[0].thumb.attr('y', thumby1);
              }
              return;
          }
          this.removeSlider(sensor);
          sensor.sliders = [];
          var actuallydragged;
          sensor.hasslider = true;
          sensor.focusrect.drag(function(dx, dy, x, y, event) {
              if (sensor.sliders.length != 1) return;
              var newy = sensor.sliders[0].sliderdata.zero + dy;
              if (newy < sensor.sliders[0].sliderdata.insiderecty) newy = sensor.sliders[0].sliderdata.insiderecty;
              if (newy > sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight) newy = sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight;
              sensor.sliders[0].thumb.attr('y', newy);
              var percentage = 1 - (newy - sensor.sliders[0].sliderdata.insiderecty) / sensor.sliders[0].sliderdata.scale;
              sensor.state = _this.sensorHandler.findSensorDefinition(sensor).getStateFromPercentage(percentage);
              _this.sensorHandler.warnClientSensorStateChanged(sensor);
              _this.drawSensor(sensor, true);
              actuallydragged++;
          }, function(x, y, event) {
              showSlider();
              actuallydragged = 0;
              if (sensor.sliders.length == 1) sensor.sliders[0].sliderdata.zero = sensor.sliders[0].thumb.attr('y');
          }, function(event) {
              if (actuallydragged > 4) {
                  hideSlider(sensor);
              }
          });
          var showSlider = function() {
              hideSlider(sensorWithSlider);
              sensorWithSlider = sensor;
              sensor.drawInfo.width;
              var h = sensor.drawInfo.height;
              sensor.drawInfo.x;
              sensor.drawInfo.y;
              if (Array.isArray(sensor.state)) {
                  var offset = 0;
                  var sign = -1;
                  if (sensor.drawInfo.x - (sensor.state.length - 1) * sensor.drawInfo.width / 5 < 0) {
                      sign = 1;
                      offset = sensor.drawInfo.width * .70;
                  }
                  // if offset is equal to 0, we need to reverse
                  if (offset == 0) {
                      for(var i = 0; i < sensor.state.length; i++){
                          var sliderobj = _this.createSlider(sensor, max, min, sensor.drawInfo.x + offset + sign * Math.abs(i + 1 - sensor.state.length) * h / 5, sensor.drawInfo.y, h, h, i);
                          sensor.sliders.push(sliderobj);
                      }
                  } else {
                      for(var i1 = 0; i1 < sensor.state.length; i1++){
                          var sliderobj1 = _this.createSlider(sensor, max, min, sensor.drawInfo.x + offset + sign * i1 * h / 5, sensor.drawInfo.y, h, h, i1);
                          sensor.sliders.push(sliderobj1);
                      }
                  }
              } else {
                  var sliderobj2 = _this.createSlider(sensor, max, min, sensor.drawInfo.x, sensor.drawInfo.y, h, h, 0);
                  sensor.sliders.push(sliderobj2);
              }
          };
      };
      _proto.removeSlider = function removeSlider(sensor) {
          if (sensor.hasslider && sensor.focusrect) {
              sensor.focusrect.undrag();
              sensor.hasslider = false;
          }
          if (sensor.sliders) {
              for(var i = 0; i < sensor.sliders.length; i++){
                  sensor.sliders[i].slider.remove();
              }
              sensor.sliders = [];
          }
      };
      _proto.createSlider = function createSlider(sensor, max, min, x, y, w, h, index) {
          var _this = this;
          // console.log("this.createSlider(")
          var sliderobj = {};
          sliderobj.sliderdata = {};
          sliderobj.index = index;
          sliderobj.min = min;
          sliderobj.max = max;
          var outsiderectx = x;
          var outsiderecty = y;
          var outsidewidth = w / 6;
          var outsideheight = h;
          var insidewidth = outsidewidth / 6;
          sliderobj.sliderdata.insideheight = h * 0.60;
          var insiderectx = outsiderectx + outsidewidth / 2 - insidewidth / 2;
          sliderobj.sliderdata.insiderecty = outsiderecty + outsideheight / 2 - sliderobj.sliderdata.insideheight / 2;
          var circleradius = outsidewidth / 2 - 1;
          var pluscirclex = outsiderectx + outsidewidth / 2;
          var pluscircley = outsiderecty + circleradius + 1;
          var minuscirclex = pluscirclex;
          var minuscircley = outsiderecty + outsideheight - circleradius - 1;
          this.context.paper.setStart();
          sliderobj.sliderrect = this.context.paper.rect(outsiderectx, outsiderecty, outsidewidth, outsideheight, outsidewidth / 2);
          sliderobj.sliderrect.attr("fill", "#468DDF");
          sliderobj.sliderrect.attr("stroke", "#468DDF");
          sliderobj.sliderrect = this.context.paper.rect(insiderectx, sliderobj.sliderdata.insiderecty, insidewidth, sliderobj.sliderdata.insideheight, 2);
          sliderobj.sliderrect.attr("fill", "#2E5D94");
          sliderobj.sliderrect.attr("stroke", "#2E5D94");
          sliderobj.plusset = this.context.paper.set();
          sliderobj.pluscircle = this.context.paper.circle(pluscirclex, pluscircley, circleradius);
          sliderobj.pluscircle.attr("fill", "#F5A621");
          sliderobj.pluscircle.attr("stroke", "#F5A621");
          sliderobj.plus = this.context.paper.text(pluscirclex, pluscircley, "+");
          sliderobj.plus.attr({
              fill: "white"
          });
          sliderobj.plus.node.style = "-moz-user-select: none; -webkit-user-select: none;";
          sliderobj.plusset.push(sliderobj.pluscircle, sliderobj.plus);
          sliderobj.plusset.click(function() {
              var step = 1;
              var sensorDef = _this.sensorHandler.findSensorDefinition(sensor);
              if (sensorDef.step) step = sensorDef.step;
              if (Array.isArray(sensor.state)) {
                  if (sensor.state[sliderobj.index] < sliderobj.max) sensor.state[sliderobj.index] += step;
              } else {
                  if (sensor.state < sliderobj.max) sensor.state += step;
              }
              _this.sensorHandler.warnClientSensorStateChanged(sensor);
              _this.drawSensor(sensor, true);
          });
          sliderobj.minusset = this.context.paper.set();
          sliderobj.minuscircle = this.context.paper.circle(minuscirclex, minuscircley, circleradius);
          sliderobj.minuscircle.attr("fill", "#F5A621");
          sliderobj.minuscircle.attr("stroke", "#F5A621");
          sliderobj.minus = this.context.paper.text(minuscirclex, minuscircley, "-");
          sliderobj.minus.attr({
              fill: "white"
          });
          sliderobj.minus.node.style = "-moz-user-select: none; -webkit-user-select: none;";
          sliderobj.minusset.push(sliderobj.minuscircle, sliderobj.minus);
          sliderobj.minusset.click(function() {
              var step = 1;
              var sensorDef = _this.sensorHandler.findSensorDefinition(sensor);
              if (sensorDef.step) step = sensorDef.step;
              if (Array.isArray(sensor.state)) {
                  if (sensor.state[sliderobj.index] > sliderobj.min) sensor.state[sliderobj.index] -= step;
              } else {
                  if (sensor.state > sliderobj.min) sensor.state -= step;
              }
              _this.sensorHandler.warnClientSensorStateChanged(sensor);
              _this.drawSensor(sensor, true);
          });
          var thumbwidth = outsidewidth * .80;
          sliderobj.sliderdata.thumbheight = outsidewidth * 1.4;
          sliderobj.sliderdata.scale = sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight;
          var percentage;
          if (Array.isArray(sensor.state)) {
              percentage = this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.state[index], sensor);
          } else {
              percentage = this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);
          }
          var thumby = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight - percentage * sliderobj.sliderdata.scale;
          var thumbx = insiderectx + insidewidth / 2 - thumbwidth / 2;
          sliderobj.thumb = this.context.paper.rect(thumbx, thumby, thumbwidth, sliderobj.sliderdata.thumbheight, outsidewidth / 2);
          sliderobj.thumb.attr("fill", "#F5A621");
          sliderobj.thumb.attr("stroke", "#F5A621");
          sliderobj.slider = this.context.paper.setFinish();
          sliderobj.thumb.drag(function(dx, dy, x, y, event) {
              var newy = sliderobj.sliderdata.zero + dy;
              if (newy < sliderobj.sliderdata.insiderecty) newy = sliderobj.sliderdata.insiderecty;
              if (newy > sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight) newy = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight;
              sliderobj.thumb.attr('y', newy);
              var percentage = 1 - (newy - sliderobj.sliderdata.insiderecty) / sliderobj.sliderdata.scale;
              if (Array.isArray(sensor.state)) {
                  sensor.state[sliderobj.index] = _this.sensorHandler.findSensorDefinition(sensor).getStateFromPercentage(percentage);
              } else {
                  sensor.state = _this.sensorHandler.findSensorDefinition(sensor).getStateFromPercentage(percentage);
              }
              _this.sensorHandler.warnClientSensorStateChanged(sensor);
              _this.drawSensor(sensor, true);
          }, function(x, y, event) {
              sliderobj.sliderdata.zero = sliderobj.thumb.attr('y');
          }, function(event) {});
          sliderobj.slider.toFront();
          return sliderobj;
      };
      _proto.drawMultipleTimeLine = function drawMultipleTimeLine(sensor, state, expectedState, type, drawParameters) {
          var color = drawParameters.color, strokewidth = drawParameters.strokewidth, startTime = drawParameters.startTime, endTime = drawParameters.endTime;
          if (state != null) {
              for(var i = 0; i < 3; i++){
                  var startx = this.context.timelineStartx + startTime * this.context.pixelsPerTime;
                  var stateLenght = (endTime - startTime) * this.context.pixelsPerTime;
                  var yspace = this.context.timeLineSlotHeight / 3;
                  var ypositiontop = sensor.drawInfo.y + yspace * i;
                  var ypositionbottom = ypositiontop + yspace;
                  var offset = (ypositionbottom - ypositiontop) * this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(state[i], sensor);
                  if (type == "expected" || type == "finnish") {
                      color = "lightgrey";
                      strokewidth = 4;
                  } else if (type == "wrong") {
                      color = "red";
                      strokewidth = 2;
                  } else if (type == "actual") {
                      color = "yellow";
                      strokewidth = 2;
                  }
                  if (sensor.lastAnalogState != null && sensor.lastAnalogState[i] != state[i]) {
                      var oldStatePercentage = this.sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState[i], sensor);
                      var previousOffset = (ypositionbottom - ypositiontop) * oldStatePercentage;
                      var joinline = this.context.paper.path([
                          "M",
                          startx,
                          ypositiontop + offset,
                          "L",
                          startx,
                          ypositiontop + previousOffset
                      ]);
                      joinline.attr({
                          "stroke-width": strokewidth,
                          "stroke": color,
                          "stroke-linejoin": "round",
                          "stroke-linecap": "round"
                      });
                      this.context.sensorStates.push(joinline);
                      if (sensor.timelinelastxlabel == null) sensor.timelinelastxlabel = [
                          0,
                          0,
                          0
                      ];
                      if (startx - sensor.timelinelastxlabel[i] > 40) {
                          var sensorDef = this.sensorHandler.findSensorDefinition(sensor);
                          var stateText = state.toString();
                          if (sensorDef && sensorDef.getStateString) {
                              stateText = sensorDef.getStateString(state[i]);
                          }
                          var paperText = this.context.paper.text(startx, ypositiontop + offset - 10, stateText);
                          drawParameters.drawnElements.push(paperText);
                          this.context.sensorStates.push(paperText);
                          sensor.timelinelastxlabel[i] = startx;
                      }
                  }
                  var stateline = this.context.paper.path([
                      "M",
                      startx,
                      ypositiontop + offset,
                      "L",
                      startx + stateLenght,
                      ypositiontop + offset
                  ]);
                  stateline.attr({
                      "stroke-width": strokewidth,
                      "stroke": color,
                      "stroke-linejoin": "round",
                      "stroke-linecap": "round"
                  });
                  drawParameters.drawnElements.push(stateline);
                  this.context.sensorStates.push(stateline);
              }
              sensor.lastAnalogState = state == null ? [
                  0,
                  0,
                  0
              ] : state;
          }
      };
      return SensorDrawer;
  }();
  var sensorWithSlider = null;
  window.addEventListener('click', function(e) {
      var keep = false;
      e = e || window.event;
      var target = e.target || e.srcElement;
      if (sensorWithSlider && sensorWithSlider.focusrect && target == sensorWithSlider.focusrect.node) keep = true;
      if (sensorWithSlider && sensorWithSlider.sliders) {
          for(var i = 0; i < sensorWithSlider.sliders.length; i++){
              sensorWithSlider.sliders[i].slider.forEach(function(element) {
                  if (target == element.node || target.parentNode == element.node) {
                      keep = true;
                      return false;
                  }
              });
          }
      }
      if (!keep) {
          hideSlider(sensorWithSlider);
      }
  }, false); //<-- we'll get to the false in a minute
  function hideSlider(sensor) {
      if (!sensor) return;
      if (sensor.sliders) {
          for(var i = 0; i < sensor.sliders.length; i++){
              sensor.sliders[i].slider.remove();
          }
          sensor.sliders = [];
      }
      if (sensor.focusrect && sensor.focusrect.paper && sensor.focusrect.paper.canvas) {
          sensor.focusrect.toFront();
          if (sensor.muteBtn) sensor.muteBtn.toFront();
      }
  }

  function _array_like_to_array$3(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _unsupported_iterable_to_array$3(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$3(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$3(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$3(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$3(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var SensorHandler = /*#__PURE__*/ function() {
      function SensorHandler(context, strings) {
          var _this = this;
          this.context = context;
          this.strings = strings;
          this.sensorDefinitions = Object.values(sensorsList).map(function(a) {
              return a.getDefinition(_this.context, _this.strings);
          });
          this.sensorDrawer = new SensorDrawer(context, strings, this.sensorDefinitions, this);
      }
      var _proto = SensorHandler.prototype;
      _proto.getSensorDefinitions = function getSensorDefinitions() {
          return this.sensorDefinitions;
      };
      _proto.getSensorDrawer = function getSensorDrawer() {
          return this.sensorDrawer;
      };
      _proto.getNewSensorSuggestedName = function getNewSensorSuggestedName(name) {
          var maxvalue = 0;
          for(var _iterator = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              var firstdigit = sensor.name.search(/\d/);
              if (firstdigit > 0) {
                  var namepart = sensor.name.substring(0, firstdigit);
                  var numberpart = parseInt(sensor.name.substring(firstdigit), 10);
                  if (name == namepart && numberpart > maxvalue) {
                      maxvalue = numberpart;
                  }
              }
          }
          return name + (maxvalue + 1);
      };
      _proto.findSensorDefinition = function findSensorDefinition(sensor) {
          var sensorDef = null;
          for(var iType = 0; iType < this.sensorDefinitions.length; iType++){
              var type = this.sensorDefinitions[iType];
              if (sensor.type == type.name) {
                  if (sensor.subType && type.subTypes) {
                      for(var iSubType = 0; iSubType < type.subTypes.length; iSubType++){
                          var subType = type.subTypes[iSubType];
                          if (subType.subType == sensor.subType) {
                              sensorDef = $.extend({}, type, subType);
                          }
                      }
                  } else {
                      sensorDef = type;
                  }
              }
          }
          if (sensorDef && !sensorDef.compareState) {
              sensorDef.compareState = function(state1, state2) {
                  if (Array.isArray(state1) && Array.isArray(state2)) {
                      return JSON.stringify(state1) === JSON.stringify(state2);
                  }
                  return state1 == state2;
              };
          }
          return sensorDef;
      };
      _proto.isPortUsed = function isPortUsed(type, port) {
          for(var _iterator = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (port == "i2c") {
                  if (sensor.type == type) return true;
              } else {
                  if (sensor.port == port) return true;
              }
          }
          return false;
      };
      _proto.findSensorByName = function findSensorByName(name, error) {
          if (error === void 0) error = false;
          if (isNaN(name.substring(0, 1)) && !isNaN(name.substring(1))) {
              for(var _iterator = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                  var sensor = _step.value;
                  if (sensor.port.toUpperCase() == name.toUpperCase()) {
                      return sensor;
                  }
              }
          } else {
              var firstname = name.split(".")[0];
              for(var _iterator1 = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step1; !(_step1 = _iterator1()).done;){
                  var sensor1 = _step1.value;
                  if (sensor1.name.toUpperCase() == firstname.toUpperCase()) {
                      return sensor1;
                  }
              }
          }
          if (error) {
              this.context.success = false;
              throw this.strings.messages.sensorNotFound.format(name);
          }
          return null;
      };
      _proto.findSensorByType = function findSensorByType(type) {
          for(var _iterator = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (sensor.type == type) {
                  return sensor;
              }
          }
          return null;
      };
      _proto.findSensorByPort = function findSensorByPort(port) {
          for(var _iterator = _create_for_of_iterator_helper_loose$3(this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (sensor.port == port) {
                  return sensor;
              }
          }
          return null;
      };
      _proto.getSensorNames = function getSensorNames(sensorType) {
          var _this = this;
          return function() {
              var ports = [];
              for(var _iterator = _create_for_of_iterator_helper_loose$3(_this.context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                  var sensor = _step.value;
                  if (sensor.type == sensorType) {
                      ports.push([
                          sensor.name,
                          sensor.name
                      ]);
                  }
              }
              if (sensorType == "button") {
                  for(var _iterator1 = _create_for_of_iterator_helper_loose$3(_this.context.sensorsList.all()), _step1; !(_step1 = _iterator1()).done;){
                      var sensor1 = _step1.value;
                      if (sensor1.type == "stick") {
                          var stickDefinition = _this.findSensorDefinition(sensor1);
                          for(var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++){
                              var name = sensor1.name + "." + stickDefinition.gpiosNames[iStick];
                              ports.push([
                                  name,
                                  name
                              ]);
                          }
                      }
                  }
              }
              if (ports.length == 0) {
                  ports.push([
                      "none",
                      "none"
                  ]);
              }
              return ports;
          };
      };
      _proto.drawSensor = function drawSensor(sensor, juststate, donotmovefocusrect) {
          if (juststate === void 0) juststate = false;
          if (donotmovefocusrect === void 0) donotmovefocusrect = false;
          this.sensorDrawer.drawSensor(sensor, juststate, donotmovefocusrect);
      };
      _proto.isElementRemoved = function isElementRemoved(element) {
          return !element.paper.canvas || !element.node.parentElement;
      };
      _proto.warnClientSensorStateChanged = function warnClientSensorStateChanged(sensor) {
          var sensorStateCopy = JSON.parse(JSON.stringify(sensor.state));
          if (this.context.dispatchContextEvent) {
              this.context.dispatchContextEvent({
                  type: 'quickpi/changeSensorState',
                  payload: [
                      sensor.name,
                      sensorStateCopy
                  ],
                  onlyLog: true
              });
          }
      };
      _proto.actuatorsInRunningModeError = function actuatorsInRunningModeError() {
          window.displayHelper.showPopupMessage(this.strings.messages.actuatorsWhenRunning, 'blanket');
      };
      return SensorHandler;
  }();

  var SensorCollection = /*#__PURE__*/ function() {
      function SensorCollection() {
          this.entries = [];
      }
      var _proto = SensorCollection.prototype;
      _proto.add = function add(sensor) {
          this.entries.push(sensor);
      };
      _proto.unshift = function unshift(sensor) {
          this.entries.unshift(sensor);
      };
      _proto.all = function all() {
          return this.entries;
      };
      _proto.size = function size() {
          return this.entries.length;
      };
      return SensorCollection;
  }();


  var microbitPythonLib = '\n\ntry:\n    sensorTable\nexcept:\n    sensorTable = []\n\nfrom microbit import *\nfrom micropython import *\nfrom machine import *\nfrom time import *\nimport music\n\nservo_angle = {}\ndistance_last_value = {}\n\ndef normalizePin(pin):\n    returnpin = 0\n    hadporttype = False\n\n    pin = str(pin)\n\n    if pin.isdigit():\n        returnpin = pin\n    elif len(pin) >= 2 and pin[0].isalpha() and pin[1:].isdigit():\n        returnpin = pin[1:]\n    elif pin.upper().startswith("I2C"):\n        returnpin = pin[3:]\n    else:\n        returnpin = normalizePin(nameToPin(pin))\n\n    return int(returnpin)\n\ndef nameToPin(name):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor["port"]\n\n    return 0\n\ndef nameToDef(name, type):\n    for sensor in sensorTable:\n        if sensor["name"] == name:\n            return sensor\n\n    for sensor in sensorTable:\n        if sensor["type"] == type:\n            return sensor\n\n    return None\n\ndef readAcceleration(axis):\n    if axis == "x":\n        val = accelerometer.get_x()\n    elif axis == "y":\n        val = accelerometer.get_y()\n    elif axis == "z":\n        val = accelerometer.get_z()\n    else:\n        throw("Unknown axis")\n    return round(val/100, 1)\n\ndef readAccelBMI160():\n    return [readAcceleration("x"), readAcceleration("y"), readAcceleration("z")]\n\ndef readMagneticForce(axis):\n    if axis == "x":\n        val = compass.get_x()\n    elif axis == "y":\n        val = compass.get_y()\n    elif axis == "z":\n        val = compass.get_z()\n    else:\n        throw("Unknown axis")\n    return round(val/100, 1)\n\ndef readMagnetometerLSM303C(allowcalibration=True):\n    return [readMagneticForce("x"), readMagneticForce("y"), readMagneticForce("z")]\n\ndef setLedState(pin, state):\n    pin = normalizePin(pin)\n\n    led = Pin(pin, Pin.OUT)\n    if state:\n        led.on()\n    else:\n        led.off()\n\ndef readLightIntensity(pin):\n    return display.read_light_level()\n\ndef readTemperature(pin):\n    return temperature()\n\ndef turnLedOn():\n    setLedState("led", 1)\n\ndef turnLedOff():\n    setLedState("led", 0)\n\ndef setLedRgbState(pin, rgb):\n    led.set_colors(rgb[0], rgb[1], rgb[2])\n \ndef isButtonPressed(name):\n    if name == "button_a":\n        return button_a.is_pressed()\n    elif name == "button_b":\n        return button_b.is_pressed()\n    elif name == "pin_logo":\n        return pin_logo.is_touched()\n    else:\n        throw("Unknown button")\n    \ndef turnPortOn(pin):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        pinElement = Pin(pin, Pin.OUT)\n        pinElement.on()\n\ndef turnPortOff(pin):\n    pin = normalizePin(pin)\n\n    if pin != 0:\n        pinElement = Pin(pin, Pin.OUT)\n        pinElement.off()\n        \ndef ledMatrixShowImage(pin, image):\n    display.show(image)\n    \ndef ledMatrixClear(pin):\n    display.clear()\n    \ndef ledMatrixGetPixel(pin, x, y):\n    return display.get_pixel(x, y)\n    \ndef ledMatrixSetPixel(pin, x, y, intensity):\n    return display.set_pixel(x, y, intensity)\n    \ndef readSoundLevel(pin):\n    return microphone.sound_level()\n    \ndef setBuzzerState(name, state):\n    if state == 0:\n      music.stop()\n\ndef setBuzzerNote(pin, frequency):\n    music.pitch(frequency)\n\ndef turnBuzzerOn(pin=12):\n    setBuzzerState("buzzer1", 1)\n\ndef turnBuzzerOff(pin=12):\n    setBuzzerState("buzzer1", 0)\n';

  function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$1(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _ts_generator$2(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function _ts_values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function() {
              if (o && i >= o.length) o = void 0;
              return {
                  value: o && o[i++],
                  done: !o
              };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function getSerial(filters) {
      return _getSerial.apply(this, arguments);
  }
  function _getSerial() {
      _getSerial = _async_to_generator$1(function(filters) {
          var allPorts, savedBoard, port, info;
          return _ts_generator$2(this, function(_state) {
              switch(_state.label){
                  case 0:
                      return [
                          4,
                          navigator.serial.getPorts()
                      ];
                  case 1:
                      allPorts = _state.sent();
                      savedBoard = getSessionStorage('microbit_board');
                      if (null !== savedBoard) {
                          port = allPorts.find(function(port) {
                              return savedBoard === JSON.stringify(port.getInfo());
                          });
                      }
                      if (!!port) return [
                          3,
                          3
                      ];
                      return [
                          4,
                          navigator.serial.requestPort({
                              filters: filters
                          })
                      ];
                  case 2:
                      port = _state.sent();
                      _state.label = 3;
                  case 3:
                      console.log('before port open');
                      return [
                          4,
                          port.open({
                              baudRate: 115200
                          })
                      ];
                  case 4:
                      _state.sent();
                      console.log('after port open');
                      info = port.getInfo();
                      console.log({
                          info: info
                      });
                      setSessionStorage('microbit_board', JSON.stringify(info));
                      return [
                          2,
                          port
                      ];
              }
          });
      });
      return _getSerial.apply(this, arguments);
  }
  function serialWrite(port, data) {
      return _serialWrite.apply(this, arguments);
  }
  function _serialWrite() {
      _serialWrite = _async_to_generator$1(function(port, data) {
          var writer, encoder;
          return _ts_generator$2(this, function(_state) {
              switch(_state.label){
                  case 0:
                      writer = port.writable.getWriter();
                      encoder = new TextEncoder();
                      return [
                          4,
                          writer.write(encoder.encode(data))
                      ];
                  case 1:
                      _state.sent();
                      return [
                          4,
                          writer.ready
                      ];
                  case 2:
                      _state.sent();
                      writer.releaseLock();
                      return [
                          2
                      ];
              }
          });
      });
      return _serialWrite.apply(this, arguments);
  }
  var MicrobitConnection = /*#__PURE__*/ function() {
      function MicrobitConnection(userName, _onConnect, _onDisconnect, _onChangeBoard) {
          this.connecting = false;
          this.connected = false;
          this.releasing = false;
          this.currentOutputLine = '';
          this.currentOutput = "";
          this.executing = false;
          this._onConnect = _onConnect;
          this._onDisconnect = _onDisconnect;
          this._onChangeBoard = _onChangeBoard;
          this.resetProperties();
      }
      var _proto = MicrobitConnection.prototype;
      _proto.resetProperties = function resetProperties() {
          this.connecting = false;
          this.connected = false;
          this.releasing = false;
          this.serial = null;
          this.currentOutput = "";
          this.currentOutputLine = '';
          this.outputCallback = null;
          this.executionQueue = [];
          this.executing = false;
          this.releaseTimeout = null;
          this.currentExecutionCallback = null;
          this.currentOutputId = "";
          this.nbCommandsExecuted = 0;
      };
      _proto.onDisconnect = function onDisconnect(wasConnected, wrongversion) {
          if (wrongversion === void 0) wrongversion = false;
          this.releaseLock();
          this._onDisconnect.apply(this, arguments);
      };
      _proto.onChangeBoard = function onChangeBoard(board) {
          this._onChangeBoard.apply(this, arguments);
      };
      _proto.processMicrobitOutput = function processMicrobitOutput(data) {
          var text = new TextDecoder().decode(data);
          this.currentOutputLine += text;
          var currentLines = this.currentOutputLine.split('\r\n');
          if (currentLines.length > 1) {
              this.currentOutputLine = [].concat(currentLines).pop();
              var linesToAdd = currentLines.slice(0, -1).join('\r\n');
              this.currentOutput += linesToAdd + '\r\n';
              {
                  console.log(linesToAdd);
              }
          }
          var lines = this.currentOutput.split('\r\n');
          this.currentOutput = lines.join('\r\n');
          window.currentOutput = this.currentOutput;
          if (this.outputCallback && this.currentOutputLine.startsWith('>>> ') && lines[lines.length - 2].startsWith(this.currentOutputId)) {
              this.outputCallback(lines[lines.length - 4]);
              this.outputCallback = null;
          }
      };
      _proto.connect = function connect(url) {
          var _this = this;
          return _async_to_generator$1(function() {
              return _ts_generator$2(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _this.resetProperties();
                          _this.connecting = true;
                          _state.label = 1;
                      case 1:
                          _state.trys.push([
                              1,
                              3,
                              ,
                              4
                          ]);
                          return [
                              4,
                              getSerial([
                                  {
                                      usbProductId: 0x0204,
                                      usbVendorId: 0x0d28
                                  }
                              ])
                          ];
                      case 2:
                          _this.serial = _state.sent();
                          return [
                              3,
                              4
                          ];
                      case 3:
                          _state.sent();
                          _this.connecting = false;
                          _this._onDisconnect(false);
                          return [
                              2
                          ];
                      case 4:
                          _this.serial.addEventListener('disconnect', function() {
                              _this.connected = false;
                              _this.onDisconnect(true);
                          });
                          _this.serialStartRead(_this.serial);
                          return [
                              4,
                              _this.transferPythonLib()
                          ];
                      case 5:
                          _state.sent();
                          _this.connecting = false;
                          _this.connected = true;
                          _this._onConnect();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.serialStartRead = function serialStartRead(port) {
          var _this = this;
          return _async_to_generator$1(function() {
              var _ref, value, done;
              return _ts_generator$2(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _this.reader = port.readable.getReader();
                          _state.label = 1;
                      case 1:
                          return [
                              4,
                              _this.reader.read()
                          ];
                      case 2:
                          _ref = _state.sent(), value = _ref.value, done = _ref.done;
                          _this.processMicrobitOutput(value);
                          if (done || _this.releasing) {
                              _this.reader.cancel();
                              return [
                                  3,
                                  3
                              ];
                          }
                          return [
                              3,
                              1
                          ];
                      case 3:
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.transferPythonLib = function transferPythonLib() {
          var _this = this;
          return _async_to_generator$1(function() {
              return _ts_generator$2(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          console.log('start transfer');
                          return [
                              4,
                              serialWrite(_this.serial, "\x03")
                          ];
                      case 1:
                          _state.sent();
                          return [
                              4,
                              _this.transferModule('fioilib.py', microbitPythonLib)
                          ];
                      case 2:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f = open(\"main.py\", \"w\")\r\n", resolve);
                              })
                          ];
                      case 3:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f.write(" + JSON.stringify(mainLib).replace(/\n/g, "\r\n") + ")\r\n", resolve);
                              })
                          ];
                      case 4:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f.close()\r\n", resolve);
                              })
                          ];
                      case 5:
                          _state.sent();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.transferModule = function transferModule(moduleFile, moduleContent) {
          var _this = this;
          return _async_to_generator$1(function() {
              var _loop, size, numChunks, i, o;
              return _ts_generator$2(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          _loop = function(i, o) {
                              var chunk;
                              return _ts_generator$2(this, function(_state) {
                                  switch(_state.label){
                                      case 0:
                                          chunk = moduleContent.substring(o, o + size);
                                          return [
                                              4,
                                              new Promise(function(resolve) {
                                                  return _this.executeSerial("f.write(" + JSON.stringify(chunk).replace(/\n/g, "\r\n") + ")\r\n", resolve);
                                              })
                                          ];
                                      case 1:
                                          _state.sent();
                                          return [
                                              2
                                          ];
                                  }
                              });
                          };
                          size = 1200; // Max 1kb size
                          numChunks = Math.ceil(moduleContent.length / size);
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial('f = open("' + moduleFile + '", "w")\r\n', resolve);
                              })
                          ];
                      case 1:
                          _state.sent();
                          i = 0, o = 0;
                          _state.label = 2;
                      case 2:
                          if (!(i < numChunks)) return [
                              3,
                              5
                          ];
                          return [
                              5,
                              _ts_values(_loop(i, o))
                          ];
                      case 3:
                          _state.sent();
                          _state.label = 4;
                      case 4:
                          ++i, o += size;
                          return [
                              3,
                              2
                          ];
                      case 5:
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial("f.close()\r\n", resolve);
                              })
                          ];
                      case 6:
                          _state.sent();
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return _this.executeSerial('exec(open("' + moduleFile + '", "r").read())\r\n', resolve);
                              })
                          ];
                      case 7:
                          _state.sent();
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.isAvailable = function isAvailable(ipaddress, callback) {
          callback(ipaddress == "localhost");
      };
      _proto.onclose = function onclose() {};
      _proto.wasLocked = function wasLocked() {};
      _proto.isConnecting = function isConnecting() {
          return this.connecting;
      };
      _proto.isConnected = function isConnected() {
          return this.connected;
      };
      _proto.executeProgram = function executeProgram(pythonProgram) {
      // TODO
      };
      _proto.installProgram = function installProgram(pythonProgram, oninstall) {
          this.transferModule('program.py', pythonProgram).then(oninstall);
      };
      _proto.runDistributed = function runDistributed(pythonProgram, graphDefinition, oninstall) {
          return;
      };
      _proto.stopProgram = function stopProgram() {
      // TODO
      };
      _proto.releaseLock = function releaseLock() {
          var _this = this;
          if (!this.serial) {
              return;
          }
          this.releasing = true;
          var _this1 = this;
          var endRelease = /*#__PURE__*/ _async_to_generator$1(function() {
              return _ts_generator$2(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          if (!_this1.releaseTimeout) {
                              return [
                                  2
                              ];
                          }
                          _this1.reader.cancel().catch(function() {});
                          return [
                              4,
                              new Promise(function(resolve) {
                                  return setTimeout(resolve, 100);
                              })
                          ];
                      case 1:
                          _state.sent();
                          _this1.serial.close();
                          _this1.serial = null;
                          _this1.connecting = null;
                          _this1.connected = null;
                          _this1.releaseTimeout = null;
                          _this1.onDisconnect(false);
                          return [
                              2
                          ];
                  }
              });
          });
          serialWrite(this.serial, "\x04").then(function() {
              _this.reader.closed.then(function() {
                  // For some reason, if we don't use a timeout, the reader is still locked and we can't close the serial port
                  setTimeout(endRelease, 100);
              });
          });
          this.releaseTimeout = setTimeout(endRelease, 5000);
      };
      _proto.startNewSession = function startNewSession() {
      // TODO
      };
      _proto.startTransaction = function startTransaction() {
      // TODO
      };
      _proto.endTransaction = function endTransaction() {
      // TODO
      };
      _proto.executeSerial = function executeSerial(command, callback) {
          var _this = this;
          console.log('send command', command);
          if (this.executing) {
              this.executionQueue.push([
                  command,
                  callback
              ]);
              return;
          }
          this.executing = true;
          var that = this;
          this.nbCommandsExecuted += 1;
          if (this.nbCommandsExecuted > 500) {
              this.executionQueue.push([
                  "\x04",
                  function() {}
              ]);
              this.executionQueue.push([
                  "exec(open(\"fioilib.py\", \"r\").read())\r\n",
                  function() {}
              ]);
              this.nbCommandsExecuted = 0;
          }
          this.currentOutputId = Math.random().toString(36).substring(7);
          this.currentExecutionCallback = callback;
          serialWrite(this.serial, command + "\r\nprint(\"" + this.currentOutputId + "\")\r\n").then(function() {
              that.outputCallback = function(data) {
                  if (_this.currentExecutionCallback) {
                      _this.currentExecutionCallback(data);
                  }
                  that.executing = false;
                  if (that.executionQueue.length > 0) {
                      var _that_executionQueue_shift = that.executionQueue.shift(), _$command = _that_executionQueue_shift[0], _$callback = _that_executionQueue_shift[1];
                      _this.executeSerial(_$command, _$callback);
                  }
              };
          });
      };
      _proto.genericSendCommand = function genericSendCommand(command, callback) {
          this.executeSerial("print(" + command + ")", function(data) {
              var convertedData = data;
              if ('False' === data) {
                  convertedData = false;
              } else if ('True' === data) {
                  convertedData = true;
              }
              callback(convertedData);
          });
      };
      _proto.sendCommand = function sendCommand(command, callback) {
          if (-1 !== command.indexOf('sensorTable =')) {
              this.executeSerial(command, callback);
              return;
          }
          this.genericSendCommand(command, callback);
      };
      return MicrobitConnection;
  }();
  var mainLib = '\nimport os\nfrom machine import *\nfrom microbit import *\n\nprogram_exists = False\n\ntry:\n    open("program.py", "r").close()\n    program_exists = True\nexcept OSError:\n    pass\n\nif button_a.is_pressed() and button_b.is_pressed():\n    if program_exists:\n        print("Removing program")\n        os.remove("program.py")\nelif program_exists:\n    exec(open("fioilib.py", "r").read(), globals())\n    exec(open("program.py", "r").read(), globals())\n\n'/*f = open("main.py", "w")
  f.write("""
  from machine import *
  from thingz import *
  import os
  if button_a.is_pressed() and button_b.is_pressed():
      if os.path.exists("main.py"):
          print("Removing")
          os.remove("main.py")
  else:
      print("Hello, world!")
  """)
  f.close()*/ ;

  function _ts_generator$1(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  function convertImageFromString(str) {
      return str.split(':').map(function(e) {
          return e.split('').map(Number);
      }).slice(0, 5);
  }
  function displayModuleDefinition(context, strings) {
      return {
          classDefinitions: {
              actuator: {
                  Display: {
                      blocks: [
                          {
                              name: "show",
                              params: [
                                  null
                              ]
                          },
                          {
                              name: "clear"
                          },
                          {
                              name: "get_pixel",
                              params: [
                                  "Number",
                                  "Number"
                              ]
                          },
                          {
                              name: "set_pixel",
                              params: [
                                  "Number",
                                  "Number",
                                  "Number"
                              ]
                          }
                      ]
                  },
                  Image: {
                      defaultInstanceName: 'image',
                      init: {
                          params: [
                              "String"
                          ]
                      },
                      blocks: [],
                      constants: [
                          {
                              name: "HEART",
                              value: "09090:99999:99999:09990:00900:"
                          },
                          {
                              name: "SMILE",
                              value: "00000:00000:00000:90009:09990:"
                          },
                          {
                              name: "SAD",
                              value: "00000:09090:00000:09990:90009:"
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Display: {
                  __constructor: function __constructor(self) {
                      return _ts_generator$1(this, function(_state) {
                          return [
                              2
                          ];
                      });
                  },
                  show: function show(self, image, callback) {
                      var sensor = context.sensorHandler.findSensorByType('ledmatrix');
                      if (!sensor) {
                          throw "There is no LED matrix.";
                      }
                      var command;
                      var newState;
                      if (image.image) {
                          command = 'ledMatrixShowImage("' + sensor.name + '", Image("' + image.image + '"))';
                          newState = convertImageFromString(image.image);
                      } else if (image.match(/[0-9:]/)) {
                          command = 'ledMatrixShowImage("' + sensor.name + '", Image("' + image + '"))';
                          newState = convertImageFromString(image);
                      } else {
                          command = 'ledMatrixShowImage("' + sensor.name + '", "' + image + '")';
                          newState = convertImageFromString(image);
                      }
                      context.registerQuickPiEvent(sensor.name, newState);
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  },
                  clear: function clear(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('ledmatrix');
                      if (!sensor) {
                          throw "There is no LED matrix.";
                      }
                      var newState = [].concat(new Array(5)).fill([].concat(new Array(5)).fill(0));
                      context.registerQuickPiEvent(sensor.name, newState);
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          var command = 'ledMatrixClear("' + sensor.name + '")';
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  },
                  get_pixel: function get_pixel(self, x, y, callback) {
                      var sensor = context.sensorHandler.findSensorByType('ledmatrix');
                      if (!sensor) {
                          throw "There is no LED matrix.";
                      }
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          var state = context.getSensorState(sensor.name);
                          context.waitDelay(callback, state[y][x]);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          var command = 'ledMatrixGetPixel("' + sensor.name + '", ' + x + ", " + y + ")";
                          context.quickPiConnection.sendCommand(command, function(returnVal) {
                              cb(Number(returnVal));
                          });
                      }
                  },
                  set_pixel: function set_pixel(self, x, y, intensity, callback) {
                      var sensor = context.sensorHandler.findSensorByType('ledmatrix');
                      if (!sensor) {
                          throw "There is no LED matrix.";
                      }
                      var state = context.getSensorState(sensor.name);
                      state[y][x] = intensity;
                      context.registerQuickPiEvent(sensor.name, state);
                      if (!context.display || context.autoGrading || context.offLineMode) {
                          context.waitDelay(callback);
                      } else {
                          var cb = context.runner.waitCallback(callback);
                          var command = 'ledMatrixSetPixel("' + sensor.name + '", ' + x + ", " + y + ", " + intensity + ")";
                          context.quickPiConnection.sendCommand(command, cb);
                      }
                  }
              },
              Image: {
                  __constructor: function __constructor(self, image) {
                      return _ts_generator$1(this, function(_state) {
                          self.image = image;
                          return [
                              2
                          ];
                      });
                  }
              }
          },
          classInstances: {
              display: 'Display'
          }
      };
  }

  function microphoneModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          classDefinitions: {
              sensors: {
                  Microphone: {
                      blocks: [
                          {
                              name: "sound_level",
                              yieldsValue: 'int'
                          }
                      ]
                  }
              }
          },
          classImplementations: {
              Microphone: {
                  sound_level: function sound_level(self, callback) {
                      var sensor = context.sensorHandler.findSensorByType('sound');
                      quickPiModuleDefinition.blockImplementations.readSoundLevel(sensor.name, callback);
                  }
              }
          },
          classInstances: {
              microphone: 'Microphone'
          }
      };
  }

  function musicModuleDefinition(context, strings) {
      var quickPiModuleDefinition = quickpiModuleDefinition(context, strings);
      return {
          blockDefinitions: {
              actuator: [
                  {
                      name: "pitch",
                      params: [
                          'Number'
                      ]
                  },
                  {
                      name: "stop"
                  }
              ]
          },
          blockImplementations: {
              pitch: function pitch(frequency, callback) {
                  var sensor = context.sensorHandler.findSensorByType('buzzer');
                  quickPiModuleDefinition.blockImplementations.setBuzzerNote(sensor.name, frequency, callback);
              },
              stop: function stop(callback) {
                  var sensor = context.sensorHandler.findSensorByType('buzzer');
                  quickPiModuleDefinition.blockImplementations.setBuzzerState(sensor.name, false, callback);
              }
          }
      };
  }

  function _array_like_to_array$2(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of(subClass, superClass);
  }
  function _set_prototype_of(o, p) {
      _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of(o, p);
  }
  function _unsupported_iterable_to_array$2(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$2(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$2(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$2(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$2(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _ts_generator(thisArg, body) {
      var f, y, t, g, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      };
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(_)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var microbitSvgInline = null;
  var microbitConnection = null;
  var MicrobitBoard = /*#__PURE__*/ function(AbstractBoard) {
      _inherits(MicrobitBoard, AbstractBoard);
      function MicrobitBoard() {
          var _this;
          _this = AbstractBoard.apply(this, arguments) || this;
          _this.buttonStatesUpdators = {};
          _this.defaultSubBoard = 'microbit';
          _this.microbitSvg = null;
          _this.initialized = false;
          _this.innerState = {};
          return _this;
      }
      var _proto = MicrobitBoard.prototype;
      _proto.init = function init(selector, onUserEvent) {
          this.onUserEvent = onUserEvent;
          this.importMicrobit(selector);
          return this.updateState.bind(this);
      };
      _proto.fetchMicrobitCard = function fetchMicrobitCard() {
          return _async_to_generator(function() {
              return _ts_generator(this, function(_state) {
                  // Cache results
                  if (!microbitSvgInline) {
                      microbitSvgInline = decodeURIComponent(img.substring(img.indexOf(',') + 1));
                  }
                  return [
                      2,
                      microbitSvgInline
                  ];
              });
          })();
      };
      _proto.importMicrobit = function importMicrobit(selector) {
          var _this = this;
          return _async_to_generator(function() {
              var svgData;
              return _ts_generator(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          return [
                              4,
                              _this.fetchMicrobitCard()
                          ];
                      case 1:
                          svgData = _state.sent();
                          $(selector).html(svgData).css('user-select', 'none');
                          _this.microbitSvg = $(selector + ' svg');
                          _this.initInteraction();
                          _this.displayInnerState();
                          _this.initialized = true;
                          return [
                              2
                          ];
                  }
              });
          })();
      };
      _proto.initInteraction = function initInteraction() {
          this.microbitSvg.attr('width', "100%");
          this.microbitSvg.attr('height', "100%");
          var buttonIds = {
              a: 'button_a',
              b: 'button_b',
              sys: 'button_sys'
          };
          for(var _iterator = _create_for_of_iterator_helper_loose$2(Object.entries(buttonIds)), _step; !(_step = _iterator()).done;){
              var _step_value = _step.value, buttonId = _step_value[0], buttonName = _step_value[1];
              this.bindPushButton(buttonId, buttonName);
          }
          var padIds = {
              up: 'touch_n',
              down: 'touch_s',
              left: 'touch_w',
              right: 'touch_e'
          };
          for(var _iterator1 = _create_for_of_iterator_helper_loose$2(Object.entries(padIds)), _step1; !(_step1 = _iterator1()).done;){
              var _step_value1 = _step1.value, padId = _step_value1[0], padName = _step_value1[1];
              this.bindPadButton(padId, padName);
          }
      };
      _proto.bindPushButton = function bindPushButton(buttonId, buttonName) {
          var that = this;
          var buttons = this.microbitSvg.find('#button-' + buttonId + '-top, #button-' + buttonId + '-bot');
          var buttonTop = buttons.filter('#button-' + buttonId + '-top');
          var buttonBot = buttons.filter('#button-' + buttonId + '-bot');
          var colorTop = buttons.filter('#button-' + buttonId + '-top').css('fill');
          var colorBot = buttons.filter('#button-' + buttonId + '-bot').css('fill');
          var buttonDown = function buttonDown(isSet) {
              buttonTop.css('fill', 'transparent');
              buttonBot.css('fill', colorTop);
              if (isSet !== true && !that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, true);
              }
              that.innerState[buttonName] = true;
          };
          var buttonUp = function buttonUp(isSet) {
              buttonTop.css('fill', colorTop);
              buttonBot.css('fill', colorBot);
              if (isSet !== true && that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, false);
              }
              that.innerState[buttonName] = false;
          };
          buttons.mousedown(buttonDown);
          buttons.mouseup(buttonUp);
          buttons.mouseleave(buttonUp);
          this.buttonStatesUpdators[buttonName] = {
              'down': buttonDown,
              'up': buttonUp
          };
      };
      _proto.bindPadButton = function bindPadButton(buttonId, buttonName) {
          var that = this;
          var button = this.microbitSvg.find('#pad-' + buttonId);
          var buttonDown = function buttonDown(isSet) {
              button.css('fill-opacity', '1');
              if (isSet !== true && !that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, true);
              }
              that.innerState[buttonName] = true;
          };
          var buttonUp = function buttonUp(isSet) {
              button.css('fill-opacity', '0');
              if (isSet !== true && that.innerState[buttonName]) {
                  that.onUserEvent(buttonName, false);
              }
              that.innerState[buttonName] = false;
          };
          button.mousedown(buttonDown);
          button.mouseup(buttonUp);
          button.mouseleave(buttonUp);
          this.buttonStatesUpdators[buttonName] = {
              'down': buttonDown,
              'up': buttonUp
          };
      };
      _proto.setLedMatrix = function setLedMatrix(state) {
          if (!this.initialized) {
              return;
          }
          for(var y = 0; y < 5; y++){
              for(var x = 0; x < 5; x++){
                  var led = this.microbitSvg.find('#ledmatrix-' + x + '-' + y);
                  led.attr('opacity', (state && state[y] ? state[y][x] : 0) / 10);
              }
          }
      };
      _proto.setConnected = function setConnected(isConnected) {
          if (!this.initialized) {
              return;
          }
          var cable = this.microbitSvg.find('#cable');
          cable.toggle(isConnected);
      };
      _proto.updateState = function updateState(sensor) {
          if (sensor === 'connected') {
              this.innerState.connected = true;
              this.setConnected(true);
          } else if (sensor === 'disconnected') {
              this.innerState.connected = false;
              this.setConnected(false);
          } else if (sensor.name.substring(0, 7) == 'button_' || sensor.name.substring(0, 6) == 'touch_') {
              this.innerState[sensor.name] = sensor.state;
              if (!this.initialized) {
                  return;
              }
              this.buttonStatesUpdators[sensor.name][sensor.state ? 'down' : 'up'](true);
          } else if (sensor.type === 'ledmatrix') {
              this.innerState.ledmatrix = sensor.state;
              var _sensor_state;
              this.setLedMatrix((_sensor_state = sensor.state) != null ? _sensor_state : [].concat(new Array(5)).fill([].concat(new Array(5)).fill(0)));
          }
      };
      _proto.displayInnerState = function displayInnerState() {
          // The display might be reset so we need to keep it up to date
          for(var id in this.buttonStatesUpdators){
              this.buttonStatesUpdators[id][this.innerState[id] ? 'down' : 'up'](true);
          }
          this.setLedMatrix(this.innerState.ledmatrix);
          this.setConnected(this.innerState.connected);
      };
      _proto.getBoardDefinitions = function getBoardDefinitions() {
          return [
              {
                  name: "microbit",
                  image: "quickpihat.png",
                  portTypes: {
                      "D": [
                          0,
                          1,
                          2,
                          6,
                          7,
                          8,
                          12,
                          13,
                          14,
                          15,
                          16,
                          19,
                          20
                      ],
                      "A": [
                          0,
                          1,
                          2,
                          6,
                          7,
                          8,
                          12,
                          13,
                          14,
                          15,
                          16,
                          19,
                          20
                      ],
                      "i2c": [
                          "i2c"
                      ]
                  },
                  builtinSensors: [
                      {
                          type: "button",
                          suggestedName: 'button_a'
                      },
                      {
                          type: "button",
                          suggestedName: 'button_b'
                      }
                  ]
              }
          ];
      };
      _proto.getAvailableConnectionMethods = function getAvailableConnectionMethods() {
          return [
              ConnectionMethod.WebSerial
          ];
      };
      _proto.getConnection = function getConnection() {
          if (!microbitConnection) {
              microbitConnection = function microbitConnection(userName, _onConnect, _onDisconnect, _onChangeBoard) {
                  return new MicrobitConnection(userName, _onConnect, _onDisconnect, _onChangeBoard);
              };
          }
          return microbitConnection;
      };
      _proto.getCustomBlocks = function getCustomBlocks(context, strings) {
          var accelerometerModule = thingzAccelerometerModuleDefinition(context, strings);
          var compassModule = thingzCompassModuleDefinition(context, strings);
          var buttonModule = thingzButtonsModuleDefinition(context, strings);
          var temperatureModule = thingzTemperatureModuleDefinition(context, strings);
          var timeModule = timeSleepModuleDefinition(context, strings);
          var displayModule = displayModuleDefinition(context);
          var microphoneModule = microphoneModuleDefinition(context, strings);
          var musicModule = musicModuleDefinition(context, strings);
          return mergeModuleDefinitions({
              microbit: [
                  accelerometerModule,
                  compassModule,
                  buttonModule,
                  temperatureModule,
                  displayModule,
                  microphoneModule
              ],
              music: [
                  musicModule
              ],
              time: [
                  timeModule
              ]
          });
      };
      return MicrobitBoard;
  }(AbstractBoard);
  var microbitBoard = new MicrobitBoard();

  function _array_like_to_array$1(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _extends() {
      _extends = Object.assign || function(target) {
          for(var i = 1; i < arguments.length; i++){
              var source = arguments[i];
              for(var key in source){
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      };
      return _extends.apply(this, arguments);
  }
  function _unsupported_iterable_to_array$1(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$1(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$1(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$1(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var boards = {
      galaxia: galaxiaBoard,
      microbit: microbitBoard,
      quickpi: quickPiBoard
  };
  // This is a template of library for use with quickAlgo.
  var getContext = function getContext(display, infos, curLevel) {
      // Create a base context
      var context = window.quickAlgoContext(display, infos);
      // we set the lib involved to Quick-Pi
      context.title = "Quick-Pi";
      // Import our localLanguageStrings into the global scope
      var strings = context.setLocalLanguageStrings(quickPiLocalLanguageStrings);
      context.disableAutoCompletion = false;
      // Some data can be made accessible by the library through the context object
      context.quickpi = {};
      var _context_infos_quickPiBoard;
      var mainBoard = boards[(_context_infos_quickPiBoard = context.infos.quickPiBoard) != null ? _context_infos_quickPiBoard : 'quickpi'];
      if (!mainBoard) {
          throw "This main board doesn't exist: \"" + context.infos.quickPiBoard + '"';
      }
      context.board = mainBoard.defaultSubBoard;
      mainBoard.setStrings(strings);
      context.mainBoard = mainBoard;
      var sensorHandler = new SensorHandler(context, strings);
      context.sensorHandler = sensorHandler;
      // List of concepts to be included by conceptViewer
      context.getConceptList = function() {
          var conceptList = [
              {
                  id: 'language',
                  ignore: true
              }
          ];
          var quickPiConceptList = [
              {
                  id: 'quickpi_start',
                  isBase: true,
                  order: 1,
                  python: []
              },
              {
                  id: 'quickpi_validation',
                  isBase: true,
                  order: 2,
                  python: []
              },
              {
                  id: 'quickpi_buzzer',
                  order: 200,
                  python: [
                      'setBuzzerState',
                      'setBuzzerNote',
                      'turnBuzzerOn',
                      'turnBuzzerOff',
                      'setBuzzerState',
                      'getBuzzerNote',
                      'isBuzzerOn'
                  ]
              },
              {
                  id: 'quickpi_led',
                  order: 201,
                  python: [
                      'setLedState',
                      'toggleLedState',
                      'turnLedOn',
                      'turnLedOff',
                      'setLedBrightness',
                      'getLedBrightness',
                      'isLedOn'
                  ]
              },
              {
                  id: 'quickpi_button',
                  order: 202,
                  python: [
                      'isButtonPressed',
                      'isButtonPressedWithName',
                      'waitForButton',
                      'buttonWasPressed',
                      'onButtonPressed'
                  ]
              },
              {
                  id: 'quickpi_screen',
                  order: 203,
                  python: [
                      'displayText'
                  ]
              },
              {
                  id: 'quickpi_draw',
                  order: 203,
                  python: [
                      'drawRectangle',
                      'drawLine',
                      'drawCircle',
                      'drawPoint',
                      'clearScreen',
                      'fill',
                      'noFill',
                      'stroke',
                      'noStroke',
                      'updateScreen',
                      'autoUpdate',
                      'isPointSet'
                  ]
              },
              {
                  id: 'quickpi_range',
                  order: 204,
                  python: [
                      'readDistance'
                  ]
              },
              {
                  id: 'quickpi_servo',
                  order: 205,
                  python: [
                      'setServoAngle',
                      'getServoAngle'
                  ]
              },
              {
                  id: 'quickpi_thermometer',
                  order: 206,
                  python: [
                      'readTemperature'
                  ]
              },
              {
                  id: 'quickpi_microphone',
                  order: 207,
                  python: [
                      'readSoundLevel'
                  ]
              },
              {
                  id: 'quickpi_light_sensor',
                  order: 208,
                  python: [
                      'readLightIntensity'
                  ]
              },
              {
                  id: 'quickpi_accelerometer',
                  order: 209,
                  python: [
                      'readAcceleration',
                      'computeRotation'
                  ]
              },
              {
                  id: 'quickpi_wait',
                  order: 250,
                  python: [
                      'sleep',
                      'currentTime'
                  ]
              },
              {
                  id: 'quickpi_magneto',
                  order: 210,
                  python: [
                      'readMagneticForce',
                      'computeCompassHeading'
                  ]
              },
              {
                  id: 'quickpi_ir_receiver',
                  order: 211,
                  python: [
                      'readInfraredState',
                      'readIRMessage'
                  ]
              },
              {
                  id: "quickpi_ir_emitter",
                  order: 212,
                  python: [
                      "setInfraredState",
                      "sendIRMessage",
                      "presetIRMessage"
                  ]
              },
              {
                  id: "quickpi_potentiometer",
                  order: 213,
                  python: [
                      "readRotaryAngle"
                  ]
              },
              {
                  id: "quickpi_gyroscope",
                  order: 214,
                  python: [
                      "readAngularVelocity",
                      "setGyroZeroAngle",
                      "computeRotationGyro"
                  ]
              },
              {
                  id: 'quickpi_cloud',
                  order: 220,
                  python: [
                      'writeToCloudStore',
                      'connectToCloudStore',
                      'readFromCloudStore',
                      'getTemperatureFromCloud'
                  ]
              }
          ];
          var conceptStrings = strings.concepts;
          var conceptIndex = 'quickpi_' + window.stringsLanguage + '.html';
          if (window.stringsLanguage == 'fr' || !strings.concepts) {
              conceptStrings = quickPiLocalLanguageStrings.fr.concepts;
              conceptIndex = 'quickpi.html';
          }
          var conceptBaseUrl = 'https://static4.castor-informatique.fr/help/' + conceptIndex;
          for(var i = 0; i < quickPiConceptList.length; i++){
              var concept = quickPiConceptList[i];
              concept.name = conceptStrings[concept.id];
              concept.url = conceptBaseUrl + '#' + concept.id;
              if (!concept.language) {
                  concept.language = 'all';
              }
              conceptList.push(concept);
          }
          return conceptList;
      };
      context.sensorsList = new SensorCollection();
      for(var _iterator = _create_for_of_iterator_helper_loose$1(infos.quickPiSensors), _step; !(_step = _iterator()).done;){
          var sensor = _step.value;
          var realSensor = createSensor(sensor, context, strings);
          context.sensorsList.add(realSensor);
      }
      var boardDefinitions = mainBoard.getBoardDefinitions();
      if (window.quickAlgoInterface) {
          window.quickAlgoInterface.stepDelayMin = 1;
      }
      var defaultQuickPiOptions = {
          disableConnection: false,
          increaseTimeAfterCalls: 5
      };
      function getQuickPiOption(name) {
          if (name == 'disableConnection') {
              // TODO :: Legacy, remove when all tasks will have been updated
              return context.infos && (context.infos.quickPiDisableConnection || context.infos.quickPi && context.infos.quickPi.disableConnection);
          }
          if (context.infos && context.infos.quickPi && typeof context.infos.quickPi[name] != 'undefined') {
              return context.infos.quickPi[name];
          } else {
              return defaultQuickPiOptions[name];
          }
      }
      function getWrongStateText(failInfo) {
          var actualStateStr = "" + failInfo.actual;
          var expectedStateStr = "" + failInfo.expected;
          var sensorDef = sensorHandler.findSensorDefinition(failInfo.sensor);
          if (sensorDef) {
              if (sensorDef.isSensor) {
                  return strings.messages.wrongStateSensor.format(failInfo.name, failInfo.time);
              }
              if (sensorDef.getWrongStateString) {
                  var sensorWrongStr = sensorDef.getWrongStateString(failInfo);
                  if (sensorWrongStr) {
                      return sensorWrongStr;
                  }
              }
              if (sensorDef.getStateString) {
                  actualStateStr = sensorDef.getStateString(failInfo.actual);
                  expectedStateStr = sensorDef.getStateString(failInfo.expected);
              }
          }
          return strings.messages.wrongState.format(failInfo.name, actualStateStr, expectedStateStr, failInfo.time);
      }
      if (mainBoard.getConnection()) {
          var lockstring = getSessionStorage('lockstring');
          if (!lockstring) {
              lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              setSessionStorage('lockstring', lockstring);
          }
          var getBoardConnection = mainBoard.getConnection();
          context.quickPiConnection = getBoardConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected, raspberryPiChangeBoard);
          context.quickPiConnection.isAvailable("localhost", function(available) {
              context.localhostAvailable = available;
          });
          context.quickPiConnection.isAvailable(window.location.hostname, function(available) {
              context.windowLocationAvailable = available;
          });
      }
      context.offLineMode = true;
      context.timeLineStates = [];
      var innerState = {};
      var getSensorFullState = function getSensorFullState(sensor) {
          return {
              state: sensor.state,
              screenDrawing: sensor.screenDrawing,
              lastDrawnTime: sensor.lastDrawnTime,
              lastDrawnState: sensor.lastDrawnState,
              callsInTimeSlot: sensor.callsInTimeSlot,
              lastTimeIncrease: sensor.lastTimeIncrease,
              removed: sensor.removed,
              quickStore: sensor.quickStore
          };
      };
      var reloadSensorFullState = function reloadSensorFullState(sensor, save) {
          sensor.state = save.state;
          sensor.screenDrawing = save.screenDrawing;
          sensor.lastDrawnTime = save.lastDrawnTime;
          sensor.lastDrawnState = save.lastDrawnState;
          sensor.callsInTimeSlot = save.callsInTimeSlot;
          sensor.lastTimeIncrease = save.lastTimeIncrease;
          sensor.removed = save.removed;
          sensor.quickStore = save.quickStore;
      };
      context.getInnerState = function() {
          var savedSensors = {};
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              savedSensors[sensor.name] = getSensorFullState(sensor);
          }
          innerState.sensors = savedSensors;
          innerState.timeLineStates = context.timeLineStates.map(function(timeLineState) {
              var timeLineElement = Object.assign({}, timeLineState);
              timeLineElement.sensorName = timeLineElement.sensor.name;
              delete timeLineElement.sensor;
              return timeLineElement;
          });
          innerState.currentTime = context.currentTime;
          return innerState;
      };
      context.implementsInnerState = function() {
          return true;
      };
      context.reloadInnerState = function(data) {
          innerState = data;
          for(var name in data.sensors){
              var sensor = sensorHandler.findSensorByName(name);
              var savedSensor = data.sensors[name];
              context.sensorsSaved[name] = savedSensor;
              reloadSensorFullState(sensor, savedSensor);
          }
          context.timeLineStates = [];
          for(var i = 0; i < data.timeLineStates.length; i++){
              var newTimeLineState = Object.assign({}, data.timeLineStates[i]);
              newTimeLineState.sensor = sensorHandler.findSensorByName(newTimeLineState.sensorName);
              context.timeLineStates.push(newTimeLineState);
          }
          context.currentTime = data.currentTime;
      };
      context.getEventListeners = function() {
          return {
              'quickpi/changeSensorState': 'changeSensorState'
          };
      };
      context.redrawDisplay = function() {
          context.resetDisplay();
      };
      context.onExecutionEnd = function() {
          if (context.autoGrading) {
              buzzerSound.stopAll();
          }
      };
      infos.checkEndEveryTurn = true;
      infos.checkEndCondition = function(context, lastTurn) {
          if (!context.display && !context.autoGrading && !context.forceGradingWithoutDisplay) {
              context.success = true;
              throw strings.messages.manualTestSuccess;
          }
          if (context.failImmediately) {
              context.success = false;
              throw context.failImmediately;
          }
          var testEnded = lastTurn || context.currentTime > context.maxTime;
          if (context.autoGrading) {
              if (!testEnded) {
                  return;
              }
              if (lastTurn && context.display && !context.loopsForever) {
                  context.currentTime = Math.floor(context.maxTime * 1.05);
                  drawNewStateChanges();
                  drawCurrentTime();
              }
              var failInfo = null;
              for(var sensorName in context.gradingStatesBySensor){
                  // Cycle through each sensor from the grading states
                  var sensor = sensorHandler.findSensorByName(sensorName);
                  var sensorDef = sensorHandler.findSensorDefinition(sensor);
                  var expectedStates = context.gradingStatesBySensor[sensorName];
                  if (!expectedStates.length) {
                      continue;
                  }
                  var actualStates = context.actualStatesBySensor[sensorName];
                  var actualIdx = 0;
                  // Check that we went through all expected states
                  for(var i = 0; i < context.gradingStatesBySensor[sensorName].length; i++){
                      var expectedState = context.gradingStatesBySensor[sensorName][i];
                      if (expectedState.hit || expectedState.input) {
                          continue;
                      } // Was hit, valid
                      var newFailInfo = null;
                      if (actualStates) {
                          // Scroll through actual states until we get the state at this time
                          while(actualIdx + 1 < actualStates.length && actualStates[actualIdx + 1].time <= expectedState.time){
                              actualIdx += 1;
                          }
                          if (!sensorDef.compareState(actualStates[actualIdx].state, expectedState.state)) {
                              newFailInfo = {
                                  sensor: sensor,
                                  name: sensorName,
                                  time: expectedState.time,
                                  expected: expectedState.state,
                                  actual: actualStates[actualIdx].state
                              };
                          }
                      } else {
                          // No actual states to compare to
                          newFailInfo = {
                              sensor: sensor,
                              name: sensorName,
                              time: expectedState.time,
                              expected: expectedState.state,
                              actual: null
                          };
                      }
                      if (newFailInfo) {
                          // Only update failInfo if we found an error earlier
                          failInfo = failInfo && failInfo.time < newFailInfo.time ? failInfo : newFailInfo;
                      }
                  }
                  // Check that no actual state conflicts an expected state
                  if (!actualStates) {
                      continue;
                  }
                  var expectedIdx = 0;
                  for(var i = 0; i < actualStates.length; i++){
                      var actualState = actualStates[i];
                      while(expectedIdx + 1 < expectedStates.length && expectedStates[expectedIdx + 1].time <= actualState.time){
                          expectedIdx += 1;
                      }
                      if (!sensorDef.compareState(actualState.state, expectedStates[expectedIdx].state)) {
                          // Got an unexpected state change
                          var newFailInfo1 = {
                              sensor: sensor,
                              name: sensorName,
                              time: actualState.time,
                              expected: expectedStates[expectedIdx].state,
                              actual: actualState.state
                          };
                          failInfo = failInfo && failInfo.time < newFailInfo1.time ? failInfo : newFailInfo1;
                      }
                  }
              }
              if (failInfo) {
                  // Missed expected state
                  context.success = false;
                  throw getWrongStateText(failInfo);
              } else {
                  // Success
                  context.success = true;
                  throw strings.messages.programEnded;
              }
          } else {
              if (!context.offLineMode) {
                  $('#piinstallcheck').hide();
              }
              if (lastTurn) {
                  context.success = true;
                  throw strings.messages.programEnded;
              }
          }
      };
      context.generatePythonSensorTable = function() {
          var pythonSensorTable = "sensorTable = [";
          var first = true;
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (first) {
                  first = false;
              } else {
                  pythonSensorTable += ",";
              }
              if (sensor.type == "stick") {
                  var stickDefinition = sensorHandler.findSensorDefinition(sensor);
                  var firststick = true;
                  for(var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++){
                      var name = sensor.name + "." + stickDefinition.gpiosNames[iStick];
                      var port = "D" + stickDefinition.gpios[iStick];
                      if (firststick) {
                          firststick = false;
                      } else {
                          pythonSensorTable += ",";
                      }
                      pythonSensorTable += "{\"type\":\"button\"";
                      pythonSensorTable += ",\"name\":\"" + name + "\"";
                      pythonSensorTable += ",\"port\":\"" + port + "\"}";
                  }
              } else {
                  pythonSensorTable += "{\"type\":\"" + sensor.type + "\"";
                  pythonSensorTable += ",\"name\":\"" + sensor.name + "\"";
                  pythonSensorTable += ",\"port\":\"" + sensor.port + "\"";
                  if (sensor.subType) pythonSensorTable += ",\"subType\":\"" + sensor.subType + "\"";
                  pythonSensorTable += "}";
              }
          }
          var board = mainBoard.getCurrentBoard(context.board);
          pythonSensorTable += "]; currentADC = \"" + board.adc + "\"";
          return pythonSensorTable;
      };
      context.resetSensorTable = function() {
          var pythonSensorTable = context.generatePythonSensorTable();
          context.quickPiConnection.sendCommand(pythonSensorTable, function(x) {});
      };
      context.findSensor = function findSensor(type, port, error) {
          if (error === void 0) error = true;
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (sensor.type == type && sensor.port == port) return sensor;
          }
          if (error) {
              context.success = false;
              throw strings.messages.sensorNotFound.format('type ' + type + ', port ' + port);
          }
          return null;
      };
      function sensorAssignPort(sensor) {
          var board = mainBoard.getCurrentBoard(context.board);
          var sensorDefinition = sensorHandler.findSensorDefinition(sensor);
          sensor.port = null;
          // first try with built ins
          if (board.builtinSensors) {
              for(var i = 0; i < board.builtinSensors.length; i++){
                  var builtinsensor = board.builtinSensors[i];
                  // Search for the specified subtype 
                  if (builtinsensor.type == sensor.type && builtinsensor.subType == sensor.subType && !context.findSensor(builtinsensor.type, builtinsensor.port, false)) {
                      sensor.port = builtinsensor.port;
                      return;
                  }
              }
              // Search without subtype
              for(var i = 0; i < board.builtinSensors.length; i++){
                  var builtinsensor = board.builtinSensors[i];
                  // Search for the specified subtype 
                  if (builtinsensor.type == sensor.type && !context.findSensor(builtinsensor.type, builtinsensor.port, false)) {
                      sensor.port = builtinsensor.port;
                      sensor.subType = builtinsensor.subType;
                      return;
                  }
              }
              // If this is a button try to set it to a stick
              if (!sensor.port && sensor.type == "button") {
                  for(var i = 0; i < board.builtinSensors.length; i++){
                      var builtinsensor = board.builtinSensors[i];
                      if (builtinsensor.type == "stick") {
                          sensor.port = builtinsensor.port;
                          return;
                      }
                  }
              }
          }
          // Second try assign it a grove port
          if (!sensor.port) {
              var sensorDefinition = sensorHandler.findSensorDefinition(sensor);
              var pluggable = sensorDefinition.pluggable;
              if (sensorDefinition.subTypes) {
                  for(var iSubTypes = 0; iSubTypes < sensorDefinition.subTypes.length; iSubTypes++){
                      var subTypeDefinition = sensorDefinition.subTypes[iSubTypes];
                      if (pluggable || subTypeDefinition.pluggable) {
                          var ports = board.portTypes[sensorDefinition.portType];
                          for(var iPorts = 0; iPorts < ports.length; iPorts++){
                              var port = sensorDefinition.portType;
                              if (sensorDefinition.portType != "i2c") port = sensorDefinition.portType + ports[iPorts];
                              if (!sensorHandler.findSensorByPort(port)) {
                                  sensor.port = port;
                                  if (!sensor.subType) sensor.subType = subTypeDefinition.subType;
                                  return;
                              }
                          }
                      }
                  }
              } else {
                  if (pluggable) {
                      var ports = board.portTypes[sensorDefinition.portType];
                      for(var iPorts = 0; iPorts < ports.length; iPorts++){
                          var port = sensorDefinition.portType + ports[iPorts];
                          if (!sensorHandler.findSensorByPort(port)) {
                              sensor.port = port;
                              return;
                          }
                      }
                  }
              }
          }
      }
      context.resetSensors = function() {
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              if (context.sensorsSaved[sensor.name] && !context.autoGrading) {
                  var save = context.sensorsSaved[sensor.name];
                  reloadSensorFullState(sensor, save);
              } else {
                  sensor.state = null;
                  sensor.screenDrawing = null;
                  sensor.lastDrawnTime = 0;
                  sensor.lastDrawnState = null;
                  sensor.callsInTimeSlot = 0;
                  sensor.lastTimeIncrease = 0;
                  sensor.removed = false;
                  sensor.quickStore = null;
              }
              if (sensor.name == "gyroscope") sensor.rotationAngles = undefined;
          }
      };
      context.reset = function(taskInfos) {
          buzzerSound.stopAll();
          context.alreadyHere = true;
          context.failImmediately = null;
          if (!context.offLineMode) {
              $('#piinstallcheck').hide();
              context.quickPiConnection.startNewSession();
              context.resetSensorTable();
          }
          context.currentTime = 0;
          if (taskInfos != undefined) {
              context.actualStatesBySensor = {};
              context.tickIncrease = 100;
              context.autoGrading = taskInfos.autoGrading;
              context.loopsForever = taskInfos.loopsForever;
              context.allowInfiniteLoop = !context.autoGrading;
              if (context.autoGrading) {
                  context.maxTime = 0;
                  if (taskInfos.input) {
                      for(var i = 0; i < taskInfos.input.length; i++){
                          taskInfos.input[i].input = true;
                      }
                      context.gradingStatesByTime = taskInfos.input.concat(taskInfos.output);
                  } else {
                      context.gradingStatesByTime = taskInfos.output;
                  }
                  // Copy states to avoid modifying the taskInfos states
                  context.gradingStatesByTime = context.gradingStatesByTime.map(function(val) {
                      return Object.assign({}, val);
                  });
                  context.gradingStatesByTime.sort(function(a, b) {
                      return a.time - b.time;
                  });
                  context.gradingStatesBySensor = {};
                  for(var i = 0; i < context.gradingStatesByTime.length; i++){
                      var state = context.gradingStatesByTime[i];
                      if (!context.gradingStatesBySensor.hasOwnProperty(state.name)) context.gradingStatesBySensor[state.name] = [];
                      context.gradingStatesBySensor[state.name].push(state);
                      //                    state.hit = false;
                      //                    state.badonce = false;
                      if (state.time > context.maxTime) context.maxTime = state.time;
                  }
                  for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                      var sensor = _step.value;
                      if (sensor.type == "buzzer") {
                          var states = context.gradingStatesBySensor[sensor.name];
                          if (states) {
                              for(var iState = 0; iState < states.length; iState++){
                                  var state = states[iState].state;
                                  if (typeof state == 'number' && state != 0 && state != 1) {
                                      sensor.showAsAnalog = true;
                                      break;
                                  }
                              }
                          }
                      }
                      var isAnalog = sensorHandler.findSensorDefinition(sensor).isAnalog || sensor.showAsAnalog;
                      if (isAnalog) {
                          sensor.maxAnalog = Number.MIN_VALUE;
                          sensor.minAnalog = Number.MAX_VALUE;
                          if (context.gradingStatesBySensor.hasOwnProperty(sensor.name)) {
                              var states = context.gradingStatesBySensor[sensor.name];
                              for(var iState = 0; iState < states.length; iState++){
                                  var state = states[iState];
                                  if (state.state > sensor.maxAnalog) sensor.maxAnalog = state.state;
                                  if (state.state < sensor.minAnalog) sensor.minAnalog = state.state;
                              }
                          }
                      }
                      if (sensor.type == "screen") {
                          var states = context.gradingStatesBySensor[sensor.name];
                          if (states) {
                              for(var iState = 0; iState < states.length; iState++){
                                  var state = states[iState];
                                  if (state.state.isDrawingData) sensor.isDrawingScreen = true;
                              }
                          }
                      }
                  }
              }
              if (infos.quickPiSensors == "default") {
                  context.sensorsList = new SensorCollection();
                  addDefaultBoardSensors();
              }
          }
          context.success = false;
          if (context.autoGrading) context.doNotStartGrade = false;
          else context.doNotStartGrade = true;
          if (context.paper && context.autoGrading && context.display) {
              if (context.sensorStates) context.sensorStates.remove();
              context.sensorStates = context.paper.set();
          }
          context.resetSensors();
          for(var _iterator1 = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step1; !(_step1 = _iterator1()).done;){
              var sensor1 = _step1.value;
              // If the sensor has no port assign one
              if (!sensor1.port) {
                  sensorAssignPort(sensor1);
              }
          }
          if (context.display) {
              context.recreateDisplay = true;
              context.displayAutoGrading = context.autoGrading;
              context.timeLineStates = [];
              context.resetDisplay();
          } else {
              context.success = false;
          }
          // Needs display to be reset before calling registerQuickPiEvent
          for(var _iterator2 = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step2; !(_step2 = _iterator2()).done;){
              var sensor2 = _step2.value;
              // Set initial state
              var sensorDef = sensorHandler.findSensorDefinition(sensor2);
              if (sensorDef && !sensorDef.isSensor && sensor2.getInitialState) {
                  var initialState = sensor2.getInitialState();
                  if (initialState != null) context.registerQuickPiEvent(sensor2.name, initialState, true, true);
              }
          }
          startSensorPollInterval();
      };
      function clearSensorPollInterval() {
          if (context.sensorPollInterval) {
              clearInterval(context.sensorPollInterval);
              context.sensorPollInterval = null;
          }
      }
      function startSensorPollInterval() {
          // Start polling the sensors on the raspberry if the raspberry is connected
          clearSensorPollInterval();
          context.liveUpdateCount = 0;
          if (!context.quickPiConnection.isConnected()) {
              return;
          }
          context.sensorPollInterval = setInterval(function() {
              if (context.runner && context.runner.isRunning() || context.offLineMode || context.liveUpdateCount != 0 || context.stopLiveUpdate) {
                  return;
              }
              context.quickPiConnection.startTransaction();
              for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                  var sensor = _step.value;
                  updateLiveSensor(sensor);
              }
              context.quickPiConnection.endTransaction();
          }, 200);
      }
      function updateLiveSensor(sensor) {
          if (sensorHandler.findSensorDefinition(sensor).isSensor && sensor.getLiveState) {
              context.liveUpdateCount++;
              //console.log("updateLiveSensor " + sensor.name, context.liveUpdateCount);
              sensor.getLiveState(function(returnVal) {
                  context.liveUpdateCount--;
                  //console.log("updateLiveSensor callback" + sensor.name, context.liveUpdateCount);
                  if (!sensor.removed) {
                      sensor.state = returnVal;
                      sensorHandler.drawSensor(sensor);
                  }
              });
          }
      }
      context.changeBoard = function(newboardname) {
          if (context.board == newboardname) return;
          var board = null;
          for(var i = 0; i < boardDefinitions.length; i++){
              board = boardDefinitions[i];
              if (board.name == newboardname) break;
          }
          if (board == null) return;
          context.board = newboardname;
          setSessionStorage('board', newboardname);
          if (infos.customSensors) {
              for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                  var sensor = _step.value;
                  sensor.removed = true;
              }
              context.sensorsList = new SensorCollection();
              if (board.builtinSensors) {
                  for(var i = 0; i < board.builtinSensors.length; i++){
                      var sensor1 = board.builtinSensors[i];
                      var newSensor = createSensor({
                          "type": sensor1.type,
                          "port": sensor1.port,
                          "builtin": true
                      }, context, strings);
                      if (sensor1.subType) {
                          newSensor.subType = sensor1.subType;
                      }
                      newSensor.name = getSensorSuggestedName(sensor1.type, sensor1.suggestedName);
                      newSensor.state = null;
                      newSensor.callsInTimeSlot = 0;
                      newSensor.lastTimeIncrease = 0;
                      context.sensorsList.add(newSensor);
                  }
              }
          } else {
              for(var _iterator1 = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step1; !(_step1 = _iterator1()).done;){
                  var sensor2 = _step1.value;
                  sensorAssignPort(sensor2);
              }
          }
          context.resetSensorTable();
          context.reset();
      };
      if (getSessionStorage('board')) context.changeBoard(getSessionStorage('board'));
      /**
       * This method allow us to save the sensors inside of the variable additional.
       * If other things must be saved from quickPi later, it can be saved inside of this variable.
       * @param additional The additional object saved inside of the xml
       */ context.saveAdditional = function(additional) {
          // we don't need to save sensors if user can't modify them
          if (!infos.customSensors) return;
          additional.quickpiSensors = [];
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var currentSensor = _step.value;
              var savedSensor = {
                  type: currentSensor.type,
                  port: currentSensor.port,
                  name: currentSensor.name
              };
              if (currentSensor.subType) savedSensor.subType = currentSensor.subType;
              additional.quickpiSensors.push(savedSensor);
          }
      };
      /**
       * This function loads all additional stuff from the object "additional" for quickpi.
       * For now on it only loads the sensor
       * @param additional The additional variable which contains the sensors
       */ context.loadAdditional = function(additional) {
          // we load sensors only if custom sensors is available
          if (!infos.customSensors) return;
          var newSensors = additional.quickpiSensors;
          // we don't verify if sensors are empty or not, because if they are it is maybe meant this
          // way by the user
          if (!newSensors) return;
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              sensor.removed = true;
          }
          context.sensorsList = new SensorCollection();
          for(var i = 0; i < newSensors.length; i++){
              var sensor1 = createSensor({
                  type: newSensors[i].type,
                  port: newSensors[i].port,
                  name: newSensors[i].name
              }, context, strings);
              if (newSensors[i].subType) sensor1.subType = newSensors[i].subType;
              sensor1.state = null;
              sensor1.callsInTimeSlot = 0;
              sensor1.lastTimeIncrease = 0;
              context.sensorsList.add(sensor1);
          }
          context.recreateDisplay = true;
          this.resetDisplay();
      };
      context.resetDisplay = function() {
          // console.log("resetDisplay")
          if (!context.display || !this.raphaelFactory) return;
          context.autoGrading = context.displayAutoGrading;
          if (context.recreateDisplay || !context.paper) {
              context.createDisplay();
              context.recreateDisplay = false;
          }
          context.paper.setSize($('#virtualSensors').width() * context.quickPiZoom, $('#virtualSensors').height());
          if (context.infos.quickPiBoard) {
              $('#virtualBoard').height($('#virtualSensors').height());
          }
          var area = context.paper.width * context.paper.height;
          context.compactLayout = false;
          if (area < 218700) {
              context.compactLayout = true;
          }
          if (context.sensorDivisions) {
              context.sensorDivisions.remove();
          }
          context.sensorDivisions = context.paper.set();
          // Fix this so we don't have to recreate this.
          if (context.timeLineCurrent) {
              context.timeLineCurrent.remove();
              context.timeLineCurrent = null;
          }
          if (context.timeLineCircle) {
              context.timeLineCircle.remove();
              context.timeLineCircle = null;
          }
          if (context.timeLineTriangle) {
              context.timeLineTriangle.remove();
              context.timeLineTriangle = null;
          }
          if (context.autoGrading) {
              if (context.sensorStates) context.sensorStates.remove();
              context.sensorStates = context.paper.set();
              //context.paper.clear(); // Do this for now.
              var numSensors = context.sensorsList.size();
              var sensorSize = Math.min(context.paper.height / numSensors * 0.80, $('#virtualSensors').width() / 10);
              //var sensorSize = Math.min(context.paper.height / (numSensors + 1));
              context.timeLineSlotHeight = Math.min(context.paper.height / (numSensors + 1));
              context.sensorSize = sensorSize * .90;
              context.timelineStartx = context.sensorSize * 3;
              var maxTime = context.maxTime;
              if (maxTime == 0) maxTime = 1000;
              if (!context.loopsForever) maxTime = Math.floor(maxTime * 1.05);
              context.pixelsPerTime = (context.paper.width - context.timelineStartx - 30) / maxTime;
              context.timeLineY = 25 + context.timeLineSlotHeight * context.sensorsList.size();
              var color = true;
              for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all().entries()), _step; !(_step = _iterator()).done;){
                  var _step_value = _step.value, iSensor = _step_value[0], sensor = _step_value[1];
                  sensor.drawInfo = {
                      x: 0,
                      y: 10 + context.timeLineSlotHeight * iSensor,
                      width: sensorSize * .90,
                      height: sensorSize * .90
                  };
                  var rect = context.paper.rect(0, sensor.drawInfo.y, context.paper.width, context.timeLineSlotHeight);
                  rect.attr({
                      "fill": color ? "#0000FF" : "#00FF00",
                      "stroke": "none",
                      "opacity": 0.03
                  });
                  context.sensorDivisions.push(rect);
                  color = !color;
              }
              drawTimeLine();
              for(var _iterator1 = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step1; !(_step1 = _iterator1()).done;){
                  var sensor1 = _step1.value;
                  sensorHandler.drawSensor(sensor1);
                  sensor1.timelinelastxlabel = 0;
                  if (context.gradingStatesBySensor.hasOwnProperty(sensor1.name)) {
                      var states = context.gradingStatesBySensor[sensor1.name];
                      var startTime = 0;
                      var lastState = null;
                      sensor1.lastAnalogState = null;
                      var state = void 0;
                      for(var iState = 0; iState < states.length; iState++){
                          state = states[iState];
                          drawSensorTimeLineState(sensor1, lastState, startTime, state.time, "expected", true);
                          startTime = state.time;
                          lastState = state.state;
                      }
                      drawSensorTimeLineState(sensor1, lastState, state.time, context.maxTime, "expected", true);
                      if (!context.loopsForever) drawSensorTimeLineState(sensor1, lastState, startTime, maxTime, "finnish", false);
                      sensor1.lastAnalogState = null;
                  }
              }
              for(var iState1 = 0; iState1 < context.timeLineStates.length; iState1++){
                  var timelinestate = context.timeLineStates[iState1];
                  drawSensorTimeLineState(timelinestate.sensor, timelinestate.state, timelinestate.startTime, timelinestate.endTime, timelinestate.type, true);
              }
          } else {
              var nSensors = context.sensorsList.size();
              for(var _iterator2 = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step2; !(_step2 = _iterator2()).done;){
                  var sensor2 = _step2.value;
                  var cellsAmount = sensorHandler.findSensorDefinition(sensor2).cellsAmount;
                  if (cellsAmount) {
                      nSensors += cellsAmount(context.paper) - 1;
                  }
              }
              if (nSensors < 4) nSensors = 4;
              var geometry = null;
              if (context.compactLayout) // geometry = squareSize(context.paper.width, context.paper.height, nSensors, 2);
              geometry = squareSize(context.paper.width, context.paper.height, nSensors, 1.5);
              else geometry = squareSize(context.paper.width, context.paper.height, nSensors, 1);
              // console.log(geometry)
              var nbRows = geometry.rows;
              var nbCol = geometry.cols;
              var cellW = context.paper.width / nbCol;
              var lineAttr = {
                  "stroke-width": 1,
                  "stroke": "black",
                  opacity: 0.1
              };
              var x1 = cellW * 0.2;
              var x2 = context.paper.width - cellW * 0.2;
              var iSensor1 = 0;
              for(var row = 0; row < nbRows; row++){
                  var y = geometry.size * row;
                  if (row > 0) {
                      var line = context.paper.path([
                          "M",
                          x1,
                          y,
                          "L",
                          x2,
                          y
                      ]);
                      context.sensorDivisions.push(line);
                      line.attr(lineAttr);
                  }
                  for(var col = 0; col < nbCol; col++){
                      var x = cellW * col;
                      // var y1 = y + geometry.size / 4;
                      var y1 = y;
                      // var y2 = y + geometry.size * 3 / 4;
                      var y2 = y + geometry.size;
                      var cells = 1;
                      var sensor3 = context.sensorsList.all()[iSensor1];
                      var cellsAmount1 = null;
                      if (sensor3) cellsAmount1 = sensorHandler.findSensorDefinition(sensor3).cellsAmount;
                      if (cellsAmount1) cells = cellsAmount1(context.paper);
                      // Particular case if we have a screen and only 2 columns, we can put the
                      // cells of the screen at 2 because the display is still good with it.
                      // I used rows, because I think that for geometry, rows and cols are reversed. You can try to change
                      // it and see the result in animal connecte.
                      if (sensor3 && sensor3.type === "screen" && cells > nbCol && cells == 3 && nbCol == 2) cells = 2;
                      if (col > 0) {
                          var line = context.paper.path([
                              "M",
                              x,
                              y1,
                              "V",
                              y2
                          ]).attr(lineAttr);
                          context.sensorDivisions.push(line);
                      }
                      var foundcols = false;
                      var bump = false;
                      while(!foundcols && !bump){
                          var colsleft = nbCol - col;
                          if (cells > colsleft) {
                              for(var iNewSensor = iSensor1 + 1; iNewSensor < context.sensorsList.size(); iNewSensor++){
                                  var newSensor = context.sensorsList.all()[iNewSensor];
                                  cells = 1;
                                  cellsAmount1 = sensorHandler.findSensorDefinition(newSensor).cellsAmount;
                                  if (cellsAmount1) cells = cellsAmount1(context.paper);
                                  if (cells == 1) {
                                      context.sensorsList.all()[iNewSensor] = sensor3;
                                      context.sensorsList.all()[iSensor1] = newSensor;
                                      sensor3 = newSensor;
                                      foundcols = true;
                                      break;
                                  }
                              }
                              bump = true;
                          } else {
                              foundcols = true;
                          }
                      }
                      if (bump) continue;
                      if (iSensor1 == context.sensorsList.size() && infos.customSensors) ; else if (context.sensorsList.all()[iSensor1]) {
                          col += cells - 1;
                          sensor3.drawInfo = {
                              x: x,
                              y: y,
                              width: cellW * cells,
                              height: geometry.size
                          };
                          sensorHandler.drawSensor(sensor3);
                      }
                      iSensor1++;
                  }
              }
          }
      };
      function installPythonCode(code) {
          if (context.runner) context.runner.stop();
          context.installing = true;
          $('#piinstallprogresss').show();
          $('#piinstallcheck').hide();
          context.quickPiConnection.installProgram(code, function() {
              context.justinstalled = true;
              $('#piinstallprogresss').hide();
              $('#piinstallcheck').show();
          });
      }
      function piInstallProgram() {
          context.blocklyHelper.reportValues = false;
          var python_code = context.generatePythonSensorTable();
          python_code += "\n\n";
          if (context.blocklyHelper.getCode) {
              python_code += context.blocklyHelper.getCode('python');
              python_code = python_code.replace("from quickpi import *", "");
              installPythonCode(python_code);
          } else {
              window.task.getAnswer(function(answer) {
                  python_code += JSON.parse(answer).easy.document.lines.join("\n");
                  python_code = python_code.replace("from quickpi import *", "");
                  installPythonCode(python_code);
              });
          }
      }
      // Reset the context's display
      context.createDisplay = function() {
          // Do something here
          //$('#grid').html('Display for the library goes here.');
          // Ask the parent to update sizes
          //context.blocklyHelper.updateSize();
          //context.updateScale();
          if (!context.display || !this.raphaelFactory) return;
          var connectionHTML = "<div id=\"piui\" class='hide' >" + // "   <button type=\"button\" id=\"piconnect\" class=\"btn\">" +
          // // "       <span class=\"fa fa-wifi\"></span><span id=\"piconnecttext\" class=\"btnText\">" + strings.messages.connect + "</span> " +
          // "       <span class=\"fas fa-exchange-alt\"></span><span id=\"piconnecttext\" class=\"btnText\">" + strings.messages.connect + "</span> " +
          // "   </button>" +
          // "   <span id=\"piinstallui\">" +
          // "       <span class=\"fa fa-exchange-alt\"></span>" +
          // "       <button type=\"button\" id=\"piinstall\" class=\"btn\">" +
          // "           <span class=\"fa fa-upload\"></span><span>" + strings.messages.install + "</span><span id=piinstallprogresss class=\"fas fa-spinner fa-spin\"></span><span id=\"piinstallcheck\" class=\"fa fa-check\"></span>" +
          // "       </button>" +
          // "   </span>" +
          "   <div id=\"dropdown_menu\">" + "       <span class='menu_line' id='toggle_menu'><span class=\"fas fa-exchange-alt\"></span><span class='label'>" + strings.messages.simulator + "</span></span>" + "       <span class='menu_line clickable' id='simulator'><span class=\"fas fa-desktop\"></span><span class='label'>" + strings.messages.simulator + "</span></span>" + "       <span class='menu_line clickable' id='remote_control'><span class=\"fas fa-plug\"></span><span class='label'>" + strings.messages.remoteControl + "</span></span>" + "       <span class='menu_line clickable' id='install'><span class=\"fas fa-upload\"></span><span class='label'>" + strings.messages.install + "</span></span>" + "   </div>" + "   <span id=\"pichangehatui\">" + "       <button type=\"button\" id=\"pichangehat\" class=\"btn\">" + // "           <span class=\"fas fa-hat-wizard\"></span><span>" + strings.messages.changeBoard + "</span></span></span>" +
          "           <span class=\"fas fa-cog\"></span>" + "       </button>" + // "       <button type=\"button\" id=\"pihatsetup\" class=\"btn\">" +
          // "           <span class=\"fas fa-cog\"></span><span>" + strings.messages.config + "</span></span></span>" +
          // "       </button>" +
          "   </span>" + "</div>";
          var piUi = getQuickPiOption('disableConnection') ? '' : connectionHTML;
          var hasIntroControls = $('#taskIntro').find('#introControls').length;
          if (!hasIntroControls) {
              $('#taskIntro').append("<div id=\"introControls\"></div>");
          }
          $('#introControls').html(piUi);
          $('#taskIntro').addClass('piui');
          $('#grid').html("<div id=\"virtualBoard\"></div><div id=\"virtualSensors\" style=\"height: 100%; width: 100%;\">" + "</div>");
          if (!context.quickPiZoom || !context.autoGrading) context.quickPiZoom = 1;
          if ([
              "galaxia",
              "microbit"
          ].includes(context.infos.quickPiBoard)) {
              var onUserEvent = function onUserEvent(sensorName, state) {
                  var sensor = sensorHandler.findSensorByName(sensorName);
                  if (!sensor) {
                      return;
                  }
                  sensor.state = state;
                  sensorHandler.warnClientSensorStateChanged(sensor);
                  sensorHandler.drawSensor(sensor);
              };
              if (context.autoGrading) {
                  $('#virtualBoard').hide();
              } else {
                  $('#grid').css('display', 'flex');
                  if (context.infos.quickPiBoard == "microbit") {
                      $('#grid').css('flex-direction', 'column');
                      $('#virtualBoard').css('flex', '0 0 200px').css('height', '200px');
                  } else {
                      $('#virtualBoard').css('flex', '1 0 40%').css('margin-right', '20px');
                  }
              }
              context.sensorStateListener = mainBoard.init('#virtualBoard', onUserEvent);
          }
          this.raphaelFactory.destroyAll();
          context.paper = this.raphaelFactory.create("paperMain", "virtualSensors", $('#virtualSensors').width() * context.quickPiZoom, $('#virtualSensors').height());
          if (context.autoGrading) {
              $('#virtualSensors').css("overflow-y", "hidden");
              $('#virtualSensors').css("overflow-x", "auto");
              // Allow horizontal zoom on grading
              context.paper.canvas.onwheel = function(event) {
                  var originalzoom = context.quickPiZoom;
                  context.quickPiZoom += event.deltaY * -0.001;
                  if (context.quickPiZoom < 1) context.quickPiZoom = 1;
                  if (originalzoom != context.quickPiZoom) context.resetDisplay();
              };
              $('#virtualSensors').scroll(function() {
                  for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                      var sensor = _step.value;
                      sensorHandler.drawSensor(sensor);
                  }
              });
          } else {
              $('#virtualSensors').css("overflow-y", "hidden");
              $('#virtualSensors').css("overflow", "hidden");
          }
          if (infos.quickPiSensors == "default") {
              context.sensorsList = new SensorCollection();
              addDefaultBoardSensors();
          }
          if (context.blocklyHelper) {
              context.blocklyHelper.updateSize();
          }
          context.inUSBConnection = false;
          context.inBTConnection = false;
          context.releasing = false;
          context.offLineMode = true;
          showasReleased();
          if (context.quickPiConnection.isConnecting()) {
              showasConnecting(context);
          }
          if (context.quickPiConnection.isConnected()) {
              showasConnected();
              context.offLineMode = false;
          }
          var showConfigSettings = {
              context: context,
              strings: strings,
              mainBoard: mainBoard
          };
          var showMenu = false;
          $('#toggle_menu, #simulator').click(function() {
              showMenu = !showMenu;
              updateMenu();
          });
          $("#dropdown_menu #remote_control").click(function() {
              if (!context.quickPiConnection.isConnected()) {
                  showConfig(showConfigSettings);
              } else {
                  showasConnected();
                  context.offLineMode = false;
              }
          });
          $("#dropdown_menu #install").click(function() {
              if (!context.quickPiConnection.isConnected()) {
                  showConfig(showConfigSettings);
              } else {
                  piInstallProgram();
              }
          });
          $('#pichangehat').click(function() {
              showConfig(showConfigSettings);
          });
          function updateMenu() {
              if (showMenu) {
                  $("#piui").addClass("show");
                  $("#piui").removeClass("hide");
              } else {
                  $("#piui").addClass("hide");
                  $("#piui").removeClass("show");
              }
          }
          // $('#pichangehat').click(function () {
          //     console.log("chooseBoard")
          //     window.displayHelper.showPopupDialog("<div class=\"content connectPi qpi\">" +
          //         "   <div class=\"panel-heading\">" +
          //         "       <h2 class=\"sectionTitle\">" +
          //         "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
          //                     strings.messages.chooseBoard +
          //         "       </h2>" +
          //         "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
          //         "   </div>" +
          //         "   <div class=\"panel-body\">" +
          //         "       <div id=boardlist>" +
          //         "       </div>" +
          //         "       <div panel-body-usbbt>" +
          //         "           <label id=\"piconnectionlabel\"></label>" +
          //         "       </div>" +
          //         "   </div>" +
          //         "</div>");
          //     $('#picancel').click(function () {
          //         $('#popupMessage').hide();
          //         window.displayHelper.popupMessageShown = false;
          //     });
          //     for (var i = 0; i < boardDefinitions.length; i++) {
          //         let board = boardDefinitions[i];
          //         var image = document.createElement('img');
          //         image.src = getImg(board.image);
          //         $('#boardlist').append(image).append("&nbsp;&nbsp;");
          //         image.onclick = function () {
          //             $('#popupMessage').hide();
          //             window.displayHelper.popupMessageShown = false;
          //             context.changeBoard(board.name);
          //         }
          //     }
          // });
          $('#pihatsetup').click(function() {
              window.displayHelper.showPopupDialog("<div class=\"content connectPi qpi\">" + "   <div class=\"panel-heading\">" + "       <h2 class=\"sectionTitle\">" + "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" + strings.messages.nameandports + "       </h2>" + "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" + "   </div>" + "   <div class=\"panel-body\">" + "       <table id='sensorTable' style=\"display:table-header-group;\">" + "           <tr>" + "               <th>" + strings.messages.name + "</th>" + "               <th>" + strings.messages.port + "</th>" + "               <th>" + strings.messages.state + "</th>" + "           </tr>" + "       </table>" + "   <!--" + "       <div>" + "           <input type=\"checkbox\" id=\"buzzeraudio\" value=\"buzzeron\"> Output audio trought audio buzzer<br>" + "       </div>" + "       <div class=\"inlineButtons\">" + "           <button id=\"pisetupok\" class=\"btn\"><i class=\"fas fa-cog icon\"></i>Set</button>" + "       </div>" + "   -->" + "   </div>" + "</div>", function() {
                  var table = document.getElementById("sensorTable");
                  for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                      var sensor = _step.value;
                      var addNewRow = function addNewRow() {
                          var row = table.insertRow();
                          var type = row.insertCell();
                          var name = row.insertCell();
                          var port = row.insertCell();
                          return [
                              type,
                              name,
                              port
                          ];
                      };
                      if (sensor.type == "stick") {
                          var gpios = sensorHandler.findSensorDefinition(sensor).gpios;
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name + ".up"));
                          cols[2].appendChild(document.createTextNode("D" + gpios[0]));
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name + ".down"));
                          cols[2].appendChild(document.createTextNode("D" + gpios[1]));
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name + ".left"));
                          cols[2].appendChild(document.createTextNode("D" + gpios[2]));
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name + ".right"));
                          cols[2].appendChild(document.createTextNode("D" + gpios[3]));
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name + ".center"));
                          cols[2].appendChild(document.createTextNode("D" + gpios[4]));
                      /*
                              $('#stickupname').text(sensor.name + ".up");

                              $('#stickdownname').text(sensor.name + ".down");
                              $('#stickleftname').text(sensor.name + ".left");
                              $('#stickrightname').text(sensor.name + ".right");
                              $('#stickcentername').text(sensor.name + ".center");

                              $('#stickupport').text("D" + gpios[0]);
                              $('#stickdownport').text("D" + gpios[1]);
                              $('#stickleftport').text("D" + gpios[2]);
                              $('#stickrightport').text("D" + gpios[3]);
                              $('#stickcenterport').text("D" + gpios[4]);

                              $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                              $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                              $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                              $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                              $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");
          */ } else {
                          var cols = addNewRow();
                          cols[0].appendChild(document.createTextNode(sensor.type));
                          cols[1].appendChild(document.createTextNode(sensor.name));
                          cols[2].appendChild(document.createTextNode(sensor.port));
                      }
                  }
                  $('#picancel').click(function() {
                      $('#popupMessage').hide();
                      window.displayHelper.popupMessageShown = false;
                  });
              });
          });
          $('#piinstall').click(piInstallProgram);
          if (parseInt(getSessionStorage('autoConnect'))) {
              if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                  $('#piconnect').attr('disabled', 'disabled');
                  context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
              }
          }
      };
      function addDefaultBoardSensors() {
          var board = mainBoard.getCurrentBoard(context.board);
          var boardDefaultSensors = board.default;
          if (!boardDefaultSensors) boardDefaultSensors = board.builtinSensors;
          if (boardDefaultSensors) {
              for(var i = 0; i < boardDefaultSensors.length; i++){
                  var sensor = boardDefaultSensors[i];
                  var newSensor = createSensor({
                      "type": sensor.type,
                      "port": sensor.port,
                      "builtin": true
                  }, context, strings);
                  if (sensor.subType) {
                      newSensor.subType = sensor.subType;
                  }
                  newSensor.name = getSensorSuggestedName(sensor.type, sensor.suggestedName);
                  newSensor.state = null;
                  newSensor.callsInTimeSlot = 0;
                  newSensor.lastTimeIncrease = 0;
                  context.sensorsList.add(newSensor);
              }
              var newSensor1 = createSensor({
                  type: "cloudstore",
                  name: "cloud1",
                  port: "D5"
              }, context, strings);
              context.sensorsList.add(newSensor1);
          }
          if (infos.customSensors) ;
      // console.log(infos.quickPiSensors)
      }
      // Straight from stack overflow :)
      function squareSize(x, y, n, ratio) {
          // Compute number of rows and columns, and cell size
          ratio = x / y * ratio;
          // console.log(ratio)
          var ncols_float = Math.sqrt(n * ratio);
          var nrows_float = n / ncols_float;
          // Find best option filling the whole height
          var nrows1 = Math.ceil(nrows_float);
          var ncols1 = Math.ceil(n / nrows1);
          while(nrows1 * ratio < ncols1){
              nrows1++;
              ncols1 = Math.ceil(n / nrows1);
          }
          var cell_size1 = y / nrows1;
          // Find best option filling the whole width
          var ncols2 = Math.ceil(ncols_float);
          var nrows2 = Math.ceil(n / ncols2);
          while(ncols2 < nrows2 * ratio){
              ncols2++;
              nrows2 = Math.ceil(n / ncols2);
          }
          var cell_size2 = x / ncols2;
          // Find the best values
          var nrows, ncols, cell_size;
          if (cell_size1 < cell_size2) {
              nrows = nrows2;
              ncols = ncols2;
              cell_size = cell_size2;
          } else {
              nrows = nrows1;
              ncols = ncols1;
              cell_size = cell_size1;
          }
          return {
              cols: ncols,
              rows: nrows,
              size: cell_size
          };
      }
      function showasConnected() {
          $('#piconnectprogress').hide();
          $('#piinstallcheck').hide();
          $('#piinstallprogresss').hide();
          $('#piinstallui').show();
          if (context.board == "quickpi") $('#pihatsetup').show();
          else $('#pihatsetup').hide();
          $('#piconnect').css('background-color', '#F9A423');
          $('#piinstall').css('background-color', "#488FE1");
          $('#piconnecttext').hide();
          if (context.sensorStateListener) {
              context.sensorStateListener('connected');
          }
      }
      function showasReleased() {
          $('#piconnectprogress').hide();
          $('#piinstallcheck').hide();
          $('#piinstallprogresss').hide();
          $('#piinstallui').hide();
          $('#pihatsetup').hide();
          $('#piconnect').css('background-color', '#F9A423');
          $('#piconnecttext').show();
          if (context.sensorStateListener) {
              context.sensorStateListener('disconnected');
          }
      }
      function showasDisconnected() {
          $('#piconnectprogress').hide();
          $('#piinstallcheck').hide();
          $('#piinstallprogresss').hide();
          $('#piinstall').css('background-color', 'gray');
          $('#piconnect').css('background-color', 'gray');
          $('#piconnecttext').hide();
          if (context.sensorStateListener) {
              context.sensorStateListener('disconnected');
          }
      }
      function raspberryPiConnected() {
          showasConnected();
          context.resetSensorTable();
          context.quickPiConnection.startNewSession();
          context.liveUpdateCount = 0;
          context.offLineMode = false;
          setSessionStorage('autoConnect', "1");
          context.recreateDisplay = true;
          context.resetDisplay();
          /// Connect Dialog
          $("#piconnectprogressicon").hide();
          $("#piconnectwifiicon").show();
          $("#pirelease").attr('disabled', null);
          startSensorPollInterval();
      }
      function raspberryPiDisconnected(wasConnected, wrongversion) {
          if (context.releasing || !wasConnected) {
              showasReleased();
          } else {
              showasDisconnected();
          }
          window.task.displayedSubTask.context.offLineMode = true;
          if (context.quickPiConnection.wasLocked()) {
              window.displayHelper.showPopupMessage(strings.messages.piPlocked, 'blanket');
          } else if (wrongversion) {
              window.displayHelper.showPopupMessage(strings.messages.wrongVersion, 'blanket');
          } else if (!context.releasing && !wasConnected) {
              window.displayHelper.showPopupMessage(strings.messages.cantConnect, 'blanket');
          } else if (wasConnected) {
              window.displayHelper.showPopupMessage(strings.messages.cardDisconnected, 'blanket');
              context.releasing = true;
              showasReleased();
          }
          clearSensorPollInterval();
          if (wasConnected && !context.releasing && !context.quickPiConnection.wasLocked() && !wrongversion) {
              context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
          } else {
              // If I was never connected don't attempt to autoconnect again
              setSessionStorage('autoConnect', "0");
              window.task.displayedSubTask.context.resetDisplay();
          }
          /// Dialog
          $("#pirelease").attr('disabled', 'disabled');
          $("#piconnectok").attr('disabled', null);
      }
      function raspberryPiChangeBoard(board) {
          if (board != "unknow") {
              window.task.displayedSubTask.context.changeBoard(board);
              window.task.displayedSubTask.context.resetSensorTable();
          }
      }
      // Update the context's display to the new scale (after a window resize for instance)
      context.updateScale = function() {
          if (!context.display) {
              return;
          }
          var width = $('#virtualSensors').width();
          var height = $('#virtualSensors').height();
          if (!context.oldwidth || !context.oldheight || context.oldwidth != width || context.oldheight != height) {
              context.oldwidth = width;
              context.oldheight = height;
              context.resetDisplay();
          }
      };
      // When the context is unloaded, this function is called to clean up
      // anything the context may have created
      context.unload = function() {
          // Do something here
          clearSensorPollInterval();
          if (context.display) ;
          for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
              var sensor = _step.value;
              sensor.removed = true;
          }
      };
      function drawTimeLine() {
          if (context.paper == undefined || !context.display) return;
          if (context.timelineText) for(var i = 0; i < context.timelineText.length; i++){
              context.timelineText[i].remove();
          }
          context.timelineText = [];
          var timelinewidth = context.maxTime * context.pixelsPerTime;
          var pixelsPerTick = 50;
          var numberofTicks = timelinewidth / pixelsPerTick;
          var step = context.maxTime / numberofTicks;
          if (step > 1000) {
              step = Math.round(step / 1000) * 1000;
          } else if (step > 500) {
              step = Math.round(step / 500) * 500;
          } else if (step > 100) {
              step = Math.round(step / 100) * 100;
          } else if (step > 10) {
              step = Math.round(step / 10) * 10;
          }
          var i = 0;
          var textStart = 0;
          var timelabel = context.paper.text(textStart, context.timeLineY, strings.messages.timeLabel);
          timelabel.attr({
              "font-size": "10px",
              'text-anchor': 'start',
              'font-weight': 'bold',
              fill: "gray"
          });
          context.timelineText.push(timelabel);
          timelabel.node.style.MozUserSelect = "none";
          timelabel.node.style.WebkitUserSelect = "none";
          var bbox = timelabel.getBBox();
          textStart = bbox.x + bbox.width + 3;
          var timelabel = context.paper.text(textStart, context.timeLineY, '\uf00e');
          timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
          timelabel.node.style.fontWeight = "bold";
          timelabel.node.style.MozUserSelect = "none";
          timelabel.node.style.WebkitUserSelect = "none";
          timelabel.attr({
              "font-size": "20" + "px",
              'text-anchor': 'start',
              'font-weight': 'bold',
              'fill': "#4A90E2"
          });
          context.timelineText.push(timelabel);
          timelabel.click(function() {
              var originalzoom = context.quickPiZoom;
              context.quickPiZoom += 0.3;
              if (context.quickPiZoom < 1) context.quickPiZoom = 1;
              if (originalzoom != context.quickPiZoom) context.resetDisplay();
          });
          var bbox = timelabel.getBBox();
          textStart = bbox.x + bbox.width + 3;
          var timelabel = context.paper.text(textStart, context.timeLineY, '\uf010');
          timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
          timelabel.node.style.fontWeight = "bold";
          timelabel.node.style.MozUserSelect = "none";
          timelabel.node.style.WebkitUserSelect = "none";
          timelabel.attr({
              "font-size": "20" + "px",
              'text-anchor': 'start',
              'font-weight': 'bold',
              'fill': "#4A90E2"
          });
          context.timelineText.push(timelabel);
          timelabel.click(function() {
              var originalzoom = context.quickPiZoom;
              context.quickPiZoom -= 0.3;
              if (context.quickPiZoom < 1) context.quickPiZoom = 1;
              if (originalzoom != context.quickPiZoom) context.resetDisplay();
          });
          for(; i <= context.maxTime; i += step){
              var x = context.timelineStartx + i * context.pixelsPerTime;
              var labelText = (i / 1000).toFixed(2);
              if (step >= 1000) labelText = (i / 1000).toFixed(0);
              var timelabel = context.paper.text(x, context.timeLineY, labelText);
              timelabel.attr({
                  "font-size": "15px",
                  'text-anchor': 'center',
                  'font-weight': 'bold',
                  fill: "gray"
              });
              timelabel.node.style = "-moz-user-select: none; -webkit-user-select: none;";
              context.timelineText.push(timelabel);
              var timelinedivisor = context.paper.path([
                  "M",
                  x,
                  0,
                  "L",
                  x,
                  context.timeLineY
              ]);
              timelinedivisor.attr({
                  "stroke-width": 1,
                  "stroke": "lightgray",
                  "opacity": 0.2,
                  'z-index': 100
              });
              context.sensorStates.push(timelinedivisor);
          }
          if (!context.timeLineHoverLine || sensorHandler.isElementRemoved(context.timeLineHoverLine)) {
              context.timeLineHoverLine = context.paper.rect(0, 0, 0, 0);
          }
          context.timeLineHoverLine.attr({
              "stroke": "blue",
              "opacity": 0
          });
          if (context.timeLineHoverPath) {
              context.timeLineHoverPath.remove();
          }
          context.timeLineHoverPath = context.paper.rect(context.timelineStartx, 0, context.maxTime * context.pixelsPerTime, context.timeLineY);
          context.timeLineHoverPath.attr({
              "fill": "lightgray",
              "stroke": "none",
              "opacity": 0.0
          });
          context.timeLineHoverPath.mousemove(function(event) {
              if (context.runner && context.runner.isRunning()) return;
              $('#screentooltip').remove();
              var scrolloffset = $('#virtualSensors').scrollLeft();
              var ms = (event.clientX + scrolloffset - context.timelineStartx) / context.pixelsPerTime;
              ms = Math.round(ms);
              if (ms < -4) return;
              if (ms < 0) ms = 0;
              $("body").append('<div id="screentooltip"></div>');
              $('#screentooltip').css("position", "absolute");
              $('#screentooltip').css("border", "1px solid gray");
              $('#screentooltip').css("background-color", "#efefef");
              $('#screentooltip').css("padding", "3px");
              $('#screentooltip').css("z-index", "1000");
              $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);
              $('#screentooltip').text(ms.toString() + "ms");
              for(var sensorName in context.gradingStatesBySensor){
                  // Cycle through each sensor from the grading states
                  var sensor = sensorHandler.findSensorByName(sensorName);
                  sensorHandler.findSensorDefinition(sensor);
                  var expectedStates = context.gradingStatesBySensor[sensorName];
                  if (!expectedStates.length) {
                      continue;
                  }
                  context.actualStatesBySensor[sensorName];
                  var currentSensorState = null;
                  // Check that we went through all expected states
                  for(var i = 0; i < context.gradingStatesBySensor[sensorName].length; i++){
                      var expectedState = context.gradingStatesBySensor[sensorName][i];
                      if (expectedState.time >= ms) {
                          break;
                      }
                      currentSensorState = expectedState;
                  }
                  if (currentSensorState) {
                      sensor.state = currentSensorState.state;
                      sensorHandler.drawSensor(sensor);
                  }
              }
              context.timeLineHoverLine.attr({
                  "x": event.clientX + scrolloffset,
                  "y": 0,
                  "width": 1,
                  "height": context.timeLineY,
                  "stroke-width": 4,
                  "stroke": "blue",
                  "opacity": 0.2,
                  "stroke-linecap": "square",
                  "stroke-linejoin": "round"
              });
          });
          context.timeLineHoverPath.mouseout(function() {
              if (context.runner && context.runner.isRunning()) return;
              context.timeLineHoverLine.attr({
                  "opacity": 0.0
              });
              $('#screentooltip').remove();
              context.resetSensors();
              for(var _iterator = _create_for_of_iterator_helper_loose$1(context.sensorsList.all()), _step; !(_step = _iterator()).done;){
                  var sensor = _step.value;
                  sensorHandler.drawSensor(sensor);
              }
          });
          if (!context.loopsForever) {
              var endx = context.timelineStartx + context.maxTime * context.pixelsPerTime;
              var x = context.timelineStartx + i * context.pixelsPerTime;
              var timelabel = context.paper.text(x, context.timeLineY, '\uf11e');
              timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
              timelabel.node.style.fontWeight = "bold";
              timelabel.node.style.MozUserSelect = "none";
              timelabel.node.style.WebkitUserSelect = "none";
              timelabel.attr({
                  "font-size": "20" + "px",
                  'text-anchor': 'middle',
                  'font-weight': 'bold',
                  fill: "gray"
              });
              context.timelineText.push(timelabel);
              if (context.timeLineEndLine) context.timeLineEndLine.remove();
              context.timeLineEndLine = context.paper.path([
                  "M",
                  endx,
                  0,
                  "L",
                  endx,
                  context.timeLineY
              ]);
              if (context.endFlagEnd) context.endFlagEnd.remove();
              context.endFlagEnd = context.paper.rect(endx, 0, x, context.timeLineY + 10);
              context.endFlagEnd.attr({
                  "fill": "lightgray",
                  "stroke": "none",
                  "opacity": 0.2
              });
          }
      /*
                  context.paper.path(["M", context.timelineStartx,
                      context.paper.height - context.sensorSize * 3 / 4,
                      "L", context.paper.width,
                      context.paper.height - context.sensorSize * 3 / 4]);
          */ }
      function drawCurrentTime() {
          if (!context.paper || !context.display || isNaN(context.currentTime)) return;
          /*
          if (context.currentTimeText)
              context.currentTimeText.remove();

          context.currentTimeText = context.paper.text(0, context.paper.height - 40, context.currentTime.toString() + "ms");
          context.currentTimeText.attr({
              "font-size": "10px",
              'text-anchor': 'start'
          });            */ if (!context.autoGrading) return;
          var animationSpeed = 200; // ms
          var startx = context.timelineStartx + context.currentTime * context.pixelsPerTime;
          var targetpath = [
              "M",
              startx,
              0,
              "L",
              startx,
              context.timeLineY
          ];
          if (context.timeLineCurrent) {
              context.timeLineCurrent.animate({
                  path: targetpath
              }, animationSpeed);
          } else {
              context.timeLineCurrent = context.paper.path(targetpath);
              context.timeLineCurrent.attr({
                  "stroke-width": 5,
                  "stroke": "#678AB4",
                  "stroke-linecap": "round"
              });
          }
          if (context.timeLineCircle) {
              context.timeLineCircle.animate({
                  cx: startx
              }, animationSpeed);
          } else {
              context.timeLineCircle = context.paper.circle(startx, context.timeLineY, 10);
              context.timeLineCircle.attr({
                  "fill": "white",
                  "stroke": "#678AB4"
              });
          }
          var trianglew = 10;
          var targetpath = [
              "M",
              startx,
              0,
              "L",
              startx + trianglew,
              0,
              "L",
              startx,
              trianglew,
              "L",
              startx - trianglew,
              0,
              "L",
              startx,
              0
          ];
          if (context.timeLineTriangle) {
              context.timeLineTriangle.animate({
                  path: targetpath
              }, animationSpeed);
          } else {
              context.timeLineTriangle = context.paper.path(targetpath);
              context.timeLineTriangle.attr({
                  "fill": "#678AB4",
                  "stroke": "#678AB4"
              });
          }
      }
      function storeTimeLineState(sensor, state, startTime, endTime, type) {
          var found = false;
          var timelinestate = {
              sensor: sensor,
              state: state,
              startTime: startTime,
              endTime: endTime,
              type: type
          };
          for(var i = 0; i < context.timeLineStates.length; i++){
              var currenttlstate = context.timeLineStates[i];
              if (currenttlstate.sensor == sensor && currenttlstate.startTime == startTime && currenttlstate.endTime == endTime && currenttlstate.type == type) {
                  context.timeLineStates[i] = timelinestate;
                  found = true;
                  break;
              }
          }
          if (!found) {
              context.timeLineStates.push(timelinestate);
          }
      }
      function drawSensorTimeLineState(sensor, state, startTime, endTime, type, skipsave, expectedState) {
          if (skipsave === void 0) skipsave = false;
          if (expectedState === void 0) expectedState = null;
          if (!skipsave) {
              storeTimeLineState(sensor, state, startTime, endTime, type);
          }
          if (context.paper == undefined || !context.display || !context.autoGrading) return;
          var startx = context.timelineStartx + startTime * context.pixelsPerTime;
          var stateLenght = (endTime - startTime) * context.pixelsPerTime;
          var ypositionmiddle = sensor.drawInfo.y + context.timeLineSlotHeight * .5;
          var ypositiontop = sensor.drawInfo.y;
          var ypositionbottom = sensor.drawInfo.y + context.timeLineSlotHeight;
          var color = "green";
          var strokewidth = 4;
          if (type == "expected" || type == "finnish") {
              color = "lightgrey";
              strokewidth = 8;
          } else if (type == "wrong") {
              color = "red";
              strokewidth = 4;
          } else if (type == "actual") {
              color = "yellow";
              strokewidth = 4;
          }
          var isAnalog = sensorHandler.findSensorDefinition(sensor).isAnalog;
          var percentage = +state;
          var drawnElements = [];
          var deleteLastDrawnElements = true;
          var drawParameters = {
              color: color,
              deleteLastDrawnElements: deleteLastDrawnElements,
              startx: startx,
              strokewidth: strokewidth,
              ypositionmiddle: ypositionmiddle,
              drawnElements: drawnElements,
              ypositiontop: ypositiontop,
              stateLenght: stateLenght,
              startTime: startTime,
              endTime: endTime
          };
          if (sensor.drawTimelineState) {
              sensor.drawTimelineState(sensorHandler, state, expectedState, type, drawParameters);
          } else if (isAnalog || sensor.showAsAnalog) {
              var offset = (ypositionbottom - ypositiontop) * sensorHandler.findSensorDefinition(sensor).getPercentageFromState(state, sensor);
              if (type == "wrong") {
                  color = "red";
                  ypositionmiddle += 4;
              } else if (type == "actual") {
                  color = "yellow";
                  ypositionmiddle += 4;
              }
              if (sensor.lastAnalogState != null && sensor.lastAnalogState != state) {
                  var oldStatePercentage = sensorHandler.findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState, sensor);
                  var previousOffset = (ypositionbottom - ypositiontop) * oldStatePercentage;
                  var joinline = context.paper.path([
                      "M",
                      startx,
                      ypositiontop + offset,
                      "L",
                      startx,
                      ypositiontop + previousOffset
                  ]);
                  joinline.attr({
                      "stroke-width": strokewidth,
                      "stroke": color,
                      "stroke-linejoin": "round",
                      "stroke-linecap": "round"
                  });
                  context.sensorStates.push(joinline);
                  if (!sensor.timelinelastxlabel) sensor.timelinelastxlabel = 0;
                  if (!sensor.timelinelastxlabel) sensor.timelinelastxlabel = 0;
                  if (startx - sensor.timelinelastxlabel > 5) {
                      var sensorDef = sensorHandler.findSensorDefinition(sensor);
                      var stateText = state.toString();
                      if (sensorDef && sensorDef.getStateString) {
                          stateText = sensorDef.getStateString(state);
                      }
                      var y = 0;
                      if (sensor.timelinestateup) {
                          y = ypositiontop + offset - 10;
                          sensor.timelinestateup = false;
                      } else {
                          y = ypositiontop + offset + 10;
                          sensor.timelinestateup = true;
                      }
                      var paperText = context.paper.text(startx, y, stateText);
                      drawParameters.drawnElements.push(paperText);
                      context.sensorStates.push(paperText);
                      sensor.timelinelastxlabel = startx;
                  }
              }
              sensor.lastAnalogState = state == null ? 0 : state;
              var stateline = context.paper.path([
                  "M",
                  startx,
                  ypositiontop + offset,
                  "L",
                  startx + stateLenght,
                  ypositiontop + offset
              ]);
              stateline.attr({
                  "stroke-width": strokewidth,
                  "stroke": color,
                  "stroke-linejoin": "round",
                  "stroke-linecap": "round"
              });
              drawParameters.drawnElements.push(stateline);
              context.sensorStates.push(stateline);
          } else if (percentage != 0) {
              if (type == "wrong" || type == "actual") {
                  ypositionmiddle += 2;
              }
              if (type == "expected") {
                  var c = context.paper.rect(startx, ypositionmiddle, stateLenght, strokewidth);
                  c.attr({
                      "stroke": "none",
                      "fill": color
                  });
              } else {
                  var c = context.paper.rect(startx, ypositionmiddle, 0, strokewidth);
                  c.attr({
                      "stroke": "none",
                      "fill": color
                  });
                  c.animate({
                      width: stateLenght
                  }, 200);
              }
              drawParameters.drawnElements.push(c);
              context.sensorStates.push(c);
          }
          if (type == 'actual' || type == 'wrong') {
              if (!sensor.drawnGradingElements) {
                  sensor.drawnGradingElements = [];
              } else if (drawParameters.deleteLastDrawnElements) {
                  for(var i = 0; i < sensor.drawnGradingElements.length; i++){
                      var dge = sensor.drawnGradingElements[i];
                      if (dge.time >= startTime) {
                          for(var j = 0; j < dge.elements.length; j++){
                              dge.elements[j].remove();
                          }
                          sensor.drawnGradingElements.splice(i, 1);
                          i -= 1;
                      }
                  }
              }
              if (drawParameters.drawnElements.length) {
                  sensor.drawnGradingElements.push({
                      time: startTime,
                      elements: drawParameters.drawnElements
                  });
              }
          }
          // Make sure the current time bar is always on top of states
          drawCurrentTime();
      }
      context.sensorsSaved = {};
      context.registerQuickPiEvent = function(name, newState, setInSensor, allowFail) {
          if (setInSensor === void 0) setInSensor = true;
          if (allowFail === void 0) allowFail = false;
          var sensor = sensorHandler.findSensorByName(name);
          if (!sensor) {
              context.success = false;
              throw strings.messages.sensorNotFound.format(name);
          }
          if (setInSensor) {
              sensor.state = newState;
              sensorHandler.drawSensor(sensor);
          }
          if (context.autoGrading && context.gradingStatesBySensor != undefined && !allowFail) {
              if (!context.actualStatesBySensor[name]) {
                  context.actualStatesBySensor[name] = [];
              }
              var actualStates = context.actualStatesBySensor[name];
              var lastRealState = actualStates.length > 0 ? actualStates[actualStates.length - 1] : null;
              if (lastRealState) {
                  if (lastRealState.time == context.currentTime) {
                      lastRealState.state = newState;
                  } else {
                      actualStates.push({
                          time: context.currentTime,
                          state: newState
                      });
                  }
              } else {
                  actualStates.push({
                      time: context.currentTime,
                      state: newState
                  });
              }
              drawNewStateChangesSensor(name, newState);
              context.increaseTime(sensor);
          }
      };
      function drawNewStateChangesSensor(name, newState) {
          if (newState === void 0) newState = null;
          var sensor = sensorHandler.findSensorByName(name);
          if (!sensor) {
              context.success = false;
              throw strings.messages.sensorNotFound.format(name);
          }
          var sensorDef = sensorHandler.findSensorDefinition(sensor);
          if (sensor.lastDrawnState !== null) {
              // Get all states between the last drawn time and now
              var expectedStates = context.getSensorExpectedState(name, sensor.lastDrawnTime, context.currentTime);
              for(var i = 0; expectedStates && i < expectedStates.length; i++){
                  // Draw the line up to the next expected state
                  var expectedState = expectedStates[i];
                  var nextTime = i + 1 < expectedStates.length ? expectedStates[i + 1].time : context.currentTime;
                  var type = "actual";
                  // Check the previous state
                  if (!sensorDef.compareState(sensor.lastDrawnState, expectedState.state)) {
                      type = "wrong";
                  }
                  drawSensorTimeLineState(sensor, sensor.lastDrawnState, sensor.lastDrawnTime, nextTime, type, false, expectedState.state);
                  sensor.lastDrawnTime = nextTime;
              }
          }
          sensor.lastDrawnTime = context.currentTime;
          if (newState !== null && sensor.lastDrawnState != newState) {
              // Draw the new state change
              if (sensor.lastDrawnState === null) {
                  sensor.lastDrawnState = newState;
              }
              var type = "actual";
              // Check the new state
              var expectedState = context.getSensorExpectedState(name, context.currentTime);
              if (expectedState !== null && !sensorDef.compareState(newState, expectedState.state)) {
                  type = "wrong";
              }
              drawSensorTimeLineState(sensor, newState, context.currentTime, context.currentTime, type, false, expectedState && expectedState.state);
              sensor.lastDrawnState = newState;
          }
      }
      function drawNewStateChanges() {
          // Draw all sensors
          if (!context.gradingStatesBySensor) {
              return;
          }
          for(var sensorName in context.gradingStatesBySensor){
              drawNewStateChangesSensor(sensorName);
          }
      }
      context.increaseTime = function(sensor) {
          if (!sensor.lastTimeIncrease) {
              sensor.lastTimeIncrease = 0;
          }
          if (sensor.callsInTimeSlot == undefined) sensor.callsInTimeSlot = 0;
          if (sensor.lastTimeIncrease == context.currentTime) {
              sensor.callsInTimeSlot += 1;
          } else {
              sensor.lastTimeIncrease = context.currentTime;
              sensor.callsInTimeSlot = 1;
          }
          if (sensor.callsInTimeSlot > getQuickPiOption('increaseTimeAfterCalls')) {
              context.currentTime += context.tickIncrease;
              sensor.lastTimeIncrease = context.currentTime;
              sensor.callsInTimeSlot = 0;
          }
          drawCurrentTime();
          if (context.autoGrading) {
              drawNewStateChanges();
          }
          if (context.runner) {
              // Tell the runner an "action" happened
              context.runner.signalAction();
          }
      };
      context.increaseTimeBy = function(time) {
          var iStates = 0;
          var newTime = context.currentTime + time;
          if (context.gradingStatesByTime) {
              // Advance until current time, ignore everything in the past.
              while(iStates < context.gradingStatesByTime.length && context.gradingStatesByTime[iStates].time < context.currentTime)iStates++;
              for(; iStates < context.gradingStatesByTime.length; iStates++){
                  var sensorState = context.gradingStatesByTime[iStates];
                  // Until the new time
                  if (sensorState.time >= newTime) break;
                  // Mark all inputs as hit
                  if (sensorState.input) {
                      sensorState.hit = true;
                      //                context.currentTime = sensorState.time;
                      context.getSensorState(sensorState.name);
                  }
              }
          }
          if (context.runner) {
              // Tell the runner an "action" happened
              context.runner.signalAction();
          }
          context.currentTime = newTime;
          drawCurrentTime();
          if (context.autoGrading) {
              drawNewStateChanges();
          }
      };
      context.getSensorExpectedState = function(name, targetTime, upToTime) {
          if (targetTime === void 0) targetTime = null;
          if (upToTime === void 0) upToTime = null;
          var state = null;
          if (targetTime === null) {
              targetTime = context.currentTime;
          }
          if (!context.gradingStatesBySensor) {
              return null;
          }
          var actualname = name;
          var parts = name.split(".");
          if (parts.length == 2) {
              actualname = parts[0];
          }
          var sensorStates = context.gradingStatesBySensor[actualname];
          if (!sensorStates) return null; // Fail??
          var lastState;
          var startTime = -1;
          for(var idx = 0; idx < sensorStates.length; idx++){
              if (startTime >= 0 && targetTime >= startTime && targetTime < sensorStates[idx].time) {
                  state = lastState;
                  break;
              }
              startTime = sensorStates[idx].time;
              lastState = sensorStates[idx];
          }
          // This is the end state
          if (state === null && targetTime >= startTime) {
              state = lastState;
          }
          if (state && upToTime !== null) {
              // If upToTime is given, return an array of states instead
              var states = [
                  state
              ];
              for(var idx2 = idx + 1; idx2 < sensorStates.length; idx2++){
                  if (sensorStates[idx2].time < upToTime) {
                      states.push(sensorStates[idx2]);
                  } else {
                      break;
                  }
              }
              return states;
          } else {
              return state;
          }
      };
      context.getSensorState = function(name) {
          var state = null;
          var sensor = sensorHandler.findSensorByName(name);
          if (!context.display && !context.forceGradingWithoutDisplay || context.autoGrading) {
              var stateTime = context.getSensorExpectedState(name);
              if (stateTime != null) {
                  stateTime.hit = true;
                  state = stateTime.state;
                  if (sensor) {
                      // Redraw from the beginning of this state
                      sensor.lastDrawnTime = Math.min(sensor.lastDrawnTime, stateTime.time);
                  }
              } else {
                  state = 0;
              }
          }
          if (!sensor) {
              context.success = false;
              throw strings.messages.sensorNotFound.format(name);
          }
          if (state == null) {
              state = sensor.state;
          } else {
              sensor.state = state;
              sensorHandler.drawSensor(sensor);
          }
          drawNewStateChangesSensor(sensor.name, sensor.state);
          context.increaseTime(sensor);
          return state;
      };
      // This will advance grading time to the next button release for waitForButton
      // will return false if the next event wasn't a button press
      context.advanceToNextRelease = function(sensorType, port) {
          var retval = false;
          var iStates = 0;
          // Advance until current time, ignore everything in the past.
          while(context.gradingStatesByTime[iStates].time <= context.currentTime)iStates++;
          for(; iStates < context.gradingStatesByTime.length; iStates++){
              var sensorState = context.gradingStatesByTime[iStates];
              if (sensorState.type == sensorType && sensorState.port == port) {
                  sensorState.hit = true;
                  if (!sensorState.state) {
                      context.currentTime = sensorState.time;
                      retval = true;
                      break;
                  }
              } else {
                  retval = false;
                  break;
              }
          }
          return retval;
      };
      context.quickpi.changeSensorState = function(sensorName, sensorState, callback) {
          var sensor = sensorHandler.findSensorByName(sensorName);
          sensor.state = sensorState;
          sensorHandler.drawSensor(sensor);
          callback();
      };
      /***** Functions *****/ /* Here we define each function of the library.
         Blocks will generally use context.group.blockName as their handler
         function, hence we generally use this name for the functions. */ /***** Blocks definitions *****/ /* Here we define all blocks/functions of the library.
         Structure is as follows:
         {
            group: [{
               name: "someName",
               // category: "categoryName",
               // yieldsValue: optional true: Makes a block with return value rather than simple command
               // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
               // handler: optional handler function. Otherwise the function context.group.blockName will be used
               // blocklyJson: optional Blockly JSON objects
               // blocklyInit: optional function for Blockly.Blocks[name].init
               //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
               // blocklyXml: optional Blockly xml string
               // codeGenerators: optional object:
               //   { Python: function that generates Python code
               //     JavaScript: function that generates JS code
               //   }
            }]
         }
         [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
         [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
      */ function getSensorSuggestedName(type, suggested) {
          if (suggested) {
              if (!sensorHandler.findSensorByName(suggested)) return suggested;
          }
          var i = 0;
          var newName;
          do {
              i++;
              newName = type + i.toString();
          }while (sensorHandler.findSensorByName(newName));
          return newName;
      }
      var customBlocks = mainBoard.getCustomBlocks(context, strings);
      if (customBlocks.customBlocks) {
          context.customBlocks = customBlocks.customBlocks;
      }
      if (customBlocks.customClasses) {
          context.customClasses = customBlocks.customClasses;
      }
      if (customBlocks.customClassInstances) {
          context.customClassInstances = customBlocks.customClassInstances;
      }
      context.customConstants = {};
      if (customBlocks.customConstants) {
          context.customConstants = customBlocks.customConstants;
      }
      if (customBlocks.customBlockImplementations) {
          for(var _iterator1 = _create_for_of_iterator_helper_loose$1(Object.entries(customBlocks.customBlockImplementations)), _step1; !(_step1 = _iterator1()).done;){
              var _step_value = _step1.value, moduleName = _step_value[0], blocks = _step_value[1];
              if (!(moduleName in context)) {
                  context[moduleName] = {};
              }
              context[moduleName] = _extends({}, context[moduleName], blocks);
          }
      }
      if (customBlocks.customClassImplementations) {
          for(var _iterator2 = _create_for_of_iterator_helper_loose$1(Object.entries(customBlocks.customClassImplementations)), _step2; !(_step2 = _iterator2()).done;){
              var _step_value1 = _step2.value, moduleName1 = _step_value1[0], classes = _step_value1[1];
              if (!(moduleName1 in context)) {
                  context[moduleName1] = {};
              }
              context[moduleName1] = _extends({}, context[moduleName1], classes);
          }
      }
      // Color indexes of block categories (as a hue in the range 0–420)
      context.provideBlocklyColours = function() {
          window.Blockly.HSV_SATURATION = 0.65;
          window.Blockly.HSV_VALUE = 0.80;
          window.Blockly.Blocks.inputs.HUE = 50;
          return {
              categories: {
                  //actuator: 0,
                  //sensors: 100,
                  actuator: 212,
                  sensors: 95,
                  internet: 200,
                  display: 300,
                  input: 50,
                  inputs: 50,
                  lists: 353,
                  logic: 298,
                  math: 176,
                  loops: 200,
                  texts: 312,
                  dicts: 52,
                  tables: 212,
                  variables: 30,
                  procedures: 180
              }
          };
      };
      // Don't forget to return our newly created context!
      return context;
  };
  // Register the library; change "template" by the name of your library in lowercase
  if (window.quickAlgoLibraries) {
      window.quickAlgoLibraries.register('quickpi', getContext);
  } else {
      if (!window.quickAlgoLibrariesList) {
          window.quickAlgoLibrariesList = [];
      }
      window.quickAlgoLibrariesList.push([
          'quickpi',
          getContext
      ]);
  }

  function OutputGenerator() {
      this.events = [];
      this.time = 0;
      this.start = function() {
          this.events = [];
          this.time = 0;
      };
      this.sleep = function(time) {
          this.time += time;
      };
      this.setElementState = function(type, name, state, input) {
          // Note : input means the grading will not check whether the program
          // actually read the sensor
          var event = {
              time: this.time,
              type: type,
              name: name,
              state: state,
              input: !!input
          };
          this.events.push(event);
      };
      this.setElementStateAfter = function(type, name, state, input, time) {
          // Note : input means the grading will not check whether the program
          // actually read the sensor
          var event = {
              time: this.time + time,
              type: type,
              name: name,
              state: state,
              input: !!input
          };
          this.events.push(event);
      };
      this.setBuzzerNote = function(name, frequency) {
          this.setElementState("buzzer", name, frequency);
      };
      this.setElementProperty = function(type, name, property, value) {
          var event = {
              time: this.time,
              type: type,
              name: name
          };
          event[property] = value;
          this.events.push(event);
      };
      this.getEvents = function() {
          return this.events;
      };
  }

  function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _unsupported_iterable_to_array(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
  }
  function _create_for_of_iterator_helper_loose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array(o)) || allowArrayLike  ) {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var exportToWindow = {
      quickPiLocalLanguageStrings: quickPiLocalLanguageStrings,
      QuickStore: QuickStore,
      getContext: getContext,
      quickPiStore: LocalQuickStore,
      OutputGenerator: OutputGenerator,
      screenDrawing: screenDrawing
  };
  for(var _iterator = _create_for_of_iterator_helper_loose(Object.entries(exportToWindow)), _step; !(_step = _iterator()).done;){
      var _step_value = _step.value, name = _step_value[0], object = _step_value[1];
      window[name] = object;
  }

  exports.QuickStore = QuickStore;
  exports.getContext = getContext;
  exports.quickPiLocalLanguageStrings = quickPiLocalLanguageStrings;

  return exports;

})({});