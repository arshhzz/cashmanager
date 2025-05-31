import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/Dashboard";
import { Sendmoney } from "./pages/Sendmoney";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Sendmoney" element={<Sendmoney />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
