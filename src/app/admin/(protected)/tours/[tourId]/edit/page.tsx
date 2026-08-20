import Link from "next/link";
import { notFound } from "next/navigation";
import { TourForm } from "@/components/admin/tours/tour-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminTourById, toAdminTourInput } from "@/lib/tours/tour-repository";
import { getTourPackageTypeOptions } from "@/lib/tours/tour-package-type-repository";

export default async function EditTourPage({ params, searchParams }: { params: Promise<{ tourId: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin(); const [{ tourId }, query] = await Promise.all([params, searchParams]); const tour = await getAdminTourById(tourId); if (!tour) notFound(); const value = toAdminTourInput(tour); const packageTypes = await getTourPackageTypeOptions(value.packageType);
  return <section><nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / <Link href="/admin/tours" className="underline">Tours</Link> / Edit</nav><h1 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">Edit {value.en.title}</h1>{query.saved === "1" ? <p role="status" className="my-6 rounded-xl border border-ocean/20 bg-ocean/5 p-4 text-sm text-deep-ocean">Tour saved successfully.</p> : <div className="mb-8" />}<TourForm initialValue={value} packageTypes={packageTypes}/></section>;
}
