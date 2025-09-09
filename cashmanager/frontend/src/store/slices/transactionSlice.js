import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  balance: 0,
  loading: false,
  error: null
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload.transactions;
      state.balance = action.payload.balance;
    },
    fetchTransactionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      state.balance = action.payload.newBalance;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.balance = 0;
    }
  }
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransaction,
  clearTransactions
} = transactionSlice.actions;

export default transactionSlice.reducer; 