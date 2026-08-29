import React, { useState } from 'react';
import { Trophy, Search, ChevronRight, ChevronDown, Activity, Zap, Shield, GitCommit, Filter, Calendar, FolderGit2, ExternalLink, HelpCircle, X, Edit, Trash2 } from 'lucide-react';
import { calculateTeamHealthScore } from '../services/githubService';

export default function Leaderboard({ teams, commits, onSelectTeam, onSelectCommit, onEditTeam, onDeleteTeam }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('commits'); // 'commits', 'date', 'health', 'loc'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Compute stats for each team
  const teamsWithStats = teams.map((team, idx) => {
    // Get all team commits sorted by date
    const teamCommits = commits
      .filter(c => c.teamId === team.id || c.teamName === team.name)
      .sort((a, b) => (b.rawTime || 0) - (a.rawTime || 0));

    const latestCommit = teamCommits[0];
    const latestRawTime = latestCommit ? (latestCommit.rawTime || 0) : 0;
    const latestCommitDateStr = latestCommit ? latestCommit.timestamp : (team.lastCommitTime || 'No commits recorded');
    const effectiveCommits = teamCommits.length;
    const computedHealth = calculateTeamHealthScore(team, teamCommits);

    return {
      ...team,
      teamCommits,
      latestCommit,
      latestRawTime,
      latestCommitDateStr,
      effectiveCommits,
      computedHealth,
      rank: idx + 1
    };
  });

  // Filter
  const filteredTeams = teamsWithStats.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase()) ||
                          t.repo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Sort
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === 'commits') return b.effectiveCommits - a.effectiveCommits;
    if (sortBy === 'date') return b.latestRawTime - a.latestRawTime;
    if (sortBy === 'health') return b.computedHealth - a.computedHealth;
    if (sortBy === 'loc') return b.linesAdded - a.linesAdded;
    return 0;
  });

  const toggleExpand = (teamId, e) => {
    e.stopPropagation();
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  return (
    <div className="animate-slide-in" style={{ paddingBottom: '40px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--outline)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(78, 222, 163, 0.15)',
            border: '1px solid var(--tertiary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={24} color="var(--tertiary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
              HACKATHON_LEADERBOARD // TOP TEAMS
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              RANKINGS BY COMMIT VELOCITY, RECENT COMMIT DATES & CODE HEALTH
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search team or repo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', width: '220px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ fontSize: '12px', padding: '8px 12px', backgroundColor: 'var(--bg-surface-low)', color: 'var(--text-main)', border: '1px solid var(--outline)', borderRadius: '6px', cursor: 'pointer' }}
            >
              <option value="commits" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}>Total Commits</option>
              <option value="date" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}>Latest Commit Date</option>
              <option value="loc" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}>Lines of Code</option>
              <option value="health" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}>Health Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--outline)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-surface-lowest)',
                borderBottom: '1px solid var(--outline)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-dim)',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '16px 20px', width: '60px' }}>RANK</th>
                <th style={{ padding: '16px 20px' }}>TEAM NAME & REPO</th>
                <th style={{ padding: '16px 20px' }}>CATEGORY</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>TOTAL COMMITS</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>LAST COMMIT DATE</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>LINES (+ / -)</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div
                    onClick={() => setIsHealthModalOpen(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--secondary)' }}
                    title="Click to view how Health Score is measured"
                  >
                    HEALTH <HelpCircle size={13} />
                  </div>
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    No active teams found on leaderboard. Register a team or import teams to begin tracking commit activity.
                  </td>
                </tr>
              ) : (
                sortedTeams.map((team, idx) => {
                  const rankNum = idx + 1;
                  const isTop3 = rankNum <= 3;
                  const isExpanded = expandedTeamId === team.id;

                  return (
                    <React.Fragment key={team.id}>
                      <tr
                        onClick={() => onSelectTeam(team)}
                        style={{
                          borderBottom: '1px solid var(--outline)',
                          backgroundColor: isExpanded ? 'var(--bg-surface-high)' : (idx % 2 === 0 ? 'var(--bg-surface-low)' : 'var(--bg-surface)'),
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                        }}
                        onMouseOut={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-surface-low)' : 'var(--bg-surface)';
                        }}
                      >
                        {/* Rank */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '14px',
                            color: rankNum === 1 ? '#eab308' : rankNum === 2 ? 'var(--secondary)' : rankNum === 3 ? '#d97706' : 'var(--text-dim)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: isTop3 ? 'var(--bg-surface-high)' : 'transparent',
                            border: isTop3 ? '1px solid var(--outline)' : 'none'
                          }}>
                            #{rankNum}
                          </span>
                        </td>

                        {/* Team Name & Repo */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: `${team.avatarColor || 'var(--primary)'}25`,
                              border: `1px solid ${team.avatarColor || 'var(--primary)'}`,
                              color: team.avatarColor || 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '12px',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {team.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '14px' }}>
                                {team.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                                {team.repo}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-surface-high)',
                            border: '1px solid var(--outline)',
                            color: 'var(--text-muted)'
                          }}>
                            {team.category || 'General'}
                          </span>
                        </td>

                        {/* Total Commits */}
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '15px',
                            color: 'var(--primary-bright)'
                          }}>
                            {team.effectiveCommits}
                          </span>
                        </td>

                        {/* Last Commit Date Column */}
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: team.latestCommit ? 'var(--tertiary)' : 'var(--text-dim)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600
                          }}>
                            <Calendar size={13} color="var(--secondary)" />
                            {team.latestCommitDateStr}
                          </span>
                        </td>

                        {/* Lines Changed */}
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                            <span style={{ color: 'var(--tertiary)', fontWeight: 700 }}>+{(team.linesAdded || 0).toLocaleString()}</span>
                            <span style={{ color: 'var(--error)', marginLeft: '6px' }}>-{(team.linesDeleted || 0).toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Health */}
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsHealthModalOpen(true);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            title="Click to view Health Score formula details"
                          >
                            <div style={{
                              width: '60px',
                              height: '6px',
                              backgroundColor: 'var(--bg-surface-lowest)',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${team.computedHealth}%`,
                                height: '100%',
                                backgroundColor: team.computedHealth > 85 ? 'var(--tertiary)' : team.computedHealth > 70 ? 'var(--secondary)' : 'var(--error)'
                              }} />
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                              {team.computedHealth}%
                            </span>
                          </div>
                        </td>

                        {/* Actions: View Commits & View Team */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={(e) => toggleExpand(team.id, e)}
                              title="Toggle team commits view"
                              style={{
                                backgroundColor: isExpanded ? 'rgba(76, 215, 246, 0.2)' : 'var(--bg-surface-high)',
                                border: '1px solid var(--outline)',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                color: isExpanded ? 'var(--secondary)' : 'var(--text-muted)',
                                fontSize: '11px',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <GitCommit size={13} /> {team.teamCommits.length} COMMITS {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTeam(team);
                              }}
                              style={{
                                backgroundColor: 'var(--bg-surface-high)',
                                border: '1px solid var(--outline)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'var(--primary-bright)',
                                fontSize: '12px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              DETAILS <ChevronRight size={14} />
                            </button>

                            {onEditTeam && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditTeam(team);
                                }}
                                title="Edit Team"
                                style={{
                                  backgroundColor: 'rgba(128, 131, 255, 0.1)',
                                  border: '1px solid var(--outline)',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  color: 'var(--primary)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Edit size={14} />
                              </button>
                            )}

                            {onDeleteTeam && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTeam(team.id);
                                }}
                                title="Delete Team (2nd Confirmation Required)"
                                style={{
                                  backgroundColor: 'rgba(255, 180, 171, 0.1)',
                                  border: '1px solid var(--error)',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  color: 'var(--error)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Team Commits Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} style={{ padding: '0 20px 20px 20px', backgroundColor: 'var(--bg-surface-high)', borderBottom: '1px solid var(--outline)' }}>
                            <div style={{
                              backgroundColor: 'var(--bg-surface-lowest)',
                              border: '1px solid var(--outline)',
                              borderRadius: '8px',
                              padding: '16px',
                              marginTop: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <GitCommit size={14} /> COMMITS FOR {team.name.toUpperCase()} (ARRANGED BY COMMIT DATE)
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
                                  {team.teamCommits.length} commits recorded
                                </span>
                              </div>

                              {team.teamCommits.length === 0 ? (
                                <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', padding: '12px', textAlign: 'center' }}>
                                  No commits fetched yet for this team. Click DETAILS to open team view and sync latest GitHub commits.
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {team.teamCommits.map((c) => (
                                    <div
                                      key={c.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectCommit) onSelectCommit(c);
                                      }}
                                      style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        border: '1px solid var(--outline)',
                                        borderRadius: '6px',
                                        padding: '10px 14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--primary-bright)' }}>
                                          {c.id}
                                        </span>
                                        <span style={{ color: 'var(--text-heading)', fontSize: '13px', fontWeight: 600 }}>
                                          {c.message}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                                          by {c.author}
                                        </span>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <Calendar size={12} /> {c.timestamp}
                                        </span>
                                        {c.htmlUrl && (
                                          <a
                                            href={c.htmlUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
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
                                              backgroundColor: 'rgba(76, 215, 246, 0.1)'
                                            }}
                                          >
                                            <ExternalLink size={10} /> DIFF
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Score Metric Explanation Modal */}
      {isHealthModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(6, 14, 32, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div 
            className="animate-slide-in"
            style={{
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--secondary)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(76, 215, 246, 0.25)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={22} color="var(--tertiary)" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                  HEALTH_SCORE // METRIC FORMULA
                </h3>
              </div>
              <button
                onClick={() => setIsHealthModalOpen(false)}
                style={{
                  backgroundColor: 'var(--bg-surface-high)',
                  border: '1px solid var(--outline)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              The Team Health Score (0 – 100%) is calculated dynamically in real-time using four telemetry metrics:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px', color: 'var(--tertiary)', marginBottom: '4px' }}>
                  <span>1. Commit Velocity (35 Points Max)</span>
                  <span>35% Weight</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Measures total commit throughput during the hackathon. Teams reaching 8+ commits achieve maximum velocity points.
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px', color: 'var(--secondary)', marginBottom: '4px' }}>
                  <span>2. Commit Recency (30 Points Max)</span>
                  <span>30% Weight</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Evaluates how recently the team pushed code. Pushing code within the last 2 hours earns full recency credit.
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px', color: 'var(--primary-bright)', marginBottom: '4px' }}>
                  <span>3. Code Refactor Hygiene (20 Points Max)</span>
                  <span>20% Weight</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Checks balance between code additions and deletions. Healthy codebases refactor and clean up old code.
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px', color: '#ffb4ab', marginBottom: '4px' }}>
                  <span>4. Stability & Build Health (15 Points Max)</span>
                  <span>15% Weight</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Calculated based on commit message stability patterns and ratio of quick bug fixes / rollbacks versus feature additions.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setIsHealthModalOpen(false)}
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: '#003640',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '12px'
                }}
              >
                GOT_IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
