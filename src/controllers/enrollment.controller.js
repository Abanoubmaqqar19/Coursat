const mongoose = require("mongoose");
const Enrollment = require("../models/enrollment.model");

/**
 * ENROLL IN COURSE
 */
const enroll = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET MY ENROLLED COURSES
 */
const getMyCourses = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({
      student: studentId,
    }).populate("course");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UNENROLL FROM COURSE
 */
const unEnroll = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Unenrolled successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * EXPORT CONTROLLER
 */
module.exports = {
  enroll,
  getMyCourses,
  unEnroll,
};
