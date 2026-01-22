export type OpinionType = 'support' | 'oppose';

export interface Opinion {
  id: string;
  conclusionId: string;
  councilId: string;
  username: string;
  type: OpinionType;
  reasoning: string;
  createdAt: string;
}
