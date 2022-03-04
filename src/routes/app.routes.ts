import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import appController from "../controllers/app.controller";
import { requestHandler } from "../utils/request-handler";
const controller = appController;

const router = express.Router();

router.post("/sign-in", requestHandler(controller.signIn));
router.post("/sign-up", requestHandler(controller.createUser));
router.post("/post", authMiddleware, requestHandler(controller.createPost));
router.get(
  "/posts",
  authMiddleware,
  requestHandler(controller.getAllPostsByUser)
);
router.get(
  "/post/:postId",
  authMiddleware,
  requestHandler(controller.getPostById)
);
router.put(
  "/post/:postId",
  authMiddleware,
  requestHandler(controller.updatePostByUser)
);
router.delete(
  "/post/:postId",
  authMiddleware,
  requestHandler(controller.deletePostByUser)
);

export default router;
