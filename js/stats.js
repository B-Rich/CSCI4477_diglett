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
      clusterData.push([cluster.x[p], cluster.y[p]]);
    }
    console.log(clusterData);
    allData.push({data: clusterData});
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

var dataToTreeDataPoints = function(cluster) {
  var pointSet = [];
  for (var i = 0; i < cluster.x.length; i++) {
    pointSet.push({
      label: 'point ' + i,
      children: [
        {label: 'x : ' + cluster.x[i]},
        {label: 'y : ' + cluster.y[i]},
        {label: 'z : ' + cluster.z[i]}
      ]
    });
  }
  return pointSet;
};

var dataToTreeClusterDistances = function(cluster) {
  var distSet = [];
  for (var i = 0; i < cluster.dist.length; i++) {
    distSet.push({label: i + " : " + cluster.dist[i]});
  }
  return distSet;
};

var buildTreeKmeansData = function(kmData) {

  var
          treeData = [],
          totalWithinSS = 0;

  for (var i = 0; i < kmData.clusters.length; i++) {
    totalWithinSS += kmData.clusters[i].withinss;
  }

  treeData.push({
    label: 'Stats',
    children: [
      { label: 'DB Index : ' + kmData.DBI },
      { label: 'Total Within SS : ' + totalWithinSS }
    ]
  });

  for (var i = 0; i < kmData.clusters.length; i++) {
    treeData.push({
      label: 'Cluster ' + i,
      children: [
        {
          label: 'Centroid',
          children: [
            {label: 'x : ' + kmData.clusters[i].centroid.x},
            {label: 'y : ' + kmData.clusters[i].centroid.y},
            {label: 'z : ' + kmData.clusters[i].centroid.z}
          ]
        },
        {
          label: 'Cluster Distances',
          children: dataToTreeClusterDistances(kmData.clusters[i])
        },
        {
          label: 'Radius : ' + kmData.clusters[i].radius
        },
        {
          label: 'Within SS : ' + kmData.clusters[i].withinss
        },
        {
          label: 'Points : ',
          children: dataToTreeDataPoints(kmData.clusters[i])
        }
      ]
    });
  }

  return treeData;
};

var initTree = true;

socket.on("kmeans cluster", function(kmData) {
  console.log('On : kmeans cluster');
  
  if ($("#dm-stats ul").length === 0) {

    $('#dm-stats').tree({
      data: buildTreeKmeansData(kmData),
      autoOpen: false,
      dragAndDrop: false
    });
    initTree = false;
  } else {
    $('#dm-stats').tree('loadData', buildTreeKmeansData(kmData));
  }

  graphClusters(kmData.clusters);
});
