import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] bg-[length:200%_200%] flex justify-center items-center px-4"
      style={{
        animation: 'gradientShift 8s ease infinite',
        backgroundSize: '200% 200%',
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
        <Heading label="Sign Up" />
        <SubHeading label="Join us and take control of your money" />
        <div className="space-y-4 text-left">
          <InputBox onChange={(e) => {
            setFirstName(e.target.value)
          }} placeholder="Enter your first name" label="First Name" />
          <InputBox onChange={(e) => {
            setLastName(e.target.value)
          }} placeholder="Enter your last name" label="Last Name" />
          <InputBox onChange={(e) => {
            setUsername(e.target.value)
          }} placeholder="you@example.com" label="Email" />
          <InputBox onChange={(e) => {
            setPassword(e.target.value)
          }} placeholder="••••••••" label="Password" />
        </div>  
        <div className="pt-2">
          <Button onClick={() =>{
            axios.post("http://localhost:3000/api/v1/user/signup", {
              username,
              firstName,
              password,
              lastName
            })
          }} label="Continue" />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  );
};
