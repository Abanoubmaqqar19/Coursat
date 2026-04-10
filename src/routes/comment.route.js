const router = require("express").Router();

const { deleteComment, addComment, getComments } = require("../controllers/comment.controller");

const { createCommentSchema } = require("../validation/commentValidation");
const validator = require("../middleware/validator");
//*controller methods


router.post("/:lessonId", validator(createCommentSchema), addComment);
router.get("/:lessonId", validator(createCommentSchema), getComments);
router.delete("/:id", validator(createCommentSchema), deleteComment);

module.exports = router;
