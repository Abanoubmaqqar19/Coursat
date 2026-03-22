const router = require("express").Router({ mergeParams: true });
//*controller methods
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controler");

router.get("/", getLessons);
router.get("/:id", getLesson);
router.post("/", createLesson);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

module.exports = router;
