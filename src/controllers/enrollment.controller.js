const mongoose = require("mongoose");
const Enrollment = require("../models/enrollment.model");

const enroll = async (req, res) => {
  try {
    const dummyStudentId = new mongoose.Types.ObjectId(); // generate new ObjectId
      const courseId = req.params.courseId;
      //* chang id when do auth
    const studentId = dummyStudentId;

    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      data: enrollment,
      message: "Enrolled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMyCourses = async (req, res) => {
  try {

    const studentId = new mongoose.Types.ObjectId();

    
    const enrollments = await Enrollment.find({
      student: studentId 
    }).populate('course');
      if (enrollments.length==0) {
        return res.status(200).json({
          success: true,
          message: "You not enrrolled in any  courses",
        });
      }

    res.status(200).json({
      success: true,
      count: enrollments.length ,
      data: enrollments
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const unEnroll = async (req, res) => {
  try {
    const courseId  = req.params.courseId;
      const studentId = new mongoose.Types.ObjectId();

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course:  courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You not enrrolled in this course"
      });
    }

    await enrollment.deleteOne(enrollment);

    res.status(200).json({
      success: true,
      message: "you unEnroll  in this course now"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
    enroll,
    getMyCourses,
    unEnroll
};
