export type ReceiptExpenseType = {
  _id: string;
  _creationTime: number;
  userId: string;
  receiptId?: string;
  category: string;
  itemName: string;
  quantity?: string;
  price: number;
  total: number;
  purchasedAt: number;
};

export type MonthExpenseType = {
  month: string;
  expenses: ReceiptExpenseType[];
};

export type TCategoryItems = {
  itemName: string;
  price: number;
  purchasedAt: number;
};
