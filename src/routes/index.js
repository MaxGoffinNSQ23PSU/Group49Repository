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

router.get("/settings", (req, res) => {
    res.render("public/settings", { title: "Settings" });
});


router.get("/login", (req, res) => {
    res.render("public/login", { title: "Login" });
});

router.post("/login", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

router.get('/faq', (req, res) => {
    const faqs = [
        {
            question: "Is the food free?",
            answer: "Yes. All food banks listed on this site provide food completely free of charge to anyone in need."
        },
        {
            question: "How do I find my nearest food bank?",
            answer: "Use the map on the home page. You can enter your address or postcode to see where you are in relation to all the food banks in Ladywood."
        },
        {
            question: "How current is the stock information?",
            answer: "Stock is updated by each food bank's administrator. We recommend checking before visiting as availability can change quickly."
        },
        {
            question: "Can I donate food?",
            answer: "Yes. Visit our Donations page for information on how to donate to food banks in Ladywood."
        },
        {
            question: "What are the opening times?",
            answer: "Opening times vary between food banks. Click on any pin on the map to see that food bank's specific opening times."
        }
    ];

    res.render('public/faq', { title: 'FAQ', faqs });
});

export default router;
