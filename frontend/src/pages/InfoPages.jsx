import React, { useState } from 'react';

export default function InfoPages({ pageType, onBack, onNavigateToTab }) {
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSentSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition"
      >
        ← Retour
      </button>

      {pageType === 'contact' && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Nous contacter</h1>
            <p className="text-gray-500 mt-2">Une question ou une demande d'accompagnement ? Notre équipe vous répond sous 24h.</p>
          </div>

          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center text-emerald-800">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-bold text-lg">Message envoyé avec succès !</h3>
              <p className="text-sm text-emerald-700 mt-1">Merci de nous avoir contactés. Nous reviendrons vers vous rapidement.</p>
              <button 
                onClick={() => setSentSuccess(false)} 
                className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-sm"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sujet</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Demande de renseignement, signalement..."
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Votre message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Décrivez votre besoin..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta-600 transition shadow-md"
              >
                Envoyer mon message
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="block text-xs font-bold text-gray-400 uppercase">Téléphone / WhatsApp</span>
              <span className="font-bold text-gray-800 text-sm mt-1 block">+229 90 00 00 00</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="block text-xs font-bold text-gray-400 uppercase">Email</span>
              <span className="font-bold text-gray-800 text-sm mt-1 block">contact@lmp-benin.com</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="block text-xs font-bold text-gray-400 uppercase">Siège social</span>
              <span className="font-bold text-gray-800 text-sm mt-1 block">Abomey-Calavi, Bénin</span>
            </div>
          </div>
        </div>
      )}

      {pageType === 'cgu' && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">Conditions Générales d'Utilisation (CGU)</h1>
          <p className="text-sm text-gray-500">Dernière mise à jour : Août 2026</p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">1. Objet de la plateforme</h2>
            <p>LMP (Location Maison Plus) est une plateforme de mise en relation directe entre propriétaires bailleurs et personnes à la recherche d'une location immobilière au Bénin (Cotonou, Abomey-Calavi et environs).</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">2. Inscription et responsabilités</h2>
            <p>Les utilisateurs s'engagent à fournir des informations exactes lors de la création de leur compte et de la publication de leurs annonces de location. La fausse déclaration de bien ou de loyer est strictement interdite.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">3. Modalités de visite</h2>
            <p>Les demandes de visite effectuées via la plateforme engagent le locataire et le propriétaire à respecter les rendez-vous fixés d'un commun accord.</p>
          </section>
        </div>
      )}

      {pageType === 'confidentialite' && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">Politique de Confidentialité</h1>
          <p className="text-sm text-gray-500">Protection de vos données personnelles</p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">1. Collecte des données</h2>
            <p>LMP collecte uniquement les données nécessaires à votre expérience de recherche et de gestion locative : Nom, Prénom, Email, Numéro de téléphone et préférences de logement.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">2. Utilisation et protection</h2>
            <p>Vos coordonnées de contact ne sont partagées avec les propriétaires qu'en cas d'interaction directe ou de confirmation de demande de visite. Aucune donnée n'est revendue à des tiers.</p>
          </section>
        </div>
      )}

      {pageType === 'a-propos' && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">À propos de LMP</h1>

          <p className="text-base">
            LMP (Location Maison Plus) est la solution moderne pour simplifier l'accès au logement au Bénin. Notre mission est d'éliminer les intermédiaires douteux et de garantir des logements vérifiés et accessibles directement auprès des propriétaires.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-6 bg-terracotta-50 rounded-2xl border border-terracotta-100">
              <h3 className="font-bold text-terracotta-700 text-lg mb-2">Pour les Locataires</h3>
              <p className="text-sm text-gray-600">Trouvez une chambre, un appartement ou une villa sans frais cachés et échangez directement avec le bailleur.</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-emerald-700 text-lg mb-2">Pour les Propriétaires</h3>
              <p className="text-sm text-gray-600">Publiez votre bien en quelques étapes et gérez les demandes de visites reçues directement depuis votre tableau de bord.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
