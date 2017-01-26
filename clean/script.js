var x = document.getElementsByClassName("full");

for(var i = 0; i < x.length; i++) {
    x[i].innerHTML = getFolderIcon(true) + x[i].innerHTML;
}

x = document.getElementsByClassName("empty");

for(var i = 0; i < x.length; i++) {
    x[i].innerHTML = getFolderIcon(false) + x[i].innerHTML;
}

x = document.getElementsByClassName("file");

for(var i = 0; i < x.length; i++) {
    x[i].innerHTML = getFileIcon(x[i].innerHTML.split('.')[1]) + x[i].innerHTML;
}

// Return an .svg image representing a folder
function getFolderIcon(full) {    
    var content = full ? '<rect fill="#fff" x="3" y="12" height="35" width="47" rx="2"/>' : '';
    
    return '<svg viewBox="0 0 53 53"><rect fill="#d9b61d" x="3.5" y="5" width="25" height="45" rx="2"/><rect fill="#d9b61d" x="1.5" y="10" width="50" height="40" rx="2"/>' + content + '<rect fill="#edc44a" x="1.5" y="15" width="50" height="35" rx="2"/></svg>';
}

// Return an .svg image representing a file
function getFileIcon(format) {
    return '<svg viewBox="0 0 53 53"><path d="M12.4 3A-2.4 2.4,0,0,0 10 5.4L10 47.6A2.4 2.9 0,0,0 12.4 50L42.6 50A2.9 -2.4,0,0,0 45 47.6L45 17 31 3 12.4 3" fill="' + getColors(format)[0] + '"/><path d="M45 17L31 3 31 14.6A2.4 2.4,0,0,0 33.4 17L45 17" fill="' + getColors(format)[1] + '"/><text text-anchor="middle" font-family="sans-serif" font-size="12" y="33" x="26.5" fill="#fff">.' + format + '</text></svg>';
}

// Return icon color
function getColors(format) {
    switch(format) {
        case 'avi':
        case 'flv':
        case 'mkv':
        case 'mov':
        case 'mpeg':
        case 'mpg':
        case 'mp4':
        case 'm4v':
        case 'wmv':
            return ['#7e70ee', '#5649c1'];
        case 'mp2':
        case 'mp3':
        case 'm3u':
        case 'wma':
        case 'xls':
        case 'xlsx':
            return ['#5bab6e', '#448353'];
        case 'doc':
        case 'docx':
        case 'psd':
            return ['#03689b', '#2980b9'];
        case 'gif':
        case 'jpg':
        case 'jpeg':
        case 'pdf':
        case 'png':
            return ['#e15955', '#c6393f'];
        case 'deb':
        case 'dmg':
        case 'gz':
        case 'rar':
        case 'zip':
        case '7z':
            return ['#867c75', '#685f58'];
        case 'html':
        case 'rtf':
        case 'xml':
        case 'xhtml':
            return ['#a94bb7', '#d65de8'];
        case 'js':
            return ['#d0c54d', '#a69f4e'];
        case 'css':
        case 'sass':
        case 'scss':
            return ['#44afa6', '#30837c'];
        default:
            return ['#898989', '#cbcbcb'];
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}