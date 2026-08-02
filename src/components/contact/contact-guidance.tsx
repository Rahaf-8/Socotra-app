import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import type { ContactPageData } from "@/types/contact";

type ContactGuidanceProps = {
  content: NonNullable<ContactPageData["guidance"]>;
};

export function ContactGuidance({ content }: ContactGuidanceProps) {
  const items = content.items
    .filter((item) => item.published && item.text)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <aside className="rounded-[1.75rem] bg-palm p-6 text-white sm:p-8">
      {content.eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sand">
          {content.eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-semibold">
        {content.title}
      </h2>
      {content.description ? (
        <p className="mt-4 text-sm leading-7 text-white/70">
          {content.description}
        </p>
      ) : null}
      {items.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm leading-6">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-ocean-light"
              />
              {item.text}
            </li>
          ))}
        </ul>
      ) : null}
      {content.faqAction ? (
        <Link
          href={content.faqAction.href}
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-white outline-none transition-colors hover:text-ocean-light focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-palm"
        >
          {content.faqAction.label}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      ) : null}
    </aside>
  );
}
