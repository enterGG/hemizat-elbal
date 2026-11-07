"use client";

import { toYoutubeEmbed } from "@/lib/format";
import type { MediaImage, MediaVideo } from "@/lib/types";
import { useState } from "react";

export default function ProductGallery({
  images,
  videos,
  name,
}: {
  images: MediaImage[];
  videos: MediaVideo[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="relative aspect-[4/3] bg-black">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.url} alt={current.alt || name} className="h-full w-full object-cover object-center" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">لا توجد صور بعد</div>
          )}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-xl border ${
                index === active ? "border-gold" : "border-[var(--line)]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt || `${name} ${index + 1}`} className="aspect-[4/3] w-full object-cover object-center" />
            </button>
          ))}
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm tracking-[0.2em] text-gold">الفيديوهات</h3>
          {videos.map((video, index) => {
            const embed = video.kind === "youtube" ? toYoutubeEmbed(video.url) : null;
            return (
              <div key={video.url + index} className="card overflow-hidden">
                {embed ? (
                  <iframe
                    src={embed}
                    title={`${name} فيديو ${index + 1}`}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={video.url} controls className="aspect-video w-full bg-black" />
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
