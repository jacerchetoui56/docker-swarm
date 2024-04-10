const Blog = require("./blog.model");

async function seed() {
  await Blog.sync({ force: true });
  await Blog.create({
    title: "Blog One",
    content: "lorem ipsum dolor sit amet ",
  });
  await Blog.create({
    title: "Blog Two",
    content: "lorem ipsum dolor sit amet ",
  });
  await Blog.create({
    title: "Blog Three",
    content: "lorem ipsum dolor sit amet ",
  });
  await Blog.create({
    title: "Blog Four",
    content: "lorem ipsum dolor sit amet ",
  });
}

seed()
  .then(() => {
    console.log("Data Seeded");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
