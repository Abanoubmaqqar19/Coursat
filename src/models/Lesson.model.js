const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    videoUrl: {
      type: String,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Lesson", lessonSchema);