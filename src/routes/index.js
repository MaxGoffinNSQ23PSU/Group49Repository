import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, address, latitude, longitude FROM foodbanks"
        );
        res.render("public/home", { title: "Home", foodbanks: result.rows });
    } catch (err) {
        console.error(err);
        res.render("public/home", { title: "Home", foodbanks: [] });
    }
});

router.get("/faq", (req, res) => {
    res.render("public/faq", { title: "FAQ" });
});

router.get("/contact", (req, res) => {
    res.render("public/contact", { title: "Contact" });
});

router.post("/contact", (req, res) => {
    console.log(req.body);
    res.redirect("/contact");
});

router.get("/donations", (req, res) => {
    res.render("public/donations", { title: "Donations" });
});

router.get("/signup", (req, res) => {
    res.render("public/signup", { title: "Sign Up" });
});

router.post("/signup", (req, res) => {
    console.log(req.body);
    res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render("public/login", { title: "Login" });
});

router.post("/login", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

export default router;
