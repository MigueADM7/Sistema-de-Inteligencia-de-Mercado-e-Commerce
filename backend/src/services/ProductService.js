const ExternalApiRepository = require('../repositories/ExternalApiRepository');
const FinancialCalculator = require('./FinancialCalculator');

class ProductService {
  constructor() {
    this.externalApiRepository = new ExternalApiRepository();
    this.financialCalculator = new FinancialCalculator();
  }

  /**
   * Fetches the original catalog and processes it by replacing the original USD price
   * with the final calculated sale price in COP.
   * 
   * @returns {Promise<Array>} The processed catalog
   */
  async getProcessedCatalog() {
    const products = await this.externalApiRepository.fetchProducts();
    
    return products.map(product => {
      return {
        ...product,
        // Replace original price with the calculated one in COP
        price: this.financialCalculator.calculatePrice(product.price)
      };
    });
  }

  /**
   * Filters the processed catalog for top opportunities based on ratings.
   * Requirements: rating.rate >= 4.0 and rating.count > 100
   * 
   * @param {Array} catalog - The processed catalog
   * @returns {Array} Max 3 elements of top opportunities
   */
  getTopOpportunities(catalog) {
    const opportunities = catalog.filter(product => {
      return product.rating && product.rating.rate >= 4.0 && product.rating.count > 100;
    });
    
    return opportunities.slice(0, 3);
  }

  /**
   * Groups the processed catalog by category and calculates the average COP price.
   * 
   * @param {Array} catalog - The processed catalog
   * @returns {Object} Analytics mapped by category
   */
  getAnalytics(catalog) {
    const categoryGroups = {};

    // Grouping and summing up
    catalog.forEach(product => {
      const category = product.category;
      if (!categoryGroups[category]) {
        categoryGroups[category] = { sum: 0, count: 0 };
      }
      categoryGroups[category].sum += product.price;
      categoryGroups[category].count += 1;
    });

    // Calculating averages
    const analytics = {};
    for (const [category, data] of Object.entries(categoryGroups)) {
      analytics[category] = {
        averagePriceCOP: data.sum / data.count,
        totalProducts: data.count
      };
    }

    return analytics;
  }
}

module.exports = ProductService;
