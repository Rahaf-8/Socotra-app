import Link from "next/link";
import { TourForm, emptyTour } from "@/components/admin/tours/tour-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getTourPackageTypeOptions } from "@/lib/tours/tour-package-type-repository";

export default async function NewTourPage() { await requireAdmin(); const packageTypes = await getTourPackageTypeOptions(); const initialValue = { ...emptyTour, packageType: packageTypes[0]?.key ?? "" }; return <section><nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / <Link href="/admin/tours" className="underline">Tours</Link> / New</nav><h1 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">Create Tour</h1><p className="mb-8 mt-3 text-charcoal/65">New tours begin as drafts unless you explicitly select Published.</p><TourForm initialValue={initialValue} packageTypes={packageTypes}/></section>; }
