/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function graphData() {
    
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);
    
    $("#dm-graph").width('600px');
    $("#dm-graph").height('400px');
    
    console.log('width : ' + $("#dm-graph").width());
    
    $.plot($("#dm-graph"), [
        {
            data: d1,
            lines: { show: true, fill: true }
        }]);
}


graphData();
