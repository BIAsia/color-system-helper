/*
 * Developed by ZiyeLu for Adobe XD.

 */


const {Rectangle, Color, Text, Artboard} = require("scenegraph"); 
let commands = require("commands");
const { alert } = require("./lib/dialogs.js");
const fs = require("uxp").storage.localFileSystem;
var assets = require("assets");
var newColorNum, renameColorNum;
var fillList = [], fillNodeList = [];
var colorList = [], colorNodeList = [];
var path = [], tokenChart;


async function importAssetFromFile(){
    newColorNum=0;renameColorNum=0;
    var allColors = await getColorFromFile();
    //var allColors = storageHelper.get('colorAsset', defaultColors);
    console.log(allColors);
    createAssetFromJSON(allColors);
}


async function importAssetFromPlugin(){
    newColorNum=0;renameColorNum=0;
    var allColors = await getDefaultColorFromFile();
    //var allColors = storageHelper.get('colorAsset', defaultColors);
    console.log(allColors);
    createAssetFromJSON(allColors);
}


function createAssetFromJSON(allColors){
    for (let i = 0; i < allColors.length; i++){
        console.log(allColors[i].color.value);
        const newColor = new Color(allColors[i].color.value);
        console.log(newColor);
        addColorToAsset(allColors[i].name, newColor);
    }
    showAlert(newColorNum, renameColorNum);
}


async function getColorFromFile(){
    let assetFile = await fs.getFileForOpening();
    const contents = await JSON.parse((await assetFile.read()));
    return contents;
}

async function getDefaultColorFromFile(){
    let defaultColorAsset;
    let dataFolder = await fs.getPluginFolder();
    let defaultFile = await dataFolder.getEntry('default-color-asset.json');
    defaultColorAsset = JSON.parse((await defaultFile.read()));
    return defaultColorAsset;
}

async function saveCurrentAsset(){
    var allColors = assets.colors.get();
    const colorFile = await fs.getFileForSaving("color-asset.json");
    await colorFile.write(JSON.stringify(allColors));
}



function ColorAddHandlerFunction(selection) { 
    newColorNum=0;renameColorNum=0;
    
    let select = selection.items;
    select.forEach((root)=>{traverseChildrenForColors(root);});

    //SortColorAssetsHandlerFunction();
    showAlert(newColorNum, renameColorNum);
}

// 遍历寻找色块
function traverseChildrenForColors(root){
    if (root.isContainer){
        root.children.forEach((children,i)=>{
            traverseChildrenForColors(children);
        })
    } else {
        if (root.hasDefaultName == false) console.log("name");
        if (root.constructor.name == "Rectangle") console.log("rectangle");
        if (root.fill.constructor.name == "Color") console.log("Color");
        if (root.constructor.name == "Rectangle" && root.fill.constructor.name == "Color" && root.hasDefaultName == false){
            // only rename
            addColorToAsset(root.name, root.fill);
            // if (assets.colors.delete(new Color(root.fill))==1) {
            //     console.log("color deleted")
            //     renameColorNum++;
            //     assets.colors.add({name: root.name, color: root.fill});
            //     console.log("color " + root.name + " is added");
            // }
            
            // if (assets.colors.delete(new Color(root.fill))==1) {
            //     console.log("color deleted")
            //     renameColorNum++;
            //     newColorNum--;
            // }
            // assets.colors.add({name: root.name, color: root.fill});
            // console.log("color " + root.name + " is added");
            // newColorNum++;
            
        }
    }
}

function addColorToAsset(colorName, colorValue){
    if (assets.colors.delete(new Color(colorValue))==1) {
        console.log("color deleted")
        renameColorNum++;
        assets.colors.add({name: colorName, color: colorValue});
        console.log("color " + colorName + " is added");
    } else {
        assets.colors.add({name: colorName, color: colorValue});
        console.log("color " + colorName + " is added");
        newColorNum++;
    }
    
    // if (assets.colors.delete(new Color(colorValue))==1) {
    //     console.log("color deleted")
    //     renameColorNum++;
    //     newColorNum--;
    // }
    
}


function SortColorAssetsHandlerFunction(){
    var assets = require("assets"), allColors = assets.colors.get();
    console.log(allColors);
    allColors.sort((colorA, colorB)=>(colorA.name > colorB.name) ? 1:-1);
    console.log(allColors);

    assets.colors.delete(allColors);
    assets.colors.add(allColors);

}

function OutColorAssetsHandlerFunction(){
    var assets = require("assets"), allColors = assets.colors.get();
    for (let i = 0; i < allColors.length; i++){
        console.log(allColors[i].name);
    }
    
}

function FillColorHandlerFunction(selection, isDark){
    let select = selection.items;
    colorList = [], colorNodeList = [];
    //fillList = [], fillNodeList = [];
    
    select.forEach((root)=>{
        traverseChildrenToFindFill(root);
        outputColorDetails(colorList, selection, isDark);
        colorList = [], colorNodeList = [];
    });
    
    //outputNodeDetails(fillList, fillNodeList);
}

function traverseChildrenToFindFill(root){
    if (root.opacity != 0 && root.visible){
        if (root.isContainer && root.constructor.name != "BooleanGroup"){
            root.children.forEach((children,i)=>{
                traverseChildrenToFindFill(children);
            })
        } else{
            /*
            if (root.fill != null ){
                // 有填充
                fillList.push(root.fill);
                fillNodeList.push(root);
            }*/
            var colorObj = {};
            if (root.fill != null && root.fillEnabled && root.fill.constructor.name == "Color"){
                colorObj['isFill'] = true;
                colorObj['fill'] = root.fill;
                colorObj['fillName'] = findColorName(root.fill);
            } else colorObj['isFill'] = false;
            if (root.stroke != null && root.strokeEnabled){
                colorObj['isStroke'] = true;
                colorObj['stroke'] = root.stroke;
                colorObj['strokeName'] = findColorName(root.stroke);
            } else colorObj['isStroke'] = false;
            colorObj['source'] = root;

            if (colorObj.isFill || colorObj.isStroke) colorList.push(colorObj);
        }
    }
}

// 输出 color 信息
function outputColorDetails(colorList, selection, isDark){
    for (var i = 0; i < colorList.length; i++) {
        let color = colorList[i];
        var bounds = getSymbolPos(color.source);
        bounds.x += i*300;
        bounds.y += 12;
        // console.log(bounds);
        let textColor = new Color("#000000");
        if (isDark) textColor = new Color("#ffffff");
        createColorExample(color, bounds, selection, textColor);
    }
}

// 获取symbol信息
function getSymbolPos(child){
    if (child.symbolId != null){
        // is symbol
        // console.log(child.name);
        // console.log(child.boundsInParent);
        return child.boundsInParent;
    }
    else if (child.parent != null){
        //console.log(child.name);
        return getSymbolPos(child.parent);
    }
}

// 画颜色示意矩形
function createColorExample(colorObj, bound, selection, textColor){
    const newName = new Text();
    newName.text = findTokenLeastName(colorObj.source);
    // console.log(newName);
    newName.styleRanges = [
        {
          length: newName.text.length,
          fontFamily: "苹方-简",
          fill: new Color("#a0a0a0"),
          fontSize: 14
        }
      ];


    const newRect = new Rectangle();
	newRect.width = 16;
	newRect.height = 16;
    newRect.fill = colorObj.fill;
    newRect.stroke = colorObj.stroke;
    

    const newComment = new Text();
    if (colorObj.isFill && colorObj.isStroke){
        newComment.text = "fill:"+ findColorName(colorObj.fill) + "\n" + "stroke:" + findColorName(colorObj.stroke);
    }
    else if (colorObj.isFill) newComment.text = findColorName(colorObj.fill);
    else if (colorObj.isStroke) newComment.text = findColorName(colorObj.stroke);
    // console.log(newComment);
    newComment.styleRanges = [
        {
          length: newComment.text.length,
          fontFamily: "苹方-简",
          fontStyle: "Semibold",
          fill: textColor,
          fontSize: 16
        }
      ];

    selection.insertionParent.addChild(newName);
    newName.moveInParentCoordinates(bound.x+bound.width+72, bound.y);
    selection.insertionParent.addChild(newRect);
    newRect.moveInParentCoordinates(bound.x+bound.width+72, bound.y+14);
    selection.insertionParent.addChild(newComment);
    newComment.moveInParentCoordinates(bound.x+bound.width+72+28, bound.y+14+13);
    


    selection.items = [newName, newRect, newComment];
    commands.group();

}



function findTokenLeastName(source){
    if (source.hasDefaultName == false){
        return source.name;
    }
    switch (source.constructor.name){
        case "BooleanGroup":
            return "icon";
            break;
        case "Path":
            return "icon";
            break;
        case "Ellipse":
            return "icon";
            break;
        case "Rectangle":
            return "background";
            break;
        case "Text":
            return "text";
            break;
        case "Line":
            return "cursor";
            break;
        default:
            return "not supported"
    }
}

// 寻找有效路径信息
function findTokenPath(child){
    if (child.parent != null && child.parent.symbolId == null){
        findTokenPath(child.parent);
    }
    if (child.hasDefaultName == false && child.isContainer){
        //console.log(child.name);
        path.push(child.name);
    }
    if (child.parent.symbolId != null){
        //console.log(child.parent.name);
        path.push(child.parent.name);
    }
}

// 输出路径信息
function outputNodeDetails(colorList, nodeList){
    for (var i = 0; i < colorList.length; i++) {
        let color = colorList[i];
        let node = nodeList[i];
        outputParentDetails(node);
        let colorName = findColorName(color);
        console.log(" color: " + colorName + "\n");
    }
}

// 输出路径信息
function outputParentDetails(child){
    if (child.parent != null){
        console.log(child.name);
        outputParentDetails(child.parent);
    }
}

//找到对应 assets 的颜色名
function findColorName(color){
    var assets = require("assets"), allColors = assets.colors.get();
    for (let i = 0; i < allColors.length; i++){
        if (JSON.stringify(allColors[i].color) == JSON.stringify(color)) return allColors[i].name;
    }
    return "No name";
}

async function showAlert(newColorNum, renameColorNum){
    await alert(newColorNum + " colors has been added to Assets", //[1]
    "And " + renameColorNum + " existed colors has been renamed.",
    "Go to Assets Panel to see your colors :D"); //[2]
}

async function successAlert(description){
    await alert("success!", //[1]
    description); //[2]
}

async function ColorSaveHandlerFunction(selection){
    //console.log(allColors);
    let colorChart = generateColorInCSV();
    
    const newFile = await fs.getFileForSaving("color-asset.csv");
    await newFile.write(colorChart);

    
 
}

function generateColorInCSV(){
    var assets = require("assets"), allColors = assets.colors.get();
    let colorChart = "name, hex, rgba\r\n";
    for (var i = allColors.length-1; i >= 0 ; i--){
        colorChart += allColors[i].name + "," 
                    + allColors[i].color.toHex(true) + ","
                    + "\"("
                    + allColors[i].color.toRgba().r + ","
                    + allColors[i].color.toRgba().g + ","
                    + allColors[i].color.toRgba().b + ","
                    + (allColors[i].color.toRgba().a/255).toFixed(2) 
                    + ")\""
                    + "\r\n";
    }
    return colorChart;
}

async function ComponentColorSaveHandlerFunction(selection){
    //console.log(allColors);
    let select = selection.items;
    colorList = [], colorNodeList = [];
    tokenChart = "token, color\r\n";
    //fillList = [], fillNodeList = [];
    select.forEach((root)=>{
        if(root.symbolId != null)
            traverseChildrenToFindFill(root);
    });
    for (var i = 0; i < colorList.length; i++) {
        generateTokenInCSV(colorList[i]);
    }
    //console.log(tokenChart);
    //const newFile = await fs.getFileForSaving("token-asset.csv");
    //await newFile.write(tokenChart);
 
}

function generateTokenInCSV(colorObj){
    
    path = [];
    findTokenPath(colorObj.source);
    let tokenName = "", colorName;
    for (var i = 0; i < path.length; i++){
        tokenName += path[i] + "-";
    }
    tokenName += findTokenLeastName(colorObj.source) + "-color";
    colorName = colorObj.isFill? colorObj.fillName:colorObj.strokeName;
    tokenChart += tokenName + "," + colorName + "\r\n";
    console.log(colorName);

}

function ArtboardGenerateHandlerFunction(selection, rootNode){
    var assets = require("assets"), allColors = assets.colors.get();
    console.log(allColors);
    rootNode.children.some((childNode)=>{
        if (childNode.name == "colorAssets"){
            childNode.removeFromParent()
            return true;
        }
    })
    
    const newBoard = new Artboard();
    newBoard.name = "colorAssets";
    newBoard.width = 600;
    newBoard.height = 80*(allColors.length + 3);
    newBoard.fill = new Color("#ffffff");
    rootNode.addChild(newBoard, 0);
    newBoard.moveInParentCoordinates(-20000, -20000);
    adaptColorList(newBoard, selection, allColors);
    successAlert("check the selection artboard to see");
    
/*
    */
    
}

function adaptColorList(artboard, selection, colorList){
    selection.items = [artboard];
    
    let x = 100, y = 120;
    const newName = new Text();
    newName.text = "Color Assets";
    newName.styleRanges = [
        {
          length: newName.text.length,
          fill: new Color("#000000"),
          fontStyle: "Semibold",
          fontSize: 36
        }
      ];

    selection.insertionParent.addChild(newName);
    newName.moveInParentCoordinates(x, y);

    y = artboard.height - 60;

    for (var i = 0; i < colorList.length ; i++){
        y -= 80;
        generateColorLayer(colorList[i], x, y, selection);
    }
}

function generateColorLayer(color, x, y, selection){
    const newRect = new Rectangle();
	newRect.width = 32;
	newRect.height = 32;
    newRect.fill = color.color;
    newRect.stroke = null;
    newRect.name = color.name;

    selection.insertionParent.addChild(newRect);
    newRect.moveInParentCoordinates(x, y);

    const newName = new Text();
    newName.text = color.name;
    newName.styleRanges = [
        {
          length: newName.text.length,
          fill: new Color("#666666"),
          fontStyle: "Semibold",
          fontSize: 16
        }
      ];

    selection.insertionParent.addChild(newName);
    newName.moveInParentCoordinates(x+48, y+12);

    const newHex = new Text();
    const alpha = (color.color.toRgba().a/255).toFixed(2);
    if (alpha == 1.00) 
        newHex.text = color.color.toHex(true);
    else newHex.text = color.color.toHex(true) + " " + alpha;
    newHex.styleRanges = [
        {
          length: newHex.text.length,
          fill: new Color("#a0a0a0"),
          fontSize: 12
        }
      ];

    selection.insertionParent.addChild(newHex);
    newHex.moveInParentCoordinates(x+48, y+30);

}

/* -------------------------------------------------------------------------- */
/*                                    panel                                   */
/* -------------------------------------------------------------------------- */
let panel;
const {editDocument} = require("application");


function create(){
    const html=`
    <style>
        div {
            margin-bottom: 20px;
        }
        .wrap { flex-wrap: wrap; }
        .show {
            display: block;
        }
        .hide {
            display: none;
        }
        #warning{
            border: 1px dashed #ddd;
            padding: 10px 10px;
            margin: 8px;
            text-align: center;
        }
    </style>
    <body>
        <h3>从默认色板开始 Start from default</h3>
        <div class="row warp">
            <button uxp-variant="cta" id="importDefaultColor">IMPORT DEFAULT COLORS</button>
        </div>
        <h3>使用你自己的色板 Use your JSON</h3>
        <div class="row warp">
            <button uxp-variant="primary" id="saveCurrentToJSON">Save current</button>
            <button uxp-variant="secondary" id="importFromJSON">Import</button>
        </div>
        <h3>附加功能 Extra</h3>
        <div type="warp">
            <button uxp-variant="action" id="generateArtboard">Generate Artboard</button>
            <button uxp-variant="action" id="saveToCSV">Save as CSV</button>
        </div>
        <div>
            <h3>色彩使用检查 Color Inspector</h3>
            <div id="warning">
                <label>select something first</label>
            </div>
            <form>

                <button uxp-variant="action"  id="inspectOnLight">light</button>
                <button uxp-variant="action"  id="inspectOnDark">dark</button>
            </form>
        </div>
        
        <div class="row warp"></div>
        
        
    </body>
    `;

    function importDefaultColor(){
        editDocument(
            {editLabel: "import default color asset"},
            importAssetFromPlugin
        )
    }
    function saveCurrentToJSON(){
        editDocument(
            {editLabel: "save current to JSON"},
            saveCurrentAsset
        )
    }
    function importFromJSON(){
        editDocument(
            {editLabel: "import color asset from JSON"},
            importAssetFromFile
        )
    }
    function generateArtboard(){
        editDocument(
            {editLabel: "generate color asset artboard"},
            ArtboardGenerateHandlerFunction
        )
    }
    function saveToCSV(){
        editDocument(
            {editLabel: "generate color asset artboard"},
            ColorSaveHandlerFunction
        )
    }
    function inspectColors(isDark){
        editDocument(
            {editLabel: "generate color asset artboard"},
            (selection)=>{FillColorHandlerFunction(selection, isDark);}
        )
    }

    panel = document.createElement("div");
    panel.innerHTML = html;

    panel.querySelector("#importDefaultColor").addEventListener("click", importDefaultColor);
    panel.querySelector("#saveCurrentToJSON").addEventListener("click", saveCurrentToJSON);
    panel.querySelector("#importFromJSON").addEventListener("click", importFromJSON);
    panel.querySelector("#generateArtboard").addEventListener("click", generateArtboard);
    panel.querySelector("#saveToCSV").addEventListener("click", saveToCSV);
    panel.querySelector("#inspectOnLight").addEventListener("click", ()=>{inspectColors(false);});
    panel.querySelector("#inspectOnDark").addEventListener("click", ()=>{inspectColors(true)});
    
    return panel;
}

function show(event) {
	if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
	/*
	const { Rectangle } = require("scenegraph"); // [2]
*/
	const form = document.querySelector("form"); // [3]
	const warning = document.querySelector("#warning"); // [4]
	

	if (!selection || !(selection.items[0])) { // [5]
		form.className = "hide";
		warning.className = "show";
	} else {
		form.className = "show";
		warning.className = "hide";
	}
	
}



module.exports = {
    panels: {
		showPanel: {
			show,
			update
		}
	}
    // commands: {
    //     importAsset: importAssetFromFile,
    //     saveAsset: saveCurrentAsset,
    //     addColors: ColorAddHandlerFunction,
    //     saveColors: ColorSaveHandlerFunction,
    //     generateArtboard: ArtboardGenerateHandlerFunction,
    //     importDefaultColor: importAssetFromPlugin
    //     //sortColors: SortColorAssetsHandlerFunction,
    //     //outputColors: OutColorAssetsHandlerFunction,
    //     //fillColors: FillColorHandlerFunction,
    //     //saveComponentColors: ComponentColorSaveHandlerFunction
    // }
};
