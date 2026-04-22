import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MinorHonorsSelection from './pages/MinorHonorsSelection';


function App() {
  return (
    <Router basename="/courseselection">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/minor-honors" element={<MinorHonorsSelection />} />
      </Routes>
    </Router>
  );
}

export default App;