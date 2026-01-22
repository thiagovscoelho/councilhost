import { Council } from '@/types/council';
import { Conclusion } from '@/types/conclusion';
import { Opinion } from '@/types/opinion';
import { formatDateTime } from './dateFormatter';

interface ConclusionWithDissent {
  conclusion: Conclusion;
  dissents: Opinion[];
}

export function generateStandardStatement(
  council: Council,
  conclusions: Conclusion[],
  opinions: Opinion[]
): string {
  const acceptedMembers = council.members.filter(m => m.status === 'accepted');
  const activeConclusions = conclusions.filter(c => c.isActive);

  // Categorize conclusions
  const unanimous: Conclusion[] = [];
  const majoritarian: ConclusionWithDissent[] = [];

  for (const conclusion of activeConclusions) {
    const conclusionOpinions = opinions.filter(o => o.conclusionId === conclusion.id);
    const supports = conclusionOpinions.filter(o => o.type === 'support');
    const opposes = conclusionOpinions.filter(o => o.type === 'oppose');

    if (opposes.length === 0 && supports.length === acceptedMembers.length) {
      unanimous.push(conclusion);
    } else if (supports.length > opposes.length) {
      majoritarian.push({ conclusion, dissents: opposes });
    }
  }

  // Format statement
  const startDate = formatDateTime(council.createdAt);
  const endDate = formatDateTime(council.resolvedAt || new Date().toISOString());
  const usernames = acceptedMembers.map(m => `@${m.username}`).join(', ');

  let statement = `From ${startDate} to ${endDate}, we, the X users ${usernames} convened a council on the issue: ${council.issue}. `;

  if (unanimous.length > 0) {
    statement += `We have resolved, unanimously, on the following conclusions: ${formatConclusions(unanimous)}. `;
  }

  if (majoritarian.length > 0) {
    statement += `A majority also resolved on the following conclusions: ${formatConclusions(majoritarian.map(m => m.conclusion))}. `;
    statement += `The minority adds their dissent: ${formatDissents(majoritarian)}.`;
  }

  return statement;
}

export function generateCloseStatement(council: Council): string {
  const acceptedMembers = council.members.filter(m => m.status === 'accepted');
  const startDate = formatDateTime(council.createdAt);
  const endDate = formatDateTime(council.resolvedAt || new Date().toISOString());
  const usernames = acceptedMembers.map(m => `@${m.username}`).join(', ');

  return `From ${startDate} to ${endDate}, the X users ${usernames} convened a council on the issue: ${council.issue}. The council was closed without resolving upon any conclusions.`;
}

function formatConclusions(conclusions: Conclusion[]): string {
  if (conclusions.length === 0) return 'none';
  if (conclusions.length === 1) return `"${conclusions[0].text}"`;

  const items = conclusions.map(c => `"${c.text}"`);
  const last = items.pop();
  return items.join(', ') + ', and ' + last;
}

function formatDissents(items: ConclusionWithDissent[]): string {
  const dissents = items.flatMap(({ conclusion, dissents }) =>
    dissents.map(d => `@${d.username} dissents on "${conclusion.text}": ${d.reasoning}`)
  );

  if (dissents.length === 0) return 'none';
  return dissents.join('; ');
}
