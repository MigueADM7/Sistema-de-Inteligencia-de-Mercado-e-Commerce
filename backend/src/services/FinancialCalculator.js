/**
 * Implementation of IFinancialStrategy.
 * Responsible for financial calculations applying specific business rules.
 * 
 * Business Rules:
 * - Fixed TRM: 4000 COP
 * - Markup (Gross Profit Margin): 35%
 * 
 * @implements {IFinancialStrategy}
 */
class FinancialCalculator {
  constructor() {
    this.TRM = 4000;
    this.MARKUP_PERCENTAGE = 0.35;
  }

  /**
   * Calculates the final sale price based on business rules.
   * 
   * @param {number} priceInUSD - The original price in USD.
   * @returns {number} The final sale price in COP.
   */
  calculatePrice(priceInUSD) {
    if (typeof priceInUSD !== 'number' || priceInUSD < 0) {
      throw new Error('Price in USD must be a positive number.');
    }

    // Convert to COP
    const subtotalInCOP = priceInUSD * this.TRM;
    
    // Apply 35% Markup
    const finalSalePrice = subtotalInCOP * (1 + this.MARKUP_PERCENTAGE);
    
    return finalSalePrice;
  }
}

module.exports = FinancialCalculator;
