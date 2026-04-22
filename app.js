const express = require("express");
const courseRoutes = require("./src/routes/courses.route");
const lessonRoutes = require("./src/routes/lesson.route");
const enrollmentRoutes = require("./src/routes/enrollment.route");
const commentsRouter = require("./src/routes/comment.route");
const errorMiddleware = require("./src/middleware/globlalErrorMiddleware");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin:true
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Coursat API" });
});

app.use("/api/auth", require("./src/routes/auth.route"));
app.use("/api/course", courseRoutes);
app.use("/api/course/:courseId/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/comments", commentsRouter);


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

module.exports = app;
