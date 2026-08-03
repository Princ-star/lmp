import React from 'react';

export default function Footer({ setActiveTab, onOpenInfoPage }) {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-8 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">

        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 32 L20 6 L34 32" stroke="#d66853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 23 L28 23" stroke="#009e96" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="6" r="2.5" fill="#d66853"/>
            </svg>
            <span className="text-2xl font-extrabold text-white tracking-tight">LMP</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            La plateforme immobilière de référence au Bénin pour la location directe de maisons et d'appartements sans frais cachés.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:text-terracotta hover:bg-gray-700 transition">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:text-terracotta hover:bg-gray-700 transition">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:text-terracotta hover:bg-gray-700 transition">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.35C8.46 21.52 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setActiveTab('annonces')} className="hover:text-terracotta transition">Accueil</button></li>
            <li><button onClick={() => setActiveTab('catalogue')} className="hover:text-terracotta transition">Catalogue des locations</button></li>
            <li><button onClick={() => setActiveTab('favoris')} className="hover:text-terracotta transition">Mes Favoris</button></li>
            <li><button onClick={() => setActiveTab('messages')} className="hover:text-terracotta transition">Messages</button></li>
          </ul>
        </div>

        {/* Espace Propriétaires */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Espace Propriétaires</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setActiveTab('profile')} className="hover:text-emerald-400 transition">Publier une annonce</button></li>
            <li><button onClick={() => setActiveTab('profile')} className="hover:text-emerald-400 transition">Tableau de bord</button></li>
            <li><button onClick={() => onOpenInfoPage('a-propos')} className="hover:text-emerald-400 transition">Comment ça fonctionne</button></li>
          </ul>
        </div>

        {/* Informations Légales & Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informations</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onOpenInfoPage('a-propos')} className="hover:text-terracotta transition">À propos de LMP</button></li>
            <li><button onClick={() => onOpenInfoPage('cgu')} className="hover:text-terracotta transition">Conditions Générales (CGU)</button></li>
            <li><button onClick={() => onOpenInfoPage('confidentialite')} className="hover:text-terracotta transition">Politique de confidentialité</button></li>
            <li><button onClick={() => onOpenInfoPage('contact')} className="hover:text-terracotta transition">Nous contacter</button></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <span>© 2026 LMP — Location Maison Plus. Abomey-Calavi, Bénin.</span>
        <div className="flex items-center gap-4">
          <span>✓ Plateforme sécurisée</span>
          <span>✓ Logements vérifiés</span>
        </div>
      </div>
    </footer>
  );
}
