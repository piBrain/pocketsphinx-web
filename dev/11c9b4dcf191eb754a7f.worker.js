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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker/audio-recorder.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/worker/audio-recorder.worker.js":
/*!*********************************************!*\
  !*** ./src/worker/audio-recorder.worker.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var recBuffers = [], outputSampleRate = 16000, inSampleRate, outputBufferLength;

self.onmessage = function(e){
  /* jshint indent: false */
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config){
  inSampleRate = config.sampleRate;
  outputBufferLength = config.outputBufferLength;
  outputSampleRate = config.outputSampleRate || outputSampleRate;
}

function record(inputBuffer){
  var isSilent = true;
  for (var i = 0 ; i < inputBuffer[0].length ; i++) {
    recBuffers.push((inputBuffer[0][i] + inputBuffer[1][i]) * 16383.0);
  }
  while(recBuffers.length * outputSampleRate / inSampleRate > outputBufferLength) {
    var result = new Int16Array(outputBufferLength);
    var bin = 0, num = 0, indexIn = 0, indexOut = 0;

    while(indexIn < outputBufferLength) {
      bin = 0;
      num = 0;
      while(indexOut < Math.min(recBuffers.length, (indexIn + 1) * inSampleRate / outputSampleRate)) {
        bin += recBuffers[indexOut];
        num += 1;
        indexOut++;
      }
      result[indexIn] = bin / num;
      if(isSilent && (result[indexIn] !== 0)) { isSilent = false; }
      indexIn++;
    }
    var output = {};
    output.command = 'newBuffer';
    output.data = result;
    if (isSilent){ output.error = 'silent'; }
    self.postMessage(output);
    recBuffers = recBuffers.slice(indexOut);
  }
}

function clear(){
  recBuffers = [];
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dvcmtlci9hdWRpby1yZWNvcmRlci53b3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNuRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsNEJBQTRCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLGtCQUFrQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMTFjOWI0ZGNmMTkxZWI3NTRhN2Yud29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3dvcmtlci9hdWRpby1yZWNvcmRlci53b3JrZXIuanNcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWNCdWZmZXJzID0gW10sIG91dHB1dFNhbXBsZVJhdGUgPSAxNjAwMCwgaW5TYW1wbGVSYXRlLCBvdXRwdXRCdWZmZXJMZW5ndGg7XG5cbnNlbGYub25tZXNzYWdlID0gZnVuY3Rpb24oZSl7XG4gIC8qIGpzaGludCBpbmRlbnQ6IGZhbHNlICovXG4gIHN3aXRjaChlLmRhdGEuY29tbWFuZCl7XG4gICAgY2FzZSAnaW5pdCc6XG4gICAgICBpbml0KGUuZGF0YS5jb25maWcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVjb3JkJzpcbiAgICAgIHJlY29yZChlLmRhdGEuYnVmZmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NsZWFyJzpcbiAgICAgIGNsZWFyKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuZnVuY3Rpb24gaW5pdChjb25maWcpe1xuICBpblNhbXBsZVJhdGUgPSBjb25maWcuc2FtcGxlUmF0ZTtcbiAgb3V0cHV0QnVmZmVyTGVuZ3RoID0gY29uZmlnLm91dHB1dEJ1ZmZlckxlbmd0aDtcbiAgb3V0cHV0U2FtcGxlUmF0ZSA9IGNvbmZpZy5vdXRwdXRTYW1wbGVSYXRlIHx8IG91dHB1dFNhbXBsZVJhdGU7XG59XG5cbmZ1bmN0aW9uIHJlY29yZChpbnB1dEJ1ZmZlcil7XG4gIHZhciBpc1NpbGVudCA9IHRydWU7XG4gIGZvciAodmFyIGkgPSAwIDsgaSA8IGlucHV0QnVmZmVyWzBdLmxlbmd0aCA7IGkrKykge1xuICAgIHJlY0J1ZmZlcnMucHVzaCgoaW5wdXRCdWZmZXJbMF1baV0gKyBpbnB1dEJ1ZmZlclsxXVtpXSkgKiAxNjM4My4wKTtcbiAgfVxuICB3aGlsZShyZWNCdWZmZXJzLmxlbmd0aCAqIG91dHB1dFNhbXBsZVJhdGUgLyBpblNhbXBsZVJhdGUgPiBvdXRwdXRCdWZmZXJMZW5ndGgpIHtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEludDE2QXJyYXkob3V0cHV0QnVmZmVyTGVuZ3RoKTtcbiAgICB2YXIgYmluID0gMCwgbnVtID0gMCwgaW5kZXhJbiA9IDAsIGluZGV4T3V0ID0gMDtcblxuICAgIHdoaWxlKGluZGV4SW4gPCBvdXRwdXRCdWZmZXJMZW5ndGgpIHtcbiAgICAgIGJpbiA9IDA7XG4gICAgICBudW0gPSAwO1xuICAgICAgd2hpbGUoaW5kZXhPdXQgPCBNYXRoLm1pbihyZWNCdWZmZXJzLmxlbmd0aCwgKGluZGV4SW4gKyAxKSAqIGluU2FtcGxlUmF0ZSAvIG91dHB1dFNhbXBsZVJhdGUpKSB7XG4gICAgICAgIGJpbiArPSByZWNCdWZmZXJzW2luZGV4T3V0XTtcbiAgICAgICAgbnVtICs9IDE7XG4gICAgICAgIGluZGV4T3V0Kys7XG4gICAgICB9XG4gICAgICByZXN1bHRbaW5kZXhJbl0gPSBiaW4gLyBudW07XG4gICAgICBpZihpc1NpbGVudCAmJiAocmVzdWx0W2luZGV4SW5dICE9PSAwKSkgeyBpc1NpbGVudCA9IGZhbHNlOyB9XG4gICAgICBpbmRleEluKys7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICBvdXRwdXQuY29tbWFuZCA9ICduZXdCdWZmZXInO1xuICAgIG91dHB1dC5kYXRhID0gcmVzdWx0O1xuICAgIGlmIChpc1NpbGVudCl7IG91dHB1dC5lcnJvciA9ICdzaWxlbnQnOyB9XG4gICAgc2VsZi5wb3N0TWVzc2FnZShvdXRwdXQpO1xuICAgIHJlY0J1ZmZlcnMgPSByZWNCdWZmZXJzLnNsaWNlKGluZGV4T3V0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhcigpe1xuICByZWNCdWZmZXJzID0gW107XG59XG4iXSwic291cmNlUm9vdCI6IiJ9