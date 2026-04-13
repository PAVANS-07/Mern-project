import api from "../api/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {

  // store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  // error + success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle login
  const login = async () => {

    // reset messages
    setError("");
    setSuccess("");

    // simple validation
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);

      // show success
      setSuccess("Login successful");
      toast.success("Login successful");

      // redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {

      const message = err.response?.data?.msg || "Login failed";

      // show error
      setError(message);

      // toast
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {/* SUCCESS BOX */}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-center">
            {success}
          </div>
        )}

        {/* ERROR BOX */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full border p-2 mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>

        {/* FORGOT PASSWORD */}
        <p className="text-center mt-2">
          <a href="/forgot" className="text-blue-500">
            Forgot Password?
          </a>
        </p>

      </div>
    </div>
  );
}