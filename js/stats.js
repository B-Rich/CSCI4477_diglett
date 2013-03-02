/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function displayStats(stats)
{
  var data = [];
  var options;
  var colours = [];


  for (var i = 0; i <= 60; i += 1) {
    d1.push([i, parseInt(Math.random() * 30 - 10)]);
    d2.push([i, parseInt(Math.random() * 30 - 10)]);
  }


  $.plot($("#dm-graph"), [{
      data: d1,
      threshold: {
        below: 5,
        color: "rgb(200, 20, 30)"
      }},
    {
      data: d2,
      threshold: {
        below: -5,
        color: "rgb(250, 0, 0)"
      }}], {
    grid: {
      hoverable: true,
      borderWidth: 1,
      minBorderMargin: 10
    },
    colors: ["rgb(44,55,66)", "rgb(90,2,100)"]
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

socket.on("kmeans cluster", function(data) { 
  
  console.log(buildTreeKmeansData(data));
  
  $('#dm-stats').tree({
      data: buildTreeKmeansData(data),
      autoOpen: false,
      dragAndDrop: false
    }); 
});
