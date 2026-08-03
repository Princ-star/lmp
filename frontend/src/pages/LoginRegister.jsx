import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister({ onAuthSuccess, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('locataire'); // 'locataire' or 'proprietaire'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  const isProprietaire = role === 'proprietaire';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (isRegister) {
      if (!email || !password || !nom || !prenom || !dateDeNaissance) {
        setErrorMsg('Veuillez remplir tous les champs obligatoires.');
        setSubmitting(false);
        return;
      }
      const res = await register(email, password, nom, prenom, dateDeNaissance, role);
      if (res.success) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.error);
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Veuillez renseigner votre email et mot de passe.');
        setSubmitting(false);
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.error);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-100 shadow-xl relative animate-fade-in">
        
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 transition"
        >
          ← Retour
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isRegister ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister 
              ? "Choisissez votre profil pour commencer sur LMP" 
              : "Connectez-vous à votre espace personnel"}
          </p>
        </div>

        {/* Role Toggle Commutator */}
        <div className="p-1.5 bg-gray-100 rounded-2xl flex gap-1 mb-6">
          <button 
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              role === 'locataire' 
                ? 'bg-terracotta text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setRole('locataire')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Locataire
          </button>

          <button 
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              role === 'proprietaire' 
                ? 'bg-emerald text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setRole('proprietaire')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            Propriétaire
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nom</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Prénom</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-300" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date de naissance</label>
                <input 
                  type="date" 
                  required
                  value={dateDeNaissance}
                  onChange={(e) => setDateDeNaissance(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-300" 
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Adresse Email</label>
            <input 
              type="email" 
              required
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-300" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-300" 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className={`w-full py-3 rounded-xl font-extrabold text-white shadow-md transition ${
              isProprietaire 
                ? 'bg-emerald hover:bg-emerald-600' 
                : 'bg-terracotta hover:bg-terracotta-600'
            }`}
          >
            {submitting ? "Chargement..." : (isRegister ? `S'inscrire comme ${isProprietaire ? 'Propriétaire' : 'Locataire'}` : "Se connecter")}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
          {isRegister ? (
            <p>Vous avez déjà un compte ? <button onClick={() => setIsRegister(false)} className="font-bold text-gray-900 underline">Se connecter</button></p>
          ) : (
            <p>Pas encore de compte ? <button onClick={() => setIsRegister(true)} className="font-bold text-gray-900 underline">Créer un compte</button></p>
          )}
        </div>

      </div>
    </div>
  );
}
