export type ITTicketExpense = {
  id?: number;
  processStatus: string;
  expenseAmount: number;
  expensePrice: number;
  expenseType?: { expenseCode: string; expenseName: string };
  createdAt: Date;
  updatedAt: Date;
  updatedById?: string;
  updatedByName?: string;
};
export type ITExpenseType = {
  expenseCode: string;
  expenseName: string;
};
