import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './style/index.css';
import { AuthProvider } from './context/index';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
    <App />
     </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);