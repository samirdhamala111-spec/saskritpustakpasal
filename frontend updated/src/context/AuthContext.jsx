import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('sh_token') || '');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
      if (activeToken) {
        const { ok, data } = await api.auth.getProfile(activeToken);
        if (ok) {
          setUser(data);
          setWishlist(data.wishlist || []);
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    const { ok, data } = await api.auth.login(email, password);
    if (ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        profilePic: data.profilePic || '',
      });
      setWishlist(data.wishlist || []);
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    const { ok, data } = await api.auth.register(name, email, password);
    if (ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        profilePic: data.profilePic || '',
      });
      setWishlist(data.wishlist || []);
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('token');
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_current_user');
  };

  const updateProfile = async (profileData) => {
    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    const { ok, data } = await api.auth.updateProfile(activeToken, profileData);
    if (ok) {
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        profilePic: data.profilePic || '',
      });
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Update failed' };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      return { success: false, message: 'Please login to use the Wishlist!' };
    }

    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('sh_token');
    const { ok, data } = await api.auth.toggleWishlist(activeToken, productId);
    if (ok) {
      setWishlist(data.wishlist || []);
      // If simulated mode, users' list was updated, update local state
      return { success: true, message: data.message, wishlist: data.wishlist };
    } else {
      return { success: false, message: data.message || 'Failed to toggle wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        wishlist,
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isInWishlist,
        API_URL: 'http://localhost:5000/api', // keep for back compat
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
