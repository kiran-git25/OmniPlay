import React, { useState } from "react";

export default function OpenMediaUrl() {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  const detectType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["mp4", "webm", "mov", "mkv", "avi", "flv"].includes(extension)) return "video";
    if (["mp3", "wav", "ogg", "aac", "flac", "m4a"].includes(extension)) return "audio";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    return null;
  };

  const handleLoad = () => {
    const detected = detectType(url);
    if (detected) setType(detected);
    else alert("Unsupported or unrecognized media URL.");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-3">📎 Paste Media Link</h2>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Paste your media URL here..."
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleLoad}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Load
        </button>
      </div>

      <div className="mt-4">
        {type === "audio" && <audio controls className="w-full mt-2" src={url}></audio>}
        {type === "video" && <video controls className="w-full mt-2" src={url}></video>}
        {type === "youtube" && (
          <iframe
            className="w-full mt-2 rounded
