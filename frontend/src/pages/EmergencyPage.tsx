import React from 'react';
import { PhoneCall, AlertTriangle, Shield, CreditCard, Phone, Building2 } from 'lucide-react';
import { Card } from '../components/ui/Card';

const EMERGENCY_CONTACTS = [
  { label: 'National Cybercrime Helpline', number: '1930', description: 'Report cyber fraud, freeze accounts, and get immediate guidance.', icon: Shield, color: 'blue' },
  { label: 'Police Emergency', number: '100', description: 'Contact local police for immediate physical emergency response.', icon: Phone, color: 'red' },
  { label: 'RBI Banking Fraud Helpline', number: '14440', description: 'Report unauthorized transactions and get bank account freeze assistance.', icon: CreditCard, color: 'teal' },
  { label: 'TRAI SIM Swap Fraud', number: '1800-11-4000', description: 'Prevent SIM Swap fraud and report unauthorized SIM duplication.', icon: Phone, color: 'amber' },
];

const BANK_BLOCK_NUMBERS: { bank: string; number: string }[] = [
  { bank: 'State Bank of India (SBI)', number: '1800-11-2211' },
  { bank: 'HDFC Bank', number: '1800-202-6161' },
  { bank: 'ICICI Bank', number: '1800-200-3344' },
  { bank: 'Axis Bank', number: '1800-419-5959' },
  { bank: 'Kotak Mahindra Bank', number: '1860-266-2666' },
  { bank: 'Punjab National Bank', number: '1800-180-2222' },
];

const RECOVERY_STEPS = [
  { step: 1, title: 'Call 1930 Immediately', desc: 'Call the National Cyber Crime Helpline within the first hour to freeze the fraudulent transaction.' },
  { step: 2, title: 'Block Your Bank Account', desc: 'Call your bank\'s toll-free number to freeze/block your account and dispute the transaction.' },
  { step: 3, title: 'File Complaint on cybercrime.gov.in', desc: 'File an official FIR complaint with your transaction details, screenshots, and evidence.' },
  { step: 4, title: 'Change All Passwords', desc: 'Change passwords for email, banking, and social accounts. Enable 2FA everywhere.' },
  { step: 5, title: 'Scan Devices', desc: 'If you installed an APK, factory reset your device. Use AntiHack File Scanner to identify threats.' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  red: 'bg-red-500/10 border-red-500/30 text-red-400',
  teal: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

export const EmergencyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* SOS Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 to-slate-950/90 border border-red-500/40 shadow-danger-glow text-center">
        <PhoneCall className="mx-auto h-10 w-10 text-red-400 mb-3 animate-pulse" />
        <h1 className="text-2xl font-extrabold text-white">Cyber Emergency SOS</h1>
        <p className="text-sm text-red-200 mt-1">If you are currently being scammed or have lost money — act now!</p>
        <a
          href="tel:1930"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-danger-glow"
        >
          <PhoneCall className="h-5 w-5" /> Call 1930 — Cybercrime Helpline
        </a>
      </div>

      {/* Emergency Contact Grid */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" /> Emergency Cyber Response Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map((contact, i) => (
            <Card key={i} className={`border ${colorMap[contact.color]} space-y-3`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl border ${colorMap[contact.color]} flex items-center justify-center`}>
                  <contact.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{contact.label}</h3>
                  <p className="text-xs text-slate-400">{contact.description}</p>
                </div>
              </div>
              <a
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-current transition-all"
              >
                <span className="font-mono text-xl font-bold text-white">{contact.number}</span>
                <span className="text-xs font-semibold text-slate-400">Tap to Call →</span>
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Bank Block Numbers */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-400" /> Bank Account Block Helplines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BANK_BLOCK_NUMBERS.map((b, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300 truncate">{b.bank}</span>
              <a href={`tel:${b.number}`} className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 whitespace-nowrap">
                {b.number}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Recovery Steps */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-teal-400" /> Post-Fraud Emergency Recovery Protocol
        </h2>
        <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800 pl-10">
          {RECOVERY_STEPS.map((step) => (
            <div key={step.step} className="relative">
              <span className="absolute -left-10 top-1 h-6 w-6 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold flex items-center justify-center ring-4 ring-slate-950">
                {step.step}
              </span>
              <Card className="space-y-1">
                <h3 className="font-bold text-sm text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
