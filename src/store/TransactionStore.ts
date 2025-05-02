import { create } from "zustand";
import { ReceiptExpenseType } from "../types/expense.type";

interface UserTransactions {
  allExpenses: ReceiptExpenseType[] | null;
  userAllTransactionAmount: number;
  setAllExpenses: (expenses: ReceiptExpenseType[]) => void;
}

export const useTransactionStore = create<UserTransactions>((set) => ({
  allExpenses: null,
  userAllTransactionAmount: 0,
  setAllExpenses: (expenses) => {
    const sortExpense = expenses.sort((a, b) => b.purchasedAt - a.purchasedAt)
    const amount =
      expenses?.reduce((acc, transaction) => acc + transaction.total, 0) ?? 0;
    set({
      allExpenses: sortExpense,
      userAllTransactionAmount: amount,
    });
  },
}));
