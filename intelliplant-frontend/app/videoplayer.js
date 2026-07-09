"use client";

export default function VideoPlayer({ src, title = "Video preview", className = "" }) {
  if (!src) {
    return (
      <div className={`video-player empty ${className}`}>
        <span>No video selected</span>
      </div>
    );
  }

  return (
    <video
      className={`video-player ${className}`}
      controls
      playsInline
      preload="metadata"
      src={src}
      title={title}
    />
  );
}
