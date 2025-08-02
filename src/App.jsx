import React, { useEffect } from 'react';
import MainViewer from './components/MainViewer';
import runPrivacyGuard from './utils/privacy';

function App() {
  useEffect(() => {
    runPrivacyGuard(); // Clear memory after use
  }, []);

  return (
    <div className="App">
      <h1>🧩 OmniPlay</h1>
      <MainViewer />
    </div>
  );
}

export default App;
