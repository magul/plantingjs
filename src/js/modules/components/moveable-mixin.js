export const MOVE_END = 'moveend';
export const MOVE_START = 'movestart';
const PREVENT_SELECT_CLASS = 'noselect';

function moveableMixin() {
  let isDragging = false;
  const offset = {};
  const position = { x: 0, y: 0 };
  let element;

  return {
    moveableElement() {
      element = this.el;
      element.classList.add(PREVENT_SELECT_CLASS);
      this.events = {
        ...this.events,
        mousedown: 'onMousedown',
        mouseup: 'onMouseup',
        mousemove: 'onMousemove',
      };
      this.delegateEvents();
    },

    onMousemove({ clientX, clientY }) {
      if (isDragging) {
        position.x = clientX - offset.x;
        position.y = clientY - offset.y;
        element.style.top = `${position.y}px`;
        element.style.left = `${position.x}px`;
      }
    },

    onMouseup() {
      isDragging = false;
      this.trigger(MOVE_END, position);
    },

    onMousedown({ clientX, clientY }) {
      offset.x = clientX - element.offsetLeft;
      offset.y = clientY - element.offsetTop;
      isDragging = true;
      this.trigger(MOVE_START);
    },
  };
}

export default moveableMixin;
