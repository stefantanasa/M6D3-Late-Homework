import express from "express";
import productRoutes from "./services/products/routes.js";
import userRoutes from "./services/users/routes.js";
import { authenticateDatabase } from "./utils/db/connect.js";

const server = express();

const { PORT = 5001 } = process.env;

server.use(express.json());

server.use("/users", userRoutes);

server.use("/products", productRoutes);

server.listen(PORT, () => {
  authenticateDatabase();
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log(`Server is stopped : ${error}`);
});
