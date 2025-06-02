export const Balance = ({ value }) => {
  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(balance || 0);
  };

  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border">
      <div className="font-bold text-lg text-gray-700">Your balance:</div>
      <div className="font-semibold ml-4 text-xl text-green-600">
        {formatBalance(value)}
      </div>
    </div>
  );
};