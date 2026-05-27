const express = require("express");
const path = require("path");
const { Pool } = require("pg");


require("dotenv").config();
console.log(process.env.DATABASE_URL);

const app = express();
const port = 3000;



const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/faq", (req, res) => {
    res.render("faq", { title: "FAQ" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact" });
});

app.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

app.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign Up" });
});

app.get("/donations", (req, res) => {
    res.render("donations", { title: "Donations" });
});



app.post("/contact", (req, res) => {
    console.log(req.body);
    res.redirect("/contact");
});

app.post("/login", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

app.post("/signup", (req, res) => {
    console.log(req.body);
    res.redirect("/login");
});

app.get("/test", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * 
            FROM test 
        `);
        res.render("test", {
            
            title: "Test",
            tests: result.rows,
            error: null
            
        });
    } catch (err) {
        console.error(err);
        res.render("test", { 
           
            title: "Test",
            tests: [], 
            error: "Could not load test data"
            
        });
    }
});

app.post("/test", async (req, res) => {
    const { id, test } = req.body;
    try {
        await pool.query(`
            INSERT INTO test (test)
            VALUES ($1)
        `, [test]);

        res.redirect("/test");

    } catch (err) {
        console.error(err);

        res.render("test", {
            title: "Test",
            tests: [],
            error: "Failed to submit"
        });
    }
});




app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database connection failed");
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});