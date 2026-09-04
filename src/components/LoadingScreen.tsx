"use client";

/**
 * Covers the page while its media is still arriving — a wall or grid can
 * hold hundreds of images and videos, and the first paint of empty cells
 * reads as broken rather than loading. The ring's hue keeps turning so the
 * screen never looks stalled even on a slow connection.
 */
export default function LoadingScreen({
  percent,
  fading,
}: {
  /** Share of this page's images actually confirmed loaded, 0–100. */
  percent: number;
  fading: boolean;
}) {
  return (
    <div className={fading ? "loading-screen is-fading" : "loading-screen"} aria-hidden={fading}>
      <div className="loading-mark">
        {/* Siblings, not parent/child: a mask on the ring would clip
            anything nested inside it too, taking the globe out with it. */}
        <div className="loading-ring" />
        <svg
          className="loading-globe"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9.25" />
          <path d="M2.75 12h18.5" />
          <path d="M12 2.75c2.9 2.55 4.5 5.85 4.5 9.25s-1.6 6.7-4.5 9.25c-2.9-2.55-4.5-5.85-4.5-9.25s1.6-6.7 4.5-9.25Z" />
        </svg>
      </div>
      <p className="loading-percent">{percent}%</p>
    </div>
  );
}
