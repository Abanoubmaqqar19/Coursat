const router = require("express").Router();
const {
  enroll,
  unEnroll,
  getMyCourses,
} = require("../controllers/enrollment.controller");
//*controller methods


router.post("/:courseId", enroll);
router.get("/my-courses", getMyCourses);
router.delete("/:courseId", unEnroll);











module.exports = router;
