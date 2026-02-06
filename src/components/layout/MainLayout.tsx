import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatWidget from './AIChatWidget';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
