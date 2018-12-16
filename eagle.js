function addPalm(name, colorAttr, classAttr){
  var palmElement = document.createElement("i");
  palmElement.setAttribute("class", classAttr);
  palmElement.setAttribute("style", "color:"+colorAttr);
  name.appendChild(palmElement);
}

function createEagleRow(eagle) {
  var node = document.createElement("div");
  node.setAttribute("class","row");
  node.setAttribute("id", eagle.id);

  var idElement = document.createElement("div");
  idElement.setAttribute("class", "number");
  var idTextNode = document.createTextNode(eagle.id+".");
  idElement.appendChild(idTextNode);
  node.appendChild(idElement);

  var nameElement = document.createElement("div");
  nameElement.setAttribute("class", "name");
  var nameTextNode = document.createTextNode(eagle.firstName + " " + eagle.lastName);
  if (eagle.url != null) {
      var linkNode = document.createElement("a");
      linkNode.setAttribute("target", "_parent");
      linkNode.setAttribute("href", eagle.url);
      linkNode.appendChild(nameTextNode);
      nameElement.appendChild(linkNode);
  } else {
    nameElement.appendChild(nameTextNode);
  }
  if(eagle.borPalms != null && eagle.palms != null)  {
    var borPalms = Math.floor(eagle.borPalms / 3);
    var leftOver = eagle.borPalms % 3;
    var afterPalms = Number.parseInt(eagle.palms) +  Number.parseInt(eagle.borPalms % 3);

    var classAttr = "fa fa-envira";
    for (var i = 0; i < borPalms; i++){
      addPalm(nameElement,"#c0c0c0", classAttr);
    }

    var classAttr2 = "fa fa-leaf";
    var silverPalms = Math.floor(afterPalms/3);
    var rem = afterPalms % 3;
    for (var i = 0; i < silverPalms; i++){
      addPalm(nameElement,"#c0c0c0", classAttr2);
    }
    if (rem == 1) {
      addPalm(nameElement,"#665d1e", classAttr2);
    } else if (rem == 2){
      addPalm(nameElement, "#ffd700", classAttr2);
    }
  }
  else {
    if (eagle.borPalms != null) {
	    var classAttr = "fa fa-envira";
      var silverPalms = Math.floor(eagle.borPalms/3);
      var rem = eagle.borPalms % 3;
      for (var i = 0; i < silverPalms; i++){
        addPalm(nameElement,"#c0c0c0", classAttr);
      }
      if (rem == 1) {
        addPalm(nameElement,"#665d1e", classAttr);
      } else if (rem == 2){
        addPalm(nameElement, "#ffd700", classAttr);
      }
    }
    if (eagle.palms != null) {
	    var classAttr = "fa fa-leaf";
      var silverPalms = Math.floor(eagle.palms/3);
      var rem = eagle.palms % 3;
      for (var i = 0; i < silverPalms; i++){
        addPalm(nameElement,"#c0c0c0", classAttr);
      }
      if (rem == 1) {
        addPalm(nameElement,"#665d1e", classAttr);
      } else if (rem == 2){
        addPalm(nameElement, "#ffd700", classAttr);
      }
    }
  }
  node.appendChild(nameElement);

  var dateElement = document.createElement("div");
  dateElement.setAttribute("class", "date");
  var dateTextNode = document.createTextNode(eagle.date);
  dateElement.appendChild(dateTextNode);
  node.appendChild(dateElement);

  return node;
}
function resetContainerDimensions(numCols){
  var container = document.getElementById("container");
  var col1 = document.getElementById("col1");
  var height = col1.clientHeight;
  if (height < 601)
  height = 601;
  container.style.height = height;
  container.style.width = col1.clientWidth * numCols + 20;
}

function getEaglesPerColumn(numEagles, numCols) {
  var eaglesPerColumn = Math.ceil(numEagles / numCols);
  var heightOfEagleImage = 601;
  var minEaglesPerColumn = Math.ceil(heightOfEagleImage / 22); // 22 is row height

  if (eaglesPerColumn < minEaglesPerColumn)
    eaglesPerColumn = minEaglesPerColumn;

    return eaglesPerColumn;
}
function insertEagles(numCols){
  var eagleList = eagles.data;
  var numEagles = eagleList.length;
  var eaglesPerColumn = getEaglesPerColumn(numEagles, numCols);

  var columnPref = "col";
  var columnIndex = 1;
  var start=1;
  var columnID = columnPref + columnIndex;
  eagleList.forEach(function(item){
    var rowNode = createEagleRow(item);
    if (start > eaglesPerColumn) {
      start=1;
      columnIndex++;
      columnID = columnPref + columnIndex;
    }
    start++;
    document.getElementById(columnID).appendChild(rowNode);
  });
  resetContainerDimensions(numCols);
}

function addColumns(cols) {
  var columnPref = "col";
  var root = document.getElementById("container");
  for (var col = 1; col <= cols; col++) {
    var columnID = columnPref + col;
    var column = document.createElement("div");
    column.setAttribute("id", columnID);
    column.setAttribute("class", "column");
    root.appendChild(column);
  }
}
function clearContainer() {
  var root = document.getElementById("container");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}
var resizeTimeoutId;
var numEagleColumns;

function clearAndRedraw(cols) {
    clearContainer();
    addColumns(cols);
    insertEagles(cols);
}

function getNumCols(numEagles, w) {
  var cols = Math.floor(w / 390);
  if (cols < 1)
    cols = 1;

  var eagles = getEaglesPerColumn(numEagles, cols);
  var eagleCols = Math.ceil(numEagles / eagles);

  if (eagleCols < cols)
    cols = eagleCols;

  return cols;
}
function onResize(event) {
  var w = window.innerWidth - 30;
  cols = getNumCols(eagles.data.length, w);

  if (cols !== numEagleColumns) {
    numEagleColumns = cols;
    clearAndRedraw(numEagleColumns);
  }
}

function sortbyname() {
  console.log("sortbyname");
  var sortButton = document.getElementById("sortByName_dir");
  var order = sortButton.getAttribute("class");
  if (order == "fa fa-sort-alpha-asc") {
    eagles.data.sort(function(a,b){
      if (a.lastName < b.lastName) {
        return -1;
      } else if (a.lastName > b.lastName) {
        return 1;
      } else {
        if (a.firstName < b.firstName) {
          return -1;
        } else if (a.firstName > b.firstName) {
          return 1;
        } else
          return 0;
      }
    })
    sortButton.setAttribute("class", "fa fa-sort-alpha-desc")
  } else {
    eagles.data.sort(function(a,b){
      if (a.lastName > b.lastName) {
        return -1;
      } else if (a.lastName < b.lastName) {
        return 1;
      } else {
        if (a.firstName > b.firstName) {
          return -1;
        } else if (a.firstName < b.firstName) {
          return 1;
        } else
          return 0;
      }
    })
    sortButton.setAttribute("class", "fa fa-sort-alpha-asc")
  }
  clearAndRedraw(numEagleColumns);
}

function sortbydate() {
  var sortButton = document.getElementById("sortByDate_dir");
  var order = sortButton.getAttribute("class");
  if (order == "fa fa-sort-numeric-asc") {
    eagles.data.sort(function(a,b){
      return a.id-b.id;
    })
    sortButton.setAttribute("class", "fa fa-sort-numeric-desc")
  } else {
    eagles.data.sort(function(a,b){
      return b.id-a.id;
    })
    sortButton.setAttribute("class", "fa fa-sort-numeric-asc")
  }
  clearAndRedraw(numEagleColumns);
}

function window_resize(e) {
     window.clearTimeout(resizeTimeoutId);
     resizeTimeoutId = window.setTimeout('onResize();', 100);
}


function doInitialSetup() {
  window.addEventListener('resize',window_resize);
  var w = window.innerWidth;
  numEagleColumns = Math.floor(w / 370);
  if (numEagleColumns < 1)
    numEagleColumns = 1;
  clearContainer();
  addColumns(numEagleColumns);
  insertEagles(numEagleColumns);
}
