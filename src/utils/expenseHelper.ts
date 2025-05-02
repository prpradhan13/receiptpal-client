import { getMonthKey } from "./helpingFunc";
import { ReceiptExpenseType, TCategoryItems } from "../types/expense.type";
import dayjs from "dayjs";

export const groupObjectReducer = (
  acc: Record<string, ReceiptExpenseType[]>,
  expense: ReceiptExpenseType
) => {
  const monthKey = getMonthKey(new Date(expense.purchasedAt));

  if (!acc[monthKey]) {
    acc[monthKey] = [];
  }

  acc[monthKey].push(expense);
  return acc;
};

export const grpByCategoryReducer = (
  acc: Record<string, TCategoryItems[]>,
  expense: ReceiptExpenseType
) => {
  const categoryKey = expense.category || "Uncategorized";

  const item: TCategoryItems = {
    itemName: expense.itemName,
    price: expense.total,
    purchasedAt: expense.purchasedAt,
  };

  if (!acc[categoryKey]) {
    acc[categoryKey] = [];
  }

  acc[categoryKey].push(item);

  return acc;
};

export const groupedExpensesFunc = (expenseQueryData: ReceiptExpenseType[] | null) => {
  if (!expenseQueryData) return [];

  const grpObject = expenseQueryData.reduce<
    Record<string, typeof expenseQueryData>
  >(groupObjectReducer, {});

  return Object.entries(grpObject)
    .sort(([a], [b]) => (dayjs(b).isAfter(dayjs(a)) ? 1 : -1))
    .map(([month, expenses]) => ({
      month,
      expenses,
    }));
};