import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Response interceptor — extracts the real error message so thunks catch it properly
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // Network error — json-server is probably not running
      return Promise.reject(
        "Cannot connect to server. Run: npx json-server --watch backend/db.json --port 3000"
      );
    }
    // HTTP error (404, 400, 500, etc.)
    const msg = error.response?.data?.message || `Server error ${error.response.status}`;
    return Promise.reject(msg);
  }
);

export default api;