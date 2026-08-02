"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { FAQAnswerBlock, FAQItem } from "@/types/faq";

type FAQAccordionProps = {
  items: readonly FAQItem[];
};

function FAQAnswer({ blocks }: { blocks: readonly FAQAnswerBlock[] }) {
  return (
    <div className="space-y-4 text-[0.95rem] leading-7 text-charcoal/75 sm:text-base">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "list") {
          return (
            <ul key={key} className="space-y-2 ps-5">
              {block.items.map((item) => (
                <li key={item} className="list-disc ps-1 marker:text-ocean">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "subheading") {
          return (
            <h4
              key={key}
              className="pt-3 text-xs font-bold tracking-[0.2em] text-palm"
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={key}
              className="border-s-2 border-ocean bg-ocean/5 px-5 py-4 font-medium text-charcoal"
            >
              &ldquo;{block.text}&rdquo;
            </blockquote>
          );
        }

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  return (
    <div className="divide-y divide-warm-line border-y border-warm-line">
      {items.map((item) => {
        const isOpen = openItemId === item.id;
        const buttonId = `faq-question-${item.id}`;
        const panelId = `faq-answer-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenItemId(isOpen ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-start text-base font-semibold text-charcoal outline-none transition-colors hover:text-ocean focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 sm:py-6 sm:text-lg"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-5 shrink-0 text-ocean transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={1.8}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-7 pe-1 sm:pe-12"
            >
              <FAQAnswer blocks={item.answer} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
