import { Router } from "express";
import Author from "./model.js";

const authorsRouter = Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    /**
     * getting all rows, you can use where:{} for filtering and order etc.
     */
    const authors = await Author.findAll({});
    res.send(authors);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    /**
     * if its not found , it returns null!
     * always check first
     */
    const singleAuthor = await Author.findByPk(req.params.id);
    if (singleAuthor) {
      res.send(singleAuthor);
    } else {
      res.status(404).send({ error: "No such author" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.send(newAuthor);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    /**
     *  if you add returning:true , it returns updatedObject
     *  returns an array [howManyRowsChanged,updatedObject]
     *  since we are updating by id , we expect one object to be updated
     *  therefore we are checking if howManyRowsChanged value is truthy
     */
    const [success, updateAuthor] = await Author.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updateAuthor);
    } else {
      res.status(404).send({ message: "no such author" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Author.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default authorsRouter;
