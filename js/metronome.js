(function($) {
    var bpm = 120;

    $(function() {
        show();

        /** Events */
        $('#minus1').click(function() {
            bpm -= 1;
            restart();
            show();
        });
        $('#minus5').click(function() {
            bpm -= 5;
            restart();
            show();
        });
        $('#minus10').click(function() {
            bpm -= 10;
            restart();
            show();
        });
        $('#plus1').click(function() {
            bpm += 1;
            restart();
            show();
        });
        $('#plus5').click(function() {
            bpm += 5;
            restart();
            show();
        });
        $('#plus10').click(function() {
            bpm += 10;
            restart();
            show();
        });
        $('#startstop').click(function() {
            if (!ticker)
            {
                start();
                $('#startstop').html('◼');
            }
            else {
                stop();
                $('#startstop').html('►');
            }
        });
        $('#slider').change(function(data) {
            bpm = parseInt(data.target.value);
            restart();
            show();
        });
        $('#lcd').change(function(data) {
            var prevbpm = bpm;
            bpm = parseInt(data.target.value);
            if (bpm)
            {
                restart();
                show();
            } else {
                $('#lcd').val(prevbpm);
            }
        });

        /** Controllers */
        var ticker = null;
        function simplestart() {
            ticker = setInterval(function() {
                beep();
            }, 60000 / bpm);
        }
        function start() {
            beep();
            simplestart();
        }

        function stop() {
            if (ticker)
                clearInterval(ticker);
            ticker = null;
        }
        function restart() {
            if (ticker)
            {
                stop();
                simplestart();
            }
        }
        function show() {
            $('#lcd').val(bpm);
            $('#slider').val(bpm);
        }
    });

})(jQuery);

/** Audio api */
var audioCtx;
var gainNode;
(function initAudioApi(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.15;
})();

function beep() {
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'triangle';
    oscillator.frequency.value = 740;
    gainNode.connect(audioCtx.destination);
    oscillator.connect(gainNode);

    oscillator.start();

    setTimeout(function(){
        oscillator.stop();
    }, 40);

    feedBack();

    return oscillator;
};

function feedBack() {
    $('#lcd').addClass('tick');
    setTimeout(function() {
        $('#lcd').removeClass('tick');
    }, 10);
}