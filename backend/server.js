import express from "express";
import cors from "cors";
import { getUsers, getUser, createUser } from "./database.js";

const app = express();

app.use(cors()); // enable CORS for all routes

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

app.post("/create", async (req, res) => {
  const { name } = req.body;
  const newUser = await createUser(name);
  res.status(201).send(newUser);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Yey, your server is running on port 8080");
});
