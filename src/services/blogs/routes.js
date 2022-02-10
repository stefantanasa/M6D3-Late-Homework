import { Router } from "express";
import Author from "../authors/model.js";
import { Op } from "sequelize";
import Blog from "./model.js";
import Comments from "./comments.model.js";
import sequelize from "sequelize";
import Category from "./categories.model.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    /* 
    default values offset and limit
     */
    const { offset = 0, limit = 9 } = req.query;
    const totalBlog = await Blog.count({});
    /**
     * Joins Author object
     */
    const blogs = await Blog.findAll({
      include: [Author, Comments, Category],
      offset,
      limit,
    });
    res.send({ data: blogs, count: totalBlog });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.get("/search", async (req, res, next) => {
  try {
    console.log({ query: req.query });
    const blogs = await Blog.findAll({
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
      include: [Author],
    });
    res.send(blogs);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.get("/stats", async (req, res, next) => {
  try {
    const stats = await Comments.findAll({
      // select list : what you want to get ?
      attributes: [
        [
          sequelize.cast(
            // cast function converts datatype
            sequelize.fn("count", sequelize.col("blog_id")), // SELECT COUNT(blog_id) AS total_comments
            "integer"
          ),
          "numberOfComments",
        ],
      ],
      group: ["blog_id", "blog.id", "blog.author.id"],
      include: [{ model: Blog, include: [Author] }], // <-- nested include
    });
    res.send(stats);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const singleBlog = await Blog.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Comments,
        Author,
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });
    if (singleBlog) {
      res.send(singleBlog);
    } else {
      res.status(404).send({ message: "No such blog" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    if (req.body.categories) {
      for await (const categoryName of req.body.categories) {
        const category = await Category.create({ name: categoryName });
        await newBlog.addCategory(category, {
          through: { selfGranted: false },
        });
      }
    }

    // and add to blog

    /**
     * this will go and insert relationship to blog_categories table
     */

    /**
     *  find blog by id and join Category,Author,Comment tables
     */
    const blogWithCategory = await Blog.findOne({
      where: { id: newBlog.id },
      include: [Category, Author, Comments],
    });
    res.send(blogWithCategory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

blogsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const newComment = await Comments.create({
      ...req.body,
      blogId: req.params.id,
    });
    res.send(newComment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

blogsRouter.post("/:id/category", async (req, res, next) => {
  try {
    // find the blog that you want to add category
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      // create the category
      const category = await Category.create(req.body);
      // and add to blog

      /**
       * this will go and insert relationship to blog_categories table
       */
      await blog.addCategory(category, { through: { selfGranted: false } });
      /**
       *  find blog by id and join Category,Author,Comment tables
       */

      res.send(category);
    } else {
      res.status(404).send({ error: "Blog not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

blogsRouter.delete("/:id/category/:categoryId", async (req, res, next) => {
  try {
    // find the blog that you want to add category
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      // create the category
      const category = await Category.findByPk(req.params.categoryId);
      // and add to blog

      /**
       * this will go and insert relationship to blog_categories table
       */
      await blog.removeCategory(category);
      /**
       *  find blog by id and join Category,Author,Comment tables
       */
      const blogWithCategory = await Blog.findOne({
        where: { id: req.params.id },
        include: [Category, Author, Comments],
      });
      res.send(blogWithCategory);
    } else {
      res.status(404).send({ error: "Blog not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const [success, updatedBlog] = await Blog.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updatedBlog);
    } else {
      res.status(404).send({ message: "no such blog" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Blog.destroy({ id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default blogsRouter;
