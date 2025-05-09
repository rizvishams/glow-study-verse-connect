
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import DigitalClock from '@/components/DigitalClock';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  
  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  
  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [signupEmailError, setSignupEmailError] = useState('');
  const [signupPasswordError, setSignupPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error messages
    setLoginEmailError('');
    setLoginPasswordError('');
    
    // Validate fields
    let isValid = true;
    
    if (!loginEmail) {
      setLoginEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(loginEmail)) {
      setLoginEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!loginPassword) {
      setLoginPasswordError('Password is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Attempt login
    const success = await login(loginEmail, loginPassword);
    
    setIsLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };
  
  // Handle signup form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error messages
    setFirstNameError('');
    setLastNameError('');
    setSignupEmailError('');
    setSignupPasswordError('');
    setConfirmPasswordError('');
    
    // Validate fields
    let isValid = true;
    
    if (!firstName) {
      setFirstNameError('First name is required');
      isValid = false;
    }
    
    if (!lastName) {
      setLastNameError('Last name is required');
      isValid = false;
    }
    
    if (!signupEmail) {
      setSignupEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(signupEmail)) {
      setSignupEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!signupPassword) {
      setSignupPasswordError('Password is required');
      isValid = false;
    } else if (signupPassword.length < 8) {
      setSignupPasswordError('Password must be at least 8 characters');
      isValid = false;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== signupPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Attempt signup
    const fullName = `${firstName} ${lastName}`;
    const success = await signup(fullName, signupEmail, signupPassword);
    
    setIsLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative min-h-screen py-20 flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-background"></div>
        
        {/* Animated background */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-neon"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-neon"></div>
        
        <div className="container relative z-10 px-4 py-10">
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <DigitalClock />
            </div>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Welcome</CardTitle>
                <CardDescription>Login or create an account to get started</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input 
                            id="login-email" 
                            type="email" 
                            placeholder="you@example.com" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className={loginEmailError ? "border-red-500" : ""}
                          />
                          {loginEmailError && (
                            <p className="text-red-500 text-xs mt-1">{loginEmailError}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password">Password</Label>
                            <a href="#" className="text-xs text-neon-cyan hover:underline">
                              Forgot password?
                            </a>
                          </div>
                          <div className="relative">
                            <Input 
                              id="login-password" 
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className={loginPasswordError ? "border-red-500" : ""}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {loginPasswordError && (
                            <p className="text-red-500 text-xs mt-1">{loginPasswordError}</p>
                          )}
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-neon-purple to-neon-pink"
                          disabled={isLoading}
                        >
                          {isLoading ? "Logging in..." : "Login"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input 
                              id="firstName" 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className={firstNameError ? "border-red-500" : ""}
                            />
                            {firstNameError && (
                              <p className="text-red-500 text-xs mt-1">{firstNameError}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input 
                              id="lastName" 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className={lastNameError ? "border-red-500" : ""}
                            />
                            {lastNameError && (
                              <p className="text-red-500 text-xs mt-1">{lastNameError}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="you@example.com" 
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className={signupEmailError ? "border-red-500" : ""}
                          />
                          {signupEmailError && (
                            <p className="text-red-500 text-xs mt-1">{signupEmailError}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Input 
                              id="signup-password" 
                              type={showPassword ? "text" : "password"}
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              className={signupPasswordError ? "border-red-500" : ""}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {signupPasswordError && (
                            <p className="text-red-500 text-xs mt-1">{signupPasswordError}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={confirmPasswordError ? "border-red-500" : ""}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {confirmPasswordError && (
                            <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
                          )}
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-neon-purple to-neon-pink"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-white/10">
                    Google
                  </Button>
                  <Button variant="outline" className="border-white/10">
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
