import Sequelize, { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";

// ----------------------------------------------------------------
/**
 * this m:n relationship
 */

const Cart = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  },
  { underscored: true }
);

// through is the join table (3rd table)

export default Cart;
