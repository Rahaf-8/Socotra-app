import type { ComponentPropsWithoutRef } from "react";

import { clsx } from "clsx";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={clsx("py-20 sm:py-24 lg:py-32 xl:py-36", className)}
      {...props}
    />
  );
}
