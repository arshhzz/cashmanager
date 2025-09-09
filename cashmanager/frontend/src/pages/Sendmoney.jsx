import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';

const Sendmoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const recipientId = searchParams.get('id');
  const recipientName = searchParams.get('name');

  if (!recipientId || !recipientName) {
    return (
      <div className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] flex justify-center items-center px-4">
        <div className="rounded-lg bg-white w-96 text-center p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Recipient</h2>
          <p className="text-gray-600 mb-4">The recipient information is missing or invalid.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const response = await transactionAPI.sendMoney({
        to: recipientId,
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setSuccess(true);
        setAmount('');
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Transfer error:', err);
      // Handle both API error formats
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response.data.errors[0]?.message) || 
                          'Transfer failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] flex justify-center items-center px-4">
        <div className="rounded-lg bg-white w-96 text-center p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-green-500 mb-4">Transfer Successful!</h2>
          <p className="text-gray-600 mb-4">Your money has been sent successfully.</p>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] flex justify-center items-center px-4">
      <div className="rounded-lg bg-white w-96 text-center p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Send Money</h2>
        <p className="text-gray-600 mb-6">Sending money to {recipientName}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleTransfer}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Money'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sendmoney;