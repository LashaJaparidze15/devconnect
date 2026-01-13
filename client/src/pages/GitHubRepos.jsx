import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function GitHubRepos({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchRepos();
    }
  }, [username]);

  const fetchRepos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/github/repos/${username}`);
      setRepos(res.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!username) return null;

  if (loading) {
    return (
      <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          GitHub Repositories
        </h2>
        <p style={{ color: '#9ca3af' }}>Loading repositories...</p>
      </div>
    );
  }

  if (repos.length === 0) return null;

  return (
    <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        GitHub Repositories
      </h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#374151',
              padding: '1rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#3b82f6' }}>
                {repo.name}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                <span>⭐ {repo.stargazers_count}</span>
                <span>🔱 {repo.forks_count}</span>
              </div>
            </div>
            <p style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
              {repo.description || 'No description'}
            </p>
            {repo.language && (
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: '#1f2937',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                color: '#10b981'
              }}>
                {repo.language}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default GitHubRepos;
