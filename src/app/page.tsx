import type { ReactNode } from "react";
import Image from "next/image";
import Greeting from "~/components/home/Greeting";
import Horse from "~/components/home/Horse";
import CraftGrid from "~/components/home/CraftGrid";
import TextLink from "~/components/home/TextLink";
import { craft } from "~/data/craft";
import { site } from "~/data/site";
import { getAllWritings } from "~/lib/writings";

const socials = [
  { href: "https://x.com/gabrielfp101", label: "Twitter" },
  { href: "https://github.com/gabrielcoffee", label: "GitHub" },
  { href: "mailto:gfernandespereira18@gmail.com", label: "Email" },
];

export default function Home() {
  const writings = getAllWritings().slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[48ch] space-y-6 text-[15px] leading-[1.3] tracking-tight text-[#7a7a7a]">
      <div className="h-10 w-10 overflow-hidden rounded-full">
        <Image
          src="/pfp.jpg"
          alt={site.fullName}
          width={400}
          height={400}
          priority
          className="h-full w-full object-cover"
        />
      </div>

      <Greeting />

      <p>I&apos;m Gabriel, a software engineer drawn by art and well-being.
        Currently with{" "}
        <TextLink href="https://www.balanceofnature.com" external>
          Balance of Nature&apos;s
        </TextLink>{" "}
        tech team, building a live translation app that puts two people and an
        interpreter on one call.
      </p>

      <p>
        Away from the keyboard, I can be found{" "}
        <TextLink
          href="https://www.youtube.com/watch?v=zB2j9WslnQQ&list=PLU9H5F5mKox_x0gMVzuVhBYhafJBqGMqx&index=7"
          external
        >
          writing
        </TextLink>{" "}
        or listening to music, lifting weights and hiking!
      </p>

      <Section title="Creations">
        <CraftGrid tiles={craft} />
      </Section>

      <Section title="Writing">
        <ul className="space-y-1">
          {writings.length === 0 && <li>Soon.</li>}
          {writings.map((writing) => (
            <li key={writing.slug}>
              <TextLink href={`/writings/${writing.slug}`}>
                {writing.title}
              </TextLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Find me">
        <ul className="space-y-1">
          {socials.map((social) => (
            <li key={social.href}>
              <TextLink href={social.href} external>
                {social.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </Section>

      {/* Spaced like a section: pt-2 above, and -mb-8 trims main's pb-16 to
          the same 32px below (important, or space-y-6 resets it). The
          caption is the peer, first in the DOM so hovering it can fade the
          horse in; order-first lifts the horse back above it. */}
      <div className="!-mb-8 flex flex-col items-center gap-3 pt-2">
        <p className="peer text-[12px] text-neutral-300">always in motion</p>
        <Horse className="order-first text-neutral-300 opacity-0 transition-opacity duration-500 peer-hover:opacity-100" />
      </div>
    </div>
  );
}

/* space-y-6 owns the gap above; pt-2 adds the extra air a heading gets. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-2">
      <h2 className="mb-3 font-title text-[18px] font-bold text-black">{title}</h2>
      {children}
    </section>
  );
}
