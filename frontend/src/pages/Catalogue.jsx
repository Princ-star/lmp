import React, { useState, useEffect } from 'react';

export default function Catalogue({ onSelectAnnonce, favorites, toggleFavorite }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [standingFilter, setStandingFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price_asc', 'price_desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const standings = [
    { value: 'entree_couchee', label: "Entrée couchée" },
    { value: '1ch_salon', label: "1 chambre salon" },
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

      // Client-side sort
      if (sortBy === 'price_asc') {
        data.sort((a, b) => Number(a.prix) - Number(b.prix));
      } else if (sortBy === 'price_desc') {
        data.sort((a, b) => Number(b.prix) - Number(a.prix));
      } else {
        data.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));
      }

      setAnnonces(data);
    } catch (error) {
      console.error('Error fetching catalogue annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [typeFilter, search, standingFilter, maxPrice, sortBy]);

  return (
    <div className="catalogue-page animate-fade-in">
      
      {/* Top Banner */}
      <div className="catalogue-banner">
        <div className="catalogue-banner-overlay"></div>
        <div className="catalogue-banner-content">
          <span className="catalogue-tag">Catalogue officiel</span>
          <h1 className="catalogue-title">Toutes nos locations & ventes</h1>
          <p className="catalogue-subtitle">Découvrez l'intégralité des biens vérifiés et disponibles immédiatement au Bénin.</p>
        </div>
      </div>

      <div className="catalogue-layout">
        
        {/* Sidebar Filters */}
        <aside className="catalogue-filters glass-panel">
          <div className="filters-header">
            <h3 className="filters-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtres
            </h3>
            {(typeFilter || standingFilter || maxPrice || search) && (
              <button 
                className="reset-filters-btn"
                onClick={() => { setTypeFilter(''); setStandingFilter(''); setMaxPrice(''); setSearch(''); }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">Recherche par quartier/ville</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Ex: Cadjehoun, Calavi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Type de transaction</label>
            <div className="filter-type-pills">
              <button 
                className={`type-pill ${typeFilter === '' ? 'active' : ''}`}
                onClick={() => setTypeFilter('')}
              >
                Tous
              </button>
              <button 
                className={`type-pill loc ${typeFilter === 'location' ? 'active' : ''}`}
                onClick={() => setTypeFilter('location')}
              >
                Location
              </button>
              <button 
                className={`type-pill vente ${typeFilter === 'vente' ? 'active' : ''}`}
                onClick={() => setTypeFilter('vente')}
              >
                Vente
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Standing / Type de bien</label>
            <select 
              value={standingFilter} 
              onChange={(e) => setStandingFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les types</option>
              {standings.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Budget max (FCFA)</label>
            <input
              type="number"
              placeholder="Ex: 150000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="filter-input"
            />
          </div>
        </aside>

        {/* Listings Grid section */}
        <main className="catalogue-main">

          {/* Controls Bar */}
          <div className="catalogue-controls-bar glass-panel">
            <div className="results-count">
              <strong>{annonces.length}</strong> bien{annonces.length > 1 ? 's' : ''} trouvé{annonces.length > 1 ? 's' : ''}
            </div>

            <div className="controls-right">
              <div className="sort-group">
                <label>Trier par :</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="recent">Plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>

              <div className="view-mode-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Vue grille"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Vue liste"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/>
                    <rect x="3" y="16" width="18" height="4" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="catalogue-loading">
              <div className="spinner"></div>
              <span>Chargement du catalogue...</span>
            </div>
          ) : annonces.length === 0 ? (
            <div className="no-results-box glass-panel">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#d66853" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <h3>Aucun logement ne correspond</h3>
              <p>Essayez de modifier vos filtres ou réinitialisez la recherche.</p>
              <button 
                className="btn-glass-primary" 
                onClick={() => { setTypeFilter(''); setStandingFilter(''); setMaxPrice(''); setSearch(''); }}
              >
                Voir tout le catalogue
              </button>
            </div>
          ) : (
            <div className={`catalogue-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {annonces.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div key={item.id} className="annonce-card glass-panel" onClick={() => onSelectAnnonce(item.id)}>
                    <div className="card-image-wrap">
                      {item.photo_principale ? (
                        <img src={item.photo_principale} alt={item.titre} className="card-image" />
                      ) : (
                        <div className="card-image-placeholder">
                          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Badge Location/Vente */}
                      <span className={`badge-type ${item.type_annonce}`}>
                        {item.type_annonce === 'location' ? 'Location' : 'Vente'}
                      </span>

                      {/* Favorite button */}
                      <button 
                        className={`favorite-btn ${isFav ? 'is-fav' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? '#d66853' : 'none'} stroke={isFav ? '#d66853' : 'white'} strokeWidth="2">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="card-body">
                      <div className="card-location">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {item.quartier || 'Cotonou'}
                      </div>
                      <h3 className="card-title">{item.titre}</h3>
                      <div className="card-standing-pill">{item.get_standing_display || item.standing}</div>

                      <div className="card-footer">
                        <div className="card-price">
                          {Number(item.prix).toLocaleString('fr-FR')} FCFA
                          {item.type_annonce === 'location' && <span className="price-unit">/mois</span>}
                        </div>
                        <span className="card-link-btn">Voir →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      <style>{`
        .catalogue-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 16px 60px;
        }

        .catalogue-banner {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, #1c140c 0%, #2b1a10 50%, #0d1e1c 100%);
          padding: 48px 32px;
          margin-bottom: 32px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }

        .catalogue-banner-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(0,158,150,0.2) 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, rgba(214,104,83,0.25) 0%, transparent 60%);
          pointer-events: none;
        }

        .catalogue-banner-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .catalogue-tag {
          display: inline-block;
          background: rgba(214,104,83,0.2);
          color: #d66853;
          border: 1px solid rgba(214,104,83,0.4);
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }

        .catalogue-title {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .catalogue-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 15px;
          line-height: 1.6;
        }

        .catalogue-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .catalogue-filters {
          padding: 24px;
          border-radius: 20px;
          height: fit-content;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .filters-title {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1f2937;
        }

        .reset-filters-btn {
          background: none;
          border: none;
          color: #d66853;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 18px;
        }

        .filter-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #4b5563;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .filter-input, .filter-select {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.8);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .filter-select {
          padding-left: 14px;
        }

        .filter-input:focus, .filter-select:focus {
          border-color: #d66853;
          box-shadow: 0 0 0 3px rgba(214,104,83,0.15);
        }

        .filter-type-pills {
          display: flex;
          gap: 6px;
        }

        .type-pill {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-pill.active {
          background: #1f2937;
          color: white;
          border-color: #1f2937;
        }

        .type-pill.loc.active {
          background: #d66853;
          border-color: #d66853;
        }

        .type-pill.vente.active {
          background: #009e96;
          border-color: #009e96;
        }

        .catalogue-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-radius: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .results-count {
          font-size: 14px;
          color: #4b5563;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .sort-select {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          outline: none;
        }

        .view-mode-toggle {
          display: flex;
          background: rgba(0,0,0,0.05);
          padding: 3px;
          border-radius: 8px;
        }

        .view-btn {
          border: none;
          background: transparent;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
        }

        .view-btn.active {
          background: white;
          color: #d66853;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .catalogue-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .catalogue-grid.list-view {
          grid-template-columns: 1fr;
        }

        .annonce-card {
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .annonce-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.1);
        }

        .card-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .annonce-card:hover .card-image {
          transform: scale(1.05);
        }

        .badge-type {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .badge-type.location {
          background: #d66853;
        }

        .badge-type.vente {
          background: #009e96;
        }

        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: rgba(0,0,0,0.55);
        }

        .card-body {
          padding: 16px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-standing-pill {
          display: inline-block;
          font-size: 11px;
          background: rgba(0,0,0,0.04);
          color: #4b5563;
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 14px;
          align-self: flex-start;
          font-weight: 500;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .card-price {
          font-family: 'Outfit', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #d66853;
        }

        .price-unit {
          font-size: 12px;
          font-weight: 400;
          color: #6b7280;
        }

        .card-link-btn {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        .catalogue-loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .no-results-box {
          text-align: center;
          padding: 60px 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        @media (min-width: 768px) {
          .catalogue-layout {
            grid-template-columns: 280px 1fr;
          }

          .catalogue-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .catalogue-grid.list-view .annonce-card {
            flex-direction: row;
          }

          .catalogue-grid.list-view .card-image-wrap {
            width: 220px;
            height: 100%;
          }
        }

        @media (min-width: 1024px) {
          .catalogue-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
