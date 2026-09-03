"use client";

import { useState } from "react";
import ProjectNav, { type NavProject } from "./ProjectNav";
import Showcase, { type Mode } from "./Showcase";
import type { Shot, SphereShot } from "@/lib/work";
import type { Group } from "@/lib/layout";

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

  return (
    <>
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
