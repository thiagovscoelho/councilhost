import { Resolution } from '@/types/resolution';
import { ResolutionApi } from './api/resolutionApi';

export class ResolutionService {
  static async getResolutionsByCouncil(councilId: string): Promise<Resolution[]> {
    return ResolutionApi.getResolutionsByCouncil(councilId);
  }

  static async getActiveResolution(councilId: string): Promise<Resolution | null> {
    const resolutions = await this.getResolutionsByCouncil(councilId);
    return resolutions.find(r => r.status === 'pending') || null;
  }

  static async proposeResolution(
    councilId: string,
    type: 'resolve' | 'close'
  ): Promise<Resolution> {
    return ResolutionApi.createResolution({
      councilId,
      type,
    });
  }

  static async voteOnResolution(
    resolutionId: string,
    vote: 'support' | 'oppose'
  ): Promise<void> {
    return ResolutionApi.voteOnResolution(resolutionId, {
      vote,
    });
  }
}
