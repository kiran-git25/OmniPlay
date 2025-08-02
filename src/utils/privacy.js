export default function runPrivacyGuard() {
  if (window.localStorage) localStorage.clear();
  if (window.sessionStorage) sessionStorage.clear();
  if (window.caches) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  console.log("🔒 Privacy cleanup complete.");
}
