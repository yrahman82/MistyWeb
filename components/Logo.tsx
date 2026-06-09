import Image from "next/image";

// The real MistyVPN shield logo (from the app asset).
export function Logo({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/logo.png"
      alt="MistyVPN logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
