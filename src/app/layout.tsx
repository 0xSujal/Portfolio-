import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Haptics from "@/components/Haptics";
import ThemeToggle from "@/components/ThemeToggle";
import { PROFILE } from "@/lib/cv";

/** Runs before paint, so an explicit choice from a previous visit applies
 *  immediately rather than flashing the system-default theme first. */
const THEME_INIT = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

/**
 * Saans (Displaay). These are TRIAL files and are deliberately not committed —
 * the repo is public, and redistributing them is not something the trial
 * covers. See README for how to restore them locally; a web licence is
 * required before this ships anywhere public.
 */
// TEMP: Saans trial files aren't on this machine yet (see README > Fonts).
// Falling back to system sans so the site builds locally; restore the real
// localFont() call below once the trial files are copied into src/fonts/.
const saans = { className: "" };
// const saans = localFont({
//   src: [
//     { path: "../fonts/Saans-TRIAL-Regular.woff2", weight: "400", style: "normal" },
//     { path: "../fonts/Saans-TRIAL-RegularItalic.woff2", weight: "400", style: "italic" },
//     { path: "../fonts/Saans-TRIAL-Medium.woff2", weight: "500", style: "normal" },
//   ],
//   display: "swap",
//   fallback: ["Inter", "system-ui", "sans-serif"],
// });

export const metadata: Metadata = {
  title: `${PROFILE.name}`,
  description:
    "Self-taught designer working across visual design, 3D, motion, icons and art direction. Currently at KOSH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={saans.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <SmoothScroll />
        <Haptics />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
