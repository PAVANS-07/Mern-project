import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

// route protection components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Router wrapper */}
      <BrowserRouter>
        <Routes>

          {/* Public routes (accessible only when NOT logged in) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes (only logged-in users can access) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* These can stay public */}
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />

        </Routes>
      </BrowserRouter>

      {/* Toast notifications container */}
      <ToastContainer icon={false} position="top-right" />
    </>
  );
}

export default App;