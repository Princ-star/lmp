import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Messages({ activePartnerId, onClearActivePartner }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null); // partner details
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoadingConv(true);
      const response = await fetch('/api/messages/');
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      if (!silent) setLoadingConv(false);
    }
  };

  const fetchMessageHistory = async (partnerId, silent = false) => {
    try {
      if (!silent) setLoadingMsgs(true);
      const response = await fetch(`/api/messages/history/${partnerId}/`);
      const data = await response.json();
      if (response.ok) {
        setSelectedPartner(data.partner);
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching message history:", err);
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  };

  // Poll for messages in active chat
  useEffect(() => {
    fetchConversations();
    
    const interval = setInterval(() => {
      fetchConversations(true);
      if (selectedPartner) {
        fetchMessageHistory(selectedPartner.id, true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedPartner]);

  // Initial redirect if parameter activePartnerId is passed (e.g. from PropertyDetail)
  useEffect(() => {
    if (activePartnerId) {
      fetchMessageHistory(activePartnerId);
      onClearActivePartner(); // Reset parameter
    }
  }, [activePartnerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;

    try {
      const response = await fetch('/api/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: selectedPartner.id,
          content: newMessage
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data]);
        setNewMessage('');
        fetchConversations(true);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="messages-page-container animate-fade-in">
      {selectedPartner ? (
        /* Active Chat View */
        <div className="chat-window-view glass-panel">
          <div className="chat-header">
            <button className="back-chat-btn" onClick={() => setSelectedPartner(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 19-7-7 7-7"/>
              </svg>
            </button>
            <div className="chat-partner-info">
              <div className="partner-avatar">
                {selectedPartner.prenom[0]}
              </div>
              <div className="partner-meta">
                <h4>{selectedPartner.prenom} {selectedPartner.nom}</h4>
                <div className="status-online">
                  <span className="pulse-dot"></span>
                  <span>En ligne</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-messages-area">
            {loadingMsgs ? (
              <div className="loading-chat-overlay">
                <div className="spinner"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-chat">
                <p>Aucun message. Envoyez le premier message !</p>
              </div>
            ) : (
              <div className="chat-bubble-list">
                <div className="chat-date-separator">
                  <span>Aujourd'hui</span>
                </div>
                
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={`chat-bubble-row ${isOwn ? 'own' : 'partner'}`}>
                      <div className="bubble-content">
                        <p>{msg.content}</p>
                        <span className="bubble-time">
                          {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-bar glass-panel">
            <button type="button" className="attachment-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Écrivez votre message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="chat-message-input"
            />
            <button type="submit" className="send-btn-circle" disabled={!newMessage.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        /* Conversation List View */
        <div className="conversations-list-view glass-panel">
          <div className="conv-header">
            <h3>Messages</h3>
            <button className="icon-action-btn glass-panel">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>

          {loadingConv ? (
            <div className="spinner-wrapper">
              <div className="spinner"></div>
              <span>Chargement des messages...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="no-conversations">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>Aucune conversation en cours.</p>
              <span className="sub">Visitez une annonce et contactez le propriétaire pour démarrer une discussion.</span>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => {
                const partner = conv.partner;
                const lastMsg = conv.last_message;
                const hasUnread = !lastMsg.est_lu && lastMsg.sender_id !== user.id;

                return (
                  <div 
                    key={partner.id} 
                    className={`conversation-card glass-panel glass-panel-hover ${hasUnread ? 'unread' : ''}`}
                    onClick={() => fetchMessageHistory(partner.id)}
                  >
                    <div className="partner-avatar">
                      {partner.prenom[0]}
                    </div>
                    <div className="conv-details">
                      <div className="conv-meta-row">
                        <h4>{partner.prenom} {partner.nom}</h4>
                        <span className="conv-time">
                          {new Date(lastMsg.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="conv-msg-row">
                        <p className="conv-snippet">{lastMsg.content}</p>
                        {hasUnread && <span className="unread-dot"></span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        .messages-page-container {
          padding: 75px 16px 20px 16px;
        }

        .conversations-list-view {
          padding: 20px;
        }

        .conv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .conversations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .conversation-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.4);
        }

        .conversation-card.unread {
          background: rgba(214, 104, 83, 0.05);
          border-color: rgba(214, 104, 83, 0.15);
        }

        .conv-details {
          flex: 1;
        }

        .conv-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .conv-meta-row h4 {
          font-size: 15px;
          color: var(--text-dark);
        }

        .conv-time {
          font-size: 11px;
          color: var(--text-gray);
          font-weight: 600;
        }

        .conv-msg-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .conv-snippet {
          font-size: 12px;
          color: var(--text-gray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        .no-conversations {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 20px;
          gap: 14px;
          color: var(--text-gray);
        }

        .no-conversations p {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark);
        }

        .no-conversations .sub {
          font-size: 12px;
          line-height: 1.5;
        }

        /* Active Chat Window */
        .chat-window-view {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 170px);
          overflow: hidden;
          padding: 0;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: rgba(255, 255, 255, 0.35);
        }

        .back-chat-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .chat-partner-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .partner-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
        }

        .partner-meta h4 {
          font-size: 14px;
        }

        .status-online {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--secondary);
          font-weight: 700;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--secondary);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0.9); opacity: 1; }
        }

        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: rgba(245, 240, 235, 0.2);
          position: relative;
        }

        .chat-date-separator {
          text-align: center;
          margin: 10px 0 20px 0;
          position: relative;
        }

        .chat-date-separator::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          z-index: 1;
        }

        .chat-date-separator span {
          background: #fdfcfb;
          padding: 4px 10px;
          font-size: 11px;
          color: var(--text-gray);
          font-weight: 600;
          border-radius: 20px;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .chat-bubble-row {
          display: flex;
          margin-bottom: 12px;
        }

        .chat-bubble-row.own {
          justify-content: flex-end;
        }

        .bubble-content {
          max-width: 75%;
          padding: 12px 14px;
          border-radius: 16px;
          position: relative;
        }

        .chat-bubble-row.own .bubble-content {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(214, 104, 83, 0.15);
        }

        .chat-bubble-row.partner .bubble-content {
          background: white;
          color: var(--text-dark);
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .bubble-content p {
          font-size: 14px;
          line-height: 1.4;
        }

        .bubble-time {
          display: block;
          text-align: right;
          font-size: 9px;
          margin-top: 4px;
          opacity: 0.7;
          font-weight: 600;
        }

        .chat-input-bar {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-top: 1px solid rgba(0,0,0,0.06);
          background: white;
          border-radius: 0;
          gap: 10px;
        }

        .attachment-btn {
          background: transparent;
          border: none;
          color: var(--text-gray);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
        }

        .attachment-btn:hover {
          background: rgba(0,0,0,0.02);
        }

        .chat-message-input {
          flex: 1;
          border: none;
          background: rgba(240, 235, 230, 0.4);
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
          outline: none;
        }

        .send-btn-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-btn-circle:disabled {
          background: var(--text-gray);
          opacity: 0.3;
          cursor: not-allowed;
        }

        .loading-chat-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        /* Desktop Queries */
        @media (min-width: 768px) {
          .messages-page-container {
            max-width: 1000px;
            margin: 0 auto;
            padding-top: 30px;
          }
          /* Side by side chat layout on Desktop */
          .messages-page-container {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
          }
          .conversations-list-view {
            grid-column: 1;
            height: calc(100vh - 120px);
          }
          .chat-window-view {
            grid-column: 2;
            height: calc(100vh - 120px);
          }
          /* Hide back button on desktop since list is visible */
          .back-chat-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
