const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/Auth.controller");

// Routes
// /auth/register
// /auth/login
// /auth/logout
// /auth/refresh

router.post("/register", AuthController.registerController);

router.post("/login", AuthController.loginController);

router.post("/refresh", AuthController.refreshController);

router.delete("/logout", AuthController.logoutController);

module.exports = router;
