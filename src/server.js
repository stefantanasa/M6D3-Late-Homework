import express from "express";
import authorsRoutes from "./services/authors/routes.js";
import blogsRoutes from "./services/blogs/routes.js";
import { authenticateDatabase } from "./utils/db/connect.js";

const server = express();

const { PORT = 5001 } = process.env;

server.use(express.json());

server.use("/authors", authorsRoutes);
server.use("/blogs", blogsRoutes);

server.listen(PORT, () => {
  authenticateDatabase();
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log(`Server is stopped : ${error}`);
});
