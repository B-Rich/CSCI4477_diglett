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
    var dat = [];
    for(var i = 0; i < dataSet[colX].length; i++) {
       dat.push([(dataSet[colX])[i], (dataSet[colY])[i]]);
    }
    return dat;
}

/* 
 * Specify the column selected by the user
 */
function selectData(){
    var colX = $('#x-axis-select option:selected');
    var colY = $('#y-axis-select option:selected');
    return formatData(colX.val(), colY.val());
}

/* 
 * Refresh the graph block with the user's desired table 
 */
function updateScreen() {
    var dat = selectData();
    $.plot($('#dm-graph'), [{
            data:dat,
            points:{show:true}
    }]);
}

/* 
 * Format the axis-select elements to match the given dataSet
 */
function formatInterface() {
    displayFieldList();
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