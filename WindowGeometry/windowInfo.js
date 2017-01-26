window.onload = onLoad;
window.onresize = setElements;
    
function onLoad() {
    setElements();
    setBrowserInfo();
}

function setElements() {
    document.getElementById("windowInfo").innerHTML = 'Size: ' + window.outerWidth + ' x ' + window.outerHeight;
    document.getElementById("screenInfo").innerHTML = 'Position: ' + window.screenX + ' x ' + window.screenY;
    document.getElementById("offsetInfo").innerHTML = 'Offset: ' + window.pageXOffset + ' x ' + window.pageYOffset;
}

function setBrowserInfo() {
    var browser;
    for(var propname in navigator) {
        browser += propname + ": " + navigator[propname] + "<br>"
    }
    
    document.getElementById("browserInfo").innerHTML = browser;
}