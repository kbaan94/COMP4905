require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
require("./helpers/init_redis");
require("./helpers/init_mongodb");
const express = require("express");
const createError = require("http-errors");
const AuthRoute = require("./Routes/Auth.route");
const ApiRoute = require("./Routes/Api.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello from express.");
});

app.use("/auth", AuthRoute);
app.use("/api", ApiRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
