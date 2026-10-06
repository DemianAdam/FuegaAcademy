import { type ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(
    api.users.queries.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  const isLoading =
    authLoading || (isAuthenticated && currentUser === undefined);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser ?? null,
        isLoading,
        isAuthenticated,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
