import { useEffect, useState, useCallback } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async (searchFilter) => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/user/bulk?filter=${searchFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(filter);
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [filter, fetchUsers]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
      <div className="font-bold text-xl mb-4 text-gray-800">Send Money</div>
      
      <div className="mb-4">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map(user => <User key={user._id} user={user} />)
          ) : (
            <div className="text-gray-500 text-center py-4">
              {filter ? "No users found" : "Start typing to search users"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className="rounded-full h-12 w-12 bg-gray-600 flex items-center justify-center mr-3">
          <span className="text-white font-medium">
            {getInitials(user.firstName, user.lastName)}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-800">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-gray-500">{user.username}</div>
        </div>
      </div>

      <Button
        onClick={() => {
          navigate(`/send?id=${user._id}&name=${user.firstName}`);
        }}
        label="Send Money"
        variant="secondary"
      />
    </div>
  );
}