import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookWithConfidence } from "@/components/booking/book-with-confidence";
import { BookingRequestForm } from "@/components/booking/booking-request-form";
import { HowToBook } from "@/components/booking/how-to-book";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { isLocale } from "@/i18n/config";
import { getBookingContent } from "@/i18n/content/booking";
import { languageAlternates } from "@/i18n/routing";
import { getPublishedTourBookingOptions } from "@/lib/tours/tour-repository";

export async function generateMetadata({params}:PageProps<"/[locale]/booking">):Promise<Metadata>{const{locale}=await params;if(!isLocale(locale))notFound();const data=getBookingContent(locale);return{title:data.seo.title,description:data.seo.description,robots:{index:false,follow:true},alternates:{languages:languageAlternates("/booking")}}}
export default async function BookingPage({params,searchParams}:PageProps<"/[locale]/booking">){const{locale}=await params;if(!isLocale(locale))notFound();const query=await searchParams;const requested=typeof query.tour==="string"?query.tour:undefined;const tours=await getPublishedTourBookingOptions(locale);const initial=tours.some(t=>t.slug===requested)?requested:undefined;const data=getBookingContent(locale);return <main><section aria-labelledby="booking-page-heading" className="bg-charcoal pb-18 pt-36 text-white sm:pb-22 sm:pt-40"><Container><p className="text-xs font-bold uppercase tracking-[0.22em] text-sand">{data.hero.eyebrow}</p><h1 id="booking-page-heading" className="mt-4 max-w-[15ch] text-balance font-display text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.96]">{data.hero.title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">{data.hero.description}</p></Container></section><Section className="bg-soft-sand"><Container className="max-w-5xl"><BookingRequestForm tours={tours} initialTourSlug={initial} locale={locale} content={data.form}/></Container></Section><Section className="bg-white"><Container><HowToBook steps={data.steps} heading={data.sections.howToBook}/></Container></Section><Section className="bg-soft-sand pt-0"><Container><BookWithConfidence policy={data.policy}/></Container></Section></main>}
