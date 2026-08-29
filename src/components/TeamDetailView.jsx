import React from 'react';
import { ArrowLeft, GitCommit, GitBranch, GitPullRequest, Shield, Users, Activity, Plus, CheckCircle2, AlertCircle, FileCode, ExternalLink, FolderGit2 } from 'lucide-react';

export default function TeamDetailView({ team, commits, onBack, onSelectCommit, onSimulateCommitForTeam }) {
  if (!team) return null;

  const teamCommits = commits.filter(c => c.teamId === team.id || c.teamName === team.name);

  return (
    <div className="animate-slide-in" style={{ paddingBottom: '40px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--outline)',
          padding: '8px 16px',
          borderRadius: '6px',
          color: 'var(--primary-bright)',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} /> BACK_TO_FEED
      </button>

      {/* Main Team Header Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--primary-dark)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(128, 131, 255, 0.15)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '10px',
              backgroundColor: `${team.avatarColor}20`,
              border: `2px solid ${team.avatarColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              color: team.avatarColor,
              fontFamily: 'var(--font-mono)'
            }}>
              {team.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                  {team.name}
                </h1>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: team.status === 'ACTIVE' ? 'rgba(78, 222, 163, 0.2)' : team.status === 'WARNING' ? 'rgba(255, 180, 171, 0.2)' : 'rgba(76, 215, 246, 0.2)',
                  border: `1px solid ${team.status === 'ACTIVE' ? 'var(--tertiary)' : team.status === 'WARNING' ? 'var(--error)' : 'var(--secondary)'}`,
                  color: team.status === 'ACTIVE' ? 'var(--tertiary)' : team.status === 'WARNING' ? 'var(--error)' : 'var(--secondary)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span className="pulse-dot" style={{ backgroundColor: team.status === 'ACTIVE' ? 'var(--tertiary)' : team.status === 'WARNING' ? 'var(--error)' : 'var(--secondary)' }} />
                  {team.status}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface-highest)',
                  color: 'var(--text-muted)'
                }}>
                  {team.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', color: 'var(--text-dim)', fontSize: '13px' }}>
                <a
                  href={team.repo ? (team.repo.startsWith('http') ? team.repo : `https://github.com/${team.repo.replace(/^github\.com\//, '')}`) : '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                >
                  <FolderGit2 size={15} /> OPEN REPOSITORY ({team.repo}) <ExternalLink size={12} />
                </a>
                <span>•</span>
                <span>Last Sync: {team.lastCommitTime || 'Just now'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSimulateCommitForTeam(team)}
            style={{
              backgroundColor: 'var(--secondary)',
              color: '#003640',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 14px rgba(76, 215, 246, 0.4)'
            }}
          >
            <Activity size={16} /> REFRESH_COMMITS
          </button>
        </div>

        {/* Mission Statement */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'var(--bg-surface-lowest)',
          borderRadius: '8px',
          border: '1px solid var(--outline)'
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>
            PROBLEM_STATEMENT & MISSION SPEC
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: 1.6 }}>
            {team.problemStatement}
          </p>
        </div>
      </div>

      {/* Grid Layout: Telemetry Stats + Team Roster */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Telemetry Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--outline)',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--primary-bright)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} /> LIVE TELEMETRY METRICS
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-lowest)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TOTAL COMMITS</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {team.totalCommits + teamCommits.length}
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-lowest)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>HEALTH SCORE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--tertiary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {team.healthScore}%
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-lowest)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LINES ADDED</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--tertiary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                +{(team.linesAdded).toLocaleString()}
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-lowest)', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LINES DELETED</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--error)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                -{(team.linesDeleted).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Roster Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--outline)',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> TEAM ROSTER ({team.members ? team.members.length : 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {team.members && team.members.map((m, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-lowest)',
                borderRadius: '6px',
                border: '1px solid var(--outline)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface-high)',
                    color: 'var(--primary-bright)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    {m.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '14px' }}>{m.name}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-dim)',
                  backgroundColor: 'var(--bg-surface-high)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Commit History */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--outline)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={18} color="var(--primary-bright)" /> TEAM COMMIT STREAM ({teamCommits.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Showing telemetry history
          </span>
        </div>

        {teamCommits.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            No commits recorded yet for this team. Click "REFRESH_COMMITS" above to fetch latest GitHub commits.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teamCommits.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCommit(c)}
                style={{
                  backgroundColor: 'var(--bg-surface-lowest)',
                  border: '1px solid var(--outline)',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--outline)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-lowest)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: 'var(--primary-bright)' }}>
                      {c.id}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--secondary)' }}>
                      [{c.branch}]
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>• {c.author}</span>
                  </div>
                  <div style={{ color: 'var(--text-heading)', fontWeight: 600, fontSize: '14px' }}>
                    {c.message}
                  </div>
                </div>

                <div style={{ textAlign: 'right', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {c.repoUrl && (
                      <a
                        href={c.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open Repository"
                        style={{
                          color: 'var(--secondary)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(76, 215, 246, 0.1)',
                          border: '1px solid var(--secondary)'
                        }}
                      >
                        <FolderGit2 size={11} /> REPO
                      </a>
                    )}
                    {c.htmlUrl && (
                      <a
                        href={c.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="View Diff on GitHub"
                        style={{
                          color: 'var(--primary-bright)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(128, 131, 255, 0.1)',
                          border: '1px solid var(--primary-bright)'
                        }}
                      >
                        <ExternalLink size={11} /> DIFF
                      </a>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    <span style={{ color: 'var(--tertiary)' }}>+{c.linesAdded}</span>{' '}
                    <span style={{ color: 'var(--error)' }}>-{c.linesDeleted}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {c.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
