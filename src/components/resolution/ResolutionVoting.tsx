import { ResolutionMotion } from '@/types/resolution';
import { CouncilMember } from '@/types/council';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import './ResolutionVoting.css';

interface ResolutionVotingProps {
  resolution: ResolutionMotion | null;
  members: CouncilMember[];
  currentUser: string;
  onVote: (vote: 'support' | 'oppose') => void;
  onProposeResolution: () => void;
  onProposeClose: () => void;
}

export function ResolutionVoting({
  resolution,
  members,
  currentUser,
  onVote,
  onProposeResolution,
  onProposeClose,
}: ResolutionVotingProps) {
  const acceptedMembers = members.filter(m => m.status === 'accepted');

  if (!resolution) {
    return (
      <Card className="resolution-voting no-active-resolution">
        <h3>Move to Resolve</h3>
        <p className="resolution-description">
          Propose a resolution to end the council and generate a final statement.
        </p>
        <div className="resolution-actions">
          <Button onClick={onProposeResolution} variant="success" size="large">
            Move to Resolve
          </Button>
          <Button onClick={onProposeClose} variant="secondary" size="large">
            Close Without Resolving
          </Button>
        </div>
      </Card>
    );
  }

  const supportVotes = resolution.votes.filter(v => v.vote === 'support');
  const opposeVotes = resolution.votes.filter(v => v.vote === 'oppose');
  const userVote = resolution.votes.find(v => v.username === currentUser);
  const isUnanimous =
    supportVotes.length === acceptedMembers.length &&
    acceptedMembers.every(m => supportVotes.some(v => v.username === m.username));

  return (
    <Card className="resolution-voting active-resolution">
      <div className="resolution-header">
        <h3>Active Resolution Motion</h3>
        {isUnanimous && (
          <span className="unanimous-badge">Unanimous!</span>
        )}
      </div>

      <p className="resolution-type">
        <strong>Type:</strong>{' '}
        {resolution.type === 'standard' ? 'Move to Resolve' : 'Close Without Resolving'}
      </p>

      <p className="resolution-proposer">
        Proposed by <strong>@{resolution.proposedBy}</strong>
      </p>

      <div className="vote-progress">
        <div className="vote-stats">
          <div className="vote-stat vote-stat-support">
            <span className="vote-stat-label">Support</span>
            <span className="vote-stat-count">{supportVotes.length} / {acceptedMembers.length}</span>
          </div>
          <div className="vote-stat vote-stat-oppose">
            <span className="vote-stat-label">Oppose</span>
            <span className="vote-stat-count">{opposeVotes.length}</span>
          </div>
        </div>

        <div className="vote-progress-bar">
          <div
            className="vote-progress-fill"
            style={{ width: `${(supportVotes.length / acceptedMembers.length) * 100}%` }}
          />
        </div>

        <p className="unanimity-requirement">
          Requires unanimous support from all members to pass
        </p>
      </div>

      <div className="members-votes">
        <h4>Member Votes:</h4>
        <div className="members-votes-list">
          {acceptedMembers.map(member => {
            const vote = resolution.votes.find(v => v.username === member.username);
            return (
              <div key={member.username} className="member-vote-item">
                <span className="member-vote-name">@{member.username}</span>
                {vote ? (
                  <span className={`member-vote-badge vote-${vote.vote}`}>
                    {vote.vote}
                  </span>
                ) : (
                  <span className="member-vote-badge vote-pending">pending</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!userVote ? (
        <div className="resolution-actions">
          <Button onClick={() => onVote('support')} variant="success" size="large">
            Vote Support
          </Button>
          <Button onClick={() => onVote('oppose')} variant="secondary" size="large">
            Vote Oppose
          </Button>
        </div>
      ) : (
        <div className="user-voted">
          <p>
            You voted: <strong className={`vote-${userVote.vote}`}>{userVote.vote}</strong>
          </p>
          <p className="change-vote-hint">Click to change your vote:</p>
          <div className="resolution-actions">
            <Button onClick={() => onVote('support')} variant="success" size="small">
              Support
            </Button>
            <Button onClick={() => onVote('oppose')} variant="secondary" size="small">
              Oppose
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
