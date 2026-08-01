import React, { useState, useEffect } from 'react';

export default function Home({ onSelectAnnonce, onNavigateToPublish, favorites, toggleFavorite, onlyFavorites = false }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // 'vente', 'location', ''
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

  // Dynamic greetings based on time
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
      
      {/* Moving gradient premium Hero header */}
      <section className="hero-section glass-panel">
        <div className="hero-gradient-overlay"></div>
        
        {/* Split layout: left text, right image */}
        <div className="hero-split">
          <div className="hero-text-col">
            <span className="welcome-tag">
              {greeting === 'morning' && (
                <>Bonjour <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></>
              )}
              {greeting === 'afternoon' && (
                <>Bon après-midi <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a5.5 5.5 0 0 1 1 10.9Z"/></svg></>
              )}
              {greeting === 'evening' && (
                <>Bonsoir <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></>
              )}
              , bienvenue chez LMP
            </span>

            <h1 className="hero-title">
              Trouvez votre prochain
              <br />
              <span className="highlight-text">CHEZ VOUS</span>
            </h1>
            <p className="hero-subtitle">Explorez les logements disponibles en quelques clics et contactez directement les propriétaires.</p>
            
            <div className="search-bar-wrapper">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                type="text" 
                placeholder="Dans quel quartier ? (Ex: Bidossessi, Fidjrossè...)" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="hero-actions">
              <button className="btn-glass-primary search-cta" onClick={() => setTypeFilter(typeFilter === 'location' ? '' : 'location')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Trouver ma chambre
              </button>
              <button className="btn-glass-outline publish-btn" onClick={onNavigateToPublish}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Publier une annonce
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image-col">
            <div className="hero-image-wrapper">
              <img src="/house_transition.png" alt="Propriétaire remettant les clés à un locataire" className="hero-img" />
              <div className="hero-img-glass-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>+3 500 logements vérifiés</span>
              </div>
            </div>
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
            <p>Échangez via notre messagerie intégrée avec les bailleurs.</p>
          </div>
          <div className="step-card glass-panel">
            <div className="step-num">3</div>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h4>Visitez</h4>
            <p>Planifiez une visite physique au moment qui vous convient.</p>
          </div>
        </div>
      </section>

      {/* Quick filters criteria panel */}
      <section className="filters-section glass-panel">
        <h3 className="section-title-small">Ajuster vos critères de recherche</h3>
        <div className="filters-grid">
          <div className="filter-item">
            <label>Type de transaction</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="glass-select">
              <option value="">Tous les types</option>
              <option value="location">Mise en location</option>
              <option value="vente">Mise en vente</option>
            </select>
          </div>
          
          <div className="filter-item">
            <label>Standing du bien</label>
            <select value={standingFilter} onChange={(e) => setStandingFilter(e.target.value)} className="glass-select">
              <option value="">Tous les standings</option>
              {standings.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Budget maximum : {maxPrice ? `${Number(maxPrice).toLocaleString()} FCFA` : 'Illimité'}</label>
            <div className="range-container">
              <input 
                type="range" 
                min="0" 
                max="1500000" 
                step="25000" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-slider"
              />
              {maxPrice && <button className="clear-price-btn" onClick={() => setMaxPrice('')}>Réinitialiser</button>}
            </div>
          </div>
        </div>
      </section>

      {/* Stats ticker banner */}
      <div className="stats-ticker-banner glass-panel">
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="#f39c12" stroke="#f39c12" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <strong>4.8/5</strong> de satisfaction locataires
        </div>
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><path d="M9 16h6v6"/><line x1="8" y1="6" x2="8" y2="6.01"/><line x1="16" y1="6" x2="16" y2="6.01"/>
          </svg>
          <strong>+120</strong> nouveaux logements cette semaine
        </div>
        <div className="ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6"/>
          </svg>
          <strong>2 500+</strong> visites organisées
        </div>
      </div>

      {/* Content listings grid */}
      <section className="listings-section">
        <div className="listings-section-header">
          <div>
            <h2 className="section-title">Logements à la une</h2>
            <p className="listings-subtitle">Explorez les offres exclusives du jour</p>
          </div>
          <div className="listings-count-badge">
            {annonces.length} logement{annonces.length > 1 ? 's' : ''} trouvé{annonces.length > 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
            <span>Chargement des offres de rêve...</span>
          </div>
        ) : annonces.length === 0 ? (
          <div className="no-results glass-panel">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>
            </svg>
            <p>Aucun logement ne correspond à vos critères de recherche actuellement.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {annonces.map((annonce, index) => {
              const isFav = favorites.includes(annonce.id);
              const mainImage = annonce.images && annonce.images.length > 0 
                ? annonce.images[0].image_url 
                : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80';
              
              return (
                <div 
                  key={annonce.id} 
                  className="listing-card glass-panel glass-panel-hover" 
                  onClick={() => onSelectAnnonce(annonce.id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="image-container">
                    <img src={mainImage} alt={annonce.standing} className="listing-image" />
                    <div className="card-badge">{annonce.type_annonce === 'location' ? 'Location' : 'Vente'}</div>
                    <button 
                      className={`favorite-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(annonce.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="listing-info">
                    <div className="listing-header-row">
                      <h4 className="listing-title">{annonce.standing.replace('_', ' ').toUpperCase()}</h4>
                      <div className="rating-badge">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span>4.8</span>
                      </div>
                    </div>
                    <p className="listing-location">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--primary)' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {annonce.quartier}, Abomey-Calavi
                    </p>
                    
                    <div className="listing-badges">
                      <span className="l-badge">⚡ Compteur Perso</span>
                      <span className="l-badge">💧 Eau SONEB</span>
                    </div>
                    
                    <div className="listing-price-row">
                      <span className="price-val">{annonce.prix.toLocaleString()} FCFA</span>
                      <span className="price-period">{annonce.type_annonce === 'location' ? '/ mois' : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer glass-panel">
        <div className="footer-logo">LMP</div>
        <p className="footer-desc">Trouvez Facilement votre prochain Chez vous</p>
        <div className="footer-links">
          <a href="#explorer">Explorer</a>
          <a href="#destinations">Destinations</a>
          <a href="#hote">Devenir Hôte</a>
          <a href="#confidentialite">Confidentialité</a>
          <a href="#conditions">Conditions</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LMP Inc. Tous droits réservés.</span>
        </div>
      </footer>

      <style>{`
        .home-container {
          padding: 85px 16px 20px 16px;
        }

        .hero-section {
          padding: 28px 24px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(240, 235, 230, 0.5));
          text-align: center;
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at top left, rgba(214, 104, 83, 0.1), transparent 60%),
                      radial-gradient(ellipse at bottom right, rgba(0, 158, 150, 0.08), transparent 60%);
          z-index: 1;
        }

        .hero-split {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .hero-title {
          font-size: 34px;
          line-height: 1.15;
          color: var(--text-dark);
          margin-bottom: 14px;
          letter-spacing: -0.8px;
        }

        .highlight-text {
          display: block;
          font-size: 46px;
          font-weight: 900;
          letter-spacing: -2px;
          background: linear-gradient(135deg, var(--primary), #c0392b 40%, var(--primary-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-top: 4px;
          text-shadow: none;
        }

        .hero-subtitle {
          color: var(--text-gray);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 400px;
        }

        .search-bar-wrapper {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 30px;
          padding: 10px 18px;
          gap: 12px;
          margin-bottom: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          width: 100%;
          max-width: 480px;
        }

        .search-bar-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 8px 30px var(--primary-light);
          transform: translateY(-2px);
        }

        .search-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          background: transparent;
          flex: 1;
          outline: none;
          font-size: 14px;
          color: var(--text-dark);
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 480px;
        }

        /* Glassmorphism CTA buttons */
        .btn-glass-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border: none;
          border-radius: 16px;
          background: var(--primary);
          color: white;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(214, 104, 83, 0.35), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-glass-primary::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent);
        }

        .btn-glass-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(214, 104, 83, 0.45), inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .btn-glass-primary:active {
          transform: translateY(0px);
        }

        .btn-glass-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 24px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.55);
          color: var(--text-dark);
          border: 1.5px solid rgba(214, 104, 83, 0.25);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-glass-outline:hover {
          background: rgba(255, 255, 255, 0.75);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Hero image */
        .hero-image-col {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 340px;
        }

        .hero-img {
          width: 100%;
          border-radius: 24px;
          object-fit: cover;
          aspect-ratio: 4/3;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          display: block;
        }

        .hero-img-glass-badge {
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 158, 150, 0.2);
          border-radius: 30px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--secondary);
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .search-cta {
          padding: 16px 24px;
          font-size: 16px;
        }

        .publish-btn {
          padding: 16px 24px;
        }

        /* Steps Section */
        .steps-section {
          padding: 24px 20px;
          margin-bottom: 24px;
          text-align: center;
        }

        .section-title-centered {
          font-size: 18px;
          margin-bottom: 20px;
          color: var(--text-dark);
        }

        .steps-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-card {
          padding: 20px 16px;
          background: rgba(255,255,255,0.4);
          position: relative;
          overflow: hidden;
        }

        .step-num {
          position: absolute;
          top: 10px;
          right: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: rgba(0,0,0,0.04);
        }

        .step-icon {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .step-card h4 {
          font-size: 15px;
          margin-bottom: 6px;
          color: var(--text-dark);
        }

        .step-card p {
          font-size: 12px;
          color: var(--text-gray);
          line-height: 1.4;
        }

        /* Filters Section */
        .filters-section {
          padding: 20px;
          margin-bottom: 24px;
        }

        .section-title-small {
          font-size: 13px;
          color: var(--text-gray);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .filters-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-item label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .glass-select {
          background: var(--input-bg);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }

        .range-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.06);
          outline: none;
        }

        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          box-shadow: 0 2px 6px var(--primary-light);
          transition: transform 0.2s ease;
        }

        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .clear-price-btn {
          align-self: flex-start;
          background: transparent;
          border: none;
          color: var(--primary);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Stats Banner Ticker */
        .stats-ticker-banner {
          display: flex;
          flex-direction: column;
          padding: 14px;
          margin-bottom: 24px;
          gap: 10px;
          align-items: center;
          text-align: center;
          background: linear-gradient(to right, rgba(0, 158, 150, 0.03), rgba(214, 104, 83, 0.03));
        }

        .ticker-item {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-dark);
        }

        /* Listings Section Header */
        .listings-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .listings-count-badge {
          background: var(--primary-light);
          color: var(--primary);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .section-title {
          font-size: 22px;
          letter-spacing: -0.5px;
        }

        .listings-subtitle {
          color: var(--text-gray);
          font-size: 13px;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        /* Listing card enhancements */
        .listing-card {
          cursor: pointer;
          overflow: hidden;
          padding: 0;
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .image-container {
          position: relative;
          height: 220px;
          width: 100%;
          overflow: hidden;
          background: #eee;
        }

        .listing-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .listing-card:hover .listing-image {
          transform: scale(1.05);
        }

        .card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: var(--primary);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .favorite-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-dark);
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .favorite-btn.active {
          color: var(--primary);
          background: white;
          transform: scale(1.05);
        }

        .favorite-btn:hover {
          transform: scale(1.15);
        }

        .listing-info {
          padding: 20px;
        }

        .listing-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .listing-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .rating-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.04);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .rating-badge svg {
          color: #f39c12;
        }

        .listing-location {
          color: var(--text-gray);
          font-size: 13px;
          margin-bottom: 14px;
        }

        .listing-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .l-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--secondary);
          background: rgba(0, 158, 150, 0.08);
          padding: 5px 10px;
          border-radius: 8px;
        }

        .listing-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-val {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--primary);
        }

        .price-period {
          font-size: 12px;
          color: var(--text-gray);
          font-weight: 700;
        }

        /* Spinner */
        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          gap: 16px;
          color: var(--text-gray);
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid rgba(0,0,0,0.06);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          color: var(--text-gray);
          text-align: center;
          gap: 12px;
        }

        /* Footer */
        .footer {
          margin-top: 40px;
          padding: 30px 20px;
          text-align: center;
        }

        .footer-logo {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 6px;
        }

        .footer-desc {
          font-size: 13px;
          color: var(--text-gray);
          margin-bottom: 24px;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .footer-links a {
          color: var(--text-dark);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          font-size: 11px;
          color: var(--text-gray);
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 16px;
        }

        /* Desktop Queries */
        @media (min-width: 768px) {
          .home-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 30px 40px 40px;
          }
          .hero-section {
            padding: 60px 50px;
            text-align: left;
            margin-bottom: 30px;
          }
          .hero-split {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 60px;
          }
          .hero-text-col {
            align-items: flex-start;
            text-align: left;
            flex: 1;
          }
          .hero-image-col {
            flex: 0 0 420px;
            justify-content: flex-end;
          }
          .hero-image-wrapper {
            max-width: 420px;
          }
          .hero-img {
            aspect-ratio: 1/1;
          }
          .hero-title {
            font-size: 44px;
          }
          .highlight-text {
            font-size: 58px;
          }
          .hero-subtitle {
            font-size: 16px;
            max-width: 500px;
            margin-bottom: 30px;
          }
          .search-bar-wrapper {
            max-width: 520px;
          }
          .hero-actions {
            flex-direction: row;
            max-width: 520px;
          }
          .steps-section {
            padding: 40px;
            margin-bottom: 30px;
          }
          .section-title-centered {
            font-size: 22px;
            margin-bottom: 30px;
          }
          .steps-grid {
            flex-direction: row;
            gap: 24px;
          }
          .step-card {
            flex: 1;
            padding: 30px 20px;
          }
          .filters-section {
            padding: 24px;
            margin-bottom: 30px;
          }
          .filters-grid {
            flex-direction: row;
            align-items: flex-end;
            gap: 24px;
          }
          .filter-item {
            flex: 1;
          }
          .stats-ticker-banner {
            flex-direction: row;
            justify-content: space-around;
            padding: 18px;
            margin-bottom: 30px;
          }
          .listings-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
