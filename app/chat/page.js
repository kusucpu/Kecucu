'use client';

import { useState } from 'react';

const MODELS = [
  { value: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', label: 'Dolphin Mistral' },
  { value: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Nous Hermes' },
  { value: 'liquid/lfm-2.5-1.2b-instruct:free', label: 'LiquidAI LFM' },
  { value: 'openrouter/healer-alpha', label: 'Healer Alpha' },
  { value: 'arcee-ai/trinity-large-preview:free', label: 'Arcee AI' },
  { value: 'stepfun/step-3.5-flash:free', label: 'StepFun' },
  { value: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (stabil)' },
  { value: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3.2 3B' },
  { value: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B' },
  { value: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B' },
  { value: 'qwen/qwen-2.5-7b-instruct:free', label: 'Qwen 2.5 7B' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Halo. Lempar pertanyaanmu, biar kita pura-pura produktif.' }]);
  const [message, setMessage] = useState('');
  const [model, setModel] = useState(MODELS[0].value);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, model }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', text: `Error: ${data.error || 'Unknown error'}` }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel chat-panel">
      <h1>Mode Chat</h1>
      <p className="lead">Ngobrol sama AI biar idemu nggak cuma nongkrong di kepala doang.</p>

      <div className="chat-log" aria-live="polite">
        {messages.map((item, idx) => (
          <div key={`${item.role}-${idx}`} className={`bubble ${item.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
            {item.text}
          </div>
        ))}
        {isLoading ? <div className="loading-dots"><span /><span /><span /></div> : null}
      </div>

      <div className="chat-input">
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {MODELS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesanmu. Bebas, asal sopan."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button type="button" onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Nunggu...' : 'Kirim'}
        </button>
      </div>
    </section>
  );
}
