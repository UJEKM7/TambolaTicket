const router = require("express")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//User Model
const User = require("../model/UserSchema");

//User Register API
router.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Email is required")
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash });
      await user.save();
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

//User Login API
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Email is required")
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "30m",
      });
      return res.status(201).json({ token });
    } catch (error) {
      console.error("Error during login", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
