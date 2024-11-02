import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RacePage from './pages/HomePage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/race"
          element={isAuthenticated ? <RacePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
