import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, the /chat proxy (rewritten to the chat relay — must NOT be
  // treated as a localizable page), Next internals, and files with an extension (static assets).
  matcher: ["/((?!api|chat|_next|_vercel|.*\\..*).*)"],
};
