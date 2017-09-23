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
            width: "largeur",
            height: "hauteur",
            // shape_2D
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5° et %6°",
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
            rotate: "pivoter de %1°",
            rotateX: "pivoter sur l'axe X de %1°",
            rotateY: "pivoter sur l'axe Y de %1°",
            rotateZ: "pivoter sur l'axe Z de %1°",
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
            // image_loading
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
            // typography_loading
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
            // image_loading
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
            // typography_loading
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
            popStyle: "depilerStyle() : restaure le style précédant l'empilement correspondant avec empilerStyle()",//dépilerStyle
            pushStyle: "empilerStyle() : enregistre le style actuel afin qu'il puisse être restauré par depilerStyle()",
            cursor: "curseurSouris(…) : utilise l'image indiquée ou fournie pour représenter la souris sur le canevas",
            focused: "canevasSelectionne : vrai si le canevas est sélectionné, faux sinon",//canevasSélectionné
            width: "largeur : largeur du canevas",
            height: "hauteur : hauteur du canevas",
            // shape_2D
            arc: "arc(x, y, largeur, hauteur, début, fin) : dessine l'arc de l'ellipse aux propriétés indiquées, " +
               "depuis l'angle <var>début</var> jusqu'à l'angle <var>fin</var> (donnés en degrés)",
            ellipse: "ellipse(x, y, largeur, hauteur) : dessine l'ellipse aux coordonnées indiquées avec la taille indiquée, " +
               "dont le fonctionnement peut être changé par la fonction modeEllipses",
            line: "ligne(…) : dessine la ligne allant du premier point au second point indiqués",
            point: "point(…) : dessine un point (disque dont le diamètre correspond à l'épaisseur des lignes actuelle) " +
               "aux coordonnées indiquées",
            quad: "quad(x1, y1, x2, y2, x3, y3, x4, y4) : dessine un quadrilatère ayant pour sommets les quatre points indiqués",
            rect: "rect(…) : dessine un rectangle aux coordonnées indiquées avec la taille indiquée, dont le fonctionnement " +
             "peut être changé par la fonction modeRectangles, et avec les rayons indiqués pour arrondir les coins",
            triangle: "triangle(x1, y1, x2, y2, x3, y3) : dessine un triangle ayant pour sommets les trois points indiqués",
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
            ellipseMode: "modeEllipses('CENTER' | 'RADIUS' | 'CORNER' | 'CORNERS') : définit la manière dont les propriétés " +
               "des ellipses sont interprétées — 'CENTER' et 'RADIUS' utilisent les coordonnées comme centre, 'RADIUS' utilise " +
               "la taille comme des rayons, 'CORNER' et 'CORNERS' utilisent les coordonnées comme coin haut-gauche, " +
               "'CORNERS' utilise la taille comme coordonnées du coin bas-droite",
            noSmooth: "desactiverLissage() : désactive le lissage appliqué aux formes",//désactiverLissage
            rectMode: "modeRectangles('CORNER' | 'CORNERS' | 'CENTER' | 'RADIUS') : définit la manière dont les propriétés " +
               "des rectangles sont interprétées — voir modeEllipses",
            smooth: "lissage() : active le lissage appliqué aux formes",
            strokeCap: "terminaisonsLignes('SQUARE' | 'PROJECT' | 'ROUND') : définit le style de terminaison des lignes",
            strokeJoin: "jointuresLignes('MITER' | 'BEVEL' | 'ROUND') : définit le style de jointure des segments de lignes",
            strokeWeight: "epaisseurLignes(épaisseur) : définit l'épaisseur des lignes, en pixels",//épaisseurLignes
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
            print: "sortirTexte(données) : affiche le texte ou les données indiquées dans la console",
            println: "sortirLigne(données) : affiche le texte ou les données indiquées dans la console, suivies d'une fin de ligne",
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
            background: "arrierePlan(…) : remplit le canevas avec la couleur indiquée " +
               "(doit être utilisé en tout début de programme)",//arrièrePlan
            colorMode: "modeCouleurs(…) : définit la manière dont les composantes des couleurs sont interprétées ; le premier " +
               "paramètre définit le mode ('RGB' pour rouge, vert et bleu ; 'HSB' pour teinte, saturation, luminosité) ; " +
               "les suivants définissent la valeur maximale (255 par défaut)",
            fill: "couleurFond(…) : définit la couleur de fond utilisée pour le dessin",
            noFill: "desactiverFond() : utilise un fond transparent pour les prochains dessins",//désactiverFond
            noStroke: "desactiverLigne() : utilise une ligne transparente pour les prochains dessins",//désactiverLigne
            stroke: "couleurLigne(…) : définit la couleur de ligne utilisée pour le dessin",
            // color_creating_reading
            alpha: "opacite(couleur) : extrait la quantité d'opacité d'une couleur",//opacité
            //blendColor: "melangerCouleurs",//mélangerCouleurs
            blue: "bleu(couleur) : extrait la quantité de bleu d'une couleur",
            brightness: "luminosite(couleur) : extrait la quantité de bleu d'une couleur",//luminosité
            color: "couleur(…) : crée une couleur avec les valeurs indiquées",
            green: "vert(couleur) : extrait la quantité de vert d'une couleur",
            hue: "teinte(couleur) : extrait la quantité de teinte d'une couleur",
            lerpColor: "couleurIntermediaire(c1, c2, emplacement) : fournit une couleur interpolée entre les deux couleurs " +
               "indiquées, l'emplacement étant une valeur entre 0 et 1 (0 correspond à la première couleur, 0,1 en est proche, " +
               "0,5 est au milieu des deux…)",//couleurIntermédiaire
            red: "rouge(couleur) : extrait la quantité de rouge d'une couleur",
            saturation: "saturation(couleur) : extrait la quantité de saturation d'une couleur",
            // image_loading
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
            // typography_loading
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
         messages: {
            redCoveredGreenNotCovered: "Vous avez bien recouvert tout le rouge sans toucher au vert.",
            redNotCovered: "Recouvrez bien toute la partie rouge.",
            greenCovered: "Vous avez caché la partie rouge, mais avez recouvert une partie du vert.",
            redNotCoveredGreenCovered: "Vous n'avez pas masqué la partie rouge, et avez recouvert une partie du vert !"
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
            image_loading: "Image – loading",
            image_pixels: "Image – pixels",
            rendering: "Rendering",
            typography_loading: "Typography – loading",
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
            arc: "draw an arc at %1 %2 of size %3 %4 between angles %5° and %6°",
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
            rotate: "rotate by %1°",
            rotateX: "rotate on X axis by %1°",
            rotateY: "rotate on Y axis by %1°",
            rotateZ: "rotate on Z axis by %1°",
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
            // image_loading
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
            // typography_loading
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
            // image_loading
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
            // typography_loading
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
         values: {
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
            MODEL: "Model",
            SCREEN: "Screen",
            SHAPE: "Shape"
         },
         startingBlockName: "Program",
         hideInitialDrawing: "Hide initial drawing",
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


   function initGraphics2D(pg) {
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

   function initGraphics3D(pg) {
      pg.background(255);
      if (context.processing.initialDrawing && !$('#hideInitialDrawing').prop('checked')) {
         context.processing.initialDrawing(pg);
      }
   }

   var initGraphics = infos['processing3D'] ? initGraphics3D : initGraphics2D;

   function drawOps(pg) {
      var ret;
      for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
         var op = context.processing.ops[iOp];
         var obj = op.obj ? op.obj : pg;
         ret = typeof obj[op.block] == 'function' ? obj[op.block].apply(obj, op.values) : obj[op.block];
      }
      return ret;
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

      context.processing_main = new Processing(canvas.get(0), function(processing) {
         processing.setup = function() {
            processing.size(300, 300, infos['processing3D'] ? processing.P3D : processing.P2D);
            processing.background(255);
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

         if (infos['processing3D']) {
            processing.mouseMoved = function() {
               coordinatesContainer.text(
                  '(X:' + (processing.mouseX - Math.round(processing.width * 0.5)) + ', ' +
                  'Y:' + (processing.mouseY - Math.round(processing.height * 0.5)) + ', ' +
                  'Z: 0)'
               );
            };
         } else {
            processing.mouseMoved = function() {
               coordinatesContainer.text(processing.mouseX + " × " + processing.mouseY);
            };
            processing.mouseDragged = function() {
               coordinatesContainer.find('span').remove();
               coordinatesContainer.append($('<span>').text(" — " + processing.mouseX + " × " + processing.mouseY));
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


   function drawOnBuffer() {
      var buffer = context.processing.buffer = context.processing.internalInstance.createGraphics(300, 300);
      buffer.beginDraw();
      initGraphics(buffer);
      var ret = drawOps(buffer);
      buffer.endDraw();
      return buffer;
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
         context.processing.ops.push({ block: blockName, values: values });//, obj: this === context ? null : this });
         if (context.display) {
            context.processing_main.redraw();
         }
         context.waitDelay(callback, drawOnBuffer());
      }
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
            { name: "cursor",
               variants: [[{ options: ["ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT"] }], ['Image', 'Number', 'Number']] },
            { name: "focused", yieldsValue: true }, // must be a value
            { name: "width", yieldsValue: true }, // must be a value
            { name: "height", yieldsValue: true } // must be a value
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
            { name: "translate", params: (infos['processing3D'] ? ['Number', 'Number', 'Number'] : ['Number', 'Number']) }
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
            { name: "image", variants: [['Image', 'Number', 'Number'], ['Image', 'Number', 'Number', 'Number', 'Number']] },
            { name: "imageMode", params: [{ options: ["CORNER", "CORNERS", "CENTER"] }] },
            { name: "noTint" },
            { name: "tint",
               variants: [['Number'], ['Number', 'Number'], ['Number', 'Number', 'Number'],
                  ['Number', 'Number', 'Number', 'Number'], ['Colour']] },
            { name: "resize", params: ['Number', 'Number'] }
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
            { name: "set", variants: [['Number', 'Number', 'Colour'], ['Number', 'Number', 'Image']] },
            { name: "updatePixels" }
         ],
         rendering: [
            { name: "createGraphics", params: ['Number', 'Number', { options: ["P2D", "P3D", "JAVA2D"] }], yieldsValue: true },
            { name: "beginDraw" },
            { name: "endDraw" }
         ],
         typography_loading: [
            { name: "PFont_list", yieldsValue: true },
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


   context.checkCoveredColors = function(toCover, toAvoid) {
      var buffer = context.processing.internalInstance.createGraphics(300, 300);
      buffer.beginDraw();
      initGraphics(buffer);
      buffer.endDraw();
      buffer.loadPixels();
      var initialPixels = buffer.pixels;
      drawOnBuffer();
      context.processing.buffer.loadPixels();
      var finalPixels = context.processing.buffer.pixels;
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
   };


   return context;
}

var processingEndConditions = {
   checkRedCoveredGreenNotCovered: function(context, lastTurn) {
      var success = context.checkCoveredColors(
         context.processing.internalInstance.color(0xFFFF0000), context.processing.internalInstance.color(0xFF00FF00))
      if (!success[0] && !success[1]) {
         throw(window.languageStrings.messages.redNotCoveredGreenCovered);
      } else if (!success[0]) {
         throw(window.languageStrings.messages.redNotCovered);
      } else if (!success[1]) {
         throw(window.languageStrings.messages.greenCovered);
      }
      throw(window.languageStrings.messages.redCoveredGreenNotCovered);
   }
};
