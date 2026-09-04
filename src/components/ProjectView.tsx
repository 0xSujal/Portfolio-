"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectNav, { type NavProject } from "./ProjectNav";
import Showcase, { type Mode } from "./Showcase";
import LoadingScreen from "./LoadingScreen";
import type { Shot, SphereShot } from "@/lib/work";
import type { Group } from "@/lib/layout";

/** Floor, so an all-cached load still shows the mark rather than a flicker. */
const MIN_VISIBLE_MS = 300;
/** Ceiling, so one slow or broken asset never leaves the page stuck. */
const MAX_WAIT_MS = 10000;
/** Matches the CSS fade-out duration on .loading-screen. */
const FADE_MS = 500;

/**
 * Owns the Wall/Grid mode, so the switch in the nav rail and the gallery it
 * drives can be siblings rather than one reaching into the other.
 */
export default function ProjectView({
  siblings,
  currentSlug,
  shots,
  allShots,
  gridShots,
  groups,
  title,
}: {
  siblings: NavProject[];
  currentSlug: string;
  shots: Shot[];
  allShots?: SphereShot[];
  gridShots?: SphereShot[];
  groups?: Group[];
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("wall");
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(0);

  // Every shot's `src` — the poster for a video, the image itself
  // otherwise — is exactly what Wall/Gallery will request, so preloading
  // these warms the cache the real render then hits instantly. The clip
  // files themselves are not fetched here: streaming them on play is the
  // point of <video>, and forcing every one down first would turn a
  // multi-hundred-megabyte category into a minutes-long wait for nothing
  // more than a couple of scrolled-to tiles.
  const assetUrls = useMemo(() => {
    const list = allShots ?? shots;
    return Array.from(new Set(list.map((s) => s.src)));
  }, [allShots, shots]);

  const total = assetUrls.length;
  const percent = total ? Math.min(100, Math.round((loaded / total) * 100)) : 100;

  useEffect(() => {
    let settled = false;
    let count = 0;
    const start = performance.now();

    const finish = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => setLoading(false), FADE_MS);
      }, wait);
    };

    if (total === 0) {
      finish();
      return;
    }

    setLoaded(0);
    const images = assetUrls.map((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        if (settled) return;
        count += 1;
        setLoaded(count);
        if (count >= total) finish();
      };
      img.src = src;
      return img;
    });

    const ceiling = window.setTimeout(finish, MAX_WAIT_MS);
    return () => {
      settled = true;
      window.clearTimeout(ceiling);
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [assetUrls, total]);

  return (
    <>
      {loading && <LoadingScreen percent={percent} fading={fading} />}
      <ProjectNav
        siblings={siblings}
        currentSlug={currentSlug}
        mode={mode}
        onModeChange={setMode}
      />
      <main className="doc">
        <Showcase
          mode={mode}
          shots={shots}
          allShots={allShots}
          gridShots={gridShots}
          groups={groups}
          title={title}
        />
      </main>
    </>
  );
}
