import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App.tsx';
import './index.css';

inject(); // Initialize Vercel Analytics

createRoot(document.getElementById("root")!).render(<App />);
