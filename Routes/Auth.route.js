const express = require("express");
const router = express.Router();

// Routes

// auth/register
// auth/login
// auth/logout
// auth/refresh

router.post("/register", async (req, res, next) => {
  res.send("register route");
});

router.post("/login", async (req, res, next) => {
  res.send("login route");
});

router.post("/refresh", async (req, res, next) => {
  res.send("refresh token route");
});

router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

module.exports = router;
