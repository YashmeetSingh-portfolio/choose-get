import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './navBar';
import '../style/nav.css';
import '../style/cart.css';
import { db, auth } from '../firebase/firebase'; // Import Firebase Auth and Firestore
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'; // Firestore functions
function Cart() {
  const navigate = useNavigate();
  const [localCartProducts, setLocalCartProducts] = useState([]);

  // Load cart products from localStorage when component mounts
 
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('cartProducts');
      if (storedProducts) {
        setLocalCartProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error parsing cart products:', error);
    }
  }, []);

  function handleRemoveFromCart(productId) {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
      const updatedProducts = storedProducts.filter(product => product.id !== productId);
      
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
          const newQuantity = product.quantity + amount;
          return {
            ...product,
            quantity: newQuantity > 0 ? newQuantity : 1
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

  function calculateTotal() {
    return localCartProducts.reduce((total, product) => {
      const price = parseFloat(product.price.replace('$', ''));

      return total + (price * product.quantity);
    }, 0).toFixed(2);
  }
 localStorage.setItem('cartTotal', JSON.stringify(calculateTotal()));
  async function handleCheckOut() {
    navigate('/checkout');
  }

  if (localCartProducts.length > 0) {
    return (
      <div className="cart">
        <NavBar />
        <div className="cart-layout">
          <div className="products-list">
            {localCartProducts.map((cartProduct) => (
              <div key={cartProduct.id} className="cart-card">
                <img 
                  src={cartProduct.image} 
                  alt={cartProduct.title} 
                  className="cart-image" 
                  loading="lazy"
                />
                <div className="cart-details">
                  <h2 className="cart-title">{cartProduct.title}</h2>
                  <p className="cart-description">{cartProduct.description}</p>
                  <div className="price-container">
                    <p className="cart-price">{cartProduct.price}</p>
                    {cartProduct.originalPrice && (
                      <p className="original-price"><s>{cartProduct.originalPrice}</s></p>
                    )}
                  </div>
                  <div className="rating-container">
                    <span className="cart-rating">⭐ {cartProduct.rating}</span>
                    <span className="cart-reviews">({cartProduct.reviews} reviews)</span>
                  </div>
                  <div className="cart-quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(cartProduct.id, -1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{cartProduct.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(cartProduct.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-total">
                    Item Total: ${(parseFloat(cartProduct.price.replace('$', '')) * cartProduct.quantity).toFixed(2)}
                  </p>
                  <button 
                    className="remove-from-cart-button"
                    onClick={() => handleRemoveFromCart(cartProduct.id)}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-container">
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Total Items: {localCartProducts.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <p>Subtotal: ${calculateTotal()}</p>
              <button onClick={handleCheckOut} className="checkout-button">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <NavBar />
        <div className="empty-cart">
          <h2 className='empty'>Your cart is empty!</h2>
        </div>
      </>
    );
  }
}

export default Cart;