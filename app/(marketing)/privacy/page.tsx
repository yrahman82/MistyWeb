import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your data: a strict no-logs VPN that collects the minimum needed to run accounts and subscriptions, and never records your activity.`,
  alternates: { canonical: "/privacy" },
};

const updated = "July 15, 2026";

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
              {site.name} (&quot;{site.name}&quot;, &quot;we&quot;, &quot;us&quot;,
              or &quot;our&quot;) provides a no-logs virtual private network (VPN)
              service across iPhone, iPad, Android, Mac, and Android TV. This
              Privacy Policy explains what we collect, the things we deliberately
              do <strong>not</strong> collect, how we use and share information,
              and the rights you have over your data. It applies to our apps, our
              website, and our account and subscription systems.
            </p>
            <p>
              Our guiding principle is simple: we cannot lose, leak, or be
              compelled to hand over what we never collect. We designed{" "}
              {site.name} to run on the minimum amount of personal data possible.
            </p>

            <h2>1. Our no-logs commitment</h2>
            <p>
              While you are connected to {site.name}, we do{" "}
              <strong>not</strong> collect, monitor, or store:
            </p>
            <ul>
              <li>Your browsing history, or the websites and apps you use</li>
              <li>The content of your traffic</li>
              <li>The destinations (IPs or domains) you connect to</li>
              <li>Your DNS queries</li>
              <li>Your original (source) IP address</li>
              <li>
                Connection timestamps, session duration, or bandwidth logs that
                could be tied to your identity or activity
              </li>
            </ul>
            <p>
              We keep no records that could be used to match VPN activity to an
              individual user. Because these logs do not exist, there is nothing
              for us to sell, leak, or disclose in response to a request.
            </p>

            <h2>2. Information we collect</h2>
            <p>
              We collect only what is necessary to operate accounts, deliver and
              secure the service, process subscriptions, and fix problems.
            </p>

            <h3>Account data</h3>
            <p>
              If you create an account, we store your{" "}
              <strong>email address</strong> and a hashed (irreversibly scrambled)
              version of your password. Every user is also assigned a random{" "}
              <strong>account identifier</strong>. You can use the free tier
              without creating an account.
            </p>

            <h3>Device data</h3>
            <p>
              We generate a random <strong>device identifier</strong> for each
              installation. It is used to manage your devices, enforce concurrent
              connection limits, and deliver your free minutes. It is not linked to
              any activity log and does not identify you personally.
            </p>

            <h3>VPN credentials</h3>
            <p>
              To connect, your device holds per-device VPN credentials (such as a
              username, password, and protocol keys). Where possible these are
              stored in your device&apos;s secure keychain rather than on our
              servers, and are rotated when you sign in or out.
            </p>

            <h3>Subscription and payment status</h3>
            <p>
              Subscriptions are purchased and managed through the{" "}
              <strong>Apple App Store</strong>, <strong>Google Play</strong>, or —
              on the web — <strong>Stripe</strong>. We receive a validation of your
              subscription status (active, expired, cancelled) and a transaction
              identifier. We do <strong>not</strong> receive or store your full
              card number or bank details; those are handled entirely by the store
              or payment processor.
            </p>

            <h3>Diagnostic and crash data</h3>
            <p>
              Released apps send anonymized crash and error reports through{" "}
              <strong>Sentry</strong> so we can find and fix bugs. These reports are
              privacy-scrubbed: we strip authentication tokens, VPN credentials,
              passwords, usernames, and IP addresses before they are sent, and
              reporting is disabled entirely in development builds.
            </p>

            <h3>Aggregate operational data</h3>
            <p>
              We use non-identifying, aggregate metrics — such as total server load
              and overall service health — to keep the network reliable and fast.
              This data is not tied to individual users or their activity.
            </p>

            <h3>Temporary connection data</h3>
            <p>
              To enforce the number of devices allowed on one account, our servers
              briefly process a connection&apos;s network address together with
              your random device identifier while the connection is active. This
              information is transient, held only for the life of the session
              (roughly a few minutes), and is not written to any activity log or
              retained afterwards.
            </p>

            <h3>Support communications</h3>
            <p>
              If you contact us (for example, by email or chat), we keep the
              content of that correspondence so we can help you and improve our
              support.
            </p>

            <h3>Website data</h3>
            <p>
              Our website uses essential cookies and privacy-respecting analytics
              needed to run the site, remember your preferences, and process web
              payments. See <strong>Cookies</strong> below.
            </p>

            <h2>3. Information we do not collect</h2>
            <p>
              To be explicit, {site.name} does <strong>not</strong> collect or
              retain: your browsing or traffic content, the sites and services you
              reach through the VPN, your DNS queries, your real IP address, or any
              record that links your activity back to you. We do not sell your
              personal data, and we do not use your data for advertising or
              profiling.
            </p>

            <h2>4. How we use your information</h2>
            <ul>
              <li>To create and manage your account and devices</li>
              <li>To provide, maintain, and secure the VPN service</li>
              <li>
                To validate and manage subscriptions, free minutes, and billing
                status
              </li>
              <li>To prevent abuse and enforce connection limits</li>
              <li>To diagnose crashes and improve reliability and performance</li>
              <li>To respond to your support requests</li>
              <li>To comply with legal obligations that apply to us</li>
            </ul>

            <h2>5. Legal bases for processing (GDPR)</h2>
            <p>
              If you are in the European Economic Area or the United Kingdom, we
              process your data on these legal bases:{" "}
              <strong>performance of a contract</strong> (to provide the service
              you signed up for), <strong>legitimate interests</strong> (to secure
              our network, prevent abuse, and improve the product, balanced against
              your rights), <strong>consent</strong> (where required, which you may
              withdraw at any time), and <strong>legal obligation</strong> (where
              the law requires it).
            </p>

            <h2>6. Payments</h2>
            <p>
              In-app subscriptions are processed by the Apple App Store and Google
              Play under their own terms and privacy policies. Web subscriptions are
              processed by Stripe. Payment details you enter are handled by those
              providers — {site.name} never sees your full card or bank
              information. You can view, change, or cancel a subscription from your
              store account or the account portal at any time.
            </p>

            <h2>7. How we share information</h2>
            <p>
              We do not sell your personal data. We share the limited data above
              only with service providers who help us run {site.name}, and only as
              needed:
            </p>
            <ul>
              <li>
                <strong>Apple and Google</strong> — to validate and manage in-app
                subscriptions.
              </li>
              <li>
                <strong>Stripe</strong> — to process web subscription payments.
              </li>
              <li>
                <strong>Sentry</strong> — to receive privacy-scrubbed crash and
                error reports.
              </li>
              <li>
                <strong>Infrastructure and hosting providers</strong> — to operate
                our servers and backend.
              </li>
            </ul>
            <p>
              These providers are bound by confidentiality and data-protection
              obligations and may only use the information to provide their service
              to us. We may also disclose information if required by valid legal
              process — but because we keep no activity logs, we cannot produce
              records of what you did while connected.
            </p>

            <h2>8. International data transfers</h2>
            <p>
              {site.name} operates servers in many countries so you can connect from
              wherever you need to. Account and subscription data may be processed
              in countries other than your own. Where we transfer personal data out
              of the EEA or UK, we rely on appropriate safeguards such as the
              European Commission&apos;s Standard Contractual Clauses.
            </p>

            <h2>9. Data retention</h2>
            <p>
              We keep account and subscription data only for as long as your account
              is active, or as needed to meet legal, tax, or accounting obligations.
              When you delete your account, we remove your associated account data.
              Because we keep no activity logs, there is no browsing history to
              retain or delete. Transient connection data is discarded when your
              session ends.
            </p>

            <h2>10. Security</h2>
            <p>
              We protect your data with encryption in transit, hashed passwords,
              scoped access controls, and strict limits on who can access our
              systems. No method of transmission or storage is perfectly secure, but
              keeping minimal data is itself our strongest safeguard: there is very
              little to expose. If a breach affecting your personal data occurs, we
              will notify affected users and regulators as required by law.
            </p>

            <h2>11. Your rights</h2>
            <h3>EEA / UK (GDPR)</h3>
            <p>
              You have the right to access, correct, delete, or export your personal
              data; to restrict or object to certain processing; to withdraw
              consent; and to lodge a complaint with your local data protection
              authority.
            </p>
            <h3>California (CCPA/CPRA)</h3>
            <p>
              You have the right to know what personal information we collect, to
              request its deletion, to correct it, and to opt out of its sale or
              sharing. We do <strong>not</strong> sell or share your personal
              information, and we will never discriminate against you for exercising
              your rights.
            </p>
            <p>
              You can delete your account and its data directly in the app at any
              time. For any other request, contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond
              within the timeframes required by applicable law.
            </p>

            <h2>12. Children</h2>
            <p>
              {site.name} is intended for adults and is not directed at children. We
              do not knowingly collect personal data from anyone under 18 (or under
              13 where applicable). If you believe a child has provided us personal
              data, contact us and we will delete it.
            </p>

            <h2>13. Cookies</h2>
            <p>
              Our website uses <strong>essential cookies</strong> required to run
              the site and process payments, and privacy-respecting analytics to
              understand how the site is used. We do not use advertising or
              cross-site tracking cookies. You can control cookies through your
              browser settings.
            </p>

            <h2>14. Third-party links</h2>
            <p>
              Our site and apps may link to third-party websites or services we do
              not control. This policy does not cover them; please review their own
              privacy policies.
            </p>

            <h2>15. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be
              reflected by the &quot;Last updated&quot; date above and, where
              appropriate, announced in the app or by email. Continued use of{" "}
              {site.name} after an update means you accept the revised policy.
            </p>

            <h2>16. Contact us</h2>
            <p>
              Questions, requests, or complaints about privacy? Email us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> and we will be happy
              to help.
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
