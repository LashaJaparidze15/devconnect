import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      alert('GitHub authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Load user data
      axios.get('http://localhost:5000/api/auth/me')
        .then(res => {
          setUser(res.data);
          navigate('/dashboard');
        })
        .catch(err => {
          console.error('Error loading user:', err);
          navigate('/login');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#111827' 
    }}>
      <div style={{ color: 'white', fontSize: '1.25rem' }}>
        Authenticating with GitHub...
      </div>
    </div>
  );
}

export default GitHubCallback;