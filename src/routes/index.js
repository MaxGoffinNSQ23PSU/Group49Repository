import express from "express";
import pool from "../db/index.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("public/home", { title: "Home" });
});



router.get("/contact", (req, res) => {
    res.render("public/contact", { title: "Contact" });
});

router.post("/contact", (req, res) => {
    console.log(req.body);
    res.redirect("/contact");
});

router.get("/donations", async (req, res) => {
    try {
        const foodbanksResult = await pool.query(
            "SELECT id, name FROM foodbanks ORDER BY name"
        );

        res.render("public/donations", {
            title: "Donations",
            foodbanks: foodbanksResult.rows
        });
    } catch (err) {
        console.error(err);
        res.render("public/donations", { title: "Donations", foodbanks: [] });
    }
});

router.get("/donations/listings", async (req, res) => {
    const foodbankIdParam = req.query.foodbank_id;

    if (typeof foodbankIdParam !== "string" || !/^\d+$/.test(foodbankIdParam)) {
        return res.status(400).json({ error: "A valid foodbank_id is required." });
    }

    const foodbankId = Number.parseInt(foodbankIdParam, 10);

    try {
        const listingsResult = await pool.query(`
            SELECT fl.id, fl.foodbank_id, fl.item_name, fl.unit,
                   array_remove(array_agg(ft.tag_name), NULL) AS tags
            FROM food_listings fl
            LEFT JOIN listing_tags lt ON fl.id = lt.listing_id
            LEFT JOIN food_tags ft ON lt.tag_id = ft.id
            WHERE fl.foodbank_id = $1
            GROUP BY fl.id
            ORDER BY fl.item_name
        `, [foodbankId]);

        res.json({
            listings: listingsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to load donation listings." });
    }
});

router.get("/settings", (req, res) => {
    res.render("public/settings", { title: "Settings" });
});

//Login redirects straight to the Admin now instead of the old link
router.get("/login", (req, res) => {
    res.redirect("/admin/login");
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
        },
		{
			question: "Do I need to register to use the website?",
			answer: "No. You can browse food banks, opening times, and support services without creating an account."
		},
		{
			question: "Can I access the website on my phone?",
			answer: "Yes. The website is mobile-friendly and can be accessed from smartphones, tablets and computers."
		},
		{
			question: "How does this website help reduce food waste?",
			answer: "The platform connects food banks with local businesses that have surplus food, helping redistribute food that might otherwise be wasted."
		}
    ];

    res.render('public/faq', { title: 'FAQ', faqs });
});

export default router;
