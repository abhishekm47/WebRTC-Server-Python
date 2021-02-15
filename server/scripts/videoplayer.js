
(function(scope) {
    function VideoPlayer(bufferLength, renderer) {
        var frameRate = 60;        
        var frameRequestId = null;
        var buffer = new fQueue(frameRate*bufferLength);        

        function drawVideoFrame(time) {
            frameRequestId = requestAnimationFrame(drawVideoFrame);
            var frame = buffer.dequeue();
            if (frame)
                renderer.src = frame;
                console.log(frame)
        };

        this.play = function() {
            frameRequestId = requestAnimationFrame(drawVideoFrame);
        };

        this.stopPlay = function() {
            cancelAnimationFrame(frameRequestId);
        };

        this.getBuffer = function() {
            return buffer;
        };

        this.getFrameRate = function() {
            return frameRate;
        };
    }

    scope.VideoPlayer = VideoPlayer;
})(window);