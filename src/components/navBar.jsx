import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaBoxOpen, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/index';
import { doSignOut } from '../firebase/auth';

function NavBar() {
    const [localCartCount, setLocalCartCount] = useState(0);
    const { userLoggedIn, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const updateCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
            setLocalCartCount(cart.length);
        } catch (error) {
            console.error('Error reading cart:', error);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <>
            {authLoading ? (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    {/* Main Desktop Navbar */}
                    <div className="navbar-container">
                        <div className="navbar-gradient"></div>
                        <nav className="navbar">
                            <div className="navbar-content">
                                <div className="navbar-brand">
                                    <Link to="/" className="logo">
                                        <span className="logo-icon">
                                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 16H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                                <path d="M4 8H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                                <path d="M4 24H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <span className="logo-text">Choose<span className="logo-highlight">&</span>Get</span>
                                    </Link>
                                </div>

                                <div className="search-container">
                                    <div className="search-bar">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="search-input"
                                            aria-label="Search products"
                                        />
                                        <button className="search-button" aria-label="Search">
                                            <FaSearch className="search-icon" />
                                        </button>
                                        <div className="search-border"></div>
                                    </div>
                                </div>

                                <div className="nav-actions">
                                    {userLoggedIn ? (
                                        <button onClick={handleLogout} className="nav-link">
                                            <FaUser className="nav-icon" />
                                            <span className="nav-text">Logout</span>
                                        </button>
                                    ) : (
                                        <Link to="/login" className="nav-link">
                                            <FaUser className="nav-icon" />
                                            <span className="nav-text">Login</span>
                                        </Link>
                                    )}
                                    <Link to="/returnAndOrders" className="nav-link">
                                        <FaBoxOpen className="nav-icon" />
                                        <span className="nav-text">Orders</span>
                                    </Link>
                                    <Link to="/cart" className="nav-link cart-link">
                                        <FaShoppingCart className="nav-icon" />
                                        <span className="nav-text">Cart</span>
                                        {localCartCount > 0 && (
                                            <span className="cart-count">{localCartCount}</span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* Mobile Bottom Navigation */}
                    <div className="mobile-bottom-nav">
                        <Link to="/" className="mobile-nav-item">
                            <FaHome className="mobile-nav-icon" />
                            <span className="mobile-nav-label">Home</span>
                        </Link>
                        <Link to="/returnAndOrders" className="mobile-nav-item">
                            <FaBoxOpen className="mobile-nav-icon" />
                            <span className="mobile-nav-label">Orders</span>
                        </Link>
                        <Link to="/cart" className="mobile-nav-item cart-item">
                            <FaShoppingCart className="mobile-nav-icon" />
                            <span className="mobile-nav-label">Cart</span>
                            {localCartCount > 0 && (
                                <span className="mobile-cart-count">{localCartCount}</span>
                            )}
                        </Link>
                        {userLoggedIn ? (
                            <button onClick={handleLogout} className="mobile-nav-item nav-link">
                                <FaUser className="mobile-nav-icon" />
                                <span className="mobile-nav-label">Logout</span>
                            </button>
                        ) : (
                            <Link to="/login" className="mobile-nav-item ">
                                <FaUser className="mobile-nav-icon" />
                                <span className="mobile-nav-label">Login</span>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default NavBar;