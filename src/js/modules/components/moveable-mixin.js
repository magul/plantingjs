export const MOVE_END = 'moveend';
export const MOVE_START = 'movestart';
const PREVENT_SELECT_CLASS = 'noselect';

function moveableMixin() {
  let isDragging = false;
  let element;
  const offset = {};
  const position = { x: 0, y: 0 };
  const prepare = (cx, cy) => {
    const { left, top } = element.getBoundingClientRect();

    offset.x = cx - left;
    offset.y = cy - top;
    element.style.willChange = 'transform';
  };

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
        element.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`;
      }
    },

    onMouseup() {
      isDragging = false;
      this.trigger(MOVE_END, position);
      element.style.willChange = 'auto';
    },

    onMousedown({ clientX, clientY }) {
      const { left, top } = element.getBoundingClientRect();
      offset.x = clientX - left;
      offset.y = clientY - top;
      element.style.willChange = 'transform';
      isDragging = true;
      this.trigger(MOVE_START);
    },
  };
}

export default moveableMixin;
