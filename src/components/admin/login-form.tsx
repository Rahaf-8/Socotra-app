"use client";

import { useActionState } from "react";

import { loginAdmin, type AdminFormState } from "@/lib/actions/admin-auth";
import { AdminFormButton } from "@/components/admin/admin-form-button";

const initialState: AdminFormState = {};

export function LoginForm({ callbackUrl = "/admin" }: { callbackUrl?: string }) {
  const [state, action] = useActionState(loginAdmin, initialState);
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} aria-invalid={Boolean(state.error)} className="min-h-12 w-full rounded-xl border bg-white px-4 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20" />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={72} aria-invalid={Boolean(state.error)} aria-describedby={state.error ? "login-error" : undefined} className="min-h-12 w-full rounded-xl border bg-white px-4 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20" />
      </div>
      {state.error ? <p id="login-error" role="alert" className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <AdminFormButton idle="Sign In" pending="Signing In…" />
    </form>
  );
}
