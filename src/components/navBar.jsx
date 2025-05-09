import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/index';
import { doSignOut } from '../firebase/auth';

function NavBar() {
    const [localCartCount, setLocalCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userLoggedIn, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate('/login'); // or wherever you want to send after logout
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {authLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="navbar-container">
                    <nav className="navbar">
                        <div className="navbar-content">
                            <div className="navbar-brand">
                                <Link to="/" className="logo">
                                    <span className="logo-icon">🛍️</span>
                                    <span className="logo-text">Choose&Get</span>
                                </Link>
                                <button className="mobile-menu-toggle" onClick={toggleMenu}>
                                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                                </button>
                            </div>

                            <div className="search-container">
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="search-input"
                                        aria-label="Search products"
                                    />
                                    <button className="search-button">
                                        <svg className="search-icon" viewBox="0 0 24 24">
                                            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className={`nav-actions ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
                                {userLoggedIn ? (
                                    <button onClick={handleLogout} className="nav-link login-link">
                                        <span className="nav-text">Logout</span>
                                    </button>
                                ) : (
                                    <Link to="/login" className="nav-link login-link">
                                        <span className="nav-text">Login</span>
                                    </Link>
                                )}

                                <Link to="/returnAndOrders" className="nav-link">
                                    <svg className="nav-icon" viewBox="0 0 24 24">
                                        <path d="M16 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H2v15h20V6h-6zm-6-2h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" />
                                    </svg>
                                    <span className="nav-text">Returns & Orders</span>
                                </Link>

                                <Link to="/cart" className="nav-link cart-link">
                                    <svg className="nav-icon" viewBox="0 0 24 24">
                                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                    <span className="nav-text">Cart</span>
                                    <span className="cart-count">{localCartCount}</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}

export default NavBar;

