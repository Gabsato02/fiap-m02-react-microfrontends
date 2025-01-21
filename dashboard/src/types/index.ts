export type UserData = {
  username: string;
  email: string;
  balance: number;
  id: string;
  history: [];
};

export type Transaction = {
  id: number;
  userid: number;
  description: string;
  amount: number;
  type: string;
  date: string;
};

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
}
