import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Mountain, Search, ShoppingCart, User, Eye, EyeOff, Facebook, Github } from 'lucide-react';
import { getCurrentUser, removeCurrentUser } from './AuthPanel';

// Modal with animation and accessibility
const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 animate-fadeIn"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-modalIn"
        onClick={e => e.stopPropagation()}
      >
        <button aria-label="Close modal" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Unified Auth Modal
const AuthModal = ({ open, mode, onClose, onAuth, setMode }: {
  open: boolean,
  mode: 'login' | 'signup' | 'forgot',
  onClose: () => void,
  onAuth: (email: string, password: string, mode: 'login' | 'signup') => Promise<void>,
  setMode: (mode: 'login' | 'signup' | 'forgot') => void
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => {
    setEmail(''); setPassword(''); setError(''); setSent(false);
  }, [mode, open]);
  const isLogin = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg bg-white w-full max-w-2xl">
        {/* Illustration/Side */}
        <div className="hidden md:flex flex-col items-center justify-center bg-green-50 rounded-l-lg p-8 w-72">
          <Mountain className="h-14 w-14 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            {isLogin ? 'Welcome Back!' : isSignup ? 'Join LetmeTrek' : 'Forgot Password?'}
          </h2>
          <p className="text-green-800 text-center">
            {isLogin && 'Sign in to continue your adventure.'}
            {isSignup && 'Create your account and start exploring.'}
            {isForgot && "We'll send you a reset link."}
          </p>
        </div>
        {/* Form Side */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 md:hidden text-green-700">
            {isLogin ? 'Welcome Back!' : isSignup ? 'Join LetmeTrek' : 'Forgot Password?'}
          </h2>
          <p className="mb-4 text-gray-500 text-sm md:hidden">
            {isLogin && 'Sign in to continue your adventure.'}
            {isSignup && 'Create your account and start exploring.'}
            {isForgot && "We'll send you a reset link."}
          </p>
          {/* Social login (mock) */}
          {!isForgot && (
            <div className="flex flex-col gap-2 mb-4">
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
                <Mountain className="h-5 w-5 text-red-500" /> Continue with Google
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
                <Facebook className="h-5 w-5 text-blue-600" /> Continue with Facebook
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
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
                setLoading(true);
                setTimeout(() => {
                  setSent(true);
                  setLoading(false);
                }, 1200);
              }}
            >
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              {sent ? (
                <div className="text-green-700 text-sm mb-2">Reset link sent!</div>
              ) : (
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mb-2 hover:bg-green-700 transition disabled:opacity-60" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
              )}
              <div className="flex justify-between text-sm mt-2">
                <button type="button" className="text-green-600 hover:underline" onClick={() => setMode('login')}>Back to Login</button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setError('');
                try {
                  await onAuth(email, password, isLogin ? 'login' : 'signup');
                } catch (err: any) {
                  setError(err.message || (isLogin ? 'Login failed' : 'Signup failed'));
                } finally {
                  setLoading(false);
                }
              }}
            >
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <div className="relative mb-4">
                <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition pr-12" placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mb-2 hover:bg-green-700 transition disabled:opacity-60" disabled={loading}>{loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}</button>
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
    </Modal>
  );
};

const SearchModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Search</h2>
      <input ref={inputRef} className="w-full mb-2 p-2 border rounded" placeholder="Search trips, destinations..." />
      <button className="w-full bg-green-600 text-white py-2 rounded" onClick={onClose}>Close</button>
    </Modal>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | 'forgot' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock auth state
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(2); // mock cart count
  const router = useRouter();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/trips', label: 'All Trips' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => router.pathname === path;
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Determine if navbar should be transparent
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      shouldBeTransparent ? 'bg-transparent' : 'bg-white shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-green-600" />
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              shouldBeTransparent ? 'text-white' : 'text-gray-800'
            }`}>LetmeTrek</span>
          </Link>

          {/* Navigation Items - Center */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  isActive(item.path) 
                    ? shouldBeTransparent 
                      ? 'text-green-300 bg-green-900/20' 
                      : 'text-green-600 bg-green-50'
                    : shouldBeTransparent
                      ? 'text-white hover:text-green-300'
                      : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Icon Navigation - Right */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`p-2 rounded-md transition-colors duration-300 ${
                shouldBeTransparent 
                  ? 'text-white hover:text-green-300 hover:bg-green-900/20' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className={`relative p-2 rounded-md transition-colors duration-300 ${
                shouldBeTransparent 
                  ? 'text-white hover:text-green-300 hover:bg-green-900/20' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{cartCount}</span>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700">{user.email}</span>
                <button
                  className="p-2 rounded-md text-red-600 hover:bg-red-100 transition-colors"
                  onClick={() => { removeCurrentUser(); window.location.href = '/login'; }}
                >Logout</button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`p-2 rounded-md transition-colors duration-300 ${
                  isActive('/login')
                    ? shouldBeTransparent 
                      ? 'text-green-300 bg-green-900/20' 
                      : 'text-green-600 bg-green-50'
                    : shouldBeTransparent 
                      ? 'text-white hover:text-green-300 hover:bg-green-900/20' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile header items */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              className={`p-2 rounded-md transition-colors duration-300 ${
                shouldBeTransparent 
                  ? 'text-white hover:text-green-300 hover:bg-green-900/20' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                shouldBeTransparent ? 'text-white hover:text-green-300' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Mountain className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-800">LetmeTrek</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-6 py-8">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Divider for special actions */}
                <hr className="my-6 border-gray-200" />
                {/* Cart and Account as distinct text with icons and theme */}
                <button className="w-full flex items-center gap-3 text-left px-4 py-3 font-semibold text-gray-800 bg-gray-100 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors mb-2 relative" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-green-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">{cartCount}</span>
                  )}
                </button>
                {user ? (
                  <div className="w-full flex flex-col gap-2">
                    <button
                      className={`w-full flex items-center gap-3 text-left px-4 py-3 font-semibold rounded-lg transition-colors mb-2 text-green-700 bg-green-50`}
                      onClick={() => {
                        setIsOpen(false);
                        router.push('/account');
                      }}
                      aria-label="Account"
                    >
                      <img src={user.avatar} alt="avatar" className="h-5 w-5 rounded-full border border-green-600" />
                      {user.name}
                    </button>
                    <button
                      className="w-full flex items-center gap-3 text-left px-4 py-3 font-semibold rounded-lg transition-colors mb-2 text-red-700 bg-red-50 hover:bg-red-100"
                      onClick={() => {
                        removeCurrentUser();
                        setIsLoggedIn(false);
                        setUser(null);
                        setIsOpen(false);
                      }}
                      aria-label="Logout"
                    >
                      <X className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    className={`w-full flex items-center gap-3 text-left px-4 py-3 font-semibold rounded-lg transition-colors mb-2 ${
                      isActive('/account')
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-800 bg-gray-100 hover:bg-green-50 hover:text-green-700'
                    }`}
                    onClick={() => {
                      setAuthModal('login');
                    }}
                    aria-label="Account"
                  >
                    <User className="h-5 w-5 text-green-600" />
                    Account
                  </button>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModal
        open={!!authModal}
        mode={authModal || 'login'}
        onClose={() => setAuthModal(null)}
        setMode={setAuthModal as (mode: 'login' | 'signup' | 'forgot') => void}
        onAuth={async (email, password, mode) => {
          // Mock login/signup logic
          await new Promise(res => setTimeout(res, 1000));
          if (!email || !password) throw new Error('Email and password required');
          setIsLoggedIn(true);
          setUser({ name: 'Shankhan', avatar: 'https://i.pravatar.cc/100?u=shankhan' });
          setAuthModal(null);
        }}
      />
      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;

/* Add animation keyframes for modal */
<style jsx global>{`
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalIn {
  from { transform: translateY(40px) scale(0.98); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.2s; }
.animate-modalIn { animation: modalIn 0.25s cubic-bezier(.4,2,.6,1); }
`}</style>