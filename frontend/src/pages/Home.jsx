import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Student Dashboard</h1>
      <div className="course-card">
        <h3>Ready to start?</h3>
        <p>Browse our catalog fetched from the database.</p>
        {/* <button onClick={() => navigate('/selection')}>
          Select Courses
        </button> */}
      </div>
    </div>
  );
};

export default Home;