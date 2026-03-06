// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';

// function App() {
//   return (
//     <Router>
//       <Routes>
        
//         <Route path="/" element={<Home />} />
        
        
//         {/* <Route path="/selection" element={<CourseSelection />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseSelection from './pages/CourseSelection'; 
import MinorHonorsSelection from './pages/MinorHonorsSelection';
// import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selection" element={<CourseSelection />} />
        <Route path="/minor-honors" element={<MinorHonorsSelection/>} />
        {/* <Route path="/dashboard" element={<StudentDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;