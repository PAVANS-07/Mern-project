import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate();

  // dark mode from localStorage
  const dark = localStorage.getItem("dark") === "true";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  // load saved profile
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

  // update profile
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

    // redirect to dashboard
    window.location.href = "/dashboard";
    //navigate("/dashboard");
  };

  // image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={
        dark
          ? "min-h-screen flex justify-center items-center bg-gray-950 text-white"
          : "min-h-screen flex justify-center items-center bg-gray-100"
      }
    >

      {/* PROFILE CARD */}
      <div
        className={
          dark
            ? "bg-gray-800 border border-gray-700 p-6 rounded-lg shadow w-80 text-center"
            : "bg-white p-6 rounded-lg shadow w-80 text-center"
        }
      >

        <h2 className="text-xl font-bold mb-4">Profile</h2>

        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border"
          />
        )}

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={handleImage}
          className="mb-3"
        />

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={
            dark
              ? "w-full bg-gray-700 text-white border border-gray-600 p-2 mb-3 rounded"
              : "w-full border p-2 mb-3 rounded"
          }
        />

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={
            dark
              ? "w-full bg-gray-700 text-white border border-gray-600 p-2 mb-3 rounded"
              : "w-full border p-2 mb-3 rounded"
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          className={
            dark
              ? "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              : "w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          }
        >
          Update Profile
        </button>

      </div>
    </div>
  );
}