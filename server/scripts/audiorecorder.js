
(function(scope) {
    function AudioRecorder(bufferLength, media) {        
        var recordingBufSize = 8192; 
        var audioCtx = new AudioContext();
        var sampleRate = audioCtx.sampleRate;        
        var samples = new fQueue(sampleRate*bufferLength);
        var audioSource = audioCtx.createMediaStreamSource(media);
        var audioProcessor = audioCtx.createScriptProcessor(recordingBufSize, 1, 1);

        audioProcessor.onaudioprocess = function(e) {
            var input = e.inputBuffer.getChannelData(0);
            for (var i = 0; i < recordingBufSize; i++)
                samples.enqueue(input[i]);
        };

        var zeroGain = audioCtx.createGain();
        zeroGain.gain.value = 0;        

        audioProcessor.connect(zeroGain);
        zeroGain.connect(audioCtx.destination);

        this.start = function() {
            audioSource.connect(audioProcessor);
        };

        this.stop = function() {
            audioSource.disconnect(audioProcessor);
            zeroGain.disconnect(audioCtx.destination);
            audioCtx.close();
        };

        this.getBuffer = function() {
            return samples;
        };

        this.getSampleRate = function() {
            return sampleRate;
        };
    }

    scope.AudioRecorder = AudioRecorder;
})(window);