function loadPastedUrl() {
    const input = document.getElementById('mediaUrlInput');
    let url = input.value.trim();

    if (!url) {
        alert("Please paste a valid media URL.");
        return;
    }

    // Decode wrapped redirect URLs like Google/WhatsApp
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes("google.com") || urlObj.hostname.includes("whatsapp.com")) {
            const actualUrl = urlObj.searchParams.get("url") || urlObj.searchParams.get("u");
            if (actualUrl) url = decodeURIComponent(actualUrl);
        }
    } catch (e) {
        console.warn("Invalid URL structure");
    }

    // Normalize YouTube short links
    if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        url = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Embed YouTube links
    if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        url = `https://www.youtube.com/embed/${videoId}`;
    }

    // Embed Instagram reels
    if (url.includes("instagram.com/reel")) {
        const cleanUrl = url.split("?")[0];
        url = `${cleanUrl}embed`;
    }

    const viewer = document.getElementById('viewerContent');
    viewer.innerHTML = `<iframe src="${url}" frameborder="0" allowfullscreen style="width:100%; height:80vh;"></iframe>`;

    document.getElementById('viewerSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
}
