// Router (OpenVPN) setup content for /download/router and /download/router/[slug].
// Guides are written from scratch (original wording) — MistyVPN supports OpenVPN, so any router with
// an OpenVPN client works. Steps reference: the MistyVPN .ovpn profile, /servers for the hostname, and
// the Account screen for the VPN username/password.

// Downloadable OpenVPN profiles (shared CA, no keys/creds). UDP is the default; TCP for networks
// that block UDP. Both point at gb-lon-1 — change the 'remote' line for a different location.
export const UDP_PROFILE_PATH = "/mistyvpn-openvpn-udp.ovpn";
export const TCP_PROFILE_PATH = "/mistyvpn-openvpn-tcp.ovpn";
export const PROFILE_PATH = UDP_PROFILE_PATH; // back-compat default

export type Step = { title: string; detail: string };
export type Router = {
  slug: string;
  name: string;
  badge: string;      // firmware/family
  summary: string;
  mono: string;       // short monogram for the card badge
  color: string;      // brand-ish accent (hex) for the badge tint
  steps: Step[];
};

// Shown on the landing page — the three things you need first. Kept short: one line each + its own link(s).
export type Prereq = { icon: string; title: string; detail: string; links: { href: string; label: string }[] };
export const prereqs: Prereq[] = [
  {
    icon: "key",
    title: "VPN username & password",
    detail: "Separate from your account login. Get them on the Account page — on the website or in the mobile apps.",
    links: [{ href: "/account", label: "Open Account →" }],
  },
  {
    icon: "globe",
    title: "A server hostname",
    detail: "Pick a location, e.g. gb-lon-1.mistyvpn.com. UDP 10006 · TCP 10007.",
    links: [{ href: "/servers", label: "Server list →" }],
  },
  {
    icon: "download",
    title: "The OpenVPN profile",
    detail: "Certificate included. Set the 'remote' to your server, then upload it.",
    links: [
      { href: UDP_PROFILE_PATH, label: "UDP →" },
      { href: TCP_PROFILE_PATH, label: "TCP →" },
    ],
  },
];

export const routers: Router[] = [
  {
    slug: "dd-wrt",
    name: "DD-WRT",
    badge: "Custom firmware",
    mono: "DD",
    color: "#e0403f",
    summary: "Popular open firmware for Linksys, Netgear, TP-Link and many other routers.",
    steps: [
      { title: "Open the router admin", detail: "In a browser, go to your router's address (often 192.168.1.1) and sign in." },
      { title: "Go to the OpenVPN client", detail: "Open Services → VPN and set 'OpenVPN Client' to Enable." },
      { title: "Enter the server & ports", detail: "Set Server IP/Name to your MistyVPN hostname (e.g. gb-lon-1.mistyvpn.com), Port 10006, Tunnel Device TUN, Protocol UDP." },
      { title: "Set the encryption", detail: "Encryption Cipher: AES-256-GCM. Hash Algorithm: SHA256. Enable 'User Pass Authentication' and enter your VPN username and password." },
      { title: "Paste the certificate", detail: "Open the downloaded .ovpn in a text editor and copy everything between <ca> and </ca> into the 'CA Cert' box." },
      { title: "Add the extra options", detail: "In 'Additional Config', add: remote-cert-tls off, then: reneg-sec 120, then: auth-nocache." },
      { title: "Save & apply", detail: "Click Save, then Apply Settings. Check Status → OpenVPN to confirm the tunnel is connected." },
    ],
  },
  {
    slug: "asuswrt",
    name: "Asus (AsusWRT / Merlin)",
    badge: "Built-in OpenVPN",
    mono: "AS",
    color: "#00a0e0",
    summary: "Most Asus routers (stock firmware and Asuswrt-Merlin) have a built-in OpenVPN client.",
    steps: [
      { title: "Open the router admin", detail: "Go to router.asus.com (or 192.168.1.1) and sign in." },
      { title: "Open VPN → VPN Client", detail: "In the left menu choose VPN, then the 'VPN Client' tab, and click 'Add profile'." },
      { title: "Choose OpenVPN", detail: "Pick the OpenVPN tab. Give the profile a description like 'MistyVPN London'." },
      { title: "Enter your credentials", detail: "Username and Password = your MistyVPN VPN username/password (Account → VPN Credentials)." },
      { title: "Import the profile", detail: "Under 'Import .ovpn file', upload the MistyVPN profile you downloaded, then click Upload." },
      { title: "Activate", detail: "Click OK, then hit 'Activate' next to the profile. The status turns to a blue tick when connected." },
    ],
  },
  {
    slug: "openwrt",
    name: "OpenWRT",
    badge: "Custom firmware",
    mono: "OW",
    color: "#00b5e2",
    summary: "Lightweight open router OS. Uses the OpenVPN package + LuCI web UI.",
    steps: [
      { title: "Install the OpenVPN packages", detail: "In LuCI, go to System → Software, Update lists, then install: openvpn-openssl and luci-app-openvpn." },
      { title: "Open the OpenVPN app", detail: "Go to VPN → OpenVPN. In 'Upload OpenVPN configuration', give it a name (e.g. mistyvpn) and upload the .ovpn file, then Add." },
      { title: "Add your credentials", detail: "Create a file with your VPN username on line 1 and password on line 2. In the config, point 'auth-user-pass' to that file (e.g. auth-user-pass /etc/openvpn/misty-creds.txt)." },
      { title: "Enable & start", detail: "Tick 'Enabled' next to the config and click Start. Check the log (or Status) to confirm the tunnel is up." },
    ],
  },
  {
    slug: "freshtomato",
    name: "Tomato / FreshTomato",
    badge: "Custom firmware",
    mono: "TO",
    color: "#e2703a",
    summary: "Tomato-family firmware (FreshTomato, AdvancedTomato) with a built-in OpenVPN client.",
    steps: [
      { title: "Open the router admin", detail: "Go to your router's address and sign in." },
      { title: "Open VPN Tunneling → OpenVPN Client", detail: "In the menu choose VPN Tunneling → OpenVPN Client, on the 'Basic' tab." },
      { title: "Set the connection", detail: "Interface Type: TUN. Protocol: UDP. Server Address/Port: your MistyVPN hostname and 10006. Firewall: Automatic." },
      { title: "Auth & encryption", detail: "Authorization Mode: TLS. Username/Password Authentication: enabled, then enter your VPN username/password." },
      { title: "Advanced options", detail: "On the 'Advanced' tab set cipher AES-256-GCM, and in Custom Configuration add: reneg-sec 120 and remote-cert-tls off." },
      { title: "Paste the certificate", detail: "On the 'Keys' tab, paste the <ca>…</ca> block from the .ovpn into 'Certificate Authority'. Save, then Start Now." },
    ],
  },
  {
    slug: "pfsense",
    name: "pfSense / OPNsense",
    badge: "Firewall/router OS",
    mono: "PF",
    color: "#c0392b",
    summary: "Full firewall OSes for dedicated router boxes — OpenVPN client under the VPN menu.",
    steps: [
      { title: "Add the CA", detail: "System → Cert Manager → CAs → Add. Paste the <ca>…</ca> block from the .ovpn and save." },
      { title: "Create the OpenVPN client", detail: "VPN → OpenVPN → Clients → Add. Server mode: Peer to Peer (SSL/TLS). Protocol UDP, device tun." },
      { title: "Server & auth", detail: "Server host/address: your MistyVPN hostname, port 10006. Tick 'Infinitely resolve server'. Enter your VPN username/password. Peer CA: the CA you just added." },
      { title: "Encryption", detail: "Data Encryption: AES-256-GCM. Auth digest: SHA256. Leave the TLS key empty (we don't use tls-crypt)." },
      { title: "Save & assign", detail: "Save, then create an interface + outbound NAT for the OpenVPN client so LAN traffic routes through it. Check Status → OpenVPN for 'up'." },
    ],
  },
  {
    slug: "gl-inet",
    name: "GL.iNet",
    badge: "Travel routers",
    mono: "GL",
    color: "#f5a623",
    summary: "GL.iNet travel/home routers with an easy OpenVPN client in the admin panel.",
    steps: [
      { title: "Open the admin panel", detail: "Go to 192.168.8.1 and sign in." },
      { title: "Open the OpenVPN client", detail: "In the menu choose VPN → OpenVPN Client → 'Add a New OpenVPN Configuration'." },
      { title: "Upload the profile", detail: "Choose 'Upload a file', select the MistyVPN .ovpn, name it, and save." },
      { title: "Enter credentials & connect", detail: "When prompted (or under the profile), enter your VPN username/password, then toggle the connection on. The globe icon turns green when connected." },
    ],
  },
  {
    slug: "generic",
    name: "Any other OpenVPN router",
    badge: "Universal",
    mono: "★",
    color: "#7c8aff",
    summary: "Any router with an OpenVPN client works — the settings are the same everywhere.",
    steps: [
      { title: "Find the OpenVPN client", detail: "In your router's admin, look for a VPN / OpenVPN Client section (wording varies by brand)." },
      { title: "Import or enter the settings", detail: "Upload the MistyVPN .ovpn if the router supports import; otherwise enter: server = your MistyVPN hostname, port 10006 (UDP) or 10007 (TCP), device TUN, cipher AES-256-GCM, auth SHA256." },
      { title: "Certificate", detail: "Paste the <ca>…</ca> block from the .ovpn as the CA certificate. No client certificate is needed." },
      { title: "Credentials", detail: "Enable username/password auth and enter your MistyVPN VPN username/password. Add 'reneg-sec 120' and disable server-cert-type checking if the router offers it." },
      { title: "Connect", detail: "Save and start the connection, then confirm it's connected in the router's VPN status page." },
    ],
  },
];
