export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, model = 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free' } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://kecucu.vercel.app',
        'X-Title': process.env.SITE_NAME || 'Kucup chat',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ success: false, error: data.error?.message || 'API request failed' });
    }

    return res.status(200).json({
      success: true,
      response: data.choices?.[0]?.message?.content || 'No response',
      model: data.model,
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
