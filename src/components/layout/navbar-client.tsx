"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import type { NavigationItem } from "@/types/navigation";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { localizedHref } from "@/i18n/routing";

type NavbarClientProps = {
  navigation: NavigationItem[];
  bookingItem: NavigationItem;
  logo: {
    src: string;
    alt: string;
  };
  locale: Locale;
  labels: { home: string; primary: string; menuOpen: string; menuClose: string; changeLanguage: string };
};

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/" || href.split("/").filter(Boolean).length === 1) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavbarClient({
  navigation,
  bookingItem,
  logo,
  locale,
  labels,
}: NavbarClientProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileBookingLinkRef = useRef<HTMLAnchorElement>(null);

  const isTransparent = pathname === `/${locale}` && !hasScrolled && !isMenuOpen;

  useEffect(() => {
    const updateScrolledState = () => setHasScrolled(window.scrollY > 24);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (event.key === "Tab") {
        const firstItem = firstMobileLinkRef.current;
        const lastItem = mobileBookingLinkRef.current;

        if (!firstItem || !lastItem) {
          return;
        }

        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        isTransparent
          ? "border-transparent bg-transparent text-white"
          : "border-warm-line/70 bg-white/95 text-charcoal shadow-nav backdrop-blur-xl"
      }`}
    >
      <Container>
        <nav
          aria-label={labels.primary}
          className="grid h-20 grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]"
        >
          <Link
            href={localizedHref(locale, "/")}
            aria-label={labels.home}
            className="group relative flex h-20 w-28 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 sm:w-32"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={886}
              height={886}
              className={`absolute left-1/2 top-1/2 h-24 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition duration-300 sm:h-28 ${
                isTransparent ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const isActive = isCurrentRoute(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 ${
                      isTransparent
                        ? "hover:bg-white/12"
                        : "hover:bg-soft-sand hover:text-deep-ocean"
                    } ${
                      isActive
                        ? isTransparent
                          ? "text-white after:absolute after:inset-x-4 after:bottom-1 after:h-px after:bg-white"
                          : "bg-soft-sand text-deep-ocean"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center justify-end gap-3 lg:flex">
            <LanguageSwitcher locale={locale} label={labels.changeLanguage} compact />
            <Link
              href={bookingItem.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ocean px-6 text-sm font-bold text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-deep-ocean hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"
            >
              {bookingItem.label}
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen ? labels.menuClose : labels.menuOpen
            }
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className={`inline-flex size-11 items-center justify-center justify-self-end rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 lg:hidden ${
              isTransparent ? "hover:bg-white/12" : "hover:bg-soft-sand"
            }`}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </nav>
      </Container>

      <div
        className={`fixed inset-0 top-20 bg-charcoal/35 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div
        id="mobile-navigation"
        className={`absolute inset-x-0 top-full origin-top border-b border-warm-line bg-white text-charcoal shadow-soft transition-[opacity,transform,visibility] duration-300 lg:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <Container className="py-5">
          <ul className="flex flex-col gap-1">
            {navigation.map((item, index) => {
              const isActive = isCurrentRoute(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition-colors outline-none hover:bg-soft-sand focus-visible:ring-2 focus-visible:ring-ocean ${
                      isActive ? "bg-soft-sand text-deep-ocean" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex justify-center">
            <LanguageSwitcher locale={locale} label={labels.changeLanguage} />
          </div>
          <Link
            ref={mobileBookingLinkRef}
            href={bookingItem.href}
            onClick={closeMenu}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ocean px-6 text-base font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"
          >
            {bookingItem.label}
          </Link>
        </Container>
      </div>
    </header>
  );
}
