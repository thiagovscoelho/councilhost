import { Opinion } from '@/types/opinion';
import { ConclusionApi } from './api/conclusionApi';

export class OpinionService {
  static async createOpinion(
    conclusionId: string,
    stance: 'support' | 'oppose',
    reasoning: string
  ): Promise<Opinion> {
    return ConclusionApi.createOpinion(conclusionId, {
      stance,
      reasoning,
    });
  }
}
