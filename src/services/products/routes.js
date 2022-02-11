import { Router } from "express";
import sequelize, { Op } from "sequelize";
import Category from "./categories.model.js";
import Product from "./model.js";
import Reviews from "./reviews.model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    /* 
    default values offset and limit
     */
    const { offset = 0, limit = 9 } = req.query;
    const totalProduct = await Product.count({});
    /**
     * Joins Author object
     */
    const products = await Product.findAll({
      include: [Reviews, Category],
      offset,
      limit,
    });
    res.send({ data: products, count: totalProduct });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/search", async (req, res, next) => {
  try {
    console.log({ query: req.query });
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          // --> you can ad as many operation you want here
          {
            title: {
              [Op.iLike]: `%${req.query.q}%`, // for like and iLike always add pattern
            },
          },
          {
            content: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
        ],
      },
      include: [Reviews],
    });
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/stats", async (req, res, next) => {
  try {
    const stats = await Reviews.findAll({
      // select list : what you want to get ?
      attributes: [
        [
          sequelize.cast(
            // cast function converts datatype
            sequelize.fn("count", sequelize.col("product_id")), // SELECT COUNT(Product_id) AS total_Reviews
            "integer"
          ),
          "reviews",
        ],
      ],
      group: ["product_id", "product.id"],
      include: [Product],
    });
    res.send(stats);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const singleProduct = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Reviews,
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });
    if (singleProduct) {
      res.send(singleProduct);
    } else {
      res.status(404).send({ message: "No such Product" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.categories) {
      for await (const categoryName of req.body.categories) {
        const category = await Category.create({ name: categoryName });
        await newProduct.addCategory(category);
      }
    }

    // and add to Product

    /**
     * this will go and insert relationship to Product_categories table
     */

    /**
     *  find Product by id and join Category,Author,Comment tables
     */
    const ProductWithCategory = await Product.findOne({
      where: { id: newProduct.id },
      include: [Category, Reviews],
    });
    res.send(ProductWithCategory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    const newReview = await Reviews.create({
      ...req.body,
      productId: req.params.id,
    });
    res.send(newReview);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.post("/:id/category", async (req, res, next) => {
  try {
    // find the Product that you want to add category
    const product = await Product.findByPk(req.params.id);
    if (product) {
      // create the category
      const category = await Category.create(req.body);
      // and add to Product

      /**
       * this will go and insert relationship to Product_categories table
       */
      await product.addCategory(category);
      /**
       *  find Product by id and join Category,Author,Comment tables
       */

      res.send(category);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.delete("/:id/category/:categoryId", async (req, res, next) => {
  try {
    // find the Product that you want to add category
    const product = await Product.findByPk(req.params.id);
    if (product) {
      // create the category
      const category = await Category.findByPk(req.params.categoryId);
      // and add to Product

      /**
       * this will go and insert relationship to Product_categories table
       */
      await product.removeCategory(category);
      /**
       *  find Product by id and join Category,Author,Comment tables
       */
      const productWithCategory = await Product.findOne({
        where: { id: req.params.id },
        include: [Category, Reviews],
      });
      res.send(productWithCategory);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const [success, updatedProduct] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updatedProduct);
    } else {
      res.status(404).send({ message: "no such Product" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Product.destroy({ id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default productsRouter;
