import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import NavBar from './navBar';
import '../style/returnsOrders.css';
import {
  FiPackage,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiHome,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiShoppingBag
} from 'react-icons/fi';

function ReturnsOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) {
        setError('Please sign in to view your orders');
        setLoading(false);
        return;
      }

      const userId = auth.currentUser.uid;

      try {
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            totalAmount: data.totalAmount,
            items: Array.isArray(data.items) ? data.items : [],
            createdAt: data.createdAt || new Date(),
            statusFlow: data.statusFlow || [
              { status: 'ordered', date: data.createdAt || new Date(), completed: true },
              { status: 'processing', date: null, completed: false },
              { status: 'shipped', date: null, completed: false },
              { status: 'delivered', date: null, completed: false }
            ]
          };
        });

        setOrders(
          fetchedOrders.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA; // descending order (most recent first)
          })
        );
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please refresh the page or try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Not yet';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentStatusIndex = (statusFlow) => {
    return statusFlow.reduce((acc, step, index) => step.completed ? index : acc, -1);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    const currentStatus = order.statusFlow[getCurrentStatusIndex(order.statusFlow)]?.status;
    return currentStatus === activeTab;
  });

  if (loading) {
    return (
      <div className="returns-orders-page">
        <NavBar />
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Loading your orders...</h3>
          <p>Please wait while we fetch your purchase history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="returns-orders-page">
        <NavBar />
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <h3>{error}</h3>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    const currentStatusIndex = getCurrentStatusIndex(selectedOrder.statusFlow);
    const subtotal = selectedOrder.items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace('$',''));
      return acc + (price * item.quantity);
    }, 0);
    const shipping = 5.99; // Example shipping cost
    const tax = subtotal * 0.08; // Example tax
    const total = subtotal + shipping + tax;

    return (
      <div className="returns-orders-page">
        <NavBar />
        <div className="order-detail-container">
          <button
            className="back-button"
            onClick={() => setSelectedOrder(null)}
          >
            <FiArrowLeft /> Back to Orders
          </button>

          <div className="order-detail-card">
            <div className="order-header">
              <div>
                <h2>Order #{selectedOrder.id.substring(0, 8).toUpperCase()}</h2>
                <p className="order-date">Placed on {formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}</p>
              </div>
              <span className={`order-status ${selectedOrder.statusFlow[currentStatusIndex]?.status || 'processing'}`}>
                {selectedOrder.statusFlow[currentStatusIndex]?.status.toUpperCase() || 'PROCESSING'}
              </span>
            </div>

            <div className="status-tracker">
              <h3>Order Status</h3>
              <div className="status-steps">
                {selectedOrder.statusFlow.map((step, index) => (
                  <div key={index} className={`status-step ${step.completed ? 'completed' : ''} ${index === currentStatusIndex ? 'current' : ''}`}>
                    <div className="step-indicator">
                      {step.completed ? (
                        <FiCheckCircle className="step-icon" />
                      ) : (
                        <div className="step-number">{index + 1}</div>
                      )}
                    </div>
                    <div className="step-info">
                      <div className="step-title">
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </div>
                      <div className="step-date">
                        {step.date ? formatDate(step.date) : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-sections">
              <div className="shipping-section">
                <h3><FiTruck /> Shipping Information</h3>
                <div className="shipping-info">
                  <div className="info-row">
                    <FiUser className="info-icon" />
                    <div>
                      <h4>Customer</h4>
                      <p>{selectedOrder.shippingInfo?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <FiMail className="info-icon" />
                    <div>
                      <h4>Email</h4>
                      <p>{selectedOrder.shippingInfo?.email || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <FiMapPin className="info-icon" />
                    <div>
                      <h4>Address</h4>
                      <p>
                        {selectedOrder.shippingInfo?.address}<br />
                        {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.zip}
                      </p>
                    </div>
                  </div>
                  <div className="info-row">
                    <FiPhone className="info-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>{selectedOrder.shippingInfo?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="items-section">
                <h3><FiPackage /> Order Items ({selectedOrder.items.length})</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <img src={item.image || 'https://via.placeholder.com/80'} alt={item.title} />
                      </div>
                      <div className="item-details">
                        <h4>{item.title}</h4>
                        <p className="item-price">${parseFloat(item.price.replace('$','')).toFixed(2)} × {item.quantity}</p>
                        <p className="item-subtotal">${(parseFloat(item.price.replace('$','')) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <h3><FiDollarSign /> Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-actions">
              <button className="return-btn">
                Request Return
              </button>
              <button className="contact-btn">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="returns-orders-page">
      <NavBar />
      <div className="orders-list-container">
        <div className="page-header">
          <h1>Your Orders</h1>
          <p>View and manage your recent purchases</p>
        </div>

        <div className="orders-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipped' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <FiShoppingBag className="empty-icon" />
            <h3>No orders found</h3>
            <p>{activeTab === 'all' 
              ? "You haven't placed any orders yet. Start shopping to see them here!" 
              : `You don't have any ${activeTab} orders.`}
            </p>
            <button className="shop-now-btn">Shop Now</button>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => {
              const currentStatusIndex = getCurrentStatusIndex(order.statusFlow);
              const currentStatus = order.statusFlow[currentStatusIndex]?.status || 'processing';
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const orderTotal = parseFloat(order.totalAmount).toFixed(2);

              return (
                <div
                  key={order.id}
                  className="order-card"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="card-header">
                    <div>
                      <h3>Order #{order.id.substring(0, 8).toUpperCase()}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`status-badge ${currentStatus}`}>
                      {currentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="order-preview">
                    <div className="items-preview">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="preview-item">
                          <div className="preview-image">
                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.title} />
                          </div>
                          <div className="preview-details">
                            <p>{item.title}</p>
                            <span>× {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="more-items">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>

                    <div className="order-total">
                      {/* <span>Total</span>
                      <span>${orderTotal}</span> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnsOrders;