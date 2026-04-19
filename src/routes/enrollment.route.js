// enrollment.routes.js
const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");
const {
  enroll,
  getMyCourses,
  unEnroll,
} = require("../controllers/enrollment.controller");

router.post("/:courseId", protect, restrictTo("student"), enroll);
router.get("/my-courses", protect, restrictTo("student"), getMyCourses);
router.delete("/:courseId", protect, restrictTo("student"), unEnroll);

module.exports = router;
