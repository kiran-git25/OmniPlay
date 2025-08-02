export default function runPrivacyGuard() {
  window.addEventListener('beforeunload', () => {
    window.URL.revokeObjectURL && window.URL.revokeObjectURL();
    window.localStorage && window.localStorage.clear();
    window.sessionStorage && window.sessionStorage.clear();
  });
}
