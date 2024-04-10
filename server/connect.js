const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: "root",
  password: process.env.DB_PASSWORD || "",
  database: "myblog",
});

module.exports = sequelize;
