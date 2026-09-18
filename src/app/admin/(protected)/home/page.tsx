import Link from "next/link";
import { HomeHeroForm } from "@/components/admin/content/home-hero-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getHomeHeroImage } from "@/lib/content/home-settings";

export default async function AdminHomePage() {
  await requireAdmin();
  const hero = await getHomeHeroImage();
  return <section><nav className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Home</nav><h1 className="mt-5 font-display text-5xl font-semibold">Home content</h1><p className="mb-8 mt-3 max-w-3xl text-charcoal/65">Manage the shared main Home hero image. Home copy, layout, buttons, and all other sections are unchanged.</p><HomeHeroForm initialValue={{ imagePath: hero.imagePath, publicId: hero.publicId }} usingFallback={!hero.configured} /></section>;
}
