import { getUserModel } from "../models/user.model";
import { getPostModel } from "../models/post.model";
import { IUser } from "../interfaces/user.interface";
import { IPost } from "../interfaces/post.interface";
export class AppRepo {
  constructor() {}

  createUser = async (userInfo: IUser): Promise<IUser> => {
    const model = getUserModel();
    const userModel = new model(userInfo);
    const newUser = (await userModel.save()).toJSON();
    return newUser;
  };

  getUserByEmail = async (email: string): Promise<IUser> => {
    const userModel = getUserModel();
    const user = await userModel.findOne({ email }).lean();
    return user;
  };

  getUserById = async (userID: string): Promise<IUser> => {
    const userModel = getUserModel();
    const user = await userModel.findOne({ _id: userID }).lean();
    return user;
  };

  createPost = async (postInfo: IPost): Promise<IPost> => {
    const model = getPostModel();
    const postModel = new model(postInfo);
    const newPost = await postModel.save();
    return newPost;
  };

  getAllPostsByUser = async (userId: string): Promise<IPost[]> => {
    const postModel = getPostModel();
    const posts = await postModel.find({ userId }).lean();
    return posts;
  };

  getPostById = async (postId: string): Promise<IPost> => {
    const postModel = getPostModel();
    const post = await postModel.findOne({ _id: postId }).lean();
    return post;
  };

  updatePostByUser = async (
    userId: string,
    postId: string,
    updateDto: any
  ): Promise<IPost> => {
    const postModel = getPostModel();
    const updatedPost = await postModel
      .findOneAndUpdate({ userId, _id: postId }, updateDto)
      .lean();
    return updatedPost;
  };

  deletePostByUser = async (userId: string, postId: string): Promise<IPost> => {
    const postModel = getPostModel();
    const deletedPost = await postModel
      .findOneAndDelete({ userId, _id: postId })
      .lean();
    return deletedPost;
  };
}
