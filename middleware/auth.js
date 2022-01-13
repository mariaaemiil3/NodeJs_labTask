const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    const result = jwt.verify(token, process.env.SECRET_KEY);
    req.user = result;
    next();
  } catch (error) {
    res.status(401).json({ message: "un-authorized" });
  }
};

module.exports = auth;