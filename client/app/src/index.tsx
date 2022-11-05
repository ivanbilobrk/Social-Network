import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root') as Element;
const root = createRoot(container); 

root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
  </BrowserRouter>);
