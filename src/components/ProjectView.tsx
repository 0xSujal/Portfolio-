"use client";

import { useEffect, useState } from "react";
import ProjectNav, { type NavProject } from "./ProjectNav";
import Showcase, { type Mode } from "./Showcase";
import LoadingScreen from "./LoadingScreen";
import type { Shot, SphereShot } from "@/lib/work";
import type { Group } from "@/lib/layout";

/** Floor, so a fast connection still shows the mark rather than a flicker. */
const MIN_VISIBLE_MS = 500;
/** Ceiling, so a slow or already-cached asset never leaves it stuck up. */
const MAX_WAIT_MS = 4000;
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

  // The route itself has nothing async — every image and clip does. `load`
  // fires once the page's initial media has actually arrived; on a client
  // side navigation between sections the document is already complete, so
  // this just holds for the floor below instead of tracking new assets.
  useEffect(() => {
    let done = false;
    const start = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => setLoading(false), FADE_MS);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    const ceiling = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(ceiling);
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen fading={fading} />}
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
