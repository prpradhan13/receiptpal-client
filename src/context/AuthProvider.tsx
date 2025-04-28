import { useContext, createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { UserType } from "@/src/types/auth.type";

type AuthContextType = {
  userId: Id<"users"> | null;
  user: UserType | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  user: null,
  isLoading: true,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: clerkUser, isSignedIn } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    if (convexUser) {
      setUserId(convexUser._id);
    }
  }, [convexUser]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        user: convexUser ?? null,
        isLoading: !convexUser && !!isSignedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext);
