import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import MinorHonorsSelection from "./pages/MinorHonours/MinorHonorsSelection";
import Account from "./pages/epayScreens/Account";
import StudentWelfare from "./pages/epayScreens/StudentWelfare";
import Academic from "./pages/epayScreens/Academic";
import DegreeFilterPage from "./pages/AscScreens/DegreeCertificate/DegreeFilterPage";
import DegreeStudentListPage from "./pages/AscScreens/DegreeCertificate/DegreeStudentListPage";


function App() {
  return (
    <Router basename="/courseselection">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/minor-honors" element={<MinorHonorsSelection />} /> */}
        <Route path="/epayScreens/account" element={<Account />} />
        <Route path="/epayScreens/studentWelfare" element={<StudentWelfare />} />
        <Route path="/epayScreens/academic" element={<Academic />} />
        <Route path="/degree-certificate/filter" element={<DegreeFilterPage />} />
        <Route path="/degree/students" element={<DegreeStudentListPage />} />
      </Routes>
    </Router>
  );
}

export default App;