export function generateInviteLink(councilId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/invite/${councilId}`;
}

export function generateCouncilLink(councilId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/council/${councilId}`;
}
