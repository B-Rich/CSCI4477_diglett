/* 
 * Dawson Reid
 */

var k3d = {
  /*
   * 
   * @param {type} cluster
   * @returns {clusterMean.Anonym$0}
   */
  clusterMean: function(cluster) {
    var
            sum_x = 0,
            sum_y = 0,
            sum_z = 0;
    for (var i = 0; i < cluster.x.length; i++) {
      sum_x += cluster.x[i];
      sum_y += cluster.y[i];
      sum_z += cluster.z[i];
    }

    return {
      x: sum_x / cluster.x.length,
      y: sum_y / cluster.y.length,
      z: sum_z / cluster.z.length
    };
  },
  /*
   * 
   * @param {type} point1
   * @param {type} point2
   * @returns {@exp;Math@call;sqrt}
   */
  distance: function(point1, point2) {
    return Math.sqrt(
            (point1.x - point2.x) * (point1.x - point2.x) +
            (point1.y - point2.y) * (point1.y - point2.y) +
            (point1.z - point2.z) * (point1.z - point2.z)
            );
  },
  /*
   * 
   * @param {type} point
   * @param {type} cluster
   * @returns {Number}
   */
  selectCluster: function(point, clusters) {
    var
            minClusterDist = this.distance(point, clusters[0].centroid),
            clusterIndex = 0;
    for (var i = 1; i < clusters.length; i++) {
      if (minClusterDist > this.distance(point, clusters[i].centroid)) {
        minClusterDist = this.distance(point, clusters[i].centroid);
        clusterIndex = i;
      }
    }

    return clusterIndex;
  },
  /*
   * 
   * @param {type} cluster
   * @returns {@exp;cluster@pro;x@pro;length|clusterRadius.radius_sum}
   */
  clusterRadius: function(cluster) {
    var radius_sum = 0;
    for (var i = 0; i < cluster.x.length; i++) {
      radius_sum = radius_sum + this.distance(cluster.centroid, {
        x: cluster.x[i],
        y: cluster.y[i],
        z: cluster.z[i]
      });
    }

    return radius_sum / cluster.x.length;
  },
  /*
   * 
   * @param {type} cluster
   * @returns {undefined}
   */
  clusterWithinSS: function(cluster) {
    var ss = 0;
    for (var i = 0; i < cluster.x.length; i++) {
      ss += Math.pow(this.distance(cluster.centroid, {
        x: cluster.x[i],
        y: cluster.y[i],
        z: cluster.z[i]
      }), 2);
    }
    return ss;
  },
  /*
   * 
   * @param {type} clusters
   * @returns {undefined}
   */
  daviesBouldinIndex: function(clusters) {

    var DBI = 0;

    for (var i = 0; i < clusters.length; i++) {
      var r = [];
      for (var j = 0; j < clusters.length; j++) {
        r.push((clusters[i].dist[j] === 0) ?
                0 : (clusters[i].radius + clusters[j].radius) / clusters[i].dist[j]);
      }
      DBI += Math.max.apply(null, r);
    }

    return DBI / clusters.length;
  }
}

/*
 * 
 */
module.exports.kmeans = function(data) {

  // confirm data object formatted properly
  if (
          data.x === undefined ||
          data.y === undefined ||
          data.z === undefined ||
          data.maxIter === undefined ||
          data.centers === undefined) {
    throw  {
      id: 501,
      title: 'cluster data error',
      message: 'Undefined fields in transmitted kmeans data object.'
    };
  } else if (data.x.length !== data.y.length || data.y.length !== data.z.length) {
    throw  {
      id: 502,
      title: 'cluster data error',
      message: 'X, Y, or Z data set differ in size.'
    };
  }

  var clusters = [];
  // initialize my clusters
  for (var i = 0; i < data.centers; i++) {
    clusters[i] = {
      x: [],
      y: [],
      z: [],
      centroid: {
        x: data.x[i],
        y: data.y[i],
        z: data.z[i]
      },
      radius: 0
    };
  }

  // create initial clusters
  for (var i = 0; i < data.x.length; i++) {

    var pointClusterIndex = k3d.selectCluster({
      x: data.x[i],
      y: data.y[i],
      z: data.z[i]
    }, clusters);
    clusters[pointClusterIndex].x.push(data.x[i]);
    clusters[pointClusterIndex].y.push(data.y[i]);
    clusters[pointClusterIndex].z.push(data.z[i]);
  }

  // clustering loop
  for (var numIter = 0; numIter < data.maxIter; numIter++) {

    // select new centroids
    for (var i = 0; i < clusters.length; i++) {
      clusters[i].centroid = k3d.clusterMean(clusters[i]);

      // reset cluster sets
      clusters[i].x = [];
      clusters[i].y = [];
      clusters[i].z = [];
    }

    // create new clusters
    for (var i = 0; i < data.x.length; i++) {
      var pointClusterIndex = k3d.selectCluster({
        x: data.x[i],
        y: data.y[i],
        z: data.z[i]
      }, clusters);
      clusters[pointClusterIndex].x.push(data.x[i]);
      clusters[pointClusterIndex].y.push(data.y[i]);
      clusters[pointClusterIndex].z.push(data.z[i]);
    }
  }

  // set statistics per cluster
  for (var i = 0; i < clusters.length; i++) {

    // radius
    clusters[i].radius = k3d.clusterRadius(clusters[i]);

    // cluster to cluster distances
    clusters[i].dist = [];
    for (var j = 0; j < clusters.length; j++) {
      clusters[i].dist.push(k3d.distance(clusters[i].centroid, clusters[j].centroid));
    }

    // within sum of squares
    clusters[i].withinss = k3d.clusterWithinSS(clusters[i]);
  }

  return {
    DBI: k3d.daviesBouldinIndex(clusters),
    clusters: clusters
  };
};


