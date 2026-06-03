const express = require("express");
const path = require("path");

const indexRoutes = require("./src/routes/index");
const adminRoutes = require("./src/routes/admin");
const foodbankRoutes = require("./src/routes/foodbanks");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/foodbanks", foodbankRoutes);

module.exports = app;