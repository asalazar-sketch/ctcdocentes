export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Falta el prompt' });
    }

    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await anthropicResp.json();

    if (!anthropicResp.ok) {
      return res.status(anthropicResp.status).json({
        error: data?.error?.message || 'Error Anthropic'
      });
    }

    const text = data?.content?.[0]?.text || '';

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Error interno'
    });
  }
}
