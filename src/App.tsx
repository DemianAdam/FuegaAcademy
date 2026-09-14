import { BrowserRouter } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { convex } from './lib/convex';
import { LanguageProvider } from './lib/LanguageContext';
import './lib/i18n';

function App() {
  return (
    <ConvexProvider client={convex}>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <h1 className="p-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Fuega Academy - Base Structure Ready
            </h1>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ConvexProvider>
  );
}

export default App;