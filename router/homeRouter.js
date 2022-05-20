const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
    res.json({ message: "Welcome to dashboard" });
});

module.exports = router;
