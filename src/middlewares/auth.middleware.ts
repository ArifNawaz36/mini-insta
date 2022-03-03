import * as express from "express";
export const authMiddleware = (
  request: express.Request,
  response: express.Response,
  next
) => {
  const token = request.headers["token"];
  if (token) {
    process.env.VALID_TOKEN = token as string;
    next();
  } else {
    response.status(401).send("Unauthorized request");
  }
};
