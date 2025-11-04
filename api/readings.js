// Brewfather API - Batch Readings Endpoint
// This runs as a serverless function or API endpoint

const https = require('https');

// In-memory cache (5 minutes for readings data)
let cache = {};

function fetchBatchReadings(userId, apiKey, batchId) {
  return new Promise((resolve, reject) => {
    const url = `/v1/batches/${batchId}/readings`;
    
    // Basic Auth: base64 encode userId:apiKey
    const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');
    
    const options = {
      hostname: 'api.brewfather.app',
      path: url,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: json
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const batchId = req.query.batchId;
    
    if (!batchId) {
      res.status(400).json({ error: 'Missing batchId parameter' });
      return;
    }
    
    // Check cache
    const now = Date.now();
    const cacheKey = `readings_${batchId}`;
    const TTL = 5 * 60 * 1000; // 5 minutes
    
    if (cache[cacheKey] && cache[cacheKey].timestamp && (now - cache[cacheKey].timestamp) < TTL) {
      console.log(`✅ Returning cached readings for batch ${batchId}`);
      res.status(200).json({
        ...cache[cacheKey].data,
        cached: true,
        cache_age_minutes: Math.round((now - cache[cacheKey].timestamp) / (1000 * 60))
      });
      return;
    }
    
    // Get credentials from environment variables
    const userId = process.env.BREWFATHER_USER_ID;
    const apiKey = process.env.BREWFATHER_API_KEY;
    
    if (!userId || !apiKey) {
      res.status(500).json({
        error: 'Configuration error',
        message: 'Missing BREWFATHER_USER_ID or BREWFATHER_API_KEY environment variables'
      });
      return;
    }
    
    console.log(`🔄 Fetching readings for batch ${batchId}...`);
    
    // Fetch from Brewfather
    const response = await fetchBatchReadings(userId, apiKey, batchId);
    
    if (response.statusCode !== 200) {
      throw new Error(`Brewfather API error: HTTP ${response.statusCode}`);
    }
    
    // Log first reading to see available fields
    if (response.data && response.data.length > 0) {
      console.log('🔍 Raw reading data sample:');
      console.log('   Available fields:', Object.keys(response.data[0]));
      if (response.data[0].comment) {
        console.log('   Comment:', response.data[0].comment);
      }
      if (response.data[0].deviceType) {
        console.log('   Device type:', response.data[0].deviceType);
      }
    }
    
    const result = {
      readings: response.data,
      count: response.data.length,
      fetchedAt: new Date().toISOString()
    };
    
    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: now
    };
    
    console.log(`✅ Fetched ${response.data.length} readings for batch ${batchId}`);
    
    res.status(200).json({
      ...result,
      cached: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching readings:', error);
    res.status(500).json({
      error: 'Failed to fetch readings',
      message: error.message
    });
  }
};



