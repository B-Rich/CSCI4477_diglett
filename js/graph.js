/* 
 * Generate a random dataSet for testing 
 */
function createDataSet(colNum, rowNum) {
    dataSet = new Array();
    for (var c=0; c<colNum; c++) {
        var newColumn = new Array();
        for (var r=0; r<rowNum; r++) {
            newColumn.push( (Math.random()*1000) );
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
    for(var i = 0; i < dataSet[colX].length; i++) {
       dat.push([(dataSet[colX])[i], (dataSet[colY])[i]]);
    }
    return dat;
}

/* 
 * Refresh the graph block with the user's desired table 
 */
function updateScreen() {
    var dat = selectData();
    $.plot($('#dm-graph'), [{
            data: dat,
            points:{show:true},
            grid: { minBorderMargin: 10}}]
    );
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

    createDataSet(100,100);
    formatInterface();
    updateScreen();
}

/* 
 * Test function
 */
function test_selectData() {
    
    dataSet = createDataSet(10, 10);
    
    console.log(JSON.stringify(dat));
}
//test_selectData();