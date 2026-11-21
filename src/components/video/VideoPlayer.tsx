"use client";

import type { VideoView } from "@/lib/video-quiz-api";
import { youtubeWatchUrl } from "@/lib/youtube";

/** One player for both validated YouTube episodes and locally uploaded files. */
export function VideoPlayer({ video, autoplay = true }: { video: VideoView; autoplay?: boolean }) {
  if (video.source === "youtube" && video.embedUrl) {
    const src = autoplay ? `${video.embedUrl}&autoplay=1` : video.embedUrl;
    return (
      <iframe
        className="h-full w-full"
        src={src}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (video.source === "upload" && video.videoUrl) {
    return (
      <video
        className="h-full w-full bg-black"
        src={video.videoUrl}
        controls
        autoPlay={autoplay}
        playsInline
        preload="metadata"
      >
        Your browser does not support embedded video.
      </video>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-black px-4 text-center text-[11px] text-white/60">
      This episode has no playable source yet.
      {video.youtubeId && (
        <a className="ml-1 underline" href={youtubeWatchUrl(video.youtubeId)} target="_blank" rel="noopener noreferrer">
          Watch on YouTube
        </a>
      )}
    </div>
  );
}
