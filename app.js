const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const pool = require('./src/db/index');



// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const indexRoutes = require('./src/routes/index');
const adminRoutes = require('./src/routes/admin');
const foodbankRoutes = require('./src/routes/foodbanks');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/foodbanks', foodbankRoutes);

// Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});