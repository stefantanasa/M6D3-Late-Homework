import { Router } from "express";
import Author from "../authors/model.js";
import { Op } from "sequelize";
import Blog from "./model.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    /**
     * Joins Author object
     */
    const blogs = await Blog.findAll({
      include: [Author],
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

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const singleBlog = await Blog.findByPk(req.params.id);
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
