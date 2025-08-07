// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/ContextAuth';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router at the top level */}
      <AuthProvider> {/* Auth context inside Router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
