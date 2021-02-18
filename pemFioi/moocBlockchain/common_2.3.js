var marginY = 20;
var marginX = 20;
var headerH = 40;
var hashMachineH = 450;
var hashButtonH = 30;
var hashMachineCellH = (hashMachineH - headerH - hashButtonH - marginY)/2;
var validateButtonH = 40;
var circleR = 20;

var graph;
var vGraph;
var graphDrawer;
var graphMouse;
var dragLimits = {};
var hashButton;
var validateButton;
var hashMachineData = [null,null];
var dataRaph = [];
var dataPos = [];
// var timeOut;

var taskStrings = {
   success: "Bravo, vous avez réussi!",
   hashMachine: "Machine à hasher",
   data: "Donnée",
   generate: "GÉNÉRER LE HASH",
   check: "VÉRIFIER LE HASH",
   cancel: "ANNULER UNE ÉTAPE",
   validate: "VALIDER",
   retry: "RECOMMENCER",
   errorDataAlreadyUsed: "Une même donnée ne peut pas être utilisée pour deux hash différents.",
   errorMissingTransaction: "Votre arbre de Merkle ne contient pas toutes les transactions.",
   errorUnusedVertices: "Votre arbre de Merkle contient des noeuds inutiles.",
   errorNoSelection: "Aucune donnée n'est sélectionnée",
   errorSelectedData: "Impossible de générer un hash à partir des données sélectionnées.",
   errorDepth: function(diff) {
      var comp = (diff > 0) ? "plus" : "moins";
      return "Votre arbre de merkle n’est pas équilibré. La transaction encerclée de rouge est à une profondeur de "+Math.abs(diff)+" de "+comp+" que la transaction encerclée de orange."
   },
   errorSelection: "Les noeuds sélectionnés ne permettent pas de vérifier un hash.",
   errorMissingCheck: "Vous n’avez pas effectué toutes les vérifications nécessaires.",
   counter: function(n) {
      return "Noeuds lus: "+n;
   },
   alreadyChecked: "Ce hash a déjà été vérifié.",
   tooManyRead: function(n) {
      return "Vous avez vérifié la transaction en lisant le contenu de "+n+" noeuds de l’arbre, il est possible de faire moins."
   }
};

var hashMachineAttr = {
   title: {
      "font-size": 14,
      "font-weight": "bold",
      fill: colors.black,
      opacity: 0.8
   },
   frame: {
      stroke: "none",
      fill: colors.unselectedRectGrey,
      height: hashMachineH,
      r: 5
   },
   line: {
      stroke: "none",
      fill: colors.grey,
      opacity: 0.5
   },
   data: {
      "font-size": 14,
      "font-weight": "bold",
      fill: colors.darkGrey
   },
   hashButtonRect: {
      stroke: "none",
      fill: colors.orange,
      height: hashButtonH,
      r: hashButtonH/2
   },
   hashButtonText: {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   }
};

var validateButtonAttr = {
   rect: {
      stroke: "none",
      fill: colors.orange,
      height: validateButtonH,
      r: validateButtonH/2
   },
   text: {
      "font-size": 16,
      "font-weight": "bold",
      fill: "white"
   }
};

var circleAttr = {
   stroke: "none",
   fill: colors.unselectedRectGrey,
   r: circleR
};
var rectAttr = {
   stroke: "none",
   fill: colors.unselectedRectGrey,
   r: 10
};
var boxLineAttr = {
   stroke: colors.grey,
   "stroke-width": 1,
   opacity: 0.5
};
var vertexContentAttr = {
   "font-size": 14,
   "font-weight": "bold",
   fill: colors.orange
};
var lineAttr = {
   stroke: colors.grey,
   "stroke-width": 3
};
var vertexLabelAttr = {
   "font-size": 14,
   "font-weight": "bold",
   fill: colors.black,
   opacity: 0.8
};
var selectedAttr = {
   stroke: "none",
   fill: colors.blue
};
var selectedLabelAttr = {
   fill: colors.darkBlue
};

