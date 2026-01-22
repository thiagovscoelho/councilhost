import { Council } from '@/types/council';
import { CouncilApi } from './api/councilApi';

export class CouncilService {
  static async getAllCouncils(): Promise<Council[]> {
    return CouncilApi.getAllCouncils();
  }

  static async getCouncil(id: string): Promise<Council | null> {
    try {
      return await CouncilApi.getCouncil(id);
    } catch (error) {
      console.error('Failed to get council:', error);
      return null;
    }
  }

  static async createCouncil(issue: string, invitedUsernames: string[]): Promise<Council> {
    return CouncilApi.createCouncil({
      issue,
      invitedUsernames,
    });
  }

  static async acceptInvitation(councilId: string): Promise<void> {
    return CouncilApi.acceptInvitation(councilId);
  }

  static async declineInvitation(councilId: string): Promise<void> {
    return CouncilApi.declineInvitation(councilId);
  }

  static async isUserMember(councilId: string): Promise<boolean> {
    try {
      const council = await this.getCouncil(councilId);
      return council !== null;
    } catch (error) {
      return false;
    }
  }
}
