export type ResolutionType = 'standard' | 'close-without-resolving';

export interface ResolutionMotion {
  id: string;
  councilId: string;
  type: ResolutionType;
  proposedBy: string;
  proposedAt: string;
  votes: ResolutionVote[];
  isActive: boolean;
}

export interface ResolutionVote {
  username: string;
  vote: 'support' | 'oppose';
  createdAt: string;
}

export interface FinalStatement {
  councilId: string;
  type: ResolutionType;
  statement: string;
  generatedAt: string;
}
