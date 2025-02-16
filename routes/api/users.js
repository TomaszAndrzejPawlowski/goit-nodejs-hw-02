const express = require("express");
const auth = require("../../service/middleware/middleware");
const {
  signupUser,
  loginOnUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  changeAvatar,
  verifyByToken,
  resendVerificationEmail,
} = require("../controllers/manageUsers");
const {
  uploadPicture,
} = require("../../routes/controllers/managePictureUpload");

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginOnUser);

router.get("/logout", auth, logoutUser);

router.get("/current", auth, getCurrentUser);

router.patch("/", auth, updateUserSubscription);

router.patch("/avatars", auth, uploadPicture, changeAvatar);

router.get("/verify/:verificationToken", verifyByToken);

router.post("/verify", resendVerificationEmail);

module.exports = router;
