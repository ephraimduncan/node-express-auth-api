const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const redisClient = require("./redisClient");

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

    jwt.sign(payload, secret, options, async (error, token) => {
      if (error) {
        console.error(error);

        return reject(createHttpError.InternalServerError());
      }

      try {
        await redisClient.set(userId, token, {
          EX: 365 * 24 * 60 * 60,
        });

        return resolve(token);
      } catch (error) {
        return reject(createHttpError.InternalServerError());
      }
    });
  });
}

function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (error, payload) => {
      if (error) return reject(createHttpError.Unauthorized());

      const userId = payload.aud;

      try {
        const storedRefreshToken = await redisClient.get(userId);

        if (storedRefreshToken === refreshToken) {
          return resolve(userId);
        }

        reject(createHttpError.Unauthorized());
      } catch (error) {
        return reject(createHttpError.InternalServerError());
      }
    });
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
