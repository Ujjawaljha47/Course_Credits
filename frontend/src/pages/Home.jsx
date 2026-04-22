import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from "../config/apiConfig";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/current-user`);
      const data = await res.json();

      if (!res.ok || !data.rollNo) {
        alert("Could not fetch your Roll Number. Please try again.");
        return;
      }

      navigate(`/minor-honors?rollNo=${data.rollNo}`);
    } catch (err) {
      console.error(err);
      alert("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Student Dashboard</h1>
      <div className="course-card">
        <h3>Ready to start?</h3>
        <p>Browse our catalog fetched from the database.</p>
        <button onClick={handleNavigate} disabled={loading}>
          {loading ? "Loading..." : "Select Minor or Honors Courses"}
        </button>
      </div>
    </div>
  );
};

export default Home;