import jquery from 'jquery';
import { View } from '../../core';

let EVENT_MOUSEDOWN = false;
const PROJECTION_LENGTH = 10;

export default View.extend({
  action: null,
  mouseDownEvent: null,

  template: require('./tools.hbs'),

  events: {
    'click .icon-trash': 'removeObject',
    /* 'mousedown .icon-resize': 'resizeObject',
    'mousedown .icon-loop': 'rotateObject', */
  },

  initialize: function initialize(opts) {
    this.render();
    this.parentView = opts.parent;
    this.model
      .on('change:userActivity', function(model, userActivity) {
        this.$el.toggleClass('user-active', userActivity);
      }, this);
  },

  render: function render() {
    this.$el.html(this.template());
  },

  removeObject: function removeObject() {
    this.model.collection.remove(this.model);
  }
});


