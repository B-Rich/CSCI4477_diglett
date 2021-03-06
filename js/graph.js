/* 
 * Generate a random dataSet for testing 
 */
function createDataSet(colNum, rowNum) {
  dataSet = [];
  for (var c = 0; c < colNum; c++) {
    var newColumn = [];
    for (var r = 0; r < rowNum; r++) {
      newColumn.push((Math.random() * 1000));
    }
    dataSet.push(newColumn);
  }
  return dataSet;
}

/* 
 * Make an aray of pairs from the columns to be plotted 
 */
function formatData(colX, colY) {
  console.log(arguments.callee.caller.name);

  var dat = [];
  for (var i = 0; i < dataSet[colX].length; i++) {
    dat.push([(dataSet[colX])[i], (dataSet[colY])[i]]);
  }
  return dat;
}

/* 
 * Refresh the graph block with the user's desired table 
 */
function updateScreen() {
  var dat = selectData();
  $.plot($('#dm-graph'), [{data: dat}], {
      points: {show: true},
      xaxis: { autoscaleMargin: 0.01 },
      grid: { hoverable: true, labelMargin: 10, minBorderMargin: 20, borderWidth: 1, borderHeight: 1 }
    });
  // Get the kMeans data
  console.log("Update Stats");
  var maxIter = $("#iterationCount").val();
  var clustersCount = $("#clusterCount").val();
  
  var 
    xCol = $('#x-axis-select option:selected').val(),
    yCol = $('#y-axis-select option:selected').val();
  var dataMinSize = dataSet[xCol].length;
  if (dataMinSize > dataSet[yCol].length) {
    dataMinSize = dataSet[yCol].length;
  }
  dataSet[xCol].splice(dataMinSize);
  dataSet[yCol].splice(dataMinSize);
  
  console.log({
    x: dataSet[xCol], y: dataSet[yCol], 
    maxIter: parseInt(maxIter), centers: parseInt(clustersCount)
  });
  
  socket.emit("kmeans cluster", {
    x: dataSet[xCol], y: dataSet[yCol], 
    maxIter: parseInt(maxIter), centers: parseInt(clustersCount)
  });
  
}

/* 
 * Format the axis-select elements to match the given dataSet
 */
function formatInterface() {
  console.log(arguments.callee.caller.name);
  displayFieldList();
  updateScreen();
}

/* 
 * Format the axis-select elements to match the given dataSet
 */
function genRandData() {
  console.log(arguments.callee.caller.name);

  createDataSet(100, 100);
  formatInterface();
}

/* 
 * Test function
 */
function test_selectData() {

  dataSet = createDataSet(10, 10);

  console.log(JSON.stringify(dat));
}
//test_selectData();