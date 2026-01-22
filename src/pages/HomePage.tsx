import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/MockAuthProvider';
import { CouncilService } from '@/services/councilService';
import { Council } from '@/types/council';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { validateUsername } from '@/utils/validators';
import { formatRelativeTime } from '@/utils/dateFormatter';
import './HomePage.css';

export default function HomePage() {
  const { currentUser, login, logout, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [councils, setCouncils] = useState<Council[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadCouncils();
    }
  }, [isAuthenticated, currentUser]);

  const loadCouncils = () => {
    if (currentUser) {
      const userCouncils = CouncilService.getUserCouncils(currentUser);
      setCouncils(userCouncils);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUsername(username)) {
      setError('Username must be 4-15 characters (letters, numbers, underscore)');
      return;
    }

    login(username);
    setUsername('');
  };

  const handleLogout = () => {
    logout();
    setCouncils([]);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'status-active',
      resolved: 'status-resolved',
      closed: 'status-closed',
    };
    return badges[status] || 'status-active';
  };

  const getMemberStatus = (council: Council) => {
    const member = council.members.find(m => m.username === currentUser);
    return member?.status || 'not-member';
  };

  if (!isAuthenticated) {
    return (
      <div className="home-page">
        <div className="login-container">
          <div className="login-header">
            <h1>Council.host</h1>
            <p className="tagline">Convene • Propose • Opine • Amend • Resolve</p>
          </div>

          <Card>
            <form onSubmit={handleLogin} className="login-form">
              <h2>Enter Your X Username</h2>
              <p className="login-description">
                This is a prototype using mock authentication. No password required.
              </p>

              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={error}
                autoFocus
              />

              <Button type="submit" size="large" className="login-button">
                Continue
              </Button>
            </form>
          </Card>

          <div className="how-it-works">
            <h3>How It Works</h3>
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="step-icon">1</div>
                <div className="step-content">
                  <h4>Convene</h4>
                  <p>Create a council on a specific issue and invite X users to participate</p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="step-icon">2</div>
                <div className="step-content">
                  <h4>Propose</h4>
                  <p>Members propose conclusions to address the council issue</p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="step-icon">3</div>
                <div className="step-content">
                  <h4>Opine</h4>
                  <p>Support or oppose conclusions with your reasoning</p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="step-icon">4</div>
                <div className="step-content">
                  <h4>Amend</h4>
                  <p>Propose amendments that replace originals if more popular</p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="step-icon">5</div>
                <div className="step-content">
                  <h4>Resolve</h4>
                  <p>Vote unanimously to publish a joint statement signed by all members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div>
            <h1>Council.host</h1>
            <p className="user-info">Logged in as @{currentUser}</p>
          </div>
          <div className="header-actions">
            <Button onClick={() => navigate('/create')} variant="primary">
              Create Council
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </header>

        <main className="councils-section">
          <h2>Your Councils</h2>

          {councils.length === 0 ? (
            <Card>
              <div className="empty-state">
                <p>You haven't joined any councils yet.</p>
                <Button onClick={() => navigate('/create')} variant="primary">
                  Create Your First Council
                </Button>
              </div>
            </Card>
          ) : (
            <div className="councils-grid">
              {councils.map((council) => {
                const memberStatus = getMemberStatus(council);

                return (
                  <Card
                    key={council.id}
                    hover
                    onClick={() => {
                      if (memberStatus === 'accepted') {
                        navigate(`/council/${council.id}`);
                      } else if (memberStatus === 'invited') {
                        navigate(`/invite/${council.id}`);
                      }
                    }}
                    className="council-card"
                  >
                    <div className="council-card-header">
                      <span className={`status-badge ${getStatusBadge(council.status)}`}>
                        {council.status}
                      </span>
                      {memberStatus === 'invited' && (
                        <span className="invite-badge">Invitation Pending</span>
                      )}
                    </div>

                    <h3 className="council-issue">{council.issue}</h3>

                    <div className="council-meta">
                      <p className="council-convener">Convened by @{council.convener}</p>
                      <p className="council-time">{formatRelativeTime(council.createdAt)}</p>
                      <p className="council-members">
                        {council.members.filter(m => m.status === 'accepted').length} /{' '}
                        {council.members.length} members
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
