import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Register() {

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const register = async () => {

    if (!data.name || !data.email || !data.phone || !data.password || !data.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });

      toast.success("Registered successfully");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-80 border border-slate-700">

        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Create Account 
        </h2>

        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded-lg bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
        />

        <button
          onClick={register}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition text-white ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-slate-400">
          Already have an account?{" "}
          <a href="/" className="text-indigo-400 hover:text-indigo-300">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}