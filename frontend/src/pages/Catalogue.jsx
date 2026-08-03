import React, { useState, useEffect } from 'react';

export default function Catalogue({ onSelectAnnonce, favorites, toggleFavorite }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [standingFilter, setStandingFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('recent');

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
    { value: 'quest_house', label: "Guest house" }
  ];

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      let url = '/api/annonces/?type_annonce=location';
      if (search) url += `&quartier=${encodeURIComponent(search)}`;
      if (standingFilter) url += `&standing=${standingFilter}`;
      if (maxPrice) url += `&prix=${maxPrice}`;

      const response = await fetch(url);
      let data = await response.json();

      if (sortBy === 'price_asc') {
        data.sort((a, b) => Number(a.prix) - Number(b.prix));
      } else if (sortBy === 'price_desc') {
        data.sort((a, b) => Number(b.prix) - Number(a.prix));
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
  }, [search, standingFilter, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-terracotta-900 rounded-3xl p-8 text-white shadow-md">
        <span className="inline-block px-3 py-1 bg-terracotta/30 text-terracotta-100 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Catalogue Officiel
        </span>
        <h1 className="text-3xl font-black">Toutes les offres de location</h1>
        <p className="text-white/70 text-sm mt-1">Découvrez tous les logements disponibles à Cotonou et Calavi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Filtres de recherche</h3>
            {(standingFilter || maxPrice || search) && (
              <button 
                onClick={() => { setStandingFilter(''); setMaxPrice(''); setSearch(''); }}
                className="text-xs font-semibold text-terracotta hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Quartier / Ville</label>
            <input 
              type="text"
              placeholder="Ex: Cadjehoun, Calavi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-terracotta/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type de bien / Standing</label>
            <select 
              value={standingFilter} 
              onChange={(e) => setStandingFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-terracotta/20"
            >
              <option value="">Tous les standings</option>
              {standings.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Budget Max (FCFA)</label>
            <input 
              type="number"
              placeholder="Ex: 150000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-terracotta/20"
            />
          </div>
        </aside>

        {/* Main Catalogue Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-gray-600">
            <div>
              <strong>{annonces.length}</strong> logement{annonces.length > 1 ? 's' : ''} trouvé{annonces.length > 1 ? 's' : ''}
            </div>

            <div className="flex items-center gap-2">
              <span>Trier par :</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 outline-none"
              >
                <option value="recent">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement du catalogue...</div>
          ) : annonces.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-500">
              Aucun bien ne correspond aux filtres sélectionnés.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annonces.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => onSelectAnnonce(item.id)}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
                  >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {item.photo_principale ? (
                        <img 
                          src={item.photo_principale} 
                          alt={item.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-xs gap-1.5">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          Sans photo
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        Location
                      </span>

                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow text-gray-700 hover:text-terracotta transition"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={isFav ? 'text-red-500' : 'text-gray-500'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {item.quartier || 'Cotonou'}
                        </span>
                        <h3 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover:text-terracotta transition">
                          {item.titre}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                          {item.get_standing_display || item.standing}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-terracotta">
                            {Number(item.prix).toLocaleString()} FCFA
                          </span>
                          <span className="text-[10px] font-normal text-gray-500"> /mois</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 group-hover:translate-x-1 transition">
                          Voir →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
