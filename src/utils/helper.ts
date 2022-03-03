import * as jwt from "jsonwebtoken";

export const decodeToken = (): string => {
  const token = process.env.VALID_TOKEN;
  const decodedData = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
  const { userId } = decodedData;
  return userId;
};
