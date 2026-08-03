import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail({ id, onBack, onContactOwner, favorites, toggleFavorite, openToast }) {
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Visit scheduling form state
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [submittingVisit, setSubmittingVisit] = useState(false);

  const { user } = useAuth();
  const isFav = favorites.includes(id);

  const fetchAnnonceDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/annonces/${id}/`);
      const data = await response.json();
      setAnnonce(data);
      // Increment views count
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
      if (openToast) openToast("Veuillez vous connecter pour envoyer un message.", "error");
      onContactOwner(null, true);
      return;
    }
    onContactOwner(annonce.utilisateurs.id);
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!user) {
      if (openToast) openToast("Veuillez vous connecter pour planifier une visite.", "error");
      return;
    }
    if (!visitDate || !visitTime) {
      if (openToast) openToast("Veuillez spécifier la date et l'heure.", "error");
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
        setShowVisitModal(false);
        if (openToast) openToast("Demande de visite transmise avec succès au propriétaire !", "success");
      } else {
        const err = await response.json();
        if (openToast) openToast(err.error || "Erreur lors de l'envoi de la demande.", "error");
      }
    } catch (error) {
      if (openToast) openToast("Impossible de planifier la visite.", "error");
    } finally {
      setSubmittingVisit(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Chargement des détails...</div>;
  }

  if (!annonce) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl text-center border border-gray-100 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Annonce introuvable</h3>
        <p className="text-sm text-gray-500 mb-6">Ce logement n'existe plus ou a été retiré.</p>
        <button onClick={onBack} className="px-6 py-2.5 bg-terracotta text-white font-bold rounded-xl text-sm">
          ← Retour aux offres
        </button>
      </div>
    );
  }

  const images = annonce.images && annonce.images.length > 0 
    ? annonce.images.map(img => img.image_url)
    : [annonce.photo_principale || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Back & Share Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition"
        >
          ← Retour
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              if (openToast) openToast("Lien de l'annonce copié dans le presse-papiers !", "success");
            }}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>
          <button 
            onClick={() => toggleFavorite(annonce.id)}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-terracotta transition shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={isFav ? 'text-red-500' : 'text-gray-500'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Gallery */}
        <div className="space-y-3">
          <div className="h-80 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <img src={images[selectedImage]} alt="Property" className="w-full h-full object-cover" />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    idx === selectedImage ? 'border-terracotta' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, Owner & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-xs font-extrabold uppercase">
              Location
            </span>
            <h1 className="text-2xl font-black text-gray-900">
              {annonce.get_standing_display || annonce.standing} à {annonce.quartier}
            </h1>
            <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {annonce.quartier}, Abomey-Calavi / Cotonou
            </p>

            <div className="pt-2">
              <span className="text-3xl font-black text-terracotta">
                {Number(annonce.prix).toLocaleString()} FCFA
              </span>
              <span className="text-sm font-normal text-gray-500"> /mois</span>
            </div>
          </div>

          {/* Owner Info Box */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                {annonce.utilisateurs.prenom[0]}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{annonce.utilisateurs.prenom} {annonce.utilisateurs.nom}</h4>
                <span className="text-xs text-gray-500 font-semibold">Propriétaire bailleur</span>
              </div>
            </div>

            <button 
              onClick={handleContactClick}
              className="px-4 py-2.5 bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Envoyer un message
            </button>
          </div>

          {/* Schedule Visit Button */}
          <button 
            onClick={() => setShowVisitModal(true)}
            className="w-full py-3.5 bg-emerald text-white font-extrabold rounded-2xl shadow-md hover:bg-emerald-600 transition text-sm flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Demander une visite du logement
          </button>
        </div>

        {/* Description Full Row */}
        <div className="md:col-span-2 pt-6 border-t border-gray-100 space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Description du logement</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {annonce.description || "Aucune description complémentaire renseignée par le propriétaire."}
          </p>
        </div>

      </div>

      {/* Visit Booking Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Planifier une visite</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-gray-400 font-bold hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleScheduleVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date souhaitée</label>
                <input 
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Heure de rendez-vous</label>
                <input 
                  type="time"
                  required
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingVisit}
                className="w-full py-3 bg-emerald text-white font-bold rounded-xl text-sm shadow hover:bg-emerald-600 transition"
              >
                {submittingVisit ? "Envoi..." : "Confirmer la demande de visite"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
