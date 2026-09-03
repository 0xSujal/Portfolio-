import Link from "next/link";
import type { Mode } from "./Showcase";

export type NavProject = { slug: string; title: string };

type Props = {
  /** One entry per category, so any of them is reachable without going back. */
  siblings?: NavProject[];
  /** Which entry is being shown, marked rather than linked to itself. */
  currentSlug?: string;
  /** Present together: the Wall/Grid switch, parked under the categories
   *  rather than floating over the work. */
  mode?: Mode;
  onModeChange?: (mode: Mode) => void;
};

/**
 * Sits in the left margin on wide screens and scrolls away on narrow ones,
 * where a fixed rail would cover the content it indexes.
 */
export default function ProjectNav({
  siblings = [],
  currentSlug,
  mode,
  onModeChange,
}: Props) {
  // A list of one says nothing the page does not already say.
  const showSiblings = siblings.length > 1;

  return (
    <nav className="pnav">
      <Link href="/" className="pnav-index">
        Back
      </Link>

      {showSiblings && (
        <ul className="pnav-list">
          {siblings.map((p) => (
            <li key={p.slug}>
              {p.slug === currentSlug ? (
                <span className="pnav-item is-on" aria-current="page">
                  {p.title}
                </span>
              ) : (
                <Link href={`/work/${p.slug}`} className="pnav-item">
                  {p.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      {mode && onModeChange && (
        <div className="pnav-modes" role="group" aria-label="View">
          {(["wall", "grid"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              aria-pressed={mode === m}
              className={mode === m ? "mode-btn is-on" : "mode-btn"}
              title={m === "wall" ? "Wall" : "Grid"}
            >
              {m === "wall" ? "Wall" : "Grid"}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
