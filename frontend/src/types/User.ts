import { Account, Session } from "better-auth";
import { Order } from "./Order";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean
  image: string
  createdAt: Date
  updatedAt: Date
  sessions: Session[]
  accounts: Account[]
  Orders: Order[]
  role: string
  banned: boolean
  banReason: string
  banExpires: Date
}