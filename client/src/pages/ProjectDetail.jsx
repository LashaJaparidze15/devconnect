import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { getAvatarUrl, getProjectImageUrl } from '../utils/helpers';

function ProjectDetail() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      setError('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
        navigate('/projects');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const isOwner = user && project && project.owner._id === user.id;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontSize: '1.25rem' }}>Loading...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1rem' }}>{error || 'Project not found'}</p>
          <button
            onClick={() => navigate('/projects')}
            style={{
              background: '#3b82f6',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Back to Projects
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
              onClick={() => navigate('/projects')}
              style={{
                background: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Back to Projects
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
        <img 
          src={getProjectImageUrl(project)}
          alt={project.title}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '2rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {project.title}
            </h1>
            {project.lookingForCollaborators && (
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: '#10b981',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                🚀 Looking for Collaborators
              </span>
            )}
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate(`/edit-project/${projectId}`)}
                style={{
                  background: '#3b82f6',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: '#dc2626',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Description</h2>
              <p style={{ color: '#d1d5db', lineHeight: '1.75' }}>{project.description}</p>
            </div>

            <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tech Stack</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.techStack?.length > 0 ? (
                  project.techStack.map((tech, index) => (
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
                      {tech}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#9ca3af' }}>No tech stack specified</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Project Owner</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img 
                  src={getAvatarUrl(user)} 
                  alt={project.owner.username}
                  style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                />
                <div>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{project.owner.username}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{project.owner.email}</p>
                </div>
              </div>
              {project.owner.githubUsername && (
                <a 
                  href={`https://github.com/${project.owner.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-block',
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  @{project.owner.githubUsername} →
                </a>
              )}
            </div>

            {(project.githubLink || project.liveLink) && (
              <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Links</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {project.githubLink && (
                    <a 
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        padding: '0.75rem',
                        background: '#374151',
                        borderRadius: '0.25rem',
                        color: 'white',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.liveLink && (
                    <a 
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        padding: '0.75rem',
                        background: '#10b981',
                        borderRadius: '0.25rem',
                        color: 'white',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      View Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetail;