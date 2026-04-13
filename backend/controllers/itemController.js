const db = require("../config/db");

//  CREATE ITEM
exports.createItem = async (req, res) => {
  const { title, description } = req.body;

  await db.query(
    "INSERT INTO items (user_id,title,description) VALUES (?,?,?)",
    [req.user.id, title, description]
  );

  res.json({ msg: "Item Created ✅" });
};

//  GET ITEMS
exports.getItems = async (req, res) => {
  const [items] = await db.query(
    "SELECT * FROM items WHERE user_id=?",
    [req.user.id]
  );

  res.json(items);
};

// Update item (title + status)
exports.updateItem = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { id } = req.params;

    // update ALL fields safely
    await db.query(
      "UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?",
      [
        title || "",            // keep safe fallback
        description || "",
        status || "active",
        id
      ]
    );

    res.json({ msg: "Item updated successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

//  DELETE ITEM
exports.deleteItem = async (req, res) => {
  await db.query("DELETE FROM items WHERE id=?", [req.params.id]);

  res.json({ msg: "Item Deleted ❌" });
};