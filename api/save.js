/**
 * Vercel Serverless Function: Save Vault Data to Cloud Storage
 * POST /api/save
 * Features:
 * - 4-tier Cloud Storage: Catbox.moe (cb_), Bytebin (bb_), Paste.rs (pr_), JSONBlob (jb_)
 * - 8-second timeout per provider
 * - Full CORS headers with OPTIONS preflight handling
 * - Zero in-memory storage (Stateless)
 */

export default async function handler(req, res) {
  // 1. Full CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
  }

  // 2. Safe Body Reading
  let payload = null;
  if (req.body) {
    if (typeof req.body === 'object') {
      payload = req.body;
    } else if (typeof req.body === 'string') {
      try {
        payload = JSON.parse(req.body);
      } catch (e) {}
    }
  }

  // Stream fallback if body parser was bypassed
  if (!payload) {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      if (chunks.length > 0) {
        const raw = Buffer.concat(chunks).toString('utf-8');
        payload = JSON.parse(raw);
      }
    } catch (e) {}
  }

  // 3. Payload Validation
  const hasPin = payload && (payload.p || payload.pin);
  const hasNames = payload && (payload.n1 || payload.userName || payload.u);

  if (!payload || !hasPin || !hasNames) {
    return res.status(400).json({
      ok: false,
      error: 'Payload brankas tidak valid atau tidak lengkap (wajib ada nama & PIN).'
    });
  }

  const jsonString = JSON.stringify(payload);
  const errors = [];

  // 4. Layer 1: Catbox.moe (cb_) — Primary (Permanent & Strong for HD Photos)
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    const file = new File([jsonString], 'vault.json', { type: 'text/plain' });
    formData.append('fileToUpload', file);

    const cbRes = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LoveVaultApp/1.0'
      },
      body: formData,
      signal: AbortSignal.timeout(8000)
    });

    if (cbRes.ok) {
      const text = (await cbRes.text()).trim();
      if (text.startsWith('https://files.catbox.moe/')) {
        const filename = text.split('/').pop().trim();
        if (filename) {
          return res.status(200).json({
            ok: true,
            id: `cb_${filename}`,
            provider: 'catbox'
          });
        }
      }
      errors.push({ provider: 'catbox', error: `Respon tidak valid: ${text.slice(0, 120)}` });
    } else {
      errors.push({ provider: 'catbox', error: `HTTP ${cbRes.status}` });
    }
  } catch (err) {
    errors.push({ provider: 'catbox', error: err.message || 'Timeout / Network Error' });
  }

  // 5. Layer 2: Bytebin (bb_) — Backup 1 (Fast & specifically for JSON)
  try {
    const bbRes = await fetch('https://bytebin.lucko.me/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LoveVaultApp/1.0'
      },
      body: jsonString,
      signal: AbortSignal.timeout(8000)
    });

    if (bbRes.ok) {
      const data = await bbRes.json();
      if (data && data.key) {
        return res.status(200).json({
          ok: true,
          id: `bb_${data.key}`,
          provider: 'bytebin'
        });
      }
      errors.push({ provider: 'bytebin', error: 'Kunci penyimpanan tidak ditemukan' });
    } else {
      errors.push({ provider: 'bytebin', error: `HTTP ${bbRes.status}` });
    }
  } catch (err) {
    errors.push({ provider: 'bytebin', error: err.message || 'Timeout / Network Error' });
  }

  // 6. Layer 3: Paste.rs (pr_) — Backup 2 (Lightweight text paste)
  try {
    const prRes = await fetch('https://paste.rs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'LoveVaultApp/1.0'
      },
      body: jsonString,
      signal: AbortSignal.timeout(8000)
    });

    if (prRes.ok) {
      const urlText = (await prRes.text()).trim();
      const code = urlText.split('/').pop().trim();
      if (code) {
        return res.status(200).json({
          ok: true,
          id: `pr_${code}`,
          provider: 'pasters'
        });
      }
      errors.push({ provider: 'pasters', error: `URL tidak valid: ${urlText.slice(0, 100)}` });
    } else {
      errors.push({ provider: 'pasters', error: `HTTP ${prRes.status}` });
    }
  } catch (err) {
    errors.push({ provider: 'pasters', error: err.message || 'Timeout / Network Error' });
  }

  // 7. Layer 4: JSONBlob (jb_) — Backup 3
  try {
    const jbRes = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'LoveVaultApp/1.0'
      },
      body: jsonString,
      signal: AbortSignal.timeout(8000)
    });

    if (jbRes.ok || jbRes.status === 201) {
      const loc = jbRes.headers.get('location') || jbRes.headers.get('x-jsonblob-id') || '';
      const blobId = loc.split('/').pop().trim();
      if (blobId) {
        return res.status(200).json({
          ok: true,
          id: `jb_${blobId}`,
          provider: 'jsonblob'
        });
      }
      errors.push({ provider: 'jsonblob', error: 'Header id tidak ditemukan' });
    } else {
      errors.push({ provider: 'jsonblob', error: `HTTP ${jbRes.status}` });
    }
  } catch (err) {
    errors.push({ provider: 'jsonblob', error: err.message || 'Timeout / Network Error' });
  }

  // 8. If All 4 Providers Failed
  return res.status(500).json({
    ok: false,
    error: 'Semua server penyimpanan gagal menyimpan brankas',
    details: errors
  });
}
