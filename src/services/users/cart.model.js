import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";

// model definition

/**
 * its created if this module (current file that you are looking) is imported to anywhere
 * that is executed
 */
const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // this is unique generated id with uuid4 standards
      allowNull: false,
      primaryKey: true,
    },
  },
  { underscored: true } // this attribute is converting camelCase to snake_case
);

export default Cart;
