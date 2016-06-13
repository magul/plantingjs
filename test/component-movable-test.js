/* global describe,beforeEach,afterEach,before,it:false */
import environment from './env/client';
import { createMouseEvent } from './utils/events';
import { moveableComponent } from '../src/js/modules/components/moveable';
import Backbone from 'backbone';
import sinon from 'sinon';
import { equal } from 'assert';

describe('Moveable component', () => {
  let viewInstance;
  let document;

  function preparation() {
    viewInstance = new Backbone.View();
    viewInstance.el.getBoundingClientRect = () => ({
      left: 50,
      top: 50,
    });
  }

  function cleanup() {
    viewInstance.remove();
  }

  function mouseMoveTo(x, y) {
    viewInstance.el.dispatchEvent(createMouseEvent({ type: 'mousedown' }));
    document.dispatchEvent(createMouseEvent({
      type: 'mousemove',
      clientX: x,
      clientY: y,
    }));
    document.dispatchEvent(createMouseEvent({ type: 'mouseup' }));
  }

  before(cb => environment.then((w) => {
    document = w.document;
    cb();
  }));
  beforeEach(preparation);
  afterEach(cleanup);

  it('Should listen to mousedown event', () => {
    sinon.spy(viewInstance, 'delegate');
    moveableComponent({ view: viewInstance });
    equal(
      viewInstance.delegate
        .calledWith('mousedown', null, sinon.match.func), true);
  });

  it('Should move element after sequence of mousedown and mousemove events',
    () => {
      const spy = sinon.spy();

      moveableComponent({ view: viewInstance });
      viewInstance.on('moveend', spy);
      equal(spy.called, false);
      mouseMoveTo(100, 100);
      equal(spy.calledWithExactly({ x: 150, y: 150 }), true);
    });

  describe('API', () => {
    it('Should return actual position of the element', () => {
      const api = moveableComponent({ view: viewInstance });

      equal(api.getPosition().x, 0);
      equal(api.getPosition().y, 0);
      mouseMoveTo(100, 100);
      equal(api.getPosition().x, 150);
      equal(api.getPosition().y, 150);
    });

    it('Should set position to given coordinates', () => {
      const api = moveableComponent({ view: viewInstance });

      equal(api.getPosition().x, 0);
      equal(api.getPosition().y, 0);
      api.moveTo({ x: 150, y: 150 });
      equal(api.getPosition().x, 150);
      equal(api.getPosition().y, 150);
      equal(viewInstance.el.style.transform, 'translate3d(150px, 150px, 0)');
    });
  });
});
