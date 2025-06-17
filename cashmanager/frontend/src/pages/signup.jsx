import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(""); 
  };

  const handleSignup = async () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await api.post("/api/v1/user/signup", formData);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] flex justify-center items-center px-4">
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div className="rounded-lg bg-white w-96 text-center p-6 shadow-xl">
        <Heading label="Sign up" />
        <SubHeading label="Join us and take control of your money" />
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <InputBox
          onChange={handleInputChange('firstName')}
          placeholder="Enter your first name"
          label="First Name"
          value={formData.firstName}
        />
        <InputBox
          onChange={handleInputChange('lastName')}
          placeholder="Enter your last name"
          label="Last Name"
          value={formData.lastName}
        />
        <InputBox
          onChange={handleInputChange('username')}
          placeholder="you@gmail.com"
          label="Email"
          type="email"
          value={formData.username}
        />
        <InputBox
          onChange={handleInputChange('password')}
          placeholder="••••••••"
          label="Password"
          type="password"
          value={formData.password}
        />
        
        <div className="pt-4">
          <Button
            onClick={handleSignup}
            label={loading ? "Creating Account..." : "Sign up"}
            disabled={loading}
          />
        </div>
        
        <BottomWarning
          label="Already have an account?"
          buttonText="Sign in"
          to="/signin"
        />
      </div>
    </div>
  );
};
