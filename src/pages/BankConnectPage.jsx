import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, Check, Fingerprint, Building2, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', color: '#1a237e' },
  { id: 'hdfc', name: 'HDFC Bank', color: '#004b87' },
  { id: 'icici', name: 'ICICI Bank', color: '#f58220' },
  { id: 'axis', name: 'Axis Bank', color: '#97144d' },
  { id: 'kotak', name: 'Kotak Mahindra', color: '#ed1c24' },
  { id: 'bob', name: 'Bank of Baroda', color: '#f47920' },
];

const PROCESSING_STEPS = [
  { text: 'Connecting to bank via AA framework...', icon: '🔗', duration: 1200 },
  { text: 'Fetching 3 months of transaction data...', icon: '📊', duration: 1500 },
  { text: 'Classifying income & expenses...', icon: '🧠', duration: 1200 },
  { text: 'Running GigScore credit model...', icon: '⚡', duration: 1000 },
  { text: 'Generating your credit identity...', icon: '✅', duration: 800 },
];

export default function BankConnectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select');      // 'select' | 'consent' | 'otp' | 'processing'
  const [selectedBank, setSelectedBank] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [otp, setOtp] = useState('');
  const [processingStep, setProcessingStep] = useState(0);

  const handleConsent = () => {
    setStep('otp');
  };

  const handleOtp = () => {
    setStep('processing');
    // Run through processing steps with delays
    let i = 0;
    const runStep = () => {
      if (i < PROCESSING_STEPS.length) {
        setProcessingStep(i);
        i++;
        setTimeout(runStep, PROCESSING_STEPS[i - 1].duration);
      } else {
        // Navigate to demo selection after processing completes
        navigate('/demo');
      }
    };
    runStep();
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-electric/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-positive/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-positive/10 text-positive text-xs font-bold px-4 py-2 rounded-full border border-positive/20 mb-6">
            <ShieldCheck className="w-4 h-4" />
            RBI Account Aggregator Framework
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Connect Your Bank
          </h1>
          <p className="text-slate-400 text-lg">
            One-tap consent. No documents. Fully digital.
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1: Bank Selection */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <h3 className="text-lg font-bold text-white mb-6">Choose your primary bank</h3>
                <div className="grid grid-cols-2 gap-3">
                  {BANKS.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 group ${
                        selectedBank?.id === bank.id
                          ? 'border-electric bg-electric/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'border-slate-700/50 bg-navy-900/50 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: bank.color }}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-200 leading-tight">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </Card>
              <Button
                className="w-full text-lg py-4"
                onClick={() => selectedBank && setStep('consent')}
                style={{ opacity: selectedBank ? 1 : 0.5 }}
              >
                Continue with {selectedBank?.name || 'Bank'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Consent */}
          {step === 'consent' && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-electric/10 rounded-lg border border-electric/20">
                    <Lock className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Data Consent</h3>
                    <p className="text-xs text-slate-400">via {selectedBank?.name}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-navy-900/60 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-white font-medium mb-1">What we access:</p>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-positive flex-shrink-0" /> 3 months of transaction history</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-positive flex-shrink-0" /> Account balance summary</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-positive flex-shrink-0" /> Income & expense categorization</li>
                    </ul>
                  </div>
                  <div className="bg-navy-900/60 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-white font-medium mb-1">What we never see:</p>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-critical flex-shrink-0" /> Login credentials or passwords</li>
                      <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-critical flex-shrink-0" /> Account number or IFSC</li>
                    </ul>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mb-0">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 accent-electric w-5 h-5"
                  />
                  <span className="text-sm text-slate-300 leading-relaxed">
                    I consent to share my financial data with GigScore via the
                    <span className="text-electric font-medium"> RBI Account Aggregator</span> framework
                    for credit assessment purposes. DPDP Act 2023 compliant.
                  </span>
                </label>
              </Card>
              <Button
                className="w-full text-lg py-4"
                onClick={handleConsent}
                style={{ opacity: consentChecked ? 1 : 0.5 }}
              >
                Approve & Share Data
                <ShieldCheck className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center mb-6">
                <div className="inline-flex p-4 bg-electric/10 rounded-2xl border border-electric/20 mb-6">
                  <Fingerprint className="w-10 h-10 text-electric" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verify Identity</h3>
                <p className="text-sm text-slate-400 mb-8">
                  Enter the OTP sent to your registered mobile ending in ****47
                </p>

                <div className="flex justify-center gap-3 mb-8">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = otp.split('');
                        newOtp[i] = val;
                        setOtp(newOtp.join(''));
                        // Auto-focus next input
                        if (val && i < 5) {
                          const next = e.target.parentElement?.children[i + 1];
                          if (next) next.focus();
                        }
                      }}
                      className="w-12 h-14 bg-navy-900/80 border-2 border-slate-600 rounded-xl text-center text-xl font-bold text-white focus:border-electric focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-500 mb-2">
                  Demo mode — enter any 6 digits to proceed
                </p>
              </Card>
              <Button
                className="w-full text-lg py-4"
                onClick={handleOtp}
                style={{ opacity: otp.length === 6 ? 1 : 0.5 }}
              >
                Verify & Connect
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 4: Processing Animation */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-flex mb-8"
                >
                  <Loader2 className="w-16 h-16 text-electric" />
                </motion.div>

                <div className="space-y-4 max-w-sm mx-auto">
                  {PROCESSING_STEPS.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: i <= processingStep ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`flex items-center gap-3 text-left p-3 rounded-xl transition-colors ${
                        i < processingStep ? 'bg-positive/5' :
                        i === processingStep ? 'bg-electric/10 border border-electric/20' :
                        ''
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">
                        {i < processingStep ? '✅' : s.icon}
                      </span>
                      <span className={`text-sm font-medium ${
                        i < processingStep ? 'text-positive' :
                        i === processingStep ? 'text-white' :
                        'text-slate-500'
                      }`}>
                        {s.text}
                      </span>
                      {i === processingStep && (
                        <Loader2 className="w-4 h-4 text-electric animate-spin ml-auto flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> RBI Regulated</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
}
