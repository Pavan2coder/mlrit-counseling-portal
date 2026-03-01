import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';      // 🌟 NEW: The Splash Screen
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* 🌟 NEW: The splash screen is now the starting point */}
        <Route path="/" element={<Home />} />
        
        {/* Login is now moved to /login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;