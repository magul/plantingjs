import { Model } from '../../core';

export default Model.extend({
  defaults: {
    x: null,
    y: null,
    scale: null,
    layerIndex: null,
    projection: 0,
    width: 0,
    height: 0,
    userActivity: false,
  },

  getProjection() {
    return this.manifesto()
      .getProjectionsFor(this.get('objectId'))[
        this.get('currentProjection') || this.get('projection') || 0
      ];
  },

  setProjection(at_) {
    const projections = this.get('projections');
    let at = at_ > projections.length ? 0 : at_;
    at = at < 0 ? projections.length : at;
    this.set('projection', at);
  },

  setPosition({ x, y, width, height }) {
    const props = {
      x: x / width,
      y: (y - (height / 2)) / width,
    };

    this.set(props);
  },

  getPosition({ width, height }) {
    return {
      x: width * this.get('x'),
      y: height / 2 + this.get('y') * width,
    };
  },
});
