const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  let token = req.header("Authorization");
  if (!token) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Access denied. No token provided" });
  }
  token = token.split(" ")[1].trim();

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    req.user = decode;
    next();
  } catch (err) {
    return res.status(400).json({ status: "failed", message: "Invalid token" });
  }
};
