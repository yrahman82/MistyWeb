import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delete Your Account & Data",
  description: `How to delete your ${site.name} account and associated data, what is removed, and what is retained.`,
  alternates: { canonical: "/delete-account" },
};

const updated = "July 15, 2026";

export default function DeleteAccountPage() {
  return (
    <section className="pt-20 pb-20">
      <Container>
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Delete your {site.name} account &amp; data
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {updated}</p>

        <div className="mt-10">
          <Prose>
            <p>
              This page explains how to request deletion of your {site.name}{" "}
              account and the data associated with it. {site.name} is developed and
              operated by {site.name}.
            </p>

            <h2>Delete your account from inside the app</h2>
            <p>
              The fastest way to permanently delete your account and its data is
              directly in the {site.name} app:
            </p>
            <ul>
              <li>Open the {site.name} app on your device.</li>
              <li>
                Go to <strong>Account</strong>.
              </li>
              <li>
                Tap <strong>Delete Account</strong>.
              </li>
              <li>
                Confirm when prompted. Your account and associated data are
                deleted immediately.
              </li>
            </ul>
            <p>
              This is available on iPhone, iPad, Android, Mac, and Android TV.
            </p>

            <h2>Can&apos;t access the app?</h2>
            <p>
              If you are unable to use the in-app option, email us from the address
              associated with your account at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> with the subject
              &quot;Delete my account&quot;. We will verify your request and delete
              your account within <strong>30 days</strong>.
            </p>

            <h2>What data is deleted</h2>
            <p>
              When your account is deleted, we remove the personal data tied to it,
              including:
            </p>
            <ul>
              <li>Your email address and account identifier</li>
              <li>Your hashed password</li>
              <li>Your VPN credentials and device records</li>
              <li>The link between your account and any subscription</li>
            </ul>
            <p>
              Because {site.name} is a strict no-logs service, we hold no browsing
              history, traffic, DNS, or IP activity records to begin with — so
              there is no such data to delete.
            </p>

            <h2>What may be retained</h2>
            <ul>
              <li>
                <strong>Billing and transaction records:</strong> where required to
                meet legal, tax, or accounting obligations, we may retain minimal
                transaction records for the period required by law (typically up to
                7 years). These are kept only as needed for compliance.
              </li>
              <li>
                <strong>Store subscriptions:</strong> subscriptions purchased
                through the Apple App Store or Google Play are managed by those
                stores. Deleting your account does not cancel an active store
                subscription — cancel it from your Apple or Google account to stop
                future billing.
              </li>
            </ul>

            <h2>Questions</h2>
            <p>
              For anything related to your account or data, contact us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>. See our{" "}
              <a href="/privacy">Privacy Policy</a> for full details on how we
              handle data.
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
