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
  FiMail
} from 'react-icons/fi';



function ReturnsOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentStatusIndex = (statusFlow) => {
    return statusFlow.reduce((acc, step, index) => step.completed ? index : acc, -1);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="returns-orders-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <h3>Loading your orders...</h3>
            <p>Please wait while we fetch your purchase history</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="returns-orders-container">
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
      </>
    );
  }

  if (selectedOrder) {
    const currentStatusIndex = getCurrentStatusIndex(selectedOrder.statusFlow);

    // Calculate subtotal (sum of item.price * item.quantity)
      const subtotal = selectedOrder.items.reduce((acc, item) => {
      const price = item.price.replace('$','');
      const quantity =(item.quantity)
      return acc + price * quantity;
    }, 0);

    return (
      <>
        <NavBar />
        <div className="returns-orders-container">
          <div className="order-detail-view">
            <button
              className="back-button"
              onClick={() => setSelectedOrder(null)}
            >
              <FiArrowLeft /> Back to Orders
            </button>

            <div className="order-header">
              <h2>Order # {selectedOrder.id.substring(0, 8).toUpperCase()}</h2>
              <span className={`order-status ${selectedOrder.status || 'processing'}`}>
                {selectedOrder.statusFlow[currentStatusIndex]?.status || 'processing'}
              </span>
            </div>

            <div className="status-flow-container">
              <h3>Order Status</h3>
              <div className="status-flow">
                {selectedOrder.statusFlow.map((step, index) => (
                  <div
                    key={index}
                    className={`status-step ${step.completed ? 'completed' : ''} ${index === currentStatusIndex ? 'current' : ''}`}
                  >
                    <div className="step-icon">
                      {step.completed ? (
                        <FiCheckCircle className="completed-icon" />
                      ) : (
                        <div className="step-number">{index + 1}</div>
                      )}
                    </div>
                    <div className="step-details">
                      <div className="step-title">
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </div>
                      <div className="step-date">
                        {step.date ? formatDate(step.date) : 'Pending'}
                      </div>
                    </div>
                    {index < selectedOrder.statusFlow.length - 1 && (
                      <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="customer-info-section">
              <h3><FiUser /> Customer & Shipping Information</h3>
              <div className="info-grid">
                <div className="info-card">
                  <FiUser className="info-icon" />
                  <div>
                    <h4>Customer</h4>
                    <p>{selectedOrder.shippingInfo?.name || 'Not specified'}</p>
                  </div>
                </div>
                <div className="info-card">
                  <FiMail className="info-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>{selectedOrder.shippingInfo?.email || 'Not specified'}</p>
                  </div>
                </div>
                <div className="info-card">
                  <FiMapPin className="info-icon" />
                  <div>
                    <h4>Shipping Address</h4>
                    <p>
                      {selectedOrder.shippingInfo?.address || 'Not specified'}<br />
                      {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.zip}
                    </p>
                  </div>
                </div>
                <div className="info-card">
                  <FiPhone className="info-icon" />
                  <div>
                    <h4>Contact</h4>
                    <p>{selectedOrder.shippingInfo?.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <h3><FiPackage /> Order Items ({selectedOrder.items.length})</h3>
              <div className="items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={item.id || index} className="item-card">
                    <div className="item-image-placeholder"></div>
                    <div className="item-details">
                      <h4>{item.title || 'Unknown Item'}</h4>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>Price: ${item.price.replace('$','')}</p>
                      <p className="item-subtotal">
                        Subtotal: ${(item.quantity  * item.price.replace('$',''))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary-section">
              <h3><FiDollarSign /> Order Summary</h3>
              <div className="summary-grid">
                <div>
                  <p>Subtotal:</p>
                  <p>Shipping:</p>
               
                  <p className="total">Total:</p>
                </div>
                <div className="text-right">
                  <p>${subtotal.toFixed(2)}</p>
                  
                  <p>$2</p>
                  <p className="total">${Number(selectedOrder.totalAmount)+2}</p>
                </div>
              </div>
            </div>

            <div className="order-actions">
              <button
                className="return-button"
                onClick={() => console.log('Return requested for:', selectedOrder.id)}
              >
                Request Return
              </button>
              <button className="contact-support">Contact Support</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="returns-orders-container">
        <div className="orders-list-container">
          <div className="page-header">
            <h1>Your Orders</h1>
            <p>View and manage your recent purchases</p>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <FiPackage className="empty-icon" />
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet. Start shopping to see them here!</p>
              <button className="shop-now-button">Shop Now</button>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map(order => {
                const currentStatusIndex = getCurrentStatusIndex(order.statusFlow);
                return (
                  <div
                    key={order.id}
                    className="order-card"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="card-header">
                      <span className="order-id">Order #{order.id.substring(0, 8).toUpperCase()}</span>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="order-summary">
                      <div className="status-preview">
                        <span className="status-label">Status:</span>
                        <span className={`status-badge ${order.statusFlow[currentStatusIndex]?.status || 'processing'}`}>
                          {order.statusFlow[currentStatusIndex]?.status || 'processing'}
                        </span>
                      </div>
                      <div className="order-total">
         
                       
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ReturnsOrders;
