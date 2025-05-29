import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase'




interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string, name: string, city: string) => Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

 

// Mock user data
const MOCK_USER: User = {
  id: 'mock-user-123',
  name: 'Test User',
  email: 'test@example.com',
  avatar_url: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session) {
        throw new Error(error?.message || 'Login failed');
      }

      const { user } = data;

      // Optional: Fetch profile info from your `users` table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUser({
        id: user.id,
        email: user.email!,
        name: profile?.full_name || '',
        avatar_url: profile?.avatar_url || ''
      });

      localStorage.setItem('mockUser', JSON.stringify({
        id: user.id,
        email: user.email,
        name: profile?.full_name || '',
        avatar_url: profile?.avatar_url || ''
      }));

      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, city: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, city }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      const user = data.user;
      if (user) {
        // Insert to users table immediately
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email,
          full_name: name,
          city,
          has_onboarded: false
        });

        if (insertError) {
          console.error('Error inserting user to users table:', insertError.message);
          // fallback is still handled in onAuthStateChange if needed
        }
      }

      toast.success('Check your email to confirm your account');
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    navigate('/login');
    toast.success('Successfully logged out!');
  };

  // Protect routes that require authentication
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;

          const { data: existing, error } = await supabase
            .from('users')
            .select('id, has_onboarded')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Failed to fetch user profile:', error.message);
            return;
          }

          if (!existing) {
            await supabase.from('users').insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name,
              city: user.user_metadata?.city,
              has_onboarded: false
            });

            navigate('/profile/onboarding');
          } else if (existing.has_onboarded === false) {
            navigate('/profile/onboarding');
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};