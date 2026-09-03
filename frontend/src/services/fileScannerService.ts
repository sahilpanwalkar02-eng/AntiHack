import { api } from './api';

export interface FileScanResponse {
  id: number;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  sha256_hash: string;
  is_malicious: boolean;
  risk_score: number;
  virustotal_positives: number;
  virustotal_total: number;
  threat_name?: string;
  created_at: string;
}

export const fileScannerService = {
  async uploadAndScan(file: File): Promise<FileScanResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileScanResponse>('/file-scanner/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getHistory(): Promise<FileScanResponse[]> {
    const response = await api.get<FileScanResponse[]>('/file-scanner/history');
    return response.data;
  },
};
