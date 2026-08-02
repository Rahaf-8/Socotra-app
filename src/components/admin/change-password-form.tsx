"use client";

import { useActionState } from "react";

import { changeAdminPassword, type AdminFormState } from "@/lib/actions/admin-auth";
import { AdminFormButton } from "@/components/admin/admin-form-button";

const initialState: AdminFormState = {};

export function ChangePasswordForm() {
  const [state, action] = useActionState(changeAdminPassword, initialState);
  const fields = [
    ["currentPassword", "Current password", "current-password"],
    ["newPassword", "New password", "new-password"],
    ["confirmPassword", "Confirm new password", "new-password"],
  ] as const;
  return (
    <form action={action} className="space-y-5" noValidate>
      {fields.map(([name, label, autoComplete]) => {
        const error = state.fieldErrors?.[name]?.[0];
        return <div key={name}>
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label>
          <input id={name} name={name} type="password" autoComplete={autoComplete} required maxLength={72} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className="min-h-12 w-full rounded-xl border bg-white px-4 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20" />
          {error ? <p id={`${name}-error`} className="mt-2 text-sm text-red-700">{error}</p> : null}
        </div>;
      })}
      {state.error ? <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <p className="text-sm leading-6 text-charcoal/65">Use 14–72 characters with uppercase, lowercase, number, and symbol characters. You will sign in again after changing it.</p>
      <AdminFormButton idle="Change Password" pending="Changing Password…" />
    </form>
  );
}
