"use client";

import Wall from "./Wall";
import Gallery from "./Gallery";
import type { Shot, SphereShot } from "@/lib/work";
import type { Group } from "@/lib/layout";

export type Mode = "wall" | "grid";

/**
 * Three ways through a project's images.
 *
 * Carousel and Grid are the same component in two layouts, so switching
 * between them moves the items rather than replacing them. The Wall is its
 * own thing: fixed cells that each hold a piece for a few seconds before the
 * next takes its place, so the whole set is seen without scrolling.
 */
export default function Showcase({
  shots,
  allShots,
  gridShots,
  title,
  groups,
  mode,
}: {
  shots: Shot[];
  /** Everything, where a view shows more than the scroll's own images. */
  allShots?: SphereShot[];
  /** What the grid shows. The posts, where a project has them. */
  gridShots?: SphereShot[];
  /** Campaign runs over the same list. */
  groups?: Group[];
  title: string;
  /** Owned by the page, so the switch can live in the nav rail beside it. */
  mode: Mode;
}) {
  // A plain Shot has no href or video, so name the resolved list as the wider
  // type rather than letting the fallback narrow it.
  const base: SphereShot[] = gridShots?.length ? gridShots : (allShots ?? shots);
  // Tag each with its campaign, so an opened frame can name itself the way a
  // Figma frame does.
  const tiles: SphereShot[] = groups?.length
    ? base.map((s, i) => {
        const g = groups.find((x) => i >= x.start && i < x.start + x.count);
        return g ? { ...s, name: g.title } : s;
      })
    : base;

  return mode === "wall" ? (
    <Wall shots={tiles} title={title} />
  ) : (
    // One component for both: switching between them is a retarget, not
    // an unmount, so the items travel rather than blink.
    <Gallery shots={tiles} groups={groups} mode="grid" title={title} />
  );
}
