import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import api from "../utils/api";

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

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchBalance();
  }, [navigate]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.get("/api/v1/account/balance");
      
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      setError("Failed to fetch balance");
      console.error("Failed to fetch balance:", error);
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
              onClick={fetchBalance}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};