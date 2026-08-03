import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onSelectAnnonce, openToast }) {
  const { user, logout } = useAuth();
  const isProprietaire = user?.type_utilisateur === 'proprietaire' || user?.is_admin;

  const [stats, setStats] = useState({ total_annonces: 0, visites_planifiees: 0, taux_occupation: 100 });
  const [myAnnonces, setMyAnnonces] = useState([]);
  const [demandesVisite, setDemandesVisite] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs for Proprietaire: 'overview', 'annonces', 'visites', 'publier'
  // Tabs for Locataire: 'visites', 'profil'
  const [activeTab, setActiveTab] = useState(isProprietaire ? 'overview' : 'visites');

  // Multi-step publication wizard state (3 steps)
  const [step, setStep] = useState(1);
  const [standing, setStanding] = useState('1ch_salon');
  const [quartier, setQuartier] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
    { value: 'quest_house', label: "Guest house" }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats || { total_annonces: 0, visites_planifiees: 0, taux_occupation: 100 });
        setMyAnnonces(data.my_annonces || []);
        setDemandesVisite(data.demandes_visite || []);
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRespondVisit = async (id, status) => {
    try {
      const response = await fetch(`/api/visites/${id}/repondre/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: status })
      });
      if (response.ok) {
        if (openToast) {
          openToast(status === 'acceptee' ? "Demande de visite acceptée !" : "Demande de visite refusée.", "success");
        }
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error responding to visit:", error);
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    if (!quartier || !prix || !phone) {
      if (openToast) openToast("Veuillez remplir les informations obligatoires.", "error");
      return;
    }

    try {
      setSubmittingForm(true);
      const formData = new FormData();
      formData.append('type_annonce', 'location');
      formData.append('standing', standing);
      formData.append('quartier', quartier);
      formData.append('prix', prix);
      formData.append('description', description);
      formData.append('numero_telephone', phone);
      formData.append('est_publiee', 'true');

      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }

      const response = await fetch('/api/annonces/creer/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        if (openToast) openToast("Votre annonce de location a été publiée avec succès !", "success");
        // Reset form
        setStep(1);
        setQuartier('');
        setPrix('');
        setDescription('');
        setPhone('');
        setImageFiles([]);
        setImagePreviews([]);
        setActiveTab('annonces');
        fetchDashboardData();
      } else {
        const err = await response.json();
        if (openToast) openToast(err.error || "Erreur lors de la publication.", "error");
      }
    } catch (error) {
      console.error("Error publishing property:", error);
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top Header Card */}
      <div className={`rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isProprietaire 
          ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800' 
          : 'bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-amber-700'
      }`}>
        <div>
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Espace {isProprietaire ? 'Propriétaire / Bailleurs' : 'Locataire'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Bonjour, {user?.prenom} {user?.nom}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {isProprietaire 
              ? "Gérez vos logements et répondez aux demandes de visite" 
              : "Suivez vos demandes de visite et vos favoris"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isProprietaire && (
            <button 
              onClick={() => setActiveTab('publier')}
              className="px-5 py-3 bg-white text-emerald-700 font-extrabold rounded-2xl shadow hover:bg-gray-50 transition text-sm flex items-center gap-2"
            >
              <span>+</span> Publier une offre
            </button>
          )}
          <button 
            onClick={logout}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition text-sm"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-8 overflow-x-auto">
        {isProprietaire ? (
          <>
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'overview' ? 'bg-emerald text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Aperçu & Stats
            </button>
            <button 
              onClick={() => setActiveTab('annonces')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'annonces' ? 'bg-emerald text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mes Annonces ({myAnnonces.length})
            </button>
            <button 
              onClick={() => setActiveTab('visites')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'visites' ? 'bg-emerald text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Demandes reçues ({demandesVisite.length})
            </button>
            <button 
              onClick={() => setActiveTab('publier')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'publier' ? 'bg-emerald text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              + Nouvelle Annonce
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setActiveTab('visites')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'visites' ? 'bg-terracotta text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mes Demandes de Visites ({demandesVisite.length})
            </button>
            <button 
              onClick={() => setActiveTab('profil')} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === 'profil' ? 'bg-terracotta text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mon Profil
            </button>
          </>
        )}
      </div>

      {/* ================= PROPRIETAIRE VIEWS ================= */}
      {isProprietaire && (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                    🏠
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-400">Annonces Actives</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">{stats.total_annonces}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                    📅
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-400">Visites Sollicitées</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">{stats.visites_planifiees}</h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-400">Taux de réponse</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">100%</h3>
                  </div>
                </div>
              </div>

              {/* Quick List */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mes dernières annonces</h3>
                {myAnnonces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Vous n'avez pas encore publié d'annonce.</p>
                    <button onClick={() => setActiveTab('publier')} className="mt-3 px-4 py-2 bg-emerald text-white rounded-xl text-sm font-bold">
                      Publier votre premier bien
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myAnnonces.slice(0, 3).map((item) => (
                      <div key={item.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                        <h4 className="font-bold text-gray-900 truncate">{item.titre}</h4>
                        <span className="text-xs text-gray-500">{item.quartier}</span>
                        <div className="text-emerald font-extrabold text-sm mt-2">
                          {Number(item.prix).toLocaleString()} FCFA/mois
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'annonces' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900">Toutes mes offres publiées</h2>
                <button onClick={() => setActiveTab('publier')} className="px-4 py-2 bg-emerald text-white rounded-xl font-bold text-sm">
                  + Ajouter
                </button>
              </div>

              {myAnnonces.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <p className="text-gray-500">Aucune annonce publiée.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAnnonces.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                      <div className="h-44 bg-gray-100 relative">
                        {item.photo_principale ? (
                          <img src={item.photo_principale} alt={item.titre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Sans image</div>
                        )}
                        <span className="absolute top-3 left-3 bg-emerald text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Location
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-gray-500 font-semibold">{item.quartier}</span>
                          <h3 className="font-bold text-gray-900 text-base line-clamp-1">{item.titre}</h3>
                          <div className="text-emerald font-extrabold text-lg mt-1">
                            {Number(item.prix).toLocaleString()} FCFA <span className="text-xs font-normal text-gray-500">/mois</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                          <button onClick={() => onSelectAnnonce(item.id)} className="text-xs font-bold text-gray-700 hover:text-emerald">
                            Voir la fiche →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visites' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Demandes de visite reçues</h2>
              {demandesVisite.length === 0 ? (
                <p className="text-gray-500 py-6 text-center">Aucune demande de visite en attente.</p>
              ) : (
                <div className="space-y-3">
                  {demandesVisite.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-gray-900">{item.locataire_nom || 'Locataire intéressé'}</div>
                        <div className="text-xs text-gray-500">Pour le logement : {item.annonce_titre || 'Bien #'+item.annonce}</div>
                        <div className="text-xs text-gray-400 mt-1">Date souhaitée : {new Date(item.date_visite).toLocaleString('fr-FR')}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.statut === 'en_attente' ? (
                          <>
                            <button 
                              onClick={() => handleRespondVisit(item.id, 'acceptee')}
                              className="px-4 py-2 bg-emerald text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-600 transition"
                            >
                              Accepter
                            </button>
                            <button 
                              onClick={() => handleRespondVisit(item.id, 'refusee')}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-300 transition"
                            >
                              Refuser
                            </button>
                          </>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.statut === 'acceptee' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.statut === 'acceptee' ? 'Acceptée' : 'Refusée'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MULTI-STEP PUBLICATION FORM (WIZARD) */}
          {activeTab === 'publier' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-md">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Publier une offre de location</h2>
                <p className="text-sm text-gray-500 mt-1">Formulaire rapide en 3 étapes simples</p>
                
                {/* Step indicator */}
                <div className="flex items-center justify-between mt-4">
                  <div className={`flex-1 text-center py-2 text-xs font-bold border-b-2 ${step >= 1 ? 'border-emerald text-emerald' : 'border-gray-200 text-gray-400'}`}>
                    1. Type & Lieu
                  </div>
                  <div className={`flex-1 text-center py-2 text-xs font-bold border-b-2 ${step >= 2 ? 'border-emerald text-emerald' : 'border-gray-200 text-gray-400'}`}>
                    2. Prix & Contact
                  </div>
                  <div className={`flex-1 text-center py-2 text-xs font-bold border-b-2 ${step >= 3 ? 'border-emerald text-emerald' : 'border-gray-200 text-gray-400'}`}>
                    3. Photos & Description
                  </div>
                </div>
              </div>

              <form onSubmit={handlePublishSubmit} className="space-y-6">
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Standing du bien</label>
                      <select 
                        value={standing}
                        onChange={(e) => setStanding(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald/20"
                      >
                        {standings.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Quartier / Ville *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Cadjehoun, Calavi Kpota, Fidjrossè..."
                        value={quartier}
                        onChange={(e) => setQuartier(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald/20"
                      />
                    </div>

                    <button 
                      type="button" 
                      onClick={() => { if(quartier) setStep(2); else if(openToast) openToast("Précisez le quartier", "error"); }}
                      className="w-full py-3 bg-emerald text-white font-extrabold rounded-xl hover:bg-emerald-600 transition shadow-md mt-4"
                    >
                      Suivant →
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Loyer mensuel (FCFA) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="Ex: 85000"
                        value={prix}
                        onChange={(e) => setPrix(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Numéro de téléphone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Ex: +229 97000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald/20"
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                      >
                        ← Retour
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { if(prix && phone) setStep(3); else if(openToast) openToast("Précisez le prix et téléphone", "error"); }}
                        className="flex-1 py-3 bg-emerald text-white font-extrabold rounded-xl hover:bg-emerald-600 transition shadow-md"
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Photos du logement</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-emerald transition cursor-pointer relative bg-gray-50">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="text-gray-500 font-medium text-sm">
                          📷 Cliquez ici pour ajouter des photos
                        </div>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {imagePreviews.map((src, i) => (
                            <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-gray-200">
                              <img src={src} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description complémentaire</label>
                      <textarea 
                        rows={4}
                        placeholder="Présentez les atouts du logement (compteur personnel, eau, proximité goudron...)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald/20"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                      >
                        ← Retour
                      </button>
                      <button 
                        type="submit" 
                        disabled={submittingForm}
                        className="flex-1 py-3 bg-emerald text-white font-extrabold rounded-xl hover:bg-emerald-600 transition shadow-lg"
                      >
                        {submittingForm ? "Publication..." : "Publier mon annonce ✓"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </>
      )}

      {/* ================= LOCATAIRE VIEWS ================= */}
      {!isProprietaire && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Mes demandes de visite transmises</h2>
            {demandesVisite.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Vous n'avez envoyé aucune demande de visite pour l'instant.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {demandesVisite.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Demande pour le bien #{item.annonce}</div>
                      <div className="text-xs text-gray-500">Date demandée : {new Date(item.date_visite).toLocaleString('fr-FR')}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.statut === 'acceptee' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : item.statut === 'refusee' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.statut === 'acceptee' ? 'Acceptée par le proprio' : item.statut === 'refusee' ? 'Refusée' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
