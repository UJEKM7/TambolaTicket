const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const mongoConnect = require("./config/dbConnect");

//User Authentication Middleware
const verifyUser = require("./middleware/AuthenticateUser");

//User Controller
const userController = require("./controller/userController");

//Tambola Controller
const tambolaController = require("./controller/tambolaController");

//.env file configuration
require("dotenv").config();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connection to MongoDB
mongoConnect();

//User routes
app.use("/api/user/", userController);

//Tambola routes
app.use("/api/tambola/", verifyUser, tambolaController);

//Error handling Middleware
app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ error: "404. Not Found" });
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Started listening on port ${PORT}`);
});
