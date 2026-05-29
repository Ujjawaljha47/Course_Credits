import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MinorHonorsSelection from './pages/MinorHonorsSelection';
import Account from './pages/epayScreens/account';
import StudentWelfare from './pages/epayScreens/StudentWelfare';
import Academic from './pages/epayScreens/academic';
// import Academic from './pages/epayScreens/academic';


function App() {
  return (
    <Router basename="/courseselection">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/minor-honors" element={<MinorHonorsSelection />} /> */}
        <Route path="/epayScreens/account" element={<Account />} />
        <Route path="/epayScreens/studentWelfare" element={<StudentWelfare />} />
        <Route path="/epayScreens/academic" element={<Academic />} />
        {/* <Route path="/epayScreens/academic" element={<Academic />} /> */}
      </Routes>
    </Router>
  );
}

export default App;