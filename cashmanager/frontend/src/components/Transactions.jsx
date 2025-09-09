import React, { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await accountAPI.getTransactions(page);
      
      if (response.data.success) {
        const newTransactions = response.data.transactions || [];
        setTransactions(prev => [...prev, ...newTransactions]);
        setHasMore(response.data.pagination?.hasMore || false);
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const formatAmount = (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } catch (err) {
      console.error('Error formatting amount:', err);
      return amount.toString();
    }
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setPage(1);
              setTransactions([]);
              fetchTransactions();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      
      {transactions.length === 0 && !loading ? (
        <p className="text-gray-500 text-center">No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {transaction.from._id === localStorage.getItem('userId')
                      ? `Sent to ${transaction.to.firstName} ${transaction.to.lastName}`
                      : `Received from ${transaction.from.firstName} ${transaction.from.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
                <p className={`font-bold ${
                  transaction.from._id === localStorage.getItem('userId')
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}>
                  {transaction.from._id === localStorage.getItem('userId')
                    ? `-${formatAmount(transaction.amount)}`
                    : `+${formatAmount(transaction.amount)}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 mt-2">Loading transactions...</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions; 