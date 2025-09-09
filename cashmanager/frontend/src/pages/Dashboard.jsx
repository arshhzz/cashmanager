import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { authAPI, transactionAPI, accountAPI } from "../services/api";
import Transactions from '../components/Transactions';

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([
          fetchUserProfile(),
          fetchBalance()
        ]);
      } catch (err) {
        setError("Failed to initialize dashboard");
        console.error("Dashboard initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error; // Propagate error to be handled by the caller
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await accountAPI.getBalance();
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      throw error; // Propagate error to be handled by the caller
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([
        fetchUserProfile(),
        fetchBalance()
      ]);
    } catch (err) {
      setError("Failed to refresh dashboard data");
      console.error("Dashboard refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar user={user} />
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar user={user} />
      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
            <button 
              onClick={handleRetry}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        
        <Balance value={balance} />
        <Users />
        <Transactions />
      </div>
    </div>
  );
};