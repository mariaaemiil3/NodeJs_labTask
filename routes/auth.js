const express = require("express");
const { User, validateUser , validateLoggingUser} = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) res.status(400).json({ message: error.details[0].message });
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) res.status(406).json({ message: "User already registered" });
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({ ...req.body, password: hashed });
  const result = await user.save();
  result.status(201).json({ _id: result._id });
});

router.post("/login", async (req, res) => {
  const { error } = validateLoggingUser(req.body);
  if (error) res.status(400).json({ message: error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ message: "wrong email or password" });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).json({ message: "wrong email or password" });

    const token = jwt.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email
    }, process.env.SECRET_KEY)
    res.json({ token })
});

module.exports = router;
