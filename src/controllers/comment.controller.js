const Comment = require("../models/Comment.model");
const mongoose = require("mongoose");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const lessonId = req.params.lessonId;
    const studentId = new mongoose.Types.ObjectId();

    if (!text || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "Text and lessonId are required",
      });
    }

    const comment = await Comment.create({
      text,
      lesson: lessonId,
      student: studentId,
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const allComments = await Comment.find({ lesson: lessonId });

    if (allComments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }

    res.status(200).json({
      success: true,
      count: allComments.length,
      data: allComments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { deleteComment, addComment, getComments };
