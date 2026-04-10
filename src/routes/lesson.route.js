const router = require("express").Router({ mergeParams: true });
//*controller methods
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controler");
const { createLessonSchema } = require("../validation/lessonValidation");
const validator = require("../middleware/validator");
//*controller methods

router.get("/", validator(createLessonSchema), getLessons);
router.get("/:id", validator(createLessonSchema), getLesson);
router.post("/", validator(createLessonSchema), createLesson);
router.put("/:id", validator(createLessonSchema), updateLesson);
router.delete("/:id", validator(createLessonSchema), deleteLesson);

module.exports = router;
