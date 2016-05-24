/* global describe,beforeEach,afterEach,before,it:false */
import environment from './env/client';
import { equal } from 'assert';
import sinon from 'sinon';
import Main from '../src/js/modules/main/main';

describe('Main view', () => {
  let instance = null;
  let events = {};
  let app = {};
  let sessionSave = null;

  function eventsMock(namespace) {
    const api = {
      on: (ev, fn, cx) => {
        events[namespace][ev] = fn.bind(cx);
        return api;
      },
    };

    events[namespace] = {};
    return api;
  }

  function session() {
    return {
      objects: () => ({
        ...eventsMock('session'),
      }),
      save: sessionSave,
    };
  }

  function appMock() {
    return {
      options: {
        selectPanoMode: true,
      },
      data: {
        session: session(),
      },
      ...eventsMock('app'),
    };
  }

  function preparation() {
    sessionSave = sinon.spy();
    app = appMock();
    instance = new Main({ app });
  }

  function cleanup() {
    instance.remove();
  }

  before(cb => environment.then(() => cb()));
  beforeEach(preparation);
  afterEach(cleanup);

  it('Should render base DOM elements', () => {
    const find = (selector) => instance.$el.find(selector).length;

    equal(find('.layers-menu'), 1);
    equal(find('.plantingjs-toolbox'), 1);
    equal(find('.plantingjs-overlay'), 1);
    equal(find('.plantingjs-google'), 1);
    equal(find('.plantingjs-modal'), 1);
  });

  it('Should call session.save whenever user clicked save button', () => {
    instance.submit.el.click();
    equal(sessionSave.called, true);
  });

  it('Should return modal DOM element - #getModal', () => {
    equal(instance.getModal().hasClass('plantingjs-modal'), true);
  });
});
