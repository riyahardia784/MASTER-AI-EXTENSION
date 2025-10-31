const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');
const learnRoutes = require('./routers/learn.route');
const createRoutes = require('./routers/create.route');
const visualizeRoutes= require('./routers/visulization.route');

// ✅ Middleware first
app.use(cors());
app.use(express.json()); // <--- must come before routes

// ✅ Connect to DB
connectToDb();

// ✅ Routes
app.get('/', (req, res) => {
  res.send("Hello World");
});

app.use("/learn", learnRoutes);
app.use("/api/create", createRoutes);
app.use("/visualize", visualizeRoutes);

module.exports = app;
