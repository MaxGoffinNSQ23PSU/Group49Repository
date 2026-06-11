const express = require("express");
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import session from "express-session";

import indexRoutes from "./src/routes/index.js";
import adminRoutes from "./src/routes/admin.js";
import foodbankRoutes from "./src/routes/foodbanks.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || "changeme", resave: false, saveUninitialized: false }));

//Lets the site know whether an admin is logged in.
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || null;
    next();
});

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/foodbanks", foodbankRoutes);

export default app;
