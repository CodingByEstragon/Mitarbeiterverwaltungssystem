require("dotenv").config();

const jwt = require("jsonwebtoken");
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "900s" }); // <--- 1800s = 30min
}

module.exports = {
  generateAccessToken,
};
