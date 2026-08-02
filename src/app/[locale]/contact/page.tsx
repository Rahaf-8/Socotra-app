import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactBookingCTA } from "@/components/contact/contact-booking-cta";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMethods } from "@/components/contact/contact-methods";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { isLocale } from "@/i18n/config";
import { getContactContent } from "@/i18n/content/contact";
import { languageAlternates } from "@/i18n/routing";

export async function generateMetadata({params}:PageProps<"/[locale]/contact">):Promise<Metadata>{const{locale}=await params;if(!isLocale(locale))notFound();const data=getContactContent(locale);return{title:data.seo.title,description:data.seo.description,alternates:{languages:languageAlternates("/contact")},openGraph:{title:data.seo.title,description:data.seo.description,type:"website",url:`/${locale}/contact`,images:data.seo.image?[{url:data.seo.image}]:undefined}}}
export default async function ContactPage({params}:PageProps<"/[locale]/contact">){const{locale}=await params;if(!isLocale(locale))notFound();const data=getContactContent(locale);const ar=locale==="ar";const enquiryTypes=data.enquiryTypes.filter(o=>o.published).sort((a,b)=>a.displayOrder-b.displayOrder);return <main><ContactHero content={data.hero}/><Section className="bg-soft-sand"><Container>{data.intro?<header className="mb-12 max-w-3xl lg:mb-16"><h2 className="text-balance font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">{data.intro.title}</h2><p className="mt-5 max-w-2xl text-base leading-8 text-charcoal/70 sm:text-lg">{data.intro.description}</p></header>:null}<ContactMethods methods={data.methods}/><div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)] lg:gap-10"><ContactForm content={data.form} enquiryTypes={enquiryTypes} locale={locale} labels={{name:ar?"الاسم الكامل":"Full name",email:ar?"البريد الإلكتروني":"Email address",enquiryType:ar?"نوع الاستفسار":"Enquiry type",subject:ar?"الموضوع":"Subject",message:ar?"الرسالة":"Message",selectType:ar?"اختر نوع الاستفسار":"Select an enquiry type",optional:ar?"اختياري":"optional"}}/>{data.guidance?<ContactGuidance content={data.guidance}/>:null}</div></Container></Section>{data.bookingCTA?<ContactBookingCTA content={data.bookingCTA}/>:null}</main>}
