import { useContext, createContext, useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { UserBalance, UserType } from "@/src/types/auth.type";

type AuthContextType = {
  userId: Id<"users"> | null;
  user: UserType | null;
  userBalance: UserBalance[] | null;
  userTotalBalance: number;
  monthlyBalance: Record<string, number>,
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  user: null,
  userBalance: null,
  userTotalBalance: 0,
  monthlyBalance: {},
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

  const userBalance = useQuery(
    api.users.getUserMonthlyBalance,
    userId ? { userId } : "skip"
  );

  const totalBalance = userBalance?.reduce((acc, item) => {
    return acc += item.balance
  }, 0)

  const MBalance = userBalance?.reduce<Record<string, number>>((acc, item) => {
    const date = new Date(item.month);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = 0
    }

    acc[monthKey] += item.balance;

    return acc;
  }, {})

  const value = useMemo(() => ({
    userId,
    user: convexUser ?? null,
    userBalance: userBalance ?? null,
    userTotalBalance: totalBalance ?? 0,
    monthlyBalance: MBalance ?? {},
    isLoading: !convexUser && clerkUser !== undefined,
  }), [userId, convexUser, userBalance, clerkUser]);
  

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext);
