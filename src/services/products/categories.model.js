import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";
import Product from "./model.js";

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
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

// through is the join table (3rd table)

Category.belongsToMany(Product, { through: "product_categories" });
Product.belongsToMany(Category, { through: "product_categories" });

export default Category;
