var initOptions = require('./lib/initOptions.js');
var createGraphOfClusters = require('./lib/graphOfClusters.js');

var createView = require('ngraph.view');
var createLayout = require('ngraph.forcelayout');

module.exports = createClusterLayout;

function createClusterLayout(graph, options) {
  var clusters = [];
  var localClusterInfo = [];
  options = initOptions(options);

  return {
    forEachCluster: forEachCluster,
    addCluster: addCluster,
    run: run
  };

  function run() {
    clusters.forEach(layoutInsideCluster);
    var clustersGraph = createGraphOfClusters(graph, clusters);
    var globalLayout = layoutClustersGraph(clustersGraph);
    return getNodePositions(globalLayout);
  }

  function getNodePositions(globalLayout) {
    var positions = Object.create(null);
    clusters.forEach(function(cluster, clusterIdx) {
      var globalTransform = globalLayout.getNodePosition(clusterIdx);
      console.log(globalTransform);
      var localPositions = localClusterInfo[clusterIdx].positions;
      Object.keys(localPositions).forEach(function(nodeId) {
        var localPos = localPositions[nodeId];
        positions[nodeId] = {
          x: globalTransform.x * 8 + localPos.x,
          y: globalTransform.y * 8 + localPos.y
        };
      });
    });
    return positions;
  }

  function forEachCluster(cb) {
    localClusterInfo.forEach(cb);
  }

  function layoutClustersGraph(clustersGraph) {
    // TODO: this should remove overlaps
    var layout = createLayout(clustersGraph, options.globalPhysics);
    var iterationsCount = 500; // TODO: This should be a function of a graph
    for (var i = 0; i < iterationsCount; ++i) {
      layout.step();
    }
    return layout;
  }

  function addCluster(nodeIds) {
    clusters.push(nodeIds);
  }

  function layoutInsideCluster(cluster, clusterIndex) {
    var insideClusterGraph = createView(graph, cluster);
    var layout = createLayout(insideClusterGraph, options.localPhysics);
    var iterationsCount = 500; // TODO: This should be a function of a graph
    for (var i = 0; i < iterationsCount; ++i) {
      layout.step();
    }
    var localLayout = gridAlignBodies(layout, 30);
    localClusterInfo[clusterIndex] = localLayout;
  }
}

function gridAlignBodies(layout, gridSize) {
  var positions = Object.create(null);

  layout.forEachBody(function (body, id) {
    positions[id] = {
      x: round(body.pos.x),
      y: round(body.pos.y)
    };
  });

  var bbox = layout.simulator.getBBox();

  return {
    positions: positions,
    bounds: {
      x1: round(bbox.x1),
      y1: round(bbox.y1),
      x2: round(bbox.x2),
      y2: round(bbox.y2)
    }
  };

  function round(x) {
    return Math.round(x/gridSize) * gridSize;
  }
}
