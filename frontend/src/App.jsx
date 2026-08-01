import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';

function MainApp() {
  const [activeTab, setActiveTab] = useState('annonces'); // 'annonces', 'favoris', 'messages', 'profile'
  const [selectedAnnonceId, setSelectedAnnonceId] = useState(null);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const { user, loading } = useAuth();
  
  // Favorites local state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lmp_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) 
        ? prev.filter((favId) => favId !== id) 
        : [...prev, id];
      localStorage.setItem('lmp_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectAnnonce = (id) => {
    setSelectedAnnonceId(id);
  };

  const handleContactOwner = (ownerId, forceLogin = false) => {
    if (forceLogin) {
      setActiveTab('profile');
      return;
    }
    setActivePartnerId(ownerId);
    setSelectedAnnonceId(null);
    setActiveTab('messages');
  };

  const renderTabContent = () => {
    if (selectedAnnonceId) {
      return (
        <PropertyDetail 
          id={selectedAnnonceId} 
          onBack={() => setSelectedAnnonceId(null)}
          onContactOwner={handleContactOwner}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      );
    }

    switch (activeTab) {
      case 'annonces':
        return (
          <Home 
            onSelectAnnonce={handleSelectAnnonce} 
            onNavigateToPublish={() => setActiveTab('profile')}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'favoris':
        return (
          <div className="favorites-page animate-fade-in" style={{ padding: '75px 16px 20px 16px' }}>
            <h2 className="section-title">Mes Favoris</h2>
            <p className="listings-subtitle" style={{ marginBottom: '20px' }}>Retrouvez vos logements coup de cœur</p>
            {favorites.length === 0 ? (
              <div className="no-results glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <p>Vous n'avez pas encore ajouté de favoris.</p>
                <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => setActiveTab('annonces')}>Découvrir des biens</button>
              </div>
            ) : (
              <Home 
                onSelectAnnonce={handleSelectAnnonce} 
                onNavigateToPublish={() => setActiveTab('profile')}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onlyFavorites={true}
              />
            )}
          </div>
        );
      case 'messages':
        if (!user) {
          return (
            <LoginRegister 
              onAuthSuccess={() => setActiveTab('messages')}
              onBack={() => setActiveTab('annonces')}
            />
          );
        }
        return (
          <Messages 
            activePartnerId={activePartnerId} 
            onClearActivePartner={() => setActivePartnerId(null)}
          />
        );
      case 'profile':
        if (!user) {
          return (
            <LoginRegister 
              onAuthSuccess={() => setActiveTab('profile')}
              onBack={() => setActiveTab('annonces')}
            />
          );
        }
        return (
          <Dashboard onSelectAnnonce={handleSelectAnnonce} />
        );
      default:
        return <div>Onglet inconnu</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-splash">
        <div className="logo-pulse">LMP</div>
        <div className="spinner"></div>
        <style>{`
          .loading-splash {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #fbf9f6;
            gap: 20px;
          }
          .logo-pulse {
            font-family: 'Outfit', sans-serif;
            font-size: 38px;
            font-weight: 800;
            color: #d66853;
            animation: pulse-logo 1.5s infinite;
          }
          @keyframes pulse-logo {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.7; }
          }
          .spinner {
            width: 32px;
            height: 32px;
            border: 4px solid rgba(0,0,0,0.06);
            border-top-color: #d66853;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`app-container ${activeTab === 'profile' ? 'theme-proprietaire' : 'theme-locataire'}`}>
      <Navbar activeTab={activeTab} setActiveTab={(tab) => { setSelectedAnnonceId(null); setActiveTab(tab); }} />
      <main className="main-content-wrapper">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
