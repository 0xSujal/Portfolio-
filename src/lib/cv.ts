/** Source: Sujal Kalsaria — LinkedIn experience, Sep 2026. */

export const PROFILE = {
  name: "Sujal Kalsaria",
  role:"3D Designer, Motion & Art Direction",
  email: "sujalkalsaria@gmail.com",
  x: "sujalkalsaria",
  linkedin: "sujal-kalsariya-71901523b",
  behance: "sujalkalsariya",
};

export type Entry = {
  /** Start year — the grouping key in the tables. */
  year: string;
  title: string;
  /** Empty where the resume shows a logo rather than a name. */
  company: string;
  period: string;
  /** Human range shown in the timeline readout — authored, not derived, so
   *  it reads exactly as the resume does. `from`/`to` below are the tick
   *  bounds and are kept non-overlapping, which is not always the same span. */
  /** Inclusive month bounds, "YYYY-MM", driving which ticks belong to a role. */
  from?: string;
  to?: string;
  /** Path under /logos. Only set where the employer is confirmed. */
  logo?: string;
  /** Brand colour, sampled from the logo file. Tints that role's ticks. */
  color?: string;
  /** Set only on the current role. Its true calendar start, "YYYY-MM" — not
   *  `from`, which can be pulled earlier than reality to balance the ruler.
   *  Drives a duration that recomputes against today rather than sitting in
   *  `period` as text that goes stale the month after it's written. */
  ongoingSince?: string;
};

/** Elapsed time from a "YYYY-MM" start through the current month, inclusive —
 *  same convention as the hand-counted "4 months" on finished roles, just
 *  computed against today instead of another fixed end. */
export function sinceLabel(since: string): string {
  const [sy, sm] = since.split("-").map(Number);
  const now = new Date();
  const months = (now.getFullYear() - sy) * 12 + (now.getMonth() + 1 - sm) + 1;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const yearPart = years ? `${years} year${years === 1 ? "" : "s"}` : "";
  const monthPart = rem ? `${rem} month${rem === 1 ? "" : "s"}` : "";
  return yearPart && monthPart ? `${yearPart} and ${monthPart}` : yearPart || monthPart;
}

export const TIMELINE_FROM = "2021-06";
export const TIMELINE_TO = "2026-09";

export const CLIENTS: Entry[] = [
  { year: "2025", title: "Dacoit.design", company: "3D motion graphics", period: "Jan - Jun", from: "2025-01", to: "2025-06" },
  { year: "2024", title: "Dacoit.design", company: "3D motion graphics", period: "Jul - Dec", from: "2024-07", to: "2024-12" },
  { year: "2022", title: "MahaDAO", company: "3D assets", period: "Dec - Feb 23", from: "2022-12", to: "2023-02" },
  { year: "2022", title: "Polygon", company: "3D assets", period: "", from: undefined, to: undefined },
  { year: "2021", title: "Timeswap", company: "3D animation", period: "Apr - Sep", from: "2021-04", to: "2021-09" },
  { year: "2021", title: "Polytrade", company: "3D assets", period: "Apr - Jun", from: "2021-04", to: "2021-06" },
];

/** Earliest `from` to latest `to` across a set of entries, as "N years and M months". */
export function totalDuration(entries: Entry[]): string {
  const froms = entries.map((e) => e.from).filter((v): v is string => !!v).sort();
  const tos = entries.map((e) => e.to).filter((v): v is string => !!v).sort();
  const earliest = froms[0];
  const latest = tos.at(-1);
  if (!earliest || !latest) return "";

  const [fy, fm] = earliest.split("-").map(Number);
  const [ty, tm] = latest.split("-").map(Number);
  const totalMonths = (ty - fy) * 12 + (tm - fm);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yearPart = years ? `${years} year${years === 1 ? "" : "s"}` : "";
  const monthPart = months ? `${months} month${months === 1 ? "" : "s"}` : "";
  return yearPart && monthPart ? `${yearPart} and ${monthPart}` : yearPart || monthPart;
}

export const EXPERIENCE: Entry[] = [
  { year: "2026", title: "Motion Designer", company: "Morphic", logo: "/logos/morphic.png", period: "Sep 2026 - Now", from: "2026-07", to: "2026-09", ongoingSince: "2026-09" },
  { year: "2022", title: "Lead 3D and Visual Designer", company: "KOSH (Prev. Copperx)", logo: "/logos/kosh.png", period: "Nov 2022 - Aug 2026 · 3 years and 10 months", from: "2022-11", to: "2026-06" },
  { year: "2022", title: "Freelance 3D Artist", company: "Freelance", color: "#22C55E", period: "Aug 2022 - Nov 2022 · 4 months", from: "2022-08", to: "2022-11" },
  { year: "2021", title: "3D Designer", company: "Scallopx", color: "#4C6FFF", logo: "/logos/scallop.png", period: "Sep 2021 - Aug 2022 · 1 year", from: "2021-09", to: "2022-08" },
  { year: "2021", title: "3D Designer", company: "IconScout", color: "#00C6FF", logo: "/logos/iconscout.png", period: "Jun 2021 - Sep 2021 · 4 months", from: "2021-06", to: "2021-09" },
];

/** Consecutive entries sharing a year become one group, newest first. */
export function byYear(entries: Entry[]) {
  const groups: { name: string; items: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last?.name === entry.year) last.items.push(entry);
    else groups.push({ name: entry.year, items: [entry] });
  }
  return groups;
}

/** Inclusive list of "YYYY-MM" between two bounds. */
export function monthsBetween(from: string, to: string): string[] {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  const out: string[] = [];
  for (let y = fy, m = fm; y < ty || (y === ty && m <= tm); ) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return out;
}
