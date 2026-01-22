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

// API Response type for resolutions
export interface Resolution {
  id: string;
  council_id: string;
  proposed_by: number;
  type: 'resolve' | 'close';
  status: 'pending' | 'passed' | 'failed';
  created_at: string;
  proposed_by_username?: string;
  votes?: Array<{
    username: string;
    vote: 'support' | 'oppose';
  }>;
}
