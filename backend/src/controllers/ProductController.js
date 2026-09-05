const express = require('express');
const ProductService = require('../services/ProductService');

const router = express.Router();
const productService = new ProductService();

/**
 * GET /analytics
 * Retorna las métricas del servicio (precios promedio en COP por categoría).
 */
router.get('/analytics', async (req, res) => {
  try {
    const catalog = await productService.getProcessedCatalog();
    const analytics = productService.getAnalytics(catalog);
    
    res.status(200).json(analytics);
  } catch (error) {
    console.error('[ProductController] Error fetching analytics:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

/**
 * GET /products/opportunities
 * Retorna el catálogo completo procesado y el top 3 de oportunidades.
 */
router.get('/products/opportunities', async (req, res) => {
  try {
    const catalog = await productService.getProcessedCatalog();
    const top3 = productService.getTopOpportunities(catalog);
    
    res.status(200).json({
      catalog: catalog,
      top3: top3
    });
  } catch (error) {
    console.error('[ProductController] Error fetching opportunities:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

module.exports = router;
