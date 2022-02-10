import { Router } from "express";
import Author from "../authors/model.js";
import { Op } from "sequelize";
import Blog from "./model.js";
import Comments from "./comments.model.js";
import sequelize from "sequelize";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    /**
     * Joins Author object
     */
    const blogs = await Blog.findAll({
      include: [Author, Comments],
    });
    res.send(blogs);
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
      group: ["blog_id", "blog.id"],
      include: [Blog],
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
      include: [Comments],
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
    res.send(newBlog);
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
