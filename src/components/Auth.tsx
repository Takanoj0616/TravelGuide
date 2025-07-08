import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth } from '../config/firebase';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';

interface AuthProps {
  onAuthStateChange: (user: User | null) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthStateChange }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthStateChange(result.user);
    } catch (err) {
      setError(t('auth.googleError'));
      console.error('Google認証エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthStateChange(result.user);
    } catch (err) {
      setError(t('auth.facebookError'));
      console.error('Facebook認証エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onAuthStateChange(null);
    } catch (err) {
      setError(t('auth.signOutError'));
      console.error('サインアウトエラー:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('auth.title')}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          <span>{t('auth.signInWithGoogle')}</span>
        </button>

        <button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <img src="/facebook-icon.png" alt="Facebook" className="w-5 h-5" />
          <span>{t('auth.signInWithFacebook')}</span>
        </button>

        {auth.currentUser && (
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            {t('auth.signOut')}
          </button>
        )}
      </div>
    </div>
  );
}; 