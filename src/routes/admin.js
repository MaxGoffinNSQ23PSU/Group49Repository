import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/index.js";

const router = express.Router();

// Auth middleware
function requireAdmin(req, res, next) {
    if (!req.session.admin) return res.redirect("/admin/login");
    next();
}

router.get("/login", (req, res) => {
    res.render("admin/login", { title: "Admin Login", error: null });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
        const admin = result.rows[0];

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.render("admin/login", { title: "Admin Login", error: "Invalid credentials" });
        }

        req.session.admin = { id: admin.id, foodbank_id: admin.foodbank_id };
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error(err);
        res.render("admin/login", { title: "Admin Login", error: "Something went wrong" });
    }
});

router.get("/dashboard", requireAdmin, async (req, res) => {
    const { foodbank_id } = req.session.admin;
    try {
        const bank = await pool.query("SELECT * FROM foodbanks WHERE id = $1", [foodbank_id]);
        const listings = await pool.query(
            "SELECT * FROM food_listings WHERE foodbank_id = $1 ORDER BY item_name",
            [foodbank_id]
        );
        const tags = await pool.query("SELECT * FROM food_tags ORDER BY tag_name");

        // For each listing, get its current tags
        const listingsWithTags = await Promise.all(listings.rows.map(async (listing) => {
            const listingTags = await pool.query(
                "SELECT tag_id FROM listing_tags WHERE listing_id = $1",
                [listing.id]
            );
            return { ...listing, tag_ids: listingTags.rows.map(r => r.tag_id) };
        }));

        res.render("admin/dashboard", {
            title: "Dashboard",
            foodbank: bank.rows[0],
            listings: listingsWithTags,
            tags: tags.rows
        });
    } catch (err) {
        console.error(err);
        res.render("admin/dashboard", { title: "Dashboard", foodbank: null, listings: [], tags: [] });
    }
});

router.post("/stock/edit/:id", requireAdmin, async (req, res) => {
    const { quantity } = req.body;
    const tag_ids = req.body.tag_ids ? [].concat(req.body.tag_ids) : [];
    const { foodbank_id } = req.session.admin;

    await pool.query(
        "UPDATE food_listings SET quantity = $1 WHERE id = $2 AND foodbank_id = $3",
        [quantity, req.params.id, foodbank_id]
    );

    // Replace existing tags
    await pool.query("DELETE FROM listing_tags WHERE listing_id = $1", [req.params.id]);
    for (const tag_id of tag_ids) {
        await pool.query(
            "INSERT INTO listing_tags (listing_id, tag_id) VALUES ($1, $2)",
            [req.params.id, tag_id]
        );
    }

    res.redirect("/admin/dashboard");
});

router.post("/stock/add", requireAdmin, async (req, res) => {
    const { item_name, quantity, unit } = req.body;
    const tag_ids = req.body.tag_ids ? [].concat(req.body.tag_ids) : [];
    const { foodbank_id } = req.session.admin;

    const result = await pool.query(
        "INSERT INTO food_listings (foodbank_id, item_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING id",
        [foodbank_id, item_name, quantity, unit]
    );
    const listing_id = result.rows[0].id;

    for (const tag_id of tag_ids) {
        await pool.query(
            "INSERT INTO listing_tags (listing_id, tag_id) VALUES ($1, $2)",
            [listing_id, tag_id]
        );
    }

    res.redirect("/admin/dashboard");
});

router.post("/stock/delete/:id", requireAdmin, async (req, res) => {
    const { foodbank_id } = req.session.admin;
    await pool.query(
        "DELETE FROM food_listings WHERE id = $1 AND foodbank_id = $2",
        [req.params.id, foodbank_id]
    );
    res.redirect("/admin/dashboard");
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

export default router;
