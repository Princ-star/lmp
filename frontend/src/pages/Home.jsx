import React, { useState, useEffect } from 'react';

export default function Home({ onSelectAnnonce, onNavigateToPublish, onNavigateToCatalogue, favorites, toggleFavorite, onlyFavorites = false }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [standingFilter, setStandingFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [greeting, setGreeting] = useState('Bonjour');

  const standings = [
    { value: 'entree_couchee', label: "Entrée couchée" },
    { value: '1ch_salon', label: "1 chambre un salon" },
    { value: '1ch_salon_douche', label: "1 ch salon couloir douche" },
    { value: '2ch_salon', label: "2 chambres salon" },
    { value: '3ch_salon', label: "3 chambres salon" },
    { value: 'villa_meuble', label: "Villa meublée" },
    { value: 'villa_non_meuble', label: "Villa non meublée" },
    { value: 'app_meuble', label: "Appartement meublé" },
    { value: 'app_non_meuble', label: "Appartement non meublé" },
    { value: 'quest_house', label: "Guest house" },
    { value: 'parcelle_location', label: "Parcelle (Location)" },
    { value: 'villa', label: "Villa (Vente)" },
    { value: 'maison', label: "Maison (Vente)" },
    { value: 'parcelle_vente', label: "Parcelle (Vente)" }
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('morning');
    } else if (hour < 18) {
      setGreeting('afternoon');
    } else {
      setGreeting('evening');
    }
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      let url = '/api/annonces/';
      const params = [];
      if (typeFilter) params.push(`type_annonce=${typeFilter}`);
      if (search) params.push(`quartier=${encodeURIComponent(search)}`);
      if (standingFilter) params.push(`standing=${standingFilter}`);
      if (maxPrice) params.push(`prix=${maxPrice}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      let data = await response.json();
      if (onlyFavorites) {
        data = data.filter((item) => favorites.includes(item.id));
      }
      setAnnonces(data);
    } catch (error) {
      console.error('Error fetching annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [typeFilter, search, standingFilter, maxPrice]);

  return (
    <div className="home-container animate-fade-in">
      
      {/* FULL-WIDTH HERO WITH BACKGROUND IMAGE & GRADIENT */}
      <section className="hero-fullwidth">
        <div className="hero-bg-image" style={{ backgroundImage: `url(/hero_bg.jpg)` }}></div>
        <div className="hero-gradient-overlay"></div>
        
        <div className="hero-content">
          <span className="welcome-tag-glass">
            {greeting === 'morning' && (
              <>Bonjour <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></>
            )}
            {greeting === 'afternoon' && (
              <>Bon après-midi <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a5.5 5.5 0 0 1 1 10.9Z"/></svg></>
            )}
            {greeting === 'evening' && (
              <>Bonsoir <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></>
            )}
            , bienvenue sur LMP
          </span>

          <h1 className="hero-title-bold">
            Trouvez votre prochain
            <br />
            <span className="chez-vous-highlight">CHEZ VOUS</span>
          </h1>

          <p className="hero-desc">
            La plateforme numéro 1 pour trouver un logement vérifié et contacter directement le propriétaire au Bénin.
          </p>

          <div className="search-bar-glass">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Ex: Cadjehoun, Calavi, Akpakpa..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-glass"
            />
          </div>

          {/* Centered CTA Buttons */}
          <div className="hero-cta-group">
            {/* Colored CTA Button */}
            <button className="cta-btn-colored" onClick={onNavigateToCatalogue}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Explorer le catalogue
            </button>

            {/* Transparent Liquid Glass CTA Button */}
            <button className="cta-btn-liquid-glass" onClick={onNavigateToPublish}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Publier une annonce
            </button>
          </div>

          {/* Floating Trust Pill */}
          <div className="trust-pill-glass">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#009e96" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Plus de 3 500 logements certifiés & vérifiés sur le terrain
          </div>
        </div>
      </section>

      {/* Trust & Step-by-Step interactive guide */}
      <section className="steps-section glass-panel">
        <h3 className="section-title-centered">Louer en toute confiance en 3 étapes</h3>
        <div className="steps-grid">
          <div className="step-card glass-panel">
            <div className="step-num">1</div>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <h4>Recherchez</h4>
            <p>Filtrez selon vos préférences de prix, quartier et standing.</p>
          </div>
          <div className="step-card glass-panel">
            <div className="step-num">2</div>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h4>Discutez</h4>
            <p>Échangez directement via la messagerie avec les propriétaires.</p>
          </div>
          <div className="step-card glass-panel">
            <div className="step-num">3</div>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h4>Visitez & Emménagez</h4>
            <p>Planifiez une visite physique et récupérez les clés de votre nouveau chez vous.</p>
          </div>
        </div>
      </section>

      {/* Stats ticker banner */}
      <div className="stats-ticker-banner glass-panel">
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="#f39c12" stroke="#f39c12" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <strong>4.9/5</strong> d'avis positifs
        </div>
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><path d="M9 16h6v6"/>
          </svg>
          <strong>+150</strong> biens ajoutés cette semaine
        </div>
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5"/>
          </svg>
          <strong>3 200+</strong> remises de clés réussies
        </div>
      </div>

      {/* Content listings grid (Featured 6 max) */}
      <section className="listings-section">
        <div className="listings-section-header">
          <div>
            <h2 className="section-title">Logements à la une</h2>
            <p className="listings-subtitle">Sélection des meilleures offres de la semaine à Cotonou et Calavi</p>
          </div>
          <button className="view-all-catalogue-btn" onClick={onNavigateToCatalogue}>
            Voir tout le catalogue ({annonces.length}) →
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Recherche des logements en cours...</p>
          </div>
        ) : annonces.length === 0 ? (
          <div className="no-results glass-panel">
            <p>Aucun logement trouvé avec ces critères.</p>
            <button className="btn-primary" onClick={() => { setTypeFilter(''); setStandingFilter(''); setMaxPrice(''); setSearch(''); }}>
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {annonces.slice(0, 6).map((annonce) => {
              const isFav = favorites.includes(annonce.id);
              return (
                <div 
                  key={annonce.id} 
                  className="annonce-card glass-panel animate-card"
                  onClick={() => onSelectAnnonce(annonce.id)}
                >
                  <div className="card-image-wrapper">
                    {annonce.photo_principale ? (
                      <img src={annonce.photo_principale} alt={annonce.titre} className="card-img" />
                    ) : (
                      <div className="card-img-placeholder">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        </svg>
                      </div>
                    )}
                    <span className={`badge-type ${annonce.type_annonce}`}>
                      {annonce.type_annonce === 'location' ? 'Location' : 'Vente'}
                    </span>
                    <button 
                      className={`fav-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(annonce.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? '#d66853' : 'none'} stroke={isFav ? '#d66853' : 'white'} strokeWidth="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="card-content">
                    <div className="card-location">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {annonce.quartier || 'Cotonou'}
                    </div>

                    <h3 className="card-title">{annonce.titre}</h3>

                    <div className="card-tags">
                      <span className="tag-standing">{annonce.get_standing_display || annonce.standing}</span>
                    </div>

                    <div className="card-footer">
                      <div className="card-price">
                        {Number(annonce.prix).toLocaleString('fr-FR')} FCFA
                        {annonce.type_annonce === 'location' && <span className="price-freq">/mois</span>}
                      </div>
                      <span className="card-link">Voir →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Big Bottom Catalogue CTA */}
        {annonces.length > 6 && (
          <div className="catalogue-bottom-cta">
            <button className="cta-btn-colored large" onClick={onNavigateToCatalogue}>
              Accéder à la totalité du catalogue ({annonces.length} logements) →
            </button>
          </div>
        )}
      </section>

      {/* Owner Banner (Tunnel conversion pour propriétaires) */}
      <section className="owner-conversion-banner">
        <div className="owner-banner-content">
          <span className="owner-tag">Propriétaires & Bailleurs</span>
          <h2>Vous possédez une maison ou un appartement à louer ?</h2>
          <p>Publiez gratuitement votre annonce en moins de 3 minutes et touchez des milliers de locataires qualifiés au Bénin.</p>
          <button className="cta-btn-colored owner-btn" onClick={onNavigateToPublish}>
            Publier mon bien gratuitement →
          </button>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-bottom: 40px;
        }

        /* HERO FULL WIDTH WITH IMAGE & OVERLAY */
        .hero-fullwidth {
          position: relative;
          min-height: 520px;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 60px 40px;
          margin-top: 10px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
        }

        .hero-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          transition: transform 10s ease;
        }

        .hero-fullwidth:hover .hero-bg-image {
          transform: scale(1.03);
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right, 
            rgba(15, 12, 9, 0.92) 0%, 
            rgba(15, 12, 9, 0.78) 45%, 
            rgba(15, 12, 9, 0.35) 75%, 
            rgba(15, 12, 9, 0.1) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .welcome-tag-glass {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.95);
          font-size: 13px;
          font-weight: 600;
          align-self: flex-start;
        }

        .hero-title-bold {
          font-family: 'Outfit', sans-serif;
          font-size: 42px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .chez-vous-highlight {
          font-size: 58px;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ff7e67 0%, #d66853 50%, #ffa07a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 20px rgba(214,104,83,0.3);
        }

        .hero-desc {
          color: rgba(255, 255, 255, 0.85);
          font-size: 16px;
          line-height: 1.6;
          max-width: 540px;
        }

        .search-bar-glass {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.7);
        }

        .search-input-glass {
          width: 100%;
          padding: 14px 20px 14px 48px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s ease;
        }

        .search-input-glass::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .search-input-glass:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: #d66853;
          box-shadow: 0 0 0 4px rgba(214, 104, 83, 0.25);
        }

        /* HERO CTA BUTTONS */
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .cta-btn-colored {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #d66853 0%, #b84c38 100%);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(214, 104, 83, 0.4);
          transition: all 0.25s ease;
        }

        .cta-btn-colored:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(214, 104, 83, 0.55);
          background: linear-gradient(135deg, #e5735e 0%, #c4533e 100%);
        }

        /* LIQUID GLASS TRANSPARENT BUTTON */
        .cta-btn-liquid-glass {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-btn-liquid-glass::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-btn-liquid-glass:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.22);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3), inset 0 1px 2px 0 rgba(255, 255, 255, 0.6);
        }

        .cta-btn-liquid-glass:hover::before {
          opacity: 1;
        }

        .trust-pill-glass {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          margin-top: 4px;
        }

        /* STEPS SECTION */
        .steps-section {
          padding: 32px 24px;
          border-radius: 20px;
        }

        .section-title-centered {
          text-align: center;
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .step-card {
          padding: 24px;
          border-radius: 16px;
          position: relative;
          text-align: center;
        }

        .step-num {
          position: absolute;
          top: 12px;
          left: 16px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(214,104,83,0.12);
          color: #d66853;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-icon {
          margin-bottom: 12px;
        }

        .step-card h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
        }

        .step-card p {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }

        /* STATS TICKER */
        .stats-ticker-banner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 16px 24px;
          border-radius: 16px;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #4b5563;
        }

        /* LISTINGS SECTION */
        .listings-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .listings-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #111827;
        }

        .listings-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 2px;
        }

        .view-all-catalogue-btn {
          background: none;
          border: none;
          color: #d66853;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .view-all-catalogue-btn:hover {
          transform: translateX(4px);
        }

        .listings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .catalogue-bottom-cta {
          text-align: center;
          margin-top: 20px;
        }

        .cta-btn-colored.large {
          padding: 16px 36px;
          font-size: 16px;
          border-radius: 16px;
        }

        /* OWNER CONVERSION BANNER */
        .owner-conversion-banner {
          border-radius: 24px;
          background: linear-gradient(135deg, #0d2826 0%, #153c39 100%);
          padding: 48px 36px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,158,150,0.15);
        }

        .owner-conversion-banner::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,158,150,0.25) 0%, transparent 70%);
        }

        .owner-banner-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .owner-tag {
          display: inline-block;
          background: rgba(0,158,150,0.2);
          color: #009e96;
          border: 1px solid rgba(0,158,150,0.4);
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }

        .owner-banner-content h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .owner-banner-content p {
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .owner-btn {
          background: linear-gradient(135deg, #009e96 0%, #007a74 100%) !important;
          box-shadow: 0 8px 24px rgba(0,158,150,0.4) !important;
        }

        .owner-btn:hover {
          background: linear-gradient(135deg, #02b3aa 0%, #008f88 100%) !important;
        }

        @media (min-width: 640px) {
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .listings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hero-fullwidth {
            min-height: 580px;
            padding: 80px 60px;
          }
          .listings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
