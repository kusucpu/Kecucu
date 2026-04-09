'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UiContext = createContext(null);

export function useUi() {
  return useContext(UiContext);
}

function mockBeamDuration() {
  const connection = typeof navigator !== 'undefined' ? navigator.connection : null;
  const effectiveType = connection?.effectiveType ?? '4g';

  const baseByNetwork = {
    'slow-2g': 2200,
    '2g': 1900,
    '3g': 1450,
    '4g': 980,
  };

  const base = baseByNetwork[effectiveType] ?? 1100;
  const jitter = Math.floor(Math.random() * 500);
  return Math.max(700, Math.min(2800, base + jitter));
}

export default function SiteShell({ children }) {
  const [theme, setTheme] = useState('light');
  const [beamActive, setBeamActive] = useState(false);
  const [beamDuration, setBeamDuration] = useState(1200);
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [gate, setGate] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('kecucu-theme');
    const savedBottomNav = localStorage.getItem('kecucu-bottom-nav') === 'open';
    const initialTheme = savedTheme || 'light';

    setTheme(initialTheme);
    setBottomNavVisible(savedBottomNav);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kecucu-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const launchBeam = () => {
    const duration = mockBeamDuration();
    setBeamDuration(duration);
    setBeamActive(true);
  };

  const onBeamEnd = () => {
    setBeamActive(false);
    setBottomNavVisible(true);
    localStorage.setItem('kecucu-bottom-nav', 'open');
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      beamActive,
      beamDuration,
      bottomNavVisible,
      launchBeam,
      onBeamEnd,
      gate,
      setGate,
    }),
    [theme, beamActive, beamDuration, bottomNavVisible, gate],
  );

  return (
    <UiContext.Provider value={value}>
      {children}
      {beamActive ? (
        <div
          className="beam-overlay"
          style={{ '--beam-duration': `${beamDuration}ms` }}
          onAnimationEnd={onBeamEnd}
          aria-hidden="true"
        >
          <span className="beam-core" />
        </div>
      ) : null}
      {gate ? <div className={`gate-overlay gate-${gate}`} aria-hidden="true" /> : null}
    </UiContext.Provider>
  );
}
