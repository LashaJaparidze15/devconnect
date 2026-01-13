import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { initializeSocket, getSocket } from '../socket/socket';
import axios from 'axios';
import { getAvatarUrl } from '../utils/helpers';
import { API_URL } from '../config';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId: urlUserId } = useParams();
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (user) {
      socket.current = initializeSocket(user.id);
      fetchConversations();

      // Listen for incoming messages
      socket.current.on('receiveMessage', (message) => {
        if (selectedUser && (message.sender._id === selectedUser._id || message.recipient._id === selectedUser._id)) {
          setMessages(prev => [...prev, message]);
        }
        fetchConversations(); // Update conversation list
      });

      // Listen for typing indicator
      socket.current.on('userTyping', ({ userId, isTyping }) => {
        if (selectedUser && userId === selectedUser._id) {
          setIsTyping(isTyping);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.off('userTyping');
      }
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (urlUserId) {
      selectUserById(urlUserId);
    }
  }, [urlUserId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/conversations`);
      setConversations(res.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectUserById = async (userId) => {
    try {
      const userRes = await axios.get(`${API_URL}/api/users/${userId}`);
      selectUser(userRes.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/messages/${user._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    try {
      const res = await axios.post(`${API_URL}/api/messages/send`, {
        recipientId: selectedUser._id,
        content: messageText
      });

      setMessages([...messages, res.data]);
      setMessageText('');

      // Emit socket event
      socket.current.emit('sendMessage', {
        recipientId: selectedUser._id,
        message: res.data
      });

      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (selectedUser && socket.current) {
      socket.current.emit('typing', {
        senderId: user.id,
        recipientId: selectedUser._id,
        isTyping: e.target.value.length > 0
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white' }}>
      <nav style={{ background: '#1f2937', padding: '1rem' }}>
        <div style={{ 
          maxWidth: '1400px', 
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

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Messages</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <div style={{ background: '#1f2937', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #374151' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Conversations</h3>
            </div>
            <div style={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.user._id}
                    onClick={() => selectUser(conv.user)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #374151',
                      cursor: 'pointer',
                      background: selectedUser?._id === conv.user._id ? '#374151' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                    onMouseOut={(e) => e.currentTarget.style.background = selectedUser?._id === conv.user._id ? '#374151' : 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={getAvatarUrl(user)} 
                        alt={conv.user.username}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{conv.user.username}</p>
                          {conv.unreadCount > 0 && (
                            <span style={{
                              background: '#3b82f6',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p style={{ 
                          color: '#9ca3af', 
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ background: '#1f2937', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <img 
                    src={getAvatarUrl(user)} 
                    alt={selectedUser.username}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                  <div>
                    <p style={{ fontWeight: '600' }}>{selectedUser.username}</p>
                    {isTyping && <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>typing...</p>}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg) => {
                    const isOwn = msg.sender._id === user.id;
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: 'flex',
                          justifyContent: isOwn ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          background: isOwn ? '#3b82f6' : '#374151',
                          color: 'white'
                        }}>
                          <p>{msg.content}</p>
                          <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: '0.25rem' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid #374151', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={messageText}
                    onChange={handleTyping}
                    placeholder="Type a message..."
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
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Messages;
