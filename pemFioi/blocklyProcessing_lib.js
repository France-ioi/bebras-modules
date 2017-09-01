var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         categories: {
            environment: "Environnement",
            shape_2D: "Formes – 2D",
            shape_curve: "Formes – courbes",
            shape_3D: "Formes – 3D",
            shape_attributes: "Formes – attributs",
            shape_vertex: "Formes – sommets",
            shape_other: "Formes – autres",
            transform: "Transformations",
            effect_lights: "Effets – lumières",
            effect_camera: "Effets – caméra",
            effect_coordinates: "Effets – coordonnées",
            effect_material: "Effets – matière",
            color_setting: "Couleurs – réglages",
            color_creating_reading: "Couleurs – création et lecture",
            image_loading: "Images – chargement",
            image_pixels: "Images – pixels",
            rendering: "Rendu",
            typography_loading: "Typographie – chargement",
            typography_attributes: "Typographie – attributs",
            typography_metrics: "Typographie – mesures"
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
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5° et %6°",
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
            applyMatrix: "appliquer la matrice de transformation %1 %2 %3 %4, %5 %6 %7 %8, %9 %10 %11 %12, %13 %14 %15 %16",
            popMatrix: "dépiler la matrice de transformation",
            printMatrix: "sortir la matrice de transformation",
            pushMatrix: "empiler la matrice de transformation",
            resetMatrix: "réinitialiser la matrice de transformation",
            rotate: "pivoter de %1°",
            rotateX: "pivoter sur l'axe X de %1°",
            rotateY: "pivoter sur l'axe Y de %1°",
            rotateZ: "pivoter sur l'axe Z de %1°",
            scale: "appliquer une échelle de %1 %2 %3",
            translate: "déplacer de %1 %2 %3",
            // effect
            ambientLight: "ajouter une lumière ambiante %1 %2 %3 à %4 %5 %6",
            directionalLight: "ajouter une lumière directionnelle %1 %2 %3 vers %4 %5 %6",
            lightFalloff: "placer la réduction de lumière sur %1 %2 %3",
            lightSpecular: "définir la lumière spéculaire à %1 %2 %3",
            lights: "installer les lumières",
            noLights: "désactiver les lumières",
            normal: "définir le vecteur normal utilisé à %1 %2 %3",
            pointLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6",
            spotLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6 vers %7 %8 %9 selon un angle de %10 et une exponentielle de %11",
            beginCamera: "commencer un déplacement de la caméra",
            camera: "placer la caméra à %1 %2 %3 visant %4 %5 %6 éloignée de %7 %8 %9",
            endCamera: "terminer un déplacement de la caméra",
            frustum: "définir la matrice de perspective à %1 %2 %3 %4 %5 %6",
            ortho: "définir la projection orthographique à %1 %2 %3 %4 %5 %6",
            perspective: "définir la projection de perspective à %1 %2 %3 %4",
            printCamera: "sortir la matrice de la caméra",
            printProjection: "sortir la matrice de la projection",
            modelX: "coordonnée X sur le modèle du point %1 %2 %3",
            modelY: "coordonnée Y sur le modèle du point %1 %2 %3",
            modelZ: "coordonnée Z sur le modèle du point %1 %2 %3",
            screenX: "coordonnée X sur l'écran du point %1 %2 %3",
            screenY: "coordonnée Y sur l'écran du point %1 %2 %3",
            screenZ: "coordonnée Z sur l'écran du point %1 %2 %3",
            ambient: "définir la réflectance sur les formes à %1 %2 %3",
            emissive: "définir l'émission sur les formes à %1 %2 %3",
            shininess: "définir la brillance sur les formes à %1",
            specular: "définir la spécularité des formes à %1",
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
            text_: "afficher le texte %1 à %2 %3 dans un cadre de taille %4 %5",
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
            popStyle: "depilerStyle",//dépilerStyle
            pushStyle: "empilerStyle",
            cursor: "curseurSouris",
            focused: "canevasSelectionne",//canevasSélectionné
            frameCount: "numeroIteration",//numéroItération
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
            bezierDetail: "detailBezier",//détailBezier
            bezierPoint: "pointBezier",
            bezierTangent: "tangenteBezier",
            curve: "courbe",
            curveDetail: "detailCourbes",//détailCourbes
            curvePoint: "pointCourbe",
            curveTangent: "tangenteCourbe",
            curveTightness: "tensionCourbes",
            box: "boite",
            sphere: "sphere",//sphère
            sphereDetail: "detailSpheres",//détailSphères
            ellipseMode: "modeEllipses",
            noSmooth: "desactiverLissage",//désactiverLissage
            rectMode: "modeRectangles",
            smooth: "lissage",
            strokeCap: "terminaisonsLignes",
            strokeJoin: "jointuresLignes",
            strokeWeight: "epaisseurLignes",//épaisseurLignes
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
            disableStyle: "desactiverStyle",//désactiverStyle
            enableStyle: "activerStyle",
            getChild: "enfant",
            // debug
            print: "sortirTexte",
            println: "sortirLigne",
            // transform
            applyMatrix: "appliquerMatrice",
            popMatrix: "depilerMatrice",//dépilerMatrice
            printMatrix: "sortirMatrice",
            pushMatrix: "empilerMatrice",
            resetMatrix: "reinitialiserMatrice",//réinitialiserMatrice
            rotate: "pivoter",
            rotateX: "pivoterX",
            rotateY: "pivoterY",
            rotateZ: "pivoterZ",
            scale: "mettreEchelle",//mettreÉchelle
            translate: "deplacer",//déplacer
            // effect
            ambientLight: "lumiereAmbiante",//lumièreAmbiante
            directionalLight: "lumiereDirectionnelle",//lumièreDirectionnelle
            lightFalloff: "reductionLumiere",//réductionLumière
            lightSpecular: "lumiereSpeculaire",//lumièreSpéculaire
            lights: "lumieres",//lumières
            noLights: "desactiverLumieres",//désactiverLumières
            normal: "normal",
            pointLight: "lumierePoint",//lumièrePoint
            spotLight: "lumiereProjetee",//lumièreProjetée
            beginCamera: "commencerCamera",//commencerCaméra
            camera: "camera",//caméra
            endCamera: "terminerCamera",//terminerCaméra
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspective",
            printCamera: "sortirCamera",
            printProjection: "sortirProjection",
            modelX: "modeleX",//modèleX
            modelY: "modeleY",//modèleY
            modelZ: "modeleZ",//modèleZ
            screenX: "ecranX",//écranX
            screenY: "ecranY",//écranY
            screenZ: "ecranZ",//écranZ
            ambient: "ambiante",
            emissive: "emissive",//émissive
            shininess: "brillante",
            specular: "speculaire",//spéculaire
            // color
            background: "arrierePlan",//arrièrePlan
            colorMode: "modeCouleurs",
            fill: "couleurFond",
            noFill: "desactiverFond",//désactiverFond
            noStroke: "desactiverLigne",//désactiverLigne
            stroke: "couleurLigne",
            alpha: "opacite",//opacité
            blendColor: "melangerCouleurs",//mélangerCouleurs
            blue: "bleu",
            brightness: "luminosite",//luminosité
            color: "couleur",
            green: "vert",
            hue: "teinte",
            lerpColor: "couleurIntermediaire",//couleurIntermédiaire
            red: "rouge",
            saturation: "saturation",
            // image
            createImage: "nouvelleImage",
            image: "image",
            imageMode: "modeImages",
            noTint: "desactiverTeint",//désactiverTeint
            tint: "teint",
            blend: "melanger",//mélanger
            copy: "copier",
            filter: "appliquerFiltre",
            get: "recupererPixels",//récupérerPixels
            loadPixels: "chargerPixels",
            pixels: "pixels",
            set: "placerPixels",
            updatePixels: "actualiserPixels",
            // rendering
            createGraphics: "nouveauGraphisme",
            // typography
            createFont: "nouvellePolice",
            loadFont: "chargerPolice",
            text_: "texte",
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
            // rendering
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
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
         hideInitialDrawing: "Cacher le motif de départ",
         messages: {}
      },
      none: {
         comment: {}
      }
   }

   var context = quickAlgoContext(display, infos);
   var strings = context.setLocalLanguageStrings(localLanguageStrings);

   context.processing = {
      internalInstance: new Processing(),
      ops: []
   };

   context.provideBlocklyColours = function() {
      return {
         categories: {
            environment: 0,
            shape_2D: 75,
            shape_curve: 85,
            shape_3D: 95,
            shape_attributes: 105,
            shape_vertex: 115,
            shape_other: 125,
            debug: 200,
            transform: 300,
            effect_lights: 385,
            effect_camera: 395,
            effect_coordinates: 405,
            effect_material: 415,
            color_setting: 75,
            color_creating_reading: 85,
            image_loading: 175,
            image_pixels: 185,
            rendering: 280,
            typography_loading: 370,
            typography_attributes: 380,
            typography_metrics: 390,
         }
      };
   };

   context.reset = function(taskInfos) {
      context.processing.internalInstance = new Processing();
      context.processing.ops = [];
      if (taskInfos) {
         context.processing.initialDrawing = taskInfos.initialDrawing || null;
      }
      if (context.display) {
         context.resetDisplay();
      }
   };

   function initGraphics(pg) {
      pg.background(255);
      if (context.processing.initialDrawing && !$('#hideInitialDrawing').prop('checked')) {
         pg.pushStyle();
         context.processing.initialDrawing(pg);
         pg.popStyle();
      }
      pg.resetMatrix();
      pg.noLights();
      pg.fill(128);
   }

   context.resetDisplay = function() {
      var hideInitialDrawing = $('[for="hideInitialDrawing"]').parent();
      var canvas = $('<canvas>').css('border', '1px solid black');
      var coordinatesContainer = $('<div>').text(" ");
      $('#grid').empty().append(canvas, coordinatesContainer);

      if (infos.buttonHideInitialDrawing) {
         if (hideInitialDrawing.length == 0) {
            hideInitialDrawing = $('<label for="hideInitialDrawing">');
            hideInitialDrawing.text(" " + strings.hideInitialDrawing);
            hideInitialDrawing.prepend($('<input id="hideInitialDrawing" type="checkbox">'));
         }
         $('#grid').prepend($('<div style="margin-bottom: 4px;">').append(hideInitialDrawing));
      }

      var processingInstance = new Processing(canvas.get(0), function(processing) {
         processing.setup = function() {
            processing.size(300, 300);
            processing.background(255);
         };

         processing.draw = function() {
            initGraphics(processing);
            processing.pushStyle();
            for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
               var op = context.processing.ops[iOp];
               typeof processing[op.block] == 'function' ? processing[op.block].apply(processing, op.values) : processing[op.block];
            }
            processing.popStyle();
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

   context.updateScale = function() {
      if (!context.display) {
         return;
      }
   };

   context.unload = function() {
      if (context.display) {
      }
   };


   function drawOnBuffer() {
      var buffer = context.processing.internalInstance.createGraphics(300, 300);
      initGraphics(buffer);
      var ret;
      for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
         var op = context.processing.ops[iOp];
         ret = typeof buffer[op.block] == 'function' ? buffer[op.block].apply(buffer, op.values) : buffer[op.block];
      }
      context.processing.buffer = buffer;
      return ret;
   }

   context.processing.commonOp = function() {
      var blockName = arguments[0], values = [];
      for (var iParam = 1; iParam < arguments.length - 1; iParam++) {
         values.push(arguments[iParam]);
      }
      if (blockName.substr(0, 5) == 'print') {
         context.processing.internalInstance[blockName](values);
      } else {
         context.processing.ops.push({ block: blockName, values: values });
      }
      context.waitDelay(arguments[arguments.length - 1], drawOnBuffer());
   };

   context.processing.pixels = function(index, callback) {
      drawOnBuffer();
      context.processing.buffer.loadPixels();
      context.waitDelay(callback, context.processing.buffer.pixels().toArray());
   };


   context.customBlocks = {
      processing: {
         environment: [
            { name: "popStyle" },
            { name: "pushStyle" },
            //
            { name: "cursor",
               variants: [[{ options: ["ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT"] }], ['Image', 'Number', 'Number']] },
            { name: "focused", yieldsValue: true }, // must be a value
            { name: "frameCount", yieldsValue: true }, // must be a value
            { name: "frameRate", params: ['Number'] },
            { name: "__frameRate", yieldsValue: true }, // must be a value
            { name: "width", yieldsValue: true }, // must be a value
            { name: "height", yieldsValue: true }, // must be a value
            //
            { name: "resize", params: ['Number', 'Number'] }
         ],
         shape_2D: [
            { name: "arc", params: ['Number', 'Number', 'Number', 'Number', 'Angle', 'Angle'] },
            { name: "ellipse", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "line",
               variants: [['Number', 'Number', 'Number', 'Number'], ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "point", variants: [['Number', 'Number'], ['Number', 'Number', 'Number']] },
            { name: "quad", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "rect",
               variants: [['Number', 'Number', 'Number', 'Number'], ['Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "triangle", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }
         ],
         shape_curve: [
            { name: "bezier",
               variants: [['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "bezierDetail", params: ['Number'] },
            { name: "bezierPoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "bezierTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curve",
               variants: [['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "curveDetail", params: ['Number'] },
            { name: "curvePoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curveTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'], yieldsValue: true },
            { name: "curveTightness", params: ['Number'] }
         ],
         shape_3D: [
            { name: "box", variants: [['Number'], ['Number', 'Number', 'Number']] },
            { name: "sphere", params: ['Number'] },
            { name: "sphereDetail", variants: [['Number'], ['Number', 'Number']] }
         ],
         shape_attributes: [
            { name: "ellipseMode", params: [{ options: ["CENTER", "RADIUS", "CORNER", "CORNERS"] }] },
            { name: "noSmooth" },
            { name: "rectMode", params: [{ options: ["CORNER", "CORNERS", "CENTER", "RADIUS"] }] },
            { name: "smooth" },
            { name: "strokeCap", params: [{ options: ["SQUARE", "PROJECT", "ROUND"] }] },
            { name: "strokeJoin", params: [{ options: ["MITER", "BEVEL", "ROUND"] }] },
            { name: "strokeWeight", params: ['Number'] }
         ],
         shape_vertex: [
            { name: "beginShape",
               variants: [[],
                  [{ options: ["POINTS", "LINES", "TRIANGLES", "TRIANGLE_FAN", "TRIANGLE_STRIP", "QUADS", "QUAD_STRIP"] }]] },
            { name: "bezierVertex",
               variants: [['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "curveVertex", variants: [['Number', 'Number'], ['Number', 'Number', 'Number']] },
            { name: "endShape", variants: [[], [{ options: ["CLOSE"] }]] },
            { name: "texture", params: ['Image'] },
            { name: "textureMode", params: [{ options: ["IMAGE", "NORMALIZED"] }] },
            { name: "vertex",
               variants: [['Number', 'Number'], ['Number', 'Number', 'Number'], ['Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number']] }
         ],
         shape_other: [
            { name: "shape",
               variants: [['Shape'], ['Shape', 'Number', 'Number'], ['Shape', 'Number', 'Number', 'Number', 'Number']] },
            { name: "shapeMode", params: [{ options: ["CORNER", "CORNERS", "CENTER"] }] },
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
            { name: "rotate", params: ['Angle'] },
            { name: "rotateX", params: ['Angle'] },
            { name: "rotateY", params: ['Angle'] },
            { name: "rotateZ", params: ['Angle'] },
            { name: "scale", variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number']] },
            { name: "translate", variants: [['Number', 'Number'], ['Number', 'Number', 'Number']] }
         ],
         effect_lights: [
            { name: "ambientLight",
               variants: [['Number', 'Number', 'Number'], ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "directionalLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "lightFalloff", params: ['Number', 'Number', 'Number'] },
            { name: "lightSpecular", params: ['Number', 'Number', 'Number'] },
            { name: "lights" },
            { name: "noLights" },
            { name: "normal", params: ['Number', 'Number', 'Number'] },
            { name: "pointLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "spotLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number', 'Number'] }
         ],
         effect_camera: [
            { name: "beginCamera" },
            { name: "camera",
               variants: [[], ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "endCamera" },
            { name: "frustum", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "ortho", variants: [[], ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "perspective", variants: [[], ['Number', 'Number', 'Number', 'Number']] },
            { name: "printCamera" },
            { name: "printProjection" }
         ],
         effect_coordinates: [
            { name: "modelX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelZ", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenZ", params: ['Number', 'Number', 'Number'], yieldsValue: true }
         ],
         effect_material: [
            { name: "ambient", variants: [['Number'], ['Number', 'Number', 'Number'], ['Colour']] },
            { name: "emissive", variants: [['Number'], ['Number', 'Number', 'Number'], ['Colour']] },
            { name: "shininess", params: ['Number'] },
            { name: "specular", variants: [['Number'], ['Number', 'Number', 'Number'], ['Colour']] }
         ],
         color_setting: [
            { name: "background",
               variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'], ['Colour'], ['Image']] },
            { name: "colorMode",
               variants: [['ColorModeConst'], ['ColorModeConst', 'Number'], ['ColorModeConst', 'Number', 'Number', 'Number'],
                  ['ColorModeConst', 'Number', 'Number', 'Number', 'Number']] },
            { name: "fill",
               variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'], ['Colour']] },
            { name: "noFill" },
            { name: "noStroke" },
            { name: "stroke", variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'], ['Colour']] },
        ],
        color_creating_reading: [
            { name: "alpha", params: ['Colour'], yieldsValue: true },
            { name: "blendColor", params: ['Colour', 'Colour', 'BlendConst'], yieldsValue: true },
            { name: "blue", params: ['Colour'], yieldsValue: true },
            { name: "brightness", params: ['Colour'], yieldsValue: true },
            { name: "color",
               variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number']], yieldsValue: true },
            { name: "green", params: ['Colour'], yieldsValue: true },
            { name: "hue", params: ['Colour'], yieldsValue: true },
            { name: "lerpColor", params: ['Colour', 'Colour', 'Number'], yieldsValue: true },
            { name: "red", params: ['Colour'], yieldsValue: true },
            { name: "saturation", params: ['Colour'], yieldsValue: true }
         ],
         image_loading: [
            { name: "createImage", params: ['Number', 'Number', { options: ["RGB", "ARGB", "ALPHA"] }], yieldsValue: true },
            //
            { name: "image", variants: [['Image', 'Number', 'Number'], ['Image', 'Number', 'Number', 'Number', 'Number']] },
            { name: "imageMode", params: [{ options: ["CORNER", "CORNERS", "CENTER"] }] },
            { name: "noTint" },
            { name: "tint",
               variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'], ['Colour']] },
            ],
         image_pixels: [
            { name: "blend",
               variants: [['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'BlendConst'],
                  ['Image', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'BlendConst']] },
            { name: "copy",
               variants: [['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Image', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "filter", variants: [['FilterConst'], ['FilterConst', 'Number']] },
            { name: "get", variants: [[], ['Number', 'Number'], ['Number', 'Number', 'Number', 'Number']], yieldsValue: true },
            { name: "loadPixels" },
            { name: "pixels", yieldsValue: true }, // must be a list
            { name: "set", variants: [['Number', 'Number', 'Colour'], ['Number', 'Number', 'Number']] },
            { name: "updatePixels" }
         ],
         rendering: [
            { name: "createGraphics", params: ['Number', 'Number', { options: ["P2D", "P3D", "JAVA2D"] }], yieldsValue: true }
         ],
         typography_loading: [
            { name: "createFont", params: ['String', 'Number'], yieldsValue: true },
            { name: "loadFont", params: ['String'], yieldsValue: true },
            { name: "text_",
               variants: [[null, 'Number', 'Number'], [null, 'Number', 'Number', 'Number'],
                  ['String', 'Number', 'Number', 'Number', 'Number'],
                  ['String', 'Number', 'Number', 'Number', 'Number', 'Number']] },
            { name: "textFont", params: ['Font', 'Number'] }
         ],
         typography_attributes: [
            { name: "textAlign", params: [{ options: ["LEFT", "CENTER", "RIGHT"] }, { options: ["TOP", "BOTTOM", "CENTER", "BASELINE"] }] },
            { name: "textLeading", params: ['Number'] },
            { name: "textMode", params: [{ options: ["MODEL", "SCREEN", "SHAPE"] }] },
            { name: "textSize", params: ['Number'] },
            { name: "textWidth", params: ['String'], yieldsValue: true }
         ],
         typography_metrics: [
            { name: "textAscent", yieldsValue: true },
            { name: "textDescent", yieldsValue: true }
         ]
      }
   };

   var typeData = {
      'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
      'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
      'Colour': { bType: 'input_value', vType: 'colour_picker', fName: 'COLOUR', defVal: "#ffffff",
         conv: function(value) { return typeof value == 'string' ? parseInt('0xff' + value.substr(1)) : value; } },
      'Angle': { pType: 'Number', bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0,
         conv: function(value) { return value * Math.PI / 180; } },
      'Const': { conv: function(value) { return context.processing.internalInstance[value]; } },
      'ColorModeConst': { options: ["RGB", "HSB"] },
      'BlendConst': { options: ["BLEND", "ADD", "SUBTRACT", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN",
            "OVERLAY", "HARD_LIGHT", "SOFT_LIGHT", "DODGE", "BURN"] },
      'FilterConst': { options: ["THRESHOLD", "GRAY", "INVERT", "POSTERIZE", "BLUR", "OPAQUE", "ERODE", "DILATE"] }
   };
   for (var category in context.customBlocks.processing) {
      for (var iBlock = 0; iBlock < context.customBlocks.processing[category].length; iBlock++) {
         (function() {
            var block = context.customBlocks.processing[category][iBlock];
            if (!context.processing[block.name]) {
               var params = [];
               if (block.params || block.variants) {
                  if (block.variants) {
                     block.params = block.variants[0];
                     strings.label[block.name] = strings.label[block.name].replace(
                        new RegExp('\s*' + (block.params.length == 0 ? '()%1' : '(%' + block.params.length + ')') + '.*$', 'g'), '$1');
                  }
                  block.blocklyJson = $.extend({ inputsInline: true, args0: {} }, block.blocklyJson);
                  block.blocklyXml = '<block type="' + block.name + '">';
                  var blockArgs = block.blocklyJson.args0;
                  for (var iParam = 0; iParam < block.params.length; iParam++) {
                     params[iParam] = block.params[iParam];
                     var paramData = typeData[params[iParam]] || { bType: 'input_value' };
                     if (params[iParam] && params[iParam].options) {
                        paramData = params[iParam];
                        block.params[iParam] = 'Const';
                     }
                     if (paramData.options) {
                        params[iParam] = 'Const';
                        paramData.bType = 'field_dropdown';
                        blockArgs[iParam] = $.extend({ options: [] }, blockArgs[iParam]);
                        for (var iValue = 0; iValue < paramData.options.length; iValue++) {
                           blockArgs[iParam].options.push([strings.values[paramData.options[iValue]], paramData.options[iValue]]);
                        }
                     }
                     if (paramData.pType) {
                        block.params[iParam] = paramData.pType;
                     }
                     blockArgs[iParam] = $.extend({ type: paramData.bType, name: "PARAM_" + iParam }, blockArgs[iParam]);
                     if (paramData.vType) {
                        block.blocklyXml +=
                           '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                              '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                           '</shadow></value>';
                     }
                  }
                  block.blocklyXml += '</block>';
               }
               context.processing[block.name] = function() {
                  var values = [block.name.replace(/_$/, '')];
                  for (var iParam = 0; iParam < arguments.length; iParam++) {
                     var val = arguments[iParam];
                     if (params[iParam] in typeData && typeData[params[iParam]].conv) {
                        val = typeData[params[iParam]].conv(val);
                     }
                     values.push(val);
                  }
                  context.processing.commonOp.apply(null, values);
               };
            }
         })();
      }
   }


   context.checkCoveredColors = function(toCover, toAvoid) {
      var buffer = context.processing.internalInstance.createGraphics(300, 300);
      initGraphics(buffer);
      buffer.loadPixels();
      var initialPixels = buffer.pixels.toArray();
      drawOnBuffer();
      context.processing.buffer.loadPixels();
      var finalPixels = context.processing.buffer.pixels.toArray();
      var result = [true, true];
      for (var iPixel = 0; iPixel < initialPixels.length && iPixel < finalPixels.length; iPixel++) {
         var initialPixel = initialPixels[iPixel], finalPixel = finalPixels[iPixel];
         var r1 = buffer.red(initialPixel), g1 = buffer.green(initialPixel), b1 = buffer.blue(initialPixel);
         var r2 = buffer.red(finalPixel), g2 = buffer.green(finalPixel), b2 = buffer.blue(finalPixel);
         if (r2 == toCover[0] && g2 == toCover[1] && b2 == toCover[2]) {
            result[0] = false;
         } else if (r1 == toAvoid[0] && g1 == toAvoid[1] && b1 == toAvoid[2] && (r2 != r1 || g2 != g1 || b2 != b1)) {
            result[1] = false;
         }
      }
      return result;
   };


   return context;
}
