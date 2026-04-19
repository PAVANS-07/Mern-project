import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate();

  const dark = localStorage.getItem("dark") === "true";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const profileKey = `profile_${email}`;

    const saved = JSON.parse(localStorage.getItem(profileKey));

    if (saved) {
      setName(saved.name || "");
      setEmail(saved.email || "");
      setImage(saved.image || null);
    }
  }, []);

  const handleUpdate = () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    const userData = { name, email, image };
    const emailKey = localStorage.getItem("userEmail");
    const profileKey = `profile_${emailKey}`;

    localStorage.setItem(profileKey, JSON.stringify(userData));

    alert("Profile updated Successfully");

    window.location.href = "/dashboard";
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-all duration-300 ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100"
          : "bg-gradient-to-br from-slate-100 via-indigo-100 to-white text-slate-900"
      }`}
    >

      {/* PROFILE CARD */}
      <div
        className={`p-6 rounded-2xl shadow-xl w-80 text-center backdrop-blur-md border ${
          dark
            ? "bg-slate-900/80 border-slate-700"
            : "bg-white/80 border-slate-200"
        }`}
      >

        <h2 className="text-2xl font-bold mb-4">
          Profile 
        </h2>

        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-indigo-500 shadow"
          />
        )}

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={handleImage}
          className="mb-3 text-sm text-slate-400"
        />

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={`w-full p-2 mb-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            dark
              ? "bg-slate-800 text-white border-slate-600 placeholder-slate-400"
              : "bg-white text-slate-900 border-slate-300 placeholder-slate-400"
          }`}
        />

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`w-full p-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            dark
              ? "bg-slate-800 text-white border-slate-600 placeholder-slate-400"
              : "bg-white text-slate-900 border-slate-300 placeholder-slate-400"
          }`}
        />

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
        >
          Update Profile
        </button>

      </div>
    </div>
  );
}