let vid = document.getElementById("myVideo");

function getCurTime() {
    alert(vid.currentTime);
}

function setCurTime() {
    vid.currentTime = 5;
}

function stepBack() {
    vid.currentTime = Math.round((vid.currentTime - 0.1)*10)/10;
    updateTimestamp();
} 

function stepForward() {
    vid.currentTime = Math.round((vid.currentTime + 0.1)*10)/10;
    updateTimestamp();
}

function updateTimestamp() {
    document.getElementById("timestamp").innerHTML =  Math.round(vid.currentTime*10)/10;
    document.getElementById("maxtime").innerHTML =  Math.round(vid.duration*10)/10;
}

function loadVideo(event) {
    var file = this.files[0];
    var type = file.type;
    vid = document.getElementById("myVideo");
    var fileURL = URL.createObjectURL(file);
    vid.src = fileURL;
    updateTimestamp();
}

var vidInput = document.getElementById('vidloader');
vidInput.addEventListener('change', loadVideo, false);
