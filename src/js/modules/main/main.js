import { View } from '../../core';
import Const from '../../const';
import { submitButton, selectButton, initButton } from './main-view-buttons';
import { isFunction } from 'lodash';

const IS_PLANTING_CLASS = 'plantingjs-is-planting';
const MODAL_CLASS = 'plantingjs-modal';

/**
 * @private
 */
function handleSelectPano() {
  const { onSelectPano } = this.app.options;
  const panoData = this.manifesto()
    .pick('lat', 'lng', 'pitch', 'heading', 'zoom');

  if (isFunction(onSelectPano)) {
    onSelectPano(panoData);
  } else {
    throw Error('onSelectPano must be a function');
  }
}

function handleInitPlanting() {
  this.app.trigger(Const.Event.START_PLANTING);
}

function handlePlantedObjectsChanged(model, collection) {
  if (this.app.getState() !== Const.State.VIEWER) {
    this.submit.model.set('visible', collection.length > 0);
  }
}

function handleMapVisibleChange(visible) {
  if (this.app.getState() !== Const.State.VIEWER) {
    this.start.model.set({ visible });
  }
}

function handleStartPlanting() {
  this.$el.toggleClass(IS_PLANTING_CLASS, true);
  this.start.model.set('visible', false);
}

function handleStateChange(state) {
  this.$el.children().attr('data-state', state);
}

/**
 * @public
 */
export default View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  $proxy: null,

  initialize() {
    this.render();
    this.$proxy = this.$el.children();
    this.submit = submitButton({ click: this.onClickSubmit }, this);
    this.session()
        .objects()
        .on('add remove', handlePlantedObjectsChanged, this);

    if (this.app.options.selectPanoMode) {
      this.start = selectButton({ click: handleSelectPano }, this);
    } else {
      this.start = initButton({ click: handleInitPlanting }, this);
    }

    this.$proxy.append(this.submit.$el, this.start.$el);
    this.app
      .on(Const.Event.VISIBLE_CHANGED, handleMapVisibleChange, this)
      .on(Const.Event.START_PLANTING, handleStartPlanting, this)
      .on(Const.Event.STATE_CHANGED, handleStateChange, this);
  },

  render() {
    this.$el.html(this.template());
  },

  onClickSubmit(event) {
    /**
     * @todo
     * Show submit popup. For now just save session.
     */
    event.preventDefault();
    this.session().save();
  },

  getModal() {
    return this.$el.find(`.${MODAL_CLASS}`);
  },
});
