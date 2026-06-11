const request = require("supertest");
const app = require("../app");

describe("Admin routes", () => {

    // Login page loads
    test("GET /admin/login returns 200", async () => {
        const res = await request(app).get("/admin/login");
        expect(res.statusCode).toBe(200);
    });

    // Dashboard redirects if not logged in
    test("GET /admin/dashboard redirects to login if not authenticated", async () => {
        const res = await request(app).get("/admin/dashboard");
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe("/admin/login");
    });

    // Invalid login credentials
    test("POST /admin/login with wrong password shows error", async () => {
        const res = await request(app)
            .post("/admin/login")
            .send({ username: "admin", password: "wrongpassword" });
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Invalid credentials");
    });

});

describe("Public routes", () => {

    test("GET / returns 200", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
    });

    test("GET /faq returns 200", async () => {
        const res = await request(app).get("/faq");
        expect(res.statusCode).toBe(200);
    });

});