const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('public/home', { title: 'Home' });
});

router.get('/faq', (req, res) => {
    res.render('public/FAQ', { title: 'FAQ' });
});

router.get('/contact', (req, res) => {
    res.render('public/contact', { title: 'Contact' });
});

router.get('/donations', (req, res) => {
    res.render('public/donations', { title: 'Donations' });
});

router.get('/map', (req, res) => {
    res.render('public/map', { title: 'Map' });
});

module.exports = router;