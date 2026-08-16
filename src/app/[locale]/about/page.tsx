import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutCTA } from "@/components/about/about-cta";
import { AboutEditorialSection } from "@/components/about/about-editorial-section";
import { AboutFeatureSection } from "@/components/about/about-feature-section";
import { AboutHero } from "@/components/about/about-hero";
import { AboutHighlights } from "@/components/about/about-highlights";
import { isLocale } from "@/i18n/config";
import { languageAlternates } from "@/i18n/routing";
import { getAboutPageContent } from "@/lib/content/page-repository";

export async function generateMetadata({params}:PageProps<"/[locale]/about">):Promise<Metadata>{const{locale}=await params;if(!isLocale(locale))notFound();const data=await getAboutPageContent(locale);if(!data)notFound();return{title:data.seo.title,description:data.seo.description,alternates:{languages:languageAlternates("/about")},openGraph:{title:data.seo.title,description:data.seo.description,type:"website",url:`/${locale}/about`,images:data.seo.image?[{url:data.seo.image}]:undefined}}}
export default async function AboutPage({params}:PageProps<"/[locale]/about">){const{locale}=await params;if(!isLocale(locale))notFound();const data=await getAboutPageContent(locale);if(!data)notFound();return <main><AboutHero content={data.hero}/><AboutEditorialSection content={data.island}/><AboutEditorialSection content={data.geography} tone="sand" reverse/><AboutFeatureSection content={data.flora}/><AboutFeatureSection content={data.fauna} tone="dark"/><AboutEditorialSection content={data.culture} tone="sand"/><AboutFeatureSection content={data.history} tone="dark"/><AboutHighlights items={data.highlights} labels={locale==="ar"?{eyebrow:"لماذا سقطرى فريدة؟",heading:"جزيرة واحدة وحكايات كثيرة"}:undefined}/><AboutCTA content={data.cta}/></main>}
