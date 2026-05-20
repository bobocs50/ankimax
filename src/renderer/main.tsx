import React from 'react';
import ReactDOM from 'react-dom/client';
import MainWindow from '@/pages/MainWindow';
import './global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainWindow />
  </React.StrictMode>
);
