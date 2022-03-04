import * as express from "express";
import { IPost } from "../interfaces/post.interface";
import { IUser } from "../interfaces/user.interface";
import { AppService } from "../services/app.service";
import { CustomError } from "../utils/custom-error";

class AppController {
  private readonly appService: AppService;
  constructor() {
    this.appService = new AppService();
  }

  createUser = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const userInfo: IUser = request.body;
      const newUser = await this.appService.createUser(userInfo);
      response.send(newUser);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  signIn = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const { email, password } = request.body;
      const user = await this.appService.authenticate(email, password);
      response.send(user);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  createPost = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const postInfo: IPost = request.body;
      const newUser = await this.appService.createPost(postInfo);
      response.send(newUser);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  getAllPostsByUser = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const posts = await this.appService.getAllPostsByUser();
      response.send(posts);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  getPostById = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const { postId } = request.params;
      const post = await this.appService.getPostById(postId);
      response.send(post);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  updatePostByUser = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const updateDto = request.body;
      const { postId } = request.params;
      const updatedPost = await this.appService.updatePostByUser(
        postId,
        updateDto
      );
      response.send(updatedPost);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };

  deletePostByUser = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    try {
      const { postId } = request.params;
      const updatedPost = await this.appService.deletePostByUser(postId);
      response.send(updatedPost);
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  };
}

export default new AppController();
