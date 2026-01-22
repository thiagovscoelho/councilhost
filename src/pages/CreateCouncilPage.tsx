import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/MockAuthProvider';
import { CouncilService } from '@/services/councilService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Card } from '@/components/ui/Card';
import { validateCouncilIssue, parseUsernames, validateUsername } from '@/utils/validators';
import { generateInviteLink } from '@/utils/urlGenerator';
import './CreateCouncilPage.css';

export default function CreateCouncilPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState('');
  const [usernamesInput, setUsernamesInput] = useState('');
  const [errors, setErrors] = useState<{ issue?: string; usernames?: string }>({});
  const [createdCouncilId, setCreatedCouncilId] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string>('');

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { issue?: string; usernames?: string } = {};

    // Validate issue
    if (!validateCouncilIssue(issue)) {
      newErrors.issue = 'Issue must be at least 10 characters';
    }

    // Parse and validate usernames
    const usernames = parseUsernames(usernamesInput);
    if (usernames.length === 0) {
      newErrors.usernames = 'Please enter at least one username';
    } else {
      const invalidUsernames = usernames.filter(u => !validateUsername(u));
      if (invalidUsernames.length > 0) {
        newErrors.usernames = `Invalid usernames: ${invalidUsernames.join(', ')}`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Add current user to the list if not already included
    const allUsernames = usernames.includes(currentUser!)
      ? usernames
      : [currentUser!, ...usernames];

    // Create council
    const council = CouncilService.createCouncil(issue, allUsernames, currentUser!);
    const link = generateInviteLink(council.id);

    setCreatedCouncilId(council.id);
    setInviteLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copied to clipboard!');
  };

  if (createdCouncilId) {
    return (
      <div className="create-council-page">
        <div className="create-council-container">
          <Card>
            <div className="success-container">
              <h1>Council Created!</h1>
              <p className="success-message">
                Your council has been created successfully. Share this link with the invited members:
              </p>

              <div className="invite-link-container">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="invite-link-input"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button onClick={handleCopyLink} variant="primary">
                  Copy Link
                </Button>
              </div>

              <div className="success-actions">
                <Button onClick={() => navigate(`/council/${createdCouncilId}`)} variant="success" size="large">
                  Go to Council
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" size="large">
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="create-council-page">
      <div className="create-council-container">
        <header className="create-header">
          <div>
            <h1>Create a New Council</h1>
            <p className="create-subtitle">
              Define the issue and invite X users to participate
            </p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            Cancel
          </Button>
        </header>

        <Card>
          <form onSubmit={handleSubmit} className="create-form">
            <TextArea
              label="Council Issue"
              placeholder="What issue should this council deliberate on?"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              error={errors.issue}
              rows={4}
              required
            />

            <div className="form-hint">
              Clearly describe the topic or question this council will address.
            </div>

            <TextArea
              label="Invited X Usernames"
              placeholder="username1, username2, username3&#10;or one per line"
              value={usernamesInput}
              onChange={(e) => setUsernamesInput(e.target.value)}
              error={errors.usernames}
              rows={6}
              required
            />

            <div className="form-hint">
              Enter X usernames separated by commas or new lines. You will automatically be added as a member.
            </div>

            <Button type="submit" variant="primary" size="large" className="submit-button">
              Create Council
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
