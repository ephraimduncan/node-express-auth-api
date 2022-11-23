const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");
dotenv.config();

const AuthRoute = require("./Routes/Auth.route");
require("./lib/initMongo");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
