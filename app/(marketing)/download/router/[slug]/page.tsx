import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, Button } from "@/components/ui";
import Breadcrumbs from "@/components/Breadcrumbs";
import { routers, UDP_PROFILE_PATH, TCP_PROFILE_PATH } from "@/lib/routers";

export function generateStaticParams() {
  return routers.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = routers.find((x) => x.slug === slug);
  if (!r) return {};
  return {
    title: `${r.name} — MistyVPN OpenVPN setup guide`,
    description: `Set up MistyVPN on ${r.name} using OpenVPN. ${r.summary} Step-by-step, with the profile, server hostnames and where to find your VPN username and password.`,
    alternates: { canonical: `/download/router/${r.slug}` },
  };
}

export default async function RouterGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = routers.find((x) => x.slug === slug);
  if (!r) notFound();

  return (
    <Container className="py-14 sm:py-20">
      <Breadcrumbs
        items={[
          { name: "Download", href: "/download" },
          { name: "Router VPN", href: "/download/router" },
          { name: r.name, href: `/download/router/${r.slug}` },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <Eyebrow>Router setup · {r.badge}</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          MistyVPN on {r.name}
        </h1>
        <p className="mt-4 text-slate-300">{r.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={UDP_PROFILE_PATH} variant="secondary" className="px-6">UDP profile</Button>
          <Button href={TCP_PROFILE_PATH} variant="secondary" className="px-6">TCP profile</Button>
          <Button href="/servers" variant="secondary" className="px-6">Server list</Button>
        </div>
      </div>

      {/* What you need — scannable checklist with links */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <span className="text-sm font-semibold text-white">You&apos;ll need</span>
        <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-brand">•</span>
            <span>Your VPN username &amp; password</span>
            <Link href="/account" className="text-brand hover:underline">Account → VPN Credentials</Link>
          </li>
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-brand">•</span>
            <span>A server hostname like <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">gb-lon-1.mistyvpn.com</code> (UDP 10006 · TCP 10007)</span>
            <Link href="/servers" className="text-brand hover:underline">Server list</Link>
          </li>
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-brand">•</span>
            <span>The OpenVPN profile (certificate included)</span>
            <Link href={UDP_PROFILE_PATH} className="text-brand hover:underline">UDP</Link>
            <span className="text-slate-600">·</span>
            <Link href={TCP_PROFILE_PATH} className="text-brand hover:underline">TCP</Link>
          </li>
        </ul>
      </div>

      {/* Steps */}
      <ol className="mt-10 space-y-4">
        {r.steps.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
              {i + 1}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
        <Link href="/download/router" className="text-brand hover:underline">← All routers</Link>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">
          Stuck? <Link href="/support" className="text-brand hover:underline">Contact us</Link>{" "}
          and we&apos;ll help you get connected.
        </span>
      </div>
    </Container>
  );
}
