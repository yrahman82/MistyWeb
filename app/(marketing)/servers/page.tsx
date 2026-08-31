import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serverLocations, serverProtocols } from "@/lib/servers";

export const metadata: Metadata = {
  title: "Server List — every MistyVPN location & protocol",
  description:
    "The full MistyVPN server directory: every location, its server hostname, and the protocols it supports — WireGuard, VLESS (Reality), Hysteria2, OpenVPN, and ShadowTLS. Use these for the app, routers, or manual setup.",
  alternates: { canonical: "/servers" },
};

const countries = new Set(serverLocations.map((s) => s.country)).size;

export default function ServersPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Breadcrumbs items={[{ name: "Support", href: "/support" }, { name: "Server List", href: "/servers" }]} />
      <div className="mt-6 max-w-3xl">
        <Eyebrow>Server List</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Every location, every protocol
        </h1>
        <p className="mt-4 text-slate-300">
          {serverLocations.length} locations across {countries} countries. Every MistyVPN server is
          provisioned identically, so <strong className="text-white">all protocols work on all
          servers</strong>. Use the hostname below to connect from the app, a router, or a manual
          setup — pick the protocol that suits your network.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[860px] border-collapse text-center">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-sm font-medium text-slate-400">Location</th>
              <th className="p-4 text-left text-sm font-medium text-slate-400">Server hostname</th>
              {serverProtocols.map((p) => (
                <th key={p} className="whitespace-nowrap p-4 text-sm font-medium text-slate-400">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serverLocations.map((s) => (
              <tr key={s.host} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="p-4 text-left">
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg leading-none" aria-hidden>{s.flag}</span>
                    <span>
                      <span className="block text-sm font-medium text-white">{s.city}</span>
                      <span className="block text-xs text-slate-400">{s.country}</span>
                    </span>
                  </span>
                </td>
                <td className="p-4 text-left">
                  <code className="rounded bg-white/5 px-2 py-1 text-xs text-slate-200">{s.host}</code>
                </td>
                {serverProtocols.map((p) => (
                  <td key={p} className="p-4">
                    <CheckIcon className="mx-auto h-5 w-5 text-emerald-400" />
                    <span className="sr-only">{p} supported</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-sm text-slate-400">
        WireGuard, VLESS (Reality) and Hysteria2 run in the MistyVPN apps; OpenVPN (UDP/TCP) and
        ShadowTLS also work for routers and manual configuration. Live server health and load are
        coming to this page soon.
      </p>
    </Container>
  );
}
