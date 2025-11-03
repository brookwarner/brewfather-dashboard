// Brewfather API - Batches Endpoint
// This runs as a serverless function or API endpoint

const https = require('https');

// In-memory cache (1 hour for brewing data)
let cache = {
  data: null,
  timestamp: null,
  ttl: 1 * 60 * 60 * 1000 // 1 hour in milliseconds
};

function fetchBrewfatherBatches(userId, apiKey, params = {}) {
  return new Promise((resolve, reject) => {
    // Build query string
    const queryParams = new URLSearchParams({
      status: params.status || 'Fermenting',
      include: params.include || 'estimatedFg,estimatedOg,measuredOg,temp'
    });
    
    const url = `/v1/batches?${queryParams.toString()}`;
    
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

function processBatches(batches) {
  if (!Array.isArray(batches)) {
    return null;
  }
  
  return batches.map(batch => ({
    id: batch._id,
    name: batch.name,
    batchNo: batch.batchNo,
    status: batch.status,
    brewDate: batch.brewDate,
    estimatedOg: batch.estimatedOg,
    estimatedFg: batch.estimatedFg,
    measuredOg: batch.measuredOg,
    measuredFg: batch.measuredFg,
    temp: batch.temp,
    recipe: batch.recipe ? {
      name: batch.recipe.name,
      style: batch.recipe.style ? batch.recipe.style.name : null
    } : null
  }));
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
    // Check cache
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
      console.log('✅ Returning cached Brewfather data');
      res.status(200).json({
        ...cache.data,
        cached: true,
        cache_age_minutes: Math.round((now - cache.timestamp) / (1000 * 60))
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
    
    // Allow query params to override defaults
    const params = {
      status: req.query.status || 'Fermenting',
      include: req.query.include || 'estimatedFg,estimatedOg,measuredOg,temp'
    };
    
    console.log('🔄 Fetching batches from Brewfather API...');
    console.log(`   Status: ${params.status}`);
    console.log(`   Include: ${params.include}`);
    
    // Fetch from Brewfather
    const response = await fetchBrewfatherBatches(userId, apiKey, params);
    
    if (response.statusCode !== 200) {
      throw new Error(`Brewfather API error: HTTP ${response.statusCode}`);
    }
    
    // Process and simplify data
    const processedData = processBatches(response.data);
    
    if (!processedData) {
      throw new Error('Invalid data format from Brewfather API');
    }
    
    const result = {
      batches: processedData,
      count: processedData.length,
      fetchedAt: new Date().toISOString()
    };
    
    // Cache the result
    cache.data = result;
    cache.timestamp = now;
    
    console.log(`✅ Fetched ${processedData.length} batches`);
    
    res.status(200).json({
      ...result,
      cached: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching Brewfather data:', error);
    res.status(500).json({
      error: 'Failed to fetch Brewfather data',
      message: error.message
    });
  }
};

