export const MOVE_END = 'moveend';
const PREVENT_SELECT_CLASS = 'noselect';

function moveableMixin() {
  let isDragging = false;
  let element;
  const offset = {};
  const position = {};

  return {
    moveableElement() {
      element = this.el;
      element.classList.add(PREVENT_SELECT_CLASS);
      this.events = {
        ...this.events,
        mousedown: 'onMouseDown',
        mouseup: 'onMouseUp',
        mousemove: 'onMouseMove',
      };
      this.delegateEvents();
    },

    onMouseMove({ clientX, clientY }) {
      if (isDragging) {
        position.x = clientX - offset.x;
        position.y = clientY - offset.y;
        element.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`;
      }
    },

    onMouseUp() {
      isDragging = false;
      this.trigger(MOVE_END, position);
      element.style.willChange = 'auto';
    },

    onMouseDown({ clientX, clientY }) {
      const { left, top } = element.getBoundingClientRect();
      offset.x = clientX - left;
      offset.y = clientY - top;
      element.style.willChange = 'transform';
      isDragging = true;
    },
  };
}

export default moveableMixin;
