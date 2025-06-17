import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError("");
  };

  const handleSignin = async () => {
    if (!formData.username || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await api.post("/api/v1/user/signin", formData);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials. Please try again.";
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
        <Heading label="Sign in" />
        <SubHeading label="Enter your credentials to access your account" />
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <InputBox
          placeholder="your@email.com"
          label="Email"
          type="email"
          value={formData.username}
          onChange={handleInputChange('username')}
        />
        <InputBox
          placeholder="••••••••"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
        />
        
        <div className="pt-4">
          <Button
            label={loading ? "Signing in..." : "Sign in"}
            onClick={handleSignin}
            disabled={loading}
          />
        </div>
        
        <BottomWarning
          label="Don't have an account?"
          buttonText="Sign up"
          to="/signup"
        />
      </div>
    </div>
  );
};