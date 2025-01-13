import api from "../../../requests";
import { UserData, Transaction } from "../../../types";

export const getUser = (): Promise<UserData> => api.get('/user');

export const getTransactions = (): Promise<Transaction[]> => api.get('/transactions');

export const createTransaction = (payload: any): Promise<Transaction> => api.post('/transactions', payload)