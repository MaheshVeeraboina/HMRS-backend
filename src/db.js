const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.SQLITE_STORAGE || "data/hrms.sqlite",
  logging: false,
  define: {
    timestamps: false,
  }
});

module.exports = sequelize;
