const router = require("express").Router({ mergeParams: true });

const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controler");

const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");
const validator = require("../middleware/validator");
const {
  createLessonSchema,
  updateLessonSchema,
} = require("../validation/lessonValidation");

// public
router.get("/", getLessons);
router.get("/:id", getLesson);

// instructor only can access these routes
router.post(
  "/",
  protect,
  restrictTo("instructor"),
  validator(createLessonSchema),
  createLesson,
);

router.put(
  "/:id",
  protect,
  restrictTo("instructor"),
  validator(updateLessonSchema),
  updateLesson,
);

router.delete("/:id", protect, restrictTo("instructor"), deleteLesson);

module.exports = router;
