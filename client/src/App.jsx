import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Developers from './pages/Developers';
import DeveloperProfile from './pages/DeveloperProfile';
import Messages from './pages/Messages';
import GitHubCallback from './pages/GitHubCallback';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#111827' 
      }}>
        <div style={{ color: 'white', fontSize: '1.25rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/auth/github" element={<GitHubCallback />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/create-project" element={user ? <CreateProject /> : <Navigate to="/login" />} />
        <Route path="/project/:projectId" element={user ? <ProjectDetail /> : <Navigate to="/login" />} />
        <Route path="/developers" element={user ? <Developers /> : <Navigate to="/login" />} />
        <Route path="/developer/:userId" element={user ? <DeveloperProfile /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/messages/:userId" element={user ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;