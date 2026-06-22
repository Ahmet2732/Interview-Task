import { BundleProvider } from './context/BundleContext';
import { BundleBuilder } from './components/BundleBuilder/BundleBuilder';

function App() {
  return (
    <BundleProvider>
      <main className="min-h-screen bg-wyze-bg">
        <BundleBuilder />
      </main>
    </BundleProvider>
  );
}

export default App;
