import { DataTypes } from "sequelize";

import sequelize from "../../utils/db/connect.js";

import Sequelize from "sequelize";

import Blog from "./model.js";

// ----------------------------------------------------------------
/**
 * this m:n relationship
 */

const Category = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

// through is the join table (3rd table)

Category.belongsToMany(Blog, { through: "blog_categories" });
Blog.belongsToMany(Category, { through: "blog_categories" });

export default Category;
