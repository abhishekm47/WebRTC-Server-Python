
(function(scope) {
    function UserMedia() {
        var currentMedia = null;

        this.capture = function (success, failure) {
            navigator.mediaDevices.enumerateDevices(function(sourceInfos) {          
                var audioSource = null;
                var videoSource = null;
                for (var i = 0; i != sourceInfos.length; ++i) {
                    var sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind.toLowerCase() === 'audio' && sourceInfo.id.toLowerCase() != "default")
                        audioSource = sourceInfo;
                    else if (sourceInfo.kind.toLowerCase() === 'video')
                        videoSource = sourceInfo;
                }

                if (audioSource && videoSource) {
                    console.log("Audio source: " + audioSource.id, audioSource.label || 'microphone');
                    console.log("Video source: " + videoSource.id, videoSource.label || 'camera');

                    navigator.getUserMedia({
                        audio: { optional: [{sourceId: audioSource.id}] },
                        video: { optional: [{sourceId: videoSource.id}] }}, 
                        function(media) {
                            currentMedia = media;
                            if (success) success(media);
                        },
                        function(e) {
                            console.log('Failed to get audio/video streams', e);
                            if (failure) failure(e);
                        });

                } else {
                    console.log('Failed to select audio/video input devices');
                    if (failure) failure();
                } 
            });
        };

        this.release = function() {
            if (!currentMedia) return;            

            var audioTracks = currentMedia.getAudioTracks();
            var videoTracks = currentMedia.getVideoTracks();
            
            for (var i = 0; i != audioTracks.length; i++) 
                audioTracks[i].stop();
            for (var i = 0; i != videoTracks.length; i++) 
                videoTracks[i].stop();        
        };
    }

    scope.UserMedia = UserMedia;
})(window);