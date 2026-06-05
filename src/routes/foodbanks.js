const express = require("express");
const router = express.Router();
// Import the database pool from src/db/index.js to run queries
const pool = require("../db");

// GET /foodbanks/:id/data
// Returns food bank details as JSON
router.get('/:id/data', async (req, res) => {
    try {
        // Extract the food bank ID from the URL (e.g. /foodbanks/3/data → id = 3)
        const { id } = req.params;

         // Query the food bank's basic details
        const bankResult = await pool.query(
            'SELECT * FROM foodbanks WHERE id = $1', [id]
        );

        // Query all food listings for this food bank, with their dietary tags
        // Uses three table JOINs:
        // food_listings → listing_tags (junction table) → food_tags
        // array_agg groups all tags for each listing into a single array
        const listingsResult = await pool.query(`
            SELECT fl.*, array_agg(ft.tag_name) AS tags
            FROM food_listings fl
            LEFT JOIN listing_tags lt ON fl.id = lt.listing_id
            LEFT JOIN food_tags ft ON lt.tag_id = ft.id
            WHERE fl.foodbank_id = $1
            GROUP BY fl.id
        `, [id]);

        if (bankResult.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Send both the food bank details and listings back as JSON
        res.json({
            foodbank: bankResult.rows[0],
            listings: listingsResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /foodbanks/:id
// Renders the full food bank detail page
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const bankResult = await pool.query(
            "SELECT * FROM foodbanks WHERE id = $1", [id]
        );

        const listingsResult = await pool.query(`
            SELECT fl.*, array_agg(ft.tag_name) AS tags
            FROM food_listings fl
            LEFT JOIN listing_tags lt ON fl.id = lt.listing_id
            LEFT JOIN food_tags ft ON lt.tag_id = ft.id
            WHERE fl.foodbank_id = $1
            GROUP BY fl.id
        `, [id]);

        if (bankResult.rows.length === 0) {
            return res.status(404).send("Food bank not found");
        }

        // Render the EJS view
        res.render("public/foodbank", {
            title: bankResult.rows[0].name,
            foodbank: bankResult.rows[0],
            listings: listingsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading food bank");
    }
});

module.exports = router;