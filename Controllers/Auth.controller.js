const createHttpError = require("http-errors");
const User = require("../Models/User.model");
const authSchema = require("../lib/validationSchema");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../lib/jwt");
const redisClient = require("../lib/redisClient");

async function registerController(req, res, next) {
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
}

async function loginController(req, res, next) {
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
}

async function refreshController(req, res, next) {
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
}

async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    try {
      const deletedClient = await redisClient.del(userId);

      console.log(deletedClient);

      res.sendStatus(204);
    } catch (error) {
      console.log(error.message);

      throw createHttpError.InternalServerError();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  refreshController,
  registerController,
  loginController,
  logoutController,
};
