import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const isProprietaire = user?.type_utilisateur === 'proprietaire' || user?.is_admin;

  const tabs = [
    { id: 'annonces', label: 'Accueil' },
    { id: 'catalogue', label: 'Catalogue' },
    { id: 'messages', label: 'Messages' },
    { id: 'favoris', label: 'Favoris' },
    { id: 'profile', label: 'Profil' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Abstract SVG Logo */}
        <div 
          onClick={() => setActiveTab('annonces')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <svg viewBox="0 0 40 40" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 32 L20 6 L34 32" stroke="#d66853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 23 L28 23" stroke="#009e96" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="6" r="2.5" fill="#d66853"/>
          </svg>
          <span className="font-black text-2xl tracking-tight text-gray-900 group-hover:text-terracotta transition">
            LMP
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  isActive 
                    ? isProprietaire 
                      ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                      : 'bg-terracotta-50 text-terracotta-700 font-extrabold' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-terracotta transition"
              >
                <div className={`w-8 h-8 rounded-full font-bold text-white flex items-center justify-center text-xs shadow-sm ${
                  isProprietaire ? 'bg-emerald-600' : 'bg-terracotta'
                }`}>
                  {user.prenom[0]}
                </div>
                <span className="hidden sm:inline">{user.prenom}</span>
              </button>
              <button 
                onClick={logout} 
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('profile')}
              className="px-5 py-2.5 bg-terracotta hover:bg-terracotta-600 text-white font-bold rounded-xl shadow-sm text-sm transition"
            >
              Se connecter
            </button>
          )}
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition ${
                isActive ? 'text-terracotta' : 'text-gray-500'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
