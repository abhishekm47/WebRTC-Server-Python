
(function(scope) {
    function MediaStreamer(url, audio, video, mode) {
        mode = mode || "r";

        var streamInt = 500;
        var sampleRate = audio.getSampleRate();
        var frameRate = video.getFrameRate();
        var samples = audio.getBuffer();
        var frames = video.getBuffer();
        var audioLength =  sampleRate * streamInt / 1000;
        var videoLength = frameRate * streamInt / 1000;
        var streamIntId = null;
        var theStreamer = this;

        var streamSocket = new WebSocket(url);

        streamSocket.onopen = function() {
            switch (mode) {
                case "w":
                    break;
                case "r":
                    streamSocket.send("rdy");
                    break;
            }            
        };

        streamSocket.onmessage = function(evt) { 
            switch (mode) {
                case "w":
                    if (theStreamer.onStreamId) 
                        theStreamer.onStreamId(evt.data);
                    break;
                case "r":            
                    var st = Date.now();
                    var data = JSON.parse(evt.data);

                    for (var i = 0; i < data.audio.length; i ++)
                        samples.enqueue(data.audio[i]);
                    for (var i = 0; i < data.video.length; i ++)
                        frames.enqueue(data.video[i]);

                    var elapsed = (Date.now() - st) / 1000;
                    console.log("Received audio: " + data.audio.length + 
                        ", video: " + data.video.length + " in " + elapsed + " sec");
                    break;
            }            
        };

        this.start = function() {
            switch (mode) {
                case "w":
                    streamIntId = setInterval(function() {
                        var st = Date.now();
                        var samplesStreamed = 0;
                        var framesStreamed = 0;
                        var data = {
                            timestamp: st,
                            interval: streamInt,
                            sampleRate: sampleRate,
                            frameRate: frameRate,
                            audio: new Array(audioLength),
                            video: new Array(videoLength),
                        };

                        while (samples.size() && audioLength > ++ samplesStreamed)
                            data.audio[samplesStreamed-1] = samples.dequeue();
                        while (frames.size() && videoLength > ++ framesStreamed)
                            data.video[framesStreamed-1] = frames.dequeue();

                        var payload = JSON.stringify(data);

                        streamSocket.send(payload);

                        var elapsed = ((Date.now() - st) / 1000);
                        console.log("Streamed audio: " + samplesStreamed + 
                            ", video: " + framesStreamed + " in " + elapsed + " sec");
                    }, streamInt);                    
                    break;                    
                case "r":
                    // autostarts on open
                    break;
            }             
        };

        this.stop = function() {
            if (streamIntId)
                clearInterval(streamIntId);
            streamSocket.close();
        };
    }

    scope.MediaStreamer = MediaStreamer;
})(window);