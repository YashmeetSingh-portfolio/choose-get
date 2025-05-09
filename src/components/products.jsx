import React, { useState } from 'react';
import '../style/products.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const products = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life",
    price: "$129.99",
    originalPrice: "$179.99",
    rating: 4.8,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Electronics",
    inStock: true,
    tags: ["best-seller", "wireless", "audio"]
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    description: "100% organic cotton unisex t-shirt in various colors",
    price: "$24.99",
    originalPrice: "$34.99",
    rating: 4.5,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80",
    category: "Clothing",
    inStock: true,
    tags: ["eco-friendly", "basic"]
  },
  {
    id: 3,
    title: "Stainless Steel Water Bottle",
    description: "Insulated 32oz bottle that keeps drinks cold for 24 hours",
    price: "$29.95",
    originalPrice: "$79.99",
    rating: 4.9,
    reviews: 328,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    inStock: true,
    tags: ["bestseller", "eco-friendly"]
  },
  {
    id: 4,
    title: "Smart Fitness Tracker",
    description: "Track your heart rate, steps, and sleep patterns",
    price: "$79.99",
    originalPrice: "$99.99",
    rating: 4.3,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1551649001-7a2482d98d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Electronics",
    inStock: false,
    tags: ["fitness", "wearable"]
  },
  {
    id: 5,
    title: "Leather Wallet",
    description: "Genuine leather bifold wallet with RFID protection",
    price: "$45.00",
    originalPrice: "$99.99",
    rating: 4.7,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    inStock: true,
    tags: ["premium", "men"]
  },
  {
    id: 6,
    title: "Ceramic Coffee Mug Set",
    description: "Set of 4 handmade ceramic mugs with comfortable handles",
    price: "$39.99",
    originalPrice: "$79.99",
    rating: 4.6,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Home",
    inStock: true,
    tags: ["kitchen", "gift"]
  },
  {
    id: 7,
    title: "Yoga Mat",
    description: "Eco-friendly non-slip yoga mat with carrying strap",
    price: "$49.95",
    originalPrice: "$59.95",
    rating: 4.4,
    reviews: 113,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Fitness",
    inStock: true,
    tags: ["yoga", "eco-friendly"]
  },
  {
    id: 8,
    title: "Wireless Phone Charger",
    description: "10W fast charging pad compatible with all Qi-enabled devices",
    price: "$34.99",
    originalPrice: "$79.99",
    rating: 4.2,
    reviews: 204,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Electronics",
    inStock: true,
    tags: ["gadget", "charging"]
  },
  {
    id: 9,
    title: "Cotton Throw Blanket",
    description: "Soft and cozy 50\" x 60\" blanket perfect for all seasons",
    price: "$59.99",
    originalPrice: "$99.99",
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1600181956613-9c0ce14b926a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Home",
    inStock: true,
    tags: ["comfort", "living-room"]
  },
  {
    id: 10,
    title: "Stainless Steel Cookware Set",
    description: "10-piece professional-grade cookware set with copper core",
    price: "$299.99",
    originalPrice: "$399.99",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1583773720419-4a8b05f8ed2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Kitchen",
    inStock: true,
    tags: ["premium", "cooking"]
  },
  {
    id: 11,
    title: "Noise Cancelling Earbuds",
    description: "Compact earbuds with active noise cancellation and 20-hour battery life",
    price: "$89.99",
    originalPrice: "$129.99",
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1590650046871-92c887180603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    category: "Electronics",
    inStock: true,
    tags: ["wireless", "portable", "audio"]
  },
  {
    id: 12,
    title: "Portable Laptop Stand",
    description: "Adjustable ergonomic aluminum stand for laptops up to 17 inches",
    price: "$27.50",
    originalPrice: "$59.99",
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1602526218850-303ec10f290c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    category: "Accessories",
    inStock: true,
    tags: ["ergonomic", "office", "laptop"]
  }
];

function Products() {
  const [productQuantities, setProductQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {})
  );
  const navigate = useNavigate()
  function handleQuantityChange(productId, newQuantity) {
    if (newQuantity < 1) return;
    setProductQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  }

  function handleAddToCart(product) {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      
     
      const existingProductIndex = storedProducts.findIndex(p => p.id === product.id);
      
      let updatedProducts;
      if (existingProductIndex >= 0) {
        
        updatedProducts = [...storedProducts];
        updatedProducts[existingProductIndex].quantity += productQuantities[product.id];
      } else {
        
        const productWithQuantity = {
          ...product,
          quantity: productQuantities[product.id]
        };
        updatedProducts = [...storedProducts, productWithQuantity];
      }
  
      localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
      const count = updatedProducts.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem('cartCount', count);
      window.dispatchEvent(new Event('cartUpdated'));

      console.log('Cart updated:', updatedProducts);
    } catch (error) {
      console.error('Error handling cart update:', error);
    }
  }
  
 
  return (
    <>
      <h2 className="section-title">Featured Products</h2>
      <div className="products-container">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            
          >
            <img 
              src={product.image} 
              alt={product.title} 
              className="product-image" 
              loading="lazy"
            />
            <div className="product-details">
              <h2 className="product-title">{product.title}</h2>
              <p className="product-description">{product.description}</p>
              <div className="price-container">
                <p className="product-price">${product.price}</p>
                {product.originalPrice && (
                  <p className="original-price"><s>${product.originalPrice}</s></p>
                )}
              </div>
              <div className="rating-container">
                <span className="product-rating">⭐ {product.rating}</span>
                <span className="product-reviews">({product.reviews} reviews)</span>
              </div>
              <div className="quantity-controls">
                <button 
                  className="quantity-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleQuantityChange(product.id, productQuantities[product.id] - 1);
                  }}
                >
                  -
                </button>
                <span className="quantity-display">{productQuantities[product.id]}</span>
                <button 
                  className="quantity-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleQuantityChange(product.id, productQuantities[product.id] + 1);
                  }}
                >
                  +
                </button>
              </div>
              <button 
                className={`add-to-cart-button ${!product.inStock ? 'out-of-stock' : ''}`}
                disabled={!product.inStock}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  handleAddToCart(product);
                }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}   
      </div>
    </>
  );
}
export default Products;
