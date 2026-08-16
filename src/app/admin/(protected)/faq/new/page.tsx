import Link from "next/link";
import { emptyFaq, FaqForm } from "@/components/admin/content/faq-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminFaqCategories } from "@/lib/content/faq-repository";
export default async function NewFaqPage(){await requireAdmin();const categories=await getAdminFaqCategories();const options=categories.map(c=>({id:c.id,label:c.translations.find(v=>v.locale==="en")?.label??c.key}));return <section><nav className="text-sm" aria-label="Breadcrumb"><Link href="/admin/faq" className="underline">FAQ</Link> / New</nav><h1 className="my-6 font-display text-5xl font-semibold">Create FAQ item</h1><FaqForm initialValue={{...emptyFaq,categoryId:options[0]?.id??""}} categories={options}/></section>}
