navigator.getUserMedia  = 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

window.requestAnimationFrame = 
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame || 
        window.oRequestAnimationFrame;

window.cancelAnimationFrame = 
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame || 
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame || 
        window.oCancelAnimationFrame;

window.AudioContext = 
        window.AudioContext || 
        window.webkitAudioContext;