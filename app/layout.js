import './globals.css';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import SiteShell from './components/SiteShell';

export const metadata = {
  title: 'Kecucu',
  description: 'Web gabut penuh cinta: chat AI, gambar AI, dan hal random yang bikin senyum.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <SiteShell>
          <TopNavbar />
          <main className="page-wrap">{children}</main>
          <Footer />
          <BottomNavbar />
        </SiteShell>
      </body>
    </html>
  );
}
