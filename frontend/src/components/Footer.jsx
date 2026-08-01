import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="lmp-footer">
      <div className="footer-inner">

        {/* Brand Column */}
        <div className="footer-col footer-brand-col">
          {/* Abstract SVG Logo */}
          <div className="footer-logo-wrap">
            <svg viewBox="0 0 48 48" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 36 L24 8 L40 36" stroke="#d66853" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M14 26 L34 26" stroke="#009e96" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="8" r="3" fill="#d66853"/>
            </svg>
            <span className="footer-brand-name">LMP</span>
          </div>
          <p className="footer-tagline">
            La plateforme de référence pour trouver et louer votre logement à Cotonou & Abomey-Calavi.
          </p>
          <div className="footer-socials">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" aria-label="WhatsApp" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.35C8.46 21.52 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.23 8.23 0 0 0 4.82 1.54V6.78a4.85 4.85 0 0 1-1.05-.09z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Explorer Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Explorer</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => setActiveTab('accueil')} className="footer-link">Accueil</button></li>
            <li><button onClick={() => setActiveTab('catalogue')} className="footer-link">Catalogue des logements</button></li>
            <li><button onClick={() => setActiveTab('favoris')} className="footer-link">Mes Favoris</button></li>
            <li><button onClick={() => setActiveTab('messages')} className="footer-link">Messages</button></li>
          </ul>
        </div>

        {/* Proprietaires Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Propriétaires</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => setActiveTab('profile')} className="footer-link">Publier une annonce</button></li>
            <li><button onClick={() => setActiveTab('profile')} className="footer-link">Tableau de bord</button></li>
            <li><a href="#" className="footer-link">Comment ça fonctionne</a></li>
            <li><a href="#" className="footer-link">Tarifs & Formules</a></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Informations</h4>
          <ul className="footer-links-list">
            <li><a href="#" className="footer-link">À propos de LMP</a></li>
            <li><a href="#" className="footer-link">Conditions d'utilisation</a></li>
            <li><a href="#" className="footer-link">Politique de confidentialité</a></li>
            <li><a href="#" className="footer-link">Nous contacter</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <span>© 2026 LMP — Location Maison Plus. Abomey-Calavi, Bénin.</span>
        <div className="footer-bottom-badges">
          <span className="trust-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Plateforme sécurisée
          </span>
          <span className="trust-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Annonces vérifiées
          </span>
        </div>
      </div>

      <style>{`
        .lmp-footer {
          background: linear-gradient(180deg, #1a1208 0%, #110d06 100%);
          color: rgba(255,255,255,0.75);
          padding: 60px 24px 0;
          margin-top: 80px;
          position: relative;
          overflow: hidden;
        }

        .lmp-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(214,104,83,0.5), rgba(0,158,150,0.5), transparent);
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 1280px;
          margin: 0 auto;
          padding-bottom: 48px;
        }

        .footer-brand-col {
          max-width: 320px;
        }

        .footer-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .footer-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .footer-tagline {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }

        .footer-socials {
          display: flex;
          gap: 10px;
        }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .social-icon-btn:hover {
          background: rgba(214,104,83,0.15);
          border-color: rgba(214,104,83,0.3);
          color: #d66853;
          transform: translateY(-2px);
        }

        .footer-col-title {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 18px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 24px;
          height: 2px;
          background: #d66853;
          border-radius: 2px;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s ease;
          text-align: left;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer-link:hover {
          color: #d66853;
        }

        .footer-link::before {
          content: '→';
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.2s ease;
          font-size: 12px;
          color: #d66853;
        }

        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-bottom-badges {
          display: flex;
          gap: 16px;
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
        }

        @media (min-width: 640px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .footer-inner {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }

          .footer-bottom-bar {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
}
