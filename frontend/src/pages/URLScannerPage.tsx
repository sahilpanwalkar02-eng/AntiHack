import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, ShieldAlert, Lock, Unlock, Calendar, Activity, Sparkles } from 'lucide-react';
import { urlScannerService, URLScanResponse } from '../services/urlScannerService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SAMPLE_URLS = [
  { label: 'Safe Domain', url: 'https://google.com' },
  { label: 'Suspicious Phishing TLD', url: 'http://sbi-login-update.xyz' },
  { label: 'Unencrypted HTTP Link', url: 'http://account-verify-portal.top' },
];

export const URLScannerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<URLScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setError(null);
    try {
      const data = await urlScannerService.scanUrl(url.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze URL.');
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DANGEROUS':
        return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', badge: 'bg-red-500 text-white' };
      case 'SUSPICIOUS':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', badge: 'bg-amber-500 text-slate-950' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', badge: 'bg-emerald-500 text-slate-950' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe className="h-7 w-7 text-teal-400" /> Multi-Engine URL Threat Scanner
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep URL link verification against Google Safe Browsing, VirusTotal, SSL certificates, and domain age registries.
        </p>
      </div>

      <Card className="space-y-6">
        <form onSubmit={handleScan} className="space-y-4">
          <Input
            label="Enter Website URL or Domain Link"
            placeholder="https://example.com/login"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            leftIcon={<Globe className="h-4 w-4 text-teal-400" />}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Test Presets:</span>
              {SAMPLE_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(sample.url)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-teal-500/50 hover:text-teal-400"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="md"
              isLoading={isScanning}
              disabled={!url.trim()}
              leftIcon={<Globe className="h-4 w-4" />}
            >
              Scan URL Safety
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-xl">
            {error}
          </div>
        )}
      </Card>

      {/* Results Display */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className={`border ${getStatusColor(result.safety_status).border} ${getStatusColor(result.safety_status).bg}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-lg ${getStatusColor(result.safety_status).badge}`}>
                  {result.safety_status} STATUS
                </span>
                <h2 className="text-xl font-bold text-white mt-2 font-mono">{result.domain}</h2>
                <p className="text-xs text-slate-400 truncate max-w-xl">{result.url}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Risk Score</span>
                <span className={`text-4xl font-extrabold ${getStatusColor(result.safety_status).text}`}>
                  {result.risk_score} / 100
                </span>
              </div>
            </div>

            {/* 4 Engine Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs">
                  <ShieldCheck className="h-4 w-4 text-blue-400" /> Safe Browsing
                </div>
                <p className="text-sm font-bold text-white">{result.google_safebrowsing_status}</p>
                <p className="text-[10px] text-slate-500 mt-1">Google Threat API</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs">
                  <Activity className="h-4 w-4 text-teal-400" /> VirusTotal engines
                </div>
                <p className="text-sm font-bold text-white">
                  {result.virustotal_positives} / {result.virustotal_total} flagged
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Multi-Vendor Intelligence</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs">
                  {result.ssl_valid ? <Lock className="h-4 w-4 text-emerald-400" /> : <Unlock className="h-4 w-4 text-red-400" />}
                  SSL Certificate
                </div>
                <p className="text-sm font-bold text-white">{result.ssl_valid ? 'Valid HTTPS' : 'Unencrypted / Expired'}</p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{result.ssl_issuer || 'No issuer details'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs">
                  <Calendar className="h-4 w-4 text-purple-400" /> Domain Registration
                </div>
                <p className="text-sm font-bold text-white">~{result.domain_age_days} Days Old</p>
                <p className="text-[10px] text-slate-500 mt-1">WHOIS Age Registry</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">Diagnostic Summary:</strong> {result.analysis_summary}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
