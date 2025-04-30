import { Id } from "../../convex/_generated/dataModel";

export type UserType = {
  _id: Id<"users"> | string;
  _creationTime: number;
  image?: string | undefined;
  name: string;
  email: string;
  clerkId: string;
};

export type UserBalance = {
  _id: Id<"userMonthlyBalance"> | string;
  _creationTime: number;
  balance: number;
  userId: Id<"users"> | string;
}
