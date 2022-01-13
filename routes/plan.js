const express = require("express");
const mongoose = require("mongoose");
const { Plan } = require("../models/plan");

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.user.isAdmin) {
    const plans = await Plan.find().populate("users", "name email -_id");
    res.json(plans);
  } else {
    const plans = await Plan.find({}, { users: 0, _id: 0, __v: 0 });
    // Plan.exists()
    res.json(plans);
  }
});

router.get("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    const plan = await Plan.findById(req.params.id);
    res.json(plan);
  } else {
    const plan = await Plan.findById(req.params.id, "name price");
    res.json(plan);
  }
});

router.post("/subscribe/:id", async (req, res) => {
  const userId = req.body._id;
  if (!userId)
    return res.status(404).json({ message: "No user found with this id" });

  const plan = await Plan.findById(req.params.id);

  for (let i = 0; i < plan.users.length; i++) {
    if (plan.users[i] == userId)
      return res
        .status(406)
        .json({ message: "You're already subscribed to this plan" });
  }

  plan.users.push(userId);
  await plan.save();
  res.json({ message: "Subscribed successfully" });
});

router.delete("/unsubscribe/:id", async (req, res) => {
  const userId = req.body._id;
  if (!userId)
    return res.status(404).json({ message: "No user found with this id" });

  const plan = await Plan.findById(req.params.id);
  for (let i = 0; i < plan.users.length; i++) {
    if (plan.users[i] == userId) {
      plan.users.remove(userId);
      await plan.save();
      return res.json({ message: "Unsubscribed successfully" });
    }
  }
  res.status(406).json({ message: "You're not even subscribed to this plan!" });
});

router.post("/", async (req, res) => {
  if (req.user.isAdmin) {
    const newPlan = new Plan(req.body);
    const result = await newPlan.save();
    return res.json(result);
  }
  res.status("401").json({ message: "Must be an admin to add a plan!!" });
});

router.put("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    const plan = await Plan.findById(req.params.id);
    plan.name = req.body.name;
    plan.price = req.body.price;
    await plan.save();
    return res.json(plan);
  }
  res.status("401").json({ message: "Must be an admin to edit a plan!!" });
});

router.delete("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    const result = await Plan.findByIdAndDelete(req.params.id);
    return res.json(result);
  }
  res.status("401").json({ message: "Must be an admin to delete a plan!!" });
});

module.exports = router;
