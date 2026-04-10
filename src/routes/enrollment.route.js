const router = require("express").Router();
const {
  enroll,
  unEnroll,
  getMyCourses,
} = require("../controllers/enrollment.controller");
const { createEnrollmentSchema } = require("../validation/enrollmentValidation");
const validator = require("../middleware/validator");
//*controller methods


router.post("/:courseId", validator(createEnrollmentSchema), enroll);
router.get("/my-courses", validator(createEnrollmentSchema), getMyCourses);
router.delete("/:courseId", validator(createEnrollmentSchema), unEnroll);











module.exports = router;
