const express = require('express');
const router = express.Router();
const pool = require('../db/index');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM foodbanks');
        res.render('public/map', { 
            title: 'Map',
            foodbanks: result.rows,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.render('public/map', {
            title: 'Map',
            foodbanks: [],
            error: 'Could not load food banks'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const foodbank = await pool.query(
            'SELECT * FROM foodbanks WHERE id = $1', 
            [req.params.id]
        );
        const listings = await pool.query(
            'SELECT * FROM food_listings WHERE foodbank_id = $1', 
            [req.params.id]
        );
        res.render('public/foodbank', {
            title: foodbank.rows[0].name,
            foodbank: foodbank.rows[0],
            listings: listings.rows,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;