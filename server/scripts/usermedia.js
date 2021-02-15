


if (window.MediaStreamTrack && !MediaStreamTrack.getSources) {
    MediaStreamTrack.getSources = function(callback) {
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        var results = [];
        for (var i in devices) {
          var device = devices[i]
          if (device.kind != "audioinput" && device.kind != "videoinput")
            continue;
  
          var facing = "";
          if (device.kind == "videoinput" && navigator.userAgent.indexOf("Android") >= 0) {
            if (device.label.indexOf("facing front") >= 0)
              facing = "user";
            else if (device.label.indexOf("facing back") >= 0)
              facing = "environment";
          }
  
          results.push({
            'id': device.deviceId,
            'kind': device.kind == "audioinput" ? "audio" : "video",
            'label': device.label,
            'facing': facing
          });
        }
        callback(results);
      }, function(e) {
        callback([]);
      });
    }
  }
  


(function(scope) {
    function UserMedia() {
        var currentMedia = null;

        this.capture = function (success, failure) {
            MediaStreamTrack.getSources(function(sourceInfos) {          
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

                    
                    navigator.mediaDevices.getUserMedia({
                        audio: { optional: [{sourceId: audioSource.id}] },
                        video: { optional: [{sourceId: videoSource.id}] }}).then(function(stream)
                        {
                            currentMedia = stream;
                            console.log('Got MediaStream:', stream);
                            console.log('Got MediaStream:', stream.getVideoTracks());
                            if (stream) success(stream);

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