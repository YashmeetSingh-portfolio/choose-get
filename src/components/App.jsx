import { useState } from 'react'
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import NavBar from './navBar.jsx';
import '../style/nav.css';
import Hero from './hero.jsx';
import Products from './products.jsx';
import Cart from './cart.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import { AuthProvider } from '../context/index.jsx';
import ReturnsOrders from './returnsOrders.jsx';
import ProductDetails from './product_detail.jsx';
import CheckoutPage from './checkoutpage.jsx';
import '../style/app.css';
function App() {

  const [count, setCount] = useState(0);
   
  return (
    <div className="App">
      <Routes>

        <Route
          path="/"
          element={
            <>
              <NavBar /> 
              <Hero />
              <Products />
            </>
          }


        />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="returnAndOrders" element={<ReturnsOrders />} />
        <Route path="checkout" element={<CheckoutPage />} />

  
      </Routes>
    </div>
  );
}

export default App;