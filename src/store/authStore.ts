import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types pour l'utilisateur et l'abonnement
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  expiresAt?: Date;
  conversionsUsed: number;
  maxConversions: number;
}

interface AuthState {
  user: User | null;
  subscription: Subscription;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  incrementConversions: () => void;
  canConvert: () => boolean;
  logout: () => void;
}

const FREE_CONVERSIONS = 1; // 1 conversion gratuite
// const PRO_CONVERSIONS = -1; // Illimité pour les pro (-1 = illimité)

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      subscription: {
        plan: 'free',
        status: 'active',
        conversionsUsed: 0,
        maxConversions: FREE_CONVERSIONS,
      },
      isAuthenticated: false,
      isLoading: false,
      token: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setSubscription: (subscription) => set({ subscription }),

      setLoading: (loading) => set({ isLoading: loading }),

      setToken: (token) => set({ token }),

      incrementConversions: () => set((state) => ({
        subscription: {
          ...state.subscription,
          conversionsUsed: state.subscription.conversionsUsed + 1,
        },
      })),

      canConvert: () => {
        const { subscription } = get();
        
        // Si l'utilisateur est pro ou premium, il peut convertir
        if (subscription.plan === 'pro' || subscription.plan === 'premium') {
          return true;
        }
        
        // Si l'utilisateur est gratuit, vérifier le nombre de conversions
        return subscription.conversionsUsed < subscription.maxConversions;
      },

      logout: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
        subscription: {
          plan: 'free',
          status: 'active',
          conversionsUsed: 0,
          maxConversions: FREE_CONVERSIONS,
        },
      }),
    }),
    {
      name: 'auth-storage', // nom du stockage local
      partialize: (state) => ({ 
        user: state.user, 
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }), // ne pas persister isLoading
    }
  )
);

export default useAuthStore;
