import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password · MistyVPN",
  description: "Reset your MistyVPN account password.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
