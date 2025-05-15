import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavBar from './navBar';
import '../style/checkoutpage.css';
import {
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'cash-on-delivery',
  });

  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartProducts')) || [];
    setCart(storedCart);
  }, []);

  const Total = localStorage.getItem('cartTotal') || 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!auth.currentUser) {
      setError('Please sign in to complete your order');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        userId: auth.currentUser.uid,
        items: cart,
        totalAmount: Total,
        shippingInfo: {
          ...formData,
        },
        paymentMethod: 'cash-on-delivery',
        status: 'processing',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);

      localStorage.removeItem('cartProducts');
      localStorage.removeItem('cartTotal');
      setCart([]);
      setLastOrder(orderData);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <NavBar />
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Processing your order...</h3>
          <p>Please wait while we complete your purchase</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <NavBar />
        <div className="order-success-container">
          <div className="success-content">
            <div className="success-header">
              <div className="success-icon">
                <FiCheckCircle />
              </div>
              <h2>Order Confirmed!</h2>
              <p className="success-message">Thank you for your purchase. Your order #{(Math.random() * 1000000).toFixed(0)} has been placed.</p>
            </div>
    
            {lastOrder ? (
              <div className="order-summary">
                <h3>Order Summary</h3>
                
                <div className="order-items">
                  {lastOrder.items.map((item, index) => {
                    const priceNum = parseFloat(item.price.replace('$', ''));
                    const itemTotal = priceNum * item.quantity;
                    
                    return (
                      <div className="order-item" key={index}>
                        <span className="item-quantity">{item.quantity} ×</span>
                        <span className="item-name">{item.title}</span>
                        <span className="item-price">${itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="order-totals">
                  <div className="order-row">
                    <span>Subtotal</span>
                    <span>${parseFloat(Total).toFixed(2)}</span>
                  </div>
                  <div className="order-row">
                    <span>Shipping</span>
                    <span>{parseFloat(Total) > 50 ? 'FREE' : '$5.99'}</span>
                  </div>
                  <div className="order-row">
                    <span>Tax</span>
                    <span>${(parseFloat(Total) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="order-divider"></div>
                  <div className="order-row total">
                    <span>Total</span>
                    <span>${(parseFloat(Total) * 1.08 + (parseFloat(Total) > 50 ? 0 : 5.99)).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="shipping-info">
                  <h4>Shipping Information</h4>
                  <p>{lastOrder.shippingInfo.name}</p>
                  <p>{lastOrder.shippingInfo.address}</p>
                  <p>{lastOrder.shippingInfo.city}, {lastOrder.shippingInfo.zip}</p>
                  <p>{lastOrder.shippingInfo.phone}</p>
                </div>
                
                <div className="delivery-estimate">
                  <FiTruck className="truck-icon" />
                  <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
                </div>
              </div>
            ) : (
              <p className="no-order">No order details available.</p>
            )}
            
            <div className="order-actions">
              <button className="print-btn" onClick={() => window.print()}>
                Print Receipt
              </button>
              <button 
                className="continue-btn" 
                onClick={() => navigate('/')}
              >
                <FiArrowLeft className="btn-icon" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <NavBar />
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <h3>{error}</h3>
          <button className="retry-button" onClick={() => setError(null)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <NavBar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span>1</span>
              <p>Information</p>
            </div>
            <div className="step">
              <span>2</span>
              <p>Payment</p>
            </div>
            <div className="step">
              <span>3</span>
              <p>Confirmation</p>
            </div>
          </div>
        </div>

        <div className="checkout-layout">
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            <div className="form-section">
              <h2>
                <FiMapPin className="section-icon" />
                Contact Information
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>
                <FiTruck className="section-icon" />
                Shipping Address
              </h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main St"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="New York"
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>
                <FiCreditCard className="section-icon" />
                Payment Method
              </h2>
              <div className="payment-method">
                <div className="payment-card">
                  <div className="payment-icon">
                    <FiCreditCard />
                  </div>
                  <div className="payment-details">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when you receive your order</p>
                  </div>
                  <div className="payment-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={formData.paymentMethod === 'cash-on-delivery'}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <p className="payment-notice">
                  We currently only accept Cash on Delivery. Please prepare the exact amount when our delivery personnel arrives.
                </p>
              </div>
            </div>
          </form>

          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>${parseFloat(item.price.replace('$', '')).toFixed(2)} each</p>
                    </div>
                    <div className="item-price">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="order-row">
                  <span>Subtotal</span>
                  <span>${parseFloat(Total).toFixed(2)}</span>
                </div>
                <div className="order-row">
                  <span>Shipping</span>
                  <span>{parseFloat(Total) > 50 ? 'FREE' : '$5.99'}</span>
                </div>
                <div className="order-row">
                  <span>Tax</span>
                  <span>${(parseFloat(Total) * 0.08).toFixed(2)}</span>
                </div>
                <div className="order-divider"></div>
                <div className="order-row total">
                  <span>Total</span>
                  <span>${(parseFloat(Total) * 1.08 + (parseFloat(Total) > 50 ? 0 : 5.99)).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="place-order-btn"
                onClick={handleSubmitOrder}
              >
                Place Order
              </button>
              
              <div className="secure-checkout">
                <div className="secure-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
                  </svg>
                </div>
                <p>Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;