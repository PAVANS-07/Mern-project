import api from "../api/axios";
import { useState } from "react";

export default function Forgot() {

  // email state
  const [email, setEmail] = useState("");

  // loading + messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle submit
  const handleSubmit = async () => {

    // reset messages
    setError("");
    setSuccess("");

    // validation
    if (!email) {
      setError("Please enter email");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      // success message
      setSuccess("Reset link sent ");

      // redirect
      setTimeout(() => {
        window.location.href = "/reset";
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || "User not found");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl mb-4 text-center">Forgot Password</h2>

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

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

      </div>
    </div>
  );
}