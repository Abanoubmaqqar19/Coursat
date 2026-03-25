const router = require("express").Router();

const { deleteComment ,addComment,getComments} =require("../controllers/comment.controller");
//*controller methods


router.post("/:lessonId", addComment);
router.get("/:lessonId", getComments);
router.delete("/:id", deleteComment);

module.exports = router;
