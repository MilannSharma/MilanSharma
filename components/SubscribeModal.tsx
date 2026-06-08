
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+61', country: 'AU' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+81', country: 'JP' },
  { code: '+86', country: 'CN' },
  { code: '+7', country: 'RU' },
  { code: '+55', country: 'BR' },
  { code: '+971', country: 'AE' },
  { code: '+65', country: 'SG' },
];

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'info' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phone: '',
    role: 'Student',
    customRole: ''
  });

  useEffect(() => {
    if (isOpen) {
      setStep('info');
      setLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border border-[#222] animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-1 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'info' && (
          <div className="p-8 pt-10">
            <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#f59e0b]/20">
              <ShieldCheck className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Stay calibrated.</h2>
            <p className="text-gray-400 text-sm mb-8 font-medium">Join Milan's technical network. Get high-signal updates directly.</p>
            
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-[#121212] border border-[#222] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Mobile Number</label>
                <div className="flex gap-2">
                  <select 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-24 px-2 py-3 bg-[#121212] border border-[#222] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b]"
                  >
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.country} {c.code}</option>)}
                  </select>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10 digit number"
                    className="flex-grow px-4 py-3 bg-[#121212] border border-[#222] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Work Title</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#121212] border border-[#222] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b] mb-2"
                >
                  <option>Student</option>
                  <option>Employee</option>
                  <option>CEO</option>
                  <option>Other / Custom</option>
                </select>
                {formData.role === 'Other / Custom' && (
                  <input 
                    required
                    name="customRole"
                    value={formData.customRole}
                    onChange={handleInputChange}
                    placeholder="Describe your role"
                    className="w-full px-4 py-3 bg-[#121212] border border-[#222] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#f59e0b] transition-all animate-in slide-in-from-top-2"
                  />
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-[#f59e0b] text-black py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe Now <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 pt-12 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Access Granted.</h2>
            <p className="text-gray-400 text-[15px] mb-10 leading-relaxed font-medium px-4">
              Welcome to the network, {formData.name.split(' ')[0]}. We've synced your profile. 
              <span className="block mt-2 font-bold text-white">You'll receive high-signal updates on every new breakthrough.</span>
            </p>
            
            <button 
              onClick={onClose}
              className="w-full bg-white text-black py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#f59e0b] transition-all shadow-lg"
            >
              Continue to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
