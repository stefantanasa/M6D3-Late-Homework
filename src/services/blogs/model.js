import { DataTypes } from "sequelize";

import sequelize from "../../utils/db/connect.js";

import Sequelize from "sequelize";

import Author from "../authors/model.js";

const Blog = sequelize.define(
  "blog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: "https://picsum.photos/900/600",
      validate: {
        isURL: true,
      },
    },
  },
  { underscored: true }
);

Author.hasMany(Blog, {
  onDelete: "CASCADE", // when author is deleted , deletes all blogs
});

Blog.belongsTo(Author);

export default Blog;
