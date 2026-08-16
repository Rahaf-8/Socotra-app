import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactMethodEditor, EnquiryTypeEditor } from "@/components/admin/content/contact-entities";
import { PageContentForm } from "@/components/admin/content/page-content-form";
import { deleteContactMethod, deleteOrArchiveEnquiryType } from "@/lib/actions/content-admin";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminContactEntities, getAdminContentPageInput } from "@/lib/content/page-repository";

export default async function AdminContactPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  await requireAdmin();
  const [page, [methods, enquiries], query] = await Promise.all([getAdminContentPageInput("contact"), getAdminContactEntities(), searchParams]);
  if (!page) notFound();
  const messages: Record<string, string> = { "method-deleted": "Contact method deleted.", "enquiry-deleted": "Unreferenced enquiry type deleted.", "enquiry-archived": "This enquiry type has historical requests, so it was archived instead of deleted.", "confirmation-required": "Confirm the destructive action before continuing.", missing: "The record no longer exists." };
  return <section>
    <nav className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Contact</nav>
    <h1 className="mt-5 font-display text-5xl font-semibold">Contact content</h1>
    <p className="mb-8 mt-3 max-w-3xl text-charcoal/65">Manage public copy, methods, and enquiry labels only. Incoming request handling is not implemented.</p>
    {query.result && messages[query.result] ? <p role="status" className="mb-6 rounded-xl border bg-white p-4">{messages[query.result]}</p> : null}
    <PageContentForm initialValue={page} />
    <section className="mt-12 rounded-2xl border bg-white p-5 shadow-soft sm:p-7">
      <h2 className="font-display text-3xl font-semibold">Contact methods</h2>
      <p className="mt-2 text-sm text-charcoal/65">Create only approved real values. New records begin as drafts and all links are scheme-validated.</p>
      <div className="mt-5 space-y-4">
        <ContactMethodEditor value={{ type: "email", value: "", href: "", external: false, displayOrder: methods.length + 1, status: "draft", en: { label: "", description: "" }, ar: { label: "", description: "" } }} />
        {methods.map((method) => { const en = method.translations.find((value) => value.locale === "en")!, ar = method.translations.find((value) => value.locale === "ar")!; return <div key={method.id}><ContactMethodEditor value={{ id: method.id, type: method.type, value: method.value, href: method.href ?? "", external: method.external, displayOrder: method.displayOrder, status: method.status, en: { label: en.label, description: en.description ?? "" }, ar: { label: ar.label, description: ar.description ?? "" } }} /><form action={deleteContactMethod} className="mt-2 px-4"><input type="hidden" name="id" value={method.id} /><label className="text-sm"><input type="checkbox" required name="confirm" /> Confirm permanent deletion</label><button className="ms-3 text-sm text-red-700 underline">Delete</button></form></div>; })}
      </div>
    </section>
    <section className="mt-8 rounded-2xl border bg-white p-5 shadow-soft sm:p-7">
      <h2 className="font-display text-3xl font-semibold">Enquiry types</h2>
      <p className="mt-2 text-sm text-charcoal/65">Published labels feed the existing form selector. Saving or deleting does not change submission behavior.</p>
      <div className="mt-5 space-y-4">
        <EnquiryTypeEditor value={{ value: "", displayOrder: enquiries.length + 1, status: "draft", en: "", ar: "" }} />
        {enquiries.map((item) => { const en = item.translations.find((value) => value.locale === "en")!, ar = item.translations.find((value) => value.locale === "ar")!; return <div key={item.id}><EnquiryTypeEditor value={{ id: item.id, value: item.value, displayOrder: item.displayOrder, status: item.status, en: en.label, ar: ar.label }} /><form action={deleteOrArchiveEnquiryType} className="mt-2 px-4"><input type="hidden" name="id" value={item.id} /><label className="text-sm"><input type="checkbox" required name="confirm" /> Confirm delete/archive</label><button className="ms-3 text-sm text-red-700 underline">Delete or archive</button><span className="ms-3 text-xs text-charcoal/60">{item._count.contactRequests} historical request(s)</span></form></div>; })}
      </div>
    </section>
  </section>;
}
