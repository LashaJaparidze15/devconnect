import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { getAvatarUrl } from '../utils/helpers';
import { API_URL } from '../config';

function Developers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLookingFor, setFilterLookingFor] = useState('all');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevelopers();
  }, [filterLookingFor]);

  const fetchDevelopers = async () => {
    try {
      let url = `${API_URL}/api/users`;
      const params = new URLSearchParams();
      
      if (filterLookingFor !== 'all') {
        params.append('lookingFor', filterLookingFor);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      setDevelopers(res.data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchDevelopers();
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/users?search=${searchTerm}`);
      setDevelopers(res.data);
    } catch (error) {
      console.error('Error searching developers:', error);
    }
  };

  const filteredDevelopers = developers.filter(dev => dev._id !== user?.id);

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white' }}>
      <nav style={{ background: '#1f2937', padding: '1rem' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 
            onClick={() => navigate('/dashboard')}
            style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            DevConnect
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </button>
            <span>Welcome, {user?.username}!</span>
            <button
              onClick={logout}
              style={{ 
                background: '#dc2626', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.25rem', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Discover Developers
        </h2>

        <div style={{ background: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterLookingFor('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                background: filterLookingFor === 'all' ? '#3b82f6' : '#374151',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              All Developers
            </button>
            <button
              onClick={() => setFilterLookingFor('collaborators')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                background: filterLookingFor === 'collaborators' ? '#3b82f6' : '#374151',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Looking for Collaborators
            </button>
            <button
              onClick={() => setFilterLookingFor('mentors')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                background: filterLookingFor === 'mentors' ? '#3b82f6' : '#374151',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Looking for Mentors
            </button>
            <button
              onClick={() => setFilterLookingFor('projects')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                background: filterLookingFor === 'projects' ? '#3b82f6' : '#374151',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Looking for Projects
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading developers...</p>
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1f2937', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>No developers found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredDevelopers.map((dev) => (
              <div 
                key={dev._id}
                onClick={() => navigate(`/developer/${dev._id}`)}
                style={{ 
                  background: '#1f2937', 
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: '1px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img 
                    src={getAvatarUrl(user)} 
                    alt={dev.username}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {dev.username}
                    </h3>
                    {dev.lookingFor && dev.lookingFor !== 'none' && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        background: '#10b981',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {dev.lookingFor}
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {dev.bio || 'No bio available'}
                </p>

                {dev.skills && dev.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {dev.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#374151',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#3b82f6'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {dev.skills.length > 3 && (
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        +{dev.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Developers;
