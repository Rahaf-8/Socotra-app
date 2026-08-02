import Image from "next/image";
import { Images, Play } from "lucide-react";

import type { InstagramPostData } from "@/types/gallery";

type InstagramPostCardProps = {
  post: InstagramPostData;
  labels: Record<InstagramPostData["type"], string> & { newTab: string };
};

function PostTypeIndicator({ type }: Pick<InstagramPostData, "type">) {
  if (type === "image") {
    return null;
  }

  const Icon = type === "video" ? Play : Images;

  return (
    <span
      aria-hidden="true"
      className="absolute end-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-full bg-charcoal/72 text-white shadow-sm backdrop-blur-sm sm:end-3 sm:top-3"
    >
      <Icon
        className="size-4"
        fill={type === "video" ? "currentColor" : "none"}
      />
    </span>
  );
}

export function InstagramPostCard({ post, labels }: InstagramPostCardProps) {
  const typeLabel = labels[post.type];
  const thumbnail = (
    <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-white/8 sm:rounded-[1.5rem]">
      <Image
        src={post.imageUrl}
        alt={post.altText}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
      />
      <PostTypeIndicator type={post.type} />
    </div>
  );

  if (!post.postUrl) {
    return (
      <article className="group min-w-0">
        {thumbnail}
        <span className="sr-only">{typeLabel}</span>
      </article>
    );
  }

  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${typeLabel}: ${post.altText} (${labels.newTab})`}
      className="group min-w-0 rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-ocean-light focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal sm:rounded-[1.5rem]"
    >
      {thumbnail}
    </a>
  );
}
