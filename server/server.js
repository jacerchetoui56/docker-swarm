require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
const Blog = require("./blog.model");

app.get("/", async (req, res) => {
  const data = await Blog.findAll();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
