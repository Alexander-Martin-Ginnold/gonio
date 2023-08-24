// Functionality largely based on this article from Peter Collingridge
// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/

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
            redrawLines(evt);
          }
    }
    function endDrag(evt) {  
        selectedElement = null;
    }

    function redrawLines(evt) {
        var line1 = document.getElementById("initialline")
        var line2 = document.getElementById("finalline")
        var pt1 = document.getElementById("vertinitial")
        var pivot = document.getElementById("pivot")
        var pt2 = document.getElementById("vertfinal")
        line1.setAttributeNS(null, "x1", parseFloat(pt1.getAttributeNS(null, "x"))+5)
        line1.setAttributeNS(null, "y1", parseFloat(pt1.getAttributeNS(null, "y"))+5)
        line1.setAttributeNS(null, "x2", parseFloat(pivot.getAttributeNS(null, "x"))+5)
        line1.setAttributeNS(null, "y2", parseFloat(pivot.getAttributeNS(null, "y"))+5)
        line2.setAttributeNS(null, "x2", parseFloat(pivot.getAttributeNS(null, "x"))+5)
        line2.setAttributeNS(null, "y2", parseFloat(pivot.getAttributeNS(null, "y"))+5)
        line2.setAttributeNS(null, "x1", parseFloat(pt2.getAttributeNS(null, "x"))+5)
        line2.setAttributeNS(null, "y1", parseFloat(pt2.getAttributeNS(null, "y"))+5)
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