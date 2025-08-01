import React, { useState } from "react";

export default function OpenMediaUrl() {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [cleanUrl, setCleanUrl] = useState("");

  const detectType = (inputUrl) => {
    const lowerUrl = inputUrl.toLowerCase();

    if (/\.(mp4|webm|mov|avi|mkv)$/i.test(lowerUrl)) return "video";
    if (/\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(lowerUrl)) return "audio";
    if (/youtube\.com\/watch\?v=/.test(lowerUrl)) return "youtube";
    if (/youtu\.be\//.test(lowerUrl)) return "youtube";
    if (lowerUrl.includes("google.com/url?")) return "redirect";
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

  const handleLoad = () => {
    let finalUrl = url.trim();
    let urlType = detectType(finalUrl);

    if (urlType === "redirect") {
      const redirected = extractRedirectTarget(finalUrl);
      finalUrl = redirected;
      urlType = detectType(redirected);
    }

    if (!urlType) {
      alert("Unsupported or unsafe media link.");
      return;
    }

    setType(urlType);
    setCleanUrl(finalUrl);
  };

  const getEmbeddedURL = () => {
    if (type === "youtube") {
      const id = extractYoutubeId(cleanUrl);
      return `https://www.youtube.com/embed/${id}`;
    }

    if (type === "instagram") {
      return `${cleanUrl}embed`; // works for public posts only
    }

    return cleanUrl;
  };

  return (
    <div className="p-4 border rounded shadow max-w-xl mx-auto bg-white">
      <h2 className="text-lg font-bold mb-2">📎 Paste a media URL</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste YouTube, Instagram, or direct media URL..."
          className="border flex-grow px-3 py-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleLoad} className="bg-blue-600 text-white px-4 py-2 rounded">
          Load
        </button>
      </div>

      {type === "audio" && (
        <audio controls className="mt-4 w-full" src={cleanUrl}></audio>
      )}
      {type === "video" && (
        <video controls className="mt-4 w-full" src={cleanUrl}></video>
      )}
      {["youtube", "instagram"].includes(type) && (
        <iframe
          className="w-full mt-4 aspect-video rounded"
          src={getEmbeddedURL()}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
