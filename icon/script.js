var icon = document.getElementsByClassName('icon');

for(var i = 0; i < icon.length; i++) {
    icon[i].innerHTML = fileIcon(10, 3, 10, 50, 45, 50, 45, 3, 2.4, 14);
}

alert(fileIcon(10, 3, 10, 50, 45, 50, 45, 3, 2.4, 14));

function fileIcon(a0, b0, a1, b1, a2, b2, a3, b3, roundness, cut) {
    var x0 = a0 + roundness, y0 = b0,
        x1 = a0, y1 = b0 + roundness,
        x2 = a1, y2 = b1 - roundness,
        x3 = a1 + roundness, y3 = b1,
        x4 = a2 - roundness, y4 = b2,
        x5 = a2, y5 = b2 - roundness,
        x6 = a3, y6 = b3 + cut;
        x7 = a3 - cut, y7 = b3;
    
    return '<svg viewBox="0 0 53 53" width="53" height="53">' + background(x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7) + foreground(x6, y6, x7, y7, x7, y6 - roundness, x7 + roundness, y6) + text() + '</svg>';
}

function background(x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7) {
    return '<path d="M' + x0 + ' ' + y0 + 'A' + (x1 - x0) + ' ' + (y1 - y0) + ',0,0,0 ' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'A' + (x3 - x2) + ' ' + (y3 - y2) + ' 0,0,0 ' + x3 + ' ' + y3 + 'L' + x4 + ' ' + y4 + 'A' + (x5 - x4) + ' ' + (y5 - y4) + ',0,0,0 ' + x5 +' ' + y5 + 'L' + x6 + ' ' + y6 + ' ' + x7 + ' ' + y7 + ' ' + x0 + ' ' + y0 + '" fill="#002b80"/>';
}

function foreground(x0, y0, x1, y1, x2, y2, x3, y3) {    
    return '<path d="M' + x0 + ' ' + y0 + 'L' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + 'A' + (x3 - x2) + ' ' + (y3 - y2) + ',0,0,0 ' + x3 + ' ' + y3 + 'L' + x0 + ' ' + y0 + '" fill="#004ce3"/>';
}

function text() {
    return '<text text-anchor="middle" font-family="sans-serif" font-size="12" y="33" x="26.5" fill="#fff">.zip</text>';
}
