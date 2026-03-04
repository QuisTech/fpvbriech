import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Shield, ArrowRight, Plane, LogIn, Mail, Hash, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatServiceNumberToEmail, DEFAULT_PARTICIPANT_PASSWORD } from '../lib/participants';

export function LoginView() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithFacebook, loginAsGuest, isDemo } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMode, setLoginMode] = useState<'email' | 'service'>('email');
  const [email, setEmail] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMode === 'service') {
        // Service Number Login Logic
        const formattedEmail = formatServiceNumberToEmail(serviceNumber);
        // If password is empty, try default password? No, let user enter it.
        // But for convenience, maybe hint it?
        await loginWithEmail(formattedEmail, password);
      } else {
        // Standard Email Login/Register
        if (isLogin) {
          await loginWithEmail(email, password);
        } else {
          await registerWithEmail(email, password, name);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (loginMode === 'service') {
        setError('Invalid Service Number or Password. Please check your credentials.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithFacebook();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Facebook sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 mb-4 border border-blue-500/30">
            <Plane size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {loginMode === 'service' ? 'Participant Login' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          <p className="text-zinc-400">
            {loginMode === 'service' 
              ? 'Enter your Service Number to access the portal' 
              : (isLogin ? 'Sign in to access your flight training portal' : 'Join the Briech UAS training program')}
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          
          {isDemo && (
            <div className="absolute top-0 left-0 right-0 bg-yellow-500/10 border-b border-yellow-500/20 py-1.5 px-4 flex items-center justify-center gap-2">
              <AlertTriangle size={14} className="text-yellow-500" />
              <span className="text-xs font-medium text-yellow-500 uppercase tracking-wide">Demo Mode Active</span>
            </div>
          )}

          {/* Login Mode Toggle */}
          <div className={`flex p-1 bg-zinc-950 rounded-lg border border-zinc-800 ${isDemo ? 'mt-6' : ''}`}>
            <button
              onClick={() => setLoginMode('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMode === 'email' 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Email / Social
            </button>
            <button
              onClick={() => setLoginMode('service')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMode === 'service' 
                  ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/20' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Service Number
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {loginMode === 'email' && !isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {loginMode === 'email' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Service Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={serviceNumber}
                    onChange={(e) => setServiceNumber(e.target.value)}
                    placeholder="e.g. N/17073"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginMode === 'service' ? "Enter password (default: password123)" : "••••••••"}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {loginMode === 'service' ? 'Login with Service Number' : (isLogin ? 'Sign In' : 'Create Account')} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {loginMode === 'email' && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors font-medium text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button
                  onClick={handleFacebookLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#1877F2] text-white hover:bg-[#1864D9] transition-colors font-medium text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}
          
          <div className="pt-4 border-t border-zinc-800">
             <button
              onClick={loginAsGuest}
              className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Continue as Guest (Demo)
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Protected by enterprise-grade security. <br />
          Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
