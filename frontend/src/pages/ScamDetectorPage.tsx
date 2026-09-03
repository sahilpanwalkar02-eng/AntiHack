import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Mail,
  Send,
  Globe,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle,
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  scamDetectorService,
  ChannelType,
  ScamAnalysisResponse,
  ThreatScanHistoryItem
} from '../services/scamDetectorService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SAMPLE_PAYLOADS: Record<ChannelType, { title: string; text: string }[]> = {
  sms: [
    {
      title: 'Electricity Bill Disconnection Scam',
      text: 'Dear Customer, Your Electricity power supply will be disconnected tonight at 9:30 PM because your previous bill was not updated. Please contact Officer at 9876543210 immediately.',
    },
    {
      title: 'Fake Bank KYC Account Suspension',
      text: 'ALERT: Your SBI NetBanking Account has been suspended due to pending KYC verification. Click http://sbi-kyc-update.xyz to verify your PAN number immediately.',
    },
  ],
  email: [
    {
      title: 'Fake Account Security Verification',
      text: 'Urgent Security Notice: Unauthorized access detected from IP 185.220.101.5. Click here to verify your password and confirm your identity within 2 hours or your account will be locked permanently.',
    },
  ],
  whatsapp: [
    {
      title: 'Part-Time Job / Telegram Scam',
      text: 'Hello! Earn $300-$800 daily by simply reviewing YouTube videos. No experience required. Message our HR manager on WhatsApp immediately to start.',
    },
  ],
  telegram: [
    {
      title: 'Crypto Trading Investment Double',
      text: 'Guaranteed 200% returns in 24 hours! Deposit 0.1 BTC to our audited smart contract and get 0.2 BTC back instantly. Official Telegram Bot link: t.me/fast_crypto_double',
    },
  ],
  url: [
    {
      title: 'Phishing Credential Link',
      text: 'http://secure-login-update.ngrok.io/sbi/verify-bank',
    },
  ],
};

export const ScamDetectorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChannelType>('sms');
  const [content, setContent] = useState<string>('');
  const [senderInfo, setSenderInfo] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<ThreatScanHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const channels: { type: ChannelType; label: string; icon: React.ElementType }[] = [
    { type: 'sms', label: 'SMS Payload', icon: MessageSquare },
    { type: 'email', label: 'Email Text', icon: Mail },
    { type: 'whatsapp', label: 'WhatsApp', icon: Send },
    { type: 'telegram', label: 'Telegram', icon: Send },
    { type: 'url', label: 'Direct URL Link', icon: Globe },
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const result = await scamDetectorService.analyzePayload({
        channel_type: activeTab,
        content: content.trim(),
        sender_info: senderInfo.trim() || undefined,
      });
      setAnalysisResult(result);
      fetchHistory();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to complete threat analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await scamDetectorService.getHistory(10);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400', badge: 'bg-red-500 text-white' };
      case 'HIGH':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'bg-amber-500 text-slate-950' };
      case 'MEDIUM':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-400', badge: 'bg-yellow-500 text-slate-950' };
      default:
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', badge: 'bg-emerald-500 text-slate-950' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="h-7 w-7 text-blue-400" /> AI Scam & Phishing Detector
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze messages from SMS, WhatsApp, Telegram, Email or URLs using NLP threat heuristics.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) fetchHistory();
          }}
          leftIcon={<History className="h-4 w-4 text-blue-400" />}
        >
          {showHistory ? 'Hide History' : 'Recent Scans'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanner Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            {/* Channel Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {channels.map((ch) => (
                <button
                  key={ch.type}
                  type="button"
                  onClick={() => {
                    setActiveTab(ch.type);
                    setAnalysisResult(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === ch.type
                      ? 'bg-blue-600 text-white shadow-cyber-glow'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <ch.icon className="h-4 w-4" />
                  {ch.label}
                </button>
              ))}
            </div>

            {/* Presets / Sample Threat Payloads */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Test Scam Presets
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PAYLOADS[activeTab]?.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setContent(sample.text);
                      setSenderInfo(activeTab === 'sms' ? '+91 9876543210' : 'unknown@alert.com');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3 w-3 text-blue-400" />
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-4">
              <Input
                label="Sender Phone / Email / Handle (Optional)"
                placeholder="e.g., +1 (555) 019-2834 or alert@bank-verify.com"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message Payload / Text to Analyze
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Paste ${activeTab.toUpperCase()} message content here for instant threat analysis...`}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isAnalyzing}
                disabled={!content.trim()}
                leftIcon={<Zap className="h-4 w-4" />}
              >
                Analyze Threat Payload with AI
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {analysisResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`space-y-6 border ${
                  getThreatColor(analysisResult.threat_level).border
                } ${getThreatColor(analysisResult.threat_level).bg}`}
              >
                {/* Top Badge & Score */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg ${
                      getThreatColor(analysisResult.threat_level).badge
                    }`}
                  >
                    {analysisResult.threat_level} THREAT LEVEL
                  </span>
                  <span className="text-xs text-slate-400">Scan ID #{analysisResult.scan_id}</span>
                </div>

                {/* Score Gauge Display */}
                <div className="text-center py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Calculated Risk Score
                  </p>
                  <div className="text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
                    <span className={getThreatColor(analysisResult.threat_level).text}>
                      {analysisResult.risk_score}
                    </span>
                    <span className="text-lg text-slate-500">/ 100</span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-700 ${
                        analysisResult.risk_score >= 80
                          ? 'bg-red-500'
                          : analysisResult.risk_score >= 50
                          ? 'bg-amber-500'
                          : analysisResult.risk_score >= 25
                          ? 'bg-yellow-500'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${analysisResult.risk_score}%` }}
                    />
                  </div>
                </div>

                {/* Threat Explanation */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Threat Diagnosis
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {analysisResult.reason}
                  </p>
                </div>

                {/* Detected Patterns */}
                {analysisResult.detected_patterns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Flagged Threat Indicators
                    </h4>
                    <div className="space-y-1.5">
                      {analysisResult.detected_patterns.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-800/50 p-2 rounded-lg"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Actionable Safety Steps
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-16 px-6 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white">Awaiting Payload Input</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select a message channel on the left, paste content, and click Analyze to generate your instant AI risk score.
              </p>
            </Card>
          )}

          {/* History Drawer */}
          {showHistory && (
            <Card className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
                <span>Recent Threat Scans</span>
                <History className="h-4 w-4 text-slate-400" />
              </h3>

              {history.length === 0 ? (
                <p className="text-xs text-slate-500">No previous scans found.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold uppercase text-[10px] text-blue-400 block">
                          {item.channel_type}
                        </span>
                        <p className="truncate text-slate-300 max-w-[150px]">{item.input_content}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-bold text-xs ${getThreatColor(item.threat_level).text}`}
                        >
                          Score: {item.risk_score}
                        </span>
                        <span className="block text-[10px] text-slate-500">{item.threat_level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
