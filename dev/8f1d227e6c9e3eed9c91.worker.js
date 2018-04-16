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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker/recognizer.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/worker/recognizer.worker.js":
/*!*****************************************!*\
  !*** ./src/worker/recognizer.worker.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global importScripts, Module */

function startup(onMessage) {
    self.onmessage = function(event) {
        const pocketsphinxJS = (event.data && event.data.length && (event.data.length > 0)) ? event.data : './pocketsphinx.js';
        importScripts(pocketsphinxJS);
        self.onmessage = onMessage;
        self.postMessage({});
    };
}

startup(function(event) {
  /* jshint indent:false */
  switch(event.data.command){
    case 'initialize':
      initialize(event.data.data, event.data.callbackId);
      break;
    case 'load':
      load(event.data.data, event.data.callbackId);
      break;
    case 'addWords':
      addWords(event.data.data, event.data.callbackId);
      break;
    case 'addGrammar':
      addGrammar(event.data.data, event.data.callbackId);
      break;
    case 'addKeyword':
      addKeyword(event.data.data, event.data.callbackId);
      break;
    case 'start':
      start(event.data.data);
      break;
    case 'stop':
      stop();
      break;
    case 'process':
      process(event.data.data);
      break;
    case 'proccessBufer':
      processBuffer(event.data.data, event.data.buffer)
      break;
    }
});

var post = function(message) {
  self.postMessage(message);
};

var recognizer;
var buffer;
var segmentation;

function initialize(data, clbId) {
  var config = new Module.Config();
  buffer = new Module.AudioBuffer();

  if (data) {
    while (data.length > 0) {
      var p = data.pop();
      if (p.length === 2) {
        config.push_back([p[0],p[1]]);
      } else {
        post({status: 'error', command: 'initialize', code: 'js-data'});
      }
    }
  }
  var output;

  if(recognizer) {
    output = recognizer.reInit(config);
    if (output !== Module.ReturnType.SUCCESS){ post({status: 'error', command: 'initialize', code: output}); }
  } else {
    recognizer = new Module.Recognizer(config);
    segmentation = new Module.Segmentation();

    if (recognizer === undefined){
      post({status: 'error', command: 'initialize', code: Module.ReturnType.RUNTIME_ERROR});
    } else {
      post({status: 'done', command: 'initialize', id: clbId});
    }
  }
  config.delete();
}

function load(data, clbId) {
  try {
    importScripts.apply(this, data);
    post({status: 'done', command: 'load', id: clbId});
  } catch(e) {
    post({status: 'error', command: 'load', code: 'NETWORK_ERROR'});
  }
}

function addWords(data, clbId) {
  if (recognizer) {
    var words = new Module.VectorWords();
    for (var i = 0 ; i < data.length ; i++) {
      var w = data[i];
      if (w.length === 2){ words.push_back([w[0], w[1]]); }
    }
    var output = recognizer.addWords(words);
    if (output !== Module.ReturnType.SUCCESS) {
      post({status: 'error', command: 'addWords', code: output});
    } else {
      post({id: clbId});
    }
    words.delete();
  } else {
    post({status: 'error', command: 'addWords', code: 'js-no-recognizer'});
  }
}

function addGrammar(data, clbId) {
  var output;
  if (recognizer) {
    if (data.hasOwnProperty('numStates') && data.numStates > 0 &&
        data.hasOwnProperty('start') &&
        data.hasOwnProperty('end') &&
        data.hasOwnProperty('transitions') && data.transitions.length > 0) {

      var transitions = new Module.VectorTransitions();
      while (data.transitions.length > 0) {
        var t = data.transitions.pop();
        if (t.hasOwnProperty('from') && t.hasOwnProperty('to')) {
          if (!t.hasOwnProperty('word')){ t.word = ''; }
          if (!t.hasOwnProperty('logp')){ t.logp = 0; }
          transitions.push_back(t);
        }
      }
      var id_v = new Module.Integers();
      output = recognizer.addGrammar(id_v, {start: data.start, end: data.end, numStates: data.numStates, transitions: transitions});
      if (output !== Module.ReturnType.SUCCESS){
        post({status: 'error', command: 'addGrammar', code: output});
      } else {
        post({id: clbId, data: id_v.get(0), status: 'done', command: 'addGrammar'});
      }

      transitions.delete();
      id_v.delete();
    } else {
      post({status: 'error', command: 'addGrammar', code: 'js-data'});
    }
  } else {
    post({status: 'error', command: 'addGrammar', code: 'js-no-recognizer'});
  }
}

function addKeyword(data, clbId) {
  var output;
  if (recognizer) {
    if (data.length > 0) {
      var id_v = new Module.Integers();
      output = recognizer.addKeyword(id_v, data);
      if (output !== Module.ReturnType.SUCCESS){
        post({status: 'error', command: 'addKeyword', code: output});
      } else {
        post({id: clbId, data: id_v.get(0), status: 'done', command: 'addKeyword'});
      }
      id_v.delete();
    } else {
      post({status: 'error', command: 'addKeyword', code: 'js-data'});
    }
  } else {
    post({status: 'error', command: 'addKeyword', code: 'js-no-recognizer'});
  }
}

function start(id) {
  if (recognizer) {
    var output;
    if (id) {
      output = recognizer.switchSearch(parseInt(id, 10));
      if (output !== Module.ReturnType.SUCCESS) {
        post({status: 'error', command: 'switchgrammar', code: output});
        return;
      }
    }
    output = recognizer.start();
    if (output !== Module.ReturnType.SUCCESS) {
      post({status: 'error', command: 'start', code: output});
    }
  } else {
    post({status: 'error', command: 'start', code: 'js-no-recognizer'});
  }
}

function stop() {
  if (recognizer) {
    var output = recognizer.stop();
    if (output !== Module.ReturnType.SUCCESS){
      post({status: 'error', command: 'stop', code: output});
    } else {
      recognizer.getHypseg(segmentation);
      post({
        hyp: recognizer.getHyp(),
        hypseg: segmentation,
        'final': true
      });
    }
  } else {
    post({status: 'error', command: 'stop', code: 'js-no-recognizer'});
  }
}

function process(array) {
  if (recognizer) {
    while (buffer.size() < array.length){
      buffer.push_back(0);
    }
    for (var i = 0 ; i < array.length ; i++){
      buffer.set(i, array[i]);
    }
    var output = recognizer.process(buffer);
    if (output !== Module.ReturnType.SUCCESS){
      post({status: 'error', command: 'process', code: output});
    } else {
      recognizer.getHypseg(segmentation);
      post({
        hyp: recognizer.getHyp(),
        hypseg: segmentation
      });
    }
  } else {
    post({status: 'error', command: 'process', code: 'js-no-recognizer'});
  }
}
function processBuffer(array, buffer) {
  if (recognizer) {
    while (buffer.size() < array.length){
      buffer.push_back(0);
    }
    for (var i = 0 ; i < array.length ; i++){
      buffer.set(i, array[i]);
    }
    var output = recognizer.process(buffer);
    if (output !== Module.ReturnType.SUCCESS){
      post({status: 'error', command: 'process', code: output});
    } else {
      recognizer.getHypseg(segmentation);
      post({
        hyp: recognizer.getHyp(),
        hypseg: segmentation
      });
    }
  } else {
    post({status: 'error', command: 'process', code: 'js-no-recognizer'});
  }
}



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dvcmtlci9yZWNvZ25pemVyLndvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLGNBQWMsd0RBQXdEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4Q0FBOEMsT0FBTyxxREFBcUQsRUFBRTtBQUM1RyxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLFlBQVksOEVBQThFO0FBQzFGLEtBQUs7QUFDTCxZQUFZLGlEQUFpRDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDJDQUEyQztBQUNyRCxHQUFHO0FBQ0gsVUFBVSx3REFBd0Q7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0EsMEJBQTBCLCtCQUErQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1EQUFtRDtBQUMvRCxLQUFLO0FBQ0wsWUFBWSxVQUFVO0FBQ3RCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsVUFBVSwrREFBK0Q7QUFDekU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxhQUFhO0FBQ3RELHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLHNGQUFzRjtBQUNsSTtBQUNBLGNBQWMscURBQXFEO0FBQ25FLE9BQU87QUFDUCxjQUFjLG9FQUFvRTtBQUNsRjs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVksd0RBQXdEO0FBQ3BFO0FBQ0EsR0FBRztBQUNILFVBQVUsaUVBQWlFO0FBQzNFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLHFEQUFxRDtBQUNuRSxPQUFPO0FBQ1AsY0FBYyxvRUFBb0U7QUFDbEY7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZLHdEQUF3RDtBQUNwRTtBQUNBLEdBQUc7QUFDSCxVQUFVLGlFQUFpRTtBQUMzRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsd0RBQXdEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGdEQUFnRDtBQUM1RDtBQUNBLEdBQUc7QUFDSCxVQUFVLDREQUE0RDtBQUN0RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQ0FBK0M7QUFDM0QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0gsVUFBVSwyREFBMkQ7QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0RBQWtEO0FBQzlELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSCxVQUFVLDhEQUE4RDtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGtEQUFrRDtBQUM5RCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0gsVUFBVSw4REFBOEQ7QUFDeEU7QUFDQSIsImZpbGUiOiI4ZjFkMjI3ZTZjOWUzZWVkOWM5MS53b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvd29ya2VyL3JlY29nbml6ZXIud29ya2VyLmpzXCIpO1xuIiwiLyogZ2xvYmFsIGltcG9ydFNjcmlwdHMsIE1vZHVsZSAqL1xuJ3VzZSBzdHJpY3QnO1xuZnVuY3Rpb24gc3RhcnR1cChvbk1lc3NhZ2UpIHtcbiAgICBzZWxmLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHBvY2tldHNwaGlueEpTID0gKGV2ZW50LmRhdGEgJiYgZXZlbnQuZGF0YS5sZW5ndGggJiYgKGV2ZW50LmRhdGEubGVuZ3RoID4gMCkpID8gZXZlbnQuZGF0YSA6ICcuL3BvY2tldHNwaGlueC5qcyc7XG4gICAgICAgIGltcG9ydFNjcmlwdHMocG9ja2V0c3BoaW54SlMpO1xuICAgICAgICBzZWxmLm9ubWVzc2FnZSA9IG9uTWVzc2FnZTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7fSk7XG4gICAgfTtcbn1cblxuc3RhcnR1cChmdW5jdGlvbihldmVudCkge1xuICAvKiBqc2hpbnQgaW5kZW50OmZhbHNlICovXG4gIHN3aXRjaChldmVudC5kYXRhLmNvbW1hbmQpe1xuICAgIGNhc2UgJ2luaXRpYWxpemUnOlxuICAgICAgaW5pdGlhbGl6ZShldmVudC5kYXRhLmRhdGEsIGV2ZW50LmRhdGEuY2FsbGJhY2tJZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsb2FkJzpcbiAgICAgIGxvYWQoZXZlbnQuZGF0YS5kYXRhLCBldmVudC5kYXRhLmNhbGxiYWNrSWQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYWRkV29yZHMnOlxuICAgICAgYWRkV29yZHMoZXZlbnQuZGF0YS5kYXRhLCBldmVudC5kYXRhLmNhbGxiYWNrSWQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYWRkR3JhbW1hcic6XG4gICAgICBhZGRHcmFtbWFyKGV2ZW50LmRhdGEuZGF0YSwgZXZlbnQuZGF0YS5jYWxsYmFja0lkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2FkZEtleXdvcmQnOlxuICAgICAgYWRkS2V5d29yZChldmVudC5kYXRhLmRhdGEsIGV2ZW50LmRhdGEuY2FsbGJhY2tJZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdGFydCc6XG4gICAgICBzdGFydChldmVudC5kYXRhLmRhdGEpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RvcCc6XG4gICAgICBzdG9wKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwcm9jZXNzJzpcbiAgICAgIHByb2Nlc3MoZXZlbnQuZGF0YS5kYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3Byb2NjZXNzQnVmZXInOlxuICAgICAgcHJvY2Vzc0J1ZmZlcihldmVudC5kYXRhLmRhdGEsIGV2ZW50LmRhdGEuYnVmZmVyKVxuICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG5cbnZhciBwb3N0ID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICBzZWxmLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufTtcblxudmFyIHJlY29nbml6ZXI7XG52YXIgYnVmZmVyO1xudmFyIHNlZ21lbnRhdGlvbjtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShkYXRhLCBjbGJJZCkge1xuICB2YXIgY29uZmlnID0gbmV3IE1vZHVsZS5Db25maWcoKTtcbiAgYnVmZmVyID0gbmV3IE1vZHVsZS5BdWRpb0J1ZmZlcigpO1xuXG4gIGlmIChkYXRhKSB7XG4gICAgd2hpbGUgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHAgPSBkYXRhLnBvcCgpO1xuICAgICAgaWYgKHAubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbmZpZy5wdXNoX2JhY2soW3BbMF0scFsxXV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnaW5pdGlhbGl6ZScsIGNvZGU6ICdqcy1kYXRhJ30pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIgb3V0cHV0O1xuXG4gIGlmKHJlY29nbml6ZXIpIHtcbiAgICBvdXRwdXQgPSByZWNvZ25pemVyLnJlSW5pdChjb25maWcpO1xuICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1MpeyBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdpbml0aWFsaXplJywgY29kZTogb3V0cHV0fSk7IH1cbiAgfSBlbHNlIHtcbiAgICByZWNvZ25pemVyID0gbmV3IE1vZHVsZS5SZWNvZ25pemVyKGNvbmZpZyk7XG4gICAgc2VnbWVudGF0aW9uID0gbmV3IE1vZHVsZS5TZWdtZW50YXRpb24oKTtcblxuICAgIGlmIChyZWNvZ25pemVyID09PSB1bmRlZmluZWQpe1xuICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnaW5pdGlhbGl6ZScsIGNvZGU6IE1vZHVsZS5SZXR1cm5UeXBlLlJVTlRJTUVfRVJST1J9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zdCh7c3RhdHVzOiAnZG9uZScsIGNvbW1hbmQ6ICdpbml0aWFsaXplJywgaWQ6IGNsYklkfSk7XG4gICAgfVxuICB9XG4gIGNvbmZpZy5kZWxldGUoKTtcbn1cblxuZnVuY3Rpb24gbG9hZChkYXRhLCBjbGJJZCkge1xuICB0cnkge1xuICAgIGltcG9ydFNjcmlwdHMuYXBwbHkodGhpcywgZGF0YSk7XG4gICAgcG9zdCh7c3RhdHVzOiAnZG9uZScsIGNvbW1hbmQ6ICdsb2FkJywgaWQ6IGNsYklkfSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHBvc3Qoe3N0YXR1czogJ2Vycm9yJywgY29tbWFuZDogJ2xvYWQnLCBjb2RlOiAnTkVUV09SS19FUlJPUid9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRXb3JkcyhkYXRhLCBjbGJJZCkge1xuICBpZiAocmVjb2duaXplcikge1xuICAgIHZhciB3b3JkcyA9IG5ldyBNb2R1bGUuVmVjdG9yV29yZHMoKTtcbiAgICBmb3IgKHZhciBpID0gMCA7IGkgPCBkYXRhLmxlbmd0aCA7IGkrKykge1xuICAgICAgdmFyIHcgPSBkYXRhW2ldO1xuICAgICAgaWYgKHcubGVuZ3RoID09PSAyKXsgd29yZHMucHVzaF9iYWNrKFt3WzBdLCB3WzFdXSk7IH1cbiAgICB9XG4gICAgdmFyIG91dHB1dCA9IHJlY29nbml6ZXIuYWRkV29yZHMod29yZHMpO1xuICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1MpIHtcbiAgICAgIHBvc3Qoe3N0YXR1czogJ2Vycm9yJywgY29tbWFuZDogJ2FkZFdvcmRzJywgY29kZTogb3V0cHV0fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3Qoe2lkOiBjbGJJZH0pO1xuICAgIH1cbiAgICB3b3Jkcy5kZWxldGUoKTtcbiAgfSBlbHNlIHtcbiAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdhZGRXb3JkcycsIGNvZGU6ICdqcy1uby1yZWNvZ25pemVyJ30pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEdyYW1tYXIoZGF0YSwgY2xiSWQpIHtcbiAgdmFyIG91dHB1dDtcbiAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgnbnVtU3RhdGVzJykgJiYgZGF0YS5udW1TdGF0ZXMgPiAwICYmXG4gICAgICAgIGRhdGEuaGFzT3duUHJvcGVydHkoJ3N0YXJ0JykgJiZcbiAgICAgICAgZGF0YS5oYXNPd25Qcm9wZXJ0eSgnZW5kJykgJiZcbiAgICAgICAgZGF0YS5oYXNPd25Qcm9wZXJ0eSgndHJhbnNpdGlvbnMnKSAmJiBkYXRhLnRyYW5zaXRpb25zLmxlbmd0aCA+IDApIHtcblxuICAgICAgdmFyIHRyYW5zaXRpb25zID0gbmV3IE1vZHVsZS5WZWN0b3JUcmFuc2l0aW9ucygpO1xuICAgICAgd2hpbGUgKGRhdGEudHJhbnNpdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgdCA9IGRhdGEudHJhbnNpdGlvbnMucG9wKCk7XG4gICAgICAgIGlmICh0Lmhhc093blByb3BlcnR5KCdmcm9tJykgJiYgdC5oYXNPd25Qcm9wZXJ0eSgndG8nKSkge1xuICAgICAgICAgIGlmICghdC5oYXNPd25Qcm9wZXJ0eSgnd29yZCcpKXsgdC53b3JkID0gJyc7IH1cbiAgICAgICAgICBpZiAoIXQuaGFzT3duUHJvcGVydHkoJ2xvZ3AnKSl7IHQubG9ncCA9IDA7IH1cbiAgICAgICAgICB0cmFuc2l0aW9ucy5wdXNoX2JhY2sodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBpZF92ID0gbmV3IE1vZHVsZS5JbnRlZ2VycygpO1xuICAgICAgb3V0cHV0ID0gcmVjb2duaXplci5hZGRHcmFtbWFyKGlkX3YsIHtzdGFydDogZGF0YS5zdGFydCwgZW5kOiBkYXRhLmVuZCwgbnVtU3RhdGVzOiBkYXRhLm51bVN0YXRlcywgdHJhbnNpdGlvbnM6IHRyYW5zaXRpb25zfSk7XG4gICAgICBpZiAob3V0cHV0ICE9PSBNb2R1bGUuUmV0dXJuVHlwZS5TVUNDRVNTKXtcbiAgICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnYWRkR3JhbW1hcicsIGNvZGU6IG91dHB1dH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zdCh7aWQ6IGNsYklkLCBkYXRhOiBpZF92LmdldCgwKSwgc3RhdHVzOiAnZG9uZScsIGNvbW1hbmQ6ICdhZGRHcmFtbWFyJ30pO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2l0aW9ucy5kZWxldGUoKTtcbiAgICAgIGlkX3YuZGVsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3Qoe3N0YXR1czogJ2Vycm9yJywgY29tbWFuZDogJ2FkZEdyYW1tYXInLCBjb2RlOiAnanMtZGF0YSd9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnYWRkR3JhbW1hcicsIGNvZGU6ICdqcy1uby1yZWNvZ25pemVyJ30pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEtleXdvcmQoZGF0YSwgY2xiSWQpIHtcbiAgdmFyIG91dHB1dDtcbiAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgaWRfdiA9IG5ldyBNb2R1bGUuSW50ZWdlcnMoKTtcbiAgICAgIG91dHB1dCA9IHJlY29nbml6ZXIuYWRkS2V5d29yZChpZF92LCBkYXRhKTtcbiAgICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1Mpe1xuICAgICAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdhZGRLZXl3b3JkJywgY29kZTogb3V0cHV0fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3N0KHtpZDogY2xiSWQsIGRhdGE6IGlkX3YuZ2V0KDApLCBzdGF0dXM6ICdkb25lJywgY29tbWFuZDogJ2FkZEtleXdvcmQnfSk7XG4gICAgICB9XG4gICAgICBpZF92LmRlbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdhZGRLZXl3b3JkJywgY29kZTogJ2pzLWRhdGEnfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBvc3Qoe3N0YXR1czogJ2Vycm9yJywgY29tbWFuZDogJ2FkZEtleXdvcmQnLCBjb2RlOiAnanMtbm8tcmVjb2duaXplcid9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdGFydChpZCkge1xuICBpZiAocmVjb2duaXplcikge1xuICAgIHZhciBvdXRwdXQ7XG4gICAgaWYgKGlkKSB7XG4gICAgICBvdXRwdXQgPSByZWNvZ25pemVyLnN3aXRjaFNlYXJjaChwYXJzZUludChpZCwgMTApKTtcbiAgICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1MpIHtcbiAgICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnc3dpdGNoZ3JhbW1hcicsIGNvZGU6IG91dHB1dH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIG91dHB1dCA9IHJlY29nbml6ZXIuc3RhcnQoKTtcbiAgICBpZiAob3V0cHV0ICE9PSBNb2R1bGUuUmV0dXJuVHlwZS5TVUNDRVNTKSB7XG4gICAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdzdGFydCcsIGNvZGU6IG91dHB1dH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdzdGFydCcsIGNvZGU6ICdqcy1uby1yZWNvZ25pemVyJ30pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gIGlmIChyZWNvZ25pemVyKSB7XG4gICAgdmFyIG91dHB1dCA9IHJlY29nbml6ZXIuc3RvcCgpO1xuICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1Mpe1xuICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAnc3RvcCcsIGNvZGU6IG91dHB1dH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvZ25pemVyLmdldEh5cHNlZyhzZWdtZW50YXRpb24pO1xuICAgICAgcG9zdCh7XG4gICAgICAgIGh5cDogcmVjb2duaXplci5nZXRIeXAoKSxcbiAgICAgICAgaHlwc2VnOiBzZWdtZW50YXRpb24sXG4gICAgICAgICdmaW5hbCc6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdzdG9wJywgY29kZTogJ2pzLW5vLXJlY29nbml6ZXInfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvY2VzcyhhcnJheSkge1xuICBpZiAocmVjb2duaXplcikge1xuICAgIHdoaWxlIChidWZmZXIuc2l6ZSgpIDwgYXJyYXkubGVuZ3RoKXtcbiAgICAgIGJ1ZmZlci5wdXNoX2JhY2soMCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IGFycmF5Lmxlbmd0aCA7IGkrKyl7XG4gICAgICBidWZmZXIuc2V0KGksIGFycmF5W2ldKTtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9IHJlY29nbml6ZXIucHJvY2VzcyhidWZmZXIpO1xuICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1Mpe1xuICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAncHJvY2VzcycsIGNvZGU6IG91dHB1dH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvZ25pemVyLmdldEh5cHNlZyhzZWdtZW50YXRpb24pO1xuICAgICAgcG9zdCh7XG4gICAgICAgIGh5cDogcmVjb2duaXplci5nZXRIeXAoKSxcbiAgICAgICAgaHlwc2VnOiBzZWdtZW50YXRpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdwcm9jZXNzJywgY29kZTogJ2pzLW5vLXJlY29nbml6ZXInfSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHByb2Nlc3NCdWZmZXIoYXJyYXksIGJ1ZmZlcikge1xuICBpZiAocmVjb2duaXplcikge1xuICAgIHdoaWxlIChidWZmZXIuc2l6ZSgpIDwgYXJyYXkubGVuZ3RoKXtcbiAgICAgIGJ1ZmZlci5wdXNoX2JhY2soMCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IGFycmF5Lmxlbmd0aCA7IGkrKyl7XG4gICAgICBidWZmZXIuc2V0KGksIGFycmF5W2ldKTtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9IHJlY29nbml6ZXIucHJvY2VzcyhidWZmZXIpO1xuICAgIGlmIChvdXRwdXQgIT09IE1vZHVsZS5SZXR1cm5UeXBlLlNVQ0NFU1Mpe1xuICAgICAgcG9zdCh7c3RhdHVzOiAnZXJyb3InLCBjb21tYW5kOiAncHJvY2VzcycsIGNvZGU6IG91dHB1dH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvZ25pemVyLmdldEh5cHNlZyhzZWdtZW50YXRpb24pO1xuICAgICAgcG9zdCh7XG4gICAgICAgIGh5cDogcmVjb2duaXplci5nZXRIeXAoKSxcbiAgICAgICAgaHlwc2VnOiBzZWdtZW50YXRpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwb3N0KHtzdGF0dXM6ICdlcnJvcicsIGNvbW1hbmQ6ICdwcm9jZXNzJywgY29kZTogJ2pzLW5vLXJlY29nbml6ZXInfSk7XG4gIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==