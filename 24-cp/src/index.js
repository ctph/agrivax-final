// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// ────────────────
// 1) Monkey-patch createImageBitmap so it never rejects or returns null
// ────────────────
if (typeof window.createImageBitmap === "function") {
  const origCreate = window.createImageBitmap.bind(window);
  window.createImageBitmap = (...args) => {
    return origCreate(...args).catch((err) => {
      console.warn("Suppressed createImageBitmap error:", err);
      // return a dummy ImageBitmap-like object
      return Promise.resolve({
        close: () => {},
        // any other props that 3Dmol might inspect can go here
      });
    });
  };
}

// ────────────────
// 2) Suppress any uncaught “bitmap.close” errors
// ────────────────
window.addEventListener("error", (evt) => {
  if (
    evt instanceof ErrorEvent &&
    evt.message.includes("bitmap.close")
  ) {
    evt.preventDefault();
    console.warn("Suppressed a bitmap.close runtime error");
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <BrowserRouter>
   <App />
 </BrowserRouter>
);
