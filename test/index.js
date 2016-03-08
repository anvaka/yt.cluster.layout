var createLayout = require('../');
var generate = require('ngraph.generators');
var test = require('tap').test;

test('it can layout graph', function(t) {
  var graph = generate.grid(10, 10);

  var layout = createLayout(graph);
  // just for the sake of the test we will be splitting graph into two clusters
  var cluster1 = [];
  var cluster2 = [];
  graph.forEachNode(function(node) {
    if (node.id % 2 === 0) cluster1.push(node.id);
    else cluster2.push(node.id);
  });

  layout.addCluster(cluster1);
  layout.addCluster(cluster2);

  layout.run();

  layout.forEachCluster(function(cluster, idx) {
    t.ok(cluster.positions, idx + ' has defined position');
    testBounds(cluster, 'Cluster ' + idx + ' has correct bounds');
  });

  t.end();

  function testBounds(cluster, message) {
    var b = cluster.bounds;
    Object.keys(cluster.positions).forEach(function(nodeId) {
      var node = cluster.positions[nodeId];
      t.ok(b.x1 <= node.x && node.x <= b.x2 &&
           b.y1 <= node.y && node.y <= b.y2, message + '\n' + 
          'for node ' + nodeId + ' ' + JSON.stringify(node) + ' is outside of bounds: ' + JSON.stringify(b))
    });
  }
});

