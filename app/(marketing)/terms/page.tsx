import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${site.name}.`,
  alternates: { canonical: "/terms" },
};

const updated = "June 9, 2026";

export default function TermsPage() {
  return (
    <section className="pt-20 pb-20">
      <Container>
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {updated}</p>

        <div className="mt-10">
          <Prose>
            <p>
              These Terms govern your use of {site.name}. By using the service you
              agree to them. This is a template and should be reviewed by counsel
              before launch.
            </p>

            <h2>Acceptable use</h2>
            <p>
              {site.name} is intended to protect your privacy and security. You
              agree not to use the service for unlawful activity, to harm others,
              to send spam or malware, or to infringe intellectual property
              rights. You are responsible for complying with the laws that apply
              to you, including any local rules on VPN use.
            </p>

            <h2>Accounts</h2>
            <p>
              You are responsible for keeping your account credentials secure.
              Free access is provided on a limited basis; paid subscriptions
              unlock full access.
            </p>

            <h2>Subscriptions and billing</h2>
            <p>
              Subscriptions are sold and managed through the Apple App Store and
              Google Play. Billing, renewals, and refunds are subject to the
              policies of those stores. Manage or cancel your subscription through
              your store account.
            </p>

            <h2>Service availability</h2>
            <p>
              We work to keep the service reliable but do not guarantee
              uninterrupted access. Network conditions, third-party restrictions,
              and maintenance can affect availability.
            </p>

            <h2>Disclaimer &amp; limitation of liability</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties of any
              kind to the extent permitted by law. To the maximum extent permitted
              by law, {site.name} is not liable for indirect or consequential
              damages arising from your use of the service.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may update these Terms from time to time. Continued use after
              changes take effect constitutes acceptance.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms? Email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
