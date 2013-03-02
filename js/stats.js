/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function graphClusters(stats)
{
  var allData = [];
  for (var center in stats) {
    console.log(center);
    var cluster = stats[center];
    console.log(cluster);
    var clusterData = [];
    for (var p = 0; p < cluster.x.length; p++) {
      clusterData.push([ cluster.x[p], cluster.y[p] ]);
    }
    console.log(clusterData);
    allData.push( { data : clusterData } );
    console.log(allData);
  }
  
  console.log(allData);
  $.plot($("#dm-graph"), allData, 
    {       
      points: {show: true},
      grid: {
        hoverable: true,
        borderWidth: 1,
        minBorderMargin: 10
    }
  });

}

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
            { label : 'x : ' + data[i].centroid.x },
            { label : 'y : ' + data[i].centroid.y }
          ]
        },
        {
          label : 'Radius : ' + data[i].radius
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

var initTree = true;
socket.on("kmeans cluster", function(data) { 
  console.log(buildTreeKmeansData(data));  
  if ($("#dm-stats ul").length === 0) {
   
    $('#dm-stats').tree({
      data : buildTreeKmeansData(data),
      autoOpen: false,
      dragAndDrop: false
    });
    initTree = false;
  } 
  $('#dm-stats').tree('loadData', buildTreeKmeansData(data));
  
  graphClusters(data);
});
