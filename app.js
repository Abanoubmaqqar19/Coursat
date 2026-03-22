const express = require("express");
const courseRoutes = require("./src/routes/courses.route");
const lessonRoutes=require("./src/routes/lesson.route");
const app = express();


app.use(express.json());
// Home
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Coursat API" });
});

// app.use("/api/User");
app.use("/api/course", courseRoutes);
app.use("/api/courses/:courseId/lessons", lessonRoutes);
// app.use("/api/Enrollment");
// app.use("/api/Comment");


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});




module.exports = app;