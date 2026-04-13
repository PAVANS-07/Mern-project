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
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
        />

        <button
          onClick={register}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/" className="text-blue-500">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}