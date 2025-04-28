import { Id } from "../../convex/_generated/dataModel";

export type UserType = {
  _id: Id<"users">;
  _creationTime: number;
  image?: string | undefined;
  name: string;
  email: string;
  clerkId: string;
};
