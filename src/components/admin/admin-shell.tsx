"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { logoutAdmin } from "@/lib/actions/admin-auth";

const adminNavigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/booking-requests", label: "Booking Requests" },
  { href: "/admin/contact-requests", label: "Contact Requests" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/tours", label: "Tours" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact Content" },
  { href: "/admin/gallery", label: "Gallery" },
] as const;

type AdminShellProps = {
  admin: { name: string; email: string };
  logo: { src: string; alt: string };
  children: React.ReactNode;
};

type NavigationContentProps = Pick<AdminShellProps, "admin" | "logo"> & {
  pathname: string;
  onNavigate?: () => void;
  closeButton?: React.ReactNode;
};

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationContent({
  admin,
  logo,
  pathname,
  onNavigate,
  closeButton,
}: NavigationContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-[4.5rem] items-center justify-between gap-3 border-b border-white/15 px-5 py-3 lg:min-h-0 lg:block lg:border-b-0 lg:px-6 lg:pb-0 lg:pt-7">
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={130}
            height={56}
            className="h-11 w-auto rounded-lg bg-white/95 object-contain px-2 lg:h-12"
          />
        </Link>
        <div className="flex items-center gap-3 lg:mt-5 lg:justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ocean-light">
            Website Admin
          </p>
          {closeButton}
        </div>
      </div>

      <nav
        aria-label="Administrator"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 lg:px-5 lg:py-7 [scrollbar-width:none]  [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="space-y-1.5">
          {adminNavigation.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-12 items-center rounded-xl  px-4 py-2.5 font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal ${
                    active
                      ? "border-ocean-light bg-white/10"
                      : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/15 px-5 py-5 lg:px-6 lg:pb-7">
        <p className="truncate font-semibold text-white">{admin.name}</p>
        <p className="mt-1 truncate text-sm text-white/60">{admin.email}</p>
        <div className="mt-5 space-y-3">
          <Link
            href="/en"
            onClick={onNavigate}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            View public site
          </Link>
          <form action={logoutAdmin}>
            <button className="min-h-11 w-full rounded-full bg-white px-4 text-sm font-semibold text-charcoal outline-none transition-colors hover:bg-soft-sand focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal">
              Log Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ admin, logo, children }: AdminShellProps) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPathname(null);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeDrawer = (restoreFocus = false) => {
    setOpenPathname(null);
    if (restoreFocus) menuButtonRef.current?.focus();
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-4 border-b bg-charcoal px-4 text-white shadow-nav sm:px-6 lg:hidden">
        <Link
          href="/admin/dashboard"
          className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={112}
            height={48}
            className="h-11 w-auto rounded-lg bg-white/95 object-contain px-2"
          />
        </Link>
        <p className="min-w-0 flex-1 truncate text-center text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ocean-light sm:text-xs">
          Website Admin
        </p>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open administrator navigation"
          aria-expanded={isOpen}
          aria-controls="admin-mobile-drawer"
          onClick={() => setOpenPathname(pathname)}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          <Menu aria-hidden="true" />
        </button>
      </header>

      <aside className="sticky top-0 hidden h-screen min-h-0 flex-col bg-charcoal text-white lg:flex">
        <NavigationContent admin={admin} logo={logo} pathname={pathname} />
      </aside>

      <div
        aria-hidden="true"
        onClick={() => closeDrawer(true)}
        className={`fixed inset-0 z-40 bg-charcoal/55 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        id="admin-mobile-drawer"
        aria-label="Administrator navigation drawer"
        aria-hidden={!isOpen}
        // `inert` keeps closed-drawer controls out of keyboard navigation.
        inert={!isOpen ? true : undefined}
        className={`fixed inset-y-0 start-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col bg-charcoal text-white shadow-soft transition-[transform,visibility] duration-200 ease-out lg:hidden ${
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <NavigationContent
          admin={admin}
          logo={logo}
          pathname={pathname}
          onNavigate={() => closeDrawer()}
          closeButton={
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close administrator navigation"
              onClick={() => closeDrawer(true)}
              className="inline-flex size-12 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal lg:hidden"
            >
              <X aria-hidden="true" />
            </button>
          }
        />
      </aside>

      <main className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
        {children}
      </main>
    </div>
  );
}
