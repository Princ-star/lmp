import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const tabs = [
    {
      id: 'annonces',
      label: 'Accueil',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'catalogue',
      label: 'Catalogue',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      )
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      id: 'favoris',
      label: 'Favoris',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header glass-panel">
        <div className="logo-brand" onClick={() => setActiveTab('annonces')}>
          {/* Abstract Trajectory SVG Logo */}
          <svg viewBox="0 0 40 40" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 32 L20 6 L34 32" stroke="#d66853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 23 L28 23" stroke="#009e96" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="6" r="2.5" fill="#d66853"/>
          </svg>
          <span className="logo-text">LMP</span>
        </div>
        {user ? (
          <div className="header-user-badge" onClick={() => setActiveTab('profile')}>
            <div className="avatar-circle">
              {user.prenom[0]}
            </div>
            <span>{user.prenom}</span>
          </div>
        ) : (
          <button className="login-btn-header" onClick={() => setActiveTab('profile')}>Connexion</button>
        )}
      </header>

      {/* Desktop Header */}
      <header className="desktop-header glass-panel">
        <div className="logo-brand" onClick={() => setActiveTab('annonces')}>
          <svg viewBox="0 0 40 40" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 32 L20 6 L34 32" stroke="#d66853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 23 L28 23" stroke="#009e96" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="6" r="2.5" fill="#d66853"/>
          </svg>
          <span className="logo-text">LMP</span>
        </div>

        <nav className="desktop-nav-links">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-link-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-profile-badge">
              <span className="user-name" onClick={() => setActiveTab('profile')}>{user.prenom} {user.nom}</span>
              <button className="logout-btn-desktop" onClick={logout}>Déconnexion</button>
            </div>
          ) : (
            <button className="btn-primary login-btn-desktop" onClick={() => setActiveTab('profile')}>Se connecter</button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav glass-panel">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="icon-wrapper">{tab.icon}</div>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          height: var(--header-height);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          border-radius: 0 0 16px 16px;
          border-top: none;
          max-width: 480px;
          margin: 0 auto;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.5px;
        }

        .header-user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #d66853;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 14px;
        }

        .login-btn-header {
          background: #d66853;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .desktop-header {
          display: none;
        }

        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          z-index: 100;
          border-radius: 16px 16px 0 0;
          border-bottom: none;
          padding: 8px 12px;
          max-width: 480px;
          margin: 0 auto;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          flex: 1;
          gap: 4px;
          transition: color 0.2s ease;
        }

        .bottom-nav-item.active {
          color: #d66853;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-label {
          font-size: 10px;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .mobile-header, .bottom-nav {
            display: none;
          }
          .desktop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 40px;
            position: sticky;
            top: 0;
            z-index: 100;
            border-radius: 0;
            border-left: none;
            border-right: none;
            border-top: none;
            max-width: 100%;
          }
          .desktop-nav-links {
            display: flex;
            gap: 24px;
          }
          .nav-link-btn {
            background: transparent;
            border: none;
            color: #4b5563;
            font-size: 15px;
            font-weight: 600;
            font-family: 'Outfit', sans-serif;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 10px;
            transition: all 0.2s ease;
          }
          .nav-link-btn:hover {
            color: #d66853;
            background: rgba(0,0,0,0.03);
          }
          .nav-link-btn.active {
            color: #d66853;
            background: rgba(214, 104, 83, 0.1);
          }
          .user-profile-badge {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .user-name {
            font-weight: 600;
            cursor: pointer;
          }
          .logout-btn-desktop {
            background: transparent;
            border: 1px solid rgba(0,0,0,0.12);
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 600;
          }
          .logout-btn-desktop:hover {
            background: rgba(0,0,0,0.04);
          }
          .login-btn-desktop {
            padding: 10px 24px;
            font-size: 14px;
            border-radius: 12px;
          }
        }
      `}</style>
    </>
  );
}
