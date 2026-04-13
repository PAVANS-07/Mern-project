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

  try {
    await axios.post("http://localhost:5000/api/auth/reset-password", {
      email,
      password
    });

    alert("Password updated successfully");

    // redirect to login page
    window.location.href = "/";

  } catch (err) {
    alert("Error updating password");
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl mb-4 text-center">Reset Password</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Update Password
        </button>

      </div>
    </div>
  );
}