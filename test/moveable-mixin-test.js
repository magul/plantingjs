/* global describe,beforeEach,afterEach,before,it:false */
import environment from './env/client';
import { createMouseEvent } from './utils/events';
import moveableMixin from '../src/js/modules/components/moveable-mixin';
import Backbone from 'backbone';
import sinon from 'sinon';
import { equal } from 'assert';

describe('Moveable mixin', () => {
  let instance;
  const ViewClass = Backbone.View.extend(moveableMixin());

  function preparation() {
    instance = new ViewClass();
    instance.el.getBoundingClientRect = () => ({
      left: 50,
      top: 50,
    });
  }

  function cleanup() {
    instance.remove();
  }

  before(cb => environment.then(() => { cb(); }));
  beforeEach(preparation);
  afterEach(cleanup);

  it('Should listen to mouse events', () => {
    const onMousedown = sinon.spy(instance, 'onMousedown');
    const onMouseup = sinon.spy(instance, 'onMouseup');
    const onMousemove = sinon.spy(instance, 'onMousemove');

    instance.moveableElement();
    instance.el.dispatchEvent(createMouseEvent({ type: 'mousedown' }));
    equal(onMousedown.called, true);
    instance.el.dispatchEvent(createMouseEvent({ type: 'mouseup' }));
    equal(onMouseup.called, true);
    instance.el.dispatchEvent(createMouseEvent({ type: 'mousemove' }));
    equal(onMousemove.called, true);
  });

  it('Should move element after sequence of mousedown and mousemove events',
    () => {
      const spy = sinon.spy();

      instance.moveableElement();
      instance.on('moveend', spy);
      instance.el.dispatchEvent(createMouseEvent({ type: 'mousedown' }));
      instance.el.dispatchEvent(createMouseEvent({
        type: 'mousemove',
        clientX: 100,
        clientY: 100,
      }));
      instance.el.dispatchEvent(createMouseEvent({ type: 'mouseup' }));
      equal(spy.calledWithExactly({ x: 150, y: 150 }), true);
    });
});
