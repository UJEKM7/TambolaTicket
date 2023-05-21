const jwt = require("jsonwebtoken");

//User Model
const User = require("../model/UserSchema");

const verifyUser = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token.length) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (decode.email.length) {
    const user = await User.findOne({ email: decode.email });
    if (Object.values(user).length) {
      req.user = user.email;
      next();
    } else {
      return res.status(401).json({ error: "User not found." });
    }
  } else {
    return res.status(404).json({ error: "Unauthorized" });
  }
};

module.exports = verifyUser;
