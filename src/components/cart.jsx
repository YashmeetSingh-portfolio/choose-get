import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import NavBar from './navBar';
import '../style/cart.css';

function Cart() {
  const navigate = useNavigate();
  const [localCartProducts, setLocalCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedProducts = localStorage.getItem('cartProducts');
        if (storedProducts) {
          setLocalCartProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error('Error parsing cart products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  function handleRemoveFromCart(productId) {
    try {
      const updatedProducts = localCartProducts.filter(product => product.id !== productId);
      localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
      setLocalCartProducts(updatedProducts);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error handling cart update:', error);
    }
  }

  function handleQuantityChange(productId, amount) {
    try {
      const updatedProducts = localCartProducts.map(product => {
        if (product.id === productId) {
          const newQuantity = Math.max(1, product.quantity + amount);
          return {
            ...product,
            quantity: newQuantity
          };
        }
        return product;
      });

      localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
      setLocalCartProducts(updatedProducts);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  function calculateSubtotal() {
    return localCartProducts.reduce((total, product) => {
      const price = parseFloat(product.price.replace('$', ''));
      return total + (price * product.quantity);
    }, 0).toFixed(2);
  }

  function calculateTotal() {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    return (subtotal + shipping + tax).toFixed(2);
  }

  async function handleCheckOut() {
    localStorage.setItem('cartTotal', JSON.stringify(calculateTotal()));
    navigate('/checkout');
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (localCartProducts.length === 0) {
    return (
      <div className="cart-page">
        <NavBar />
        <div className="empty-cart-container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added any items yet</p>
            <Link to="/" className="continue-shopping-button">
              <FaArrowLeft className="button-icon" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <NavBar />
      
      {/* Mobile Checkout Summary - Fixed at Top */}
      <div className="mobile-checkout-summary">
        <div className="mobile-summary-content">
          <div className="mobile-summary-row">
            <span>Total ({localCartProducts.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
            <span>${calculateSubtotal()}</span>
          </div>
          <button 
            className="mobile-checkout-button"
            onClick={handleCheckOut}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <p>{localCartProducts.reduce((sum, item) => sum + item.quantity, 0)} items</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {localCartProducts.map((cartProduct) => (
              <div key={cartProduct.id} className="cart-item">
                <div className="item-image-container">
                  <img 
                    src={cartProduct.image} 
                    alt={cartProduct.title} 
                    className="item-image" 
                    loading="lazy"
                  />
                </div>
                
                <div className="item-details">
                  <div className="item-header">
                    <h3 className="item-title">{cartProduct.title}</h3>
                    <button 
                      className="remove-item"
                      onClick={() => handleRemoveFromCart(cartProduct.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <p className="item-description">{cartProduct.description}</p>
                  
                  <div className="price-info">
                    <span className="current-price">{cartProduct.price}</span>
                    {cartProduct.originalPrice && (
                      <span className="original-price">{cartProduct.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(cartProduct.id, -1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{cartProduct.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(cartProduct.id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ${(parseFloat(cartProduct.price.replace('$', '')) * cartProduct.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Order Summary - Now at bottom for mobile */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{calculateSubtotal() > 50 ? 'FREE' : '$5.99'}</span>
            </div>
            
            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>${(parseFloat(calculateSubtotal()) * 0.08).toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
            
            <button 
              className="checkout-button"
              onClick={handleCheckOut}
            >
              Proceed to Checkout
            </button>
            
            <Link to="/" className="continue-shopping-link">
              <FaArrowLeft className="link-icon" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;