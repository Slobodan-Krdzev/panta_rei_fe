import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import SectionKicker from "./SectionKicker.jsx";
import VIDEOS from "../videos.json";
import { LINKS, watchUrl } from "../data.js";

const duration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Horizontal videos first (large), then a row of vertical ones. Nothing loads from YouTube until a video is opened.
export default function Videos({ number = "04" }) {
  const [active, setActive] = useState(null);
  if (!VIDEOS.length) return null;
  const rows = [VIDEOS.filter((v) => !v.portrait), VIDEOS.filter((v) => v.portrait)].filter((row) => row.length);

  return (
    <section className="videos section" id="videos">
      <SectionKicker number={number} label="Видеа" />
      <div className="gallery-head">
        <div>
          <p className="overline">Погледнете и слушнете</p>
          <h2>Вака звучиме<br />во живо.</h2>
        </div>
        <div className="videos-intro">
          <p>Снимки од наши настапи — онака како што звучиме и на вашата прослава.</p>
          <a className="card-link" href={LINKS.youtube} target="_blank" rel="noreferrer">
            Сите видеа на YouTube <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      {rows.map((row) => (
        <ul className={`video-row ${row[0].portrait ? "is-portrait" : "is-landscape"}`} key={String(row[0].portrait)}>
          {row.map((video) => (
            <li key={video.id}>
              {/* a plain link to YouTube without JavaScript, or when opened in a new tab */}
              <a
                className="video-card"
                href={watchUrl(video.id)}
                aria-label={`Пушти видео: ${video.title}, ${duration(video.seconds)}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  setActive(video);
                }}
              >
                <img src={video.thumb} width={video.width} height={video.height} alt="" loading="lazy" decoding="async" draggable="false" />
                <span className="video-play"><Play aria-hidden="true" /></span>
                <span className="video-time">{duration(video.seconds)}</span>
                <strong className="video-title">{video.title}</strong>
              </a>
            </li>
          ))}
        </ul>
      ))}

      {active && <VideoDialog video={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function VideoDialog({ video, onClose }) {
  const dialogRef = useRef(null);

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

  return (
    <dialog
      ref={dialogRef}
      className="lightbox video-dialog"
      aria-label={video.title}
      onCancel={(e) => {
        e.preventDefault(); // Esc: close through React so state stays in sync
        onClose();
      }}
    >
      <div className="lightbox-top">
        <strong className="video-dialog-title">{video.title}</strong>
        <button className="lightbox-close" type="button" onClick={onClose} aria-label="Затвори" autoFocus>
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="video-stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <iframe
          className={video.portrait ? "is-portrait" : "is-landscape"}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&hl=mk`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </dialog>
  );
}
