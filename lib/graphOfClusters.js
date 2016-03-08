/**
 * In cluster graph each node is a cluster. Nodes are connected if and only if
 * there exists a connection between elements of each clusters. Number of such
 * connections can be found from link.data property.
 */
var createGraph = require('ngraph.graph');
module.exports = createGraphOfClusters;

function createGraphOfClusters(graph, clusters) {
  var clustersGraph = createGraph({uniqueLinkId: false});
  var clusterToIndex = new Map();
  var nodeToCluster = new Map();

  if (!clusters) return clustersGraph;

  clusters.forEach(addNode);
  clusters.forEach(addConnections);

  return clustersGraph;

  function addNode(cluster, idx) {
    clusterToIndex.set(cluster, idx);
    clustersGraph.addNode(idx);
    cluster.forEach(rememberNode);

    function rememberNode(nodeId) {
      nodeToCluster.set(nodeId, idx);
    }
  }

  function addConnections(cluster, fromId) {
    cluster.forEach(visitNode);

    function visitNode(nodeId) {
      graph.forEachLinkedNode(nodeId, checkNodeConnections, true);
    }

    function checkNodeConnections(otherNode) {
      var toId = nodeToCluster.get(otherNode.id);
      if (toId === undefined) return; // probably not inside original clusters
      if (toId === fromId) return; // no loops
      var link = clustersGraph.hasLink(fromId, toId);
      if (link) {
        link.data += 1;
      } else {
        clustersGraph.addLink(fromId, toId, 1);
      }
    }

  }
}
