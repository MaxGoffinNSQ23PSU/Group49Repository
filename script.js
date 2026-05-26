const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});