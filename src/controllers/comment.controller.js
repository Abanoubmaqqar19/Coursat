const Comment = require("../models/Comment.model");

/**
 * ADD COMMENT
 */
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { lessonId } = req.params;

    const created = await Comment.create({
      text,
      lesson: lessonId,
      student: req.user._id,
    });

    const comment = await Comment.findById(created._id).populate(
      "student",
      "name email",
    );

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET COMMENTS BY LESSON
 */
const getComments = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const comments = await Comment.find({ lesson: lessonId })
      .populate("student", "name email") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE COMMENT
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (String(comment.student) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
