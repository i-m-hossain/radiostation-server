const express = require("express");
const router = express.Router();
const passport = require("passport");
router.get(
    "/",
    passport.authenticate("google", {
        failureRedirect: "/failed",
    }),
    function (req, res) {
        res.redirect("/success");
    }
);
module.exports = router;
