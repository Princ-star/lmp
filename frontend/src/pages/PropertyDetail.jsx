import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail({ id, onBack, onContactOwner, favorites, toggleFavorite }) {
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Visit scheduling form state
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [visitMessage, setVisitMessage] = useState('');

  const { user } = useAuth();
  const isFav = favorites.includes(id);

  const fetchAnnonceDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/annonces/${id}/`);
      const data = await response.json();
      setAnnonce(data);
      // Increment views count via POST
      fetch(`/api/annonces/${id}/incrementer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'compteur_type=vues'
      }).catch(err => console.error("Error incrementing views:", err));
    } catch (error) {
      console.error('Error fetching property detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonceDetail();
  }, [id]);

  const handleContactClick = () => {
    if (!user) {
      alert("Veuillez vous connecter pour envoyer un message.");
      onContactOwner(null, true); // Directs to login
      return;
    }
    // Increment clicks count
    fetch(`/api/annonces/${id}/incrementer/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'compteur_type=clics'
    }).catch(err => console.error("Error incrementing clics:", err));

    onContactOwner(annonce.utilisateurs.id);
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Veuillez vous connecter pour planifier une visite.");
      return;
    }
    if (!visitDate || !visitTime) {
      alert("Veuillez spécifier la date et l'heure.");
      return;
    }

    try {
      setSubmittingVisit(true);
      const response = await fetch('/api/visites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annonce_id: id,
          date_visite: `${visitDate} ${visitTime}`
        })
      });
      if (response.ok) {
        setVisitMessage("Votre demande de visite a bien été envoyée ! Le propriétaire l'examinera dans les plus brefs délais.");
        setTimeout(() => {
          setShowVisitModal(false);
          setVisitMessage('');
        }, 3000);
      } else {
        const err = await response.json();
        alert(err.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert("Impossible de planifier la visite.");
    } finally {
      setSubmittingVisit(false);
    }
  };

  if (loading) {
    return (
      <div className="property-detail-loading animate-fade-in">
        <div className="spinner"></div>
        <span>Chargement des détails du logement...</span>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="property-detail-error glass-panel">
        <h3>Une erreur est survenue</h3>
        <p>Le logement demandé n'existe pas ou plus.</p>
        <button className="btn-primary" onClick={onBack}>Retourner aux offres</button>
      </div>
    );
  }

  const images = annonce.images && annonce.images.length > 0 
    ? annonce.images.map(img => img.image_url)
    : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="property-detail-container animate-fade-in">
      {/* Top action row */}
      <div className="top-navigation-row">
        <button className="back-btn glass-panel" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 19-7-7 7-7"/>
          </svg>
          <span>Retour</span>
        </button>
        <div className="action-buttons-group">
          <button className="icon-action-btn glass-panel" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Lien de l'annonce copié dans le presse-papiers !");
          }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
          </button>
          <button className={`icon-action-btn glass-panel ${isFav ? 'active' : ''}`} onClick={() => toggleFavorite(annonce.id)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="main-details-card glass-panel">
        <div className="title-section">
          <h1 className="property-title">{annonce.type_annonce === 'location' ? 'Location' : 'Vente'} - {annonce.standing.replace('_', ' ').toUpperCase()}</h1>
          <div className="meta-badges">
            <span className="badge-type">{annonce.type_annonce === 'location' ? 'Mise en location' : 'Mise en vente'}</span>
            <span className="badge-loc">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {annonce.quartier}, Abomey-Calavi
            </span>
          </div>
          <div className="price-tag">
            <span className="price-amount">{annonce.prix.toLocaleString()} FCFA</span>
            <span className="price-period">{annonce.type_annonce === 'location' ? ' / mois' : ''}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="gallery-section">
          <div className="main-image-wrapper">
            <img src={images[selectedImage]} alt="Property" className="main-gallery-image" />
          </div>
          {images.length > 1 && (
            <div className="thumbnails-wrapper">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-item ${idx === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="Thumbnail" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Owner details card */}
        <div className="owner-card glass-panel">
          <div className="owner-info">
            <div className="owner-avatar">
              {annonce.utilisateurs.prenom[0]}
            </div>
            <div className="owner-meta">
              <h4>{annonce.utilisateurs.prenom} {annonce.utilisateurs.nom}</h4>
              <span>Propriétaire</span>
            </div>
          </div>
          <div className="owner-actions">
            <a href={`tel:${annonce.numero_telephone}`} className="owner-call-btn glass-panel">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
            <button className="btn-primary contact-btn" onClick={handleContactClick}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Contacter
            </button>
          </div>
        </div>

        {/* Features grid */}
        <div className="features-list">
          <h3 className="section-subtitle">Caractéristiques</h3>
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <span className="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </span>
              <div className="feature-text">
                <h5>Compteur personnel</h5>
                <p>Gérez votre propre électricité à carte.</p>
              </div>
            </div>
            
            <div className="feature-card glass-panel">
              <span className="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <div className="feature-text">
                <h5>Sécurité garantie</h5>
                <p>Maison clôturée avec gardien de nuit.</p>
              </div>
            </div>

            <div className="feature-card glass-panel">
              <span className="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ display: 'block', margin: '0 auto' }}>
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
              <div className="feature-text">
                <h5>Eau SONEB</h5>
                <p>Eau courante potable incluse dans les charges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="description-section">
          <h3 className="section-subtitle">Détails du logement</h3>
          <p className="description-text">
            {annonce.description || "Très beau logement d'exception situé dans un cadre sécurisé et agréable. Idéalement positionné à proximité des transports et des commerces. Parfait pour travailleur, étudiant ou couple recherchant le confort et la tranquillité."}
          </p>
        </div>

        {/* Schedule visit action */}
        <div className="booking-action-section">
          <button className="btn-secondary w-full" onClick={() => setShowVisitModal(true)}>
            Planifier une visite
          </button>
        </div>
      </div>

      {/* Visit Booking Modal */}
      {showVisitModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowVisitModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Planifier une visite</h3>
              <button className="close-btn" onClick={() => setShowVisitModal(false)}>×</button>
            </div>
            
            {visitMessage ? (
              <div className="success-toast animate-fade-in">
                <span className="toast-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'block', margin: '0 auto' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <p>{visitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisit} className="visit-form">
                <div className="form-group">
                  <label>Choisir la date</label>
                  <input 
                    type="date" 
                    required 
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="glass-input" 
                  />
                </div>
                <div className="form-group">
                  <label>Heure préférée</label>
                  <input 
                    type="time" 
                    required 
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <button type="submit" disabled={submittingVisit} className="btn-primary w-full">
                  {submittingVisit ? "Envoi..." : "Envoyer la demande"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .property-detail-container {
          padding: 75px 16px 20px 16px;
        }

        .top-navigation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: none;
          background: var(--glass-bg);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .action-buttons-group {
          display: flex;
          gap: 8px;
        }

        .icon-action-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: var(--glass-bg);
          cursor: pointer;
          color: var(--text-dark);
          transition: all 0.2s ease;
        }

        .icon-action-btn.active {
          color: var(--primary);
          background: white;
        }

        .main-details-card {
          padding: 20px;
        }

        .title-section {
          margin-bottom: 20px;
        }

        .property-title {
          font-size: 22px;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .meta-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .badge-type {
          font-size: 11px;
          font-weight: 700;
          background: rgba(214, 104, 83, 0.1);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .badge-loc {
          font-size: 12px;
          color: var(--text-gray);
          font-weight: 600;
        }

        .price-tag {
          display: flex;
          align-items: baseline;
        }

        .price-amount {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--primary);
        }

        .price-period {
          font-size: 14px;
          color: var(--text-gray);
          font-weight: 600;
        }

        /* Gallery */
        .gallery-section {
          margin-bottom: 24px;
          border-radius: 12px;
          overflow: hidden;
        }

        .main-image-wrapper {
          height: 240px;
          width: 100%;
        }

        .main-gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnails-wrapper {
          display: flex;
          gap: 10px;
          padding: 10px 0 0 0;
          overflow-x: auto;
        }

        .thumbnail-item {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          flex-shrink: 0;
        }

        .thumbnail-item.active {
          border-color: var(--primary);
        }

        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Owner Card */
        .owner-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.6);
        }

        .owner-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .owner-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }

        .owner-meta h4 {
          font-size: 15px;
          color: var(--text-dark);
        }

        .owner-meta span {
          font-size: 12px;
          color: var(--text-gray);
          font-weight: 600;
        }

        .owner-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .owner-call-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          background: white;
          border: none;
          cursor: pointer;
        }

        .contact-btn {
          padding: 10px 14px;
          font-size: 14px;
        }

        /* Features List */
        .section-subtitle {
          font-size: 16px;
          margin-bottom: 14px;
          color: var(--text-dark);
        }

        .features-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          padding: 14px;
          gap: 14px;
          background: rgba(255, 255, 255, 0.4);
        }

        .feature-icon {
          font-size: 22px;
        }

        .feature-text h5 {
          font-size: 14px;
          margin-bottom: 2px;
          color: var(--text-dark);
        }

        .feature-text p {
          font-size: 12px;
          color: var(--text-gray);
        }

        /* Description */
        .description-section {
          margin-bottom: 24px;
        }

        .description-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-gray);
        }

        /* Booking */
        .booking-action-section {
          margin-top: 10px;
        }

        .w-full {
          width: 100%;
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 400px;
          padding: 24px;
          background: white;
          border-radius: 20px;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          font-size: 18px;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-gray);
        }

        .visit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-gray);
        }

        .success-toast {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 0;
          gap: 12px;
        }

        .toast-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0, 158, 150, 0.1);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }

        /* Loading */
        .property-detail-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          gap: 16px;
          color: var(--text-gray);
        }

        /* Desktop queries */
        @media (min-width: 768px) {
          .property-detail-container {
            max-width: 1000px;
            margin: 0 auto;
            padding-top: 30px;
          }
          .main-details-card {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 30px;
            padding: 30px;
          }
          .gallery-section {
            grid-column: 1;
            grid-row: 2 / 5;
            margin-bottom: 0;
          }
          .title-section {
            grid-column: 1 / 3;
            grid-row: 1;
          }
          .owner-card {
            grid-column: 2;
            grid-row: 2;
            margin-bottom: 0;
            align-self: start;
          }
          .features-list {
            grid-column: 2;
            grid-row: 3;
            margin-bottom: 0;
          }
          .description-section {
            grid-column: 1;
            grid-row: 5;
            margin-top: 20px;
          }
          .booking-action-section {
            grid-column: 2;
            grid-row: 4;
            align-self: start;
          }
          .main-image-wrapper {
            height: 380px;
          }
        }
      `}</style>
    </div>
  );
}
