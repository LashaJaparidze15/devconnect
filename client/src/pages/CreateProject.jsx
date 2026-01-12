import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    lookingForCollaborators: false,
    image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const techStackArray = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');

      await axios.post('http://localhost:5000/api/projects/create', {
        title: formData.title,
        description: formData.description,
        techStack: techStackArray,
        githubLink: formData.githubLink,
        liveLink: formData.liveLink,
        lookingForCollaborators: formData.lookingForCollaborators,
        image: formData.image
      });

      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

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

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Create New Project
        </h2>

        {error && (
          <div style={{ background: '#dc2626', color: 'white', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="My Awesome Project"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe your project, its purpose, and key features..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              GitHub Repository Link
            </label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              Live Demo Link
            </label>
            <input
              type="url"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleChange}
              placeholder="https://myproject.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '600' }}>
              Project Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/project-image.jpg"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.25rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="lookingForCollaborators"
                checked={formData.lookingForCollaborators}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: '#d1d5db' }}>Looking for collaborators</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateProject;