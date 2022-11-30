(function () {
var importableFonts = function () {
    var mp = window.modulesPath ? window.modulesPath : '../../modules';
    return {
        'fontawesome': {
             check: '900 12px "Font Awesome 5 Free"',
             src: mp+"/fonts/fontAwesome/css/all.css",
             embed: mp+"/fonts/embed-fontawesome.css",
             cdn: "https://static4.castor-informatique.fr/modules/fonts/fontAwesome/css/all.css"
        },
        'titillium-web': {
             check: '12px "Titillium Web"',
             src: mp+"/fonts/titilliumweb.css",
             embed: mp+"/fonts/embed-titilliumweb.css",
             cdn: "https://static4.castor-informatique.fr/modules/fonts/titilliumweb.css"
        },
        'source-sans-pro': {
             check: '12px "Source Sans Pro"',
             src: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
             // TODO : local source
        },
        'inconsolata': {
            check: '12px "Inconsolata"',
            src: mp+"/fonts/inconsolata/inconsolata.css",
            cdn: "https://static4.castor-informatique.fr/modules/fonts/inconsolata/inconsolata.css"
        },
        'open-sans': {
            check: '12px "Open Sans"',
            src: mp+"/fonts/open-sans/open-sans.css",
            cdn: "https://static4.castor-informatique.fr/modules/fonts/open-sans/open-sans.css"
        },
        'blueprint-16': {
            check: '12px "Icons16"',
            src: mp+"/fonts/blueprint-16/blueprint-icons-16.css",
            cdn: "https://static4.castor-informatique.fr/modules/fonts/blueprint-16/blueprint-icons-16.css"
        }
    };
}

var iOSDetected = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

var fontsToLoad = [];
var fontsLoaded = {};

function appendFont(path) {
    $('head').append('<link rel="stylesheet" href="' + path + '" class="remove">');
}

function checkFontLoaded(fontName) {
    // iOS will always return true to document.fonts.check
    if(typeof importableFonts == 'function') {
        importableFonts = importableFonts();
    };
    var fontData = importableFonts[fontName];
    if(typeof fontsLoaded[fontName] == 'undefined') {
        fontsLoaded[fontName] = {};
    }
    var fontLoaded = fontsLoaded[fontName];
    if(iOSDetected || !document.fonts || !document.fonts.check || !document.fonts.check(fontData.check)) {
        if(!iOSDetected && window.modulesPath && fontData.embed && !fontLoaded.embed) {
            appendFont(fontData.embed);
            fontLoaded.embed = true;
        } else if(fontData.cdn && !fontLoaded.cdn) {
            appendFont(fontData.cdn);
            fontLoaded.cdn = true;
        }
    }
}

function checkFonts(force) {
    if(!force && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() { checkFonts(true); });
    } else {
        for(var i=0 ; i < fontsToLoad.length; i++) {
            checkFontLoaded(fontsToLoad[i]);
        }
    }
}

function loadFonts(fontList) {
    if(typeof importableFonts == 'function') {
        importableFonts = importableFonts();
    };
    for(var i=0; i < fontList.length; i++) {
        var fontName = fontList[i];
        if(fontsToLoad.indexOf(fontName) != -1) { continue; }
        if(!importableFonts[fontName]) {
            console.error('Font "' + fontName + '" unknown.');
            continue;
        }
        fontsToLoad.push(fontName);
        if(importableFonts[fontName].src) {
            appendFont(importableFonts[fontName].src);
        }
    }
}

window.FontsLoader = {
    checkFonts: checkFonts,
    loadFonts: loadFonts
}
})();
