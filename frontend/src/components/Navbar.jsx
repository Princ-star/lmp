import React from 'react';
import { useAuth } from '../context/AuthContext';

/* ────────────────────────────────────────────────────── *
 *  Inline SVG icons – one for each tab                   *
 * ────────────────────────────────────────────────────── */
const icons = {
  annonces: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  catalogue: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
    </svg>
  ),
  favoris: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

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
    <>
      {/* ─── TOP HEADER (visible always, sticky) ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
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
                  {user.prenom?.[0]}
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
      </header>

      {/* ─── MOBILE BOTTOM TAB BAR (md:hidden) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center h-16 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const accent = isActive
              ? (isProprietaire ? 'text-emerald-600' : 'text-terracotta')
              : 'text-gray-400';

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${accent}`}
              >
                {/* Icon – fill when active */}
                <span className={isActive ? 'drop-shadow-sm' : 'opacity-70'}>
                  {icons[tab.id]}
                </span>
                <span className={`text-[10px] leading-tight ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                  {tab.label}
                </span>
                {/* Active dot indicator */}
                {isActive && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${isProprietaire ? 'bg-emerald-600' : 'bg-terracotta'}`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
