const express = require("express");
const courseRoutes = require("./src/routes/courses.route");
const lessonRoutes = require("./src/routes/lesson.route");
const enrollmentRoutes = require("./src/routes/enrollment.route");
const commentsRouter = require("./src/routes/comment.route")
const errorMiddleware = require("./src/middleware/globlalErrorMiddleware");
const app = express();


app.use(express.json());
// Home
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Coursat API" });
});

// app.use("/api/User");
//!AllRoutes need fixed to be Nested after auth middlware
app.use("/api/course", courseRoutes);
app.use("/api/courses/:courseId/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/comments" , commentsRouter);

//not found page
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);


module.exports = app;