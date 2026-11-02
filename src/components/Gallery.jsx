import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Pause, Play } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import Lightbox from "./Lightbox.jsx";
import PHOTOS from "../gallery.json";
import { pad } from "../data.js";
import { useLoopCarousel, withClones } from "../hooks/useLoopCarousel.js";

const AUTOPLAY_MS = 5000;

// Fisher–Yates: a fresh order on every visit
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Gallery() {
  // Same order on the server and on first paint (so pre-rendered HTML hydrates cleanly), then shuffled
  const [photos, setPhotos] = useState(PHOTOS);
  useEffect(() => setPhotos(shuffle(PHOTOS)), []);
  const count = photos.length;
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (prefersReducedMotion()) setPlaying(false);
  }, []);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const carousel = useLoopCarousel(count, {
    autoplayMs: AUTOPLAY_MS,
    paused: !playing || hovered || tabHidden || lightboxIndex !== null,
  });
  const { looping, pos, current, running, go, goTo } = carousel;

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  // Returning from the lightbox leaves the inline carousel on the last photo viewed
  const closeLightbox = (lastIndex) => {
    setLightboxIndex(null);
    goTo(lastIndex, { instant: true });
  };

  if (!count) return null;
  const track = withClones(photos);

  return (
    <section className="gallery section" id="gallery">
      <SectionKicker number="04" label="Галерија" />
      <div className="gallery-head">
        <div>
          <p className="overline">Од сцената</p>
          <h2>Моменти што<br />остануваат.</h2>
        </div>
        <p>Фотографии од нашите настапи, проби и вечери што ги споделивме со вас.</p>
      </div>

      <div
        className="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Галерија со фотографии"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHovered(false)}
      >
        <div className="carousel-viewport" {...carousel.viewportProps}>
          <div {...carousel.trackProps} aria-live={running ? "off" : "polite"}>
            {track.map((photo, i) => {
              const isClone = looping && (i === 0 || i === track.length - 1);
              const near = Math.abs(i - pos) <= 1;
              const realIndex = looping ? (i - 1 + count) % count : i;
              return (
                <figure
                  className="carousel-slide"
                  key={`${photo.id}-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${realIndex + 1} од ${count}`}
                  aria-hidden={isClone || i !== pos}
                  onClick={() => setLightboxIndex(realIndex)}
                >
                  <img className="carousel-backdrop" src={photo.sm} alt="" aria-hidden="true" loading={near ? "eager" : "lazy"} draggable="false" />
                  <img
                    className="carousel-img"
                    src={photo.lg}
                    srcSet={`${photo.sm} 900w, ${photo.lg} 1800w`}
                    sizes="(max-width: 960px) 100vw, 1200px"
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

          <button className="carousel-expand" type="button" onClick={() => setLightboxIndex(current)} aria-label="Отвори на цел екран">
            <Expand aria-hidden="true" />
          </button>

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
          <div className="carousel-bar">
            <span className="carousel-count">
              <strong>{pad(current)}</strong> / {pad(count - 1)}
            </span>
            <div className="carousel-progress" aria-hidden="true">
              <span
                key={`${current}-${running}`}
                className={running ? "is-running" : ""}
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            </div>
            <button
              className="carousel-toggle"
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Паузирај" : "Пушти"}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>

      {lightboxIndex !== null && <Lightbox photos={photos} startIndex={lightboxIndex} onClose={closeLightbox} />}
    </section>
  );
}
