const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)",
      [name, email, phone, hashedPassword]
    );

    res.json({ msg: "User Registered ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error in register" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ msg: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password ❌" });
    }

    const token = jwt.sign(
      { id: user[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login error" });
  }
};

// forgot password (simple check)
exports.forgotPassword = async (req, res) => {

  const { email } = req.body;

  const [user] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (user.length === 0) {
    return res.json({ msg: "User not found" });
  }

  res.json({ msg: "User exists" });
};


// reset password
exports.resetPassword = async (req, res) => {

  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "UPDATE users SET password=? WHERE email=?",
    [hashed, email]
  );

  res.json({ msg: "Password updated" });
};