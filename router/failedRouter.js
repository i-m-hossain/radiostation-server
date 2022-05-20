const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Failed");
});

module.exports = router;
