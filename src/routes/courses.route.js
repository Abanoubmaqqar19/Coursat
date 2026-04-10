const router = require("express").Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/course.controller");
const { createCourseSchema } = require("../validation/courseValidation");
const validator = require("../middleware/validator");
//*controller methods

router.get("/",       validator(createCourseSchema), getCourses);
router.get("/:id",    validator(createCourseSchema), getCourse);
router.post("/",      validator(createCourseSchema), createCourse);
router.put("/:id",    validator(createCourseSchema), updateCourse);
router.delete("/:id", validator(createCourseSchema), deleteCourse);

module.exports = router;