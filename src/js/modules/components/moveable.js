export const MOVE_END = 'moveend';
const PREVENT_SELECT_CLASS = 'noselect';

export function moveableComponent({ view, staticMode = false }) {
  const offset = {};
  const position = { x: 0, y: 0 };

  view.el.classList.add(PREVENT_SELECT_CLASS);

  function moveTo({ x, y }) {
    position.x = x;
    position.y = y;
    view.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function getPosition() {
    return position;
  }

  function onMouseMove({ clientX, clientY }) {
    moveTo({
      x: clientX - offset.x,
      y: clientY - offset.y });
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp, false);
    view.trigger(MOVE_END, position);
  }

  function onMouseDown({ clientX, clientY }) {
    const { left, top } = view.el.getBoundingClientRect();
    offset.x = clientX - left;
    offset.y = clientY - top;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  }

  if (!staticMode) {
    view.delegate('mousedown', null, onMouseDown);
  }

  return Object.freeze({ moveTo, getPosition });
}
