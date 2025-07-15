import React, { createContext, useContext, useState, useEffect } from 'react';
import { trips as tripsData } from '../data/trips';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  joinDate: string;
}

interface Booking {
  id: string;
  tripId: number;
  tripName: string;
  tripLocation: string;
  startDate: string;
  participants: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
}

export interface CartItem {
  id: number; // trip id
  name: string;
  image: string;
  price: number;
  quantity: number;
  location: string;
  duration: string;
}

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
  cart: CartItem[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate'>) => void;
  cancelBooking: (bookingId: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (tripId: number) => void;
  clearCart: () => void;
  updateCartItem: (tripId: number, quantity: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user data on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedBookings = localStorage.getItem('bookings');
    const savedCart = localStorage.getItem('cart');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever user, bookings, or cart change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      const newUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        joinDate: '2024-01-15'
      };
      setUser(newUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('bookings');
    localStorage.removeItem('cart');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    setIsLoading(false);
    return true;
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'bookingDate'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
  };

  // CART ACTIONS
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci);
      }
      return [item, ...prev];
    });
  };

  const removeFromCart = (tripId: number) => {
    setCart(prev => prev.filter(ci => ci.id !== tripId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCartItem = (tripId: number, quantity: number) => {
    setCart(prev => prev.map(ci => ci.id === tripId ? { ...ci, quantity } : ci));
  };

  const value: AuthContextType = {
    user,
    bookings,
    cart,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    addBooking,
    cancelBooking,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// TRIPS CONTEXT
interface Trip {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: number;
  difficulty: string;
  image: string;
  description: string;
  bestTime: string;
  altitude: string;
  groupSize: string;
  itinerary: any[];
  inclusions: string[];
  exclusions: string[];
}

const TripsContext = createContext<Trip[] | undefined>(undefined);
export const useTrips = () => {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
};

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    setTrips(tripsData);
  }, []);
  return (
    <TripsContext.Provider value={trips}>
      {children}
    </TripsContext.Provider>
  );
}; 