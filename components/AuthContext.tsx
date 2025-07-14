import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user data on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedBookings = localStorage.getItem('bookings');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever user or bookings change
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
    localStorage.removeItem('user');
    localStorage.removeItem('bookings');
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

  const value: AuthContextType = {
    user,
    bookings,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    addBooking,
    cancelBooking,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 