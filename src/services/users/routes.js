import { Router } from "express";
import Product from "../products/model.js";
import Cart from "./cart.model.js";
import User from "./model.js";
import sequelize from "sequelize";

const usersRouter = Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    /**
     * getting all rows, you can use where:{} for filtering and order etc.
     */
    const users = await User.findAll({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    /**
     * if its not found , it returns null!
     * always check first
     */
    const singleUser = await User.findByPk(req.params.id);
    if (singleUser) {
      res.send(singleUser);
    } else {
      res.status(404).send({ error: "No such User" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.post("/:id/cart", async (req, res, next) => {
  try {
    /**
     * if its not found , it returns null!
     * always check first
     */
    const user = await User.findByPk(req.params.id);
    if (user) {
      const product = await Product.findByPk(req.body.productId);
      await Cart.create({ userId: user.id, productId: product.id });
      res.status(204).send();
    } else {
      res.status(404).send({ error: "No such User" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.get("/:id/cart", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.params.id },
      attributes: [
        [
          sequelize.cast(
            sequelize.fn("count", sequelize.col("product.price")),
            "integer"
          ),
          "quantity",
        ],
        [
          sequelize.cast(
            sequelize.fn("sum", sequelize.col("product.price")),
            "integer"
          ),
          "total",
        ],
      ],
      include: [Product],
      group: ["product.id"],
    });

    if (cart) {
      const totalItems = await Cart.count({
        where: { userId: req.params.id },
      });
      const totalPrice = await Cart.sum("product.price", {
        where: { userId: req.params.id },
        include: { model: Product, attributes: [] },
      });
      res.status(200).send({ totalItems, totalPrice, cart });
    } else {
      res.status(404).send({ error: "No such User" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    /**
     *  if you add returning:true , it returns updatedObject
     *  returns an array [howManyRowsChanged,updatedObject]
     *  since we are updating by id , we expect one object to be updated
     *  therefore we are checking if howManyRowsChanged value is truthy
     */
    const [success, updateUser] = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updateUser);
    } else {
      res.status(404).send({ message: "no such User" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default usersRouter;
