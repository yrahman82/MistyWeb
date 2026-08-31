// Server-location directory for the public /servers page.
// GENERATED from the Servers DB + Cloudflare subdomains (cc-cty-N.mistyvpn.com).
// All servers are provisioned identically → every location supports every protocol.
export type ServerLoc = { city: string; country: string; cc: string; host: string; flag: string };

// Protocols every MistyVPN server exposes (app + router/manual use).
export const serverProtocols = ["WireGuard", "VLESS (Reality)", "Hysteria2", "OpenVPN UDP", "OpenVPN TCP"] as const;

export const serverLocations: ServerLoc[] = [
  { city: "Sydney", country: "Australia", cc: "au", host: "au-syd-1.mistyvpn.com", flag: "🇦🇺" },
  { city: "Vienna", country: "Austria", cc: "at", host: "at-vie-1.mistyvpn.com", flag: "🇦🇹" },
  { city: "Brussels", country: "Belgium", cc: "be", host: "be-bru-1.mistyvpn.com", flag: "🇧🇪" },
  { city: "Sao Paulo", country: "Brazil", cc: "br", host: "br-sao-1.mistyvpn.com", flag: "🇧🇷" },
  { city: "Sofia", country: "Bulgaria", cc: "bg", host: "bg-sof-1.mistyvpn.com", flag: "🇧🇬" },
  { city: "Montreal", country: "Canada", cc: "ca", host: "ca-mtl-1.mistyvpn.com", flag: "🇨🇦" },
  { city: "Toronto", country: "Canada", cc: "ca", host: "ca-tor-1.mistyvpn.com", flag: "🇨🇦" },
  { city: "Beijing", country: "China", cc: "cn", host: "cn-pek-1.mistyvpn.com", flag: "🇨🇳" },
  { city: "Prague", country: "Czech Republic", cc: "cz", host: "cz-prg-1.mistyvpn.com", flag: "🇨🇿" },
  { city: "Copenhagen", country: "Denmark", cc: "dk", host: "dk-cph-1.mistyvpn.com", flag: "🇩🇰" },
  { city: "Paris", country: "France", cc: "fr", host: "fr-par-1.mistyvpn.com", flag: "🇫🇷" },
  { city: "Nuremberg", country: "Germany", cc: "de", host: "de-nue-1.mistyvpn.com", flag: "🇩🇪" },
  { city: "Athens", country: "Greece", cc: "gr", host: "gr-ath-1.mistyvpn.com", flag: "🇬🇷" },
  { city: "Hong Kong", country: "Hong Kong", cc: "hk", host: "hk-hkg-1.mistyvpn.com", flag: "🇭🇰" },
  { city: "Mumbai", country: "India", cc: "in", host: "in-bom-1.mistyvpn.com", flag: "🇮🇳" },
  { city: "Jakarta", country: "Indonesia", cc: "id", host: "id-jkt-1.mistyvpn.com", flag: "🇮🇩" },
  { city: "Dublin", country: "Ireland", cc: "ie", host: "ie-dub-1.mistyvpn.com", flag: "🇮🇪" },
  { city: "Milan", country: "Italy", cc: "it", host: "it-mil-1.mistyvpn.com", flag: "🇮🇹" },
  { city: "Tokyo", country: "Japan", cc: "jp", host: "jp-tyo-1.mistyvpn.com", flag: "🇯🇵" },
  { city: "Mexico City", country: "Mexico", cc: "mx", host: "mx-mex-1.mistyvpn.com", flag: "🇲🇽" },
  { city: "Amsterdam", country: "Netherlands", cc: "nl", host: "nl-ams-1.mistyvpn.com", flag: "🇳🇱" },
  { city: "Oslo", country: "Norway", cc: "no", host: "no-osl-1.mistyvpn.com", flag: "🇳🇴" },
  { city: "Warsaw", country: "Poland", cc: "pl", host: "pl-waw-1.mistyvpn.com", flag: "🇵🇱" },
  { city: "Lisbon", country: "Portugal", cc: "pt", host: "pt-lis-1.mistyvpn.com", flag: "🇵🇹" },
  { city: "Moscow", country: "Russia", cc: "ru", host: "ru-mow-1.mistyvpn.com", flag: "🇷🇺" },
  { city: "Singapore", country: "Singapore", cc: "sg", host: "sg-sin-1.mistyvpn.com", flag: "🇸🇬" },
  { city: "Madrid", country: "Spain", cc: "es", host: "es-mad-1.mistyvpn.com", flag: "🇪🇸" },
  { city: "Stockholm", country: "Sweden", cc: "se", host: "se-sto-1.mistyvpn.com", flag: "🇸🇪" },
  { city: "Bern", country: "Switzerland", cc: "ch", host: "ch-brn-1.mistyvpn.com", flag: "🇨🇭" },
  { city: "Dubai", country: "United Arab Emirates", cc: "ae", host: "ae-dxb-1.mistyvpn.com", flag: "🇦🇪" },
  { city: "London", country: "United Kingdom", cc: "gb", host: "gb-lon-1.mistyvpn.com", flag: "🇬🇧" },
  { city: "Manchester", country: "United Kingdom", cc: "gb", host: "gb-man-1.mistyvpn.com", flag: "🇬🇧" },
  { city: "Chicago", country: "United States", cc: "us", host: "us-chi-1.mistyvpn.com", flag: "🇺🇸" },
  { city: "Dallas", country: "United States", cc: "us", host: "us-dal-1.mistyvpn.com", flag: "🇺🇸" },
  { city: "Los Angeles", country: "United States", cc: "us", host: "us-lax-1.mistyvpn.com", flag: "🇺🇸" },
  { city: "Miami", country: "United States", cc: "us", host: "us-mia-1.mistyvpn.com", flag: "🇺🇸" },
  { city: "New York", country: "United States", cc: "us", host: "us-nyc-1.mistyvpn.com", flag: "🇺🇸" },
  { city: "Seattle", country: "United States", cc: "us", host: "us-sea-1.mistyvpn.com", flag: "🇺🇸" },
];
