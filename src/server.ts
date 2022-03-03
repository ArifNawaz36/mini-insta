import { config } from "dotenv";
config();

import * as fs from "fs";
import * as http from "http";
import * as mongoose from "mongoose";

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const start = () => {
  const appClass = require("./app").default;

  mongoose.connect(MONGO_URI);

  if (process.env.NODE_ENV === "local") {
    process.env.JWT_PRIVATE_KEY = fs.readFileSync(
      process.env.JWT_PRIVATE_KEY_PATH,
      "utf-8"
    );
    process.env.JWT_PUBLIC_KEY = fs.readFileSync(
      process.env.JWT_PUBLIC_KEY_PATH,
      "utf-8"
    );
  }

  const server = http.createServer(appClass.app);
  server.once("listening", () => {
    console.log("Server listening on PORT:", PORT);
  });

  server.listen(PORT);
};

start();
