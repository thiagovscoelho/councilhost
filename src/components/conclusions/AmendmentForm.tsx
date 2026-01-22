import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Modal } from '@/components/ui/Modal';
import { validateConclusionText } from '@/utils/validators';
import './AmendmentForm.css';

interface AmendmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  originalText: string;
}

export function AmendmentForm({ isOpen, onClose, onSubmit, originalText }: AmendmentFormProps) {
  const [text, setText] = useState(originalText);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateConclusionText(text)) {
      setError('Amendment must be at least 5 characters');
      return;
    }

    if (text.trim() === originalText.trim()) {
      setError('Amendment must be different from the original');
      return;
    }

    onSubmit(text);
    setText(originalText);
    onClose();
  };

  const handleClose = () => {
    setText(originalText);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Propose Amendment">
      <form onSubmit={handleSubmit} className="amendment-form">
        <p className="amendment-description">
          Modify the conclusion below. If your amendment receives more support than the original,
          it will replace it.
        </p>

        <div className="original-preview">
          <p className="original-label">Original Conclusion:</p>
          <p className="original-text">"{originalText}"</p>
        </div>

        <TextArea
          label="Your Amendment"
          placeholder="Propose your amended version..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={error}
          rows={4}
          required
        />

        <div className="amendment-form-actions">
          <Button type="submit" variant="primary" size="large">
            Submit Amendment
          </Button>
          <Button type="button" onClick={handleClose} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
