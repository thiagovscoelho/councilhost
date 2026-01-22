import { Conclusion } from '@/types/conclusion';
import { ConclusionApi } from './api/conclusionApi';

export class ConclusionService {
  static async getConclusionsByCouncil(councilId: string): Promise<Conclusion[]> {
    return ConclusionApi.getConclusionsByCouncil(councilId);
  }

  static async getActiveConclusions(councilId: string): Promise<Conclusion[]> {
    const conclusions = await this.getConclusionsByCouncil(councilId);
    return conclusions.filter(c => c.isActive);
  }

  static async createConclusion(
    councilId: string,
    text: string
  ): Promise<Conclusion> {
    return ConclusionApi.createConclusion({
      councilId,
      text,
      isAmendment: false,
    });
  }

  static async createAmendment(
    councilId: string,
    originalConclusionId: string,
    text: string
  ): Promise<Conclusion> {
    return ConclusionApi.createConclusion({
      councilId,
      text,
      isAmendment: true,
      replacesId: originalConclusionId,
    });
  }
}
