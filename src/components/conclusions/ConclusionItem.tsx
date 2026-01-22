import { useState } from 'react';
import { Conclusion } from '@/types/conclusion';
import { Opinion } from '@/types/opinion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OpinionForm } from './OpinionForm';
import { AmendmentForm } from './AmendmentForm';
import { formatRelativeTime } from '@/utils/dateFormatter';
import './ConclusionItem.css';

interface ConclusionItemProps {
  conclusion: Conclusion;
  opinions: Opinion[];
  currentUser: string;
  onOpine: (type: 'support' | 'oppose', reasoning: string) => void;
  onAmend: (text: string) => void;
  hasUserOpined: boolean;
  isCouncilActive?: boolean;
}

export function ConclusionItem({
  conclusion,
  opinions,
  currentUser,
  onOpine,
  onAmend,
  hasUserOpined,
  isCouncilActive = true,
}: ConclusionItemProps) {
  const [showOpinions, setShowOpinions] = useState(false);
  const [isOpinionFormOpen, setIsOpinionFormOpen] = useState(false);
  const [isAmendmentFormOpen, setIsAmendmentFormOpen] = useState(false);

  const supportCount = opinions.filter(o => o.type === 'support').length;
  const opposeCount = opinions.filter(o => o.type === 'oppose').length;

  return (
    <>
      <Card className="conclusion-item">
        <div className="conclusion-header">
          <div className="conclusion-badges">
            {conclusion.isAmendment && (
              <span className="amendment-badge">Amendment</span>
            )}
            {conclusion.replacedById && (
              <span className="replaced-badge">Replaced</span>
            )}
          </div>
          <div className="conclusion-meta">
            <span className="conclusion-author">@{conclusion.proposedBy}</span>
            <span className="conclusion-time">{formatRelativeTime(conclusion.proposedAt)}</span>
          </div>
        </div>

        <p className="conclusion-text">{conclusion.text}</p>

        <div className="conclusion-stats">
          <div className="stat-item stat-support">
            <span className="stat-icon">✓</span>
            <span className="stat-count">{supportCount} Support</span>
          </div>
          <div className="stat-item stat-oppose">
            <span className="stat-icon">✕</span>
            <span className="stat-count">{opposeCount} Oppose</span>
          </div>
        </div>

        <div className="conclusion-actions">
          {isCouncilActive && (
            <>
              {!hasUserOpined ? (
                <>
                  <Button
                    onClick={() => setIsOpinionFormOpen(true)}
                    variant="primary"
                    size="small"
                  >
                    Opine
                  </Button>
                  <Button
                    onClick={() => setIsAmendmentFormOpen(true)}
                    variant="outline"
                    size="small"
                  >
                    Amend
                  </Button>
                </>
              ) : (
                <span className="already-opined">You've opined on this</span>
              )}
            </>
          )}

          {opinions.length > 0 && (
            <Button
              onClick={() => setShowOpinions(!showOpinions)}
              variant="outline"
              size="small"
            >
              {showOpinions ? 'Hide' : 'Show'} Opinions ({opinions.length})
            </Button>
          )}
        </div>

        {showOpinions && opinions.length > 0 && (
          <div className="opinions-list">
            <h4>Opinions:</h4>
            {opinions.map(opinion => (
              <div key={opinion.id} className={`opinion-item opinion-${opinion.type}`}>
                <div className="opinion-header">
                  <span className="opinion-author">@{opinion.username}</span>
                  <span className={`opinion-type-badge opinion-type-${opinion.type}`}>
                    {opinion.type}
                  </span>
                </div>
                <p className="opinion-reasoning">{opinion.reasoning}</p>
                <span className="opinion-time">{formatRelativeTime(opinion.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <OpinionForm
        isOpen={isOpinionFormOpen}
        onClose={() => setIsOpinionFormOpen(false)}
        onSubmit={onOpine}
        conclusionText={conclusion.text}
      />

      <AmendmentForm
        isOpen={isAmendmentFormOpen}
        onClose={() => setIsAmendmentFormOpen(false)}
        onSubmit={onAmend}
        originalText={conclusion.text}
      />
    </>
  );
}
