const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ApiError = require("./app/api-error");

app.get("/", (req, res) => {
  res.json({
    message: "Chào mừng đến với BookStore của tôi ",
  });
});

const userRoute = require("./app/routes/user.route");
app.use("/api/user/", userRoute);

const managerRoute = require("./app/routes/manager.route");
app.use("/api/manager/", managerRoute);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
