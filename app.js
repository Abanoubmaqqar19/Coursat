const express = require("express");
const app = express();


app.use(express.json());
// Home
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Coursat API" });
});

app.use("/api/User");
app.use("/api/Course");
app.use("/api/Lesson");
app.use("/api/Enrollment");
app.use("/api/Comment");


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});




module.exports = app;