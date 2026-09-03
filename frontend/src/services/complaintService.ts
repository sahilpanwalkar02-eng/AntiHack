import { api } from './api';

export type ComplaintStatus = 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'REJECTED';

export interface ComplaintUpdateItem {
  id: number;
  status: ComplaintStatus;
  comment: string;
  updated_by: string;
  created_at: string;
}

export interface ComplaintResponse {
  id: number;
  user_id: number;
  fraud_type: string;
  description: string;
  transaction_id?: string;
  bank_name?: string;
  phone_number?: string;
  evidence_file_path?: string;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
  updates: ComplaintUpdateItem[];
}

export const complaintService = {
  async createComplaint(formData: FormData): Promise<ComplaintResponse> {
    const response = await api.post<ComplaintResponse>('/complaints/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getComplaints(): Promise<ComplaintResponse[]> {
    const response = await api.get<ComplaintResponse[]>('/complaints/');
    return response.data;
  },
};
