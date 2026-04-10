const Lesson = require("../models/Lesson.model");
const mongoose = require("mongoose");

/**
 * GET ALL LESSONS FOR A COURSE
 */
const getLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET SINGLE LESSON
 */
const getLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE LESSON
 */
const createLesson = async (req, res, next) => {
  try {
    const { title, order, content, videoUrl } = req.body;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const newLesson = await Lesson.create({
      title,
      order,
      content,
      videoUrl,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: newLesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE LESSON
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE LESSON
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * EXPORT CONTROLLER
 */
module.exports = {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};
