import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/MockAuthProvider';
import { Council } from '@/types/council';
import { Conclusion } from '@/types/conclusion';
import { Opinion } from '@/types/opinion';
import { ResolutionMotion, FinalStatement as FinalStatementType } from '@/types/resolution';
import { CouncilService } from '@/services/councilService';
import { ConclusionService } from '@/services/conclusionService';
import { OpinionService } from '@/services/opinionService';
import { ResolutionService } from '@/services/resolutionService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConclusionsList } from '@/components/conclusions/ConclusionsList';
import { ResolutionVoting } from '@/components/resolution/ResolutionVoting';
import { FinalStatement } from '@/components/resolution/FinalStatement';
import { formatDateTime } from '@/utils/dateFormatter';
import './CouncilPage.css';

export default function CouncilPage() {
  const { councilId } = useParams<{ councilId: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [council, setCouncil] = useState<Council | null>(null);
  const [conclusions, setConclusions] = useState<Conclusion[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [resolution, setResolution] = useState<ResolutionMotion | null>(null);
  const [statement, setStatement] = useState<FinalStatementType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!councilId) {
      navigate('/');
      return;
    }

    loadCouncilData();

    // Poll for updates every 3 seconds
    const interval = setInterval(loadCouncilData, 3000);

    return () => clearInterval(interval);
  }, [councilId, isAuthenticated]);

  const loadCouncilData = () => {
    if (!councilId) return;

    const loadedCouncil = CouncilService.getCouncil(councilId);

    if (!loadedCouncil) {
      setLoading(false);
      return;
    }

    // Check if user is a member
    if (!CouncilService.isUserMember(councilId, currentUser!)) {
      navigate(`/invite/${councilId}`);
      return;
    }

    setCouncil(loadedCouncil);
    setConclusions(ConclusionService.getConclusionsByCouncil(councilId));
    setOpinions(OpinionService.getOpinionsByCouncil(councilId));
    setResolution(ResolutionService.getActiveResolution(councilId));

    if (loadedCouncil.status !== 'active') {
      const loadedStatement = ResolutionService.getStatement(councilId);
      setStatement(loadedStatement);
    }

    setLoading(false);
  };

  const handlePropose = (text: string) => {
    if (!councilId || !currentUser) return;
    ConclusionService.createConclusion(councilId, text, currentUser);
    loadCouncilData();
  };

  const handleOpine = (conclusionId: string, type: 'support' | 'oppose', reasoning: string) => {
    if (!councilId || !currentUser) return;
    OpinionService.createOpinion(councilId, conclusionId, currentUser, type, reasoning);
    loadCouncilData();
  };

  const handleAmend = (conclusionId: string, text: string) => {
    if (!councilId || !currentUser) return;
    ConclusionService.createAmendment(councilId, conclusionId, text, currentUser);
    loadCouncilData();
  };

  const hasUserOpined = (conclusionId: string): boolean => {
    if (!currentUser) return false;
    return OpinionService.hasUserOpined(conclusionId, currentUser);
  };

  const handleProposeResolution = () => {
    if (!councilId || !currentUser) return;
    ResolutionService.proposeResolution(councilId, 'standard', currentUser);
    loadCouncilData();
  };

  const handleProposeClose = () => {
    if (!councilId || !currentUser) return;
    ResolutionService.proposeResolution(councilId, 'close-without-resolving', currentUser);
    loadCouncilData();
  };

  const handleVote = (vote: 'support' | 'oppose') => {
    if (!resolution || !currentUser) return;
    ResolutionService.voteOnResolution(resolution.id, currentUser, vote);
    loadCouncilData();
  };

  if (loading) {
    return (
      <div className="council-page">
        <div className="council-container">
          <Card>
            <div className="loading-state">
              <p>Loading council...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!council) {
    return (
      <div className="council-page">
        <div className="council-container">
          <Card>
            <div className="error-state">
              <h2>Council Not Found</h2>
              <p>This council doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/')} variant="primary">
                Go to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const acceptedMembers = council.members.filter(m => m.status === 'accepted');

  return (
    <div className="council-page">
      <div className="council-container">
        <header className="council-header">
          <div className="council-header-content">
            <div className="council-status-row">
              <Button onClick={() => navigate('/')} variant="outline" size="small">
                ← Back
              </Button>
              <div className="status-badges">
                <Button onClick={() => setShowGuide(!showGuide)} variant="outline" size="small">
                  {showGuide ? 'Hide' : 'Show'} Guide
                </Button>
                <span className={`council-status-badge status-${council.status}`}>
                  {council.status}
                </span>
              </div>
            </div>

            <h1 className="council-title">Council Issue</h1>
            <p className="council-issue">{council.issue}</p>

            <div className="council-meta">
              <div className="council-meta-item">
                <span className="meta-label">Convened by:</span>
                <span className="meta-value">@{council.convener}</span>
              </div>
              <div className="council-meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{formatDateTime(council.createdAt)}</span>
              </div>
              {council.resolvedAt && (
                <div className="council-meta-item">
                  <span className="meta-label">Resolved:</span>
                  <span className="meta-value">{formatDateTime(council.resolvedAt)}</span>
                </div>
              )}
            </div>

            <div className="council-members">
              <h3>Members ({acceptedMembers.length})</h3>
              <div className="members-list">
                {acceptedMembers.map(member => (
                  <span key={member.username} className="member-badge">
                    @{member.username}
                  </span>
                ))}
              </div>
            </div>

            {showGuide && council.status === 'active' && (
              <div className="council-guide">
                <h3>📖 Quick Guide</h3>
                <div className="guide-sections">
                  <div className="guide-section">
                    <strong>Propose:</strong> Add new conclusions for the council to consider. Click "+ Propose Conclusion" to add your ideas.
                  </div>
                  <div className="guide-section">
                    <strong>Opine:</strong> Click "Opine" on any conclusion to support or oppose it with your reasoning. You can only opine once per conclusion.
                  </div>
                  <div className="guide-section">
                    <strong>Amend:</strong> Click "Amend" to propose a modified version. If your amendment gets more support, it replaces the original.
                  </div>
                  <div className="guide-section">
                    <strong>Resolve:</strong> When ready to end the council, use "Move to Resolve" at the bottom. All members must vote unanimously to generate a final statement.
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="council-content">
          {statement && <FinalStatement statement={statement} />}

          {council.status === 'active' && (
            <>
              <ConclusionsList
                conclusions={conclusions}
                opinions={opinions}
                currentUser={currentUser!}
                onPropose={handlePropose}
                onOpine={handleOpine}
                onAmend={handleAmend}
                hasUserOpined={hasUserOpined}
                isCouncilActive={true}
              />

              <ResolutionVoting
                resolution={resolution}
                members={council.members}
                currentUser={currentUser!}
                onVote={handleVote}
                onProposeResolution={handleProposeResolution}
                onProposeClose={handleProposeClose}
              />
            </>
          )}

          {council.status !== 'active' && (
            <div className="archived-conclusions">
              <h2>Archived Conclusions</h2>
              <ConclusionsList
                conclusions={conclusions}
                opinions={opinions}
                currentUser={currentUser!}
                onPropose={() => {}}
                onOpine={() => {}}
                onAmend={() => {}}
                hasUserOpined={hasUserOpined}
                isCouncilActive={false}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
