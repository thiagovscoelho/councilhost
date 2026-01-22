import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { validateConclusionText } from '@/utils/validators';
import './ProposalForm.css';

interface ProposalFormProps {
  onSubmit: (text: string) => void;
}

export function ProposalForm({ onSubmit }: ProposalFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateConclusionText(text)) {
      setError('Conclusion must be at least 5 characters');
      return;
    }

    onSubmit(text);
    setText('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="proposal-form-collapsed">
        <Button onClick={() => setIsExpanded(true)} variant="primary" size="large">
          + Propose Conclusion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="proposal-form">
      <h3>Propose a New Conclusion</h3>
      <TextArea
        placeholder="What conclusion do you propose?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={error}
        rows={3}
        autoFocus
      />
      <div className="proposal-form-actions">
        <Button type="submit" variant="primary">
          Submit Proposal
        </Button>
        <Button type="button" onClick={() => setIsExpanded(false)} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
