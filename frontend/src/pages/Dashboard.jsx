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
      dark
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100"
        : "bg-gradient-to-br from-slate-100 via-indigo-100 to-white text-slate-900"
    }`}>

      {/* NAVBAR */}
      <div className={`flex justify-between items-center px-6 py-4 backdrop-blur-md border-b ${
        dark
          ? "bg-slate-900/70 border-slate-700"
          : "bg-white/70 border-slate-200 shadow"
      }`}>
        <h1 className="text-lg font-semibold">Task Manager</h1>

        <div className="flex items-center gap-3">
          <span>{profile?.name || "User"}</span>

          <button
            onClick={() => navigate("/profile")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white px-3 py-1 rounded-lg"
          >
            Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white px-3 py-1 rounded-lg"
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
            <button
              onClick={exportCSV}
              className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              Export CSV
            </button>

            <button
              onClick={() => {
                const newMode = !dark;
                setDark(newMode);
                localStorage.setItem("dark", newMode);
              }}
              className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Tasks", value: items.length },
            { label: "Completed", value: items.filter(i => i.status === "completed").length, color: "text-emerald-400" },
            { label: "Pending", value: items.filter(i => i.status !== "completed").length, color: "text-amber-400" }
          ].map((card, i) => (
            <div key={i} className={`p-6 rounded-2xl shadow-lg backdrop-blur-md border ${
              dark
                ? "bg-slate-800/60 border-slate-700 text-white"
                : "bg-white/70 border-slate-200 text-slate-900"
            }`}>
              <p className="text-slate-400">{card.label}</p>
              <h2 className={`text-2xl font-bold ${card.color || ""}`}>{card.value}</h2>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-2 rounded-lg mb-4 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            dark
              ? "bg-slate-800 text-white border-slate-600 placeholder-slate-400"
              : "bg-white text-slate-900 border-slate-300"
          }`}
        />

        {/* ADD TASK */}
        <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-md border mb-6 ${
          dark ? "bg-slate-900/70 border-slate-700" : "bg-white/80 border-slate-200"
        }`}>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className={`w-full p-2 mb-2 rounded-lg border ${
              dark
                ? "bg-slate-800 text-white border-slate-600"
                : "bg-white text-slate-900 border-slate-300"
            }`}
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            className={`w-full p-2 mb-2 rounded-lg border ${
              dark
                ? "bg-slate-800 text-white border-slate-600"
                : "bg-white text-slate-900 border-slate-300"
            }`}
          />

          <button
            onClick={addItem}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* TASK LIST */}
        <div className={`rounded-2xl shadow-lg p-4 backdrop-blur-md border ${
          dark ? "bg-slate-900/70 border-slate-700" : "bg-white/80 border-slate-200"
        }`}>

          {paginatedItems.length === 0 ? (
            <p className="text-center text-slate-400">No tasks yet</p>
          ) : (
            paginatedItems.map(item => (
              <div key={item.id} className="flex justify-between border-b border-slate-700 py-3">

                {editingId === item.id ? (
                  <div className="flex flex-col gap-2 w-full mr-4">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} className="p-2 rounded-lg bg-slate-800 text-white border border-slate-600" />
                    <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="p-2 rounded-lg bg-slate-800 text-white border border-slate-600" />
                    <button onClick={() => updateItem(item.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg">Save</button>
                  </div>
                ) : (
                  <div>
                    <p className={`font-medium ${item.status === "completed" ? "line-through text-slate-400" : ""}`}>
                      {item.title}
                    </p>

                    {item.description && (
                      <p className="text-sm text-slate-400">{item.description}</p>
                    )}

                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      item.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {item.status === "completed" ? "Completed" : "Active"}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <button onClick={() => {
                    setEditingId(item.id);
                    setEditText(item.title);
                    setEditDesc(item.description || "");
                  }} className="bg-amber-400 hover:bg-amber-500 px-2 py-1 rounded-lg">
                    Edit
                  </button>

                  <select
                    value={item.status || "active"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="p-1 rounded border bg-slate-800 text-white border-slate-600"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button onClick={() => deleteItem(item.id)} className="bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white px-2 py-1 rounded-lg">
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