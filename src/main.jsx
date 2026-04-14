import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reactflow/dist/style.css';
import { App } from './app/App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
