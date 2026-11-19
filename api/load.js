/**
 * Vercel Serverless Function: Load Vault Data by ID
 * GET /api/load?id=...
 * Returns: { success: true, data: { ... } }
 */

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing vault id parameter (?id=...)' });
  }

  try {
    const jsonBlobRes = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LoveVault/1.0'
      }
    });

    if (!jsonBlobRes.ok) {
      return res.status(jsonBlobRes.status).json({
        error: 'Brankas cinta tidak ditemukan atau sudah kadaluarsa 💔'
      });
    }

    const data = await jsonBlobRes.json();
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('API /api/load error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to load vault data'
    });
  }
}
