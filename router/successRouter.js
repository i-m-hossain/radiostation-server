const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
router.get("/", isLoggedIn, (req, res) => {
    res.send(`Welcome ${req.user.email}`);
});
module.exports = router;
