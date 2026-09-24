import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ALL_PROJECTS,
  CATEGORIES,
  findProject,
  leadProject,
  type SphereShot,
} from "@/lib/work";
import ProjectView from "@/components/ProjectView";
import { PROFILE } from "@/lib/cv";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} - ${PROFILE.name}`,
    description: project.intro ?? `${project.category.name} work by ${PROFILE.name}.`,
    openGraph: { images: [project.cover] },
  };
}


export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const flat: SphereShot[] =
    project.shots ??
    [{ src: project.cover, width: project.width ?? 4, height: project.height ?? 3 }];

  // The posts join the grid and the wall, where their clips play in place,
  // than as a second list under the work.
  const postShots: SphereShot[] = (project.posts ?? [])
    .filter((p) => p.media)
    .map((p) => ({
      src: p.media!.src,
      width: p.media!.width,
      height: p.media!.height,
      href: p.url,
      video: p.video,
      clip: p.clip ?? undefined,
    }));
  const allShots = [...flat, ...postShots];

  const sections = project.sections ?? [];
  // Runs over the flat list: each campaign's start and length.
  const groups = sections.reduce<{ title: string; start: number; count: number }[]>(
    (acc, section) => {
      const last = acc.at(-1);
      const start = last ? last.start + last.count : 0;
      acc.push({ title: section.title, start, count: section.shots.length });
      return acc;
    },
    []
  );
  // Anything past the sections — the posts — gets an untitled run of its own.
  // gridLayout only positions indices inside a run, so without this the
  // clips would have no box at all on a project that has both.
  const covered = groups.reduce((n, g) => n + g.count, 0);
  if (allShots.length > covered) {
    groups.push({ title: "", start: covered, count: allShots.length - covered });
  }

  // One entry per category rather than per project, so the rail switches
  // between Motion graphics / Visual Graphics / 3D Product render from
  // anywhere, not just between projects inside the current one.
  const categoryLinks = CATEGORIES.map((c) => {
    const lead = leadProject(c);
    return lead ? { slug: lead.slug, title: c.name } : null;
  }).filter((l): l is { slug: string; title: string } => l !== null);

  return (
    <ProjectView
      siblings={categoryLinks}
      currentSlug={slug}
      shots={flat}
      allShots={allShots}
      gridShots={allShots}
      groups={groups}
      title={project.title}
    />
  );
}
