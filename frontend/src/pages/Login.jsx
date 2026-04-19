import api from "../api/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const login = async () => {

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);

      setSuccess("Login successful");
      toast.success("Login successful");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {

      const message = err.response?.data?.msg || "Login failed";

      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-80 border border-slate-700">

        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Welcome Back 
        </h2>

        {/* SUCCESS BOX */}
        {success && (
          <div className="bg-green-500/20 text-green-400 p-2 rounded mb-2 text-center border border-green-500/30">
            {success}
          </div>
        )}

        {/* ERROR BOX */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-2 text-center border border-red-500/30">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
          } text-white`}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-4 text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-400 hover:text-indigo-300">
            Register
          </a>
        </p>

        {/* FORGOT PASSWORD */}
        <p className="text-center mt-2">
          <a href="/forgot" className="text-indigo-400 hover:text-indigo-300">
            Forgot Password?
          </a>
        </p>

      </div>
    </div>
  );
}