/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Lock, User, ArrowRight, ShoppingBag, ShieldCheck, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onContinueAsGuest, theme }) {
  const [activeTab, setActiveTab ] = React.useState('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  
  // Register fields
  const [regName, setRegName] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');
  const [regConfirmPassword, setRegConfirmPassword] = React.useState('');
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  // States
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);

  // Validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please fill in all credentials fields.');
      setLoading(false);
      return;
    }

    if (!validateEmail(loginEmail)) {
      setError('Please provide a syntactically correct email address.');
      setLoading(false);
      return;
    }

    // Simulate safe 256-bit credentials challenge
    setTimeout(() => {
      // Demo accounts or registration backups
      const registeredUsersJSON = localStorage.getItem('apex_registered_users');
      let registeredUsers = registeredUsersJSON ? JSON.parse(registeredUsersJSON) : [];
      
      const foundUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );

      // Default built-in Admin workstation account
      if (
        (loginEmail.toLowerCase() === 'creator@apex.com' && loginPassword === 'apex123') ||
        (foundUser)
      ) {
        const userName = foundUser ? foundUser.name : 'Apex Creator';
        setSuccess(`Welcome back, ${userName}! Handshaking authentication certificates...`);
        setTimeout(() => {
          onLoginSuccess({
            email: loginEmail,
            name: userName,
            isLoggedIn: true
          });
        }, 1200);
      } else {
        setError('Invalid email or password mismatch. Hint: Use demo buttons below!');
        setLoading(false);
      }
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setError('Please fill out all required setup fields.');
      setLoading(false);
      return;
    }

    if (!validateEmail(regEmail)) {
      setError('Please supply a valid structure email address.');
      setLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setError('Security policy: Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords mismatch. Please confirm your secret identically.');
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('Please acknowledge our terms of standard usage conditions.');
      setLoading(false);
      return;
    }

    // Save registration mock database to local storage
    setTimeout(() => {
      try {
        const registeredUsersJSON = localStorage.getItem('apex_registered_users');
        const registeredUsers = registeredUsersJSON ? JSON.parse(registeredUsersJSON) : [];
        
        // Check if already registered
        const dupe = registeredUsers.find((u) => u.email.toLowerCase() === regEmail.toLowerCase());
        if (dupe || regEmail.toLowerCase() === 'creator@apex.com') {
          setError('An account with this email address is already provisioned.');
          setLoading(false);
          return;
        }

        const newUser = { name: regName, email: regEmail, password: regPassword };
        registeredUsers.push(newUser);
        localStorage.setItem('apex_registered_users', JSON.stringify(registeredUsers));

        setSuccess(`Account setup complete for ${regName}! Redirecting you automatically...`);
        setTimeout(() => {
          onLoginSuccess({
            email: regEmail,
            name: regName,
            isLoggedIn: true
          });
        }, 1200);
      } catch (err) {
        setError('Local storage persistence fault. Please retry.');
        setLoading(false);
      }
    }, 1200);
  };

  const useDemoCreator = () => {
    setError(null);
    setLoginEmail('creator@apex.com');
    setLoginPassword('apex123');
    setActiveTab('login');
  };

  const useDemoTester = () => {
    setError(null);
    setLoginEmail('designer@workstation.com');
    // First register them if not exists
    const usersJSON = localStorage.getItem('apex_registered_users');
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    if (!users.some((u) => u.email === 'designer@workstation.com')) {
      users.push({ name: 'Tactile Designer', email: 'designer@workstation.com', password: 'workstation123' });
      localStorage.setItem('apex_registered_users', JSON.stringify(users));
    }
    setLoginEmail('designer@workstation.com');
    setLoginPassword('workstation123');
    setActiveTab('login');
  };

  return (
    <div id="login-screen-outer" className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Brand Watermark / Details */}
      <div className="mb-8 flex flex-col items-center text-center max-w-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-md transform hover:rotate-6 transition-all duration-300">
          <ShoppingBag size={24} />
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-display">
          Apex Workstations
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
          Tactile Setup Sandbox
        </p>
      </div>

      {/* Main Login / Register card container */}
      <div id="auth-panel-card" className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Toggle switches */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            type="button"
            id="tab-login"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 hover:bg-slate-100/30 dark:hover:bg-slate-800/10'
            }`}
          >
            Access Account
            {activeTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 dark:bg-slate-100" />
            )}
          </button>
          <button
            type="button"
            id="tab-register"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 hover:bg-slate-100/30 dark:hover:bg-slate-800/10'
            }`}
          >
            Join Registry
            {activeTab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 dark:bg-slate-100" />
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Error / Success Feedback */}
          {error && (
            <div id="auth-error-banner" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs font-medium animate-shake">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div id="auth-success-banner" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
              <CheckCircle size={15} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Conditional Form Rendering */}
          {activeTab === 'login' ? (
            <form id="form-sign-in" onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
                  Credential Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    id="input-login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="creator@apex.com"
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100/55 dark:hover:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
                    Access Code / Password
                  </label>
                  <span className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-mono tracking-tight cursor-help whitespace-nowrap">
                    Forgot Keycode?
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100/55 dark:hover:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-11 pr-11 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full mt-2 h-11 flex items-center justify-center gap-2 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-white text-xs font-bold tracking-wide uppercase rounded-xl cursor-pointer shadow-md hover:shadow-lg hover:shadow-slate-250 dark:hover:shadow-none transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 border-2 border-slate-400 border-t-white dark:border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    Decrypt & Validate Access
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form id="form-sign-up" onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 block">
                  Full Customer Name
                </label>
                <div className="relative">
                   <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    id="input-register-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alexander Mercer"
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-955/80 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 block">
                  Registry Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    id="input-register-email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@example.com"
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-955/80 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 block">
                    Define Key
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
                      <Lock size={14} />
                    </span>
                    <input
                      type="password"
                      id="input-register-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      disabled={loading}
                      className="w-full bg-slate-50 dark:bg-slate-955/80 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 block">
                    Verify Key
                  </label>
                  <div className="relative">
                     <span className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
                      <Lock size={14} />
                    </span>
                    <input
                      type="password"
                      id="input-register-confirm"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat master key"
                      disabled={loading}
                      className="w-full bg-slate-50 dark:bg-slate-955/80 border border-slate-200 dark:border-slate-800 focus:border-slate-950 dark:focus:border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="checkbox-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="checkbox-terms" className="text-[10.5px] leading-snug text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                  I consent to the simulated transmission processing in this sandbox context environment.
                </label>
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                disabled={loading}
                className="w-full mt-2 h-11 flex items-center justify-center gap-2 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-white text-xs font-bold tracking-wide uppercase rounded-xl cursor-pointer shadow-md transition-all active:scale-98 disabled:opacity-50 animate-none"
              >
                {loading ? (
                  <span className="h-4 w-4 border-2 border-slate-400 border-t-white dark:border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Workstation Profile
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Guest Route & Info Dividers */}
          <div className="relative py-1 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-slate-100 dark:bg-slate-800/80" />
            <span className="relative z-10 bg-white dark:bg-slate-900 px-3 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              OR
            </span>
          </div>

          <button
            type="button"
            id="btn-login-guest"
            onClick={onContinueAsGuest}
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-98 hover:bg-slate-50 dark:hover:bg-slate-950"
          >
            Explore Store Catalog as Guest
          </button>

          {/* Quick Demo Assist Panel */}
          <div className="pt-2">
            <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/60 p-4 rounded-xl space-y-2.5">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} className="text-indigo-500" />
                Sandbox Quick credentials
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={useDemoCreator}
                  className="rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 py-1.5 px-3 cursor-pointer transition-colors"
                >
                  Admin creator@apex.com
                </button>
                <button
                  type="button"
                  onClick={useDemoTester}
                  className="rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 py-1.5 px-3 cursor-pointer transition-colors"
                >
                  Architect Guest Tester
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
