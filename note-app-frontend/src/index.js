import React from 'react';
import { createRoot } from 'react-dom/client';
import { SearchProvider } from './SearchContext'; // or wherever your SearchContext file is
import App from './App'; // or wherever your App component is

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SearchProvider>
      <App />
    </SearchProvider>
  </React.StrictMode>
);
