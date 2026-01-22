import { apiClient } from './client';
import { Conclusion } from '@/types/conclusion';
import { Opinion } from '@/types/opinion';

export interface CreateConclusionRequest {
  councilId: string;
  text: string;
  isAmendment?: boolean;
  replacesId?: string;
}

export interface CreateOpinionRequest {
  stance: 'support' | 'oppose';
  reasoning: string;
}

export class ConclusionApi {
  static async getConclusionsByCouncil(councilId: string): Promise<Conclusion[]> {
    return apiClient.get<Conclusion[]>(`/api/conclusions/council/${councilId}`);
  }

  static async createConclusion(data: CreateConclusionRequest): Promise<Conclusion> {
    return apiClient.post<Conclusion>('/api/conclusions', data);
  }

  static async createOpinion(
    conclusionId: string,
    data: CreateOpinionRequest
  ): Promise<Opinion> {
    return apiClient.post<Opinion>(`/api/conclusions/${conclusionId}/opinion`, data);
  }
}
