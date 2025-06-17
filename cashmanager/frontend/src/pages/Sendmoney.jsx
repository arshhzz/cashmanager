import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/Button';
import api from '../utils/api';

export const Sendmoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await api.post("/api/v1/account/transfer", {
        to: id,
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Transfer failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center h-screen bg-gray-100 items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Successful!</h2>
          <p className="text-gray-600 mb-4">
            ₹{amount} has been sent to {name}
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center h-screen bg-gray-100 items-center">
      <div className="bg-white max-w-md w-full mx-4 p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Send Money</h2>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white font-medium">
                {name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount (in ₹)
              </label>
              <input
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                value={amount}
                type="number"
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                id="amount"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate("/dashboard")}
                label="Cancel"
                variant="secondary"
                disabled={loading}
              />
              <Button
                onClick={handleTransfer}
                label={loading ? "Processing..." : "Send Money"}
                variant="primary"
                disabled={loading || !amount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};