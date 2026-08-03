import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me/');
      const data = await response.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, error: data.error || 'Identifiants invalides' };
      }
    } catch (error) {
      return { success: false, error: 'Une erreur est survenue lors de la connexion' };
    }
  };

  const register = async (email, password, nom, prenom, date_de_naissance, type_utilisateur = 'locataire') => {
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom, prenom, date_de_naissance, type_utilisateur }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, error: data.error || 'Erreur lors de l\'inscription' };
      }
    } catch (error) {
      return { success: false, error: 'Une erreur est survenue lors de l\'inscription' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout/', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
