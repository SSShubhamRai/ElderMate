import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, User } from '../mocks/users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('eldermate_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('eldermate_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword as User);
          localStorage.setItem('eldermate_user', JSON.stringify(userWithoutPassword));
          
          // Redirect based on user role
          if (foundUser.role === 'elder') {
            navigate('/');
          } else {
            navigate('/caregiver');
          }
          
          resolve(true);
        } else {
          resolve(false);
        }
        
        setLoading(false);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('eldermate_user');
    navigate('/login');
  };

  // Register function
  const register = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockUsers.find(u => 
          u.email.toLowerCase() === newUser.email.toLowerCase()
        );
        
        if (existingUser) {
          resolve(false);
        } else {
          // In a real app, we would send this to the server
          // Here we'll just simulate a successful registration
          const userWithId = {
            ...newUser,
            id: (mockUsers.length + 1).toString(),
          };
          
          // Add to mock users (in a real app this would happen on the server)
          mockUsers.push(userWithId as User & { password: string });
          
          // Log the user in
          const { password, ...userWithoutPassword } = userWithId;
          setUser(userWithoutPassword as User);
          localStorage.setItem('eldermate_user', JSON.stringify(userWithoutPassword));
          
          // Redirect based on user role
          if (newUser.role === 'elder') {
            navigate('/');
          } else {
            navigate('/caregiver');
          }
          
          resolve(true);
        }
        
        setLoading(false);
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};