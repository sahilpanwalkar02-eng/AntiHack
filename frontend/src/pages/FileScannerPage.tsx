import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Upload, Hash, ShieldAlert, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';
import { fileScannerService, FileScanResponse } from '../services/fileScannerService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const FileScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<FileScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    try {
      const data = await fileScannerService.uploadAndScan(selectedFile);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to scan uploaded file.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileCheck className="h-7 w-7 text-purple-400" /> Deep File Payload & Malware Scanner
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF, APK, Image, or binary executables to calculate SHA-256 fingerprints and run VirusTotal signature checks.
        </p>
      </div>

      <Card className="space-y-6">
        <form onSubmit={handleScan} className="space-y-4">
          {/* File Upload Drop Area */}
          <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-8 text-center transition-all bg-slate-900/40">
            <Upload className="mx-auto h-12 w-12 text-purple-400 mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop file or <label htmlFor="file-input" className="text-purple-400 hover:underline cursor-pointer">browse from device</label>
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, APK, PNG, JPG, EXE (Max 15MB)</p>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 inline-flex items-center gap-3 text-xs text-slate-200">
                <FileCode className="h-4 w-4 text-purple-400" />
                <span>{selectedFile.name}</span>
                <span className="text-slate-500">({formatBytes(selectedFile.size)})</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-xl">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            isLoading={isUploading}
            disabled={!selectedFile}
            leftIcon={<FileCheck className="h-4 w-4" />}
          >
            Compute SHA-256 & Query VirusTotal
          </Button>
        </form>
      </Card>

      {/* Analysis Results Display */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={`border ${result.is_malicious ? 'border-red-500/50 bg-red-950/20' : 'border-emerald-500/50 bg-emerald-950/20'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-lg ${result.is_malicious ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>
                  {result.is_malicious ? 'MALICIOUS PAYLOAD DETECTED' : 'CLEAN FILE PAYLOAD'}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{result.filename}</h2>
                <p className="text-xs text-slate-400">Type: {result.file_type} • Size: {formatBytes(result.file_size_bytes)}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">VirusTotal Detection</span>
                <span className={`text-3xl font-extrabold ${result.is_malicious ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.virustotal_positives} / {result.virustotal_total} engines
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
                <span className="text-slate-400 block mb-1 font-sans text-[11px] font-semibold uppercase">SHA-256 Cryptographic Hash</span>
                <span className="text-blue-400 select-all break-all">{result.sha256_hash}</span>
              </div>

              {result.threat_name && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                  <span>Flagged Signature: <strong>{result.threat_name}</strong></span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
