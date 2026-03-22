const Lesson = require("../models/Lesson.model");

const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const lssonID = req.params.id;
    const lesson = await Lesson.findById(lssonID);
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
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, order, content, videoUrl } = req.body;
    const course = req.params.courseId; 

    const newLesson = await Lesson.create({
      title,
      order,
      content,
      videoUrl,
      course,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: newLesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLesson = async (req, res) => {
 try {
     const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
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
     res.status(500).json({
       success: false,
       message: error.message,
     });
   }
};
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "lesson not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "lesson deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 




module.exports = {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};
