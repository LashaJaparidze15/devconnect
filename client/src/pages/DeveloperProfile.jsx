import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import GitHubRepos from './GitHubRepos';
import { getAvatarUrl, getProjectImageUrl } from '../utils/helpers';
import { API_URL } from '../config';

function DeveloperProfile() {
  const [developer, setDeveloper] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchDeveloperData();
  }, [userId]);

  const fetchDeveloperData = async () => {
    try {
      const [devRes, projectsRes] = await Promise.all([
        axios.get(`${API_URL}/api/users/${userId}`),
        axios.get(`${API_URL}/api/projects/user/${userId}`)
      ]);
      
      setDeveloper(devRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      setError('Developer not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.25rem' }}>Loading...</p>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1rem' }}>{error || 'Developer not found'}</p>
          <button
            onClick={() => navigate('/developers')}
            style={{
              background: '#3b82f6',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Back to Developers
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate('/developers')}
              style={{
                background: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Back to Developers
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
        <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '2rem', marginBottom: '2rem' }}>
            <img 
              src={getAvatarUrl(user)} 
              alt={developer.username}
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {developer.username}
              </h1>
              <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>{developer.email}</p>
              
              {developer.lookingFor && developer.lookingFor !== 'none' && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Looking for: {developer.lookingFor}
                </span>
              )}

              {developer.githubUsername && (
                <div style={{ marginTop: '1rem' }}>
                  <a 
                    href={`https://github.com/${developer.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#374151',
                      borderRadius: '0.25rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    🔗 GitHub: @{developer.githubUsername}
                  </a>
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/messages/${developer._id}`);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  💬 Send Message
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>About</h2>
            <p style={{ color: '#d1d5db', lineHeight: '1.75' }}>
              {developer.bio || 'No bio available'}
            </p>
          </div>

          {developer.skills && developer.skills.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {developer.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#374151',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#3b82f6',
                      fontWeight: '600'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#1f2937', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>No projects yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {projects.map((project) => (
                <div 
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  style={{ 
                    background: '#1f2937', 
                    borderRadius: '0.5rem', 
                    overflow: 'hidden',
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
                  <img 
                    src={getProjectImageUrl(project)}
                    alt={project.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ 
                      color: '#9ca3af', 
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {project.techStack?.slice(0, 3).map((tech, index) => (
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
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {developer.githubUsername && (
          <div style={{ marginTop: '2rem' }}>
            <GitHubRepos username={developer.githubUsername} />
          </div>
        )}
      </main>
    </div>
  );
}

export default DeveloperProfile;
