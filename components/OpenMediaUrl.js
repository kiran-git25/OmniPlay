import React, { useState } from "react";

export default function OpenMediaUrl() {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  const detectType = (inputUrl) => {
    const lowerUrl = inputUrl.toLowerCase();

    // Direct media files
    if (/\.(mp4|webm|mov|avi|mkv)$/i.test(lowerUrl)) return "video";
    if (/\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(lowerUrl)) return "audio";

    // YouTube watch or embed
    if (/youtube\.com\/watch\?v=/.test(lowerUrl)) return "youtube";
    if (/youtu\.be\//.test(lowerUrl)) return "youtube";

    // Google redirect
    if (lowerUrl.includes("google.com/url?")) return "redirect";

    // Instagram Reels
    if (/instagram\.com\/(reel|p|tv)\//.test(lowerUrl)) return "instagram";

    return null;
  };

  const extractYoutubeId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const extractRedirectTarget = (url) => {
    try {
      const realUrl = new URL(url);
      return decodeURIComponent(realUrl.searchParams.get("url") || "");
    } catch {
      return "";
    }
  };

  const handlePlay = () => {
    const urlType = detectType(url);
    if (!urlType) return alert("Unsupported or unsafe media link.");
    setType(urlType);
  };

  const getEmbeddedURL = () => {
    if (type === "youtube") {
      const id = extractYoutubeId(url);
      return `https://www.youtube.com/embed/${id}`;
    }

    if (type === "redirect") {
      const target = extractRedirectTarget(url);
      if (/youtube\.com/.test(target)) {
        const id = extractYoutubeId(target);
        return `https://www.youtube.com/embed/${id}`;
      }
      return target;
    }

    if (type === "instagram") {
      return `${url}embed`; // NOTE: works only for public posts
    }

    return url;
  };

  return (
    <div className="p-4 border rounded shadow">
      <input
        type="text"
        placeholder="Paste YouTube, Instagram, or direct media URL"
        className="border px-2 py-1 w-full mb-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handlePlay} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Media
      </button>

      {type === "audio" && <audio controls className="mt-4 w-full" src={url}></audio>}
      {type === "video" && <video controls className="mt-4 w-full" src={url}></video>}
      {["youtube", "redirect", "instagram"].includes(type) && (
        <iframe
          className="w-full mt-4 aspect-video rounded-lg"
          src={getEmbeddedURL()}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
