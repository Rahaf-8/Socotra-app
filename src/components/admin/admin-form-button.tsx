"use client";

import { useFormStatus } from "react-dom";

export function AdminFormButton({ idle, pending }: { idle: string; pending: string }) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      disabled={status.pending}
      className="min-h-12 w-full rounded-full bg-ocean px-6 py-3 font-semibold text-white transition hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:cursor-wait disabled:opacity-60"
    >
      {status.pending ? pending : idle}
    </button>
  );
}
