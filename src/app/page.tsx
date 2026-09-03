import WorkList from "@/components/WorkList";
import Portrait from "@/components/Portrait";
import RowTable from "@/components/RowTable";
import Timeline from "@/components/Timeline";
import { PROFILE, CLIENTS, EXPERIENCE, byYear, totalDuration, type Entry } from "@/lib/cv";

const X = `https://x.com/${PROFILE.x}`;
const BEHANCE = `https://www.behance.net/${PROFILE.behance}`;
const LINKEDIN = `https://www.linkedin.com/in/${PROFILE.linkedin}`;
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`;

const toGroups = (entries: Entry[]) =>
  byYear(entries).map((g) => ({
    name: g.name,
    items: g.items.map((e) => ({
      key: e.title + e.year + e.period,
      title: e.company ? `${e.title}, ${e.company}` : e.title,
    })),
  }));

export default function Home() {
  return (
    <main className="doc">
      <header>
        <Portrait alt={`Photograph of ${PROFILE.name}`} />
        <p>{PROFILE.name}</p>
        <p className="sub">{PROFILE.role}</p>
      </header>

      <section>
        <p>
          I&rsquo;m a self-taught designer working across visual design, 3D,
          motion, icon design and art direction.
        </p>
        <p>
          I currently work at KOSH, formerly Copperx, as a product and brand
          designer. I led the rebrand, and I design the exchange, the mobile app
          and the campaigns around them.
        </p>
        <p>
          You can find me on{" "}
          <a className="link" href={X} target="_blank" rel="noreferrer">
            X
          </a>
          ,{" "}
          <a className="link" href={BEHANCE} target="_blank" rel="noreferrer">
            Behance
          </a>{" "}
          and{" "}
          <a className="link" href={LINKEDIN} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          , or reach me via{" "}
          <a className="link" href={GMAIL_COMPOSE} target="_blank" rel="noreferrer">
            email
          </a>
          .
        </p>
      </section>

      <section>
        <WorkList />
      </section>

      <section>
        <p className="label">Experience — {totalDuration(EXPERIENCE)}</p>
        <Timeline />
      </section>

      <section>
        <RowTable label="Freelance" groups={toGroups(CLIENTS)} />
      </section>
    </main>
  );
}
