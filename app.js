const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");

const AuthRoute = require("./Routes/Auth.route");

dotenv.config();

const app = express();

app.get("/", async (req, res, next) => {
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
