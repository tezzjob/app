import HomePage from "./components/HomePage";
import "@fontsource/poppins";
import PersonaSelection from "./components/PersonaSelection";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import EmployeeLogin from "./components/EmployeeLogin";
import ShopKeeperLogin from "./components/ShopKeeperLogin";
import EmployeeShops from "./components/EmployeeShops";
import ShopkeeperDashboard from "./components/ShopkeeperDashboard";
import VerifyShop from "./components/VerifyShop";
import AllJobPostings from "./components/AllJobPostings";
import EmployeesApplied from "./components/EmployeesApplied";
import CreateJob from "./components/CreateJob";
import ApplyToJob from "./components/ApplyToJob";
import ResetPassword from "./components/ResetPassword";
import About from "./components/About";

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/persona-selection" element={<PersonaSelection />} />
        <Route path="/employee-registration" element={<EmployeeLogin />} />
        <Route path="/shopkeeper-login" element={<ShopKeeperLogin />} />
        <Route path="/shop-dashboard" element={<ShopkeeperDashboard />} />
        <Route path="/all-job-postings" element={<AllJobPostings />} />
        <Route path="/job/:id" element={<EmployeesApplied />} />
        <Route path="/verify" element={<VerifyShop />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/apply" element={<ApplyToJob />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </>
  );
}

export default App;
