import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
export const Signup = () => {
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
          <InputBox placeholder="Enter your first name" label="First Name" />
          <InputBox placeholder="Enter your last name" label="Last Name" />
          <InputBox placeholder="you@example.com" label="Email" />
          <InputBox placeholder="••••••••" label="Password" />
        </div>
        <div className="pt-2">
          <Button label="Continue" />
        </div>
        <BottomWarning
          label="Already using the app?"
          buttonText="Sign in"
          to="/signin"
        />
      </div>
    </div>
  );
};
