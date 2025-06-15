const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/verify-reset-token/:token", authController.verifyResetToken);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
