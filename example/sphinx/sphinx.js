(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Sphinx = require('./src/sphinx');

(function(){
  /* global define */
  if ((typeof define !== 'undefined' && define !== null) && (define.amd !== null)) {
    define([], function() {
      return Sphinx;
    });
  } else if ((typeof module !== 'undefined' && module !== null) && (module.exports !== null)) {
    module.exports = Sphinx;
  }

  this.Sphinx = Sphinx;
}).call(window || this);

},{"./src/sphinx":2}],2:[function(require,module,exports){
'use strict';

//Imports:
var AudioRecorder   = require('./util/audio-recorder');
var CallbackManager = require('./util/callback-manager');
var getMicrophone   = require('./util/get-microphone');

//Constructor
function Sphinx(path_to_workers){
  this.path_to_workers = path_to_workers || './worker';
  this._callbackManager = new CallbackManager();
  this.recorder         = this._startRecorder();
  this.recognizer       = this._startRecognizer();
}
//Control
Sphinx.prototype.startRecording = function(grammar_id){
  return this.recorder
    .then(function(recorder){
      recorder.start(grammar_id);
    });
};
Sphinx.prototype.stopRecording = function(){
  return this.recorder
    .then(function(recorder){
      recorder.stop();
    });
};
//Callbacks
Sphinx.prototype.onrecognition = function(){};

// This initializes the recognizer. When it calls back, we add words
Sphinx.prototype.initialize = function() {
  if(!this._initialized){
    var init_recognizer = this.recognizer
      .then(this._initRecognizer.bind(this))
      .then(this._postMessage({ command: 'initialize' }));

    var set_consumer = Promise.all([this.recorder, this.recognizer])
      .then(function(results){
        var recorder   = results[0];
        var recognizer = results[1];
        recorder.consumers.push(recognizer);
      });

    this._initialized = Promise.all([init_recognizer, set_consumer]);
  }

  return this._initialized;
};
// This adds words to the recognizer
Sphinx.prototype.addWords = function(words) {
  return this.recognizer
    .then(this._postMessage({
      command: 'addWords',
      data:    words
    }));
};

Sphinx.prototype.processExistingChunk = (inputBuffer) => {
    return this.recognizer
        .then(this._postMessage({
            command: 'processBuffer',
            data: { data: [], buffer: buffer }
        }))
}
// This adds a grammar to the recognizer
Sphinx.prototype.addGrammar = function(grammar) {
  return this.recognizer
    .then(this._postMessage({
      command: 'addGrammar',
      data:    grammar
    }));
};
// This adds words and a grammar to the recognizer
Sphinx.prototype.configure = function(words, grammar){
  const initial = this.initialize()
    .then(() => {
        console.log('12344444444');
        return this.addWords(words);
    })
    .then(() => {
        return this.addGrammar(grammar);
    });
    console.log(initial)
    return initial
};


Sphinx.prototype._startRecorder   = function(){
  var path_to_workers = this.path_to_workers;
  return getMicrophone()
    .then((input) => {
      // Once the user authorises access to the microphone, we instantiate the recorder
      return new AudioRecorder(input, {
        worker:        path_to_workers + '/audio-recorder-worker.js',
        errorCallback: function() { /* ??? */ }
      });
    });

};
Sphinx.prototype._startRecognizer = function(){
    const worker = new Worker(this.path_to_workers + '/recognizer.js');
    const promise = new Promise((resolve, reject) => {
        worker.onmessage = function() {
            resolve(worker);
        };
        worker.postMessage('');
    })
    return promise
};
Sphinx.prototype._initRecognizer = function(worker){
  var self = this;

  // This is the onmessage function, once the worker is fully loaded
  worker.onmessage = function(evt) {
    // This is the case when we have a callback id to be called
    if (evt.data.hasOwnProperty('id')) {
      var cb = self._callbackManager.get(evt.data.id);
      if(cb){
        var data = {};
        if (evt.data.hasOwnProperty('data')){
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
    if (evt.data.hasOwnProperty('status') && (evt.data.status === 'error')) {
      self.onerror(evt);
    }
  };

  return worker;
};
Sphinx.prototype._postMessage = function(msg){
    const manager = this._callbackManager;

    return function(worker){
        const message = msg || {};
        return new Promise((resolve, reject) => {
            message.callbackId = manager.add(resolve.bind(this));
            worker.postMessage(message);
        })
    };
};

module.exports = Sphinx;

},{"./util/audio-recorder":3,"./util/callback-manager":4,"./util/get-microphone":5}],3:[function(require,module,exports){
'use strict';

var AUDIO_RECORDER_WORKER = '/worker/audio-recorder-worker.js';

var AudioRecorder = function(source, cfg) {
  var config             = cfg || {};
  var errorCallback      = config.errorCallback || function() {};
  var inputBufferLength  = config.inputBufferLength || 4096;
  var outputBufferLength = config.outputBufferLength || 4000;
  var worker             = new Worker(config.worker || AUDIO_RECORDER_WORKER);

  this.consumers = [];
  this.context   = source.context;
  this.node      = this.context.createScriptProcessor(inputBufferLength);

  worker.postMessage({
    command: 'init',
    config: {
      sampleRate:         this.context.sampleRate,
      outputBufferLength: outputBufferLength,
      outputSampleRate:   (config.outputSampleRate || 16000)
    }
  });

  var recording = false;
  this.node.onaudioprocess = function(e) {
    if (!recording){ return; }
    worker.postMessage({
      command: 'record',
      buffer: [
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1)
      ]
    });
  };

  this.start = function(data) {
    this.consumers.forEach(function(consumer) {
      consumer.postMessage({ command: 'start', data: data });
      recording = true;
      return true;
    });
    recording = true;
    return (this.consumers.length > 0);
  };
  this.stop = function() {
    if (recording) {
      this.consumers.forEach(function(consumer) {
        consumer.postMessage({ command: 'stop' });
      });
      recording = false;
    }
    worker.postMessage({ command: 'clear' });
  };
  this.cancel = function() {
    this.stop();
  };

  var that = this;
  worker.onmessage = function(e) {
    if (e.data.error && (e.data.error === 'silent')){
      errorCallback('silent');
    }
    if ((e.data.command === 'newBuffer') && recording) {
      that.consumers.forEach(function(consumer) {
        consumer.postMessage({ command: 'process', data: e.data.data });
      });
    }
  };
  source.connect(this.node);
  this.node.connect(this.context.destination);
};


module.exports = AudioRecorder;

},{}],4:[function(require,module,exports){
'use strict';

var CallbackManager = function() {
  var currentId = 0;
  var callbackPool = {};
  this.add = function(cb) {
    var id = currentId;
    callbackPool[id] = cb;
    currentId++;
    return id;
  };
  this.get = function(id) {
    if (callbackPool.hasOwnProperty(id)) {
      var cb = callbackPool[id];
      delete callbackPool[id];
      return cb;
    }
    return null;
  };
};


module.exports = CallbackManager;

},{}],5:[function(require,module,exports){
'use strict';

//Handle vendor prefixes
var AudioContext = window.AudioContext || window.webkitAudioContext;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


function getMicrophone(){
    return new Promise((resolve, reject) => {
        var audioContext;
        try {
            audioContext = new AudioContext();
        } catch (e) {
            reject(e);
        }
        //Initialize Microphone
        try {
            getUserMedia.call(navigator, {audio: true},
                //Success:
                (stream) => {
                    var input = audioContext.createMediaStreamSource(stream);
                    // Firefox hack https://support.mozilla.org/en-US/questions/984179
                    window.firefox_audio_hack = input;
                    resolve(input);
                },
                //Failure
                (e) => { reject(e); });
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = getMicrophone;

},{}]},{},[1]);
