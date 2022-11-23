const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");
dotenv.config();

const { verifyAccessToken } = require("./lib/jwt");
const AuthRoute = require("./Routes/Auth.route");
const redisClient = require("./lib/redisClient");

require("./lib/initMongo");
redisClient.connect();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  console.log(req.payload);

  res.send("Hello from Express");
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
