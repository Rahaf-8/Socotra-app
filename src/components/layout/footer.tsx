import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import type { FooterNavigationGroup } from "@/types/navigation";
import type { PublicSiteSettings } from "@/types/site-settings";
import type { Locale } from "@/i18n/config";
import { localeDetails } from "@/i18n/config";
import { localizedHref } from "@/i18n/routing";

type FooterProps = {
  navigation: FooterNavigationGroup[];
  settings: PublicSiteSettings;
  locale: Locale;
  labels: { home: string; contact: string; social: string; email: string; phone: string; whatsapp: string; address: string };
};

const missingValue = "Client Information Required";

export function Footer({ navigation, settings, locale, labels }: FooterProps) {
  const contactItems = [
    { key: "email", label: labels.email, icon: Mail },
    { key: "phone", label: labels.phone, icon: Phone },
    { key: "whatsapp", label: labels.whatsapp, icon: MessageCircle },
    { key: "address", label: labels.address, icon: MapPin },
  ] as const;
  const visibleContactItems = contactItems.filter(
    ({ key }) =>
      settings.contact[key] &&
      settings.contact[key] !== missingValue,
  );
  const visibleSocialLinks = settings.socialLinks.filter(
    (social) => social.href && social.label !== missingValue,
  );
  const showInstagram =
    Boolean(settings.instagram.href) &&
    settings.instagram.label !== missingValue;

  return (
    <footer className="bg-charcoal text-white">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href={localizedHref(locale, "/")}
              aria-label={labels.home}
              className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ocean-light focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal"
            >
              <Image
                src={settings.logo.src}
                alt={settings.logo.alt}
                width={886}
                height={886}
                className="h-32 w-auto object-contain brightness-0 invert"
              />
            </Link>
            {settings.companyDescription !== missingValue ? (
              <p className="mt-6 text-base leading-7 text-sand">{settings.companyDescription}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8">
            {navigation.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-bold tracking-wide text-white">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-8 items-center text-sm text-stone transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            {visibleContactItems.length > 0 ? (
              <>
                <h2 className="text-sm font-bold tracking-wide text-white">
                  {labels.contact}
                </h2>
                <ul className="mt-5 space-y-4">
              {visibleContactItems.map(({ key, label, icon: Icon }) => (
                <li key={key} className="flex gap-3 text-sm text-stone">
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-ocean-light"
                  />
                  <span className="min-w-0 break-words">
                    <span className="sr-only">{label}: </span>
                    {settings.contact[key]}
                  </span>
                </li>
              ))}
                </ul>
              </>
            ) : null}

            {visibleSocialLinks.length > 0 || showInstagram ? (
              <div className={visibleContactItems.length > 0 ? "mt-7" : ""}>
              <h2 className="text-sm font-bold tracking-wide text-white">
                {labels.social}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-stone">
                {visibleSocialLinks.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-light"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
                {showInstagram ? (
                  <li className="flex items-center gap-2">
                  <Camera
                    aria-hidden="true"
                    className="size-4 text-ocean-light"
                  />
                    <a
                      href={settings.instagram.href ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-light"
                    >
                      Instagram: {settings.instagram.label}
                    </a>
                  </li>
                ) : null}
              </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 py-6 text-sm text-stone sm:flex-row sm:items-center sm:justify-between">
          {settings.copyrightOwner !== missingValue ? <p>© {new Date().getFullYear()} {settings.copyrightOwner}</p> : <span />}
          <p lang={locale}>{localeDetails[locale].label}</p>
        </div>
      </Container>
    </footer>
  );
}
