const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: String,
    price: Number,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
});

const Plan = mongoose.model("plan", planSchema);

module.exports = { Plan };
