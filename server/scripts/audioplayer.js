
(function(scope) {
    function AudioPlayer(bufferLength, media) {
        var playBufSize = 22050;
        var recordingBufSize = 8192; 
        var audioCtx = new AudioContext();
        var sampleRate = audioCtx.sampleRate;
        var samples = new fQueue(sampleRate*bufferLength);       
        var playBuffer = audioCtx.createBuffer(1, playBufSize, sampleRate);
        var playBufferData = playBuffer.getChannelData(0);
        var playSource = null;

        function playAudioSamples() {
            for (var i = 0; i < playBufSize; i++) {          
                var sample = samples.dequeue();
                playBufferData[i] =  sample ? sample : 0;
            }

            playSource = audioCtx.createBufferSource();
            playSource.buffer = playBuffer;

            playSource.onended = function() {
                playSource.disconnect(audioCtx.destination);
                playAudioSamples();
            };

            playSource.connect(audioCtx.destination);
            playSource.start();
        }

        this.play = function() {
            playAudioSamples();
        };

        this.stopPlay = function() {
            playSource.onended = null;
            playSource.stop();
            audioCtx.close();
        };

        this.getBuffer = function() {
            return samples;
        };

        this.getSampleRate = function() {
            return sampleRate;
        };
    }

    scope.AudioPlayer = AudioPlayer;
})(window);