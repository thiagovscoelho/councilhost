import { FinalStatement as FinalStatementType } from '@/types/resolution';
import { Button } from '@/components/ui/Button';
import './FinalStatement.css';

interface FinalStatementProps {
  statement: FinalStatementType;
}

export function FinalStatement({ statement }: FinalStatementProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(statement.statement);
    alert('Statement copied to clipboard!');
  };

  return (
    <div className="final-statement-wrapper">
      <div className="final-statement">
        <div className="statement-watermark">
          <div className="watermark-logo">Council.host</div>
          <div className="watermark-tagline">Convene • Propose • Opine • Amend • Resolve</div>
        </div>

        <div className="statement-header">
          <div className="statement-title">
            <h2>Final Statement</h2>
            <span className={`statement-type-badge ${statement.type}`}>
              {statement.type === 'standard' ? '✓ Resolved' : '✕ Closed'}
            </span>
          </div>
        </div>

        <div className="statement-content">
          <p className="statement-text">{statement.statement}</p>
        </div>

        <div className="statement-footer">
          <div className="statement-timestamp">
            Generated on {new Date(statement.generatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <div className="statement-actions">
        <Button onClick={handleCopy} variant="primary" size="large">
          📋 Copy Statement
        </Button>
        <p className="statement-hint">Tip: Take a screenshot of the statement above to share</p>
      </div>
    </div>
  );
}
