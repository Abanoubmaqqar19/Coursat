// comment.routes.js
const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const validator = require("../middleware/validator");
const { createCommentSchema } = require("../validation/commentValidation");
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.post("/:lessonId", protect, validator(createCommentSchema), addComment);
router.get("/:lessonId", getComments);
router.delete("/:id", protect, deleteComment);

module.exports = router;
