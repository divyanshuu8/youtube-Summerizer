import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoForm } from './components/VideoForm';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto pt-8">
            <VideoForm />
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;