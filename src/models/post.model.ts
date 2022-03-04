import * as mongoose from "mongoose";
import { IPost } from "../interfaces/post.interface";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

const getPostModel = () => {
  return mongoose.model<IPost>("Post", postSchema, "posts");
};

export { getPostModel };
