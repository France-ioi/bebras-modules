var getContext = function(display, infos) {

   var constants = {
      DEFAULT_CANVAS_SIZE: {
         width: 300, //px
         height: 300 //px
      },
      SCALED: 1,
      BACKGROUND: 0xFFFFFFFF,
      SKIP_DRAW_OPS: 1
   };

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
            image_displaying: "Images – affichage",
            image_pixels: "Images – pixels",
            rendering: "Rendu",
            typography_displaying: "Typographie – affichage",
            typography_attributes: "Typographie – attributs",
            typography_metrics: "Typographie – mesures"
         },
         label: {
            // environment
            popStyle: "dépiler le style",
            pushStyle: "empiler le style",
            cursor: "utiliser le pointeur de souris %1",
            focused: "le canevas est sélectionné",
            width: "largeur",
            height: "hauteur",
            // shape_2D
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5 et %6",
            ellipse: "dessiner une ellipse à %1 %2 de taille %3 %4",
            line: "dessiner une ligne de %1 %2 à %3 %4",
            point: "dessiner un point à %1 %2",
            quad: "dessiner un quadrilatère aux points %1 %2, %3 %4, %5 %6, %7 %8",
            rect: "dessiner un rectangle à %1 %2 de taille %3 %4",
            triangle: "dessiner un triangle aux points %1 %2, %3 %4, %5 %6",
            // shape_curve
            bezier: "dessiner une courbe de Bézier allant de %1 %2 avec les ancres %3 %4 et %5 %6 jusqu'à %7 %8",
            bezierDetail: "définir la résolution des courbes de Bézier à %1",
            bezierPoint: "coordonnée sur la courbe de Bézier allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            bezierTangent: "tangente sur la courbe de Bézier allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curve: "dessiner une courbe spline allant de %1 %2 avec les ancres %3 %4 et %5 %6 jusqu'à %7 %8",
            curveDetail: "définir la résolution des courbes splines à %1",
            curvePoint: "coordonnée sur la courbe spline allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curveTangent: "tangente sur la courbe spline allant de %1 avec les ancres %2 et %3 jusqu'au point %4 à l'emplacement %5",
            curveTightness: "définir la tension des courbes splines à %1",
            // shape_3D
            box: "dessiner une boite de taille %1 %2 %3",
            sphere: "dessiner une sphère de rayon %1",
            sphereDetail: "définir la résolution des sphères à %1 %2",
            // shape_attributes
            ellipseMode: "utiliser le mode %1 pour les ellipses",
            noSmooth: "désactiver le lissage",
            rectMode: "utiliser le mode %1 pour les rectangles",
            smooth: "activer le lissage",
            strokeCap: "utiliser des terminaisons %1",
            strokeJoin: "utiliser des jointures %1",
            strokeWeight: "définir l'épaisseur des lignes à %1",
            // shape_vertex
            beginShape: "commencer une forme avec le mode %1",
            bezierVertex: "placer un sommet de courbe de Bézier à %1 %2 %3 %4 %5 %6",
            curveVertex: "placer un sommet de courbe spline à %1 %2",
            endShape: "terminer une forme %1",
            texture: "utiliser la texture %1",
            textureMode: "utiliser le mode %1 pour se référer à la texture",
            vertex: "placer un sommet à %1 %2 %3 %4 %5",
            // shape_other
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
            rotate: "pivoter de %1",
            rotateX: "pivoter sur l'axe X de %1",
            rotateY: "pivoter sur l'axe Y de %1",
            rotateZ: "pivoter sur l'axe Z de %1",
            scale: "appliquer une échelle de %1 %2 %3",
            translate: infos['processing3D'] ? "déplacer de %1 %2 %3" : "déplacer de %1 %2",
            // effect_lights
            ambientLight: "ajouter une lumière ambiante %1 %2 %3 à %4 %5 %6",
            directionalLight: "ajouter une lumière directionnelle %1 %2 %3 vers %4 %5 %6",
            lightFalloff: "placer la réduction de lumière sur %1 %2 %3",
            lightSpecular: "définir la lumière spéculaire à %1 %2 %3",
            lights: "installer les lumières",
            noLights: "désactiver les lumières",
            normal: "définir le vecteur normal utilisé à %1 %2 %3",
            pointLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6",
            spotLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6 vers %7 %8 %9 selon un angle de %10 et une exponentielle de %11",
            // effect_camera
            beginCamera: "commencer un déplacement de la caméra",
            camera: "placer la caméra à %1 %2 %3 visant %4 %5 %6 éloignée de %7 %8 %9",
            endCamera: "terminer un déplacement de la caméra",
            frustum: "définir la matrice de perspective à %1 %2 %3 %4 %5 %6",
            ortho: "définir la projection orthographique à %1 %2 %3 %4 %5 %6",
            perspective: "définir la projection de perspective à %1 %2 %3 %4",
            printCamera: "sortir la matrice de la caméra",
            printProjection: "sortir la matrice de la projection",
            // effect_coordinates
            modelX: "coordonnée X sur le modèle du point %1 %2 %3",
            modelY: "coordonnée Y sur le modèle du point %1 %2 %3",
            modelZ: "coordonnée Z sur le modèle du point %1 %2 %3",
            screenX: "coordonnée X sur l'écran du point %1 %2 %3",
            screenY: "coordonnée Y sur l'écran du point %1 %2 %3",
            screenZ: "coordonnée Z sur l'écran du point %1 %2 %3",
            // effect_material
            ambient: "définir la réflectance sur les formes à %1 %2 %3",
            emissive: "définir l'émission sur les formes à %1 %2 %3",
            shininess: "définir la brillance sur les formes à %1",
            specular: "définir la spécularité des formes à %1",
            // color_setting
            background: "remplir l'arrière-plan avec %1 %2 %3 %4",
            colorMode: "utiliser le mode de couleur %1 avec les limites %2 %3 %4 %5",
            fill: "définir la couleur de fond à %1 %2 %3",
            noFill: "désactiver le fond",
            noStroke: "désactiver la ligne de contour",
            stroke: "définir la couleur de ligne à %1 %2 %3",
            // color_creating_reading
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
            // image_displaying
            createImage: "nouvelle image de taille %1 %2 au format %3",
            image: "afficher l'image %1 à %2 %3 avec la taille %4 %5",
            imageMode: "utiliser le mode %1 pour le positionnement des images",
            noTint: "désactiver le teint des images",
            tint: "utiliser pour les images un teint %1 %2 %3 %4",
            resize: "redimensionner à la taille %1 %2",
            // image_pixels
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
            beginDraw: "commencer à dessiner",
            endDraw: "terminer de dessiner",
            // typography_displaying
            PFont_list: "liste des polices disponibles",
            createFont: "nouvelle police de nom %1 et de taille %2",
            loadFont: "nouvelle police de nom %1",
            text_: "afficher le texte %1 à %2 %3 dans un cadre de taille %4 %5",
            textFont: "définir la police du texte à %1 avec la taille %2",
            // typography_attributes
            textAlign: "définir l'alignement du texte, à l'horizontale : %1 et à la verticale : %2",
            textLeading: "définir l'interligne du texte à %1",
            textMode: "utiliser le mode %1 pour le texte",
            textSize: "définir la taille du texte à %1",
            textWidth: "largeur du texte %1",
            // typography_metrics
            textAscent: "hauteur du texte au-dessus de la ligne de base",
            textDescent: "hauteur du texte en dessous de la ligne de base"
         },
         code: {
            // environment
            popStyle: "depilerStyle",//dépilerStyle
            pushStyle: "empilerStyle",
            cursor: "curseurSouris",
            focused: "canevasSelectionne",//canevasSélectionné
            width: "largeur",
            height: "hauteur",
            // shape_2D
            arc: "arc",
            ellipse: "ellipse",
            line: "ligne",
            point: "point",
            quad: "quad",
            rect: "rect",
            triangle: "triangle",
            // shape_curve
            bezier: "bezier",
            bezierDetail: "detailBezier",//détailBezier
            bezierPoint: "pointBezier",
            bezierTangent: "tangenteBezier",
            curve: "courbe",
            curveDetail: "detailCourbes",//détailCourbes
            curvePoint: "pointCourbe",
            curveTangent: "tangenteCourbe",
            curveTightness: "tensionCourbes",
            // shape_3D
            box: "boite",
            sphere: "sphere",//sphère
            sphereDetail: "detailSpheres",//détailSphères
            // shape_attributes
            ellipseMode: "modeEllipses",
            noSmooth: "desactiverLissage",//désactiverLissage
            rectMode: "modeRectangles",
            smooth: "lissage",
            strokeCap: "terminaisonsLignes",
            strokeJoin: "jointuresLignes",
            strokeWeight: "epaisseurLignes",//épaisseurLignes
            // shape_vertex
            beginShape: "commencerForme",
            bezierVertex: "sommetBezier",
            curveVertex: "sommetCourbe",
            endShape: "terminerForme",
            texture: "texture",
            textureMode: "modeTextures",
            vertex: "sommet",
            // shape_other
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
            // effect_lights
            ambientLight: "lumiereAmbiante",//lumièreAmbiante
            directionalLight: "lumiereDirectionnelle",//lumièreDirectionnelle
            lightFalloff: "reductionLumiere",//réductionLumière
            lightSpecular: "lumiereSpeculaire",//lumièreSpéculaire
            lights: "lumieres",//lumières
            noLights: "desactiverLumieres",//désactiverLumières
            normal: "normal",
            pointLight: "lumierePoint",//lumièrePoint
            spotLight: "lumiereProjetee",//lumièreProjetée
            // effect_camera
            beginCamera: "commencerCamera",//commencerCaméra
            camera: "camera",//caméra
            endCamera: "terminerCamera",//terminerCaméra
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspective",
            printCamera: "sortirCamera",
            printProjection: "sortirProjection",
            // effect_coordinates
            modelX: "modeleX",//modèleX
            modelY: "modeleY",//modèleY
            modelZ: "modeleZ",//modèleZ
            screenX: "ecranX",//écranX
            screenY: "ecranY",//écranY
            screenZ: "ecranZ",//écranZ
            // effect_material
            ambient: "ambiante",
            emissive: "emissive",//émissive
            shininess: "brillante",
            specular: "speculaire",//spéculaire
            // color_setting
            background: "arrierePlan",//arrièrePlan
            colorMode: "modeCouleurs",
            fill: "couleurFond",
            noFill: "desactiverFond",//désactiverFond
            noStroke: "desactiverLigne",//désactiverLigne
            stroke: "couleurLigne",
            // color_creating_reading
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
            // image_displaying
            createImage: "nouvelleImage",
            image: "image",
            imageMode: "modeImages",
            noTint: "desactiverTeint",//désactiverTeint
            tint: "teint",
            resize: "redimensionner",
            // image_displaying
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
            beginDraw: "commencerDessin",
            endDraw: "terminerDessin",
            // typography_displaying
            PFont_list: "listePolices",
            createFont: "nouvellePolice",
            loadFont: "chargerPolice",
            text_: "texte",
            textFont: "policeTexte",
            // typography_attributes
            textAlign: "alignementTexte",
            textLeading: "interligneTexte",
            textMode: "modeTexte",
            textSize: "tailleTexte",
            textWidth: "largeurTexte",
            // typography_metrics
            textAscent: "ascensionTexte",
            textDescent: "descenteTexte"
         },
         description: {
            // environment
            popStyle: "restaure le style précédant le dernier empilement avec <code>empilerStyle()</code>",
            pushStyle: "enregistre le style actuel afin qu'il puisse être restauré par <code>depilerStyle()</code>",//dépilerStyle
            cursor: "utilise l'image indiquée ou fournie pour représenter la souris sur le canevas",
            focused: "vrai si le canevas est sélectionné, faux sinon",
            width: "largeur du canevas",
            height: "hauteur du canevas",
            // shape_2D
            arc: "dessine l'arc de l'ellipse aux propriétés indiquées, " +
               "depuis l'angle <var>début</var> jusqu'à l'angle <var>fin</var> (donnés en degrés)",
            ellipse: "dessine l'ellipse aux coordonnées indiquées avec la taille indiquée, " +
               "dont le fonctionnement peut être changé par la fonction <code>modeEllipses</code>",
            line: "dessine la ligne allant du premier point au second point indiqués",
            point: "dessine un point (disque dont le diamètre correspond à l'épaisseur des lignes actuelle) " +
               "aux coordonnées indiquées",
            quad: "dessine un quadrilatère ayant pour sommets les quatre points indiqués",
            rect: "dessine un rectangle aux coordonnées indiquées avec la taille indiquée, dont le fonctionnement " +
               "peut être changé par la fonction <code>modeRectangles</code>, et avec les rayons indiqués pour arrondir les coins",
            triangle: "dessine un triangle ayant pour sommets les trois points indiqués",
            // shape_curve
            /*bezier: "bezier",
            bezierDetail: "detailBezier",//détailBezier
            bezierPoint: "pointBezier",
            bezierTangent: "tangenteBezier",
            curve: "courbe",
            curveDetail: "detailCourbes",//détailCourbes
            curvePoint: "pointCourbe",
            curveTangent: "tangenteCourbe",
            curveTightness: "tensionCourbes",
            // shape_3D
            box: "boite",
            sphere: "sphere",//sphère
            sphereDetail: "detailSpheres",//détailSphères*/
            // shape_attributes
            ellipseMode: "définit la manière dont les propriétés des ellipses sont interprétées — " +
               "<code>CENTRE</code> et <code>RAYON</code> utilisent les coordonnées comme centre, <code>RAYON</code> utilise " +
               "la taille comme des rayons, <code>COIN</code> et <code>COINS</code> utilisent les coordonnées " +
               "comme coin haut-gauche, <code>COINS</code> utilise la taille comme coordonnées du coin bas-droite",
            noSmooth: "désactive le lissage appliqué aux formes",
            rectMode: "définit la manière dont les propriétés " +
               "des rectangles sont interprétées — voir modeEllipses",
            smooth: "active le lissage appliqué aux formes",
            strokeCap: "définit le style de terminaison des lignes (<code>CARREES</code>, <code>PROJETEES</code> " +//CARRÉES, PROJETÉES
               "ou <code>ARRONDIES</code>)",
            strokeJoin: "définit le style de jointure des segments de lignes (<code>EN_ONGLET</code>, <code>BISEAUTEES</code> " +//BISEAUTÉES
               "ou <code>ARRONDIES</code>)",
            strokeWeight: "définit l'épaisseur des lignes, en pixels",
            // shape_vertex
            /*beginShape: "commencerForme",
            bezierVertex: "sommetBezier",
            curveVertex: "sommetCourbe",
            endShape: "terminerForme",
            texture: "texture",
            textureMode: "modeTextures",
            vertex: "sommet",
            // shape_other
            shape: "forme",
            shapeMode: "modeFormes",
            isVisible: "estVisible",
            setVisible: "changerVisible",
            disableStyle: "desactiverStyle",//désactiverStyle
            enableStyle: "activerStyle",
            getChild: "enfant",*/
            // debug
            print: "affiche le texte ou les données indiquées dans la console",
            println: "affiche le texte ou les données indiquées dans la console, suivies d'une fin de ligne",
            // transform
            /*applyMatrix: "appliquerMatrice",
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
            // effect_lights
            ambientLight: "lumiereAmbiante",//lumièreAmbiante
            directionalLight: "lumiereDirectionnelle",//lumièreDirectionnelle
            lightFalloff: "reductionLumiere",//réductionLumière
            lightSpecular: "lumiereSpeculaire",//lumièreSpéculaire
            lights: "lumieres",//lumières
            noLights: "desactiverLumieres",//désactiverLumières
            normal: "normal",
            pointLight: "lumierePoint",//lumièrePoint
            spotLight: "lumiereProjetee",//lumièreProjetée
            // effect_camera
            beginCamera: "commencerCamera",//commencerCaméra
            camera: "camera",//caméra
            endCamera: "terminerCamera",//terminerCaméra
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspective",
            printCamera: "sortirCamera",
            printProjection: "sortirProjection",
            // effect_coordinates
            modelX: "modeleX",//modèleX
            modelY: "modeleY",//modèleY
            modelZ: "modeleZ",//modèleZ
            screenX: "ecranX",//écranX
            screenY: "ecranY",//écranY
            screenZ: "ecranZ",//écranZ
            // effect_material
            ambient: "ambiante",
            emissive: "emissive",//émissive
            shininess: "brillante",
            specular: "speculaire",//spéculaire*/
            // color_setting
            background: "remplit le canevas avec la couleur indiquée (doit être utilisé en tout début de programme)",
            colorMode: "définit la manière dont les composantes des couleurs sont interprétées ; le premier paramètre définit " +
               "le mode (<code>RVB</code> pour rouge, vert et bleu ; <code>TSL</code> pour teinte, saturation, luminosité) ; " +
               "les suivants définissent la valeur maximale (255 par défaut)",
            fill: "définit la couleur de fond utilisée pour le dessin",
            noFill: "utilise un fond transparent pour les prochains dessins",
            noStroke: "utilise une ligne transparente pour les prochains dessins",
            stroke: "définit la couleur de ligne utilisée pour le dessin",
            // color_creating_reading
            alpha: "extrait la valeur d'opacité d'une couleur",
            blendColor: "fournit la couleur obtenue par le mélange des deux couleurs indiquées avec le mode indiqué " +
               "(<code>FUSION</code>, <code>ADDITION</code>, <code>SOUSTRACTION</code>, <code>LE_PLUS_SOMBRE</code>, " +
               "<code>LE_PLUS_LUMINEUX</code>, <code>DIFFERENCE</code>, <code>EXCLUSION</code>, <code>MULTIPLICATION</code>, " +//DIFFÉRENCE
               "<code>ECRAN</code>, <code>RECOUVREMENT</code>, <code>LUMIERE_DURE</code>, <code>LUMIERE_DOUCE</code>, " +//ÉCRAN, LUMIÈRE_DURE, LUMIÈRE_DOUCE
               "<code>ASSOMBRISSEMENT</code> ou <code>ECLAIRCISSEMENT</code>)",//ÉCLAIRCISSEMENT
            blue: "extrait la valeur de bleu d'une couleur",
            brightness: "extrait la valeur de luminosité d'une couleur",
            color: "crée une couleur avec les valeurs indiquées",
            green: "extrait la valeur de vert d'une couleur",
            hue: "extrait la valeur de teinte d'une couleur",
            lerpColor: "fournit une couleur interpolée entre les deux couleurs indiquées, " +
               "l'emplacement étant une valeur entre 0 et 1 (0 correspond à la première couleur, 0,1 en est proche, " +
               "0,5 est au milieu des deux…)",
            red: "extrait la quantité de rouge d'une couleur",
            saturation: "extrait la quantité de saturation d'une couleur",
            // image_displaying
            /*createImage: "nouvelleImage",
            image: "image",
            imageMode: "modeImages",
            noTint: "desactiverTeint",//désactiverTeint
            tint: "teint",
            resize: "redimensionner",
            // image_displaying
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
            beginDraw: "commencerDessin()",
            endDraw: "terminerDessin()",
            // typography_displaying
            PFont_list: "listePolices()",
            createFont: "nouvellePolice",
            loadFont: "chargerPolice",
            text_: "texte",
            textFont: "policeTexte",
            // typography_attributes
            textAlign: "alignementTexte",
            textLeading: "interligneTexte",
            textMode: "modeTexte",
            textSize: "tailleTexte",
            textWidth: "largeurTexte",
            // typography_metrics
            textAscent: "ascensionTexte",
            textDescent: "descenteTexte"*/
         },
         params: {
            mode: "mode",
            image: "image",
            width: "largeur",
            height: "hauteur",
            radius: "rayon",
            tlradius: "rayonHG",
            trradius: "rayonHD",
            brradius: "rayonBD",
            blradius: "rayonBG",
            start: "début",
            stop: "fin",
            detail: "détail",
            squishy: "tension",
            visible: "visible",
            target: "cible",
            angle: "angle",
            constant: "constante",
            linear: "coefLin",
            quadratic: "coefQuad",
            concentration: "concentration",
            eyeX: "xŒil",
            eyeY: "yŒil",
            eyeZ: "zŒil",
            centerX: "xCentre",
            centerY: "yCentre",
            centerZ: "zCentre",
            upX: "xHaut",
            upY: "yHaut",
            upZ: "zHaut",
            left: "gauche",
            right: "droite",
            bottom: "bas",
            top: "haut",
            near: "auprès",
            far: "auLoin",
            fov: "champDeVision",
            aspect: "aspect",
            zNear: "zPrès",
            zFar: "zLoin",
            shine: "brillance",
            size: "taille",
            text: "texte",
            gray: "gris",
            alpha: "opacité",
            value1: "valeur1",
            value2: "valeur2",
            value3: "valeur3",
            color: "couleur",
            color1: "couleur1",
            color2: "couleur2",
            range: "étendue",
            range1: "étendue1",
            range2: "étendue2",
            range3: "étendue3",
            range4: "étendue4",
            amount: "emplacement",
            srcImg: "imgSrc",
            dx: "xDest",
            dy: "yDest",
            dwidth: "largeurDest",
            dheight: "largeurDest",
            param: "param",
            renderer: "moteur",
            name: "nom",
            data: "donnée",
            font: "police",
            align: "align",
            yAlign: "alignY",
            dist: "dist"
         },
         constantLabel: {
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
            MODEL: "modèle",
            SHAPE: "forme"
         },
         constant: {
            // environment
            ARROW: "FLECHE",//FLÈCHE
            CROSS: "CROIX",
            HAND: "MAIN",
            MOVE: "DEPLACEMENT",//DÉPLACEMENT
            TEXT: "TEXTE",
            WAIT: "ATTENTE",
            // shape
            CENTER: "CENTRE",
            RADIUS: "RAYON",
            CORNER: "COIN",
            CORNERS: "COINS",
            SQUARE: "CARREES",//CARRÉES
            PROJECT: "PROJETEES",//PROJETÉES
            ROUND: "ARRONDIES",
            MITER: "EN_ONGLET",
            BEVEL: "BISEAUTEES",//BISEAUTÉES
            POINTS: "POINTS",
            LINES: "LIGNES",
            TRIANGLES: "TRIANGLES",
            TRIANGLE_FAN: "TRIANGLES_EN_EVENTAIL",//TRIANGLES_EN_ÉVANTAIL
            TRIANGLE_STRIP: "TRIANGLES_EN_BANDE",
            QUADS: "QUADRILATERES",//QUADRILATÈRES
            QUAD_STRIP: "QUADRILATERES_EN_BANDE",//QUADRILATÈRES_EN_BANDE
            IMAGE: "IMAGE",
            NORMALIZED: "NORMALISE",//NORMALISÉ
            CLOSE: "FERMEE",//FERMÉE
            // color
            RGB: "RVB",
            HSB: "TSL",
            BLEND: "FUSION",
            ADD: "ADDITION",
            SUBTRACT: "SOUSTRACTION",
            DARKEST: "LE_PLUS_SOMBRE",
            LIGHTEST: "LE_PLUS_LUMINEUX",
            DIFFERENCE: "DIFFERENCE",//DIFFÉRENCE
            EXCLUSION: "EXCLUSION",
            MULTIPLY: "MULTIPLICATION",
            SCREEN: "ECRAN",//ÉCRAN
            OVERLAY: "RECOUVREMENT",
            HARD_LIGHT: "LUMIERE_DURE",//LUMIÈRE_DURE
            SOFT_LIGHT: "LUMIERE_DOUCE",//LUMIÈRE_DOUCE
            DODGE: "ASSOMBRISSEMENT",
            BURN: "ECLAIRCISSEMENT",//ÉCLAIRCISSEMENT
            // image
            ARGB: "ARVB",
            ALPHA: "ALPHA",
            THRESHOLD: "SEUILLER",
            GRAY: "DESATURER",//DÉSATURER
            INVERT: "INVERSER",
            POSTERIZE: "POSTERISER",//POSTÉRISER
            BLUR: "FLOUTER",
            OPAQUE: "RENDRE_OPAQUE",
            ERODE: "ERODER",//ÉRODER
            DILATE: "DILATER",
            // rendering
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            // typography
            LEFT: "GAUCHE",
            RIGHT: "DROITE",
            TOP: "HAUT",
            BOTTOM: "BAS",
            BASELINE: "LIGNE_DE_BASE",
            MODEL: "MODELE",//MODÈLE
            SHAPE: "FORME"
         },
         startingBlockName: "Programme",
         hideInitialDrawing: "Cacher le motif de départ",
         exportAsSvg: "Exporter en SVG",
         messages: {
            redCoveredGreenNotCovered: "Vous avez bien recouvert tout le rouge sans toucher au vert.",
            redNotCovered: "Recouvrez bien toute la partie rouge.",
            greenCovered: "Vous avez caché la partie rouge, mais avez recouvert une partie du vert.",
            redNotCoveredGreenCovered: "Vous n'avez pas masqué la partie rouge, et avez recouvert une partie du vert !",
            tooManyWhitePixelsCovered: "Trop de pixels blancs ont été recouverts. Votre score est de {score} sur {initial_score}.",
            allFiguresMustBeConnected: "Toutes les formes doivent être connexes.",
            taskCompleted: "Mission accomplie !"
         },
         misc: {
            colon: " : "
         }
      },
      en: {
         categories: {
            environment: "Environment",
            shape_2D: "Shape – 2D",
            shape_curve: "Shape – courbes",
            shape_3D: "Shape – 3D",
            shape_attributes: "Shape – attributes",
            shape_vertex: "Shape – vertex",
            shape_other: "Shape – other",
            transform: "Transform",
            effect_lights: "Effect – lights",
            effect_camera: "Effect – camera",
            effect_coordinates: "Effect – coordinates",
            effect_material: "Effect – material",
            color_setting: "Color – setting",
            color_creating_reading: "Color – creating and reading",
            image_displaying: "Image – displaying",
            image_pixels: "Image – pixels",
            rendering: "Rendering",
            typography_displaying: "Typography – displaying",
            typography_attributes: "Typography – attributes",
            typography_metrics: "Typography – metrics"
         },
         label: {
            // environment
            popStyle: "pop style",
            pushStyle: "push style",
            cursor: "use mouse pointer %1",
            focused: "canvas is focused",
            width: "width",
            height: "height",
            // shape_2D
            arc: "draw an arc at %1 %2 of size %3 %4 between angles %5 and %6",
            ellipse: "draw an ellipse at %1 %2 of size %3 %4",
            line: "draw a line from %1 %2 to %3 %4",
            point: "draw a point at %1 %2",
            quad: "draw a quadrilateral at points %1 %2, %3 %4, %5 %6, %7 %8",
            rect: "draw a rectangle at %1 %2 of size %3 %4",
            triangle: "draw a triangle at points %1 %2, %3 %4, %5 %6",
            // shape_curve
            bezier: "draw a Bezier curve from %1 %2 with anchors %3 %4 and %5 %6 to %7 %8",
            bezierDetail: "set Bezier curve resolution to %1",
            bezierPoint: "coordinate on Bezier curve from %1 with anchors %2 and %3 to %4 at position %5",
            bezierTangent: "tangent on Bezier curve from %1 with anchors %2 and %3 to %4 at position %5",
            curve: "draw spline curve from %1 %2 with anchors %3 %4 and %5 %6 to %7 %8",
            curveDetail: "set spline curve resolution to %1",
            curvePoint: "coordinate on spline curve from %1 with anchors %2 and %3 to %4 at position %5",
            curveTangent: "tangent on spline curve from %1 with anchors %2 and %3 to %4 at position %5",
            curveTightness: "set spline curve tightness to %1",
            // shape_3D
            box: "draw a box with size %1 %2 %3",
            sphere: "draw a sphere with radius %1",
            sphereDetail: "set sphere resolution to %1 %2",
            // shape_attributes
            ellipseMode: "use %1 mode for ellipses",
            noSmooth: "disable smoothing",
            rectMode: "use %1 mode for rectangles",
            smooth: "enable smoothing",
            strokeCap: "use %1 stroke caps",
            strokeJoin: "use %1 stroke joints",
            strokeWeight: "set stroke weight to %1",
            // shape_vertex
            beginShape: "begin a shape with %1 mode",
            bezierVertex: "put a Bezier curve vertex at %1 %2 %3 %4 %5 %6",
            curveVertex: "put a spline curve vertex at %1 %2",
            endShape: "end a shape %1",
            texture: "use texture %1",
            textureMode: "use %1 mode to refer to texture",
            vertex: "put a vertex at %1 %2 %3 %4 %5",
            // shape_other
            shape: "display shape %1 at %2 %3 with size %4 %5",
            shapeMode: "use %1 mode for shapes",
            isVisible: "is visible",
            setVisible: "set visibility to %1",
            disableStyle: "disable specific style",
            enableStyle: "enable specific style",
            getChild: "child %1",
            // debug
            print: "print %1",
            println: "print line %1",
            // transform
            applyMatrix: "apply transform matrix %1 %2 %3 %4, %5 %6 %7 %8, %9 %10 %11 %12, %13 %14 %15 %16",
            popMatrix: "pop transform matrix",
            printMatrix: "print transform matrix",
            pushMatrix: "push transform matrix",
            resetMatrix: "reset transform matrix",
            rotate: "rotate by %1",
            rotateX: "rotate on X axis by %1",
            rotateY: "rotate on Y axis by %1",
            rotateZ: "rotate on Z axis by %1",
            scale: "scale by %1 %2 %3",
            translate: infos['processing3D'] ? "translate by %1 %2 %3" : "translate by %1 %2",
            // effect_lights
            ambientLight: "add an ambient light %1 %2 %3 at %4 %5 %6",
            directionalLight: "add a directional light %1 %2 %3 toward %4 %5 %6",
            lightFalloff: "put light falloff at %1 %2 %3",
            lightSpecular: "set specular light to %1 %2 %3",
            lights: "lay lights",
            noLights: "remove lights",
            normal: "set normal vector to %1 %2 %3",
            pointLight: "add a light %1 %2 %3 from %4 %5 %6",
            spotLight: "add a light %1 %2 %3 from %4 %5 %6 toward %7 %8 %9 with a angle of %10 and an exponent of %11",
            // effect_camera
            beginCamera: "begin camera movement",
            camera: "put camera at %1 %2 %3 toward %4 %5 %6 distant with %7 %8 %9",
            endCamera: "end camera movement",
            frustum: "set perspective matrix to %1 %2 %3 %4 %5 %6",
            ortho: "set orthographic projection to %1 %2 %3 %4 %5 %6",
            perspective: "set perspective projection to %1 %2 %3 %4",
            printCamera: "print camera matrix",
            printProjection: "print projection matrix",
            // effect_coordinates
            modelX: "model X coordinate of point %1 %2 %3",
            modelY: "model Y coordinate of point %1 %2 %3",
            modelZ: "model Z coordinate of point %1 %2 %3",
            screenX: "screen X coordinate of point %1 %2 %3",
            screenY: "screen Y coordinate of point %1 %2 %3",
            screenZ: "screen Z coordinate of point %1 %2 %3",
            // effect_material
            ambient: "set reflectance on shapes to %1 %2 %3",
            emissive: "set emission on shapes to %1 %2 %3",
            shininess: "set shininess on shapes to %1",
            specular: "set specularity on shapes to %1",
            // color_setting
            background: "fill background with %1 %2 %3 %4",
            colorMode: "use %1 color mode with limits %2 %3 %4 %5",
            fill: "set fill color to %1 %2 %3",
            noFill: "disable fill",
            noStroke: "disable stroke",
            stroke: "set stroke color to %1 %2 %3",
            // color_creating_reading
            alpha: "opacity of %1",
            blendColor: "blend colors %1 and %2 with %3 mode",
            blue: "blue of %1",
            brightness: "brighness of %1",
            color: "color %1 %2 %3 %4",
            green: "green of %1",
            hue: "hue of %1",
            lerpColor: "lerp color between %1 and %2 at position %3",
            red: "red of %1",
            saturation: "saturation of %1",
            // image_displaying
            createImage: "new image of size %1 %2 with format %3",
            image: "display image %1 at %2 %3 with size %4 %5",
            imageMode: "use %1 mode to position images",
            noTint: "disable image tint",
            tint: "use image tint %1 %2 %3 %4",
            resize: "resize to %1 %2",
            // image_pixels
            blend: "blend source at %1 %2 size %3 %4 with destination %5 %6 size %7 %8 with %9 mode",
            copy: "copy source at %1 %2 size %3 %4 on destination at %5 %6 size %7 %8",
            filter: "apply filter %1 with level %2",
            get: "get pixels at %1 %2 size %3 %4",
            loadPixels: "load pixels",
            pixels: "pixels",
            set: "set at %1 %2 color %3",
            updatePixels: "update pixels",
            // rendering
            createGraphics: "new graphics of size %1 %2 with renderer %3",
            beginDraw: "begin drawing",
            endDraw: "end drawing",
            // typography_displaying
            PFont_list: "list available fonts",
            createFont: "new font with name %1 and size %2",
            loadFont: "new font with name %1",
            text_: "display text %1 at %2 %3 in a frame of size %4 %5",
            textFont: "set text font to %1 with size %2",
            // typography_attributes
            textAlign: "set text alignment to, horizontally : %1 and vertically : %2",
            textLeading: "set text leading to %1",
            textMode: "use %1 mode for text",
            textSize: "set text size to %1",
            textWidth: "width of text %1",
            // typography_metrics
            textAscent: "text ascent",
            textDescent: "text descent"
         },
         code: {
            // environment
            popStyle: "popStyle",
            pushStyle: "pushStyle",
            cursor: "mouseCursor",
            focused: "canvasFocused",
            width: "width",
            height: "height",
            // shape_2D
            arc: "arc",
            ellipse: "ellipse",
            line: "line",
            point: "point",
            quad: "quad",
            rect: "rect",
            triangle: "triangle",
            // shape_curve
            bezier: "bezier",
            bezierDetail: "bezierDetail",
            bezierPoint: "bezierPoint",
            bezierTangent: "bezierTangent",
            curve: "curve",
            curveDetail: "curveDetail",
            curvePoint: "curvePoint",
            curveTangent: "curveTangent",
            curveTightness: "curveTightness",
            // shape_3D
            box: "box",
            sphere: "sphere",
            sphereDetail: "sphereDetail",
            // shape_attributes
            ellipseMode: "ellipseMode",
            noSmooth: "noSmooth",
            rectMode: "rectMode",
            smooth: "smooth",
            strokeCap: "strokeCap",
            strokeJoin: "strokeJoin",
            strokeWeight: "strokeWeight",
            // shape_vertex
            beginShape: "beginShape",
            bezierVertex: "bezierVertex",
            curveVertex: "curveVertex",
            endShape: "endShape",
            texture: "texture",
            textureMode: "textureMode",
            vertex: "vertex",
            // shape_other
            shape: "shape",
            shapeMode: "shapeMode",
            isVisible: "isVisible",
            setVisible: "setVisible",
            disableStyle: "disableStyle",
            enableStyle: "enableStyle",
            getChild: "getChild",
            // debug
            print: "print",
            println: "println",
            // transform
            applyMatrix: "applyMatrix",
            popMatrix: "popMatrix",
            printMatrix: "printMatrix",
            pushMatrix: "pushMatrix",
            resetMatrix: "resetMatrix",
            rotate: "rotate",
            rotateX: "rotateX",
            rotateY: "rotateY",
            rotateZ: "rotateZ",
            scale: "scale",
            translate: "translate",
            // effect_lights
            ambientLight: "ambientLight",
            directionalLight: "directionalLight",
            lightFalloff: "lightFalloff",
            lightSpecular: "lightSpecular",
            lights: "lights",
            noLights: "noLights",
            normal: "normal",
            pointLight: "pointLight",
            spotLight: "spotLight",
            // effect_camera
            beginCamera: "beginCamera",
            camera: "camera",
            endCamera: "endCamera",
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspective",
            printCamera: "printCamera",
            printProjection: "printProjection",
            // effect_coordinates
            modelX: "modelX",
            modelY: "modelY",
            modelZ: "modelZ",
            screenX: "screenX",
            screenY: "screenY",
            screenZ: "screenZ",
            // effect_material
            ambient: "ambient",
            emissive: "emissive",
            shininess: "shininess",
            specular: "specular",
            // color_setting
            background: "background",
            colorMode: "colorMode",
            fill: "fill",
            noFill: "noFill",
            noStroke: "noStroke",
            stroke: "stroke",
            // color_creating_reading
            alpha: "alpha",
            blendColor: "blendColor",
            blue: "blue",
            brightness: "brightness",
            color: "color",
            green: "green",
            hue: "hue",
            lerpColor: "lerpColor",
            red: "red",
            saturation: "saturation",
            // image_displaying
            createImage: "createImage",
            image: "image",
            imageMode: "imageMode",
            noTint: "noTint",
            tint: "tint",
            resize: "resize",
            // image_displaying
            blend: "blend",
            copy: "copy",
            filter: "filter",
            get: "get",
            loadPixels: "loadPixels",
            pixels: "pixels",
            set: "set",
            updatePixels: "updatePixels",
            // rendering
            createGraphics: "createGraphics",
            beginDraw: "beginDraw",
            endDraw: "endDraw",
            // typography_displaying
            PFont_list: "PFont_list",
            createFont: "createFont",
            loadFont: "loadFont",
            text_: "text_",
            textFont: "textFont",
            // typography_attributes
            textAlign: "textAlign",
            textLeading: "textLeading",
            textMode: "textMode",
            textSize: "textSize",
            textWidth: "textWidth",
            // typography_metrics
            textAscent: "textAscent",
            textDescent: "textDescent"
         },
         description: {},
         constantLabel: {
            // environment
            ARROW: "Arrow",
            CROSS: "Cross",
            HAND: "Hand",
            MOVE: "Move",
            TEXT: "Text",
            WAIT: "Wait",
            // shape
            CENTER: "Center",
            RADIUS: "Radius",
            CORNER: "Corner",
            CORNERS: "Corners",
            SQUARE: "square",
            PROJECT: "project",
            ROUND: "round",
            MITER: "miter",
            BEVEL: "bevel",
            POINTS: "points",
            LINES: "lines",
            TRIANGLES: "triangles",
            TRIANGLE_FAN: "triangle fan",
            TRIANGLE_STRIP: "triangle strip",
            QUADS: "quads",
            QUAD_STRIP: "quad strip",
            IMAGE: "image",
            NORMALIZED: "normalizep",
            CLOSE: "closed",
            // color
            RGB: "RGB",
            HSB: "HSB",
            BLEND: "blend",
            ADD: "add",
            SUBTRACT: "substract",
            DARKEST: "darkest",
            LIGHTEST: "lightest",
            DIFFERENCE: "difference",
            EXCLUSION: "exclusion",
            MULTIPLY: "multiply",
            SCREEN: "screen",
            OVERLAY: "overlay",
            HARD_LIGHT: "hard light",
            SOFT_LIGHT: "soft light",
            DODGE: "dodge",
            BURN: "burn",
            // image
            ARGB: "ARGB",
            ALPHA: "Alpha",
            THRESHOLD: "Threshold",
            GRAY: "Gray",
            INVERT: "Invert",
            POSTERIZE: "Posterize",
            BLUR: "Blur",
            OPAQUE: "Opaque",
            ERODE: "Erode",
            DILATE: "Dilate",
            // rendering
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            // typography
            LEFT: "Left",
            RIGHT: "Right",
            TOP: "Top",
            BOTTOM: "Bottom",
            BASELINE: "Baseline",
            MODEL: "model",
            SHAPE: "shape"
         },
         startingBlockName: "Program",
         hideInitialDrawing: "Hide initial drawing",
         exportAsSvg: "Export to SVG",
         messages: {
             // google translate :)
            redCoveredGreenNotCovered: "You covered all the red without touching the green.",
            redNotCovered: "Cover the entire red part.",
            greenCovered: "You hid the red part, but covered some of the green.",
            redNotCoveredGreenCovered: "You did not hide the red part, and covered some of the green!",
            tooManyWhitePixelsCovered: "Too many white pixels were covered, your score is {score} of {initial_score}.",
            allFiguresMustBeConnected: "All figures must be connected.",
            taskCompleted: "Task completed!"
         },
         misc: {
            colon: ": "
         }
      },
      nl: {
         categories: {
            environment: "Omgeving",
            shape_2D: "Vormen – 2D",
            shape_curve: "Vormen – krommen",
            shape_3D: "Vormen – 3D",
            shape_attributes: "Vormen – attributen",
            shape_vertex: "Vormen – hoekpunten",
            shape_other: "Vormen – overige",
            transform: "Transformaties",
            effect_lights: "Effecten – lichten",
            effect_camera: "Effecten – camera",
            effect_coordinates: "Effecten – coördinaten",
            effect_material: "Effecten – materiaal",
            color_setting: "Kleuren – instellingen",
            color_creating_reading: "Kleuren – maken en lezen",
            image_displaying: "Beelden – weergave",
            image_pixels: "Beelden – pixels",
            rendering: "Rendering",
            typography_displaying: "Typografie – weergave",
            typography_attributes: "Typografie – attributen",
            typography_metrics: "Typografie – maten"
         },
         label: {
            popStyle: "stijl van de stapel halen",
            pushStyle: "stijl op de stapel zetten",
            cursor: "gebruik muisaanwijzer %1",
            focused: "het canvas is geselecteerd",
            width: "breedte",
            height: "hoogte",
            arc: "teken een boog op %1 %2 met grootte %3 %4 tussen de hoeken %5 en %6",
            ellipse: "teken een ellips op %1 %2 met grootte %3 %4",
            line: "teken een lijn van %1 %2 naar %3 %4",
            point: "teken een punt op %1 %2",
            quad: "teken een vierhoek op de punten %1 %2, %3 %4, %5 %6, %7 %8",
            rect: "teken een rechthoek op %1 %2 met grootte %3 %4",
            triangle: "teken een driehoek op de punten %1 %2, %3 %4, %5 %6",
            bezier: "teken een Bézierkromme van %1 %2 met ankers %3 %4 en %5 %6 tot %7 %8",
            bezierDetail: "zet de resolutie van Bézierkrommen op %1",
            bezierPoint: "coördinaat op de Bézierkromme van %1 met ankers %2 en %3 tot punt %4 op positie %5",
            bezierTangent: "raaklijn op de Bézierkromme van %1 met ankers %2 en %3 tot punt %4 op positie %5",
            curve: "teken een splinekromme van %1 %2 met ankers %3 %4 en %5 %6 tot %7 %8",
            curveDetail: "zet de resolutie van splinekrommen op %1",
            curvePoint: "coördinaat op de splinekromme van %1 met ankers %2 en %3 tot punt %4 op positie %5",
            curveTangent: "raaklijn op de splinekromme van %1 met ankers %2 en %3 tot punt %4 op positie %5",
            curveTightness: "zet de spanning van splinekrommen op %1",
            box: "teken een doos met grootte %1 %2 %3",
            sphere: "teken een bol met straal %1",
            sphereDetail: "zet de resolutie van bollen op %1 %2",
            ellipseMode: "gebruik modus %1 voor ellipsen",
            noSmooth: "schakel afvlakking uit",
            rectMode: "gebruik modus %1 voor rechthoeken",
            smooth: "schakel afvlakking in",
            strokeCap: "gebruik lijneinden %1",
            strokeJoin: "gebruik lijnverbindingen %1",
            strokeWeight: "zet de lijndikte op %1",
            beginShape: "begin een vorm met modus %1",
            bezierVertex: "plaats een Bézier-hoekpunt op %1 %2 %3 %4 %5 %6",
            curveVertex: "plaats een spline-hoekpunt op %1 %2",
            endShape: "beëindig een vorm %1",
            texture: "gebruik textuur %1",
            textureMode: "gebruik modus %1 om naar de textuur te verwijzen",
            vertex: "plaats een hoekpunt op %1 %2 %3 %4 %5",
            shape: "toon vorm %1 op %2 %3 met grootte %4 %5",
            shapeMode: "gebruik modus %1 voor vormen",
            isVisible: "is zichtbaar",
            setVisible: "zet zichtbaarheid op %1",
            disableStyle: "schakel specifieke stijl uit",
            enableStyle: "schakel specifieke stijl in",
            getChild: "kind %1",
            print: "druk %1 af",
            println: "druk regel %1 af",
            applyMatrix: "appliquer la matrice de transformation %1 %2 %3 %4, %5 %6 %7 %8, %9 %10 %11 %12, %13 %14 %15 %16",
            popMatrix: "dépiler la matrice de transformation",
            printMatrix: "sortir la matrice de transformation",
            pushMatrix: "empiler la matrice de transformation",
            resetMatrix: "réinitialiser la matrice de transformation",
            rotate: "roteer met %1",
            rotateX: "roteer om de X-as met %1",
            rotateY: "roteer om de Y-as met %1",
            rotateZ: "roteer om de Z-as met %1",
            scale: "schaal met %1 %2 %3",
            translate: infos['processing3D'] ? "verplaats met %1 %2 %3" : "verplaats met %1 %2",
            ambientLight: "ajouter une lumière ambiante %1 %2 %3 à %4 %5 %6",
            directionalLight: "ajouter une lumière directionnelle %1 %2 %3 vers %4 %5 %6",
            lightFalloff: "placer la réduction de lumière sur %1 %2 %3",
            lightSpecular: "zet spiegellicht op %1 %2 %3",
            lights: "installer les lumières",
            noLights: "désactiver les lumières",
            normal: "définir le vecteur normal utilisé à %1 %2 %3",
            pointLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6",
            spotLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6 vers %7 %8 %9 selon un angle de %10 et une exponentielle de %11",
            beginCamera: "commencer un déplacement de la caméra",
            camera: "placer la caméra à %1 %2 %3 visant %4 %5 %6 éloignée de %7 %8 %9",
            endCamera: "terminer un déplacement de la caméra",
            frustum: "zet perspectiefmatrix op %1 %2 %3 %4 %5 %6",
            ortho: "zet orthografische projectie op %1 %2 %3 %4 %5 %6",
            perspective: "zet perspectiefprojectie op %1 %2 %3 %4",
            printCamera: "druk cameramatrix af",
            printProjection: "druk projectiematrix af",
            modelX: "model-X-coördinaat van punt %1 %2 %3",
            modelY: "model-Y-coördinaat van punt %1 %2 %3",
            modelZ: "model-Z-coördinaat van punt %1 %2 %3",
            screenX: "scherm-X-coördinaat van punt %1 %2 %3",
            screenY: "scherm-Y-coördinaat van punt %1 %2 %3",
            screenZ: "scherm-Z-coördinaat van punt %1 %2 %3",
            ambient: "définir la réflectance sur les formes à %1 %2 %3",
            emissive: "définir l'émission sur les formes à %1 %2 %3",
            shininess: "définir la brillance sur les formes à %1",
            specular: "définir la spécularité des formes à %1",
            background: "vul de achtergrond met %1 %2 %3 %4",
            colorMode: "utiliser le mode de couleur %1 avec les limites %2 %3 %4 %5",
            fill: "zet vulkleur op %1 %2 %3",
            noFill: "schakel vulling uit",
            noStroke: "schakel omtreklijn uit",
            stroke: "zet lijnkleur op %1 %2 %3",
            alpha: "dekking in %1",
            blendColor: "mélanger les couleurs %1 et %2 avec le mode %3",
            blue: "blauw in %1",
            brightness: "luminosité dans %1",
            color: "kleur %1 %2 %3 %4",
            green: "groen in %1",
            hue: "tint in %1",
            lerpColor: "tussenkleur tussen %1 en %2 op positie %3",
            red: "rood in %1",
            saturation: "verzadiging in %1",
            createImage: "nieuw beeld van grootte %1 %2 met formaat %3",
            image: "toon beeld %1 op %2 %3 met grootte %4 %5",
            imageMode: "gebruik modus %1 voor positionering van beelden",
            noTint: "schakel beeldtint uit",
            tint: "gebruik beeldtint %1 %2 %3 %4",
            resize: "herschaal naar grootte %1 %2",
            blend: "meng bron op %1 %2 grootte %3 %4 met bestemming op %5 %6 grootte %7 %8 met modus %9",
            copy: "kopieer bron op %1 %2 grootte %3 %4 naar bestemming op %5 %6 grootte %7 %8",
            filter: "pas filter %1 toe met niveau %2",
            get: "haal pixels op op %1 %2 grootte %3 %4",
            loadPixels: "laad pixels",
            pixels: "pixels",
            set: "plaats op %1 %2 de kleur %3",
            updatePixels: "werk pixels bij",
            createGraphics: "nieuwe grafiek van grootte %1 %2 met renderer %3",
            beginDraw: "begin te tekenen",
            endDraw: "stop met tekenen",
            PFont_list: "lijst van beschikbare lettertypes",
            createFont: "nieuw lettertype met naam %1 en grootte %2",
            loadFont: "nieuw lettertype met naam %1",
            text_: "toon tekst %1 op %2 %3 in een kader van grootte %4 %5",
            textFont: "zet tekstlettertype op %1 met grootte %2",
            textAlign: "zet tekstuitlijning, horizontaal: %1 en verticaal: %2",
            textLeading: "zet regelafstand van tekst op %1",
            textMode: "gebruik modus %1 voor tekst",
            textSize: "zet tekstgrootte op %1",
            textWidth: "breedte van tekst %1",
            textAscent: "hoogte van tekst boven de basislijn",
            textDescent: "hoogte van tekst onder de basislijn"
         },
         code: {
            popStyle: "haalStijlWeg",
            pushStyle: "stapelStijl",
            cursor: "muisaanwijzer",
            focused: "canvasGeselecteerd",
            width: "breedte",
            height: "hoogte",
            arc: "boog",
            ellipse: "ellips",
            line: "lijn",
            point: "punt",
            quad: "vierhoek",
            rect: "rechthoek",
            triangle: "driehoek",
            bezier: "bezier",
            bezierDetail: "bezierDetail",
            bezierPoint: "bezierPunt",
            bezierTangent: "bezierRaaklijn",
            curve: "kromme",
            curveDetail: "krommeDetail",
            curvePoint: "krommePunt",
            curveTangent: "krommeRaaklijn",
            curveTightness: "krommeSpanning",
            box: "doos",
            sphere: "bol",
            sphereDetail: "bolDetail",
            ellipseMode: "ellipsModus",
            noSmooth: "geenAfvlakking",
            rectMode: "rechthoekModus",
            smooth: "afvlakking",
            strokeCap: "lijnEinden",
            strokeJoin: "lijnVerbindingen",
            strokeWeight: "lijndikte",
            beginShape: "beginVorm",
            bezierVertex: "bezierHoekpunt",
            curveVertex: "krommeHoekpunt",
            endShape: "eindeVorm",
            texture: "textuur",
            textureMode: "textuurModus",
            vertex: "hoekpunt",
            shape: "vorm",
            shapeMode: "vormModus",
            isVisible: "isZichtbaar",
            setVisible: "zetZichtbaar",
            disableStyle: "schakelStijlUit",
            enableStyle: "schakelStijlIn",
            getChild: "kind",
            print: "drukAf",
            println: "drukRegelAf",
            applyMatrix: "pasMatrixToe",
            popMatrix: "haalMatrixWeg",
            printMatrix: "drukMatrixAf",
            pushMatrix: "stapelMatrix",
            resetMatrix: "resetMatrix",
            rotate: "roteer",
            rotateX: "roteerX",
            rotateY: "roteerY",
            rotateZ: "roteerZ",
            scale: "schaal",
            translate: "verplaats",
            ambientLight: "omgevingsLicht",
            directionalLight: "richtingsLicht",
            lightFalloff: "lichtAfname",
            lightSpecular: "spiegelLicht",
            lights: "lichten",
            noLights: "geenLichten",
            normal: "normaal",
            pointLight: "puntLicht",
            spotLight: "spotLicht",
            beginCamera: "beginCamera",
            camera: "camera",
            endCamera: "eindeCamera",
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspectief",
            printCamera: "drukCameraAf",
            printProjection: "drukProjectieAf",
            modelX: "modelX",
            modelY: "modelY",
            modelZ: "modelZ",
            screenX: "schermX",
            screenY: "schermY",
            screenZ: "schermZ",
            ambient: "omgeving",
            emissive: "emitterend",
            shininess: "glans",
            specular: "spiegelend",
            background: "achtergrond",
            colorMode: "kleurModus",
            fill: "vulkleur",
            noFill: "geenVulling",
            noStroke: "geenLijn",
            stroke: "lijnkleur",
            alpha: "dekking",
            blendColor: "mengKleuren",
            blue: "blauw",
            brightness: "helderheid",
            color: "kleur",
            green: "groen",
            hue: "tint",
            lerpColor: "tussenKleur",
            red: "rood",
            saturation: "verzadiging",
            createImage: "nieuwBeeld",
            image: "beeld",
            imageMode: "beeldModus",
            noTint: "geenTint",
            tint: "tintFilter",
            resize: "herschaal",
            blend: "meng",
            copy: "kopieer",
            filter: "pasFilterToe",
            get: "haalPixelsOp",
            loadPixels: "laadPixels",
            pixels: "pixels",
            set: "zetPixels",
            updatePixels: "werkPixelsBij",
            createGraphics: "nieuwGrafiek",
            beginDraw: "beginTekenen",
            endDraw: "eindeTekenen",
            PFont_list: "lijstLettertypes",
            createFont: "nieuwLettertype",
            loadFont: "laadLettertype",
            text_: "tekst",
            textFont: "tekstLettertype",
            textAlign: "tekstUitlijning",
            textLeading: "tekstRegelafstand",
            textMode: "tekstModus",
            textSize: "tekstGrootte",
            textWidth: "tekstBreedte",
            textAscent: "tekstAscender",
            textDescent: "tekstDescender"
         },
         description: {
            popStyle: "herstelt de stijl van vóór de laatste stapeling met <code>stapelStijl()</code>",
            pushStyle: "slaat de huidige stijl op zodat die hersteld kan worden met <code>haalStijlWeg()</code>",
            cursor: "gebruikt het aangegeven of meegeleverde beeld om de muis op het canvas weer te geven",
            focused: "waar als het canvas geselecteerd is, anders onwaar",
            width: "breedte van het canvas",
            height: "hoogte van het canvas",
            arc: "tekent de boog van de ellips met de aangegeven eigenschappen, van hoek <var>begin</var> tot hoek <var>einde</var> (in graden)",
            ellipse: "tekent de ellips op de aangegeven coördinaten met de aangegeven grootte; het gedrag kan gewijzigd worden met <code>ellipsModus</code>",
            line: "tekent de lijn van het eerste naar het tweede aangegeven punt",
            point: "tekent een punt (schijf waarvan de diameter overeenkomt met de huidige lijndikte) op de aangegeven coördinaten",
            quad: "tekent een vierhoek met als hoekpunten de vier aangegeven punten",
            rect: "tekent een rechthoek op de aangegeven coördinaten met de aangegeven grootte; het gedrag kan gewijzigd worden met <code>rechthoekModus</code>, en met de aangegeven radii om de hoeken af te ronden",
            triangle: "tekent een driehoek met als hoekpunten de drie aangegeven punten",
            ellipseMode: "bepaalt hoe de eigenschappen van ellipsen geïnterpreteerd worden — <code>CENTRUM</code> en <code>STRAAL</code> gebruiken de coördinaten als middelpunt, <code>STRAAL</code> gebruikt de grootte als stralen, <code>HOEK</code> en <code>HOEKEN</code> gebruiken de coördinaten als linkerbovenhoek, <code>HOEKEN</code> gebruikt de grootte als coördinaten van de rechteronderhoek",
            noSmooth: "schakelt de afvlakking van vormen uit",
            rectMode: "bepaalt hoe de eigenschappen van rechthoeken geïnterpreteerd worden — <code>CENTRUM</code> en <code>STRAAL</code> gebruiken de coördinaten als middelpunt, <code>STRAAL</code> gebruikt de grootte als stralen, <code>HOEK</code> en <code>HOEKEN</code> gebruiken de coördinaten als linkerbovenhoek, <code>HOEKEN</code> gebruikt de grootte als coördinaten van de rechteronderhoek",
            smooth: "schakelt de afvlakking van vormen in",
            strokeCap: "bepaalt de vorm van de lijneinden",
            strokeJoin: "bepaalt de vorm van de verbindingen tussen lijnsegmenten",
            strokeWeight: "zet de dikte van de lijnen",
            print: "toont de aangegeven tekst of gegevens in de console",
            println: "toont de aangegeven tekst of gegevens in de console, gevolgd door een regeleinde",
            background: "vult het canvas met de aangegeven kleur (moet helemaal aan het begin van het programma gebruikt worden)",
            colorMode: "bepaalt hoe de componenten van kleuren geïnterpreteerd worden; de eerste parameter bepaalt de modus (<code>RGB</code> voor rood, groen en blauw; <code>HSV</code> voor tint, verzadiging, helderheid); de volgende bepalen de maximale waarde (standaard 255)",
            fill: "zet de vulkleur die voor het tekenen gebruikt wordt",
            noFill: "gebruikt een transparante vulling voor de volgende tekeningen",
            noStroke: "gebruikt een transparante omtreklijn voor de volgende tekeningen",
            stroke: "zet de lijnkleur die voor het tekenen gebruikt wordt",
            alpha: "haalt de dekkingswaarde uit een kleur",
            blendColor: "geeft de kleur die ontstaat door het mengen van de twee aangegeven kleuren met de aangegeven modus (<code>MENGEN</code>, <code>OPTTELLEN</code>, <code>AFTREKKEN</code>, <code>DONKERSTE</code>, <code>LICHTSTE</code>, <code>VERSCHIL</code>, <code>UITSLUITING</code>, <code>VERMENIGVULDIGEN</code>, <code>SCHERM</code>, <code>OVERLAY</code>, <code>HARD_LICHT</code>, <code>ZACHT_LICHT</code>, <code>DODGE</code> of <code>BURN</code>)",
            blue: "haalt de blauwwaarde uit een kleur",
            brightness: "haalt de helderheidswaarde uit een kleur",
            color: "maakt een kleur met de aangegeven waarden",
            green: "haalt de groenwaarde uit een kleur",
            hue: "haalt de tintwaarde uit een kleur",
            lerpColor: "geeft een geïnterpoleerde kleur tussen de twee aangegeven kleuren; de positie is een waarde tussen 0 en 1 (0 komt overeen met de eerste kleur, 0,1 ligt dichtbij, 0,5 ligt in het midden…)",
            red: "haalt de roodwaarde uit een kleur",
            saturation: "haalt de verzadigingswaarde uit een kleur"
         },
         params: {
            mode: "modus",
            image: "beeld",
            width: "breedte",
            height: "hoogte",
            radius: "straal",
            tlradius: "straalLB",
            trradius: "straalRB",
            brradius: "straalRO",
            blradius: "straalLO",
            start: "begin",
            stop: "einde",
            detail: "detail",
            squishy: "spanning",
            visible: "zichtbaar",
            target: "doel",
            angle: "hoek",
            constant: "constante",
            linear: "coefLin",
            quadratic: "coefKwadr",
            concentration: "concentratie",
            eyeX: "xOog",
            eyeY: "yOog",
            eyeZ: "zOog",
            centerX: "xCentrum",
            centerY: "yCentrum",
            centerZ: "zCentrum",
            upX: "xBoven",
            upY: "yBoven",
            upZ: "zBoven",
            left: "links",
            right: "rechts",
            bottom: "onder",
            top: "boven",
            near: "dichtbij",
            far: "veraf",
            fov: "gezichtsveld",
            aspect: "aspect",
            zNear: "zDichtbij",
            zFar: "zVeraf",
            shine: "glans",
            size: "grootte",
            text: "tekst",
            gray: "grijs",
            alpha: "dekking",
            value1: "waarde1",
            value2: "waarde2",
            value3: "waarde3",
            color: "kleur",
            color1: "kleur1",
            color2: "kleur2",
            range: "bereik",
            range1: "bereik1",
            range2: "bereik2",
            range3: "bereik3",
            range4: "bereik4",
            amount: "positie",
            srcImg: "imgBron",
            dx: "xBestemming",
            dy: "yBestemming",
            dwidth: "breedteBestemming",
            dheight: "hoogteBestemming",
            param: "param",
            renderer: "renderer",
            name: "naam",
            data: "gegeven",
            font: "lettertype",
            align: "align",
            yAlign: "alignY",
            dist: "dist"
         },
         constantLabel: {
            ARROW: "Pijl",
            CROSS: "Kruis",
            HAND: "Hand",
            MOVE: "Verplaatsing",
            TEXT: "Tekst",
            WAIT: "Wachten",
            CENTER: "Centrum",
            RADIUS: "Straal",
            CORNER: "Hoek",
            CORNERS: "Hoeken",
            SQUARE: "vierkant",
            PROJECT: "geprojecteerd",
            ROUND: "afgerond",
            MITER: "verstek",
            BEVEL: "afgeschuind",
            POINTS: "punten",
            LINES: "lijnen",
            TRIANGLES: "driehoeken",
            TRIANGLE_FAN: "driehoeken in waaier",
            TRIANGLE_STRIP: "driehoeken in strook",
            QUADS: "vierhoeken",
            QUAD_STRIP: "vierhoeken in strook",
            IMAGE: "beeld",
            NORMALIZED: "genormaliseerd",
            CLOSE: "gesloten",
            RGB: "RGB",
            HSB: "HSV",
            BLEND: "mengen",
            ADD: "optellen",
            SUBTRACT: "aftrekken",
            DARKEST: "donkerste",
            LIGHTEST: "lichtste",
            DIFFERENCE: "verschil",
            EXCLUSION: "uitsluiting",
            MULTIPLY: "vermenigvuldigen",
            SCREEN: "scherm",
            OVERLAY: "overlay",
            HARD_LIGHT: "hard licht",
            SOFT_LIGHT: "zacht licht",
            DODGE: "dodge",
            BURN: "burn",
            ARGB: "ARGB",
            ALPHA: "Alpha",
            THRESHOLD: "Drempel",
            GRAY: "Grijswaarden",
            INVERT: "Omkeren",
            POSTERIZE: "Posteriseren",
            BLUR: "Vervagen",
            OPAQUE: "Dekkend maken",
            ERODE: "Eroderen",
            DILATE: "Dileren",
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            LEFT: "Links",
            RIGHT: "Rechts",
            TOP: "Boven",
            BOTTOM: "Onder",
            BASELINE: "Basislijn",
            MODEL: "model",
            SHAPE: "vorm"
         },
         constant: {
            ARROW: "PIJL",
            CROSS: "KRUIS",
            HAND: "HAND",
            MOVE: "VERPLAATSING",
            TEXT: "TEKST",
            WAIT: "WACHTEN",
            CENTER: "CENTRUM",
            RADIUS: "STRAAL",
            CORNER: "HOEK",
            CORNERS: "HOEKEN",
            SQUARE: "VIERKANT",
            PROJECT: "PROJECTIE",
            ROUND: "AFROND",
            MITER: "VERSTEK",
            BEVEL: "AFSCHUINING",
            POINTS: "PUNTEN",
            LINES: "LIJNEN",
            TRIANGLES: "DRIEHOEKEN",
            TRIANGLE_FAN: "DRIEHOEK_WAAIER",
            TRIANGLE_STRIP: "DRIEHOEK_STROOK",
            QUADS: "VIERHOEKEN",
            QUAD_STRIP: "VIERHOEK_STROOK",
            IMAGE: "BEELD",
            NORMALIZED: "GENORMALISEERD",
            CLOSE: "GESLOTEN",
            RGB: "RGB",
            HSB: "HSV",
            BLEND: "MENGEN",
            ADD: "OPTTELLEN",
            SUBTRACT: "AFTREKKEN",
            DARKEST: "DONKERSTE",
            LIGHTEST: "LICHTSTE",
            DIFFERENCE: "VERSCHIL",
            EXCLUSION: "UITSLUITING",
            MULTIPLY: "VERMENIGVULDIGEN",
            SCREEN: "SCHERM",
            OVERLAY: "OVERLAY",
            HARD_LIGHT: "HARD_LICHT",
            SOFT_LIGHT: "ZACHT_LICHT",
            DODGE: "DODGE",
            BURN: "BURN",
            ARGB: "ARGB",
            ALPHA: "ALPHA",
            THRESHOLD: "DREMPEL",
            GRAY: "GRIJS",
            INVERT: "INVERTEREN",
            POSTERIZE: "POSTERISEREN",
            BLUR: "VERVAGEN",
            OPAQUE: "DEKKEND",
            ERODE: "ERODEREN",
            DILATE: "DILATEREN",
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            LEFT: "LINKS",
            RIGHT: "RECHTS",
            TOP: "BOVEN",
            BOTTOM: "ONDER",
            BASELINE: "BASISLIJN",
            MODEL: "MODEL",
            SHAPE: "VORM"
         },
         startingBlockName: "Programma",
         hideInitialDrawing: "Beginmotief verbergen",
         exportAsSvg: "Exporteren als SVG",
         messages: {
            redCoveredGreenNotCovered: "Je hebt al het rood bedekt zonder het groen aan te raken.",
            redNotCovered: "Bedek het hele rode deel.",
            greenCovered: "Je hebt het rode deel verborgen, maar ook een deel van het groen bedekt.",
            redNotCoveredGreenCovered: "Je hebt het rode deel niet bedekt, en hebt een deel van het groen bedekt!",
            tooManyWhitePixelsCovered: "Er zijn te veel witte pixels bedekt. Je score is {score} op {initial_score}.",
            allFiguresMustBeConnected: "Alle vormen moeten samenhangend zijn.",
            taskCompleted: "Opdracht voltooid!"
         },
         misc: {
            colon: ": "
         }
      },
      de: {
         categories: {
            environment: "Umgebung",
            shape_2D: "Formen – 2D",
            shape_curve: "Formen – Kurven",
            shape_3D: "Formen – 3D",
            shape_attributes: "Formen – Attribute",
            shape_vertex: "Formen – Eckpunkte",
            shape_other: "Formen – sonstige",
            transform: "Transformationen",
            effect_lights: "Effekte – Lichter",
            effect_camera: "Effekte – Kamera",
            effect_coordinates: "Effekte – Koordinaten",
            effect_material: "Effekte – Material",
            color_setting: "Farben – Einstellungen",
            color_creating_reading: "Farben – Erzeugen und Lesen",
            image_displaying: "Bilder – Anzeige",
            image_pixels: "Bilder – Pixel",
            rendering: "Rendering",
            typography_displaying: "Typografie – Anzeige",
            typography_attributes: "Typografie – Attribute",
            typography_metrics: "Typografie – Maße"
         },
         label: {
            popStyle: "Stil vom Stapel nehmen",
            pushStyle: "Stil auf den Stapel legen",
            cursor: "Mauszeiger %1 verwenden",
            focused: "Canvas ist fokussiert",
            width: "Breite",
            height: "Höhe",
            arc: "Bogen bei %1 %2 mit Größe %3 %4 zwischen Winkeln %5 und %6 zeichnen",
            ellipse: "Ellipse bei %1 %2 mit Größe %3 %4 zeichnen",
            line: "Linie von %1 %2 nach %3 %4 zeichnen",
            point: "Punkt bei %1 %2 zeichnen",
            quad: "Viereck an den Punkten %1 %2, %3 %4, %5 %6, %7 %8 zeichnen",
            rect: "Rechteck bei %1 %2 mit Größe %3 %4 zeichnen",
            triangle: "Dreieck an den Punkten %1 %2, %3 %4, %5 %6 zeichnen",
            bezier: "Bézierkurve von %1 %2 mit Ankern %3 %4 und %5 %6 bis %7 %8 zeichnen",
            bezierDetail: "Auflösung der Bézierkurven auf %1 setzen",
            bezierPoint: "Koordinate auf der Bézierkurve von %1 mit Ankern %2 und %3 bis Punkt %4 an Position %5",
            bezierTangent: "Tangente auf der Bézierkurve von %1 mit Ankern %2 und %3 bis Punkt %4 an Position %5",
            curve: "Splinekurve von %1 %2 mit Ankern %3 %4 und %5 %6 bis %7 %8 zeichnen",
            curveDetail: "Auflösung der Splinekurven auf %1 setzen",
            curvePoint: "Koordinate auf der Splinekurve von %1 mit Ankern %2 und %3 bis Punkt %4 an Position %5",
            curveTangent: "Tangente auf der Splinekurve von %1 mit Ankern %2 und %3 bis Punkt %4 an Position %5",
            curveTightness: "Spannung der Splinekurven auf %1 setzen",
            box: "Box mit Größe %1 %2 %3 zeichnen",
            sphere: "Kugel mit Radius %1 zeichnen",
            sphereDetail: "Auflösung der Kugeln auf %1 %2 setzen",
            ellipseMode: "Modus %1 für Ellipsen verwenden",
            noSmooth: "Glättung deaktivieren",
            rectMode: "Modus %1 für Rechtecke verwenden",
            smooth: "Glättung aktivieren",
            strokeCap: "Linienenden %1 verwenden",
            strokeJoin: "Linienverbindungen %1 verwenden",
            strokeWeight: "Linienstärke auf %1 setzen",
            beginShape: "Form mit Modus %1 beginnen",
            bezierVertex: "Bézier-Eckpunkt bei %1 %2 %3 %4 %5 %6 setzen",
            curveVertex: "Spline-Eckpunkt bei %1 %2 setzen",
            endShape: "Form beenden %1",
            texture: "Textur %1 verwenden",
            textureMode: "Modus %1 für Texturreferenz verwenden",
            vertex: "Eckpunkt bei %1 %2 %3 %4 %5 setzen",
            shape: "Form %1 bei %2 %3 mit Größe %4 %5 anzeigen",
            shapeMode: "Modus %1 für Formen verwenden",
            isVisible: "ist sichtbar",
            setVisible: "Sichtbarkeit auf %1 setzen",
            disableStyle: "spezifischen Stil deaktivieren",
            enableStyle: "spezifischen Stil aktivieren",
            getChild: "Kind %1",
            print: "%1 ausgeben",
            println: "Zeile %1 ausgeben",
            applyMatrix: "appliquer la matrice de transformation %1 %2 %3 %4, %5 %6 %7 %8, %9 %10 %11 %12, %13 %14 %15 %16",
            popMatrix: "dépiler la matrice de transformation",
            printMatrix: "sortir la matrice de transformation",
            pushMatrix: "empiler la matrice de transformation",
            resetMatrix: "réinitialiser la matrice de transformation",
            rotate: "um %1 drehen",
            rotateX: "um die X-Achse um %1 drehen",
            rotateY: "um die Y-Achse um %1 drehen",
            rotateZ: "um die Z-Achse um %1 drehen",
            scale: "mit %1 %2 %3 skalieren",
            translate: infos['processing3D'] ? "um %1 %2 %3 verschieben" : "um %1 %2 verschieben",
            ambientLight: "ajouter une lumière ambiante %1 %2 %3 à %4 %5 %6",
            directionalLight: "ajouter une lumière directionnelle %1 %2 %3 vers %4 %5 %6",
            lightFalloff: "placer la réduction de lumière sur %1 %2 %3",
            lightSpecular: "Spiegellicht auf %1 %2 %3 setzen",
            lights: "installer les lumières",
            noLights: "désactiver les lumières",
            normal: "définir le vecteur normal utilisé à %1 %2 %3",
            pointLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6",
            spotLight: "ajouter une lumière %1 %2 %3 partant de %4 %5 %6 vers %7 %8 %9 selon un angle de %10 et une exponentielle de %11",
            beginCamera: "commencer un déplacement de la caméra",
            camera: "placer la caméra à %1 %2 %3 visant %4 %5 %6 éloignée de %7 %8 %9",
            endCamera: "terminer un déplacement de la caméra",
            frustum: "Perspektivmatrix auf %1 %2 %3 %4 %5 %6 setzen",
            ortho: "orthografische Projektion auf %1 %2 %3 %4 %5 %6 setzen",
            perspective: "Perspektivprojektion auf %1 %2 %3 %4 setzen",
            printCamera: "Kameramatrix ausgeben",
            printProjection: "Projektionsmatrix ausgeben",
            modelX: "Modell-X-Koordinate des Punkts %1 %2 %3",
            modelY: "Modell-Y-Koordinate des Punkts %1 %2 %3",
            modelZ: "Modell-Z-Koordinate des Punkts %1 %2 %3",
            screenX: "Bildschirm-X-Koordinate des Punkts %1 %2 %3",
            screenY: "Bildschirm-Y-Koordinate des Punkts %1 %2 %3",
            screenZ: "Bildschirm-Z-Koordinate des Punkts %1 %2 %3",
            ambient: "définir la réflectance sur les formes à %1 %2 %3",
            emissive: "définir l'émission sur les formes à %1 %2 %3",
            shininess: "définir la brillance sur les formes à %1",
            specular: "définir la spécularité des formes à %1",
            background: "Hintergrund mit %1 %2 %3 %4 füllen",
            colorMode: "utiliser le mode de couleur %1 avec les limites %2 %3 %4 %5",
            fill: "Füllfarbe auf %1 %2 %3 setzen",
            noFill: "Füllung deaktivieren",
            noStroke: "Konturlinie deaktivieren",
            stroke: "Linienfarbe auf %1 %2 %3 setzen",
            alpha: "Deckkraft in %1",
            blendColor: "mélanger les couleurs %1 et %2 avec le mode %3",
            blue: "Blau in %1",
            brightness: "luminosité dans %1",
            color: "Farbe %1 %2 %3 %4",
            green: "Grün in %1",
            hue: "Farbton in %1",
            lerpColor: "Zwischenfarbe zwischen %1 und %2 an Position %3",
            red: "Rot in %1",
            saturation: "Sättigung in %1",
            createImage: "neues Bild der Größe %1 %2 mit Format %3",
            image: "Bild %1 bei %2 %3 mit Größe %4 %5 anzeigen",
            imageMode: "Modus %1 zur Positionierung von Bildern verwenden",
            noTint: "Bildfarbton deaktivieren",
            tint: "Bildfarbton %1 %2 %3 %4 verwenden",
            resize: "Größe auf %1 %2 ändern",
            blend: "Quelle bei %1 %2 Größe %3 %4 mit Ziel bei %5 %6 Größe %7 %8 mit Modus %9 mischen",
            copy: "Quelle bei %1 %2 Größe %3 %4 auf Ziel bei %5 %6 Größe %7 %8 kopieren",
            filter: "Filter %1 mit Stufe %2 anwenden",
            get: "Pixel bei %1 %2 Größe %3 %4 abrufen",
            loadPixels: "Pixel laden",
            pixels: "Pixel",
            set: "bei %1 %2 Farbe %3 setzen",
            updatePixels: "Pixel aktualisieren",
            createGraphics: "neue Grafik der Größe %1 %2 mit Renderer %3",
            beginDraw: "Zeichnen beginnen",
            endDraw: "Zeichnen beenden",
            PFont_list: "Liste verfügbarer Schriften",
            createFont: "neue Schrift mit Name %1 und Größe %2",
            loadFont: "neue Schrift mit Name %1",
            text_: "Text %1 bei %2 %3 in einem Rahmen der Größe %4 %5 anzeigen",
            textFont: "Textschrift auf %1 mit Größe %2 setzen",
            textAlign: "Textausrichtung setzen, horizontal: %1 und vertikal: %2",
            textLeading: "Zeilenabstand des Texts auf %1 setzen",
            textMode: "Modus %1 für Text verwenden",
            textSize: "Textgröße auf %1 setzen",
            textWidth: "Breite des Texts %1",
            textAscent: "Texthöhe über der Grundlinie",
            textDescent: "Texthöhe unter der Grundlinie"
         },
         code: {
            popStyle: "stilEntnehmen",
            pushStyle: "stilAblegen",
            cursor: "mauszeiger",
            focused: "canvasFokussiert",
            width: "breite",
            height: "hoehe",
            arc: "bogen",
            ellipse: "ellipse",
            line: "linie",
            point: "punkt",
            quad: "viereck",
            rect: "rechteck",
            triangle: "dreieck",
            bezier: "bezier",
            bezierDetail: "bezierDetail",
            bezierPoint: "bezierPunkt",
            bezierTangent: "bezierTangente",
            curve: "kurve",
            curveDetail: "kurvenDetail",
            curvePoint: "kurvenPunkt",
            curveTangent: "kurvenTangente",
            curveTightness: "kurvenSpannung",
            box: "box",
            sphere: "kugel",
            sphereDetail: "kugelDetail",
            ellipseMode: "ellipsenModus",
            noSmooth: "keinGlaetten",
            rectMode: "rechteckModus",
            smooth: "glaetten",
            strokeCap: "linienEnden",
            strokeJoin: "linienVerbindungen",
            strokeWeight: "linienStaerke",
            beginShape: "formBeginnen",
            bezierVertex: "bezierEckpunkt",
            curveVertex: "kurvenEckpunkt",
            endShape: "formBeenden",
            texture: "textur",
            textureMode: "texturModus",
            vertex: "eckpunkt",
            shape: "form",
            shapeMode: "formModus",
            isVisible: "istSichtbar",
            setVisible: "sichtbarkeitSetzen",
            disableStyle: "stilDeaktivieren",
            enableStyle: "stilAktivieren",
            getChild: "kind",
            print: "ausgeben",
            println: "zeileAusgeben",
            applyMatrix: "matrixAnwenden",
            popMatrix: "matrixEntnehmen",
            printMatrix: "matrixAusgeben",
            pushMatrix: "matrixAblegen",
            resetMatrix: "matrixZuruecksetzen",
            rotate: "drehen",
            rotateX: "drehenX",
            rotateY: "drehenY",
            rotateZ: "drehenZ",
            scale: "skalieren",
            translate: "verschieben",
            ambientLight: "umgebungsLicht",
            directionalLight: "richtungsLicht",
            lightFalloff: "lichtAbfall",
            lightSpecular: "spiegelLicht",
            lights: "lichter",
            noLights: "keineLichter",
            normal: "normale",
            pointLight: "punktLicht",
            spotLight: "spotLicht",
            beginCamera: "kameraBeginnen",
            camera: "kamera",
            endCamera: "kameraBeenden",
            frustum: "frustum",
            ortho: "ortho",
            perspective: "perspektive",
            printCamera: "kameraAusgeben",
            printProjection: "projektionAusgeben",
            modelX: "modellX",
            modelY: "modellY",
            modelZ: "modellZ",
            screenX: "bildschirmX",
            screenY: "bildschirmY",
            screenZ: "bildschirmZ",
            ambient: "ambient",
            emissive: "emissiv",
            shininess: "glaenzend",
            specular: "spekular",
            background: "hintergrund",
            colorMode: "farbModus",
            fill: "fuellfarbe",
            noFill: "keineFuellung",
            noStroke: "keineLinie",
            stroke: "linienfarbe",
            alpha: "deckkraft",
            blendColor: "farbenMischen",
            blue: "blau",
            brightness: "helligkeit",
            color: "farbe",
            green: "gruen",
            hue: "farbton",
            lerpColor: "zwischenFarbe",
            red: "rot",
            saturation: "saettigung",
            createImage: "neuesBild",
            image: "bild",
            imageMode: "bildModus",
            noTint: "keinFarbton",
            tint: "farbtonFilter",
            resize: "groesseAendern",
            blend: "mischen",
            copy: "kopieren",
            filter: "filterAnwenden",
            get: "pixelAbrufen",
            loadPixels: "pixelLaden",
            pixels: "pixel",
            set: "pixelSetzen",
            updatePixels: "pixelAktualisieren",
            createGraphics: "neueGrafik",
            beginDraw: "zeichnenBeginnen",
            endDraw: "zeichnenBeenden",
            PFont_list: "schriftListe",
            createFont: "neueSchrift",
            loadFont: "schriftLaden",
            text_: "text",
            textFont: "textSchrift",
            textAlign: "textAusrichtung",
            textLeading: "textZeilenabstand",
            textMode: "textModus",
            textSize: "textGroesse",
            textWidth: "textBreite",
            textAscent: "textAscent",
            textDescent: "textDescent"
         },
         description: {
            popStyle: "stellt den Stil vor dem letzten Ablegen mit <code>stilAblegen()</code> wieder her",
            pushStyle: "speichert den aktuellen Stil, damit er mit <code>stilEntnehmen()</code> wiederhergestellt werden kann",
            cursor: "verwendet das angegebene oder gelieferte Bild zur Darstellung der Maus auf dem Canvas",
            focused: "wahr, wenn der Canvas fokussiert ist, sonst falsch",
            width: "Breite des Canvas",
            height: "Höhe des Canvas",
            arc: "zeichnet den Bogen der Ellipse mit den angegebenen Eigenschaften, vom Winkel <var>start</var> bis zum Winkel <var>ende</var> (in Grad)",
            ellipse: "zeichnet die Ellipse an den angegebenen Koordinaten mit der angegebenen Größe; das Verhalten kann mit <code>ellipsenModus</code> geändert werden",
            line: "zeichnet die Linie vom ersten zum zweiten angegebenen Punkt",
            point: "zeichnet einen Punkt (Scheibe, deren Durchmesser der aktuellen Linienstärke entspricht) an den angegebenen Koordinaten",
            quad: "zeichnet ein Viereck mit den vier angegebenen Punkten als Eckpunkten",
            rect: "zeichnet ein Rechteck an den angegebenen Koordinaten mit der angegebenen Größe; das Verhalten kann mit <code>rechteckModus</code> geändert werden, und mit den angegebenen Radien zum Abrunden der Ecken",
            triangle: "zeichnet ein Dreieck mit den drei angegebenen Punkten als Eckpunkten",
            ellipseMode: "legt fest, wie die Eigenschaften von Ellipsen interpretiert werden — <code>MITTE</code> und <code>RADIUS</code> verwenden die Koordinaten als Mittelpunkt, <code>RADIUS</code> verwendet die Größe als Radien, <code>ECKE</code> und <code>ECKEN</code> verwenden die Koordinaten als obere linke Ecke, <code>ECKEN</code> verwendet die Größe als Koordinaten der unteren rechten Ecke",
            noSmooth: "deaktiviert die Glättung von Formen",
            rectMode: "legt fest, wie die Eigenschaften von Rechtecken interpretiert werden — <code>MITTE</code> und <code>RADIUS</code> verwenden die Koordinaten als Mittelpunkt, <code>RADIUS</code> verwendet die Größe als Radien, <code>ECKE</code> und <code>ECKEN</code> verwenden die Koordinaten als obere linke Ecke, <code>ECKEN</code> verwendet die Größe als Koordinaten der unteren rechten Ecke",
            smooth: "aktiviert die Glättung von Formen",
            strokeCap: "legt die Form der Linienenden fest",
            strokeJoin: "legt die Form der Verbindungen zwischen Liniensegmenten fest",
            strokeWeight: "setzt die Stärke der Linien",
            print: "zeigt den angegebenen Text oder die Daten in der Konsole an",
            println: "zeigt den angegebenen Text oder die Daten in der Konsole an, gefolgt von einem Zeilenende",
            background: "füllt den Canvas mit der angegebenen Farbe (muss ganz am Anfang des Programms verwendet werden)",
            colorMode: "legt fest, wie die Komponenten von Farben interpretiert werden; der erste Parameter legt den Modus fest (<code>RGB</code> für Rot, Grün und Blau; <code>HSV</code> für Farbton, Sättigung, Helligkeit); die folgenden legen den Maximalwert fest (Standard 255)",
            fill: "setzt die Füllfarbe für das Zeichnen",
            noFill: "verwendet eine transparente Füllung für die nächsten Zeichnungen",
            noStroke: "verwendet eine transparente Konturlinie für die nächsten Zeichnungen",
            stroke: "setzt die Linienfarbe für das Zeichnen",
            alpha: "extrahiert den Deckkraftwert einer Farbe",
            blendColor: "liefert die Farbe, die durch Mischen der beiden angegebenen Farben mit dem angegebenen Modus entsteht (<code>MISCHEN</code>, <code>ADDIEREN</code>, <code>SUBTRAHIEREN</code>, <code>DUNKELSTE</code>, <code>HELLESTE</code>, <code>DIFFERENZ</code>, <code>AUSSCHLUSS</code>, <code>MULTIPLIZIEREN</code>, <code>BILDSCHIRM</code>, <code>UEBERLAGERUNG</code>, <code>HARTES_LICHT</code>, <code>WEICHES_LICHT</code>, <code>ABDODGEN</code> oder <code>NACHBELICHTEN</code>)",
            blue: "extrahiert den Blauwert einer Farbe",
            brightness: "extrahiert den Helligkeitswert einer Farbe",
            color: "erzeugt eine Farbe mit den angegebenen Werten",
            green: "extrahiert den Grünwert einer Farbe",
            hue: "extrahiert den Farbtonwert einer Farbe",
            lerpColor: "liefert eine interpolierte Farbe zwischen den beiden angegebenen Farben; die Position ist ein Wert zwischen 0 und 1 (0 entspricht der ersten Farbe, 0,1 liegt nahe daran, 0,5 liegt in der Mitte…)",
            red: "extrahiert den Rotanteil einer Farbe",
            saturation: "extrahiert den Sättigungsanteil einer Farbe"
         },
         params: {
            mode: "modus",
            image: "bild",
            width: "breite",
            height: "hoehe",
            radius: "radius",
            tlradius: "radiusOL",
            trradius: "radiusOR",
            brradius: "radiusUR",
            blradius: "radiusUL",
            start: "start",
            stop: "ende",
            detail: "detail",
            squishy: "spannung",
            visible: "sichtbar",
            target: "ziel",
            angle: "winkel",
            constant: "konstante",
            linear: "coefLin",
            quadratic: "coefQuad",
            concentration: "konzentration",
            eyeX: "xAuge",
            eyeY: "yAuge",
            eyeZ: "zAuge",
            centerX: "xMitte",
            centerY: "yMitte",
            centerZ: "zMitte",
            upX: "xOben",
            upY: "yOben",
            upZ: "zOben",
            left: "links",
            right: "rechts",
            bottom: "unten",
            top: "oben",
            near: "nah",
            far: "fern",
            fov: "sichtfeld",
            aspect: "aspekt",
            zNear: "zNah",
            zFar: "zFern",
            shine: "glanz",
            size: "groesse",
            text: "text",
            gray: "grau",
            alpha: "deckkraft",
            value1: "wert1",
            value2: "wert2",
            value3: "wert3",
            color: "farbe",
            color1: "farbe1",
            color2: "farbe2",
            range: "bereich",
            range1: "bereich1",
            range2: "bereich2",
            range3: "bereich3",
            range4: "bereich4",
            amount: "position",
            srcImg: "imgQuelle",
            dx: "xZiel",
            dy: "yZiel",
            dwidth: "breiteZiel",
            dheight: "hoeheZiel",
            param: "param",
            renderer: "renderer",
            name: "name",
            data: "daten",
            font: "schrift",
            align: "align",
            yAlign: "alignY",
            dist: "dist"
         },
         constantLabel: {
            ARROW: "Pfeil",
            CROSS: "Kreuz",
            HAND: "Hand",
            MOVE: "Verschiebung",
            TEXT: "Text",
            WAIT: "Warten",
            CENTER: "Mitte",
            RADIUS: "Radius",
            CORNER: "Ecke",
            CORNERS: "Ecken",
            SQUARE: "quadratisch",
            PROJECT: "projiziert",
            ROUND: "abgerundet",
            MITER: "Gehrung",
            BEVEL: "abgeschrägt",
            POINTS: "Punkte",
            LINES: "Linien",
            TRIANGLES: "Dreiecke",
            TRIANGLE_FAN: "Dreiecke im Fächer",
            TRIANGLE_STRIP: "Dreiecke im Streifen",
            QUADS: "Vierecke",
            QUAD_STRIP: "Vierecke im Streifen",
            IMAGE: "Bild",
            NORMALIZED: "normalisiert",
            CLOSE: "geschlossen",
            RGB: "RGB",
            HSB: "HSV",
            BLEND: "mischen",
            ADD: "addieren",
            SUBTRACT: "subtrahieren",
            DARKEST: "dunkelste",
            LIGHTEST: "hellste",
            DIFFERENCE: "Differenz",
            EXCLUSION: "Ausschluss",
            MULTIPLY: "multiplizieren",
            SCREEN: "Bildschirm",
            OVERLAY: "Überlagerung",
            HARD_LIGHT: "hartes Licht",
            SOFT_LIGHT: "weiches Licht",
            DODGE: "abwedeln",
            BURN: "nachbelichten",
            ARGB: "ARGB",
            ALPHA: "Alpha",
            THRESHOLD: "Schwellwert",
            GRAY: "Entsättigen",
            INVERT: "Invertieren",
            POSTERIZE: "Posterisieren",
            BLUR: "Unscharf",
            OPAQUE: "Deckend machen",
            ERODE: "Erodieren",
            DILATE: "Dilatieren",
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            LEFT: "Links",
            RIGHT: "Rechts",
            TOP: "Oben",
            BOTTOM: "Unten",
            BASELINE: "Grundlinie",
            MODEL: "Modell",
            SHAPE: "Form"
         },
         constant: {
            ARROW: "PFEIL",
            CROSS: "KREUZ",
            HAND: "HAND",
            MOVE: "VERSCHIEBUNG",
            TEXT: "TEXT",
            WAIT: "WARTEN",
            CENTER: "MITTE",
            RADIUS: "RADIUS",
            CORNER: "ECKE",
            CORNERS: "ECKEN",
            SQUARE: "QUADRATE",
            PROJECT: "PROJEKTION",
            ROUND: "RUND",
            MITER: "GEHRUNG",
            BEVEL: "FASE",
            POINTS: "PUNKTE",
            LINES: "LINIEN",
            TRIANGLES: "DREIECKE",
            TRIANGLE_FAN: "DREIECK_FAECHER",
            TRIANGLE_STRIP: "DREIECK_STREIFEN",
            QUADS: "VIERECKE",
            QUAD_STRIP: "VIERECK_STREIFEN",
            IMAGE: "BILD",
            NORMALIZED: "NORMALISIERT",
            CLOSE: "GESCHLOSSEN",
            RGB: "RGB",
            HSB: "HSV",
            BLEND: "MISCHEN",
            ADD: "ADDIEREN",
            SUBTRACT: "SUBTRAHIEREN",
            DARKEST: "DUNKELSTE",
            LIGHTEST: "HELLESTE",
            DIFFERENCE: "DIFFERENZ",
            EXCLUSION: "AUSSCHLUSS",
            MULTIPLY: "MULTIPLIZIEREN",
            SCREEN: "BILDSCHIRM",
            OVERLAY: "UEBERLAGERUNG",
            HARD_LIGHT: "HARTES_LICHT",
            SOFT_LIGHT: "WEICHES_LICHT",
            DODGE: "ABDODGEN",
            BURN: "NACHBELICHTEN",
            ARGB: "ARGB",
            ALPHA: "ALPHA",
            THRESHOLD: "SCHWELLWERT",
            GRAY: "GRAU",
            INVERT: "INVERTIEREN",
            POSTERIZE: "POSTERISIEREN",
            BLUR: "UNSCHARF",
            OPAQUE: "DECKEND",
            ERODE: "ERODIEREN",
            DILATE: "DILATIEREN",
            P2D: "P2D",
            P3D: "P3D",
            JAVA2D: "JAVA2D",
            LEFT: "LINKS",
            RIGHT: "RECHTS",
            TOP: "OBEN",
            BOTTOM: "UNTEN",
            BASELINE: "GRUNDLINIE",
            MODEL: "MODELL",
            SHAPE: "FORM"
         },
         startingBlockName: "Programm",
         hideInitialDrawing: "Anfangsmuster ausblenden",
         exportAsSvg: "Als SVG exportieren",
         messages: {
            redCoveredGreenNotCovered: "Du hast das gesamte Rot bedeckt, ohne das Grün zu berühren.",
            redNotCovered: "Bedecke den gesamten roten Bereich.",
            greenCovered: "Du hast den roten Bereich verdeckt, aber auch einen Teil des Grüns bedeckt.",
            redNotCoveredGreenCovered: "Du hast den roten Bereich nicht verdeckt und einen Teil des Grüns bedeckt!",
            tooManyWhitePixelsCovered: "Zu viele weiße Pixel wurden bedeckt. Deine Punktzahl ist {score} von {initial_score}.",
            allFiguresMustBeConnected: "Alle Formen müssen zusammenhängend sein.",
            taskCompleted: "Aufgabe erledigt!"
         },
         misc: {
            colon: ": "
         }
      },
      none: {
         comment: {}
      }
   }


   var context = quickAlgoContext(display, infos);
   context.constants = constants;
   var strings = context.setLocalLanguageStrings(localLanguageStrings);


   context.processing = {
      internalInstance: new Processing(),
      ops: [], // This should actually be removed, we should draw directly
      state: {
         scale: 1,
         hideInitialDrawing: false
      },
      overload: {
         resetMatrix: function(pg) {
            pg.resetMatrix();
            pg.scale(context.processing.state.scale);
         }
      },
      getCanvasSize: function(scaled) {
         var size = context.processing.options['canvas_size'] ? context.processing.options.canvas_size : constants.DEFAULT_CANVAS_SIZE;
         if (scaled !== constants.SCALED) {
            return size;
         }
         return {
            width: size.width * context.processing.state.scale,
            height: size.height * context.processing.state.scale
         }
      },
      createBuffer: function(scaled) {
         var size = context.processing.getCanvasSize(scaled);
         var buffer = context.processing.internalInstance.createGraphics(size.width, size.height);
         buffer.background(constants.BACKGROUND);
         return buffer;
      }
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
            effect_lights: 25,
            effect_camera: 35,
            effect_coordinates: 45,
            effect_material: 55,
            color_setting: 75,
            color_creating_reading: 85,
            image_displaying: 175,
            image_pixels: 185,
            rendering: 280,
            typography_displaying: 10,
            typography_attributes: 20,
            typography_metrics: 30,
         }
      };
   };

   context.reset = function(taskInfos) {
      context.processing.internalInstance = new Processing();
      context.processing.ops = [];
      if (taskInfos) {
         context.processing.options = taskInfos.options || {};
         context.processing.initialDrawing = taskInfos.initialDrawing || null;
      }
      if (context.display) {
         context.resetDisplay();
      }
   };

   var conceptBaseUrl = (window.location.protocol == 'https' ? 'https' : 'http') + '//'
        + 'static4.castor-informatique.fr/help/processing.html';
   context.conceptList = [
      {id: 'processing_introduction', name: 'Processing - introduction', url: conceptBaseUrl+'#processing_introduction'},
      {id: 'processing_environment', name: 'Environnement', url: conceptBaseUrl+'#processing_environment'},
      {id: 'processing_shape_2D', name: 'Formes - 2D', url: conceptBaseUrl+'#processing_shape_2D'},
      {id: 'processing_shape_curves', name: 'Formes - courbes', url: conceptBaseUrl+'#processing_shape_curves'},
      {id: 'processing_shape_attributes', name: 'Formes - ellipse', url: conceptBaseUrl+'#processing_shape_attributes'},
      {id: 'processing_shape_vertex', name: 'Formes - sommets', url: conceptBaseUrl+'#processing_shape_vertex'},
      {id: 'processing_shape_other', name: 'Formes - autres', url: conceptBaseUrl+'#processing_shape_other'},
      {id: 'processing_transforms', name: 'Transformations', url: conceptBaseUrl+'#processing_transforms'},
      {id: 'processing_effect_lights', name: 'Effets - lumière', url: conceptBaseUrl+'#processing_effect_lights'},
      {id: 'processing_effect_camera', name: 'Effets - caméra', url: conceptBaseUrl+'#processing_effect_camera'},
      {id: 'processing_coordinates', name: 'Effets - coordonnées', url: conceptBaseUrl+'#processing_coordinates'},
      {id: 'processing_effect_matter', name: 'Effets - matière', url: conceptBaseUrl+'#processing_effect_matter'},
      {id: 'processing_color_setting', name: 'Couleurs - réglages', url: conceptBaseUrl+'#processing_color_setting'},
      {id: 'processing_image_displaying', name: 'Couleurs - création et lecture', url: conceptBaseUrl+'#processing_image_displaying'},
      {id: 'processing_image_textures', name: 'Images - affichage', url: conceptBaseUrl+'#processing_image_textures'},
      {id: 'processing_image_pixels', name: 'Images - pixels', url: conceptBaseUrl+'#processing_image_pixels'},
      {id: 'processing_rendering', name: 'Rendu', url: conceptBaseUrl+'#processing_rendering'},
      {id: 'processing_typography_display', name: 'Typographie - affichage', url: conceptBaseUrl+'#processing_typography_display'},
      {id: 'processing_typography_attributes', name: 'Typographie - attributs', url: conceptBaseUrl+'#processing_typography_attributes'},
      {id: 'processing_typography_measures', name: 'Typographie - mesures', url: conceptBaseUrl+'#processing_typography_measures'},
      {id: 'processing_constants', name: '', url: conceptBaseUrl+'#processing_constants'},
   ];


   function initGraphics2D(pg, forceInitialDrawing) {
      pg.background(constants.BACKGROUND);
      pg.scale(context.processing.state.scale);
      if (context.processing.initialDrawing && (!context.processing.state.hideInitialDrawing || forceInitialDrawing)) {
         pg.pushStyle();
         context.processing.initialDrawing(pg);
         pg.popStyle();
      }
      pg.resetMatrix();
      pg.noLights();
      pg.fill(128);
      pg.scale(context.processing.state.scale);
   }

   function initGraphics3D(pg, forceInitialDrawing) {
      pg.background(constants.BACKGROUND);
      pg.translate(Math.round(pg.width / 2), Math.round(pg.height / 2), 0);
      pg.scale(context.processing.state.scale);
      if (context.processing.initialDrawing && (!context.processing.state.hideInitialDrawing || forceInitialDrawing)) {
         context.processing.initialDrawing(pg);
      }
   }

   var initGraphics = infos['processing3D'] ? initGraphics3D : initGraphics2D;



   function drawOps(pg) {
      var ret;
      for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
         var op = context.processing.ops[iOp];
         var obj = op.obj ? op.obj : pg;
         var func = context.processing.overload[op.block];
         if (func) {
            func(obj, op.values);
         } else {
            ret = typeof obj[op.block] == 'function' ? obj[op.block].apply(obj, op.values) : obj[op.block];
         }
      }
      return ret;
   }



   context.setScale = function(scale) {
      context.processing.state.scale = scale;
      context.canvas_element.width(context.processing.getCanvasSize(constants.SCALED).width);
      context.canvas_element.height(context.processing.getCanvasSize(constants.SCALED).height);
      context.resetDisplay();
   }


   context.resetDisplay = function() {
      var canvas = $('<canvas>').css('border', '1px solid black');
      context.canvas_element = canvas;
      var coordinatesContainer = $('<div>').text(" ");
      $('#grid').empty().append(canvas, coordinatesContainer);

      var hideInitialDrawing = $('[for="hideInitialDrawing"]');
      if (infos.buttonHideInitialDrawing) {
         if (hideInitialDrawing.length == 0) {
            hideInitialDrawing = $('<label for="hideInitialDrawing">');
            hideInitialDrawing.text(" " + strings.hideInitialDrawing);
            var cb = $('<input id="hideInitialDrawing" type="checkbox">');
            cb.prop('checked', context.processing.state.hideInitialDrawing);
            hideInitialDrawing.prepend(cb);
         }
         $('#grid').prepend($('<div style="margin-bottom: 4px;">').append(hideInitialDrawing));
         $('#hideInitialDrawing').change(function(e) {
            context.processing.state.hideInitialDrawing = $(e.target).prop('checked');
            context.processing.previewInstance.redraw();
         });
      }

      if (infos.buttonExportAsSvg) {
        var exportButton = $('<button id="exportAsSvg" style="margin-top: 10px">' + strings.exportAsSvg + '</button>');
        $('#grid').append(exportButton);
        $('#exportAsSvg').click(function(e) {
          context.exportAsSvg();
        });
      }

      context.processing.previewInstance = new Processing(canvas.get(0), function(processing) {
         processing.setup = function() {
            processing.size(
                context.processing.getCanvasSize(constants.SCALED).width,
                context.processing.getCanvasSize(constants.SCALED).height,
                infos['processing3D'] ? processing.P3D : processing.P2D
            );
            processing.background(constants.BACKGROUND);
            processing.noLoop();
         };
         processing.draw = function() {
            initGraphics(processing);
            if (!infos['processing3D']) {
               processing.pushStyle();
            }
            drawOps(processing);
            if (!infos['processing3D']) {
               processing.popStyle();
            }
         };


         function normalizeCoord(v, offset) {
            return Math.max(0, Math.round(v / context.processing.state.scale)) -
                (offset ? Math.round(offset / context.processing.state.scale) : 0);
         }

         if (infos['processing3D']) {
            processing.mouseMoved = function() {
                var cs = context.processing.getCanvasSize(constants.SCALED);
                var x = normalizeCoord(processing.mouseX, Math.round(cs.width / 2));
                var y = normalizeCoord(processing.mouseY, Math.round(cs.height / 2));
                coordinatesContainer.text("(X: " + x + ", Y: " + y + ", Z: 0)");
            };
         } else {
            processing.mouseMoved = function() {
                // avoid -1 value
                var x = normalizeCoord(processing.mouseX);
                var y = normalizeCoord(processing.mouseY);
                coordinatesContainer.text(x + " × " + y);
            };
            processing.mouseDragged = function() {
                var x = normalizeCoord(processing.mouseX);
                var y = normalizeCoord(processing.mouseY);
                coordinatesContainer.find('span').remove();
                coordinatesContainer.append($('<span>').text(" — " + x + " × " + y));
            };
         }
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

   context.exportAsSvg = function () {
     if (!window.C2S) {
       alert("The library canvas2svg is not loaded");
       return;
     }

     // Canvas2SVG library is loaded, we create the SVG at the same time
     var canvasContext = new window.C2S(
       context.processing.getCanvasSize(constants.SCALED).width,
       context.processing.getCanvasSize(constants.SCALED).height
     );

     var canvas = document.createElement('canvas');
     canvas.getContext = function () {
       return canvasContext;
     };

     // Override Canvas2SVG translate method in the processing context, because
     // it creates a bug in which the stroke color of some shapes are overriden
     // by other shapes, resulting in losing the colors in the final SVG
     // because of Processing adding an unnecessary translation (x,y) for rectangles
     canvasContext.translate = function (x, y) {
     };

     var processingInstance = new Processing(canvas, function(processing) {
       processing.setup = function() {
         processing.size(
           context.processing.getCanvasSize(constants.SCALED).width,
           context.processing.getCanvasSize(constants.SCALED).height,
           infos['processing3D'] ? processing.P3D : processing.P2D
         );
         processing.background(constants.BACKGROUND);
         processing.noLoop();
       };
       processing.draw = function() {
         initGraphics(processing);
         if (!infos['processing3D']) {
           processing.pushStyle();
         }
         drawOps(processing);
         if (!infos['processing3D']) {
           processing.popStyle();
         }
       };
     });

     var svg = canvasContext.getSvg();

      // Clean SVG and remove everything that is not inside a <g transform="scale(1,1)">: it's only backgrounds added by processing lib
      // that are tricky to remove
     function findRightSvgBranch(parentElement) {
        for (var a = 0; a < parentElement.children.length; a++) {
           var child = parentElement.children[a];
           if ('scale(1,1)' === child.getAttribute('transform')) {
              return child;
           }
           var childBranch = findRightSvgBranch(child);
           if (childBranch) {
              return childBranch;
           }
        }

        return null;
     }

     var svgRealContent = findRightSvgBranch(svg);
     svg.innerHTML = "";
     svg.appendChild(svgRealContent);

     var svgData = svg.outerHTML;
     var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
     var svgUrl = URL.createObjectURL(svgBlob);
     var downloadLink = document.createElement("a");
     downloadLink.href = svgUrl;
     downloadLink.download = "processing.svg";
     document.body.appendChild(downloadLink);
     downloadLink.click();
     document.body.removeChild(downloadLink);
   };


   function drawOnBuffer(mode) {
      var buffer = context.processing.createBuffer();
      buffer.beginDraw();
      initGraphics(buffer, true);
      if (mode !== constants.SKIP_DRAW_OPS) {
         drawOps(buffer);
      }
      buffer.endDraw();
      return buffer;
   }

   context.getPixels = function(mode) {
      var buffer = drawOnBuffer(mode);
      buffer.loadPixels();
      return buffer.pixels;
   }



   context.processing.commonOp = function() {
      var callback = arguments[arguments.length - 1];
      var blockName = arguments[0], values = [];
      for (var iParam = 1; iParam < arguments.length - 1; iParam++) {
         values.push(arguments[iParam]);
      }
      if (blockName.substr(0, 5) == "print") {
         context.processing.internalInstance[blockName](values);
         context.waitDelay(callback);
      } else {
         context.processing.ops.push({ block: blockName, values: values });// obj: the object on which the block must be applied
         if (context.display) {
            context.processing.previewInstance.redraw();
         }
         context.waitDelay(callback);
      }
   };

   context.processing.pixels = function(index, callback) {
      var buffer = drawOnBuffer();
      buffer.loadPixels();
      context.waitDelay(callback, buffer.pixels().toArray());
   };

   context.customBlocks = {
      processing: {
         environment: [
            { name: "popStyle" },
            { name: "pushStyle" },
            { name: "cursor",
               variants: [
                  [{ options: ["ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT"] }],
                  ['Image', 'Number', 'Number']
               ],
               variants_names: [
                  ['mode'],
                  ['image', 'x', 'y']
               ]
            },
            { name: "focused", yieldsValue: 'bool' }, // must be a value
            { name: "width", yieldsValue: 'int' }, // must be a value
            { name: "height", yieldsValue: 'int' } // must be a value
         ],
         shape_2D: [
            { name: "arc",
               params: ['Number', 'Number', 'Number', 'Number', 'Angle', 'Angle'],
               params_names: ['x', 'y', 'width', 'height', 'start', 'stop']
            },
            { name: "ellipse",
               params: ['Number', 'Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'width', 'height']
            },
            { name: "line",
               variants: [
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x1', 'y1', 'x2', 'y2'],
                  ['x1', 'y1', 'z1', 'x2', 'y2', 'z2'],
               ]
            },
            { name: "point",
               variants: [
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x', 'y'],
                  ['x', 'y', 'z']
               ]
            },
            { name: "quad",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4']
            },
            { name: "rect",
               variants: [
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x', 'y', 'width', 'height'],
                  ['x', 'y', 'width', 'height', 'radius'],
                  ['x', 'y', 'width', 'height', 'tlradius', 'trradius', 'brradius', 'blradius']
               ]
            },
            { name: "triangle",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3']
            }
         ],
         shape_curve: [
            { name: "bezier",
               variants: [
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x1', 'y1', 'cx1', 'cy1', 'cx2', 'cy2', 'x2', 'y2'],
                  ['x1', 'y1', 'z1', 'cx1', 'cy1', 'cz1', 'cx2', 'cy2', 'cz2', 'x2', 'y2', 'z2']
               ]
            },
            { name: "bezierDetail",
               params: ['Number'],
               params_names: ['detail']
            },
            { name: "bezierPoint",
               params: ['Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['a', 'b', 'c', 'd', 't'],
               yieldsValue: 'int'
            },
            { name: "bezierTangent",
               params: ['Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['a', 'b', 'c', 'd', 't'],
               yieldsValue: 'int'
            },
            { name: "curve",
               variants: [
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'],
                  ['x1', 'y1', 'z1', 'x2', 'y2', 'z2', 'x3', 'y3', 'z3', 'x4', 'y4', 'z4']
               ]
            },
            { name: "curveDetail",
               params: ['Number'],
               params_names: ['detail']
            },
            { name: "curvePoint",
               params: ['Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['a', 'b', 'c', 'd', 't'],
               yieldsValue: 'int'
            },
            { name: "curveTangent",
               params: ['Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['a', 'b', 'c', 'd', 't'],
               yieldsValue: 'int'
            },
            { name: "curveTightness",
               params: ['Number'],
               params_names: ['squishy']
            }
         ],
         shape_3D: [
            { name: "box",
               variants: [
                  ['Number'],
                  ['Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['size'],
                  ['width', 'height', 'depth']
               ],
            },
            { name: "sphere",
               params: ['Number'],
               params_names: ['radius']
            },
            { name: "sphereDetail",
               variants: [
                  ['Number'],
                  ['Number', 'Number']
               ],
               variants_names: [
                  ['res'],
                  ['ures', 'vres']
               ]
            }
         ],
         shape_attributes: [
            { name: "ellipseMode",
               params: [{ options: ["CENTER", "RADIUS", "CORNER", "CORNERS"] }],
               params_names: ['mode']
            },
            { name: "noSmooth" },
            { name: "rectMode",
               params: [{ options: ["CORNER", "CORNERS", "CENTER", "RADIUS"] }],
               params_names: ['mode']
            },
            { name: "smooth" },
            { name: "strokeCap",
               params: [{ options: ["SQUARE", "PROJECT", "ROUND"] }],
               params_names: ['mode']
            },
            { name: "strokeJoin",
               params: [{ options: ["MITER", "BEVEL", "ROUND"] }],
               params_names: ['mode']
            },
            { name: "strokeWeight",
               params: ['Number'],
               params_names: ['width']
            }
         ],
         shape_vertex: [
            { name: "beginShape",
               variants: [
                  [],
                  [{ options: ["POINTS", "LINES", "TRIANGLES", "TRIANGLE_FAN", "TRIANGLE_STRIP", "QUADS", "QUAD_STRIP"] }]
               ],
               variants_names: [
                  [],
                  ['mode']
               ]
            },
            { name: "bezierVertex",
               variants: [
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['cx1', 'cy1', 'cx2', 'cy2', 'x', 'y'],
                  ['cx1', 'cy1', 'cz1', 'cx2', 'cy2', 'cz2', 'x', 'y', 'z']
               ]
            },
            { name: "curveVertex",
               variants: [
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x', 'y'],
                  ['x', 'y', 'z']
               ]
            },
            { name: "endShape",
               variants: [
                  [],
                  [{ options: ["CLOSE"] }]
               ],
               variants_names: [
                  [],
                  ['mode']
               ]
            },
            { name: "texture",
               params: ['Image'],
               params_names: ['image']
            },
            { name: "textureMode",
               params: [{ options: ["IMAGE", "NORMALIZED"] }],
               params_names: ['mode']
            },
            { name: "vertex",
               variants: [
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x', 'y'],
                  ['x', 'y', 'z'],
                  ['x', 'y', 'u', 'v'],
                  ['x', 'y', 'z', 'u', 'v']
               ]
            }
         ],
         shape_other: [
            { name: "shape",
               variants: [
                  ['Shape'],
                  ['Shape', 'Number', 'Number'],
                  ['Shape', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['shape'],
                  ['shape', 'x', 'y'],
                  ['shape', 'x', 'y', 'width', 'height']
               ]
            },
            { name: "shapeMode",
               params: [{ options: ["CORNER", "CORNERS", "CENTER"] }],
               params_names: ['mode']
            },
            { name: "isVisible", yieldsValue: 'bool' },
            { name: "setVisible",
               params: ['Boolean'],
               params_names: ['visible']
            },
            { name: "disableStyle" },
            { name: "enableStyle" },
            { name: "getChild",
               params: ['String'],
               params_names: ['target']
            }
         ],
         debug: [
            { name: "print",
               params: [null],
               params_names: ['text']
            },
            { name: "println",
               params: [null],
               params_names: ['text']
            }
         ],
         transform: [
            { name: "applyMatrix",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['n1_1', 'n1_2', 'n1_3', 'n1_4', 'n2_1', 'n2_2', 'n2_3', 'n2_4',
                  'n3_1', 'n3_2', 'n3_3', 'n3_4', 'n4_1', 'n4_2', 'n4_3', 'n4_4']
            },
            { name: "popMatrix" },
            { name: "printMatrix" },
            { name: "pushMatrix" },
            { name: "resetMatrix" },
            { name: "rotate",
               params: ['Angle'],
               params_names: ['angle']
            },
            { name: "rotateX",
               params: ['Angle'],
               params_names: ['angle']
            },
            { name: "rotateY",
               params: ['Angle'],
               params_names: ['angle']
            },
            { name: "rotateZ",
               params: ['Angle'],
               params_names: ['angle']
            },
            { name: "scale",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['size'],
                  ['x', 'y', 'z']
               ]
            },
            { name: "translate",
               params: infos['processing3D'] ? ['Number', 'Number', 'Number'] : ['Number', 'Number'],
               params_names: infos['processing3D'] ? ['x', 'y', 'z'] : ['x', 'y']
            }
         ],
         effect_lights: [
            { name: "ambientLight",
               variants: [
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['v1', 'v2', 'v3'],
                  ['v1', 'v2', 'v3', 'x', 'y', 'z']
               ]
            },
            { name: "directionalLight",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['v1', 'v2', 'v3', 'nx', 'ny', 'nz']
            },
            { name: "lightFalloff",
               params: ['Number', 'Number', 'Number'],
               params_names: ['constant', 'linear', 'quadratic']
            },
            { name: "lightSpecular",
               params: ['Number', 'Number', 'Number'],
               params_names: ['v1', 'v2', 'v3']
            },
            { name: "lights" },
            { name: "noLights" },
            { name: "normal",
               params: ['Number', 'Number', 'Number'],
               params_names: ['nx', 'ny', 'nz']
            },
            { name: "pointLight",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['v1', 'v2', 'v3', 'nx', 'ny', 'nz']
            },
            { name: "spotLight",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number', 'Number'],
               params_names: ['v1', 'v2', 'v3', 'nx', 'ny', 'nz', 'angle', 'concentration']
            }
         ],
         effect_camera: [
            { name: "beginCamera" },
            { name: "camera",
               variants: [
                  [],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  [],
                  ['eyeX', 'eyeY', 'eyeZ', 'centerX', 'centerY', 'centerZ', 'upX', 'upY', 'upZ']
               ]
            },
            { name: "endCamera" },
            { name: "frustum",
               params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
               params_names: ['left', 'right', 'bottom', 'top', 'near', 'far']
            },
            { name: "ortho",
               variants: [
                  [],
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  [],
                  ['left', 'right', 'bottom', 'top', 'near', 'far']
               ]
            },
            { name: "perspective",
               variants: [
                  [],
                  ['Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  [],
                  ['fov', 'aspect', 'zNear', 'zFar']
               ]
            },
            { name: "printCamera" },
            { name: "printProjection" }
         ],
         effect_coordinates: [
            { name: "modelX",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            },
            { name: "modelY",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            },
            { name: "modelZ",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            },
            { name: "screenX",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            },
            { name: "screenY",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            },
            { name: "screenZ",
               params: ['Number', 'Number', 'Number'],
               params_names: ['x', 'y', 'z'],
               yieldsValue: 'int'
            }
         ],
         effect_material: [
            { name: "ambient",
               variants: [
                  ['Number'],
                  ['Number', 'Number', 'Number'],
                  ['Colour']
               ],
               variants_names: [
                  ['gray'],
                  ['value1', 'value2', 'value3'],
                  ['color']
               ]
            },
            { name: "emissive",
               variants: [
                  ['Number'],
                  ['Number', 'Number', 'Number'],
                  ['Colour']
               ],
               variants_names: [
                  ['gray'],
                  ['value1', 'value2', 'value3'],
                  ['color']
               ]
            },
            { name: "shininess",
               params: ['Number'],
               params_names: ['shine']
            },
            { name: "specular",
               variants: [
                  ['Number'],
                  ['Number', 'Number', 'Number'],
                  ['Colour']
               ],
               variants_names: [
                  ['gray'],
                  ['value1', 'value2', 'value3'],
                  ['color']
               ]
            }
         ],
         color_setting: [
            { name: "background",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Colour'],
                  ['Colour', 'Number'],
                  ['Image']
               ],
               variants_names: [
                  ['gray'],
                  ['gray', 'alpha'],
                  ['value1', 'value2', 'value3'],
                  ['value1', 'value2', 'value3', 'alpha'],
                  ['color'],
                  ['color', 'alpha']
               ]
            },
            { name: "colorMode",
               variants: [
                  ['ColorModeConst'],
                  ['ColorModeConst', 'Number'],
                  ['ColorModeConst', 'Number', 'Number', 'Number'],
                  ['ColorModeConst', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['mode'],
                  ['mode', 'range'],
                  ['mode', 'range1', 'range2', 'range3'],
                  ['mode', 'range1', 'range2', 'range3', 'range4']
               ]
            },
            { name: "fill",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Colour'],
                  ['Colour', 'Number']
               ],
               variants_names: [
                  ['gray'],
                  ['gray', 'alpha'],
                  ['value1', 'value2', 'value3'],
                  ['value1', 'value2', 'value3', 'alpha'],
                  ['color'],
                  ['color', 'alpha']
               ]
            },
            { name: "noFill" },
            { name: "noStroke" },
            { name: "stroke",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Colour'],
                  ['Colour', 'Number']
               ],
               variants_names: [
                  ['gray'],
                  ['gray', 'alpha'],
                  ['value1', 'value2', 'value3'],
                  ['value1', 'value2', 'value3', 'alpha'],
                  ['color'],
                  ['color', 'alpha']
               ]
            },
        ],
        color_creating_reading: [
            { name: "alpha",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "blendColor",
               params: ['Colour', 'Colour', 'BlendConst'],
               params_names: ['color1', 'color2', 'mode'],
               yieldsValue: true
            },
            { name: "blue",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "brightness",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "color",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['gray'],
                  ['gray', 'alpha'],
                  ['value1', 'value2', 'value3'],
                  ['value1', 'value2', 'value3', 'alpha'],
               ],
               yieldsValue: true
            },
            { name: "green",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "hue",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "lerpColor",
               params: ['Colour', 'Colour', 'Number'],
               params_names: ['color1', 'color2', 'amount'],
               yieldsValue: true
            },
            { name: "red",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            },
            { name: "saturation",
               params: ['Colour'],
               params_names: ['color'],
               yieldsValue: 'int'
            }
         ],
         image_displaying: [
            { name: "createImage",
               params: ['Number', 'Number', { options: ["RGB", "ARGB", "ALPHA"] }],
               params_names: ['width', 'height', 'format'],
               yieldsValue: true
            },
            { name: "image",
               variants: [
                  ['Image', 'Number', 'Number'],
                  ['Image', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['image', 'x', 'y'],
                  ['image', 'x', 'y', 'width', 'height']
               ]
            },
            { name: "imageMode",
               params: [{ options: ["CORNER", "CORNERS", "CENTER"] }],
               params_names: ['mode']
            },
            { name: "noTint" },
            { name: "tint",
               variants: [
                  ['Number'],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'],
                  ['Colour'],
                  ['Colour', 'Number']
               ],
               variants_names: [
                  ['gray'],
                  ['gray', 'alpha'],
                  ['value1', 'value2', 'value3'],
                  ['value1', 'value2', 'value3', 'alpha'],
                  ['color'],
                  ['color', 'alpha']
               ]
            },
            { name: "resize",
               params: ['Number', 'Number'],
               params_names: ['width', 'height']
            }
         ],
         image_pixels: [
            { name: "blend",
               variants: [
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'BlendConst'],
                  ['Image', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'BlendConst']
               ],
               variants_names: [
                  ['x', 'y', 'width', 'height', 'dx', 'dy', 'dwidth', 'dheight', 'mode'],
                  ['srcImg', 'x', 'y', 'width', 'height', 'dx', 'dy', 'dwidth', 'dheight', 'mode']
               ]
            },
            { name: "copy",
               variants: [
                  ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                  ['Image', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['x', 'y', 'width', 'height', 'dx', 'dy', 'dwidth', 'dheight'],
                  ['srcImg', 'x', 'y', 'width', 'height', 'dx', 'dy', 'dwidth', 'dheight']
               ]
            },
            { name: "filter",
               variants: [
                  ['FilterConst'],
                  ['FilterConst', 'Number']
               ],
               variants_names: [
                  ['mode'],
                  ['mode', 'param']
               ]
            },
            { name: "get",
               variants: [
                  [],
                  ['Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  [],
                  ['x', 'y'],
                  ['x', 'y', 'width', 'height']
               ],
               yieldsValue: true
            },
            { name: "loadPixels" },
            { name: "pixels", yieldsValue: true }, // must be a list
            { name: "set",
               variants: [
                  ['Number', 'Number', 'Colour'],
                  ['Number', 'Number', 'Image']
               ],
               variants_names: [
                  ['x', 'y', 'color'],
                  ['x', 'y', 'image']
               ]
            },
            { name: "updatePixels" }
         ],
         rendering: [
            { name: "createGraphics",
               params: ['Number', 'Number', { options: ["P2D", "P3D", "JAVA2D"] }],
               params_names: ['width', 'height', 'renderer'],
               yieldsValue: true
            },
            { name: "beginDraw" },
            { name: "endDraw" }
         ],
         typography_displaying: [
            { name: "PFont_list", yieldsValue: true },
            { name: "createFont",
               params: ['String', 'Number'],
               params_names: ['name', 'size'],
               yieldsValue: true
            },
            { name: "loadFont",
               params: ['String'],
               params_names: ['name'],
               yieldsValue: true
            },
            { name: "text_",
               variants: [
                  [null, 'Number', 'Number'],
                  [null, 'Number', 'Number', 'Number'],
                  ['String', 'Number', 'Number', 'Number', 'Number'],
                  ['String', 'Number', 'Number', 'Number', 'Number', 'Number']
               ],
               variants_names: [
                  ['data', 'x', 'y'],
                  ['data', 'x', 'y', 'z'],
                  ['text', 'x', 'y', 'width', 'height'],
                  ['text', 'x', 'y', 'width', 'height', 'z']
               ]
            },
            { name: "textFont",
               variants: [
                  ['Font'],
                  ['Font', 'Number']
               ],
               variants_names: [
                  ['font'],
                  ['font', 'size']
               ]
            }
         ],
         typography_attributes: [
            { name: "textAlign",
               variants: [
                  [{ options: ["LEFT", "CENTER", "RIGHT"] }],
                  [{ options: ["LEFT", "CENTER", "RIGHT"] }, { options: ["TOP", "BOTTOM", "CENTER", "BASELINE"] }]
               ],
               variants_names: [
                  ['align'],
                  ['align', 'yAlign']
               ]
            },
            { name: "textLeading",
               params: ['Number'],
               params_names: ['dist']
            },
            { name: "textMode",
               params: [{ options: ["MODEL", "SCREEN", "SHAPE"] }],
               params_names: ['mode']
            },
            { name: "textSize",
               params: ['Number'],
               params_names: ['size']
            },
            { name: "textWidth",
               params: ['String'],
               params_names: ['text'],
               yieldsValue: 'int'
            }
         ],
         typography_metrics: [
            { name: "textAscent", yieldsValue: 'int' },
            { name: "textDescent", yieldsValue: 'int' }
         ]
      }
   };

   if(context.infos.includeBlocks.customBlocks) {
      for(var lib in context.infos.includeBlocks.customBlocks) {
         context.customBlocks.processing[lib] = context.customBlocks.processing[lib].concat(context.infos.includeBlocks.customBlocks[lib]);
      }
   }

   var typeData = {
      'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
      'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
      'Colour': { bType: 'input_value', vType: 'colour_picker', fName: 'COLOUR', defVal: "#ffffff",
         conv: function(value) { return typeof value == 'string' ? parseInt('0xff' + value.substr(1)) : value; } },
      'Angle': { pType: 'Number', bType: 'input_value', vType: 'math_angle', fName: 'ANGLE', defVal: 0,
         conv: function(value) { return value * Math.PI / 180; } },
      'Const': { conv: function(value) { return context.processing.internalInstance[value] || value; } },
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
                  block.blocklyJson = $.extend({ inputsInline: true, args0: [] }, block.blocklyJson);
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
                           blockArgs[iParam].options.push(
                              [strings.constantLabel[paramData.options[iValue]], paramData.options[iValue]]);
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
                  var values = [block.name.replace(/_$/, '').replace('_', '.')];
                  for (var iParam = 0; iParam < arguments.length; iParam++) {
                     var val = arguments[iParam];
                     if (params[iParam] in typeData && typeData[params[iParam]].conv) {
                        val = typeData[params[iParam]].conv(val);
                     }
                     values.push(val);
                  }
                  context.processing.commonOp.apply(this, values);
               };
            }
         })();
      }
   }
/*
   context.customConstants = { processing: [] };
   for (var constName in strings.constant) {
      context.customConstants.processing.push({ name: constName, value: context.processing.internalInstance[constName] });
   }

*/
   context.docGenerator = {

      variants_cache: null,
      separators: {
         argument: ', ',
         variant: '<br>',
         description: strings.misc.colon
      },

      init: function() {
         if (this.variants_cache) return;
         this.variants_cache = {};
         for (var lib in context.customBlocks) {
            for (var section in context.customBlocks[lib]) {
               var blocks = context.customBlocks[lib][section];
               for (var i=0; i<blocks.length; i++) {
                  var block = blocks[i];
                  if (block.variants_names) {
                     this.variants_cache[block.name] = [];
                     for (var j=0; j<block.variants_names.length; j++) {
                        this.variants_cache[block.name].push(
                           this.formatArguments(block.variants_names[j])
                        )
                     }
                  } else if (block.params_names) {
                     this.variants_cache[block.name] = [
                        this.formatArguments(block.params_names)
                     ];
                  }
               }

            }
         }
      },


      formatArguments: function(arg_names) {
         var res = [];
         for (var i=0; i<arg_names.length; i++) {
            var arg = arg_names[i];
            res.push(context.strings.params[arg] || arg);
         }
         return res.join(this.separators.argument);
      },


      blockDescription: function(name) {
         this.init();
         var description = context.strings.description[name] || '';
         var separator_description = description == '' ? ' ' : this.separators.description;

         var visible_name = context.strings.code[name] || name;
         var variants = this.variants_cache[name];

         var res = [];
         if (variants) {
            for (var i=0; i<variants.length; i++) {
               res.push('<code>' + visible_name + '(' + variants[i] + ')</code>');
            }
            return res.join(this.separators.variant) +
               (res.length > 1 ? this.separators.variant : separator_description) +
               description;
         }
         return '<code>' + visible_name + '()</code>' + separator_description + description
      }

   }

   return context;
}





var processingEndConditions = {

   checkEndCondition: function(context, lastTurn) {
      var options = context.infos.checkEndConditionOptions || {},
         initialPixels = context.getPixels(context.constants.SKIP_DRAW_OPS),
         finalPixels = context.getPixels();

      if (options.checkRedCoveredGreenNotCovered) {
         processingEndConditions.checkRedCoveredGreenNotCovered(
            context.processing.internalInstance.color(0xFFFF0000),
            context.processing.internalInstance.color(0xFF00FF00),
            initialPixels,
            finalPixels
         );
      }

      if (options.checkAllFiguresConnected) {
         processingEndConditions.checkAllFiguresConnected(
            context.processing.internalInstance.color(context.constants.BACKGROUND),
            finalPixels,
            context.processing.getCanvasSize().width
         );
      }

      if (options.checkBackgroundCovered) {
         processingEndConditions.ckeckBackgroundCovered(
            context.processing.internalInstance.color(context.constants.BACKGROUND),
            initialPixels,
            finalPixels,
            options.checkBackgroundCovered
         );
      }

      context.success = true;

      throw(window.languageStrings.messages.taskCompleted);
   },




   checkRedCoveredGreenNotCovered: function(toCover, toAvoid, initialPixels, finalPixels) {
      var success = processingEndConditions.checkCoveredColors(
         toCover,
         toAvoid,
         initialPixels,
         finalPixels
      );
      if (!success[0] && !success[1]) {
         throw(window.languageStrings.messages.redNotCoveredGreenCovered || '');
      } else if (!success[0]) {
         throw(window.languageStrings.messages.redNotCovered || '');
      } else if (!success[1]) {
         throw(window.languageStrings.messages.greenCovered || '');
      }
      //throw(window.languageStrings.messages.redCoveredGreenNotCovered || '');
   },


   checkCoveredColors: function(toCover, toAvoid, initialPixels, finalPixels) {
      var result = [true, true];
      for (var iPixel = 0; iPixel < initialPixels.getLength() && iPixel < finalPixels.getLength(); iPixel++) {
         var initialPixel = initialPixels.getPixel(iPixel), finalPixel = finalPixels.getPixel(iPixel);
         if (finalPixel == toCover) {
            result[0] = false;
         } else if (initialPixel == toAvoid && finalPixel != toAvoid) {
            result[1] = false;
         }
      }
      return result;
   },




   checkAllFiguresConnected: function(background, finalPixels, width) {
      var figures_count = processingEndConditions.getFiguresCount(
         background,
         finalPixels,
         width
      );
      if (figures_count > 1) {
         throw(window.languageStrings.messages.allFiguresMustBeConnected);
      }
   },


   getFiguresCount: function(bg, pixels, width) {
      var labels = new Array(pixels.getLength());
      var links = [];

      function getLinkRoot(l) {
         return links[l] ? getLinkRoot(links[l]) : l;
      }

      function addLink(ll, lt) {
         var new_root = getLinkRoot(lt);
         var old_root = links[ll];
         if (old_root) {
            if (new_root == old_root) return;
            for (var i = 0; i < links.length; i++) {
               if (links[i] == old_root) {
                  links[i] = new_root;
               }
            }
            links[old_root] = new_root;
         }
         links[ll] = new_root;
      }

      var n = 0;
      var fl, ft;
      for (var i = 0; i < pixels.getLength(); i++) {
         if (pixels.getPixel(i) === bg) continue;
         ll = i - 1 >= 0 ? labels[i - 1] : 0;
         lt = i - width >= 0 ? labels[i - width] : 0;
         if (ll && lt) {
            labels[i] = ll;
            if (ll != lt) {
               addLink(ll, lt)
            }
         } else if (ll && !lt) {
            labels[i] = ll;
         } else if (!ll && lt) {
            labels[i] = lt;
         } else {
            labels[i] = ++n;
         }
      }
      var v;
      for (var i = 0; i < labels.length; i++) {
         if (v = links[labels[i]]) {
            labels[i] = v;
         }
      }
      var count = 0;
      var is_counted = {};
      for (var i = 0; i < labels.length; i++) {
         v = labels[i];
         if (!v || is_counted[v]) continue;
         is_counted[v] = true;
         count++;
      }
      return count;
   },



   ckeckBackgroundCovered: function(background, initialPixels, finalPixels, options) {
      var initial = processingEndConditions.getCoveredPixelsCount(background, initialPixels),
         final = processingEndConditions.getCoveredPixelsCount(background, finalPixels),
         delta = Math.abs(final - initial);
      if (delta < options.threshold) return;
      var score = Math.max(0, options.initial_score + options.threshold - delta * options.score_lost);
      var values = {
            '{score}': score,
            '{initial_score}': options.initial_score
         },
         ex = window.languageStrings.messages.tooManyWhitePixelsCovered.replace(/\{\w+\}/g, function(key) {
            return key in values ? values[key] : key;
         });
      throw(ex);
   },


   getCoveredPixelsCount: function(bg, pixels) {
      var res = 0;
      for (var i = 0; i < pixels.getLength(); i++) {
         if (pixels.getPixel(i) !== bg) {
            res++;
         }
      }
      return res;
   }


};

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('processing', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['processing', getContext]);
}

/*
pdebug = {

   displayLabeledFigures: function(labels, max_value, context) {
      var div = $('#ptest');
      if (div.length == 0) {
         var div = $('<div id="ptest">')
            .css('position', 'fixed')
            .css('z-index', 10000)
            .css('left', '0px')
            .css('top', '0px')
         div.append($('<canvas>'));
         $(document.body).append(div);
      }
      var canvas = div.find('canvas');
      canvas.width(context.processing.getCanvasSize().width);
      canvas.height(context.processing.getCanvasSize().height);
      var p = new Processing(canvas[0], function(processing) {
         processing.setup = function() {
            processing.size(
               context.processing.getCanvasSize().width,
               context.processing.getCanvasSize().height,
               processing.P2D
            );
            processing.background(BACKGROUND);
            processing.noLoop();
         };
      });
      p.loadPixels();
      for (var i=0; i<labels.length; i++) {
         var c = labels[i] ? Math.floor(200 * labels[i] / max_value) : 255;
         p.pixels.setPixel(i, p.color(c));
      }
      p.updatePixels();
   },

   displayPixels: function(pixels, context) {
      var div = $('#ptest');
      if (div.length == 0) {
         var div = $('<div id="ptest">')
            .css('position', 'fixed')
            .css('z-index', 10000)
            .css('left', '0px')
            .css('top', '0px')
         div.append($('<canvas>'));
         $(document.body).append(div);
      }
      var canvas = div.find('canvas');
      canvas.width(context.processing.getCanvasSize().width);
      canvas.height(context.processing.getCanvasSize().height);
      var p = new Processing(canvas[0], function(processing) {
         processing.setup = function() {
         processing.size(
            context.processing.getCanvasSize().width,
            context.processing.getCanvasSize().height,
            processing.P2D
         );
         processing.background(context.constants.BACKGROUND);
         processing.noLoop();
         };
      });
      p.loadPixels();
      for (var i=0; i<pixels.getLength(); i++) {
         p.pixels.setPixel(i, pixels.getPixel(i));
      }
      p.updatePixels();
   }

}
*/
