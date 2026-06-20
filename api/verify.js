export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { license_key } = req.body;
  if (!license_key) return res.status(400).json({ error: 'License key required' });

  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: process.env.GUMROAD_PRODUCT_ID,
        license_key: license_key.trim(),
        access_token: process.env.GUMROAD_ACCESS_TOKEN
      })
    });

    const data = await response.json();

    if (data.success) {
      res.status(200).json({ valid: true, uses: data.uses });
    } else {
      res.status(200).json({ valid: false, error: data.message || 'Invalid license' });
    }
  } catch (e) {
    res.status(500).json({ valid: false, error: e.message });
  }
}
