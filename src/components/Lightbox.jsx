import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { pad } from "../data.js";
import { useLoopCarousel, withClones } from "../hooks/useLoopCarousel.js";

// Full-screen photo viewer on a native <dialog> (focus trap, Esc to close, top layer for free)
export default function Lightbox({ photos, startIndex, onClose }) {
  const count = photos.length;
  const dialogRef = useRef(null);
  const thumbsRef = useRef(null);
  const carousel = useLoopCarousel(count, { startIndex });
  const { looping, pos, current, go, goTo } = carousel;
  const currentRef = useRef(current);
  currentRef.current = current;

  // Open on mount; lock page scroll while open
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  // Keep the active thumbnail in view (scrolls only the strip, never the page)
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[current];
    if (!thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [current]);

  const close = () => onClose(currentRef.current);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  const track = withClones(photos);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Галерија на цел екран"
      onKeyDown={onKeyDown}
      onCancel={(e) => {
        e.preventDefault(); // Esc: close through React so state stays in sync
        close();
      }}
    >
      <div className="lightbox-top">
        <span className="carousel-count">
          <strong>{pad(current)}</strong> / {pad(count - 1)}
        </span>
        <button className="lightbox-close" type="button" onClick={close} aria-label="Затвори" autoFocus>
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="lightbox-stage" {...carousel.viewportProps}>
        <div {...carousel.trackProps}>
          {track.map((photo, i) => {
            const isClone = looping && (i === 0 || i === track.length - 1);
            const near = Math.abs(i - pos) <= 1;
            const realIndex = looping ? (i - 1 + count) % count : i;
            return (
              <figure
                className="lightbox-slide"
                key={`${photo.id}-${i}`}
                aria-hidden={isClone || i !== pos}
                onClick={(e) => e.target === e.currentTarget && close()} // click on the dark area closes
              >
                <img
                  src={photo.lg}
                  srcSet={`${photo.sm} 900w, ${photo.lg} 1800w`}
                  sizes="100vw"
                  width={photo.width}
                  height={photo.height}
                  alt={`Бенд за свадби Панта Реи — настап во живо, фотографија ${realIndex + 1}`}
                  loading={near ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                />
              </figure>
            );
          })}
        </div>

        {looping && (
          <>
            <button className="carousel-arrow prev" type="button" onClick={() => go(-1)} aria-label="Претходна фотографија">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button className="carousel-arrow next" type="button" onClick={() => go(1)} aria-label="Следна фотографија">
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {looping && (
        <div className="lightbox-thumbs" ref={thumbsRef}>
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              className={i === current ? "is-active" : ""}
              onClick={() => goTo(i)}
              aria-label={`Фотографија ${i + 1}`}
              aria-current={i === current}
            >
              <img src={photo.sm} alt="" loading="lazy" draggable="false" />
            </button>
          ))}
        </div>
      )}
    </dialog>
  );
}
