import React from 'react';
import MainViewer from './components/MainViewer';
import runPrivacyGuard from './utils/privacy'; // renamed privacy-guard.js

function App() {
  React.useEffect(() => {
    runPrivacyGuard(); // autodelete logic, etc.
  }, []);

  return (
    <div className="app">
      <h1>OmniPlay</h1>
      <MainViewer />
    </div>
  );
}

export default App;
