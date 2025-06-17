import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Appbar = ({ user }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="shadow-lg h-16 flex justify-between bg-white border-b">
      <div className="flex items-center ml-6">
        <h1 className="text-xl font-bold text-gray-800">💰 CashManager</h1>
      </div>
      <div className="flex items-center relative">
        <div className="flex items-center mr-4">
          <span className="text-gray-600 mr-3">
            Hello, {user?.firstName || 'User'}!
          </span>
          <div 
            className="relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="rounded-full h-10 w-10 bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
              <span className="text-white font-medium text-sm">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
