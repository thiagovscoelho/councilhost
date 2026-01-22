import { apiClient } from './client';
import { Resolution } from '@/types/resolution';

export interface CreateResolutionRequest {
  councilId: string;
  type: 'resolve' | 'close';
}

export interface VoteOnResolutionRequest {
  vote: 'support' | 'oppose';
}

export class ResolutionApi {
  static async getResolutionsByCouncil(councilId: string): Promise<Resolution[]> {
    return apiClient.get<Resolution[]>(`/api/resolutions/council/${councilId}`);
  }

  static async createResolution(data: CreateResolutionRequest): Promise<Resolution> {
    return apiClient.post<Resolution>('/api/resolutions', data);
  }

  static async voteOnResolution(
    resolutionId: string,
    data: VoteOnResolutionRequest
  ): Promise<void> {
    return apiClient.post(`/api/resolutions/${resolutionId}/vote`, data);
  }
}
