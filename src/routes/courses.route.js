const router = require("express").Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");
const validator = require("../middleware/validator");
const {
  createCourseSchema,
  updateCourseSchema,
} = require("../validation/courseValidation");

// All users can access these routes
router.get("/", getCourses);
router.get("/:id", getCourse);

// instructor only can access these routes
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  validator(createCourseSchema),
  createCourse,
);

router.put(
  "/:id",
  protect,
  restrictTo("instructor"),
  validator(updateCourseSchema),
  updateCourse,
);

router.delete("/:id", protect, restrictTo("instructor"), deleteCourse);

module.exports = router;
