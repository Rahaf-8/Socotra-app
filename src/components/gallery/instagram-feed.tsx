import Image from "next/image";
import { Camera, ExternalLink } from "lucide-react";

import { InstagramPostCard } from "@/components/gallery/instagram-post-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { GalleryPageData } from "@/types/gallery";
import type { PublicSiteSettings } from "@/types/site-settings";

type InstagramFeedProps = {
  content: GalleryPageData["instagram"];
  profile: PublicSiteSettings["instagram"];
  labels: { placeholder: string; follow: string; image: string; video: string; carousel: string; newTab: string };
};

export function InstagramFeed({ content, profile, labels }: InstagramFeedProps) {
  const posts = content.posts
    .filter(
      (post) =>
        post.published &&
        post.id &&
        post.imageUrl &&
        post.altText &&
        post.type,
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8);

  if (!content.published || posts.length === 0) {
    return null;
  }

  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" &&
    posts.some((post) => post.placeholder);
  const showProfile =
    Boolean(profile.profileImage) ||
    Boolean(profile.username) ||
    Boolean(profile.bio) ||
    Boolean(profile.href);

  return (
    <Section
      aria-labelledby="instagram-feed-heading"
      className="bg-charcoal text-white"
    >
      <Container>
        <header className="max-w-2xl">
          {content.eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean-light sm:text-sm">
              {content.eyebrow}
            </p>
          ) : null}
          <h2
            id="instagram-feed-heading"
            className="mt-3 text-balance font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.025em]"
          >
            {content.title}
          </h2>
          {content.description ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
              {content.description}
            </p>
          ) : null}
          {showPlaceholderNotice ? (
            <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-semibold text-white/70">
              {labels.placeholder}
            </p>
          ) : null}
        </header>

        {showProfile ? (
          <div className="mt-8 flex flex-col gap-5 border-y border-white/12 py-6 sm:flex-row sm:items-center">
            {profile.profileImage ? (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/8 sm:size-20">
                <Image
                  src={profile.profileImage.src}
                  alt={profile.profileImage.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              {profile.username ? (
                <p className="break-words text-base font-bold text-white sm:text-lg">
                  {profile.username}
                </p>
              ) : null}
              {profile.bio ? (
                <p className="mt-1 max-w-xl text-sm leading-6 text-white/65">
                  {profile.bio}
                </p>
              ) : null}
            </div>

            {profile.href ? (
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-white/35 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:self-auto"
              >
                <Camera aria-hidden="true" className="size-4" />
                {labels.follow}
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {posts.map((post) => (
            <InstagramPostCard key={post.id} post={post} labels={{ image: labels.image, video: labels.video, carousel: labels.carousel, newTab: labels.newTab }} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
