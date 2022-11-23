const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
      issuer: "astrosaurus.me",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.error(error);

        return reject(createHttpError.InternalServerError());
      }

      return resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createHttpError.Unauthorized());

  const authHeader = req.headers["authorization"];

  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error.name === "JsonWebTokenError") return next(createHttpError.Unauthorized());

    if (error) return next(createHttpError.Unauthorized(error.message));

    req.payload = payload;
    next();
  });
}

function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "astrosaurus.me",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.error(error);

        return reject(createHttpError.InternalServerError());
      }

      return resolve(token);
    });
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
};
