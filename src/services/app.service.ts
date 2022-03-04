import * as bcrypt from "bcryptjs";
import * as validator from "email-validator";
import * as jwt from "jsonwebtoken";
import { CustomError } from "../utils/custom-error";
import { IPost } from "../interfaces/post.interface";
import { IUser } from "../interfaces/user.interface";
import { AppRepo } from "../repos/app.repo";
import { decodeToken } from "../utils/helper";

export class AppService {
  private readonly appRepo: AppRepo;
  constructor() {
    this.appRepo = new AppRepo();
  }

  createUser = async (userInfo: IUser) => {
    try {
      const { password, email } = userInfo;
      const validEmail = validator.validate(email);
      if (!validEmail) {
        throw new CustomError(400, "Invalid email.");
      }
      const user = await this.appRepo.getUserByEmail(email);
      if (user) {
        throw new CustomError(409, "User already exists with this info.");
      }
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      userInfo.password = passwordHash;
      const newUser = await this.appRepo.createUser(userInfo);
      delete newUser?.password;
      const jwtToken = this.signIn(newUser._id);
      return { ...newUser, jwtToken };
    } catch (error) {
      console.log("Error while creating user.");
      throw new CustomError(error.status, error.message);
    }
  };

  signIn = (userId: string): string => {
    try {
      const userData = {
        userId,
      };
      const signInOptions = {
        expiresIn: "60 days",
        algorithm: "RS256",
      };
      const privateKey = process.env.JWT_PRIVATE_KEY;
      const jwtToken = jwt.sign(userData, privateKey, signInOptions);
      return jwtToken;
    } catch (error) {
      console.log(`Error while signing the token.${error.message}`);
      throw new CustomError(500, "Error occurred while signing-in user.");
    }
  };

  authenticate = async (email: string, password: string) => {
    try {
      const user = await this.appRepo.getUserByEmail(email);
      if (!user) {
        throw new CustomError(400, "Invalid email.");
      }
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        throw new CustomError(400, "Email or password is not correct.");
      }
      const jwtToken = this.signIn(user._id);
      delete user.password;
      return { ...user, jwtToken };
    } catch (error) {
      console.log("Error while signing-in user.");
      throw new CustomError(error.status, error.message);
    }
  };

  createPost = async (postInfo: IPost): Promise<IPost> => {
    try {
      const userId = decodeToken();
      const newPost = await this.appRepo.createPost({ ...postInfo, userId });
      return newPost;
    } catch (error) {
      console.log("Error while creating post.");
      throw new CustomError(error.status, error.message);
    }
  };

  getAllPostsByUser = async (): Promise<IPost[]> => {
    try {
      const userId = decodeToken();
      const posts = await this.appRepo.getAllPostsByUser(userId);
      return posts;
    } catch (error) {
      console.log("Error while getting user posts.");
      throw new CustomError(error.status, error.message);
    }
  };

  getPostById = async (postId: string): Promise<IPost> => {
    try {
      const userId = decodeToken();
      const post = await this.appRepo.getPostById(postId);
      if (!post) {
        throw new CustomError(400, "Entity does not exist.");
      }
      if (userId !== post?.userId.toString()) {
        throw new CustomError(403, "Unauthorized request.");
      }
      return post;
    } catch (error) {
      console.log("Error while getting post by Id.");
      throw new CustomError(error.status, error.message);
    }
  };

  updatePostByUser = async (postId: string, updateDto: any): Promise<any> => {
    try {
      const userId = decodeToken();
      const post = await this.appRepo.getPostById(postId);
      if (!post) {
        throw new CustomError(400, "Entity does not exist.");
      }
      if (userId !== post?.userId.toString()) {
        throw new CustomError(403, "Unauthorized request.");
      }
      const updatedPost = await this.appRepo.updatePostByUser(
        userId,
        postId,
        updateDto
      );
      return updatedPost;
    } catch (error) {
      console.log("Error while updating post by Id.");
      throw new CustomError(error.status, error.message);
    }
  };

  deletePostByUser = async (postId: string): Promise<any> => {
    try {
      const userId = decodeToken();
      const post = await this.appRepo.getPostById(postId);
      if (!post) {
        throw new CustomError(400, "Entity does not exist.");
      }
      if (userId !== post?.userId.toString()) {
        throw new CustomError(403, "Unauthorized request.");
      }
      const updatedPost = await this.appRepo.deletePostByUser(userId, postId);
      return updatedPost;
    } catch (error) {
      console.log("Error while deleting post by Id.");
      throw new CustomError(error.status, error.message);
    }
  };
}
