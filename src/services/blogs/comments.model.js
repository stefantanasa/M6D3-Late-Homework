import { DataTypes } from "sequelize";

import sequelize from "../../utils/db/connect.js";

import Sequelize from "sequelize";

import Blog from "./model.js";

const Comment = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

Comment.belongsTo(Blog);

Blog.hasMany(Comment, {
  onDelete: "CASCADE", // when blog is deleted , deletes all comments
});

export default Comment;
