import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe,
  FileCheck,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  PhoneCall,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const score = user?.cyber_safety_score || 85;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Security Control Center
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Protected
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.full_name}</span>. Here is your digital safety breakdown.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/emergency">
            <Button variant="danger" size="sm" leftIcon={<PhoneCall className="h-4 w-4" />}>
              Emergency SOS
            </Button>
          </Link>
          <Link to="/scam-detector">
            <Button variant="primary" size="sm" leftIcon={<Zap className="h-4 w-4" />}>
              Quick AI Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Grid: Safety Score + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cyber Safety Score Card */}
        <Card className="relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-blue-950/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Cyber Safety Score
            </h2>
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-extrabold text-white tracking-tight">{score}</span>
            <span className="text-sm font-medium text-slate-400">/ 100</span>
            <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Optimal Protection
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden my-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Your account security checks passed. 0 active phishing threats detected on your registered credentials.
          </p>
        </Card>

        {/* Threat Watch Metrics Card */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Live Threat Monitor & Advisory
              </h2>
              <Activity className="h-5 w-5 text-teal-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs text-slate-400">Active Phishing Scams</p>
                <p className="text-xl font-bold text-amber-400 mt-1">1,420 High Risk</p>
                <p className="text-[10px] text-slate-500 mt-1">Updated 5m ago</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs text-slate-400">Scam Complaints Filed</p>
                <p className="text-xl font-bold text-blue-400 mt-1">28,940 Cases</p>
                <p className="text-[10px] text-slate-500 mt-1">National Cybercrime Database</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs text-slate-400">Threat Engines Online</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">4 / 4 Active</p>
                <p className="text-[10px] text-slate-500 mt-1">SafeBrowsing & VirusTotal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-4 py-2.5 rounded-xl border border-slate-800/60">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Trending Fraud: "Digital Arrest" & Fake Bank APK Scams reported in your region.
            </span>
            <Link to="/awareness" className="text-blue-400 font-semibold hover:underline flex items-center gap-1">
              Read Guide <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Action Modules Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" /> Quick Security Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/scam-detector">
            <Card hoverable glow="blue" className="h-full flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-100 mb-1">AI Scam Detector</h3>
                <p className="text-xs text-slate-400">
                  Paste SMS, WhatsApp, Telegram messages, or suspicious emails for instant AI analysis.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-400">
                Run AI Detector →
              </div>
            </Card>
          </Link>

          <Link to="/url-scanner">
            <Card hoverable glow="teal" className="h-full flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/20">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-100 mb-1">URL Threat Scanner</h3>
                <p className="text-xs text-slate-400">
                  Verify link safety with Google Safe Browsing, SSL check, and domain age analysis.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-400">
                Scan URL Link →
              </div>
            </Card>
          </Link>

          <Link to="/file-scanner">
            <Card hoverable glow="blue" className="h-full flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/20">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-100 mb-1">File Payload Scanner</h3>
                <p className="text-xs text-slate-400">
                  Upload APKs, PDFs, images to calculate SHA256 hashes & query VirusTotal.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-purple-400">
                Analyze File →
              </div>
            </Card>
          </Link>

          <Link to="/complaints">
            <Card hoverable glow="red" className="h-full flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 border border-red-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-100 mb-1">Report Cyber Fraud</h3>
                <p className="text-xs text-slate-400">
                  File official cybercrime complaints with transaction details and evidence files.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-red-400">
                File Complaint →
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
