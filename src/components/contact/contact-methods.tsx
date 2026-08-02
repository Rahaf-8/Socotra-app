import { Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";

import type { ContactMethod, ContactMethodType } from "@/types/contact";

const iconRegistry = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  location: MapPin,
  social: Share2,
} satisfies Record<ContactMethodType, typeof Mail>;

type ContactMethodsProps = {
  methods: readonly ContactMethod[];
};

export function ContactMethods({ methods }: ContactMethodsProps) {
  const visibleMethods = methods
    .filter(
      (method) =>
        method.published && method.label && method.value && method.href,
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (visibleMethods.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="contact-methods-heading">
      <h2
        id="contact-methods-heading"
        className="font-display text-3xl font-semibold text-charcoal"
      >
        Contact options
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visibleMethods.map((method) => {
          const Icon = iconRegistry[method.icon ?? method.type];

          return (
            <a
              key={method.id}
              href={method.href}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              className="rounded-2xl border border-warm-line bg-white p-5 outline-none transition-colors hover:border-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"
            >
              <Icon aria-hidden="true" className="size-5 text-ocean" />
              <h3 className="mt-4 text-sm font-bold text-charcoal">
                {method.label}
              </h3>
              <p className="mt-1 break-words text-sm text-charcoal/68">
                {method.value}
              </p>
              {method.description ? (
                <p className="mt-3 text-sm leading-6 text-charcoal/60">
                  {method.description}
                </p>
              ) : null}
            </a>
          );
        })}
      </div>
    </section>
  );
}
