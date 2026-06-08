import React, { useState } from 'react';
import { ShieldAlert, X, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const sanitizedId = userId.trim().toLowerCase();
      const sanitizedPass = password.trim();

      if (sanitizedId === 'milansharma' && sanitizedPass === '9012') {
        sessionStorage.setItem('admin_logged_in', 'true');
        onLoginSuccess();
        setUserId('');
        setPassword('');
      } else {
        setError('Access Denied: Invalid Credentials.');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-[32px] border border-[#333] shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Decorative Top Accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent w-full"></div>

        <button 
          onClick={onClose} 
          aria-label="Close"
          title="Close"
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white rounded-xl hover:bg-[#252525] transition-all"
        >
          <X size={18} />
        </button>

        <div className="p-8 md:p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] mb-6">
            <ShieldAlert size={32} />
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-2 text-center">Super Admin Console</h3>
          <p className="text-gray-400 text-xs tracking-wider uppercase font-black text-center mb-8 bg-[#121212] px-4 py-1.5 rounded-full border border-[#252525]">
            Authorized Personnel Only
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-userid-input" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Admin User ID</label>
              <input 
                id="admin-userid-input"
                required
                type="text" 
                title="Admin User ID"
                placeholder="Enter admin ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="admin-password-input" className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Secret Password</label>
              <div className="relative">
                <input 
                  id="admin-password-input"
                  required
                  type={showPassword ? "text" : "password"} 
                  title="Secret Password"
                  placeholder="••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#121212] border border-[#252525] rounded-xl px-4 py-3.5 pr-12 text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]/50 transition-all placeholder:text-gray-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  title="Toggle password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#f59e0b] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 mt-4 shadow-xl shadow-[#f59e0b]/10"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
