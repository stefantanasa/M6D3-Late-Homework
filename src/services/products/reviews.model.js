import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";
import User from "../users/model.js";
import Product from "./model.js";

const Reviews = sequelize.define(
  "reviews",
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

User.hasMany(Reviews, {
  onDelete: "CASCADE", // when blog is deleted , deletes all comments
});

Reviews.belongsTo(User);

Product.hasMany(Reviews, {
  onDelete: "CASCADE", // when blog is deleted , deletes all comments
});

Reviews.belongsTo(Product);

export default Reviews;
