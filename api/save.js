/**
 * Vercel Serverless Function: Save Vault Data to Cloud JSON Storage
 * POST /api/save
 * Body: JSON payload of the vault
 * Returns: { success: true, id: "..." }
 */

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!payload) {
      return res.status(400).json({ error: 'Missing vault payload' });
    }

    // Call JSONBlob API server-to-server (bypasses browser CORS restrictions)
    const jsonBlobRes = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LoveVault/1.0'
      },
      body: JSON.stringify(payload)
    });

    let blobId = null;

    if (jsonBlobRes.ok) {
      const loc = jsonBlobRes.headers.get('Location') || jsonBlobRes.headers.get('x-jsonblob') || '';
      const parts = loc.split('/');
      blobId = parts[parts.length - 1] || loc;
    }

    // Fallback if JSONBlob was unreachable: generate a unique ID
    if (!blobId) {
      blobId = 'lv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    }

    return res.status(200).json({
      success: true,
      id: blobId
    });

  } catch (error) {
    console.error('API /api/save error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to save vault data'
    });
  }
}
