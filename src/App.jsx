import React, { useEffect } from 'react';
import MainViewer from './components/MainViewer';
import runPrivacyGuard from './utils/privacy'; // renamed privacy-guard.js

function App() {
  useEffect(() => {
    runPrivacyGuard();  // 🧹 Privacy cleanup starts here
  }, []);

  return (
    <div className="App">
      <MainViewer />
    </div>
  );
}

export default App;
