
(function(scope) {
	function VideoRecorder(bufferLength, media, video, canvas, format, quality) {
		format = format || "image/jpeg";
		quality = quality || 0.8;

        var frameRate = 60;
		var canvasCtx = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;			
		var frameRequestId = null;
		var videoStreamUrl = window.URL.createObjectURL(media);
		var frames = new fQueue(frameRate*bufferLength);

		video.src = videoStreamUrl;

		function drawVideoFrame(time) {
			frameRequestId = requestAnimationFrame(drawVideoFrame);
			canvasCtx.drawImage(video, 0, 0, width, height);
			frames.enqueue(canvas.toDataURL(format, quality));
		};
          
		this.start = function() {
			requestAnimationFrame(drawVideoFrame);
		};

		this.stop = function() {
			cancelAnimationFrame(frameRequestId);
        	URL.revokeObjectURL(videoStreamUrl);
		};

        this.getBuffer = function() {
            return frames;
        };

        this.getFrameRate = function() {
            return frameRate;
        };
	}

	scope.VideoRecorder = VideoRecorder;
})(window);