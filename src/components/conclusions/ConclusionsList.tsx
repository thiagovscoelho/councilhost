import { Conclusion } from '@/types/conclusion';
import { Opinion } from '@/types/opinion';
import { ConclusionItem } from './ConclusionItem';
import { ProposalForm } from './ProposalForm';
import './ConclusionsList.css';

interface ConclusionsListProps {
  conclusions: Conclusion[];
  opinions: Opinion[];
  currentUser: string;
  onPropose: (text: string) => void;
  onOpine: (conclusionId: string, type: 'support' | 'oppose', reasoning: string) => void;
  onAmend: (conclusionId: string, text: string) => void;
  hasUserOpined: (conclusionId: string) => boolean;
  isCouncilActive?: boolean;
}

export function ConclusionsList({
  conclusions,
  opinions,
  currentUser,
  onPropose,
  onOpine,
  onAmend,
  hasUserOpined,
  isCouncilActive = true,
}: ConclusionsListProps) {
  const activeConclusions = conclusions.filter(c => c.isActive);

  return (
    <div className="conclusions-list">
      <div className="conclusions-header">
        <h2>Proposed Conclusions</h2>
        <p className="conclusions-count">{activeConclusions.length} active</p>
      </div>

      {isCouncilActive && <ProposalForm onSubmit={onPropose} />}

      {activeConclusions.length === 0 ? (
        <div className="empty-conclusions">
          <p>No conclusions have been proposed yet. Be the first to propose one!</p>
        </div>
      ) : (
        <div className="conclusions-items">
          {activeConclusions.map(conclusion => (
            <ConclusionItem
              key={conclusion.id}
              conclusion={conclusion}
              opinions={opinions.filter(o => o.conclusionId === conclusion.id)}
              currentUser={currentUser}
              onOpine={(type, reasoning) => onOpine(conclusion.id, type, reasoning)}
              onAmend={(text) => onAmend(conclusion.id, text)}
              hasUserOpined={hasUserOpined(conclusion.id)}
              isCouncilActive={isCouncilActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
