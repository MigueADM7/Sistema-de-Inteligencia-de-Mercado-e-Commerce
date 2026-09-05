import React, { useState, useEffect } from 'react';
import { fetchAnalytics, fetchOpportunities } from './services/api';

function App() {
  const [markup, setMarkup] = useState(35);
  const [analytics, setAnalytics] = useState(null);
  const [opportunities, setOpportunities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsData, opportunitiesData] = await Promise.all([
          fetchAnalytics(),
          fetchOpportunities()
        ]);
        setAnalytics(analyticsData);
        setOpportunities(opportunitiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateMetrics = (backendPrice) => {
    // Base Cost COP = Original price from backend / 1.35
    const costCOP = backendPrice / 1.35;
    const sellPrice = costCOP * (1 + markup / 100);
    const profit = sellPrice - costCOP;
    return { costCOP, sellPrice, profit };
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const catalog = opportunities?.catalog || [];
  const top3 = opportunities?.top3 || [];

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <h1>El Gigante del Hogar</h1>
          <p>Simulador Dinámico de Inteligencia de Mercado</p>
        </div>
        
        <div className="controls-card">
          <div className="controls-header">
            <span>Markup Comercial</span>
            <span className="markup-badge">{markup}%</span>
          </div>
          <div className="slider-container">
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={markup} 
              onChange={(e) => setMarkup(Number(e.target.value))}
              className="slider"
            />
          </div>
        </div>
      </header>

      {/* Section 1: Resumen por Categoría */}
      <section>
        <h2 className="section-title">Resumen por Categoría</h2>
        <div className="analytics-grid">
          {analytics && Object.entries(analytics).map(([category, data]) => (
            <div key={category} className="analytics-card">
              <div className="analytics-category">{category}</div>
              {/* As the requirements state: "Tarjetas ejecutivas con los precios promedio en COP" */}
              <div className="analytics-price">
                {formatCurrency(data.averagePriceCOP)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {data.totalProducts} productos
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Top 3 de Oportunidad */}
      <section>
        <h2 className="section-title">Top 3 Oportunidades Estrella</h2>
        <div className="product-grid">
          {top3.map((product) => {
            const metrics = calculateMetrics(product.price);
            return (
              <div key={product.id} className="product-card highlight">
                <div className="rating-badge">
                  <span className="star-icon">★</span> {product.rating.rate} ({product.rating.count})
                </div>
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-content">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-metrics">
                    <div className="metric-row">
                      <span className="metric-label">Costo Base</span>
                      <span className="metric-value">{formatCurrency(metrics.costCOP)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Precio Proyectado</span>
                      <span className="metric-value">{formatCurrency(metrics.sellPrice)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Utilidad</span>
                      <span className="metric-value profit">+{formatCurrency(metrics.profit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Catálogo Completo */}
      <section>
        <h2 className="section-title">Catálogo Completo</h2>
        <div className="product-grid">
          {catalog.map((product) => {
            const metrics = calculateMetrics(product.price);
            return (
              <div key={product.id} className="product-card">
                <div className="rating-badge">
                  <span className="star-icon">★</span> {product.rating?.rate || '0.0'}
                </div>
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-content">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-metrics">
                    <div className="metric-row">
                      <span className="metric-label">Costo Base</span>
                      <span className="metric-value">{formatCurrency(metrics.costCOP)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Precio de Venta</span>
                      <span className="metric-value">{formatCurrency(metrics.sellPrice)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Utilidad Proyectada</span>
                      <span className="metric-value profit">+{formatCurrency(metrics.profit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
