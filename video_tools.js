// Video Tools
let vid = document.getElementById("myVideo");

function updateTimestamp() {
    document.getElementById("timestamp").innerHTML =  Math.round(vid.currentTime*10)/10;
    document.getElementById("maxtime").innerHTML =  Math.round(vid.duration*10)/10;
}

function loadVideo(event) {
    var file = this.files[0];
    var type = file.type;
    console.log(file);
    vid = document.getElementById("myVideo");
    var fileURL = URL.createObjectURL(file);
    if (type.includes("image")){
        vid.poster = fileURL;
    } else if (type.includes("video")){
        vid.src = fileURL;
    }
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
    var base = document.getElementById("baseline")
    var measure = document.getElementById("measureline")
    var basestart = document.getElementById("basestart")
    var baseend = document.getElementById("baseend")
    var measurestart = document.getElementById("measurestart")
    var measureend = document.getElementById("measureend")
    base.setAttributeNS(null, "x1", parseFloat(basestart.getAttributeNS(null, "x"))+5)
    base.setAttributeNS(null, "y1", parseFloat(basestart.getAttributeNS(null, "y"))+5)
    base.setAttributeNS(null, "x2", parseFloat(baseend.getAttributeNS(null, "x"))+5)
    base.setAttributeNS(null, "y2", parseFloat(baseend.getAttributeNS(null, "y"))+5)
    measure.setAttributeNS(null, "x1", parseFloat(measurestart.getAttributeNS(null, "x"))+5)
    measure.setAttributeNS(null, "y1", parseFloat(measurestart.getAttributeNS(null, "y"))+5)
    measure.setAttributeNS(null, "x2", parseFloat(measureend.getAttributeNS(null, "x"))+5)
    measure.setAttributeNS(null, "y2", parseFloat(measureend.getAttributeNS(null, "y"))+5)
}

function recalculateAngle() {
    var base = document.getElementById("baseline")
    var measure = document.getElementById("measureline")
    var base_x_start = parseFloat(base.getAttributeNS(null, "x1"))+5
    var base_y_start = parseFloat(base.getAttributeNS(null, "y1"))+5
    var base_x_end = parseFloat(base.getAttributeNS(null, "x2"))+5
    var base_y_end = parseFloat(base.getAttributeNS(null, "y2"))+5
    var measure_x_start = parseFloat(measure.getAttributeNS(null, "x1"))+5
    var measure_y_start = parseFloat(measure.getAttributeNS(null, "y1"))+5
    var measure_x_end = parseFloat(measure.getAttributeNS(null, "x2"))+5
    var measure_y_end = parseFloat(measure.getAttributeNS(null, "y2"))+5
    var x1 = base_x_end - base_x_start;
    var y1 = base_y_end - base_y_start;
    var x2 = measure_x_end - measure_x_start;
    var y2 = measure_y_end - measure_y_start;

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
    angles[angles.length] = angle;
    timestamps[timestamps.length] = vid.currentTime*10;
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
