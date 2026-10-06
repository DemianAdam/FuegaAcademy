import { createContext } from "react";
import type { Doc } from "../../convex/_generated/dataModel";

export interface AuthContextValue {
  user: Doc<"users"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
