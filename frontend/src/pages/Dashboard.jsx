import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onSelectAnnonce }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total_annonces: 0, visites_planifiees: 0, taux_occupation: 100 });
  const [myAnnonces, setMyAnnonces] = useState([]);
  const [demandesVisite, setDemandesVisite] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs: 'dashboard' (Tableau de bord), 'annonces' (Mes annonces)
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  
  // Creation form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [typeAnnonce, setTypeAnnonce] = useState('location');
  const [standing, setStanding] = useState('1ch_salon');
  const [quartier, setQuartier] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);
  const [submittingForm, setSubmittingForm] = useState(false);

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setMyAnnonces(data.my_annonces);
        setDemandesVisite(data.demandes_visite);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRespondVisit = async (id, status) => {
    try {
      const response = await fetch(`/api/visites/${id}/repondre/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: status })
      });
      if (response.ok) {
        alert(status === 'acceptee' ? "Visite acceptée !" : "Visite refusée.");
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error responding to visit:", error);
    }
  };

  const handleCreateAnnonce = async (e) => {
    e.preventDefault();
    if (!quartier || !prix || !phone) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    try {
      setSubmittingForm(true);
      const formData = new FormData();
      formData.append('type_annonce', typeAnnonce);
      formData.append('standing', standing);
      formData.append('quartier', quartier);
      formData.append('prix', prix);
      formData.append('description', description);
      formData.append('numero_telephone', phone);
      formData.append('est_publiee', 'true'); // publish immediately

      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      const response = await fetch('/api/annonces/creer/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert("Annonce créée et publiée avec succès !");
        setShowCreateForm(false);
        // Clear fields
        setQuartier('');
        setPrix('');
        setDescription('');
        setPhone('');
        setImages([]);
        fetchDashboardData();
      } else {
        const err = await response.json();
        alert(err.error || "Une erreur est survenue.");
      }
    } catch (error) {
      alert("Erreur lors de la création de l'annonce.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading animate-fade-in">
        <div className="spinner"></div>
        <span>Chargement de votre Tableau de bord...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Title */}
      <div className="dashboard-title-row">
        <h1 className="dash-title">Tableau de bord</h1>
        <button className="icon-action-btn glass-panel notification-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="dot-badge"></span>
        </button>
      </div>

      {/* Owner Profile Card */}
      <div className="owner-profile-card glass-panel">
        <div className="owner-avatar-large">
          {user.prenom[0]}
        </div>
        <div className="owner-info-text">
          <h2>{user.prenom} {user.nom}</h2>
          <span>Propriétaire</span>
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="subtabs-bar glass-panel">
        <button 
          className={`subtab-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('dashboard'); setShowCreateForm(false); }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
          </svg>
          Tableau de bord
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'annonces' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('annonces'); setShowCreateForm(false); }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          Mes annonces
        </button>
      {showCreateForm ? (
        /* Create Listing Form Screen */
        <div className="create-form-wrapper glass-panel animate-fade-in-up">
          <div className="form-header">
            <h3>Publier un nouveau logement</h3>
            <button className="btn-outline close-btn-form" onClick={() => setShowCreateForm(false)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span>Annuler</span>
            </button>
          </div>
          
          <form onSubmit={handleCreateAnnonce} className="create-annonce-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Type d'annonce</label>
                <select value={typeAnnonce} onChange={(e) => setTypeAnnonce(e.target.value)} className="glass-select">
                  <option value="location">Mise en location</option>
                  <option value="vente">Mise en vente</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label>Standing du bien</label>
                <select value={standing} onChange={(e) => setStanding(e.target.value)} className="glass-select">
                  {standings.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Quartier *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Bidossessi, Fidjrossè"
                  required
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="glass-input" 
                />
              </div>
              <div className="form-group flex-1">
                <label>Prix de l'offre (FCFA) *</label>
                <input 
                  type="number" 
                  placeholder="Ex: 75000"
                  required
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="glass-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Téléphone de contact (WhatsApp/Appel) *</label>
              <input 
                type="text" 
                placeholder="Ex: +229 90000000"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="glass-input" 
              />
            </div>

            <div className="form-group">
              <label>Description détaillée du logement</label>
              <textarea 
                placeholder="Décrivez l'emplacement, les commodités (compteur personnel, eau, gardien, etc.)..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input textarea"
              />
            </div>

            <div className="form-group">
              <label>Photos du logement (Une ou plusieurs)</label>
              <label className="file-upload-zone glass-panel-hover">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--primary)" strokeWidth="2.2" style={{ marginBottom: '4px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <strong>Sélectionner des images</strong>
                <span className="upload-subtitle">Glissez des fichiers ou cliquez pour parcourir</span>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input-hidden" 
                />
              </label>
              <div className="file-preview-count">
                {images.length > 0 ? (
                  <span className="files-selected-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {images.length} image(s) sélectionnée(s)
                  </span>
                ) : "Aucune photo sélectionnée (recommandé pour une meilleure visibilité)"}
              </div>
            </div>

            <button type="submit" disabled={submittingForm} className="btn-primary w-full submit-btn-form">
              {submittingForm ? (
                <>
                  <div className="spinner-small"></div>
                  <span>Publication en cours...</span>
                </>
              ) : "Publier l'annonce maintenant"}
            </button>
          </form>
        </div>
      ) : activeSubTab === 'dashboard' ? (
        /* Stats & Visites Screen */
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper blue">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="stat-title">Mes Annonces</span>
              <span className="stat-val">{stats.total_annonces}</span>
            </div>
            
            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper orange">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span className="stat-title">Visites planifiées</span>
              <span className="stat-val">{stats.visites_planifiees}</span>
            </div>

            <div className="stat-card glass-panel wide">
              <div className="stat-row">
                <div className="stat-icon-wrapper green">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-text-col">
                  <span className="stat-title">Taux d'occupation de vos logements</span>
                  <span className="stat-val">{stats.taux_occupation}%</span>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-secondary w-full publish-shortcut-btn" onClick={() => setShowCreateForm(true)}>
            <span className="plus-sign">+</span> Faire une annonce
          </button>

          {/* Visit Demands Section */}
          <div className="demands-section glass-panel">
            <div className="section-header-row">
              <h3>Demandes de visite</h3>
              <span className="see-all">Voir tout</span>
            </div>

            {demandesVisite.length === 0 ? (
              <div className="no-demands">
                <p>Aucune demande de visite en attente.</p>
              </div>
            ) : (
              <div className="demands-list">
                {demandesVisite.map((d) => (
                  <div key={d.id} className="demand-card glass-panel">
                    <div className="demand-user">
                      <div className="demand-avatar">{d.locataire_name[0]}</div>
                      <div className="demand-meta">
                        <h4>{d.locataire_name}</h4>
                        <p>Intéressé par : <strong>{d.annonce_title} ({d.annonce_quartier})</strong></p>
                        <p className="visit-time">Le {new Date(d.date_visite).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                    {d.statut === 'en_attente' ? (
                      <div className="demand-actions">
                        <button className="btn-outline reject-btn" onClick={() => handleRespondVisit(d.id, 'refusee')}>Refuser</button>
                        <button className="btn-primary accept-btn" onClick={() => handleRespondVisit(d.id, 'acceptee')}>Accepter</button>
                      </div>
                    ) : (
                      <div className="demand-status-badge">
                        <span className={`status-tag ${d.statut}`}>
                          {d.statut === 'acceptee' ? 'Acceptée' : 'Refusée'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* My Announcements List Tab */
        <div className="my-annonces-tab animate-fade-in">
          <h3>Vos biens publiés</h3>
          {myAnnonces.length === 0 ? (
            <div className="no-results glass-panel">
              <p>Vous n'avez pas encore publié d'annonces.</p>
              <button className="btn-primary" onClick={() => setShowCreateForm(true)}>Publier une annonce</button>
            </div>
          ) : (
            <div className="my-annonces-grid">
              {myAnnonces.map((a) => (
                <div key={a.id} className="my-annonce-card glass-panel" onClick={() => onSelectAnnonce(a.id)}>
                  <img src={a.images && a.images.length > 0 ? a.images[0].image_url : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80'} alt="Bien" />
                  <div className="my-annonce-details">
                    <h4>{a.type_annonce === 'location' ? 'Mise en location' : 'Mise en vente'} ({a.standing.replace('_', ' ')})</h4>
                    <p>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {a.quartier} - {a.prix.toLocaleString()} FCFA
                    </p>
                    <div className="performance-row">
                      <span>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        {a.nbr_vues} vues
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        {a.nbr_clics} clics
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logout button */}
      <button className="logout-btn-dashboard" onClick={logout}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Déconnexion
      </button>
    </div>

      <style>{`
        .dashboard-container {
          padding: 75px 16px 20px 16px;
        }

        .dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dash-title {
          font-size: 24px;
        }

        .notification-btn {
          position: relative;
        }

        .dot-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        .owner-profile-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .owner-avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(214, 104, 83, 0.15);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          border: 2px solid var(--primary);
        }

        .owner-info-text h2 {
          font-size: 18px;
          color: var(--text-dark);
        }

        .owner-info-text span {
          font-size: 13px;
          color: var(--text-gray);
          font-weight: 600;
        }

        .subtabs-bar {
          display: flex;
          padding: 4px;
          gap: 4px;
          background: rgba(240, 235, 230, 0.4);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .subtab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-gray);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subtab-btn.active {
          background: white;
          color: var(--secondary);
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-card.wide {
          grid-column: 1 / 3;
        }

        .stat-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-text-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-icon-wrapper.blue { background: rgba(0,122,255,0.08); }
        .stat-icon-wrapper.orange { background: rgba(255,149,0,0.08); }
        .stat-icon-wrapper.green { background: rgba(0, 158, 150, 0.08); }

        .stat-title {
          font-size: 12px;
          color: var(--text-gray);
          font-weight: 600;
        }

        .stat-val {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--text-dark);
        }

        .publish-shortcut-btn {
          margin-bottom: 24px;
        }

        .plus-sign {
          font-size: 18px;
          font-weight: 700;
        }

        /* Demands Visites */
        .demands-section {
          padding: 20px;
          margin-bottom: 24px;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .see-all {
          font-size: 12px;
          color: var(--secondary);
          font-weight: 700;
          cursor: pointer;
        }

        .no-demands {
          padding: 20px 0;
          text-align: center;
          color: var(--text-gray);
          font-size: 13px;
        }

        .demands-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .demand-card {
          padding: 14px;
          background: rgba(255,255,255,0.4);
        }

        .demand-user {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .demand-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--text-gray);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .demand-meta h4 {
          font-size: 14px;
        }

        .demand-meta p {
          font-size: 12px;
          color: var(--text-gray);
          margin-top: 2px;
        }

        .demand-meta strong {
          color: var(--text-dark);
        }

        .visit-time {
          color: var(--primary) !important;
          font-weight: 600;
        }

        .demand-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .reject-btn {
          padding: 8px 12px;
          font-size: 12px;
        }

        .accept-btn {
          padding: 8px 12px;
          font-size: 12px;
          background: var(--secondary);
          box-shadow: none;
        }

        .accept-btn:hover {
          background: var(--secondary-hover);
        }

        .status-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .status-tag.acceptee {
          background: rgba(0, 158, 150, 0.1);
          color: var(--secondary);
        }

        .status-tag.refusee {
          background: rgba(234, 67, 53, 0.1);
          color: #ea4335;
        }

        /* Form */
        .create-form-wrapper {
          padding: 24px;
          margin-bottom: 24px;
          border-color: rgba(0, 158, 150, 0.15);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .form-header h3 {
          font-size: 18px;
          color: var(--text-dark);
        }

        .close-btn-form {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .create-annonce-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .create-annonce-form label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 6px;
          display: block;
        }

        .create-annonce-form .form-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .create-annonce-form .form-row {
            flex-direction: row;
          }
        }

        .file-upload-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          border: 2px dashed rgba(0, 158, 150, 0.2);
          border-radius: 16px;
          background: rgba(0, 158, 150, 0.01);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .file-upload-zone:hover {
          border-color: var(--primary);
          background: rgba(0, 158, 150, 0.04);
          transform: translateY(-2px);
        }

        .file-upload-zone strong {
          font-size: 14px;
          color: var(--text-dark);
          margin-top: 6px;
        }

        .upload-subtitle {
          font-size: 11px;
          color: var(--text-gray);
          margin-top: 2px;
        }

        .file-input-hidden {
          display: none;
        }

        .file-preview-count {
          font-size: 12px;
          color: var(--text-gray);
          margin-top: 6px;
          font-weight: 500;
        }

        .files-selected-tag {
          display: inline-flex;
          align-items: center;
          color: var(--secondary);
          background: rgba(0, 158, 150, 0.08);
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 11px;
        }

        .textarea {
          resize: none;
        }

        .submit-btn-form {
          padding: 16px 22px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 4px 15px var(--primary-light);
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }

        /* My Annonces Tab */
        .my-annonces-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 14px;
        }

        .my-annonce-card {
          display: flex;
          padding: 10px;
          gap: 12px;
          align-items: center;
          cursor: pointer;
        }

        .my-annonce-card img {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          object-fit: cover;
        }

        .my-annonce-details h4 {
          font-size: 14px;
        }

        .my-annonce-details p {
          font-size: 12px;
          color: var(--text-gray);
          margin-top: 2px;
        }

        .performance-row {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: var(--text-gray);
          font-weight: 600;
          margin-top: 6px;
        }

        /* Logout */
        .logout-btn-dashboard {
          width: 100%;
          background: rgba(234, 67, 53, 0.1);
          color: #ea4335;
          border: none;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
        }

        .logout-btn-dashboard:hover {
          background: rgba(234, 67, 53, 0.15);
        }

        /* Loading */
        .dashboard-loading {
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
          .dashboard-container {
            max-width: 1000px;
            margin: 0 auto;
            padding-top: 30px;
          }
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .stat-card.wide {
            grid-column: auto;
          }
          .demands-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .my-annonces-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
