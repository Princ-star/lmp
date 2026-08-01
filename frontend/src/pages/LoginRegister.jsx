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
      const res = await register(email, password, nom, prenom, dateDeNaissance);
      if (res.success) {
        onAuthSuccess();
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
        onAuthSuccess();
      } else {
        setErrorMsg(res.error);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className={`login-container ${role === 'proprietaire' ? 'theme-proprietaire' : 'theme-locataire'} animate-fade-in`}>
      <div className="login-card glass-panel">
        <button className="back-arrow-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 19-7-7 7-7"/>
          </svg>
          <span>Retour</span>
        </button>

        <div className="login-header">
          <h1 className="login-title">{isRegister ? "Créez votre compte" : "Bon retour"}</h1>
          <p className="login-subtitle">
            {isRegister 
              ? "Rejoignez LMP pour trouver ou publier des logements" 
              : "Connectez-vous pour accéder à votre espace"}
          </p>
        </div>

        {/* Role Toggle Commutator */}
        <div className="role-toggle-bar glass-panel">
          <button 
            type="button"
            className={`role-btn ${role === 'locataire' ? 'active' : ''}`}
            onClick={() => setRole('locataire')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Locataire
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'proprietaire' ? 'active' : ''}`}
            onClick={() => setRole('proprietaire')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Propriétaire
          </button>
        </div>

        {errorMsg && (
          <div className="error-alert animate-fade-in">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Nom</label>
                  <input 
                    type="text" 
                    placeholder="Nom"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="glass-input" 
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Prénom</label>
                  <input 
                    type="text" 
                    placeholder="Prénom"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="glass-input" 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Date de naissance</label>
                <input 
                  type="date" 
                  required
                  value={dateDeNaissance}
                  onChange={(e) => setDateDeNaissance(e.target.value)}
                  className="glass-input" 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Adresse Email</label>
            <input 
              type="email" 
              placeholder="Ex: urielatihou5@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input" 
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Mot de passe</label>
              {!isRegister && <span className="forgot-pass">Oublié ?</span>}
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input" 
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full submit-btn">
            {submitting ? "Patientez..." : (isRegister ? "S'inscrire" : "Se connecter")}
          </button>
        </form>

        <div className="social-login-separator">
          <span>Ou continuer avec</span>
        </div>

        <button className="google-auth-btn glass-panel w-full">
          <svg viewBox="0 0 24 24" width="18" height="18" className="google-logo">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19 0-3.41 2.78-6.19 6.19-6.19 1.488 0 2.857.536 3.924 1.428l3.14-3.14C18.91 1.765 15.772 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.87-4.14 10.87-11.24 0-.693-.07-1.373-.18-1.955H12.24Z"/>
          </svg>
          Google
        </button>

        <div className="toggle-auth-mode">
          {isRegister ? (
            <p>Vous avez déjà un compte ? <span onClick={() => setIsRegister(false)}>Se connecter</span></p>
          ) : (
            <p>Vous n'avez pas de compte ? <span onClick={() => setIsRegister(true)}>S'inscrire</span></p>
          )}
        </div>
      </div>

      <style>{`
        .login-container {
          padding: 85px 16px 20px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 85vh;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 24px;
        }

        .back-arrow-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-gray);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 20px;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .back-arrow-btn:hover {
          color: var(--text-dark);
          background: rgba(0,0,0,0.02);
        }

        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .login-title {
          font-size: 24px;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 13px;
          color: var(--text-gray);
        }

        .role-toggle-bar {
          display: flex;
          padding: 4px;
          background: rgba(240, 235, 230, 0.4);
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-gray);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }

        .error-alert {
          display: flex;
          align-items: flex-start;
          background: rgba(234, 67, 53, 0.08);
          border: 1px solid rgba(234, 67, 53, 0.15);
          color: #ea4335;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 18px;
          gap: 8px;
          font-size: 13px;
        }

        .error-alert span {
          font-weight: 700;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .flex-1 {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-gray);
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-pass {
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
        }

        .submit-btn {
          margin-top: 6px;
        }

        .social-login-separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--text-gray);
          font-size: 12px;
        }

        .social-login-separator::before,
        .social-login-separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .social-login-separator::before {
          margin-right: 10px;
        }

        .social-login-separator::after {
          margin-left: 10px;
        }

        .google-auth-btn {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          color: var(--text-dark);
          transition: all 0.2s ease;
        }

        .google-auth-btn:hover {
          background: rgba(0,0,0,0.01);
          border-color: rgba(0,0,0,0.15);
        }

        .google-logo {
          margin-top: 1px;
        }

        .toggle-auth-mode {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-gray);
        }

        .toggle-auth-mode span {
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
        }

        .toggle-auth-mode span:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
