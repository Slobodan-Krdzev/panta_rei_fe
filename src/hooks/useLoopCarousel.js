import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 50;

// Endless slider state shared by the inline gallery and the lightbox.
// The track renders [last, ...items, first]; `pos` indexes into it. Landing on a clone
// snaps (without animation) to its real twin, so the loop never visibly rewinds.
export function useLoopCarousel(count, { autoplayMs = 0, paused = false, startIndex = 0 } = {}) {
  const looping = count > 1;
  const [pos, setPos] = useState(looping ? startIndex + 1 : 0);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState(0);
  const drag = useRef(null);
  const justDragged = useRef(false);

  const current = looping ? (pos - 1 + count) % count : 0;
  const running = looping && autoplayMs > 0 && !paused && dragX === 0;

  const go = useCallback(
    (dir) => {
      if (!looping) return;
      setAnimate(true);
      // ignore input while sitting on a clone (mid-snap)
      setPos((p) => (p <= 0 || p >= count + 1 ? p : p + dir));
    },
    [looping, count]
  );

  const goTo = useCallback(
    (index, { instant = false } = {}) => {
      if (!looping) return;
      setAnimate(!instant);
      setPos(index + 1);
    },
    [looping]
  );

  // Autoplay — restarts after every slide change, so manual navigation resets the timer
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => go(1), autoplayMs);
    return () => clearTimeout(id);
  }, [running, pos, go, autoplayMs]);

  // Re-enable the transition two frames after an instant snap
  useEffect(() => {
    if (animate) return;
    let inner;
    const outer = requestAnimationFrame(() => (inner = requestAnimationFrame(() => setAnimate(true))));
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  const onTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (pos === 0) {
      setAnimate(false);
      setPos(count);
    } else if (pos === count + 1) {
      setAnimate(false);
      setPos(1);
    }
  };

  // Swipe / drag
  const onPointerDown = (e) => {
    if (!looping || e.button > 0 || e.target.closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, active: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.active) {
      if (Math.abs(dx) < 8) return;
      // vertical intent → let the page scroll
      if (Math.abs(e.clientY - d.y) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setAnimate(false);
    setDragX(dx);
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;
    // swallow the click that follows a drag, so swiping never opens the lightbox
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 0);
    const dx = dragX;
    setAnimate(true);
    setDragX(0);
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };
  const onClickCapture = (e) => {
    if (justDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return {
    looping,
    pos,
    current,
    running,
    go,
    goTo,
    viewportProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
    trackProps: {
      className: `carousel-track${animate ? " is-animated" : ""}`,
      style: { transform: `translateX(calc(${-pos * 100}% + ${dragX}px))` },
      onTransitionEnd,
    },
  };
}

// The rendered slide list including the two loop clones
export const withClones = (items) => (items.length > 1 ? [items[items.length - 1], ...items, items[0]] : items);
