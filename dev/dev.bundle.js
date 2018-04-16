/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "./node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var Sphinx = __webpack_require__(/*! ./sphinx */ "./src/sphinx.js");

(function () {
  /* global define */
  if ("function" !== 'undefined' && __webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js") !== null && __webpack_require__(/*! !webpack amd options */ "./node_modules/webpack/buildin/amd-options.js") !== null) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return Sphinx;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== 'undefined' && module !== null && module.exports !== null) {
    module.exports = Sphinx;
  }

  this.Sphinx = Sphinx;
}).call(window || undefined);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/sphinx.js":
/*!***********************!*\
  !*** ./src/sphinx.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Imports:

var AudioRecorder = __webpack_require__(/*! ./util/audio-recorder */ "./src/util/audio-recorder.js");
var CallbackManager = __webpack_require__(/*! ./util/callback-manager */ "./src/util/callback-manager.js");
var getMicrophone = __webpack_require__(/*! ./util/get-microphone */ "./src/util/get-microphone.js");
var recogWorker = __webpack_require__(/*! ./worker/recognizer.worker.js */ "./src/worker/recognizer.worker.js");
//Constructor
function Sphinx() {
  this._callbackManager = new CallbackManager();
  this.recorder = this._startRecorder();
  this.recognizer = this._startRecognizer();
}
//Control
Sphinx.prototype.startRecording = function (grammar_id) {
  return this.recorder.then(function (recorder) {
    recorder.start(grammar_id);
  });
};
Sphinx.prototype.stopRecording = function () {
  return this.recorder.then(function (recorder) {
    recorder.stop();
  });
};
//Callbacks
Sphinx.prototype.onrecognition = function () {};

// This initializes the recognizer. When it calls back, we add words
Sphinx.prototype.initialize = function () {
  if (!this._initialized) {
    var init_recognizer = this.recognizer.then(this._initRecognizer.bind(this)).then(this._postMessage({ command: 'initialize' }));

    var set_consumer = Promise.all([this.recorder, this.recognizer]).then(function (results) {
      var recorder = results[0];
      var recognizer = results[1];
      recorder.consumers.push(recognizer);
    });

    this._initialized = Promise.all([init_recognizer, set_consumer]);
  }

  return this._initialized;
};
// This adds words to the recognizer
Sphinx.prototype.addWords = function (words) {
  return this.recognizer.then(this._postMessage({
    command: 'addWords',
    data: words
  }));
};

Sphinx.prototype.processExistingChunk = function (inputBuffer) {
  return undefined.recognizer.then(undefined._postMessage({
    command: 'processBuffer',
    data: { data: [], buffer: buffer }
  }));
};
// This adds a grammar to the recognizer
Sphinx.prototype.addGrammar = function (grammar) {
  return this.recognizer.then(this._postMessage({
    command: 'addGrammar',
    data: grammar
  }));
};
// This adds words and a grammar to the recognizer
Sphinx.prototype.configure = function (words, grammar) {
  var _this = this;

  var initial = this.initialize().then(function () {
    return _this.addWords(words);
  }).then(function () {
    return _this.addGrammar(grammar);
  });
  return initial;
};

Sphinx.prototype._startRecorder = function () {
  return getMicrophone().then(function (input) {
    // Once the user authorises access to the microphone, we instantiate the recorder
    return new AudioRecorder(input, {
      errorCallback: function errorCallback() {/* ??? */}
    });
  });
};
Sphinx.prototype._startRecognizer = function () {
  var worker = new recogWorker();
  //Not rebuilding
  var promise = new Promise(function (resolve, reject) {
    worker.onmessage = function () {
      resolve(worker);
    };
    worker.postMessage('');
  });
  return promise;
};
Sphinx.prototype._initRecognizer = function (worker) {
  var self = this;

  // This is the onmessage function, once the worker is fully loaded
  worker.onmessage = function (evt) {
    // This is the case when we have a callback id to be called
    if (evt.data.hasOwnProperty('id')) {
      var cb = self._callbackManager.get(evt.data.id);
      if (cb) {
        var data = {};
        if (evt.data.hasOwnProperty('data')) {
          data = evt.data.data;
        }
        cb(data);
      }
    }
    // This is a case when the recognizer has a new hypothesis
    if (evt.data.hasOwnProperty('hyp')) {
      self.onrecognition(evt);
    }
    // This is the case when we have an error
    if (evt.data.hasOwnProperty('status') && evt.data.status === 'error') {
      self.onerror(evt);
    }
  };

  return worker;
};
Sphinx.prototype._postMessage = function (msg) {
  var manager = this._callbackManager;

  return function (worker) {
    var _this2 = this;

    var message = msg || {};
    return new Promise(function (resolve, reject) {
      message.callbackId = manager.add(resolve.bind(_this2));
      worker.postMessage(message);
    });
  };
};

module.exports = Sphinx;

/***/ }),

/***/ "./src/util/audio-recorder.js":
/*!************************************!*\
  !*** ./src/util/audio-recorder.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var recordWorker = __webpack_require__(/*! ../worker/audio-recorder.worker.js */ "./src/worker/audio-recorder.worker.js");

var AudioRecorder = function AudioRecorder(source, cfg) {
  var config = cfg || {};
  var errorCallback = config.errorCallback || function () {};
  var inputBufferLength = config.inputBufferLength || 4096;
  var outputBufferLength = config.outputBufferLength || 4000;
  var worker = new recordWorker();

  this.consumers = [];
  this.context = source.context;
  this.node = this.context.createScriptProcessor(inputBufferLength);
  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: this.context.sampleRate,
      outputBufferLength: outputBufferLength,
      outputSampleRate: config.outputSampleRate || 16000
    }
  });

  var recording = false;
  this.node.onaudioprocess = function (e) {
    if (!recording) {
      return;
    }
    worker.postMessage({
      command: 'record',
      buffer: [e.inputBuffer.getChannelData(0), e.inputBuffer.getChannelData(1)]
    });
  };

  this.start = function (data) {
    this.consumers.forEach(function (consumer) {
      consumer.postMessage({ command: 'start', data: data });
      recording = true;
      return true;
    });
    recording = true;
    return this.consumers.length > 0;
  };
  this.stop = function () {
    if (recording) {
      this.consumers.forEach(function (consumer) {
        consumer.postMessage({ command: 'stop' });
      });
      recording = false;
    }
    worker.postMessage({ command: 'clear' });
  };
  this.cancel = function () {
    this.stop();
  };

  var that = this;
  worker.onmessage = function (e) {
    if (e.data.error && e.data.error === 'silent') {
      errorCallback('silent');
    }
    if (e.data.command === 'newBuffer' && recording) {
      that.consumers.forEach(function (consumer) {
        consumer.postMessage({ command: 'process', data: e.data.data });
      });
    }
  };
  source.connect(this.node);
  this.node.connect(this.context.destination);
};

module.exports = AudioRecorder;

/***/ }),

/***/ "./src/util/callback-manager.js":
/*!**************************************!*\
  !*** ./src/util/callback-manager.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CallbackManager = function CallbackManager() {
  var currentId = 0;
  var callbackPool = {};
  this.add = function (cb) {
    var id = currentId;
    callbackPool[id] = cb;
    currentId++;
    return id;
  };
  this.get = function (id) {
    if (callbackPool.hasOwnProperty(id)) {
      var cb = callbackPool[id];
      delete callbackPool[id];
      return cb;
    }
    return null;
  };
};

module.exports = CallbackManager;

/***/ }),

/***/ "./src/util/get-microphone.js":
/*!************************************!*\
  !*** ./src/util/get-microphone.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Handle vendor prefixes

var AudioContext = window.AudioContext || window.webkitAudioContext;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function getMicrophone() {
    return new Promise(function (resolve, reject) {
        var audioContext;
        try {
            audioContext = new AudioContext();
        } catch (e) {
            reject(e);
        }
        //Initialize Microphone
        try {
            getUserMedia.call(navigator, { audio: true },
            //Success:
            function (stream) {
                var input = audioContext.createMediaStreamSource(stream);
                // Firefox hack https://support.mozilla.org/en-US/questions/984179
                window.firefox_audio_hack = input;
                resolve(input);
            },
            //Failure
            function (e) {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = getMicrophone;

/***/ }),

/***/ "./src/worker/audio-recorder.worker.js":
/*!*********************************************!*\
  !*** ./src/worker/audio-recorder.worker.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "11c9b4dcf191eb754a7f.worker.js");
};

/***/ }),

/***/ "./src/worker/recognizer.worker.js":
/*!*****************************************!*\
  !*** ./src/worker/recognizer.worker.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "8f1d227e6c9e3eed9c91.worker.js");
};

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zcGhpbnguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvYXVkaW8tcmVjb3JkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY2FsbGJhY2stbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9nZXQtbWljcm9waG9uZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvd29ya2VyL2F1ZGlvLXJlY29yZGVyLndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvd29ya2VyL3JlY29nbml6ZXIud29ya2VyLmpzIl0sIm5hbWVzIjpbIlNwaGlueCIsInJlcXVpcmUiLCJkZWZpbmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiY2FsbCIsIndpbmRvdyIsIkF1ZGlvUmVjb3JkZXIiLCJDYWxsYmFja01hbmFnZXIiLCJnZXRNaWNyb3Bob25lIiwicmVjb2dXb3JrZXIiLCJfY2FsbGJhY2tNYW5hZ2VyIiwicmVjb3JkZXIiLCJfc3RhcnRSZWNvcmRlciIsInJlY29nbml6ZXIiLCJfc3RhcnRSZWNvZ25pemVyIiwicHJvdG90eXBlIiwic3RhcnRSZWNvcmRpbmciLCJncmFtbWFyX2lkIiwidGhlbiIsInN0YXJ0Iiwic3RvcFJlY29yZGluZyIsInN0b3AiLCJvbnJlY29nbml0aW9uIiwiaW5pdGlhbGl6ZSIsIl9pbml0aWFsaXplZCIsImluaXRfcmVjb2duaXplciIsIl9pbml0UmVjb2duaXplciIsImJpbmQiLCJfcG9zdE1lc3NhZ2UiLCJjb21tYW5kIiwic2V0X2NvbnN1bWVyIiwiUHJvbWlzZSIsImFsbCIsInJlc3VsdHMiLCJjb25zdW1lcnMiLCJwdXNoIiwiYWRkV29yZHMiLCJ3b3JkcyIsImRhdGEiLCJwcm9jZXNzRXhpc3RpbmdDaHVuayIsImlucHV0QnVmZmVyIiwiYnVmZmVyIiwiYWRkR3JhbW1hciIsImdyYW1tYXIiLCJjb25maWd1cmUiLCJpbml0aWFsIiwiaW5wdXQiLCJlcnJvckNhbGxiYWNrIiwid29ya2VyIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbm1lc3NhZ2UiLCJwb3N0TWVzc2FnZSIsInNlbGYiLCJldnQiLCJoYXNPd25Qcm9wZXJ0eSIsImNiIiwiZ2V0IiwiaWQiLCJzdGF0dXMiLCJvbmVycm9yIiwibXNnIiwibWFuYWdlciIsIm1lc3NhZ2UiLCJjYWxsYmFja0lkIiwiYWRkIiwicmVjb3JkV29ya2VyIiwic291cmNlIiwiY2ZnIiwiY29uZmlnIiwiaW5wdXRCdWZmZXJMZW5ndGgiLCJvdXRwdXRCdWZmZXJMZW5ndGgiLCJjb250ZXh0Iiwibm9kZSIsImNyZWF0ZVNjcmlwdFByb2Nlc3NvciIsInNhbXBsZVJhdGUiLCJvdXRwdXRTYW1wbGVSYXRlIiwicmVjb3JkaW5nIiwib25hdWRpb3Byb2Nlc3MiLCJlIiwiZ2V0Q2hhbm5lbERhdGEiLCJmb3JFYWNoIiwiY29uc3VtZXIiLCJsZW5ndGgiLCJjYW5jZWwiLCJ0aGF0IiwiZXJyb3IiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJjdXJyZW50SWQiLCJjYWxsYmFja1Bvb2wiLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJnZXRVc2VyTWVkaWEiLCJuYXZpZ2F0b3IiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJhdWRpb0NvbnRleHQiLCJhdWRpbyIsInN0cmVhbSIsImNyZWF0ZU1lZGlhU3RyZWFtU291cmNlIiwiZmlyZWZveF9hdWRpb19oYWNrIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs4R0NyQkE7O0FBRUEsSUFBSUEsU0FBUyxtQkFBQUMsQ0FBUSxpQ0FBUixDQUFiOztBQUVBLENBQUMsWUFBVTtBQUNUO0FBQ0EsTUFBSyxlQUFrQixXQUFsQixJQUFpQyw4RkFBQUMsS0FBVyxJQUE3QyxJQUF1RCxxR0FBZSxJQUExRSxFQUFpRjtBQUMvRUEsSUFBQSxpQ0FBTyxFQUFQLG1DQUFXLFlBQVc7QUFDcEIsYUFBT0YsTUFBUDtBQUNELEtBRkQ7QUFBQTtBQUdELEdBSkQsTUFJTyxJQUFLLE9BQU9HLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLFdBQVcsSUFBN0MsSUFBdURBLE9BQU9DLE9BQVAsS0FBbUIsSUFBOUUsRUFBcUY7QUFDMUZELFdBQU9DLE9BQVAsR0FBaUJKLE1BQWpCO0FBQ0Q7O0FBRUQsT0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0QsQ0FYRCxFQVdHSyxJQVhILENBV1FDLG1CQVhSLEU7Ozs7Ozs7Ozs7Ozs7QUNKQTs7QUFFQTs7QUFDQSxJQUFJQyxnQkFBa0IsbUJBQUFOLENBQVEsMkRBQVIsQ0FBdEI7QUFDQSxJQUFJTyxrQkFBa0IsbUJBQUFQLENBQVEsK0RBQVIsQ0FBdEI7QUFDQSxJQUFJUSxnQkFBa0IsbUJBQUFSLENBQVEsMkRBQVIsQ0FBdEI7QUFDQSxJQUFJUyxjQUFrQixtQkFBQVQsQ0FBUSx3RUFBUixDQUF0QjtBQUNBO0FBQ0EsU0FBU0QsTUFBVCxHQUFpQjtBQUNiLE9BQUtXLGdCQUFMLEdBQXdCLElBQUlILGVBQUosRUFBeEI7QUFDQSxPQUFLSSxRQUFMLEdBQXdCLEtBQUtDLGNBQUwsRUFBeEI7QUFDQSxPQUFLQyxVQUFMLEdBQXdCLEtBQUtDLGdCQUFMLEVBQXhCO0FBQ0g7QUFDRDtBQUNBZixPQUFPZ0IsU0FBUCxDQUFpQkMsY0FBakIsR0FBa0MsVUFBU0MsVUFBVCxFQUFvQjtBQUNwRCxTQUFPLEtBQUtOLFFBQUwsQ0FDSk8sSUFESSxDQUNDLFVBQVNQLFFBQVQsRUFBa0I7QUFDdEJBLGFBQVNRLEtBQVQsQ0FBZUYsVUFBZjtBQUNELEdBSEksQ0FBUDtBQUlELENBTEQ7QUFNQWxCLE9BQU9nQixTQUFQLENBQWlCSyxhQUFqQixHQUFpQyxZQUFVO0FBQ3pDLFNBQU8sS0FBS1QsUUFBTCxDQUNKTyxJQURJLENBQ0MsVUFBU1AsUUFBVCxFQUFrQjtBQUN0QkEsYUFBU1UsSUFBVDtBQUNELEdBSEksQ0FBUDtBQUlELENBTEQ7QUFNQTtBQUNBdEIsT0FBT2dCLFNBQVAsQ0FBaUJPLGFBQWpCLEdBQWlDLFlBQVUsQ0FBRSxDQUE3Qzs7QUFFQTtBQUNBdkIsT0FBT2dCLFNBQVAsQ0FBaUJRLFVBQWpCLEdBQThCLFlBQVc7QUFDdkMsTUFBRyxDQUFDLEtBQUtDLFlBQVQsRUFBc0I7QUFDcEIsUUFBSUMsa0JBQWtCLEtBQUtaLFVBQUwsQ0FDbkJLLElBRG1CLENBQ2QsS0FBS1EsZUFBTCxDQUFxQkMsSUFBckIsQ0FBMEIsSUFBMUIsQ0FEYyxFQUVuQlQsSUFGbUIsQ0FFZCxLQUFLVSxZQUFMLENBQWtCLEVBQUVDLFNBQVMsWUFBWCxFQUFsQixDQUZjLENBQXRCOztBQUlBLFFBQUlDLGVBQWVDLFFBQVFDLEdBQVIsQ0FBWSxDQUFDLEtBQUtyQixRQUFOLEVBQWdCLEtBQUtFLFVBQXJCLENBQVosRUFDaEJLLElBRGdCLENBQ1gsVUFBU2UsT0FBVCxFQUFpQjtBQUNyQixVQUFJdEIsV0FBYXNCLFFBQVEsQ0FBUixDQUFqQjtBQUNBLFVBQUlwQixhQUFhb0IsUUFBUSxDQUFSLENBQWpCO0FBQ0F0QixlQUFTdUIsU0FBVCxDQUFtQkMsSUFBbkIsQ0FBd0J0QixVQUF4QjtBQUNELEtBTGdCLENBQW5COztBQU9BLFNBQUtXLFlBQUwsR0FBb0JPLFFBQVFDLEdBQVIsQ0FBWSxDQUFDUCxlQUFELEVBQWtCSyxZQUFsQixDQUFaLENBQXBCO0FBQ0Q7O0FBRUQsU0FBTyxLQUFLTixZQUFaO0FBQ0QsQ0FqQkQ7QUFrQkE7QUFDQXpCLE9BQU9nQixTQUFQLENBQWlCcUIsUUFBakIsR0FBNEIsVUFBU0MsS0FBVCxFQUFnQjtBQUMxQyxTQUFPLEtBQUt4QixVQUFMLENBQ0pLLElBREksQ0FDQyxLQUFLVSxZQUFMLENBQWtCO0FBQ3RCQyxhQUFTLFVBRGE7QUFFdEJTLFVBQVNEO0FBRmEsR0FBbEIsQ0FERCxDQUFQO0FBS0QsQ0FORDs7QUFRQXRDLE9BQU9nQixTQUFQLENBQWlCd0Isb0JBQWpCLEdBQXdDLFVBQUNDLFdBQUQsRUFBaUI7QUFDckQsU0FBTyxVQUFLM0IsVUFBTCxDQUNGSyxJQURFLENBQ0csVUFBS1UsWUFBTCxDQUFrQjtBQUNwQkMsYUFBUyxlQURXO0FBRXBCUyxVQUFNLEVBQUVBLE1BQU0sRUFBUixFQUFZRyxRQUFRQSxNQUFwQjtBQUZjLEdBQWxCLENBREgsQ0FBUDtBQUtILENBTkQ7QUFPQTtBQUNBMUMsT0FBT2dCLFNBQVAsQ0FBaUIyQixVQUFqQixHQUE4QixVQUFTQyxPQUFULEVBQWtCO0FBQzlDLFNBQU8sS0FBSzlCLFVBQUwsQ0FDSkssSUFESSxDQUNDLEtBQUtVLFlBQUwsQ0FBa0I7QUFDdEJDLGFBQVMsWUFEYTtBQUV0QlMsVUFBU0s7QUFGYSxHQUFsQixDQURELENBQVA7QUFLRCxDQU5EO0FBT0E7QUFDQTVDLE9BQU9nQixTQUFQLENBQWlCNkIsU0FBakIsR0FBNkIsVUFBU1AsS0FBVCxFQUFnQk0sT0FBaEIsRUFBd0I7QUFBQTs7QUFDbkQsTUFBTUUsVUFBVSxLQUFLdEIsVUFBTCxHQUNiTCxJQURhLENBQ1IsWUFBTTtBQUNSLFdBQU8sTUFBS2tCLFFBQUwsQ0FBY0MsS0FBZCxDQUFQO0FBQ0gsR0FIYSxFQUlibkIsSUFKYSxDQUlSLFlBQU07QUFDUixXQUFPLE1BQUt3QixVQUFMLENBQWdCQyxPQUFoQixDQUFQO0FBQ0gsR0FOYSxDQUFoQjtBQU9FLFNBQU9FLE9BQVA7QUFDSCxDQVREOztBQVlBOUMsT0FBT2dCLFNBQVAsQ0FBaUJILGNBQWpCLEdBQW9DLFlBQVU7QUFDNUMsU0FBT0osZ0JBQ0pVLElBREksQ0FDQyxVQUFDNEIsS0FBRCxFQUFXO0FBQ2Y7QUFDQSxXQUFPLElBQUl4QyxhQUFKLENBQWtCd0MsS0FBbEIsRUFBeUI7QUFDOUJDLHFCQUFlLHlCQUFXLENBQUUsU0FBVztBQURULEtBQXpCLENBQVA7QUFHRCxHQU5JLENBQVA7QUFRRCxDQVREO0FBVUFoRCxPQUFPZ0IsU0FBUCxDQUFpQkQsZ0JBQWpCLEdBQW9DLFlBQVU7QUFDMUMsTUFBTWtDLFNBQVMsSUFBSXZDLFdBQUosRUFBZjtBQUNBO0FBQ0EsTUFBTXdDLFVBQVUsSUFBSWxCLE9BQUosQ0FBWSxVQUFDbUIsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdDSCxXQUFPSSxTQUFQLEdBQW1CLFlBQVc7QUFDMUJGLGNBQVFGLE1BQVI7QUFDSCxLQUZEO0FBR0FBLFdBQU9LLFdBQVAsQ0FBbUIsRUFBbkI7QUFDSCxHQUxlLENBQWhCO0FBTUEsU0FBT0osT0FBUDtBQUNILENBVkQ7QUFXQWxELE9BQU9nQixTQUFQLENBQWlCVyxlQUFqQixHQUFtQyxVQUFTc0IsTUFBVCxFQUFnQjtBQUNqRCxNQUFJTSxPQUFPLElBQVg7O0FBRUE7QUFDQU4sU0FBT0ksU0FBUCxHQUFtQixVQUFTRyxHQUFULEVBQWM7QUFDL0I7QUFDQSxRQUFJQSxJQUFJakIsSUFBSixDQUFTa0IsY0FBVCxDQUF3QixJQUF4QixDQUFKLEVBQW1DO0FBQ2pDLFVBQUlDLEtBQUtILEtBQUs1QyxnQkFBTCxDQUFzQmdELEdBQXRCLENBQTBCSCxJQUFJakIsSUFBSixDQUFTcUIsRUFBbkMsQ0FBVDtBQUNBLFVBQUdGLEVBQUgsRUFBTTtBQUNKLFlBQUluQixPQUFPLEVBQVg7QUFDQSxZQUFJaUIsSUFBSWpCLElBQUosQ0FBU2tCLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBSixFQUFvQztBQUNsQ2xCLGlCQUFPaUIsSUFBSWpCLElBQUosQ0FBU0EsSUFBaEI7QUFDRDtBQUNEbUIsV0FBR25CLElBQUg7QUFDRDtBQUNGO0FBQ0Q7QUFDQSxRQUFJaUIsSUFBSWpCLElBQUosQ0FBU2tCLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBSixFQUFvQztBQUNsQ0YsV0FBS2hDLGFBQUwsQ0FBbUJpQyxHQUFuQjtBQUNEO0FBQ0Q7QUFDQSxRQUFJQSxJQUFJakIsSUFBSixDQUFTa0IsY0FBVCxDQUF3QixRQUF4QixLQUFzQ0QsSUFBSWpCLElBQUosQ0FBU3NCLE1BQVQsS0FBb0IsT0FBOUQsRUFBd0U7QUFDdEVOLFdBQUtPLE9BQUwsQ0FBYU4sR0FBYjtBQUNEO0FBQ0YsR0FwQkQ7O0FBc0JBLFNBQU9QLE1BQVA7QUFDRCxDQTNCRDtBQTRCQWpELE9BQU9nQixTQUFQLENBQWlCYSxZQUFqQixHQUFnQyxVQUFTa0MsR0FBVCxFQUFhO0FBQ3pDLE1BQU1DLFVBQVUsS0FBS3JELGdCQUFyQjs7QUFFQSxTQUFPLFVBQVNzQyxNQUFULEVBQWdCO0FBQUE7O0FBQ25CLFFBQU1nQixVQUFVRixPQUFPLEVBQXZCO0FBQ0EsV0FBTyxJQUFJL0IsT0FBSixDQUFZLFVBQUNtQixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENhLGNBQVFDLFVBQVIsR0FBcUJGLFFBQVFHLEdBQVIsQ0FBWWhCLFFBQVF2QixJQUFSLFFBQVosQ0FBckI7QUFDQXFCLGFBQU9LLFdBQVAsQ0FBbUJXLE9BQW5CO0FBQ0gsS0FITSxDQUFQO0FBSUgsR0FORDtBQU9ILENBVkQ7O0FBWUE5RCxPQUFPQyxPQUFQLEdBQWlCSixNQUFqQixDOzs7Ozs7Ozs7Ozs7QUNsSkE7O0FBQ0EsSUFBSW9FLGVBQWUsbUJBQUFuRSxDQUFRLGlGQUFSLENBQW5COztBQUVBLElBQUlNLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBUzhELE1BQVQsRUFBaUJDLEdBQWpCLEVBQXNCO0FBQ3hDLE1BQUlDLFNBQXFCRCxPQUFPLEVBQWhDO0FBQ0EsTUFBSXRCLGdCQUFxQnVCLE9BQU92QixhQUFQLElBQXdCLFlBQVcsQ0FBRSxDQUE5RDtBQUNBLE1BQUl3QixvQkFBcUJELE9BQU9DLGlCQUFQLElBQTRCLElBQXJEO0FBQ0EsTUFBSUMscUJBQXFCRixPQUFPRSxrQkFBUCxJQUE2QixJQUF0RDtBQUNBLE1BQUl4QixTQUFxQixJQUFJbUIsWUFBSixFQUF6Qjs7QUFFQSxPQUFLakMsU0FBTCxHQUFpQixFQUFqQjtBQUNBLE9BQUt1QyxPQUFMLEdBQWlCTCxPQUFPSyxPQUF4QjtBQUNBLE9BQUtDLElBQUwsR0FBaUIsS0FBS0QsT0FBTCxDQUFhRSxxQkFBYixDQUFtQ0osaUJBQW5DLENBQWpCO0FBQ0F2QixTQUFPSyxXQUFQLENBQW1CO0FBQ2pCeEIsYUFBUyxNQURRO0FBRWpCeUMsWUFBUTtBQUNOTSxrQkFBb0IsS0FBS0gsT0FBTCxDQUFhRyxVQUQzQjtBQUVOSiwwQkFBb0JBLGtCQUZkO0FBR05LLHdCQUFxQlAsT0FBT08sZ0JBQVAsSUFBMkI7QUFIMUM7QUFGUyxHQUFuQjs7QUFTQSxNQUFJQyxZQUFZLEtBQWhCO0FBQ0EsT0FBS0osSUFBTCxDQUFVSyxjQUFWLEdBQTJCLFVBQVNDLENBQVQsRUFBWTtBQUNyQyxRQUFJLENBQUNGLFNBQUwsRUFBZTtBQUFFO0FBQVM7QUFDMUI5QixXQUFPSyxXQUFQLENBQW1CO0FBQ2pCeEIsZUFBUyxRQURRO0FBRWpCWSxjQUFRLENBQ051QyxFQUFFeEMsV0FBRixDQUFjeUMsY0FBZCxDQUE2QixDQUE3QixDQURNLEVBRU5ELEVBQUV4QyxXQUFGLENBQWN5QyxjQUFkLENBQTZCLENBQTdCLENBRk07QUFGUyxLQUFuQjtBQU9ELEdBVEQ7O0FBV0EsT0FBSzlELEtBQUwsR0FBYSxVQUFTbUIsSUFBVCxFQUFlO0FBQzFCLFNBQUtKLFNBQUwsQ0FBZWdELE9BQWYsQ0FBdUIsVUFBU0MsUUFBVCxFQUFtQjtBQUN4Q0EsZUFBUzlCLFdBQVQsQ0FBcUIsRUFBRXhCLFNBQVMsT0FBWCxFQUFvQlMsTUFBTUEsSUFBMUIsRUFBckI7QUFDQXdDLGtCQUFZLElBQVo7QUFDQSxhQUFPLElBQVA7QUFDRCxLQUpEO0FBS0FBLGdCQUFZLElBQVo7QUFDQSxXQUFRLEtBQUs1QyxTQUFMLENBQWVrRCxNQUFmLEdBQXdCLENBQWhDO0FBQ0QsR0FSRDtBQVNBLE9BQUsvRCxJQUFMLEdBQVksWUFBVztBQUNyQixRQUFJeUQsU0FBSixFQUFlO0FBQ2IsV0FBSzVDLFNBQUwsQ0FBZWdELE9BQWYsQ0FBdUIsVUFBU0MsUUFBVCxFQUFtQjtBQUN4Q0EsaUJBQVM5QixXQUFULENBQXFCLEVBQUV4QixTQUFTLE1BQVgsRUFBckI7QUFDRCxPQUZEO0FBR0FpRCxrQkFBWSxLQUFaO0FBQ0Q7QUFDRDlCLFdBQU9LLFdBQVAsQ0FBbUIsRUFBRXhCLFNBQVMsT0FBWCxFQUFuQjtBQUNELEdBUkQ7QUFTQSxPQUFLd0QsTUFBTCxHQUFjLFlBQVc7QUFDdkIsU0FBS2hFLElBQUw7QUFDRCxHQUZEOztBQUlBLE1BQUlpRSxPQUFPLElBQVg7QUFDQXRDLFNBQU9JLFNBQVAsR0FBbUIsVUFBUzRCLENBQVQsRUFBWTtBQUM3QixRQUFJQSxFQUFFMUMsSUFBRixDQUFPaUQsS0FBUCxJQUFpQlAsRUFBRTFDLElBQUYsQ0FBT2lELEtBQVAsS0FBaUIsUUFBdEMsRUFBZ0Q7QUFDOUN4QyxvQkFBYyxRQUFkO0FBQ0Q7QUFDRCxRQUFLaUMsRUFBRTFDLElBQUYsQ0FBT1QsT0FBUCxLQUFtQixXQUFwQixJQUFvQ2lELFNBQXhDLEVBQW1EO0FBQ2pEUSxXQUFLcEQsU0FBTCxDQUFlZ0QsT0FBZixDQUF1QixVQUFTQyxRQUFULEVBQW1CO0FBQ3hDQSxpQkFBUzlCLFdBQVQsQ0FBcUIsRUFBRXhCLFNBQVMsU0FBWCxFQUFzQlMsTUFBTTBDLEVBQUUxQyxJQUFGLENBQU9BLElBQW5DLEVBQXJCO0FBQ0QsT0FGRDtBQUdEO0FBQ0YsR0FURDtBQVVBOEIsU0FBT29CLE9BQVAsQ0FBZSxLQUFLZCxJQUFwQjtBQUNBLE9BQUtBLElBQUwsQ0FBVWMsT0FBVixDQUFrQixLQUFLZixPQUFMLENBQWFnQixXQUEvQjtBQUNELENBbEVEOztBQXFFQXZGLE9BQU9DLE9BQVAsR0FBaUJHLGFBQWpCLEM7Ozs7Ozs7Ozs7OztBQ3hFQTs7QUFFQSxJQUFJQyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQVc7QUFDL0IsTUFBSW1GLFlBQVksQ0FBaEI7QUFDQSxNQUFJQyxlQUFlLEVBQW5CO0FBQ0EsT0FBS3pCLEdBQUwsR0FBVyxVQUFTVCxFQUFULEVBQWE7QUFDdEIsUUFBSUUsS0FBSytCLFNBQVQ7QUFDQUMsaUJBQWFoQyxFQUFiLElBQW1CRixFQUFuQjtBQUNBaUM7QUFDQSxXQUFPL0IsRUFBUDtBQUNELEdBTEQ7QUFNQSxPQUFLRCxHQUFMLEdBQVcsVUFBU0MsRUFBVCxFQUFhO0FBQ3RCLFFBQUlnQyxhQUFhbkMsY0FBYixDQUE0QkcsRUFBNUIsQ0FBSixFQUFxQztBQUNuQyxVQUFJRixLQUFLa0MsYUFBYWhDLEVBQWIsQ0FBVDtBQUNBLGFBQU9nQyxhQUFhaEMsRUFBYixDQUFQO0FBQ0EsYUFBT0YsRUFBUDtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0FQRDtBQVFELENBakJEOztBQW9CQXZELE9BQU9DLE9BQVAsR0FBaUJJLGVBQWpCLEM7Ozs7Ozs7Ozs7OztBQ3RCQTs7QUFFQTs7QUFDQSxJQUFJcUYsZUFBZXZGLE9BQU91RixZQUFQLElBQXVCdkYsT0FBT3dGLGtCQUFqRDtBQUNBLElBQUlDLGVBQWVDLFVBQVVELFlBQVYsSUFBMEJDLFVBQVVDLGtCQUFwQyxJQUEwREQsVUFBVUUsZUFBdkY7O0FBR0EsU0FBU3pGLGFBQVQsR0FBd0I7QUFDcEIsV0FBTyxJQUFJdUIsT0FBSixDQUFZLFVBQUNtQixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsWUFBSStDLFlBQUo7QUFDQSxZQUFJO0FBQ0FBLDJCQUFlLElBQUlOLFlBQUosRUFBZjtBQUNILFNBRkQsQ0FFRSxPQUFPWixDQUFQLEVBQVU7QUFDUjdCLG1CQUFPNkIsQ0FBUDtBQUNIO0FBQ0Q7QUFDQSxZQUFJO0FBQ0FjLHlCQUFhMUYsSUFBYixDQUFrQjJGLFNBQWxCLEVBQTZCLEVBQUNJLE9BQU8sSUFBUixFQUE3QjtBQUNJO0FBQ0Esc0JBQUNDLE1BQUQsRUFBWTtBQUNSLG9CQUFJdEQsUUFBUW9ELGFBQWFHLHVCQUFiLENBQXFDRCxNQUFyQyxDQUFaO0FBQ0E7QUFDQS9GLHVCQUFPaUcsa0JBQVAsR0FBNEJ4RCxLQUE1QjtBQUNBSSx3QkFBUUosS0FBUjtBQUNILGFBUEw7QUFRSTtBQUNBLHNCQUFDa0MsQ0FBRCxFQUFPO0FBQUU3Qix1QkFBTzZCLENBQVA7QUFBWSxhQVR6QjtBQVVILFNBWEQsQ0FXRSxPQUFPQSxDQUFQLEVBQVU7QUFDUjdCLG1CQUFPNkIsQ0FBUDtBQUNIO0FBQ0osS0F0Qk0sQ0FBUDtBQXVCSDs7QUFHRDlFLE9BQU9DLE9BQVAsR0FBaUJLLGFBQWpCLEM7Ozs7Ozs7Ozs7O0FDbENBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6ImRldi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRocm93IG5ldyBFcnJvcihcImRlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdFwiKTtcclxufTtcclxuIiwiLyogZ2xvYmFscyBfX3dlYnBhY2tfYW1kX29wdGlvbnNfXyAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19hbWRfb3B0aW9uc19fO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNwaGlueCA9IHJlcXVpcmUoJy4vc3BoaW54Jyk7XG5cbihmdW5jdGlvbigpe1xuICAvKiBnbG9iYWwgZGVmaW5lICovXG4gIGlmICgodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lICE9PSBudWxsKSAmJiAoZGVmaW5lLmFtZCAhPT0gbnVsbCkpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFNwaGlueDtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlICE9PSBudWxsKSAmJiAobW9kdWxlLmV4cG9ydHMgIT09IG51bGwpKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTcGhpbng7XG4gIH1cblxuICB0aGlzLlNwaGlueCA9IFNwaGlueDtcbn0pLmNhbGwod2luZG93IHx8IHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vL0ltcG9ydHM6XG52YXIgQXVkaW9SZWNvcmRlciAgID0gcmVxdWlyZSgnLi91dGlsL2F1ZGlvLXJlY29yZGVyJyk7XG52YXIgQ2FsbGJhY2tNYW5hZ2VyID0gcmVxdWlyZSgnLi91dGlsL2NhbGxiYWNrLW1hbmFnZXInKTtcbnZhciBnZXRNaWNyb3Bob25lICAgPSByZXF1aXJlKCcuL3V0aWwvZ2V0LW1pY3JvcGhvbmUnKTtcbnZhciByZWNvZ1dvcmtlciAgICAgPSByZXF1aXJlKCcuL3dvcmtlci9yZWNvZ25pemVyLndvcmtlci5qcycpXG4vL0NvbnN0cnVjdG9yXG5mdW5jdGlvbiBTcGhpbngoKXtcbiAgICB0aGlzLl9jYWxsYmFja01hbmFnZXIgPSBuZXcgQ2FsbGJhY2tNYW5hZ2VyKCk7XG4gICAgdGhpcy5yZWNvcmRlciAgICAgICAgID0gdGhpcy5fc3RhcnRSZWNvcmRlcigpO1xuICAgIHRoaXMucmVjb2duaXplciAgICAgICA9IHRoaXMuX3N0YXJ0UmVjb2duaXplcigpO1xufVxuLy9Db250cm9sXG5TcGhpbngucHJvdG90eXBlLnN0YXJ0UmVjb3JkaW5nID0gZnVuY3Rpb24oZ3JhbW1hcl9pZCl7XG4gIHJldHVybiB0aGlzLnJlY29yZGVyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVjb3JkZXIpe1xuICAgICAgcmVjb3JkZXIuc3RhcnQoZ3JhbW1hcl9pZCk7XG4gICAgfSk7XG59O1xuU3BoaW54LnByb3RvdHlwZS5zdG9wUmVjb3JkaW5nID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXMucmVjb3JkZXJcbiAgICAudGhlbihmdW5jdGlvbihyZWNvcmRlcil7XG4gICAgICByZWNvcmRlci5zdG9wKCk7XG4gICAgfSk7XG59O1xuLy9DYWxsYmFja3NcblNwaGlueC5wcm90b3R5cGUub25yZWNvZ25pdGlvbiA9IGZ1bmN0aW9uKCl7fTtcblxuLy8gVGhpcyBpbml0aWFsaXplcyB0aGUgcmVjb2duaXplci4gV2hlbiBpdCBjYWxscyBiYWNrLCB3ZSBhZGQgd29yZHNcblNwaGlueC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZighdGhpcy5faW5pdGlhbGl6ZWQpe1xuICAgIHZhciBpbml0X3JlY29nbml6ZXIgPSB0aGlzLnJlY29nbml6ZXJcbiAgICAgIC50aGVuKHRoaXMuX2luaXRSZWNvZ25pemVyLmJpbmQodGhpcykpXG4gICAgICAudGhlbih0aGlzLl9wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdpbml0aWFsaXplJyB9KSk7XG5cbiAgICB2YXIgc2V0X2NvbnN1bWVyID0gUHJvbWlzZS5hbGwoW3RoaXMucmVjb3JkZXIsIHRoaXMucmVjb2duaXplcl0pXG4gICAgICAudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcbiAgICAgICAgdmFyIHJlY29yZGVyICAgPSByZXN1bHRzWzBdO1xuICAgICAgICB2YXIgcmVjb2duaXplciA9IHJlc3VsdHNbMV07XG4gICAgICAgIHJlY29yZGVyLmNvbnN1bWVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IFByb21pc2UuYWxsKFtpbml0X3JlY29nbml6ZXIsIHNldF9jb25zdW1lcl0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2luaXRpYWxpemVkO1xufTtcbi8vIFRoaXMgYWRkcyB3b3JkcyB0byB0aGUgcmVjb2duaXplclxuU3BoaW54LnByb3RvdHlwZS5hZGRXb3JkcyA9IGZ1bmN0aW9uKHdvcmRzKSB7XG4gIHJldHVybiB0aGlzLnJlY29nbml6ZXJcbiAgICAudGhlbih0aGlzLl9wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnYWRkV29yZHMnLFxuICAgICAgZGF0YTogICAgd29yZHNcbiAgICB9KSk7XG59O1xuXG5TcGhpbngucHJvdG90eXBlLnByb2Nlc3NFeGlzdGluZ0NodW5rID0gKGlucHV0QnVmZmVyKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucmVjb2duaXplclxuICAgICAgICAudGhlbih0aGlzLl9wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21tYW5kOiAncHJvY2Vzc0J1ZmZlcicsXG4gICAgICAgICAgICBkYXRhOiB7IGRhdGE6IFtdLCBidWZmZXI6IGJ1ZmZlciB9XG4gICAgICAgIH0pKVxufVxuLy8gVGhpcyBhZGRzIGEgZ3JhbW1hciB0byB0aGUgcmVjb2duaXplclxuU3BoaW54LnByb3RvdHlwZS5hZGRHcmFtbWFyID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gdGhpcy5yZWNvZ25pemVyXG4gICAgLnRoZW4odGhpcy5fcG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ2FkZEdyYW1tYXInLFxuICAgICAgZGF0YTogICAgZ3JhbW1hclxuICAgIH0pKTtcbn07XG4vLyBUaGlzIGFkZHMgd29yZHMgYW5kIGEgZ3JhbW1hciB0byB0aGUgcmVjb2duaXplclxuU3BoaW54LnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbih3b3JkcywgZ3JhbW1hcil7XG4gIGNvbnN0IGluaXRpYWwgPSB0aGlzLmluaXRpYWxpemUoKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkV29yZHMod29yZHMpO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRHcmFtbWFyKGdyYW1tYXIpO1xuICAgIH0pO1xuICAgIHJldHVybiBpbml0aWFsXG59O1xuXG5cblNwaGlueC5wcm90b3R5cGUuX3N0YXJ0UmVjb3JkZXIgICA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBnZXRNaWNyb3Bob25lKClcbiAgICAudGhlbigoaW5wdXQpID0+IHtcbiAgICAgIC8vIE9uY2UgdGhlIHVzZXIgYXV0aG9yaXNlcyBhY2Nlc3MgdG8gdGhlIG1pY3JvcGhvbmUsIHdlIGluc3RhbnRpYXRlIHRoZSByZWNvcmRlclxuICAgICAgcmV0dXJuIG5ldyBBdWRpb1JlY29yZGVyKGlucHV0LCB7XG4gICAgICAgIGVycm9yQ2FsbGJhY2s6IGZ1bmN0aW9uKCkgeyAvKiA/Pz8gKi8gfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbn07XG5TcGhpbngucHJvdG90eXBlLl9zdGFydFJlY29nbml6ZXIgPSBmdW5jdGlvbigpe1xuICAgIGNvbnN0IHdvcmtlciA9IG5ldyByZWNvZ1dvcmtlcigpO1xuICAgIC8vTm90IHJlYnVpbGRpbmdcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNvbHZlKHdvcmtlcik7XG4gICAgICAgIH07XG4gICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSgnJyk7XG4gICAgfSlcbiAgICByZXR1cm4gcHJvbWlzZVxufTtcblNwaGlueC5wcm90b3R5cGUuX2luaXRSZWNvZ25pemVyID0gZnVuY3Rpb24od29ya2VyKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRoaXMgaXMgdGhlIG9ubWVzc2FnZSBmdW5jdGlvbiwgb25jZSB0aGUgd29ya2VyIGlzIGZ1bGx5IGxvYWRlZFxuICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVuIHdlIGhhdmUgYSBjYWxsYmFjayBpZCB0byBiZSBjYWxsZWRcbiAgICBpZiAoZXZ0LmRhdGEuaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgIHZhciBjYiA9IHNlbGYuX2NhbGxiYWNrTWFuYWdlci5nZXQoZXZ0LmRhdGEuaWQpO1xuICAgICAgaWYoY2Ipe1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBpZiAoZXZ0LmRhdGEuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSl7XG4gICAgICAgICAgZGF0YSA9IGV2dC5kYXRhLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgY2IoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSBjYXNlIHdoZW4gdGhlIHJlY29nbml6ZXIgaGFzIGEgbmV3IGh5cG90aGVzaXNcbiAgICBpZiAoZXZ0LmRhdGEuaGFzT3duUHJvcGVydHkoJ2h5cCcpKSB7XG4gICAgICBzZWxmLm9ucmVjb2duaXRpb24oZXZ0KTtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVuIHdlIGhhdmUgYW4gZXJyb3JcbiAgICBpZiAoZXZ0LmRhdGEuaGFzT3duUHJvcGVydHkoJ3N0YXR1cycpICYmIChldnQuZGF0YS5zdGF0dXMgPT09ICdlcnJvcicpKSB7XG4gICAgICBzZWxmLm9uZXJyb3IoZXZ0KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHdvcmtlcjtcbn07XG5TcGhpbngucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uKG1zZyl7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2NhbGxiYWNrTWFuYWdlcjtcblxuICAgIHJldHVybiBmdW5jdGlvbih3b3JrZXIpe1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gbXNnIHx8IHt9O1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbWVzc2FnZS5jYWxsYmFja0lkID0gbWFuYWdlci5hZGQocmVzb2x2ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfSlcbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcGhpbng7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVjb3JkV29ya2VyID0gcmVxdWlyZSgnLi4vd29ya2VyL2F1ZGlvLXJlY29yZGVyLndvcmtlci5qcycpXG5cbnZhciBBdWRpb1JlY29yZGVyID0gZnVuY3Rpb24oc291cmNlLCBjZmcpIHtcbiAgdmFyIGNvbmZpZyAgICAgICAgICAgICA9IGNmZyB8fCB7fTtcbiAgdmFyIGVycm9yQ2FsbGJhY2sgICAgICA9IGNvbmZpZy5lcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gIHZhciBpbnB1dEJ1ZmZlckxlbmd0aCAgPSBjb25maWcuaW5wdXRCdWZmZXJMZW5ndGggfHwgNDA5NjtcbiAgdmFyIG91dHB1dEJ1ZmZlckxlbmd0aCA9IGNvbmZpZy5vdXRwdXRCdWZmZXJMZW5ndGggfHwgNDAwMDtcbiAgdmFyIHdvcmtlciAgICAgICAgICAgICA9IG5ldyByZWNvcmRXb3JrZXIoKVxuXG4gIHRoaXMuY29uc3VtZXJzID0gW107XG4gIHRoaXMuY29udGV4dCAgID0gc291cmNlLmNvbnRleHQ7XG4gIHRoaXMubm9kZSAgICAgID0gdGhpcy5jb250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihpbnB1dEJ1ZmZlckxlbmd0aCk7XG4gIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgY29tbWFuZDogJ2luaXQnLFxuICAgIGNvbmZpZzoge1xuICAgICAgc2FtcGxlUmF0ZTogICAgICAgICB0aGlzLmNvbnRleHQuc2FtcGxlUmF0ZSxcbiAgICAgIG91dHB1dEJ1ZmZlckxlbmd0aDogb3V0cHV0QnVmZmVyTGVuZ3RoLFxuICAgICAgb3V0cHV0U2FtcGxlUmF0ZTogICAoY29uZmlnLm91dHB1dFNhbXBsZVJhdGUgfHwgMTYwMDApXG4gICAgfVxuICB9KTtcblxuICB2YXIgcmVjb3JkaW5nID0gZmFsc2U7XG4gIHRoaXMubm9kZS5vbmF1ZGlvcHJvY2VzcyA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoIXJlY29yZGluZyl7IHJldHVybjsgfVxuICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAncmVjb3JkJyxcbiAgICAgIGJ1ZmZlcjogW1xuICAgICAgICBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxuICAgICAgICBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDEpXG4gICAgICBdXG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmNvbnN1bWVycy5mb3JFYWNoKGZ1bmN0aW9uKGNvbnN1bWVyKSB7XG4gICAgICBjb25zdW1lci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdzdGFydCcsIGRhdGE6IGRhdGEgfSk7XG4gICAgICByZWNvcmRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgcmVjb3JkaW5nID0gdHJ1ZTtcbiAgICByZXR1cm4gKHRoaXMuY29uc3VtZXJzLmxlbmd0aCA+IDApO1xuICB9O1xuICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocmVjb3JkaW5nKSB7XG4gICAgICB0aGlzLmNvbnN1bWVycy5mb3JFYWNoKGZ1bmN0aW9uKGNvbnN1bWVyKSB7XG4gICAgICAgIGNvbnN1bWVyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ3N0b3AnIH0pO1xuICAgICAgfSk7XG4gICAgICByZWNvcmRpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgd29ya2VyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ2NsZWFyJyB9KTtcbiAgfTtcbiAgdGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUuZGF0YS5lcnJvciAmJiAoZS5kYXRhLmVycm9yID09PSAnc2lsZW50Jykpe1xuICAgICAgZXJyb3JDYWxsYmFjaygnc2lsZW50Jyk7XG4gICAgfVxuICAgIGlmICgoZS5kYXRhLmNvbW1hbmQgPT09ICduZXdCdWZmZXInKSAmJiByZWNvcmRpbmcpIHtcbiAgICAgIHRoYXQuY29uc3VtZXJzLmZvckVhY2goZnVuY3Rpb24oY29uc3VtZXIpIHtcbiAgICAgICAgY29uc3VtZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAncHJvY2VzcycsIGRhdGE6IGUuZGF0YS5kYXRhIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBzb3VyY2UuY29ubmVjdCh0aGlzLm5vZGUpO1xuICB0aGlzLm5vZGUuY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvUmVjb3JkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYWxsYmFja01hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRJZCA9IDA7XG4gIHZhciBjYWxsYmFja1Bvb2wgPSB7fTtcbiAgdGhpcy5hZGQgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpZCA9IGN1cnJlbnRJZDtcbiAgICBjYWxsYmFja1Bvb2xbaWRdID0gY2I7XG4gICAgY3VycmVudElkKys7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuICB0aGlzLmdldCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgaWYgKGNhbGxiYWNrUG9vbC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgIHZhciBjYiA9IGNhbGxiYWNrUG9vbFtpZF07XG4gICAgICBkZWxldGUgY2FsbGJhY2tQb29sW2lkXTtcbiAgICAgIHJldHVybiBjYjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FsbGJhY2tNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vL0hhbmRsZSB2ZW5kb3IgcHJlZml4ZXNcbnZhciBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG52YXIgZ2V0VXNlck1lZGlhID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWE7XG5cblxuZnVuY3Rpb24gZ2V0TWljcm9waG9uZSgpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHZhciBhdWRpb0NvbnRleHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICAvL0luaXRpYWxpemUgTWljcm9waG9uZVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZ2V0VXNlck1lZGlhLmNhbGwobmF2aWdhdG9yLCB7YXVkaW86IHRydWV9LFxuICAgICAgICAgICAgICAgIC8vU3VjY2VzczpcbiAgICAgICAgICAgICAgICAoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IGhhY2sgaHR0cHM6Ly9zdXBwb3J0Lm1vemlsbGEub3JnL2VuLVVTL3F1ZXN0aW9ucy85ODQxNzlcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmZpcmVmb3hfYXVkaW9faGFjayA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vRmFpbHVyZVxuICAgICAgICAgICAgICAgIChlKSA9PiB7IHJlamVjdChlKTsgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNaWNyb3Bob25lO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjExYzliNGRjZjE5MWViNzU0YTdmLndvcmtlci5qc1wiKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjhmMWQyMjdlNmM5ZTNlZWQ5YzkxLndvcmtlci5qc1wiKTtcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==