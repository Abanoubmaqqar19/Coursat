const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const validator = require("../middleware/validator");
const { registerSchema, loginSchema } = require("../validation/userValidation");

router.post("/register", validator(registerSchema), register);
router.post("/login", validator(loginSchema), login);

module.exports = router;
