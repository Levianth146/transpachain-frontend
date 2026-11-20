/** Shared primary nav — keep ClientNav + MobileNav in sync. */
export const PRIMARY_NAV = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/campaigns/create", label: "Create" },
  { href: "/transparency", label: "Transparency" },
  { href: "/yield", label: "Yield" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/governance", label: "Governance" },
  { href: "/about", label: "About" },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/campaigns") {
    return (
      pathname === "/campaigns" ||
      (pathname.startsWith("/campaigns/") && !pathname.startsWith("/campaigns/create"))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
