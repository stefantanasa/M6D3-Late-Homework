import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";

const Product = sequelize.define(
  "product",
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
    price: {
      type: DataTypes.FLOAT,
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

export default Product;
