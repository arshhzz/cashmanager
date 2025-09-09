import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import store from './store';
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/Dashboard";
import Sendmoney from "./pages/Sendmoney";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm text-gray-600 mb-4">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/send" 
          element={
            <ProtectedRoute>
              <Sendmoney />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;