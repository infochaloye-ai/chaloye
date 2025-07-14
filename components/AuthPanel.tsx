import React, { useState, useEffect } from 'react';
import { Mountain, Facebook, Github, Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

// Local storage helpers
function getUsers() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('letmetrek_accounts') || '[]');
  } catch {
    return [];
  }
}
function setUsers(users: any[]) {
  localStorage.setItem('letmetrek_accounts', JSON.stringify(users));
}
function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('letmetrek_user') || 'null');
  } catch {
    return null;
  }
}
function setCurrentUser(user: any) {
  localStorage.setItem('letmetrek_user', JSON.stringify(user));
}
function removeCurrentUser() {
  localStorage.removeItem('letmetrek_user');
}

const AuthPanel = ({
  mode,
  onAuth,
  setMode,
  hideClose
}: {
  mode: 'login' | 'signup' | 'forgot',
  onAuth?: (email: string, password: string, mode: 'login' | 'signup') => Promise<void>;
  setMode: (mode: 'login' | 'signup' | 'forgot') => void;
  hideClose?: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [remember, setRemember] = useState(false);
  useEffect(() => {
    setEmail(''); setPassword(''); setError(''); setSent(false);
  }, [mode]);
  const isLogin = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';

  // Local auth logic
  async function handleAuth(email: string, password: string, mode: 'login' | 'signup') {
    if (!email || !password) throw new Error('Email and password required');
    let users = getUsers();
    if (mode === 'signup') {
      if (users.find((u: any) => u.email === email)) {
        throw new Error('Email already registered');
      }
      const newUser = { email, password };
      users.push(newUser);
      setUsers(users);
      setCurrentUser(newUser);
      return;
    }
    if (mode === 'login') {
      const user = users.find((u: any) => u.email === email);
      if (!user) throw new Error('No account found with this email');
      if (user.password !== password) throw new Error('Incorrect password');
      setCurrentUser(user);
      return;
    }
  }

  // Forgot password logic
  function handleForgot(email: string) {
    const users = getUsers();
    if (!users.find((u: any) => u.email === email)) {
      setError('No account found with this email');
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white w-full max-w-2xl animate-fadeIn">
      {/* Illustration/Side */}
      <div className="hidden md:flex flex-col items-center justify-center bg-green-50 rounded-l-2xl p-10 w-80">
        <Mountain className="h-16 w-16 text-green-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-green-700 mb-2">
          {isLogin ? 'Welcome Back!' : isSignup ? 'Join LetmeTrek' : 'Forgot Password?'}
        </h2>
        <p className="text-green-800 text-lg text-center font-medium">
          {isLogin && 'Sign in to continue your adventure.'}
          {isSignup && 'Create your account and start exploring.'}
          {isForgot && "We'll send you a reset link."}
        </p>
      </div>
      {/* Form Side */}
      <div className="flex-1 p-8 flex flex-col justify-center relative">
        {/* Logo for mobile */}
        <div className="md:hidden flex flex-col items-center mb-6">
          <Mountain className="h-12 w-12 text-green-600 mb-2" />
          <span className="text-2xl font-extrabold text-green-800">LetmeTrek</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 md:hidden text-green-700">
          {isLogin ? 'Welcome Back!' : isSignup ? 'Join LetmeTrek' : 'Forgot Password?'}
        </h2>
        <p className="mb-4 text-green-700 text-base md:hidden font-medium">
          {isLogin && 'Sign in to continue your adventure.'}
          {isSignup && 'Create your account and start exploring.'}
          {isForgot && "We'll send you a reset link."}
        </p>
        {/* Social login (mock) */}
        {!isForgot && (
          <div className="flex flex-col gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 transition font-semibold text-gray-700 shadow-sm">
              <Mountain className="h-5 w-5 text-red-500" /> Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 transition font-semibold text-gray-700 shadow-sm">
              <Facebook className="h-5 w-5 text-blue-600" /> Continue with Facebook
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 transition font-semibold text-gray-700 shadow-sm">
              <Github className="h-5 w-5 text-gray-800" /> Continue with GitHub
            </button>
          </div>
        )}
        {!isForgot && (
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}
        {/* Forms */}
        {isForgot ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              setError('');
              setLoading(true);
              setTimeout(() => {
                handleForgot(email);
                setLoading(false);
              }, 800);
            }}
            className="space-y-6 animate-fadeIn"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition peer" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoFocus id="forgot-email" />
              <label htmlFor="forgot-email" className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 bg-white px-1">Email</label>
            </div>
            {sent ? (
              <div className="flex items-center gap-2 text-green-700 text-sm mb-2"><CheckCircle className="h-4 w-4" />Reset link sent!</div>
            ) : (
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            )}
            {error && <div className="flex items-center gap-2 text-red-600 text-sm mb-2"><AlertCircle className="h-4 w-4" />{error}</div>}
            <div className="flex justify-between text-sm mt-2">
              <button type="button" className="text-green-600 hover:underline" onClick={() => setMode('login')}>Back to Login</button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={async e => {
              e.preventDefault();
              setError('');
              setLoading(true);
              try {
                if (onAuth) {
                  await onAuth(email, password, isLogin ? 'login' : 'signup');
                } else {
                  await handleAuth(email, password, isLogin ? 'login' : 'signup');
                }
              } catch (err: any) {
                setError(err.message || (isLogin ? 'Login failed' : 'Signup failed'));
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-6 animate-fadeIn"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition peer" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoFocus id="auth-email" />
              <label htmlFor="auth-email" className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 bg-white px-1">Email</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition peer" placeholder=" " type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} id="auth-password" />
              <label htmlFor="auth-password" className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 bg-white px-1">Password</label>
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {isLogin && (
              <div className="flex items-center mb-2">
                <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="mr-2 rounded border-gray-300 focus:ring-green-500" />
                <label htmlFor="remember" className="text-gray-600 text-sm">Remember me</label>
              </div>
            )}
            {error && <div className="flex items-center gap-2 text-red-600 text-sm mb-2"><AlertCircle className="h-4 w-4" />{error}</div>}
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60" disabled={loading}>{loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}</button>
            <div className="flex justify-between text-sm mt-2">
              {isLogin ? (
                <>
                  <button type="button" className="text-green-600 hover:underline" onClick={() => setMode('signup')}>Sign Up</button>
                  <button type="button" className="text-green-600 hover:underline" onClick={() => setMode('forgot')}>Forgot Password?</button>
                </>
              ) : (
                <button type="button" className="text-green-600 hover:underline" onClick={() => setMode('login')}>Login</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export { getCurrentUser, removeCurrentUser };
export default AuthPanel; 