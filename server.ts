import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory token cache for OneMap token (lasts 3 days)
interface OneMapTokenCache {
  token: string | null;
  expiry: number | null; // epoch timestamp ms
}

const tokenCache: OneMapTokenCache = {
  token: null,
  expiry: null,
};

const ONEMAP_BASE = 'https://www.onemap.gov.sg/api';
const DATA_GOV_BASE = 'https://api-open.data.gov.sg/v2/real-time/api';

/**
 * Retrieve or mint a valid OneMap API Token.
 * Tokens minted from OneMap last 3 days (approx 72 hours).
 */
async function getValidOneMapToken(customEmail?: string, customPassword?: string): Promise<string | null> {
  // 1. Check static token in environment
  const envToken = process.env.OneMapAPI || process.env.ONEMAP_API_TOKEN || process.env.VITE_ONEMAP_API_TOKEN;
  if (envToken && envToken.trim().length > 0) {
    return envToken.trim();
  }

  // 2. Check in-memory cached token (valid if > 15 mins remaining)
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiry && tokenCache.expiry - now > 15 * 60 * 1000) {
    return tokenCache.token;
  }

  // 3. Mint new token if email and password are provided or in env
  const email = customEmail || process.env.ONEMAP_EMAIL;
  const password = customPassword || process.env.ONEMAP_PASSWORD;

  if (email && password) {
    try {
      console.log(`[OneMap] Minting new 3-day token for ${email}...`);
      const res = await fetch(`${ONEMAP_BASE}/auth/post/getToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          tokenCache.token = data.access_token;
          if (data.expiry_timestamp) {
            tokenCache.expiry = new Date(data.expiry_timestamp).getTime();
          } else {
            // 3 days expiry
            tokenCache.expiry = now + 3 * 24 * 60 * 60 * 1000;
          }
          console.log('[OneMap] Token successfully minted and cached for 3 days.');
          return tokenCache.token;
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.warn(`[OneMap] Token minting failed HTTP ${res.status}: ${errText}`);
      }
    } catch (err) {
      console.warn('[OneMap] Network error minting token:', err);
    }
  }

  return tokenCache.token;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasToken: Boolean(tokenCache.token || process.env.OneMapAPI || process.env.ONEMAP_API_TOKEN),
  });
});

/**
 * 1. Mint a token: POST /api/onemap/token
 * Body: { "email": "...", "password": "..." } (optional if set in env)
 * OneMap Endpoint: https://www.onemap.gov.sg/api/auth/post/getToken (lasts 3 days)
 */
app.post('/api/onemap/token', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const token = await getValidOneMapToken(email, password);

    if (token) {
      return res.json({
        success: true,
        access_token: token,
        expiry_timestamp: tokenCache.expiry ? new Date(tokenCache.expiry).toISOString() : null,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Failed to mint OneMap token. Please provide valid email & password in request body or .env',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
});

/**
 * Check token status: GET /api/onemap/token/status
 */
app.get('/api/onemap/token/status', (req, res) => {
  const hasEnvToken = Boolean(process.env.OneMapAPI || process.env.ONEMAP_API_TOKEN || process.env.VITE_ONEMAP_API_TOKEN);
  res.json({
    hasToken: Boolean(tokenCache.token || hasEnvToken),
    expiry: tokenCache.expiry ? new Date(tokenCache.expiry).toISOString() : null,
    source: hasEnvToken ? 'environment' : tokenCache.token ? 'minted_cache' : 'none',
  });
});

/**
 * 2. Geocode / Search: GET /api/onemap/search
 * Query params: searchVal, returnGeom, getAddrDetails, pageNum
 * OneMap Endpoint: https://www.onemap.gov.sg/api/common/elastic/search?searchVal=...&returnGeom=Y&getAddrDetails=Y&pageNum=1
 * Note: Authorization header officially required
 */
app.get('/api/onemap/search', async (req, res) => {
  try {
    const searchVal = String(req.query.searchVal || '').trim();
    if (!searchVal || searchVal.length < 2) {
      return res.json({ found: 0, totalNumPages: 0, pageNum: 1, results: [] });
    }

    const returnGeom = req.query.returnGeom || 'Y';
    const getAddrDetails = req.query.getAddrDetails || 'Y';
    const pageNum = req.query.pageNum || '1';

    const token = await getValidOneMapToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const url = `${ONEMAP_BASE}/common/elastic/search?searchVal=${encodeURIComponent(searchVal)}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`;
    const response = await fetch(url, { headers });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ error: text || 'OneMap Search failed' });
    }
  } catch (err: any) {
    console.warn('OneMap search proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal search proxy error' });
  }
});

/**
 * 3. Reverse Geocode: GET /api/onemap/revgeocode
 * Query params: location (lat,lng), buffer, addressType
 * OneMap Endpoint: https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 * Note: token required
 */
app.get('/api/onemap/revgeocode', async (req, res) => {
  try {
    const location = String(req.query.location || '').trim();
    if (!location) {
      return res.status(400).json({ error: 'Missing location parameter (lat,lng)' });
    }

    const buffer = req.query.buffer || '40';
    const addressType = req.query.addressType || 'All';

    const token = await getValidOneMapToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const url = `${ONEMAP_BASE}/public/revgeocode?location=${encodeURIComponent(location)}&buffer=${buffer}&addressType=${addressType}`;
    const response = await fetch(url, { headers });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ error: text || 'OneMap Reverse Geocode failed' });
    }
  } catch (err: any) {
    console.warn('OneMap reverse geocode proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal reverse geocode proxy error' });
  }
});

/**
 * 4. Routing: GET /api/onemap/route
 * Query params: start (lat,lng), end (lat,lng), routeType (walk | drive | cycle | pt)
 * OneMap Endpoint: https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk
 * Note: token required
 */
app.get('/api/onemap/route', async (req, res) => {
  try {
    const start = String(req.query.start || '').trim();
    const end = String(req.query.end || '').trim();
    const routeType = String(req.query.routeType || 'walk').toLowerCase();

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end coordinates (lat,lng)' });
    }

    const token = await getValidOneMapToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const url = `${ONEMAP_BASE}/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;
    const response = await fetch(url, { headers });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ error: text || 'OneMap Routing service failed' });
    }
  } catch (err: any) {
    console.warn('OneMap routing proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal routing proxy error' });
  }
});

// ----------------------------------------------------
// DATA.GOV.SG PROXIES (Weather, PSI, Traffic, Carparks)
// ----------------------------------------------------

app.get('/api/datagov/weather-forecast', async (req, res) => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/weather-forecast`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    return res.status(response.status).json({ error: 'Weather API error' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/datagov/psi', async (req, res) => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/psi`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    return res.status(response.status).json({ error: 'PSI API error' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/datagov/traffic-images', async (req, res) => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/traffic-images`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    return res.status(response.status).json({ error: 'Traffic images API error' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/datagov/carpark-availability', async (req, res) => {
  try {
    const response = await fetch(`${DATA_GOV_BASE}/carpark-availability`, {
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    return res.status(response.status).json({ error: 'Carparks API error' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSET SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SG UrbanPulse / RainRouter] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
