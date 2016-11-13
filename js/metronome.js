'use strict';

(function () {
    var audioCtx;
    var gainNode;
    (function initAudioApi() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.15;
    })();

    angular
        .module('Metronome', [])
        .controller('metronomeController', function Metronome(Beep) {
            this.state = '►';
            this.bpm = 120;
            this.ticker = null;
            this.changeBpm = function (value) {
                this.bpm = parseInt(this.bpm) + parseInt(value);
                this.restart();
            }
            this.startstop = function () {
                if (this.state === '►') {
                    this.start();
                    this.state = '◼';
                } else if (this.state === '◼') {
                    this.stop();
                    this.state = '►';
                }
            }
            this.simplestart = function () {
                this.ticker = setInterval(function () {
                    Beep();
                }, 60000 / parseInt(this.bpm));
            }
            this.start = function () {
                Beep();
                this.simplestart();
            }
            this.stop = function () {
                if (this.ticker)
                    clearInterval(this.ticker);
                this.ticker = null;
            }
            this.restart = function () {
                if (this.ticker) {
                    this.stop();
                    this.simplestart();
                }
            }
    });

    angular
        .module('Metronome')
        .factory('Beep', function() {
            return function beep() {
                var oscillator = audioCtx.createOscillator();

                oscillator.type = 'triangle';
                oscillator.frequency.value = 740;
                gainNode.connect(audioCtx.destination);
                oscillator.connect(gainNode);

                oscillator.start();

                setTimeout(function () {
                    oscillator.stop();
                }, 40);

                return oscillator;
            }
        });
})();