import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Clock, CheckCircle2, AlertCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { complaintService, ComplaintResponse } from '../services/complaintService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const FRAUD_TYPES = [
  'Financial Transaction Fraud / Unauthorized Transfer',
  'Digital Arrest / Impersonation Police Scam',
  'Phishing Account Takeover / NetBanking Hack',
  'Fake Job / Work From Home Scam',
  'Fake E-Commerce / Merchant Fraud',
  'Crypto Investment Ponzi Fraud',
];

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintResponse | null>(null);

  // Form Fields
  const [fraudType, setFraudType] = useState(FRAUD_TYPES[0]);
  const [description, setDescription] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [bankName, setBankName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data);
      if (data.length > 0) setSelectedComplaint(data[0]);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fraud_type', fraudType);
      formData.append('description', description);
      if (transactionId) formData.append('transaction_id', transactionId);
      if (bankName) formData.append('bank_name', bankName);
      if (phoneNumber) formData.append('phone_number', phoneNumber);
      if (evidenceFile) formData.append('evidence', evidenceFile);

      await complaintService.createComplaint(formData);
      setShowCreateForm(false);
      setDescription('');
      setTransactionId('');
      setBankName('');
      setPhoneNumber('');
      setEvidenceFile(null);
      loadComplaints();
    } catch (err) {
      alert('Failed to submit complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500 text-slate-950';
      case 'UNDER_INVESTIGATION':
        return 'bg-blue-500 text-white';
      case 'REJECTED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-amber-500 text-slate-950';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="h-7 w-7 text-red-400" /> Fraud Complaint Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            File official cybercrime reports, upload transaction evidence, and track real-time investigation timelines.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          {showCreateForm ? 'Cancel' : 'File New Complaint'}
        </Button>
      </div>

      {showCreateForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-red-500/30 bg-slate-950/90 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" /> New Cyber Fraud Incident Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-400">Fraud Category</label>
                  <select
                    value={fraudType}
                    onChange={(e) => setFraudType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    {FRAUD_TYPES.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Transaction ID / UPR Ref (Optional)"
                  placeholder="e.g. TXN9876543210"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />

                <Input
                  label="Bank Name (Optional)"
                  placeholder="e.g. State Bank of India / HDFC"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />

                <Input
                  label="Scammer Phone / Account Number"
                  placeholder="e.g. +91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-400">Incident Description & Chronology</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exact sequence of events, messages received, and financial losses incurred..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-400">Evidence Screenshot / PDF Receipt</label>
                <input
                  type="file"
                  onChange={(e) => setEvidenceFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                />
              </div>

              <Button type="submit" variant="danger" size="md" isLoading={isSubmitting} className="w-full">
                Submit Cyber Crime Complaint
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Complaints List & Timeline Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Complaints</h2>

          {complaints.length === 0 ? (
            <Card className="text-center py-8 text-xs text-slate-500">
              No cyber crime complaints submitted yet.
            </Card>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedComplaint?.id === c.id
                      ? 'border-red-500/60 bg-red-950/20 shadow-cyber-glow'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-500">Case #{c.id}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 mt-2 truncate">{c.fraud_type}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Details Drawer */}
        <div className="lg:col-span-2 space-y-4">
          {selectedComplaint ? (
            <Card className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getStatusBadge(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedComplaint.fraud_type}</h2>
                  <p className="text-xs text-slate-400">Case ID #{selectedComplaint.id} • Filed on {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-400">Complaint Details</h3>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  {selectedComplaint.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Transaction ID</span>
                    <span className="font-mono text-slate-200">{selectedComplaint.transaction_id || 'N/A'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Associated Bank</span>
                    <span className="text-slate-200">{selectedComplaint.bank_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Status Investigation Timeline */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Investigation Case Timeline
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-8">
                  {selectedComplaint.updates?.map((upd) => (
                    <div key={upd.id} className="relative">
                      <span className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-blue-400">{upd.status}</span>
                          <span className="text-[10px] text-slate-500">{new Date(upd.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300">{upd.comment}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">By: {upd.updated_by}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16 text-xs text-slate-500">
              Select a complaint to view investigation timeline and updates.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
