import React from 'react';
import '../style/hero.css';
function Hero(){
  return ( 
    <>    
    <section className="hero">
    <div className="hero-container">
        <div className="hero-content">
            <h1 className="hero-title">Discover Your Perfect Purchase</h1>
            <p className="hero-subtitle">Shop the latest trends with exclusive deals and fast delivery</p>
            <div className="hero-cta">
                <a href="#shop-now" className="cta-button primary">Shop Now!</a>
                <a href="#learn-more" className="cta-button secondary">Learn More</a>
            </div>
        </div>
        <div className="hero-image"> 
             
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1598&q=80" 
                 alt="Featured products" 
                 loading="lazy"
                 className="hero-img"></img>
            <div className="hero-badge">
                <span className="badge-text">New Arrivals</span>
            </div>
        </div>
    </div>
</section>
</>

  )
}

export default Hero;
