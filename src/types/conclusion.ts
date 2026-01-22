export interface Conclusion {
  id: string;
  councilId: string;
  text: string;
  proposedBy: string;
  proposedAt: string;
  isAmendment: boolean;
  replacesId?: string;
  replacedById?: string;
  isActive: boolean;
}
