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
      <div className="checkout-container">
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
      <div className="order-success-container">
        <div className="success-header">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <h2>Order Confirmed!</h2>
          <p className="success-message">Thank you for your purchase. A confirmation email has been sent.</p>
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
            
            <div className="order-total">
              <span>Total</span>
              <span>${Total}</span>
            </div>
            
            <div className="order-meta">
          
              <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
            </div>
          </div>
        ) : (
          <p className="no-order">No order details available.</p>
        )}
        
        <div className="order-actions">
          <button className="print-btn" onClick={() => window.print()}>
            Print Receipt
          </button>
          <button className="continue-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
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
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-steps">
          <div className="step active">
            <span>1</span>
            <p>Shipping</p>
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

        <form onSubmit={handleSubmitOrder} className="checkout-form">
          <div className="form-section">
            <h2>
              <FiMapPin /> Shipping Information
            </h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
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
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>
              <FiCreditCard /> Payment Method
            </h2>
            <div className="payment-methods">
              <div className="cash-on-delivery-notice">
                <p>
                  We currently only accept <strong>Cash on Delivery</strong> as
                  payment method.
                </p>
                <p>
                  Please prepare the exact amount when our delivery personnel
                  arrives.
                </p>
              </div>
              <input
                type="hidden"
                name="paymentMethod"
                value="cash-on-delivery"
              />
            </div>
          </div>

          <div className="order-summary">
            <h2>
              <FiTruck /> Order Summary
            </h2>
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity} ×</span>
                    <span className="item-name">{item.title}</span>
                  </div>
                  <span className="item-price">
                    ${parseFloat(item.price.replace('$', '')) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${Total}</span>
            </div>
            <button type="submit" className="place-order-btn">
              Place Order (Cash on Delivery)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
