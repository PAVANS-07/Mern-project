import axios from "axios";
import { useState } from "react";

export default function Reset() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    if (!email || !password || !confirm) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password
      });

      alert("Password updated successfully");

      window.location.href = "/";

    } catch (err) {
      alert("Error updating password");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-80 border border-slate-700">

        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Reset Password 
        </h2>

        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition text-white ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>
    </div>
  );
}