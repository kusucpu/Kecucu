'use client';

import { useMemo, useState } from 'react';

export default function ImagePage() {
  const [prompt, setPrompt] = useState('robot kucing naik skateboard, gaya komik neon');
  const [activePrompt, setActivePrompt] = useState('robot kucing naik skateboard, gaya komik neon');

  const imageUrl = useMemo(() => {
    const encoded = encodeURIComponent(activePrompt);
    return `https://image.pollinations.ai/prompt/${encoded}?nologo=true&width=1024&height=1024&seed=42`;
  }, [activePrompt]);

  return (
    <section className="panel image-panel">
      <h1>Mode Image</h1>
      <p className="lead">Ketik ide absurdmu, biar jadi gambar yang absurd tapi estetik.</p>

      <form
        className="image-form"
        onSubmit={(e) => {
          e.preventDefault();
          setActivePrompt(prompt.trim() || 'minimalist mountain poster');
        }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: ayam formal pakai jas, cinematic lighting"
        />
        <button type="submit">Generate</button>
      </form>

      <div className="image-preview">
        <img src={imageUrl} alt={`Hasil gambar AI untuk prompt: ${activePrompt}`} loading="lazy" />
      </div>
    </section>
  );
}
