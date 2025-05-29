import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (phone: string, pin: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (phone: string, pin: string) => {
    try {
      set({ loading: true, error: null });
      
      // Mock credentials check
      if (phone === '+1234567890' && pin === '123456') {
        const mockUser = {
          id: 'mock-user-123',
          name: 'Test User',
          email: 'test@example.com',
          avatar_url: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg'
        };
        set({ user: mockUser });
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: () => {
    localStorage.removeItem('mockUser');
    set({ user: null });
  }
}));

// Initialize auth state from localStorage
const storedUser = localStorage.getItem('mockUser');
if (storedUser) {
  useAuthStore.setState({ user: JSON.parse(storedUser), loading: false });
}