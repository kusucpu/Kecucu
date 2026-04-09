import { NextResponse } from 'next/server';

export async function POST(request) {
  const { message, model = 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free' } = await request.json();

  if (!message) {
    return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://kecucu.vercel.app',
        'X-Title': process.env.SITE_NAME || 'Kecucu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'API request failed' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      response: data.choices?.[0]?.message?.content || 'No response',
      model: data.model,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 },
    );
  }
}
