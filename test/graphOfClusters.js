var createGraphOfClusters = require('../lib/graphOfClusters.js');
var createGraph = require('ngraph.graph');
var test = require('tap').test;

test('it can create graph of clusters', function(t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(0, 2);
  graph.addLink(2, 3);
  var clustersGraph = createGraphOfClusters(graph, [
    [0, 1], // first cluster
    [3, 2] // second custer
  ]);

  // Nodes 0 and 1 are connected to node 2 which belongs to another cluster.
  t.equals(clustersGraph.getLinksCount(), 1, 'There should be only one link');
  var connection = clustersGraph.hasLink(0, 1);
  t.ok(connection, 'There is a link between first and second cluster');
  t.equals(connection.data, 2, 'The strength of the cluster connection is defined');

  t.end();
});
