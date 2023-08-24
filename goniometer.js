// Functionality largely based on this article from Peter Collingridge
// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
var countercw = false;
function updateAngleDirection() {
    var select = document.getElementById("ccw");
    countercw = select.checked;
    console.log(countercw)
}
function goniometerPointInit(evt){
    var selectedElement = false;
    var offset;
    var svg = evt.target;

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
        document.getElementById("angle1").innerHTML =  Math.round(angle1*10)/10;
        document.getElementById("angle2").innerHTML =  Math.round(angle2*10)/10;
        document.getElementById("angle").innerHTML =  Math.round(angle*10)/10;
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        if (evt.touches) { evt = evt.touches[0]; }
        return {
          x: (evt.clientX - CTM.e) / CTM.a,
          y: (evt.clientY - CTM.f) / CTM.d
        };
      }  
}