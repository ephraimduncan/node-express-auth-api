const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const User = require("../Models/User.model");
const authSchema = require("../lib/validationSchema");
const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../lib/jwt");

// Routes
// /auth/register
// /auth/login
// /auth/logout
// /auth/refresh

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);

    const userExists = await User.findOne({ email });
    if (userExists) throw createHttpError.Conflict(`${email} has already been registered`);

    const user = new User({ email, password });
    const savedUser = await user.save();

    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);

    const user = await User.findOne({ email });
    if (!user) throw createHttpError.NotFound("User not registered");

    const isMatchPassword = await user.isValidPassword(password);
    if (!isMatchPassword) throw createHttpError.Unauthorized("Invalid Username/Password");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) return next(createHttpError.BadRequest("Invalid Username/Password"));

    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

module.exports = router;
