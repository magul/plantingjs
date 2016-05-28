export const MOVE_END = 'moveend';
export const MOVE_START = 'movestart';
const PREVENT_SELECT_CLASS = 'noselect';

function moveableMixin(viewInstance) {
  let isDragging = false;
  const offset = {};
  const position = { x: 0, y: 0 };
  const element = viewInstance.el;

  element.classList.add(PREVENT_SELECT_CLASS);

  viewInstance.onMousedown = ({ clientX, clientY }) => {
    offset.x = clientX - element.offsetLeft;
    offset.y = clientY - element.offsetTop;
    isDragging = true;
    viewInstance.trigger(MOVE_START);
  };

  viewInstance.onMouseup = () => {
    isDragging = false;
    viewInstance.trigger(MOVE_END, position);
  };

  viewInstance.onMousemove = ({ clientX, clientY }) => {
    if (isDragging) {
      position.x = clientX - offset.x;
      position.y = clientY - offset.y;
      element.style.top = `${position.y}px`;
      element.style.left = `${position.x}px`;
    }
  };

  viewInstance.events = {
    ...viewInstance.events,
    mousedown: 'onMousedown',
    mouseup: 'onMouseup',
    mousemove: 'onMousemove',
  };
  viewInstance.delegateEvents();
}

export default moveableMixin;
