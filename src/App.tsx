import { AppProviders } from '@/app/AppProviders';
import { AppRouter } from '@/app/AppRouter';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
