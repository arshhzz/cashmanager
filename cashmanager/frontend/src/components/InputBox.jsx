export function InputBox({ label, placeholder, onChange, type = "text", value = "" }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-left py-2 text-gray-700">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}