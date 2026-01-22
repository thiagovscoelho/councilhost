export function validateUsername(username: string): boolean {
  // X usernames: 4-15 chars, alphanumeric + underscore
  return /^[a-zA-Z0-9_]{4,15}$/.test(username);
}

export function parseUsernames(input: string): string[] {
  // Split by comma or newline, trim, filter empty
  return input
    .split(/[,\n]/)
    .map(u => u.trim())
    .filter(u => u.length > 0);
}

export function validateCouncilIssue(issue: string): boolean {
  return issue.trim().length >= 10;
}

export function validateReasoning(reasoning: string): boolean {
  return reasoning.trim().length >= 10;
}

export function validateConclusionText(text: string): boolean {
  return text.trim().length >= 5;
}
