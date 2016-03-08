var merge = require('ngraph.merge');

module.exports = initOptions;

function initOptions(options) {
  options = options || {};

  /**
   * Physics settings for the inside cluster layout
   */
  options.localPhysics = merge(options.localPhysics, {
    springLength : 80,
    springCoeff : 0.0002,
    gravity: -1.2,
    theta : 0.8,
    dragCoeff : 0.02
  });

  /**
   * Physics settings for the global, cluster level graph
   */
  options.globalPhysics = options.globalPhysics || {};

  return options;
}
