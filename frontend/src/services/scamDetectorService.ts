import { api } from './api';

export type ChannelType = 'sms' | 'email' | 'whatsapp' | 'telegram' | 'url';
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScamAnalysisRequest {
  channel_type: ChannelType;
  content: string;
  sender_info?: string;
}

export interface ScamAnalysisResponse {
  scan_id: number;
  channel_type: ChannelType;
  input_content: string;
  risk_score: number;
  threat_level: ThreatLevel;
  reason: string;
  recommendations: string[];
  detected_patterns: string[];
  created_at: string;
}

export interface ThreatScanHistoryItem {
  id: number;
  channel_type: ChannelType;
  input_content: string;
  risk_score: number;
  threat_level: ThreatLevel;
  created_at: string;
}

export const scamDetectorService = {
  async analyzePayload(payload: ScamAnalysisRequest): Promise<ScamAnalysisResponse> {
    const response = await api.post<ScamAnalysisResponse>('/scam-detector/analyze', payload);
    return response.data;
  },

  async getHistory(limit: number = 20): Promise<ThreatScanHistoryItem[]> {
    const response = await api.get<ThreatScanHistoryItem[]>(`/scam-detector/history?limit=${limit}`);
    return response.data;
  },
};
