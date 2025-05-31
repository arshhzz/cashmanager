import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"

export const Signin = () => {

  return <div className="bg-slate-300 h-screen flex justify-center">
    <div
      className="h-screen w-full bg-gradient-to-r from-[#40e0d0] to-[#008080] bg-[length:200%_200%] flex justify-center items-center px-4"
      style={{
        animation: 'gradientShift 8s ease infinite',
        backgroundSize: '200% 200%',
      }}
    >
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="your@email.com" label={"Email"} />
        <InputBox placeholder="••••••••" label={"Password"} />
        <div className="pt-4">
          <Button label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}