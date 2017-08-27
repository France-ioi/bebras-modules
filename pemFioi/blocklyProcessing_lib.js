var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         categories: {
            environment: "Environnement",
            shape: "Formes",
            transform: "Transformations",
            effect: "Effets",
            image: "Images",
            rendering: "Rendu",
            typography: "Typographie"
         },
         label: {
            // environment
            popStyle: "dépiler le style",
            pushStyle: "empiler le style",
            cursor: "utiliser le pointeur de souris %1",
            focused: "le canevas est sélectionné",
            frameCount: "numéro d'itération",
            frameRate: "définir le taux de rafraichissement à %1",
            __frameRate: "taux de rafraichissement",
            width: "largeur",
            height: "hauteur",
            resize: "redimensionner à la taille %1 %2",
            // shape
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5 %6",
            ellipse: "dessiner une ellipse à %1 %2 de taille %3 %4",
            line: "dessiner une ligne de %1 %2 à %3 %4",
            point: "dessiner un point à %1 %2",
            quad: "dessiner un quadrilatère aux points %1 %2, %3 %4, %5 %6, %7 %8",
            rect: "dessiner un rectangle à %1 %2 de taille %3 %4",
            triangle: "dessiner un triangle aux points %1 %2, %3 %4, %5 %6",
            bezier: "dessiner une courbe de Bézier allant de %1 %2 avec l'ancre %3 %4 et l'ancre %5 %6 jusqu'à %7 %8",
            bezierDetail: "définir la résolution des courbes de Bézier à %1",
            bezierPoint: "coordonnée sur la courbe de Bézier allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            bezierTangent: "tangente sur la courbe de Bézier allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curve: "dessiner une courbe spline allant de %1 %2 avec l'ancre %3 %4 et l'ancre %5 %6 jusqu'à %7 %8",
            curveDetail: "définir la résolution des courbes splines à %1",
            curvePoint: "coordonnée sur la courbe spline allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curveTangent: "tangente sur la courbe spline allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curveTightness: "définir la tension des courbes splines à %1",
            box: "dessiner une boite de taille %1 %2 %3",
            sphere: "dessiner une sphère de rayon %1",
            sphereDetail: "définir la résolution des sphères à %1 %2",
            ellipseMode: "utiliser le mode %1 pour les ellipses",
            noSmooth: "désactiver le lissage",
            rectMode: "utiliser le mode %1 pour les rectangles",
            smooth: "activer le lissage",
            strokeCap: "utiliser des terminaisons %1",
            strokeJoin: "utiliser des jointures %1",
            strokeWeight: "définir l'épaisseur des lignes à %1",
            beginShape: "commencer une forme avec le mode %1",
            bezierVertex: "placer un sommet de courbe de Bézier à %1 %2 %3 %4 %5 %6",
            curveVertex: "placer un sommet de courbe spline à %1 %2",
            endShape: "terminer une forme %1",
            texture: "utiliser la texture %1",
            textureMode: "utiliser le mode %1 pour se référer à la texture",
            vertex: "placer un sommet à %1 %2 %3 %4 %5",
            shape: "afficher la forme %1 à %2 %3 avec la taille %4 %5",
            shapeMode: "utiliser le mode %1 pour les formes",
            isVisible: "est visible",
            setVisible: "définir la visibilité à %1",
            disableStyle: "désactiver le style spécifique",
            enableStyle: "activer le style spécifique",
            getChild: "enfant %1",
            // debug
            print: "sortir %1",
            println: "sortir la ligne %1",
            // transform
            applyMatrix: "appliquer la matrice %1 %2 %3 %4, %5 %6 %7 %8, %9 %10 %11 %12, %13 %14 %15 %16",
            popMatrix: "dépiler la matrice",
            printMatrix: "sortir la matrice",
            pushMatrix: "empiler la matrice",
            resetMatrix: "réinitialiser la matrice",
            rotate: "pivoter de %1",
            rotateX: "pivoter sur l'axe X de %1",
            rotateY: "pivoter sur l'axe Y de %1",
            rotateZ: "pivoter sur l'axe Z de %1",
            scale: "appliquer une échelle de %1 %2 %3",
            translate: "déplacer de %1 %2 %3",
            // effect
            // ...
            // color
            background: "remplir l'arrière-plan avec %1 %2 %3 %4",
            colorMode: "utiliser le mode de couleur %1 avec les limites %2 %3 %4 %5",
            fill: "définir la couleur de fond à %1 %2 %3",
            noFill: "désactiver le fond",
            noStroke: "désactiver la ligne de contour",
            stroke: "définir la couleur de ligne à %1 %2 %3",
            alpha: "opacité dans %1",
            blendColor: "mélanger les couleurs %1 et %2 avec le mode %3",
            blue: "bleu dans %1",
            brightness: "luminosité dans %1",
            color: "couleur %1 %2 %3 %4",
            green: "vert dans %1",
            hue: "teinte dans %1",
            lerpColor: "couleur intermédiaire entre %1 et %2 à l'emplacement %3",
            red: "rouge dans %1",
            saturation: "saturation dans %1",
            // image
            createImage: "nouvelle image de taille %1 %2 au format %3",
            image: "afficher l'image %1 à %2 %3 avec la taille %4 %5",
            imageMode: "utiliser le mode %1 pour le positionnement des images",
            noTint: "désactiver le teint des images",
            tint: "utiliser pour les images un teint %1 %2 %3 %4",
            blend: "mélanger la source à %1 %2 taille %3 %4 avec la destination à %5 %6 taille %7 %8 avec le mode %9",
            copy: "copier la source à %1 %2 taille %3 %4 sur la destination à %5 %6 taille %7 %8",
            filter: "appliquer le filtre %1 avec le niveau %2",
            get: "récupérer les pixels à %1 %2 taille %3 %4",
            loadPixels: "charger les pixels",
            pixels: "pixels",
            set: "placer à %1 %2 la couleur %3",
            updatePixels: "actualiser les pixels",
            // rendering
            createGraphics: "nouveau graphisme de taille %1 %2 avec le moteur %3",
            // typography
            createFont: "nouvelle police de nom %1 et de taille %2",
            loadFont: "nouvelle police de nom %1",
            text: "afficher le texte %1 à %2 %3 dans un cadre de taille %4 %5",
            textFont: "définir la police du texte à %1 avec la taille %2",
            textAlign: "définir l'alignement du texte, à l'horizontale : %1 et à la verticale : %2",
            textLeading: "définir l'interligne du texte à %1",
            textMode: "utiliser le mode %1 pour le texte",
            textSize: "définir la taille du texte à %1",
            textWidth: "largeur du texte %1",
            textAscent: "hauteur du texte au-dessus de la ligne de base",
            textDescent: "hauteur du texte en dessous de la ligne de base"
         },
         code: {
            // environment
            popStyle: "dépilerStyle",
            pushStyle: "empilerStyle",
            cursor: "curseurSouris",
            focused: "canevasSélectionné",
            frameCount: "numéroItération",
            frameRate: "changerTauxRafraichissement",
            __frameRate: "tauxRafraichissement",
            width: "largeur",
            height: "hauteur",
            resize: "redimensionner",
            // shape
            arc: "arc",
            ellipse: "ellipse",
            line: "ligne",
            point: "point",
            quad: "quad",
            rect: "rect",
            triangle: "triangle",
            bezier: "bezier",
            bezierDetail: "détailBezier",
            bezierPoint: "pointBezier",
            bezierTangent: "tangenteBezier",
            curve: "courbe",
            curveDetail: "détailCourbes",
            curvePoint: "pointCourbe",
            curveTangent: "tangenteCourbe",
            curveTightness: "tensionCourbes",
            box: "boite",
            sphere: "sphère",
            sphereDetail: "détailSphères",
            ellipseMode: "modeEllipses",
            noSmooth: "désactiverLissage",
            rectMode: "modeRectangles",
            smooth: "activerLissage",
            strokeCap: "terminaisonsLignes",
            strokeJoin: "jointuresLignes",
            strokeWeight: "épaisseurLignes",
            beginShape: "commencerForme",
            bezierVertex: "sommetBezier",
            curveVertex: "sommetCourbe",
            endShape: "terminerForme",
            texture: "texture",
            textureMode: "modeTextures",
            vertex: "sommet",
            shape: "forme",
            shapeMode: "modeFormes",
            isVisible: "estVisible",
            setVisible: "changerVisible",
            disableStyle: "désactiverStyle",
            enableStyle: "activerStyle",
            getChild: "enfant",
            // debug
            print: "sortirTexte",
            println: "sortirLigne",
            // transform
            applyMatrix: "appliquerMatrice",
            popMatrix: "dépilerMatrice",
            printMatrix: "sortirMatrice",
            pushMatrix: "empilerMatrice",
            resetMatrix: "réinitialiserMatrice",
            rotate: "pivoter",
            rotateX: "pivoterX",
            rotateY: "pivoterY",
            rotateZ: "pivoterZ",
            scale: "mettreÉchelle",
            translate: "déplacer",
            // effect
            // ...
            // color
            background: "arrièrePlan",
            colorMode: "modeCouleurs",
            fill: "couleurFond",
            noFill: "désactiverFond",
            noStroke: "désactiverLigne",
            stroke: "couleurLigne",
            alpha: "opacité",
            blendColor: "mélangerCouleurs",
            blue: "bleu",
            brightness: "luminosité",
            color: "couleur",
            green: "vert",
            hue: "teinte",
            lerpColor: "couleurIntermédiaire",
            red: "rouge",
            saturation: "saturation",
            // image
            createImage: "nouvelleImage",
            image: "image",
            imageMode: "modeImages",
            noTint: "désactiverTeint",
            tint: "teint",
            blend: "mélanger",
            copy: "copier",
            filter: "appliquerFiltre",
            get: "récupérerPixels",
            loadPixels: "chargerPixels",
            pixels: "pixels",
            set: "placerPixels",
            updatePixels: "actualiserPixels",
            // rendering
            createGraphics: "nouveauGraphisme",
            // typography
            createFont: "nouvellePolice",
            loadFont: "nouvellePolice",
            text: "texte",
            textFont: "policeTexte",
            textAlign: "alignementTexte",
            textLeading: "interligneTexte",
            textMode: "modeTexte",
            textSize: "tailleTexte",
            textWidth: "largeurTexte",
            textAscent: "ascensionTexte",
            textDescent: "descenteTexte"
         },
         description: {},
         values: {
            // environment
            ARROW: "Flèche",
            CROSS: "Croix",
            HAND: "Main",
            MOVE: "Déplacement",
            TEXT: "Texte",
            WAIT: "Attente",
            // shape
            CENTER: "Centre",
            RADIUS: "Rayon",
            CORNER: "Coin",
            CORNERS: "Coins",
            SQUARE: "carrées",
            PROJECT: "projetées",
            ROUND: "arrondies",
            MITER: "en onglet",
            BEVEL: "biseautées",
            POINTS: "points",
            LINES: "lignes",
            TRIANGLES: "triangles",
            TRIANGLE_FAN: "triangles en éventail",
            TRIANGLE_STRIP: "triangles en bande",
            QUADS: "quadrilatères",
            QUAD_STRIP: "quadrilatères en bande",
            IMAGE: "image",
            NORMALIZED: "normalisé",
            CLOSE: "fermée",
            // color
            RGB: "RVB",
            HSB: "TSL",
            BLEND: "fusion",
            ADD: "addition",
            SUBTRACT: "soustraction",
            DARKEST: "plus sombre",
            LIGHTEST: "plus lumineux",
            DIFFERENCE: "différence",
            EXCLUSION: "exclusion",
            MULTIPLY: "multiplication",
            SCREEN: "écran",
            OVERLAY: "recouvrement",
            HARD_LIGHT: "lumière dure",
            SOFT_LIGHT: "lumière douce",
            DODGE: "assombrissement",
            BURN: "éclaircissement",
            // image
            ARGB: "ARVB",
            ALPHA: "Alpha",
            THRESHOLD: "Seuiller",
            GRAY: "Désaturer",
            INVERT: "Inverser",
            POSTERIZE: "Postériser",
            BLUR: "Flouter",
            OPAQUE: "Rendre opaque",
            ERODE: "Éroder",
            DILATE: "Dilater",
            // typography
            LEFT: "Gauche",
            RIGHT: "Droite",
            TOP: "Haut",
            BOTTOM: "Bas",
            BASELINE: "Ligne de base",
            MODEL: "Modèle",
            SCREEN: "Écran",
            SHAPE: "Forme"
         },
         startingBlockName: "Programme",
         messages: {}
      },
      none: {
         comment: {}
      }
   }

   var context = quickAlgoContext(display, infos);
   var strings = context.setLocalLanguageStrings(localLanguageStrings);   
   
   context.processing = {
      ops: []
   };

   context.provideBlocklyColours = function() {
      return {
         categories: {
            environment: 0,
            shape: 100,
            debug: 200,
            transform: 300,
            colour: 400,
            image: 80,
            rendering: 180,
            typography: 280
         }
      };
   };

   context.reset = function(taskInfos) {
      context.processing.ops = [];
      if (context.display) {
         context.resetDisplay();
      }
   };

   context.resetDisplay = function() {
      var canvas = $('<canvas>').css('border', '1px solid black');
      var coordinatesContainer = $('<div>').text(" ");
      $('#grid').empty().append(canvas, coordinatesContainer);

      var processingInstance = new Processing(canvas.get(0), function(processing) {
         processing.setup = function() {
            processing.size(300, 300);
            processing.background(255);
         };

         processing.draw = function() {
            for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
               var op = context.processing.ops[iOp];
               typeof processing[op.func] == 'function' ? processing[op.func].apply(processing, op.args) : processing[op.func];
            }
         };

         processing.mouseMoved = function() {
            coordinatesContainer.text(processing.mouseX + " × " + processing.mouseY);
         };
         processing.mouseDragged = function() {
            coordinatesContainer.find('span').remove();
            coordinatesContainer.append($('<span>').text(" — " + processing.mouseX + " × " + processing.mouseY));
         };
         processing.mouseOut = function() {
            if (coordinatesContainer.find('span').length > 0) {
               coordinatesContainer.find('span').remove();
            } else {
               coordinatesContainer.text(" ");
            }
         };
      });

      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
      }
   };


   function drawOnBuffer() {
      var pg = Processing.createGraphics(300, 300);
      var ret;
      for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
         var op = context.processing.ops[iOp];
         ret = typeof pg[op.func] == 'function' ? pg[op.func].apply(pg, op.args) : pg[op.func];
      }
      return ret;
   }

   context.processing.commonOp = function() {
      var args = [];
      for (var iArg = 1; iArg < arguments.length - 1; iArg++) {
         args.push(arguments[iArg]);
      }
      context.processing.ops.push({ func: arguments[0], args: args });
      context.waitDelay(arguments[arguments.length - 1], drawOnBuffer());
   };


   context.customBlocks = {
      processing: {
         environment: [
            { name: "popStyle" },
            { name: "pushStyle" },
            //
            { name: "cursor", params: [{ options: ["ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT"] }] }, // variante : image, x y
            { name: "focused", yieldsValue: true },
            { name: "frameCount", yieldsValue: true },
            { name: "frameRate", params: ['Number'] }, // 60 par défaut
            { name: "__frameRate", yieldsValue: true },
            { name: "width", yieldsValue: true },
            { name: "height", yieldsValue: true },
            //
            { name: "resize", params: ['Number', 'Number'] }
         ],
         shape: [
            { name: "arc", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // les deux derniers paramètres sont des angles
            { name: "ellipse", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "line", params: ['Number', 'Number', 'Number', 'Number'] }, // variante : x1, y1, z1, x2, y2, z2
            { name: "point", params: ['Number', 'Number'] }, // variante : x, y, z
            { name: "quad", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "rect", params: ['Number', 'Number', 'Number', 'Number'] }, // variante ajoutant : radius ou (tlradius, trradius, brradius, blradius)
            { name: "triangle", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            //
            { name: "bezier", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (12 paramètres)
            { name: "bezierDetail", params: ['Number'] },
            { name: "bezierPoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "bezierTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curve", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (12 paramètres)
            { name: "curveDetail", params: ['Number'] },
            { name: "curvePoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curveTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curveTightness", params: ['Number'] },
            //
            { name: "box", params: ['Number', 'Number', 'Number'] }, // variante avec un unique paramètre
            { name: "sphere", params: ['Number'] },
            { name: "sphereDetail", params: ['Number', 'Number'] }, // variante avec un unique paramètre
            //
            { name: "ellipseMode", params: [{ options: ["CENTER", "RADIUS", "CORNER", "CORNERS"] }] },
            { name: "noSmooth" },
            { name: "rectMode", params: [{ options: ["CORNER", "CORNERS", "CENTER", "RADIUS"] }] },
            { name: "smooth" },
            { name: "strokeCap", params: [{ options: ["SQUARE", "PROJECT", "ROUND"] }] },
            { name: "strokeJoin", params: [{ options: ["MITER", "BEVEL", "ROUND"] }] },
            { name: "strokeWeight", params: ['Number'] },
            // attention : les fonctions « vertex » ci-dessous ignorent scale()
            { name: "beginShape", params: [{ options: ["POINTS", "LINES", "TRIANGLES", "TRIANGLE_FAN", "TRIANGLE_STRIP", "QUADS", "QUAD_STRIP"] }] }, // variante sans paramètre
            { name: "bezierVertex", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (9 paramètres)
            { name: "curveVertex", params: ['Number', 'Number'] }, // variante avec coordonnée z
            { name: "endShape", params: [{ options: ["CLOSE"] }] }, // variante sans paramètre
            { name: "texture", params: ['Image'] },
            { name: "textureMode", params: [{ options: ["IMAGE", "NORMALIZED"] }] },
            { name: "vertex", params: ['Number', 'Number', 'Number', 'Number', 'Number'] }, // variantes à 2, 3 et 4 paramètres
            //
            { name: "shape", params: ['Shape', 'Number', 'Number', 'Number', 'Number'] }, // variantes à 1 et 3 paramètres
            { name: "shapeMode", params: [{ options: ["CORNER", "CORNERS", "CENTER"] }] },
            //
            { name: "isVisible", yieldsValue: true },
            { name: "setVisible", params: ['Boolean'] },
            { name: "disableStyle" },
            { name: "enableStyle" },
            { name: "getChild", params: ['String'] }
         ],
         debug: [
            { name: "print", params: [null] },
            { name: "println", params: [null] }
         ],
         transform: [
            { name: "applyMatrix", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "popMatrix" },
            { name: "printMatrix" },
            { name: "pushMatrix" },
            { name: "resetMatrix" },
            { name: "rotate", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateX", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateY", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateZ", params: ['Number'] }, // le paramètre est un angle
            { name: "scale", params: ['Number', 'Number', 'Number'] }, // variantes à 1 et 2 paramètres
            { name: "translate", params: ['Number', 'Number', 'Number'] } // variantes à 2 paramètres
         ],
         effect: [
            { name: "ambientLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante à 3 paramètres
            { name: "directionalLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "lightFalloff", params: ['Number', 'Number', 'Number'] },
            { name: "lightSpecular", params: ['Number', 'Number', 'Number'] },
            { name: "lights" },
            { name: "noLights" },
            { name: "normal", params: ['Number', 'Number', 'Number'] },
            { name: "pointLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "spotLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            //
            { name: "beginCamera" },
            { name: "camera", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "endCamera" },
            { name: "frustum", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "ortho", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "perspective", params: ['Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "printCamera" },
            { name: "printProjection" },
            //
            { name: "modelX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelZ", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenZ", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            //
            { name: "ambient", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
            { name: "emissive", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
            { name: "shininess", params: ['Number'] },
            { name: "specular", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
         ],
         colour: [
            { name: "background", params: ['Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette + image
            { name: "colorMode", params: [{ options: ["RGB", "HSB"] }, 'Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 4 paramètres
            { name: "fill", params: ['Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            { name: "noFill" },
            { name: "noStroke" },
            { name: "stroke", params: ['Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            //
            { name: "alpha", params: ['Colour'], yieldsValue: true },
            { name: "blendColor", params: ['Colour', 'Colour',
                  { options: ["BLEND", "ADD", "SUBTRACT", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN",
                     "OVERLAY", "HARD_LIGHT", "SOFT_LIGHT", "DODGE", "BURN"] }],
               yieldsValue: true },
            { name: "blue", params: ['Colour'], yieldsValue: true },
            { name: "brightness", params: ['Colour'], yieldsValue: true },
            { name: "color", params: ['Number', 'Number', 'Number', 'Number'], yieldsValue: true }, // variantes à 1, 2 et 3 paramètres + palette
            { name: "green", params: ['Colour'], yieldsValue: true },
            { name: "hue", params: ['Colour'], yieldsValue: true },
            { name: "lerpColor", params: ['Colour', 'Colour', 'Number'], yieldsValue: true },
            { name: "red", params: ['Colour'], yieldsValue: true },
            { name: "saturation", params: ['Colour'], yieldsValue: true }
         ],
         image: [
            { name: "createImage", params: ['Number', 'Number', { options: ["RGB", "ARGB", "ALPHA"] }], yieldsValue: true },
            //
            { name: "image", params: ['Image', 'Number', 'Number', 'Number', 'Number'] }, // variante à 3 paramètres
            { name: "imageMode", params: [{ options: ["CORNER", "CORNERS", "CENTER"] }] },
            { name: "noTint" },
            { name: "tint", params: ['Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            //
            { name: "blend", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  { options: ["BLEND", "ADD", "SUBTRACT", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN",
                     "OVERLAY", "HARD_LIGHT", "SOFT_LIGHT", "DODGE", "BURN"] }] }, // variante : ajout d’un premier paramètre image
            { name: "copy", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante : ajout d’un premier paramètre image
            { name: "filter", params: [{ options: ["THRESHOLD", "GRAY", "INVERT", "POSTERIZE", "BLUR", "OPAQUE", "ERODE",
                     "DILATE"] }, 'Number'] }, // variante à 1 paramètre + image
            { name: "get", params: ['Number', 'Number', 'Number', 'Number'], yieldsValue: true }, // variantes à 0 et 2 paramètres
            { name: "loadPixels" },
            { name: "pixels", yieldsValue: true },
            { name: "set", params: ['Number', 'Number', 'Colour'] }, // variante : image en troisième paramètre
            { name: "updatePixels" }
         ],
         rendering: [
            { name: "createGraphics", params: ['Number', 'Number', { options: ["P2D", "P3D", "JAVA2D"] }], yieldsValue: true }
         ],
         typography: [
            { name: "createFont", params: ['String', 'Number'], yieldsValue: true },
            { name: "loadFont", params: ['String'], yieldsValue: true },
            { name: "text", params: ['String', 'Number', 'Number', 'Number', 'Number'] }, // variante : data, x, y + éventuel ajout de z
            { name: "textFont", params: ['Font', 'Number'] },
            //
            { name: "textAlign", params: [{ options: ["LEFT", "CENTER", "RIGHT"] }, { options: ["TOP", "BOTTOM", "CENTER", "BASELINE"] }] },
            { name: "textLeading", params: ['Number'] },
            { name: "textMode", params: [{ options: ["MODEL", "SCREEN", "SHAPE"] }] },
            { name: "textSize", params: ['Number'] },
            { name: "textWidth", params: ['String'], yieldsValue: true },
            //
            { name: "textAscent", yieldsValue: true },
            { name: "textDescent", yieldsValue: true }
         ],
      }
   };

   var typeKeywords = {
      'Number': { pType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
      'Colour': { pType: 'input_value', vType: 'field_colour', fName: 'COL', defVal: "#ff0000" }
   };
   for (var category in context.customBlocks.processing) {
      for (var iFunc = 0; iFunc < context.customBlocks.processing[category].length; iFunc++) {
         (function() {
            var func = context.customBlocks.processing[category][iFunc];
            if (!context.processing[func.name]) {
               if (func.params) {
                  func.blocklyJson = $.extend({ inputsInline: true, args0: {} }, func.blocklyJson);
                  func.blocklyXml = '<block type="' + func.name + '">';
                  var funcArgs = func.blocklyJson.args0;
                  for (var iParam = 0; iParam < func.params.length; iParam++) {
                     var paramType = func.params[iParam];
                     var paramData = typeKeywords[paramType] || { pType: 'input_value' };
                     if (paramType && paramType.options) {
                        paramData = { pType: 'field_dropdown' };
                        funcArgs[iParam] = $.extend({ options: [] }, funcArgs[iParam]);
                        for (var iValue = 0; iValue < paramType.options.length; iValue++) {
                           funcArgs[iParam].options.push([strings.values[paramType.options[iValue]],
                              typeof Processing !== 'undefined' ? Processing[paramType.options[iValue]] : paramType.options[iValue]]);
                        }
                        func.params[iParam] = 'Choice';
                     }
                     funcArgs[iParam] = $.extend({ type: paramData.pType, name: "PARAM_" + iParam }, funcArgs[iParam]);
                     if (paramData.colour) {
                        funcArgs[iParam].colour = paramData.colour;
                     } else if (paramData.vType) {
                        func.blocklyXml +=
                           '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                              '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                           '</shadow></value>';
                     }
                  }
                  func.blocklyXml += '</block>';
               }
               context.processing[func.name] = function() {
                  context.processing.commonOp.apply(null, [func.name].concat(Array.apply(null, arguments)));
               };
            }
         })();
      }
   }


   context.getItems = function(row, col, filters) {
      var listItems = [];
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         var itemType = infos.itemTypes[item.type];
         if ((row == undefined) || ((item.row == row) && (item.col == col))) {
            var accepted = true;
            for (var property in filters) {
               var value = filters[property];
               if ((itemType[property] == undefined) && (value != undefined)) {
                  accepted = false;
                  break;
               }
               if ((itemType[property] != undefined) && (itemType[property] != value)) {
                  accepted = false;
                  break;
               }
            }
            if (accepted) {
               item.index = iItem;
               listItems.push(item);
            }
         }
      }
      return listItems;
   };

   context.updateScale = function() {
      if (!context.display) {
         return;
      }
   };


   return context;
}
