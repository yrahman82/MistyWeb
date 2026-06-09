import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your data: a strict no-logs VPN that collects the minimum needed to run accounts and subscriptions.`,
  alternates: { canonical: "/privacy" },
};

const updated = "June 9, 2026";

export default function PrivacyPage() {
  return (
    <section className="pt-20 pb-20">
      <Container>
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {updated}</p>

        <div className="mt-10">
          <Prose>
            <p>
              {site.name} (&quot;we&quot;, &quot;us&quot;) provides a no-logs VPN
              service. This policy explains what we collect, what we deliberately
              do not collect, and your choices. This is a template and should be
              reviewed by counsel before launch.
            </p>

            <h2>Our no-logs commitment</h2>
            <p>
              We do not record your browsing activity, the contents or
              destinations of your traffic, your DNS queries, or your source IP
              address. We keep no logs that could be used to associate VPN
              activity with an individual user.
            </p>

            <h2>What we collect</h2>
            <ul>
              <li>
                <strong>Account data:</strong> an account identifier and, if you
                create an account, your email address.
              </li>
              <li>
                <strong>Subscription status:</strong> validated through the Apple
                App Store or Google Play. We do not receive your full payment
                details — those are handled by the stores.
              </li>
              <li>
                <strong>A device identifier:</strong> a random ID used to manage
                your devices and connections; it is not tied to any activity log.
              </li>
              <li>
                <strong>Aggregate operational metrics:</strong> non-identifying
                data such as total server load, used to keep the service running.
              </li>
              <li>
                <strong>Crash reports:</strong> privacy-scrubbed of tokens,
                credentials, and IP addresses. Disabled in debug builds.
              </li>
            </ul>

            <h2>What we do not collect</h2>
            <ul>
              <li>Websites you visit or apps you use</li>
              <li>The contents of your traffic</li>
              <li>Your real IP address or connection timestamps tied to identity</li>
              <li>Any data that links your activity to you</li>
            </ul>

            <h2>How we use data</h2>
            <p>
              We use the limited data above to operate accounts and
              subscriptions, to keep the network reliable and fast, and to fix
              crashes. We do not sell your data, and we do not use it for
              advertising.
            </p>

            <h2>Payments</h2>
            <p>
              Subscriptions are purchased and managed through the Apple App Store
              and Google Play. Their respective privacy policies govern payment
              processing.
            </p>

            <h2>Data retention</h2>
            <p>
              We retain account and subscription data only for as long as your
              account is active or as required to comply with legal obligations.
              Because we keep no activity logs, there is no browsing history to
              retain or delete.
            </p>

            <h2>Your rights</h2>
            <p>
              You can delete your account at any time from within the app, which
              removes your associated account data. For questions or requests,
              contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>Changes</h2>
            <p>
              We may update this policy from time to time. Material changes will
              be reflected by the &quot;last updated&quot; date above.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about privacy? Email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
