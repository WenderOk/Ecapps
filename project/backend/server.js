import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let discounts = [];

app.get("/api/admin/users", (req, res) => {
    res.json({ success: true, users });
});

app.post("/api/admin/users", (req, res) => {
    const newUser = { ...req.body, telegram_id: Date.now() };
    users.push(newUser);
    res.json({ success: true, user_id: newUser.telegram_id });
});

app.get("/api/discounts", (req, res) => {
    res.json({ success: true, discounts: discounts });
});

app.post("/api/discounts", (req, res) => {
    const newDiscount = { ...req.body, id: Date.now() };
    discounts.push(newDiscount);
    res.json({ success: true, discount_id: newDiscount.id });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
