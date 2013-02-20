/* 
 * Glavin Wiechert
 * Feb 20, 2013
 */

function displayFieldList() {
    // Use the global data set, dataSet
    
    /* Format:    
        <select id="x-axis-select">
            <option value="1" selected="selected">F1</option>
            <option value="2">F2</option>
            <option value="3">F3</option>
            <option value="4">F4</option>
        </select>
     */
    
    // Create the initial jQuery object
    /*
    var xAxisSelect = $('<ul />', { 'id':"x-axis-select", 'class':"axis-select" } );
    var yAxisSelect = $('<ul />', { 'id':"y-axis-select", 'class':"axis-select" } );
    */
    var xAxisSelect = $('<select />', { 'id':"x-axis-select" } );
    var yAxisSelect = $('<select />', { 'id':"y-axis-select" } );
    
   
    // Add list items
    for (var c=0; c<dataSet.length; c++)
    {
        /*
        xAxisSelect.append( 
                $('<li />', {})
                .append( $('<input />', {'type':'radio', 'name':'x-axis' } )
                .attr(((c===0)?"checked":"not-checked"), ((c===0)?"checked":"")) )
                .append("F"+(c+1)) );
        yAxisSelect.append(
                $('<li />', {})
                .append( $('<input />', {'type':'radio', 'name':'y-axis' } ) 
                .attr(((c===1)?"checked":"not-checked"), ((c===1)?"checked":"")) )
                .append("F"+(c+1)) );
        */
        xAxisSelect.append(
                $('<option />', { 'value': c })
                .append("F"+(c+1)) 
                .attr(((c===0)?"selected":"not-selected"), ((c===0)?"selected":"")) );
        yAxisSelect.append(
                $('<option />', { 'value': c })
                .append("F"+(c+1)) 
                .attr(((c===1)?"selected":"not-selected"), ((c===1)?"selected":"")) );
        
    }
    
    // Replace original with new field list
    /*
    $("ul#x-axis-select").replaceWith(xAxisSelect);
    $("ul#y-axis-select").replaceWith(yAxisSelect);    
    */
    $("select#x-axis-select").replaceWith(xAxisSelect);
    $("select#y-axis-select").replaceWith(yAxisSelect);       
}

function testDisplayFieldList() {
    dataSet = [["F1"],["F2"],["F3"],["F4"],["F5"],["F1"],["F2"],["F3"],["F4"],["F5"]];
    displayFieldList();
}


