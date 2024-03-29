// Video Tools
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

// Goniometer Functions
// Functionality largely based on this article from Peter Collingridge
// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/

var selectedElement = false;
var offset;
var svg = document.getElementById("goniometer");

svg.addEventListener('mousedown', startDrag);
svg.addEventListener('mousemove', drag);
svg.addEventListener('mouseup', endDrag);
svg.addEventListener('mouseleave', endDrag);

svg.addEventListener('touchstart', startDrag);
svg.addEventListener('touchmove', drag);
svg.addEventListener('touchend', endDrag);
svg.addEventListener('touchleave', endDrag);
svg.addEventListener('touchcancel', endDrag);

var ccwselect = document.getElementById("ccw");
ccwselect.addEventListener('change', recalculateAngle);
var cwselect = document.getElementById("cw");
cwselect.addEventListener('change', recalculateAngle);


function startDrag(evt) {  
    if (evt.target.classList.contains('gonpoint')) {
    selectedElement = evt.target;
    offset = getMousePosition(evt);
    offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
    offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
    }
}
function drag(evt) {  
    if (selectedElement) {
        evt.preventDefault();
        var coord = getMousePosition(evt);
        selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
        selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
        redrawLines();
        recalculateAngle();
        }
}
function endDrag(evt) {  
    selectedElement = null;
}

function redrawLines() {
    var line1 = document.getElementById("initialline")
    var line2 = document.getElementById("finalline")
    var pt1 = document.getElementById("vertinitial")
    var pivot = document.getElementById("pivot")
    var pt2 = document.getElementById("vertfinal")
    line1.setAttributeNS(null, "x1", parseFloat(pt1.getAttributeNS(null, "x"))+5)
    line1.setAttributeNS(null, "y1", parseFloat(pt1.getAttributeNS(null, "y"))+5)
    line1.setAttributeNS(null, "x2", parseFloat(pivot.getAttributeNS(null, "x"))+5)
    line1.setAttributeNS(null, "y2", parseFloat(pivot.getAttributeNS(null, "y"))+5)
    line2.setAttributeNS(null, "x1", parseFloat(pivot.getAttributeNS(null, "x"))+5)
    line2.setAttributeNS(null, "y1", parseFloat(pivot.getAttributeNS(null, "y"))+5)
    line2.setAttributeNS(null, "x2", parseFloat(pt2.getAttributeNS(null, "x"))+5)
    line2.setAttributeNS(null, "y2", parseFloat(pt2.getAttributeNS(null, "y"))+5)
}

function recalculateAngle() {
    var line1 = document.getElementById("initialline")
    var line2 = document.getElementById("finalline")
    var xin = parseFloat(line1.getAttributeNS(null, "x1"))+5
    var yin = parseFloat(line1.getAttributeNS(null, "y1"))+5
    var xpiv = parseFloat(line1.getAttributeNS(null, "x2"))+5
    var ypiv = parseFloat(line1.getAttributeNS(null, "y2"))+5
    var xfin = parseFloat(line2.getAttributeNS(null, "x2"))+5
    var yfin = parseFloat(line2.getAttributeNS(null, "y2"))+5
    var x1 = xin - xpiv;
    var y1 = yin - ypiv;
    var x2 = xfin - xpiv;
    var y2 = yfin - ypiv;

    var angle1 = Math.atan2(y1, x1)*180/Math.PI;
    if (angle1 < 0) {
        angle1 = 360 + angle1;
    }

    var angle2 = Math.atan2(y2, x2)*180/Math.PI;
    if (angle2 < 0) {
        angle2 = 360 + angle2;
    }
    var angle = angle2 - angle1;

    if (angle < 0) {
        angle = 360 + angle;
    }
    if (countercw == true) {
        angle = 360-angle;
    }
    document.getElementById("angle").innerHTML =  Math.round(angle*10)/10;
    return angle;
}

function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    if (evt.touches) { evt = evt.touches[0]; }
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
    }  

// Data logging
let table = document.querySelector("table");
let columnHead = ["Timestamp", "Angle (°)"];
let timestamps = [];
let angles = [];


function generateTable() {
    table.innerHTML ="";
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let index = 0; index < columnHead.length; index++) {
        let th = document.createElement("th");
        let text = document.createTextNode(columnHead[index]);
        th.appendChild(text);
        row.appendChild(th);
    }
    for (let index = 0; index < angles.length; index++) {
        let row = table.insertRow();
        let cell1 = row.insertCell();
        let text1 = document.createTextNode(timestamps[index]);
        cell1.appendChild(text1);
        let cell2 = row.insertCell();
        let text2 = document.createTextNode(angles[index]);
        cell2.appendChild(text2);
    }
}

function addAngle() {
    var angle = recalculateAngle();
    angles[Math.round(vid.currentTime*10)] = angle;
    timestamps[Math.round(vid.currentTime*10)] = (Math.round(vid.currentTime*10)/10);
    generateTable();

}

var countercw = false;
function updateAngleDirection() {
    var select = document.getElementById("ccw");
    if (select.checked != countercw) {
        console.log("switch")
        if (countercw == false) {
            angles = angles.map(n => 360-n);
        } else {
            angles = angles.map(n => 360-n);
        }
    }
    countercw = select.checked;
    console.log(countercw)
}

var vidInput = document.getElementById('vidloader');
vidInput.addEventListener('change', loadVideo, false);

document.addEventListener('keypress', (event) => {
    var code = event.code;
    if (code === 'KeyD') {
        stepForward();
        return;
      }

  }, false);

  document.addEventListener('keypress', (event) => {
    var code = event.code;
    if (code === 'KeyA') {
        stepBack()
        return;
      }

  }, false);

function copyTable() {
    // create a Range object
    var range = document.createRange();  
    // set the Node to select the "range"
    range.selectNode(table);
    // add the Range to the set of window selections
    window.getSelection().addRange(range);
    
    // execute 'copy', can't 'cut' in this case
    document.execCommand('copy');
}

updateAngleDirection();
redrawLines();
recalculateAngle();

generateTable();
document.addEventListener('keypress', (event) => {
  var code = event.code;
  if (code === 'KeyS') {
      addAngle()
      return;
    }

}, false);
  