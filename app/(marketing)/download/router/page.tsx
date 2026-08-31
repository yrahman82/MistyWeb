import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import Breadcrumbs from "@/components/Breadcrumbs";
import { routers, prereqs, PROFILE_PATH } from "@/lib/routers";

export const metadata: Metadata = {
  title: "VPN for Routers — DD-WRT, Asus, OpenWRT & more (OpenVPN)",
  description:
    "Set up MistyVPN on your router with OpenVPN and protect every device in your home — TVs, consoles, smart-home gear. Step-by-step guides for DD-WRT, Asus, OpenWRT, Tomato, pfSense and GL.iNet.",
  alternates: { canonical: "/download/router" },
};

export default function RouterLandingPage() {
  return (
    <Container className="py-14 sm:py-20">
      <Breadcrumbs items={[{ name: "Download", href: "/download" }, { name: "Router VPN", href: "/download/router" }]} />

      <div className="mt-6 max-w-3xl">
        <Eyebrow>Router VPN</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Put MistyVPN on your router
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          Set MistyVPN up once on your router and every device behind it is protected — smart TVs,
          consoles, streaming boxes and smart-home gear that can&apos;t run a VPN app themselves.
          MistyVPN supports <strong className="text-white">OpenVPN</strong>, so any router with an
          OpenVPN client works.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={PROFILE_PATH} className="px-6">Download OpenVPN profile</Button>
          <Button href="/servers" variant="secondary" className="px-6">Browse server list</Button>
        </div>
      </div>

      {/* What you need first */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Before you start</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {prereqs.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{p.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Get credentials at <Link href="/account" className="text-brand hover:underline">mistyvpn.com/account</Link>{" "}
          (or in the app: Account → VPN Credentials). Pick a location on the{" "}
          <Link href="/servers" className="text-brand hover:underline">Server List</Link>.
        </p>
      </div>

      {/* Router picker */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold text-white">Choose your router</h2>
        <p className="mt-2 text-slate-400">Pick your router or firmware for step-by-step instructions.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routers.map((r) => (
            <Link
              key={r.slug}
              href={`/download/router/${r.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand/50 hover:bg-brand/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{r.name}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                  {r.badge}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{r.summary}</p>
              <span className="mt-4 text-sm font-medium text-brand group-hover:underline">View guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
