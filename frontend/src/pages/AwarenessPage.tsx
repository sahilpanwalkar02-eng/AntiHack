import React from 'react';
import { BookOpen, TrendingUp, Shield, ExternalLink, AlertTriangle, Newspaper, FileWarning, BellRing } from 'lucide-react';
import { Card } from '../components/ui/Card';

const TRENDING_SCAMS = [
  { title: '"Digital Arrest" Video Call Scam', severity: 'CRITICAL', description: 'Scammers impersonate CBI/ED officers via Skype/WhatsApp video, accusing victims of money laundering and demanding lakhs to "settle the case".' },
  { title: 'Fake APK Bank Update Trojans', severity: 'HIGH', description: 'Fraudulent APK files disguised as official bank or courier apps steal OTPs and drain accounts automatically.' },
  { title: 'Investment Doubling via Telegram Bots', severity: 'HIGH', description: 'Fake Telegram bots promise 200% returns on crypto or stock "investments" and disappear with deposited funds.' },
  { title: 'Part-Time YouTube Job Scam', severity: 'MEDIUM', description: 'WhatsApp messages offer ₹500–₹5000 per task for liking YouTube videos, then demand advance "deposits" to unlock earnings.' },
];

const GOVERNMENT_ADVISORIES = [
  { body: 'Ministry of Home Affairs', title: 'Cybercrime Reporting Portal — cybercrime.gov.in', date: '2026-07-01' },
  { body: 'RBI', title: 'Do not share OTP or CVV with anyone, including bank officials.', date: '2026-06-15' },
  { body: 'TRAI', title: 'Beware of SIM Swap Fraud — block unknown number immediately via 1800-11-4000.', date: '2026-05-22' },
];

const SECURITY_ARTICLES = [
  { title: '10 Signs Your Phone is Hacked by Spyware', category: 'Device Security', readTime: '5 min' },
  { title: 'How to Freeze Your Bank Account After a Scam', category: 'Recovery Guide', readTime: '3 min' },
  { title: 'Complete Guide to Enable 2FA on All Accounts', category: 'Best Practices', readTime: '7 min' },
  { title: 'Understanding Phishing Emails: Red Flags Checklist', category: 'Threat Awareness', readTime: '4 min' },
];

const getSeverityColor = (s: string) => {
  if (s === 'CRITICAL') return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (s === 'HIGH') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
};

export const AwarenessPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-teal-400" /> Cyber Awareness Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">Stay ahead of evolving cyber threats with real-time scam alerts, government advisories, and security education.</p>
      </div>

      {/* Trending Scams */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-400" /> Trending Active Scams — Threat Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRENDING_SCAMS.map((scam, i) => (
            <Card key={i} hoverable className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-sm text-white leading-tight">{scam.title}</h3>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getSeverityColor(scam.severity)}`}>
                  {scam.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{scam.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Government Advisories */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" /> Government & RBI Cyber Advisories
        </h2>
        <div className="space-y-3">
          {GOVERNMENT_ADVISORIES.map((adv, i) => (
            <div key={i} className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{adv.body}</span>
                <p className="text-sm text-slate-200 mt-1">{adv.title}</p>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{adv.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Security Articles */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-teal-400" /> Security Education Library
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECURITY_ARTICLES.map((art, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-teal-500/40 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">{art.category}</span>
                <span className="text-[10px] text-slate-500">{art.readTime} read</span>
              </div>
              <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{art.title}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Read More <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
