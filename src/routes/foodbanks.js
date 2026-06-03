const express = require("express");
const router = express.Router();
const pool = require("../db");

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