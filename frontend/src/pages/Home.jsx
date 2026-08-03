import React, { useState, useEffect } from 'react';

export default function Home({ onSelectAnnonce, onNavigateToPublish, onNavigateToCatalogue, favorites, toggleFavorite }) {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [standingFilter, setStandingFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Error fetching annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [search, standingFilter, maxPrice]);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      {/* HERO SECTION — Full Width with Left Gradient Overlay */}
      <section className="relative w-full overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center shadow-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/hero_bg.jpg)`, backgroundPosition: 'center 30%' }}
        />
        {/* Left-to-right gradient overlay: strong on left, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-900/75 to-gray-900/20" />
        {/* Bottom subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-16 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 w-fit">
            🏡 Plateforme #1 de location au Bénin
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-white">
            Trouvez votre<br />
            logement <span style={{color: '#d66853'}}>CHEZ VOUS</span>
          </h1>

          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-md">
            Chambres, appartements et villas vérifiés à Cotonou & Abomey-Calavi. Location directe sans intermédiaire.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <input 
              type="text"
              placeholder="Dans quel quartier ? (Ex: Cadjehoun, Akpakpa...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 font-medium text-sm border-0 shadow-xl outline-none focus:ring-4 focus:ring-terracotta/30"
            />
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={onNavigateToCatalogue}
              className="px-7 py-4 font-extrabold rounded-2xl shadow-lg transition text-sm flex items-center gap-2 text-white"
              style={{backgroundColor: '#d66853'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c85a47'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d66853'}
            >
              Voir toutes les locations →
            </button>
            <button 
              onClick={onNavigateToPublish}
              className="px-7 py-4 font-extrabold rounded-2xl text-white text-sm flex items-center gap-2 transition"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                boxShadow: '0 4px 24px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}
            >
              + Publier un bien
            </button>
          </div>
        </div>
      </section>

      {/* QUICK STEP GUIDE */}
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6">Comment réserver votre logement ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-full bg-terracotta-50 text-terracotta font-extrabold flex items-center justify-center mx-auto text-sm">1</div>
            <h3 className="font-bold text-gray-900">Explorez les offres</h3>
            <p className="text-xs text-gray-500">Parcourez les annonces de location vérifiées avec photos et tarifs clairs.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-full bg-terracotta-50 text-terracotta font-extrabold flex items-center justify-center mx-auto text-sm">2</div>
            <h3 className="font-bold text-gray-900">Demandez une visite</h3>
            <p className="text-xs text-gray-500">Choisissez la date qui vous convient et envoyez votre demande au bailleur.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-full bg-terracotta-50 text-terracotta font-extrabold flex items-center justify-center mx-auto text-sm">3</div>
            <h3 className="font-bold text-gray-900">Emménagez !</h3>
            <p className="text-xs text-gray-500">Effectuez la visite physique et récupérez vos clés en toute sécurité.</p>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS GRID */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Dernières maisons & appartements en location</h2>
            <p className="text-sm text-gray-500 mt-1">Disponibles immédiatement à Cotonou et Calavi</p>
          </div>
          <button 
            onClick={onNavigateToCatalogue} 
            className="text-sm font-bold text-terracotta hover:underline"
          >
            Tout le catalogue →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement des offres de location...</div>
        ) : annonces.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-500">
            Aucun logement ne correspond à cette recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.slice(0, 6).map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => onSelectAnnonce(item.id)}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
                >
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    {item.photo_principale ? (
                      <img 
                        src={item.photo_principale} 
                        alt={item.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-sm">
                        🏠 Photo bientôt disponible
                      </div>
                    )}

                    <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                      Location
                    </span>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow text-gray-700 hover:text-terracotta transition"
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                        📍 {item.quartier || 'Cotonou'}
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover:text-terracotta transition">
                        {item.titre}
                      </h3>
                      <div className="inline-block mt-2 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                        {item.get_standing_display || item.standing}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-terracotta">
                          {Number(item.prix).toLocaleString()} FCFA
                        </span>
                        <span className="text-xs font-normal text-gray-500"> /mois</span>
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
      </section>

      {/* BANNER PROPRIÉTAIRE */}
      <section className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 font-bold text-xs uppercase">Espace Propriétaires</span>
          <h2 className="text-2xl md:text-3xl font-black">Vous êtes propriétaire d'un logement ?</h2>
          <p className="text-emerald-100/80 text-sm">Publiez votre bien gratuitement et recevez des demandes de visite directes de locataires qualifiés.</p>
        </div>
        <button 
          onClick={onNavigateToPublish}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-md transition text-sm flex-shrink-0"
        >
          Publier mon bien gratuitement →
        </button>
      </section>

    </div>
  );
}
