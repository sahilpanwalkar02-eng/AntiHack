import { api } from './api';

export type URLSafetyStatus = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';

export interface URLScanResponse {
  id: number;
  url: string;
  domain: string;
  safety_status: URLSafetyStatus;
  risk_score: number;
  google_safebrowsing_status: string;
  virustotal_positives: number;
  virustotal_total: number;
  ssl_valid: boolean;
  ssl_issuer?: string;
  domain_age_days: number;
  analysis_summary: string;
  created_at: string;
}

export const urlScannerService = {
  async scanUrl(url: string): Promise<URLScanResponse> {
    const response = await api.post<URLScanResponse>('/url-scanner/scan', { url });
    return response.data;
  },

  async getHistory(): Promise<URLScanResponse[]> {
    const response = await api.get<URLScanResponse[]>('/url-scanner/history');
    return response.data;
  },
};
