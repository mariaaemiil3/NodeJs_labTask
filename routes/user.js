const express = require("express");
const mongoose = require("mongoose");
const { User, validateUser } = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();

  res.json(users);
});

router.get("/:id", async (req,res)=>{
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) res.status(400).json({message: "Inavlid id"});

    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({message: "No user found with this id"});

    res.json(user);
})

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
  }
});

router.patch("/:id", async (req,res)=>{
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) res.status(400).json({message: "Inavlid id"});

    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({message: "No user found with this id"});
    
    user.name = req.body.name;
    await user.save();

    res.json(user);
})

router.put("/:id", async (req,res)=>{
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) res.status(400).json({message: "Inavlid id"});

    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({message: "No user found with this id"});

    const { error } = validateUser(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message });

    user.set(req.body);
    await user.save();

    res.json(user);
})

router.delete("/:id", async (req,res)=>{
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) res.status(400).json({message: "Inavlid id"});

    const result = await User.findByIdAndDelete(req.params.id);

    res.json(result);
})


module.exports = router;
