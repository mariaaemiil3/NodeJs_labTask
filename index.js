const express = require("express");
const mongoose = require("mongoose");

const app = express();

const userRouter = require("./routes/user");
const planRouter = require("./routes/plan");
const authRouter = require("./routes/auth");

const auth= require("./middleware/auth");

require("express-async-errors");
require("dotenv").config({path:"./.env"});



//middleware
app.use(express.json());
app. use("/api/auth", authRouter);
app.use(auth);

app.use("/users",userRouter);
app.use("/plans",planRouter);

app.get("/",(req, res) => {
    console.log(req.user);
    if (req.user.isAdmin)
        return res.json({ message: "hello-world" })
    res.status(401).json({ message: "must be admin" })
})

//Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

mongoose.connect("mongodb://localhost/node-quena").then(
    async ()=>{
        console.log("Connected successfully to mongodb");
        app.listen(3000, ()=>{
            console.log("Server listening on port 3000");
        })
    }
).catch((e)=>{
    console.log(e.message);
})
