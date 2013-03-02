/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * 
 */
function clusterMean(cluster) {
  
  var 
    sum_x = 0,
    sum_y = 0;
  for (var i = 0; i < cluster.x.length; i++) {
    sum_x += cluster.x[i];
    sum_y += cluster.y[i];
  }
  
  return {
    x : sum_x / cluster.x.length,
    y : sum_y / cluster.y.length
  };
};

/*
 * 
 */
function distanceBetweenPoints(point1, point2) {
  //console.log(Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)));
  return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
}

/*
 * 
 */
function selectCluster(point, clusters) {
  
  var 
    minClusterDist = distanceBetweenPoints(point, clusters[0].centroid),
    clusterIndex = 0;
  
  for (var i = 1; i < clusters.length; i++) {
    if (minClusterDist > distanceBetweenPoints(point, clusters[i].centroid)) {
      minClusterDist = distanceBetweenPoints(point, clusters[i].centroid);
      clusterIndex = i;
    }
  }
  
  return clusterIndex;
}

/*
 * 
 * @returns {undefined}
 */
function clusterRadius(cluster) {
  var radius_sum = 0;
  
  for (var i = 0; i < cluster.x.length; i++) {
    radius_sum = radius_sum + distanceBetweenPoints(cluster.centroid, {
      x : cluster.x[i],
      y : cluster.y[i]
    });
  }
  
  return radius_sum / cluster.x.length;
}

/*
 * 
 */
exports.kmeans_2d = function(data) {

  // confirm data object formatted properly
  if (data.x === undefined || data.y === undefined ||
            data.maxIter === undefined || data.centers === undefined) {
    throw  {
        id : 501,
        title : 'cluster data error',
        message : 'Undefined fields in transmitted kmeans data object.'
      };
  } else if (data.x.length !== data.y.length) {
    throw  {
        id : 502,
        title : 'cluster data error',
        message : 'X and Y data set differ in size.'
      };
  }
  
  clusters = [];
  
  // initialize my clusters
  for (var i = 0; i < data.centers; i++) {
    clusters[i] = {
      x : [],
      y : [],
      centroid : {
        x : data.x[i],
        y : data.y[i]
      }, 
      radius : 0
    };
  }
  
  // create initial clusters
  for (var i = 0; i < data.x.length; i++) {
    var pointClusterIndex = selectCluster( {
      x : data.x[i],
      y : data.y[i]
    }, clusters);
    clusters[pointClusterIndex].x.push(data.x[i]);
    clusters[pointClusterIndex].y.push(data.y[i]);
  }
  
 
  // clustering loop
  var numIter = 0;
  while (numIter < data.maxIter) {
    
    // select new centroids
    for (var i = 0; i < clusters.length; i++) {
      clusters[i].centroid = clusterMean(clusters[i]);
      
      // reset cluster sets
      clusters[i].x = [];
      clusters[i].y = [];
    }
    
    // create new clusters
    for (var i = 0; i < data.x.length; i++) {
      var pointClusterIndex = selectCluster( {
        x : data.x[i],
        y : data.y[i]
      }, clusters);
      clusters[pointClusterIndex].x.push(data.x[i]);
      clusters[pointClusterIndex].y.push(data.y[i]);
    }
    
    numIter++;
  }
  
  // set the cluster radius
  for (var i = 0; i < clusters.length; i++) {
    clusters[i].radius = clusterRadius(clusters[i]);
  }
  
  console.log(JSON.stringify(clusters));
  return clusters;
};

