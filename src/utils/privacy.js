// Run this once on app start
export default function runPrivacyGuard() {
  // Periodically revoke unused object URLs
  setInterval(() => {
    const previews = document.querySelectorAll('video, audio, img, iframe');
    previews.forEach((el) => {
      const src = el.src;
      if (src && src.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(src); // release memory
        } catch (err) {
          console.warn("URL cleanup failed:", err);
        }
      }
    });
  }, 10000); // every 10 seconds

  // On tab close, clear all Object URLs
  window.addEventListener('beforeunload', () => {
    const previews = document.querySelectorAll('video, audio, img, iframe');
    previews.forEach((el) => {
      const src = el.src;
      if (src && src.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(src);
        } catch (err) {
          console.warn("Unload cleanup failed:", err);
        }
      }
    });
  });
}
