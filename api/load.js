/**
 * Vercel Serverless Function: Load Vault Data by ID
 * GET /api/load?id=...
 * Supports:
 * - cb_ (Catbox.moe)
 * - bb_ (Bytebin)
 * - pr_ (Paste.rs)
 * - jb_ (JSONBlob)
 * - legacy without prefix (JSONBlob)
 */

export default async function handler(req, res) {
  // 1. Full CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use GET.' });
  }

  // 2. Safe ID extraction & trimming
  let id = req.query && req.query.id ? req.query.id : '';
  if (!id && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      id = parsedUrl.searchParams.get('id') || '';
    } catch (e) {}
  }

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({
      ok: false,
      error: 'Parameter id brankas (?id=...) wajib diisi.'
    });
  }

  id = id.trim();

  // 3. Prefix Detection & Target Fetch URL Mapping
  let fetchUrl = '';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LoveVaultApp/1.0'
  };

  if (id.startsWith('cb_')) {
    fetchUrl = `https://files.catbox.moe/${id.slice(3)}`;
  } else if (id.startsWith('bb_')) {
    fetchUrl = `https://bytebin.lucko.me/${id.slice(3)}`;
  } else if (id.startsWith('pr_')) {
    fetchUrl = `https://paste.rs/${id.slice(3)}`;
  } else if (id.startsWith('jb_')) {
    fetchUrl = `https://jsonblob.com/api/jsonBlob/${id.slice(3)}`;
    headers['Accept'] = 'application/json';
  } else {
    // Legacy / un-prefixed ID: fallback to JSONBlob
    fetchUrl = `https://jsonblob.com/api/jsonBlob/${id}`;
    headers['Accept'] = 'application/json';
  }

  // 4. Fetch Vault Data from Target Cloud Provider
  try {
    const upstreamRes = await fetch(fetchUrl, {
      headers,
      signal: AbortSignal.timeout(10000)
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status === 404 ? 404 : 500).json({
        ok: false,
        error: `Brankas cinta tidak ditemukan atau sudah kadaluarsa (HTTP ${upstreamRes.status}).`
      });
    }

    const rawText = await upstreamRes.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      return res.status(502).json({
        ok: false,
        error: 'Data yang diterima dari server cloud bukan format JSON yang valid.'
      });
    }

    // 5. Return JSON payload directly
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json(data);

  } catch (err) {
    console.error('API /api/load fetch error:', err);
    return res.status(500).json({
      ok: false,
      error: `Gagal memuat brankas: ${err.message || 'Koneksi bermasalah'}`
    });
  }
}
