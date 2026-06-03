const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/login", (req, res) => {
    res.render("admin/login", { title: "Admin Login" });
});

router.post("/login", (req, res) => {
    // TODO: check against admin table
    console.log(req.body);
    res.redirect("/admin/dashboard");
});

router.get("/dashboard", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM foodbanks");
        res.render("admin/dashboard", { title: "Dashboard", foodbanks: result.rows });
    } catch (err) {
        console.error(err);
        res.render("admin/dashboard", { title: "Dashboard", foodbanks: [] });
    }
});

module.exports = router;