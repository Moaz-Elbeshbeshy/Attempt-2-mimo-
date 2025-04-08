import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set up Axios interceptor to add token to all requests
const token = localStorage.getItem('token');
if (token) {
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    // Only add auth header for API requests
    if (typeof url === 'string' && url.startsWith('/api')) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return originalFetch(url, options);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
