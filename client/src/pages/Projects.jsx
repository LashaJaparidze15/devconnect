import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { getAvatarUrl, getProjectImageUrl } from '../utils/helpers';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, collaborators
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'collaborators' 
    ? projects.filter(p => p.lookingForCollaborators)
    : projects;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Projects</h2>
          <button
            onClick={() => navigate('/create-project')}
            style={{
              background: '#10b981',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.25rem',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            + Create Project
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              background: filter === 'all' ? '#3b82f6' : '#374151',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('collaborators')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              background: filter === 'collaborators' ? '#3b82f6' : '#374151',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Looking for Collaborators
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1f2937', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>No projects found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredProjects.map((project) => (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{project.title}</h3>
                    {project.lookingForCollaborators && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#10b981',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap'
                      }}>
                        Looking for collaborators
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    color: '#9ca3af', 
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {project.techStack?.slice(0, 4).map((tech, index) => (
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
                    {project.techStack?.length > 4 && (
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #374151' }}>
                    <img 
                      src={getAvatarUrl(user)} 
                      alt={project.owner?.username}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      by {project.owner?.username}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;