const axios = require('axios');
const NodeCache = require('node-cache');
const CircuitBreaker = require('opossum');
const fs = require('fs/promises');
const path = require('path');

/**
 * Repository for interacting with the External FakeStore API.
 * Includes caching and resilience (Circuit Breaker).
 */
class ExternalApiRepository {
  constructor() {
    // Initialize cache with 10 minutes (600 seconds) Time-To-Live
    this.cache = new NodeCache({ stdTTL: 600 });
    this.cacheKey = 'products';
    
    const breakerOptions = {
      timeout: 3000, // 3 seconds timeout
      errorThresholdPercentage: 50, // 50% error threshold
      resetTimeout: 5000 // 5 seconds reset timeout
    };

    // The core API fetching logic
    const fetchFromApi = async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      const data = response.data;
      
      // Save to cache ONLY on successful API request
      this.cache.set(this.cacheKey, data);
      
      return data;
    };

    // Instantiate Circuit Breaker
    this.breaker = new CircuitBreaker(fetchFromApi, breakerOptions);

    // Configure fallback to read from backup_catalog.json
    this.breaker.fallback(async () => {
      try {
        console.warn('[Circuit Breaker] Fallback triggered. Returning backup catalog.');
        const backupPath = path.resolve(__dirname, '../../backup_catalog.json');
        const backupData = await fs.readFile(backupPath, 'utf-8');
        return JSON.parse(backupData);
      } catch (error) {
        console.error('[Circuit Breaker] Fallback failed to read backup:', error.message);
        return [];
      }
    });
  }

  /**
   * Fetches products utilizing Cache and Circuit Breaker
   * 
   * @returns {Promise<Array>} Array of products
   */
  async fetchProducts() {
    // 1. Check if products exist in cache
    const cachedProducts = this.cache.get(this.cacheKey);
    if (cachedProducts) {
      console.log('[Cache] Returning products from cache.');
      return cachedProducts;
    }

    // 2. If not in cache, use Circuit Breaker to fetch
    console.log('[API] Fetching products via Circuit Breaker...');
    return await this.breaker.fire();
  }
}

module.exports = ExternalApiRepository;
