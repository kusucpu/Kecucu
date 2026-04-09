'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUi } from './SiteShell';

function IconHome() {
  return <span aria-hidden="true">⌂</span>;
}
function IconChat() {
  return <span aria-hidden="true">✎</span>;
}
function IconImage() {
  return <span aria-hidden="true">▣</span>;
}
function IconOut() {
  return <span aria-hidden="true">↗</span>;
}

export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { bottomNavVisible, setGate } = useUi();

  const transitionTo = (targetPath) => {
    if (pathname === targetPath) return;

    const goingHome = targetPath === '/';
    setGate(goingHome ? 'down' : 'up');

    setTimeout(() => {
      router.push(targetPath);
      setTimeout(() => setGate(null), 460);
    }, 380);
  };

  return (
    <nav className={`bottom-nav ${bottomNavVisible ? 'is-visible' : ''}`} aria-label="Menu utama bawah">
      <button
        type="button"
        className={`nav-item ${pathname === '/' ? 'active' : ''}`}
        onClick={() => transitionTo('/')}
        aria-label="Home"
      >
        <IconHome />
      </button>

      <button
        type="button"
        className={`nav-item ${pathname === '/chat' ? 'active' : ''}`}
        onClick={() => transitionTo('/chat')}
        aria-label="Chat"
      >
        <IconChat />
      </button>

      <button
        type="button"
        className={`nav-item ${pathname === '/image' ? 'active' : ''}`}
        onClick={() => transitionTo('/image')}
        aria-label="Image"
      >
        <IconImage />
      </button>

      <Link className="nav-item" href="https://enter.pollinations.ai" target="_blank" rel="noreferrer" aria-label="Buka link luar">
        <IconOut />
      </Link>
    </nav>
  );
}
