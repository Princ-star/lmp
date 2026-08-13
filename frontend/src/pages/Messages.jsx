import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export default function Messages({ activePartnerId, onClearActivePartner }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
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
        setConversations(data.conversations || []);
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
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error fetching message history:", err);
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  };

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

  useEffect(() => {
    if (activePartnerId) {
      fetchMessageHistory(activePartnerId);
      if (onClearActivePartner) onClearActivePartner();
    }
  }, [activePartnerId]);

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
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md h-[calc(100vh-140px)] flex overflow-hidden">
        
        {/* Left Panel: Conversations List (Visible on desktop OR on mobile when no chat is selected) */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-gray-50/50 ${
          selectedPartner ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-extrabold text-gray-900">Messagerie</h2>
            <p className="text-xs text-gray-500 mt-0.5">Vos échanges avec les propriétaires et locataires</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingConv ? (
              <div className="text-center py-8 text-gray-400 text-sm">Chargement des conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-400 text-xs">
                <div className="text-3xl mb-2"><MessageCircle className="w-8 h-8 mx-auto mb-2" /></div>
                <p className="font-semibold text-gray-700 text-sm">Aucun message</p>
                <p className="mt-1">Contactez un propriétaire depuis une annonce de location pour lancer la discussion.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.partner;
                const lastMsg = conv.last_message;
                const isSelected = selectedPartner?.id === partner.id;

                return (
                  <div
                    key={partner.id}
                    onClick={() => fetchMessageHistory(partner.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition flex items-center gap-3 border ${
                      isSelected 
                        ? 'bg-terracotta-50 border-terracotta-200 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-terracotta text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      {partner.prenom ? partner.prenom[0] : 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{partner.prenom} {partner.nom}</h4>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {new Date(lastMsg.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{lastMsg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Discussion Chat Window */}
        <div className={`flex-1 flex-col bg-white ${
          selectedPartner ? 'flex' : 'hidden md:flex'
        }`}>
          {selectedPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedPartner(null)} 
                    className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900 text-sm font-bold"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    {selectedPartner.prenom[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">{selectedPartner.prenom} {selectedPartner.nom}</h3>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> En ligne
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                {loadingMsgs ? (
                  <div className="text-center py-8 text-gray-400 text-sm">Chargement des messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    Posez vos questions directement au propriétaire !
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm ${
                          isOwn 
                            ? 'bg-terracotta text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span className={`block text-[9px] font-semibold mt-1 text-right ${
                            isOwn ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
                <input 
                  type="text" 
                  placeholder="Écrivez votre message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm border border-transparent focus:border-terracotta focus:bg-white outline-none transition"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="px-5 py-3 bg-terracotta text-white font-bold rounded-xl disabled:opacity-40 hover:bg-terracotta-600 transition shadow-sm text-sm"
                >
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">
                <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Sélectionnez une discussion</h3>
              <p className="text-sm max-w-xs mt-1">Choisissez un interlocuteur dans la liste de gauche pour afficher vos échanges.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
