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
