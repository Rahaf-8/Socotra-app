import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContentForm } from "@/components/admin/content/page-content-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminContentPageInput } from "@/lib/content/page-repository";
export default async function AdminAboutPage(){await requireAdmin();const page=await getAdminContentPageInput("about");if(!page)notFound();return <section><nav className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / About</nav><h1 className="mt-5 font-display text-5xl font-semibold">About content</h1><p className="mb-8 mt-3 max-w-3xl text-charcoal/65">Edit the existing structured page, sections, features and SEO. Images remain the approved existing assets; uploads are outside this phase.</p><PageContentForm initialValue={page}/></section>}
