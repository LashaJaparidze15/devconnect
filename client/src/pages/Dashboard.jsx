import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAvatarUrl, getProjectImageUrl } from '../utils/helpers';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>DevConnect</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          Dashboard
        </h2>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '3rem' 
        }}>
          <button
            onClick={() => navigate('/messages')}
            style={{
              padding: '1.5rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            💬 Messages
          </button>
          
          <button
            onClick={() => navigate('/developers')}
            style={{
              padding: '1.5rem',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            👥 Find Developers
          </button>
          
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '1.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📁 Browse Projects
          </button>
          
          <button
            onClick={() => navigate('/edit-profile')}
            style={{
              padding: '1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Your Profile
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <img 
              src={getAvatarUrl(user)} 
              alt="Avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {user?.username}
              </h3>
              <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>{user?.email}</p>
              {user?.lookingFor && user.lookingFor !== 'none' && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#10b981',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  color: 'white'
                }}>
                  Looking for: {user.lookingFor}
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>Bio:</strong>
            <p style={{ color: '#9ca3af' }}>
              {user?.bio || 'No bio yet'}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user?.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#374151',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#3b82f6'
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: '#9ca3af' }}>No skills added</span>
              )}
            </div>
          </div>

          {user?.githubUsername && (
            <div>
              <strong style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>GitHub:</strong>
              <a 
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'none' }}
              >
                @{user.githubUsername}
              </a>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Quick Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#374151', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>0</p>
              <p style={{ color: '#9ca3af' }}>Projects</p>
            </div>
            <div style={{ background: '#374151', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>0</p>
              <p style={{ color: '#9ca3af' }}>Connections</p>
            </div>
            <div style={{ background: '#374151', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>0</p>
              <p style={{ color: '#9ca3af' }}>Messages</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;