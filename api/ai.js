/**
 * Vercel serverless function: POST /api/ai
 * Receives current p5.js sketch code, returns a creative variation.
 *
 * Requires env var:  ANTHROPIC_API_KEY
 *
 * Deploy: vercel deploy  (or netlify deploy)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code field' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on the server' });
  }

  const prompt = `You are a creative coding assistant helping high school students learn p5.js.

Here is a student's current p5.js sketch (Conway's Game of Life variant):

\`\`\`javascript
${code}
\`\`\`

Generate a SHORT, creative variation that adds one interesting visual twist. For example:
- Color cells based on how long they've been alive
- Add trailing ghost effects
- Make cells pulse or glow
- Add a color gradient across the grid

IMPORTANT constraints:
- Output ONLY valid p5.js code that can be appended to the existing sketch
- Do not redefine setup() or draw() — only add new helper functions or modify global variables
- Keep it under 30 lines
- Use comments to explain what the new code does (in friendly, teen-appropriate language)
- No markdown, no explanations outside the code — just the code`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI API error', detail: err });
    }

    const data = await response.json();
    const aiCode = data.content?.[0]?.text || '';

    // Strip any accidental markdown fences
    const clean = aiCode
      .replace(/^```[a-z]*\n?/gm, '')
      .replace(/```$/gm, '')
      .trim();

    return res.status(200).json({ code: clean });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
