import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/MockAuthProvider';
import { CouncilService } from '@/services/councilService';
import { Council } from '@/types/council';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDateTime } from '@/utils/dateFormatter';
import './InvitationPage.css';

export default function InvitationPage() {
  const { councilId } = useParams<{ councilId: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [council, setCouncil] = useState<Council | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined' | 'not-invited'>('pending');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!councilId) {
      navigate('/');
      return;
    }

    loadCouncil();
  }, [councilId, isAuthenticated]);

  const loadCouncil = () => {
    if (!councilId) return;

    const loadedCouncil = CouncilService.getCouncil(councilId);

    if (!loadedCouncil) {
      setLoading(false);
      return;
    }

    setCouncil(loadedCouncil);

    // Check user's status
    const member = loadedCouncil.members.find(m => m.username === currentUser);

    if (!member) {
      setStatus('not-invited');
    } else {
      setStatus(member.status);
    }

    setLoading(false);
  };

  const handleAccept = () => {
    if (!councilId || !currentUser) return;

    CouncilService.acceptInvitation(councilId, currentUser);
    navigate(`/council/${councilId}`);
  };

  const handleDecline = () => {
    if (!councilId || !currentUser) return;

    CouncilService.declineInvitation(councilId, currentUser);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="invitation-page">
        <div className="invitation-container">
          <Card>
            <div className="loading-state">
              <p>Loading invitation...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!council) {
    return (
      <div className="invitation-page">
        <div className="invitation-container">
          <Card>
            <div className="error-state">
              <h2>Council Not Found</h2>
              <p>This council doesn't exist or the link is invalid.</p>
              <Button onClick={() => navigate('/')} variant="primary">
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'not-invited') {
    return (
      <div className="invitation-page">
        <div className="invitation-container">
          <Card>
            <div className="error-state">
              <h2>Not Invited</h2>
              <p>You (@{currentUser}) were not invited to this council.</p>
              <Button onClick={() => navigate('/')} variant="primary">
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="invitation-page">
        <div className="invitation-container">
          <Card>
            <div className="accepted-state">
              <h2>Already a Member</h2>
              <p>You have already accepted this invitation.</p>
              <Button onClick={() => navigate(`/council/${councilId}`)} variant="primary" size="large">
                Go to Council
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="invitation-page">
        <div className="invitation-container">
          <Card>
            <div className="declined-state">
              <h2>Invitation Declined</h2>
              <p>You previously declined this invitation.</p>
              <div className="declined-actions">
                <Button onClick={handleAccept} variant="primary">
                  Accept Now
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Status is 'invited' - show invitation
  return (
    <div className="invitation-page">
      <div className="invitation-container">
        <div className="invitation-header">
          <h1>Council Invitation</h1>
          <p className="invitation-user">@{currentUser}</p>
        </div>

        <Card>
          <div className="invitation-content">
            <div className="invitation-info">
              <h2>You've been invited to join a council</h2>

              <div className="council-details">
                <div className="detail-item">
                  <span className="detail-label">Convened by:</span>
                  <span className="detail-value">@{council.convener}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDateTime(council.createdAt)}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Members:</span>
                  <span className="detail-value">
                    {council.members.length} invited
                  </span>
                </div>
              </div>

              <div className="council-issue-section">
                <h3>Council Issue:</h3>
                <p className="council-issue-text">{council.issue}</p>
              </div>

              <div className="members-list">
                <h4>Invited Members:</h4>
                <div className="members-tags">
                  {council.members.map(member => (
                    <span
                      key={member.username}
                      className={`member-tag ${member.status}`}
                    >
                      @{member.username}
                      {member.status === 'accepted' && ' ✓'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="invitation-actions">
              <Button onClick={handleAccept} variant="success" size="large">
                Accept Invitation
              </Button>
              <Button onClick={handleDecline} variant="secondary" size="large">
                Decline
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Decide Later
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
