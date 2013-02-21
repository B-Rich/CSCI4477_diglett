/* Generate a random data set for testing */
function createDataSet(colNum, rowNum) {
    var dataSet = new Array();
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

function selectData(){
    var colX = $('#x-axis-select option:selected');
    var colY = $('#y-axis-select option:selected');
    return formatData(colX.val(), colY.val());
}

function updateScreen() {
    dataSet = createDataSet(1000, 1000);
    var dat = selectData();
    $.plot($('#dm-graph'), [{
            data:dat,
            points:{show:true}
    }]);
}

function test_selectData() {
    
    dataSet = createDataSet(10, 10);
    
    console.log(JSON.stringify(dat));
}
//test_selectData();