const path = require("path");
const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const User = require("./models/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const Blog = require("./models/blog");

mongoose
  .connect(process.env.mongoDB_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

const app = express();
const PORT = process.env.PORT || 8001;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user/", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT, () => {
  console.log("Server running app");
});
