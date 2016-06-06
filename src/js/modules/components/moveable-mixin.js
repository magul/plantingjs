export const MOVE_END = 'moveend';
const PREVENT_SELECT_CLASS = 'noselect';

export default function(view) {
  let isDragging = false;
  const offset = {};
  const position = {};

  function onMouseDown({ clientX, clientY }) {
    const { left, top } = view.el.getBoundingClientRect();
    offset.x = clientX - left;
    offset.y = clientY - top;
    view.el.style.willChange = 'transform';
    isDragging = true;
  }

  function onMouseUp() {
    isDragging = false;
    view.el.style.willChange = 'auto';
    view.trigger(MOVE_END, position);
  }

  function onMouseMove({ clientX, clientY }) {
    if (isDragging) {
      position.x = clientX - offset.x;
      position.y = clientY - offset.y;
      view.el.style.transform =
        `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
  }

  view.delegate('mousedown', null, onMouseDown);
  view.delegate('mouseup', null, onMouseUp);
  view.delegate('mousemove', null, onMouseMove);
  view.el.classList.add(PREVENT_SELECT_CLASS);
}
