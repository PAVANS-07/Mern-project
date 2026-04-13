import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const token = localStorage.getItem("token");
  

  const email = localStorage.getItem("userEmail");
  const profileKey = `profile_${email}`;

  const profile = JSON.parse(localStorage.getItem(profileKey)) || {};



  const getItems = async () => {
    const res = await api.get("/items");
    setItems(res.data);
  };

  useEffect(() => {
    getItems();
  }, []);

  const addItem = async () => {
    if (!title) return;

    setLoading(true);
    await api.post("/items", { title, description });

    setTitle("");
    setDescription("");
    setLoading(false);
    getItems();
  };

  const updateItem = async (id) => {
    await api.put(`/items/${id}`, {
      title: editText,
      description: editDesc
    });

    setEditingId(null);
    getItems();
  };

  const updateStatus = async (id, status) => {
    const current = items.find(i => i.id === id);

    await api.put(`/items/${id}`, {
      title: current.title,
      description: current.description,
      status
    });

    getItems();
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this item?");
    if (!confirmDelete) return;

    await api.delete(`/items/${id}`);
    getItems();
  };

  const exportCSV = () => {
    const csvData = items.map(i => `${i.title},${i.description || ""}`).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
  };

  const paginatedItems = items
    .filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      dark ? "bg-gray-950 text-white" : "bg-gray-100 text-black"
    }`}>

      {/* NAVBAR */}
      <div className={`flex justify-between items-center px-6 py-4 ${
        dark ? "bg-gray-900" : "bg-white shadow"
      }`}>
        <h1 className="text-lg font-semibold">Task Manager</h1>

        <div className="flex items-center gap-3">
          <span>{profile?.name || "User"}</span>

          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-purple-500 text-white px-4 py-2 rounded">
              Export CSV
            </button>

            <button
              onClick={() => {
                const newMode = !dark;
                setDark(newMode);
                localStorage.setItem("dark", newMode);
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className={`p-6 rounded-xl shadow ${
            dark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}>
            <p className="text-gray-400">Total Tasks</p>
            <h2 className="text-2xl font-bold">{items.length}</h2>
          </div>

          <div className={`p-6 rounded-xl shadow ${
            dark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}>
            <p className="text-gray-400">Completed</p>
            <h2 className="text-2xl font-bold text-green-500">
              {items.filter(i => i.status === "completed").length}
            </h2>
          </div>

          <div className={`p-6 rounded-xl shadow ${
            dark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}>
            <p className="text-gray-400">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-500">
              {items.filter(i => i.status !== "completed").length}
            </h2>
          </div>

        </div>

        {/* SEARCH */}
        <input
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-2 rounded mb-4 border ${
            dark
              ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-black border-gray-300"
          }`}
        />

        {/* ADD TASK */}
        <div className={`p-4 rounded shadow mb-6 ${
          dark ? "bg-gray-900" : "bg-white"
        }`}>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className={`w-full p-2 mb-2 rounded border ${
              dark
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            className={`w-full p-2 mb-2 rounded border ${
              dark
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <button
            onClick={addItem}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* TASK LIST */}
        <div className={`rounded shadow p-4 ${
          dark ? "bg-gray-900" : "bg-white"
        }`}>

          {paginatedItems.length === 0 ? (
            <p className="text-center text-gray-400">No tasks yet</p>
          ) : (
            paginatedItems.map(item => (
              <div key={item.id} className="flex justify-between border-b py-3">

                {editingId === item.id ? (
                  <div className="flex flex-col gap-2 w-full mr-4">

                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`p-2 rounded border ${
                        dark
                          ? "bg-gray-800 text-white border-gray-600"
                          : "bg-white text-black border-gray-300"
                      }`}
                    />

                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className={`p-2 rounded border ${
                        dark
                          ? "bg-gray-800 text-white border-gray-600"
                          : "bg-white text-black border-gray-300"
                      }`}
                    />

                    <button
                      onClick={() => updateItem(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>

                  </div>
                ) : (
                  <div>

                    <p className={`font-medium ${
                      item.status === "completed"
                        ? "line-through text-gray-400"
                        : dark ? "text-white" : "text-black"
                    }`}>
                      {item.title}
                    </p>

                    {item.description && (
                      <p className={`text-sm ${
                        dark ? "text-gray-300" : "text-gray-500"
                      }`}>
                        {item.description}
                      </p>
                    )}

                    <div className="flex justify-center mt-1">
                      <span className={
                        item.status === "completed"
                          ? "text-green-500 text-sm font-semibold"
                          : "text-yellow-500 text-sm font-semibold"
                      }>
                        {item.status === "completed" ? "Completed" : "Active"}
                      </span>
                    </div>

                  </div>
                )}

                <div className="flex gap-2 items-center">

                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditText(item.title);
                      setEditDesc(item.description || "");
                    }}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <select
                    value={item.status || "active"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={`p-1 rounded border ${
                      dark
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prev
          </button>

          <span>Page {page}</span>

          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}