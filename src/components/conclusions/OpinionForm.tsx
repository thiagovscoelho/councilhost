import { useState } from 'react';
import { OpinionType } from '@/types/opinion';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Modal } from '@/components/ui/Modal';
import { validateReasoning } from '@/utils/validators';
import './OpinionForm.css';

interface OpinionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: OpinionType, reasoning: string) => void;
  conclusionText: string;
}

export function OpinionForm({ isOpen, onClose, onSubmit, conclusionText }: OpinionFormProps) {
  const [type, setType] = useState<OpinionType>('support');
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateReasoning(reasoning)) {
      setError('Reasoning must be at least 10 characters');
      return;
    }

    onSubmit(type, reasoning);
    setType('support');
    setReasoning('');
    onClose();
  };

  const handleClose = () => {
    setType('support');
    setReasoning('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Opine on Conclusion">
      <form onSubmit={handleSubmit} className="opinion-form">
        <div className="conclusion-preview">
          <p className="conclusion-preview-label">Conclusion:</p>
          <p className="conclusion-preview-text">"{conclusionText}"</p>
        </div>

        <RadioGroup
          name="opinion-type"
          label="Your Opinion"
          value={type}
          onChange={(value) => setType(value as OpinionType)}
          options={[
            { value: 'support', label: 'Support' },
            { value: 'oppose', label: 'Oppose' },
          ]}
        />

        <TextArea
          label="Reasoning"
          placeholder="Explain your position..."
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          error={error}
          rows={4}
          required
        />

        <div className="opinion-form-actions">
          <Button type="submit" variant={type === 'support' ? 'success' : 'secondary'} size="large">
            Submit Opinion
          </Button>
          <Button type="button" onClick={handleClose} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
