require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log('Received Token:', token);  // <--- zur Überprüfung
  if (!token) return res.status(401).send("Access denied. No token provided.");
    console.log("Token: " + token);

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        message: "Token is not valid",
      });
    } else {
      req.decoded = decoded;

      console.log("token: " + token + "decoded: " + decoded) // <--- zur Überprüfung
      next();
    }
    console.log("Token: " + token);

  });
};

module.exports = {
  verifyJWT,
};