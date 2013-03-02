/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function dataToTreeDataPoints(cluster) {
  
  var pointSet = [];
  
  for (var i = 0; i < cluster.x.length; i++) {
    pointSet.push({ 
      label : 'point ' + i,
      children : [
        { label : 'x : ' + cluster.x[i] },
        { label : 'y : ' + cluster.y[i] }
      ]
    });
  }
  
  return pointSet;
}

function buildTreeKmeansData(data) {
  
  var treeData = [];
  
  for (var i in data) {
    treeData[i] = {
      label : 'Cluster ' + i,
      children : [
        {
          label : 'Centroid',
          children : [
            { label : 'x : ' + data[i].centroid.x.toFixed(6) },
            { label : 'y : ' + data[i].centroid.y.toFixed(6) }
          ]
        },
        {
          label : 'Radius : ' + data[i].radius.toFixed(6)
        },
        {
          label : 'Points : ',
          children : dataToTreeDataPoints(data[i])
        }
      ]
    };
  }
  
  return treeData;
}

socket.on("kmeans cluster", function(data) { 
  
  console.log(buildTreeKmeansData(data));
  
  $('#dm-stats').tree({
      data: buildTreeKmeansData(data),
      autoOpen: false,
      dragAndDrop: false
    }); 
});