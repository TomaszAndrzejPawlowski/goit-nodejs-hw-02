const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const User = require("../schemas/user");
const {
  unauthorizedResponse,
  errorResponse,
} = require("../../routes/controllers/common");

const auth = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return unauthorizedResponse(res, "Not authorized");
  }
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    try {
      const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: payload.id });
      if (user.token !== token) {
        return unauthorizedResponse(res, "Not authorized");
      } else {
        req.user = user;
        next();
      }
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
};

module.exports = auth;
