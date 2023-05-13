const jwt = require("jsonwebtoken"),
User = require("../Models/Users");

exports.protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401).json("Not authorized, no token");
  } else {
    if (token.startsWith("Bearer")) {
      // decode token
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (err, response) => {
          if (err && err.name) {
            res.status(401).json({ expired: "Not authorized, token expired" });
          } else {
            req.user = await User.findById(response.id).select("-password");
            if (req.user) {
              next();
            } else {
              res
                .status(401)
                .json({ expired: "Not authorized, invalid token" });
            }
          }
        }
      );
    } else {
      res.status(401).json({ error: "Not authorized, invalid token" });
    }
  }
};