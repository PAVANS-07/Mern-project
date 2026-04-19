import api from "../api/axios";
import { useState } from "react";

export default function Forgot() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter email");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      setSuccess("Reset link sent ");

      setTimeout(() => {
        window.location.href = "/reset";
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || "User not found");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-80 border border-slate-700">

        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Forgot Password 
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

        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition text-white ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </div>
    </div>
  );
}