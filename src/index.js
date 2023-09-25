import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppComponent from './pages/app-component/app-component';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>
);
