import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('Auth error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        try {
          // For email confirmation or password reset
          // You can implement specific logic here
          navigate('/dashboard');
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
        }
      } else {
        // No token provided, redirect to login
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
