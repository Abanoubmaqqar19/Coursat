const router = require("express").Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const validator = require("../middleware/validator");
const { registerSchema, loginSchema } = require("../validation/userValidation");

router.post("/register", validator(registerSchema), register);
router.post("/login", validator(loginSchema), login);
router.get("/me", protect, getMe);

module.exports = router;
