export interface Council {
  id: string;
  issue: string;
  convener: string;
  invitedUsernames: string[];
  members: CouncilMember[];
  createdAt: string;
  resolvedAt?: string;
  status: 'active' | 'resolved' | 'closed';
}

export interface CouncilMember {
  username: string;
  joinedAt: string;
  status: 'invited' | 'accepted' | 'declined';
}
