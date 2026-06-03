const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', (req, res) => {
    console.log(req.body);
    res.redirect('/admin/dashboard');
});

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: 'Dashboard' });
});

router.get('/manage', (req, res) => {
    res.render('admin/manage', { title: 'Manage Listings' });
});

router.get('/logout', (req, res) => {
    res.redirect('/');
});

module.exports = router;