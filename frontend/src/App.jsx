import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import PropertyDetail from './pages/PropertyDetail';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import InfoPages from './pages/InfoPages';
import { ToastNotification, ConfirmationModal } from './components/ToastModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('annonces'); // 'annonces', 'catalogue', 'favoris', 'messages', 'profile'
  const [selectedAnnonceId, setSelectedAnnonceId] = useState(null);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [infoPage, setInfoPage] = useState(null); // 'cgu', 'confidentialite', 'contact', 'a-propos'
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Confirmation modal state
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const { user, loading } = useAuth();
  
  // Favorites local state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lmp_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const openToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) 
        ? prev.filter((favId) => favId !== id) 
        : [...prev, id];
      localStorage.setItem('lmp_favorites', JSON.stringify(updated));
      return updated;
    });
    openToast("Vos favoris ont été mis à jour !", "success");
  };

  const handleSelectAnnonce = (id) => {
    setInfoPage(null);
    setSelectedAnnonceId(id);
  };

  const handleContactOwner = (ownerId, forceLogin = false) => {
    if (forceLogin) {
      setInfoPage(null);
      setSelectedAnnonceId(null);
      setActiveTab('profile');
      return;
    }
    setActivePartnerId(ownerId);
    setSelectedAnnonceId(null);
    setInfoPage(null);
    setActiveTab('messages');
  };

  const navigateToTab = (tab) => {
    setSelectedAnnonceId(null);
    setInfoPage(null);
    setActiveTab(tab);
  };

  const handleOpenInfoPage = (pageName) => {
    setSelectedAnnonceId(null);
    setInfoPage(pageName);
  };

  const renderTabContent = () => {
    // If an info page is open (e.g. CGU, Contact)
    if (infoPage) {
      return (
        <InfoPages 
          pageType={infoPage} 
          onBack={() => setInfoPage(null)} 
          onNavigateToTab={navigateToTab}
        />
      );
    }

    // If an annonce detail is selected
    if (selectedAnnonceId) {
      return (
        <PropertyDetail 
          id={selectedAnnonceId} 
          onBack={() => setSelectedAnnonceId(null)}
          onContactOwner={handleContactOwner}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          openToast={openToast}
        />
      );
    }

    switch (activeTab) {
      case 'annonces':
      case 'accueil':
        return (
          <Home 
            onSelectAnnonce={handleSelectAnnonce} 
            onNavigateToPublish={() => navigateToTab('profile')}
            onNavigateToCatalogue={() => navigateToTab('catalogue')}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'catalogue':
        return (
          <Catalogue 
            onSelectAnnonce={handleSelectAnnonce}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'favoris':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Mes Logements Favoris</h2>
            <p className="text-sm text-gray-500 mb-6">Retrouvez les annonces que vous avez enregistrées</p>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <p className="text-gray-500 text-sm">Vous n'avez pas encore de logement dans vos favoris.</p>
                <button 
                  onClick={() => navigateToTab('catalogue')} 
                  className="px-6 py-3 bg-terracotta text-white font-bold rounded-xl text-sm shadow hover:bg-terracotta-600 transition"
                >
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              <Catalogue 
                onSelectAnnonce={handleSelectAnnonce}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}
          </div>
        );
      case 'messages':
        if (!user) {
          return (
            <LoginRegister 
              onAuthSuccess={(u) => navigateToTab(u?.type_utilisateur === 'proprietaire' ? 'profile' : 'messages')}
              onBack={() => navigateToTab('annonces')}
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
              onAuthSuccess={() => navigateToTab('profile')}
              onBack={() => navigateToTab('annonces')}
            />
          );
        }
        return (
          <Dashboard 
            onSelectAnnonce={handleSelectAnnonce} 
            openToast={openToast}
          />
        );
      default:
        return (
          <Home 
            onSelectAnnonce={handleSelectAnnonce} 
            onNavigateToPublish={() => navigateToTab('profile')}
            onNavigateToCatalogue={() => navigateToTab('catalogue')}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-3xl font-black text-terracotta animate-pulse">LMP</div>
        <div className="w-8 h-8 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900">
      <Navbar 
        activeTab={activeTab === 'accueil' ? 'annonces' : activeTab} 
        setActiveTab={navigateToTab} 
      />

      <main className="flex-1">
        {renderTabContent()}
      </main>

      <Footer 
        setActiveTab={navigateToTab} 
        onOpenInfoPage={handleOpenInfoPage}
      />

      {/* Global Toast Notification */}
      <ToastNotification 
        toast={toast} 
        onClose={() => setToast({ show: false, message: '', type: 'success' })} 
      />

      {/* Global Confirmation Modal */}
      <ConfirmationModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
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
