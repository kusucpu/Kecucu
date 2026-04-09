'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUi } from './SiteShell';

export default function TopNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, launchBeam } = useUi();

  return (
    <header className="top-nav">
      <div className="nav-side" />
      <Link href="/" className="site-title" aria-current={pathname === '/' ? 'page' : undefined}>
        Kecucu
      </Link>
      <div className="nav-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Ganti tema terang atau gelap"
          title="Dark/Light mode"
        >
          {theme === 'light' ? '☀' : '☾'}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={launchBeam}
          aria-label="Tampilkan sinar dan buka menu bawah"
          title="Tombol aneh tapi niat"
        >
          ✦
        </button>
      </div>
    </header>
  );
}
