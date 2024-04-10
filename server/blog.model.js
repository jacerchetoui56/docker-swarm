const { DataTypes } = require("sequelize");
const sequelize = require("./connect");

const Blog = sequelize.define("Blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
  },
});

module.exports = Blog;
