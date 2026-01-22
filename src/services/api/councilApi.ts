import { apiClient } from './client';
import { Council } from '@/types/council';

export interface CreateCouncilRequest {
  issue: string;
  invitedUsernames: string[];
}

export class CouncilApi {
  static async getAllCouncils(): Promise<Council[]> {
    return apiClient.get<Council[]>('/api/councils');
  }

  static async getCouncil(id: string): Promise<Council> {
    return apiClient.get<Council>(`/api/councils/${id}`);
  }

  static async createCouncil(data: CreateCouncilRequest): Promise<Council> {
    return apiClient.post<Council>('/api/councils', data);
  }

  static async acceptInvitation(councilId: string): Promise<void> {
    return apiClient.post(`/api/councils/${councilId}/accept`);
  }

  static async declineInvitation(councilId: string): Promise<void> {
    return apiClient.post(`/api/councils/${councilId}/decline`);
  }
}
