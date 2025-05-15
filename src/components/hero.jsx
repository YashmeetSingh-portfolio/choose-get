import React from 'react';
import '../style/hero.css';

function Hero() {
  return ( 
    <section className="hero">
      <div className="hero-gradient-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-tag">Premium Collection</div>
          <h1 className="hero-title">Elevate Your <span className="hero-highlight">Shopping</span> Experience</h1>
          <p className="hero-subtitle">Discover curated products with exclusive member benefits and lightning-fast delivery</p>
          <div className="hero-cta">
            <a href="#shop-now" className="cta-button primary">
              <span>Shop Now</span>
              <svg className="cta-icon" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#learn-more" className="cta-button secondary">
              <span>Explore More</span>
              <svg className="cta-icon" viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Premium Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2-Day</div>
              <div className="stat-label">Fast Delivery</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1598&q=80" 
              alt="Featured products" 
              loading="lazy"
              className="hero-img"
            />
          </div>
          <div className="hero-badge">
            <span className="badge-text">New Arrivals</span>
            <span className="badge-arrow">→</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;