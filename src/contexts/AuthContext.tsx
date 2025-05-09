
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to validate credentials
      // In a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      
      // Find matching user
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === hashPassword(password)
      );
      
      if (!foundUser) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return false;
      }
      
      // Create session user (omit password)
      const sessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };
      
      // Store in localStorage and state
      localStorage.setItem('auth_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      toast.success("Login successful!");
      setIsLoading(false);
      return true;
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to register user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        toast.error("Email already in use");
        setIsLoading(false);
        return false;
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword(password)
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create session user (omit password)
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      // Store in localStorage and state
      localStorage.setItem('auth_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      toast.success("Account created successfully!");
      setIsLoading(false);
      return true;
      
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/auth');
    toast.info("You have been logged out");
  };

  // Simple password hashing (for demo purposes only)
  // In production, use a proper hashing library like bcrypt
  const hashPassword = (password: string): string => {
    // This is NOT secure, just for demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
