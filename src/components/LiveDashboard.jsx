import React, { useState, useEffect, useRef } from 'react';
import MetricsHeader from './MetricsHeader';
import { Activity, Plus, Terminal, RefreshCw, GitCommit, ChevronRight, Play, Pause, AlertTriangle, Shield, CheckCircle2, ExternalLink, FolderGit2, Calendar, Clock, Edit, Trash2, RotateCcw } from 'lucide-react';

export default function LiveDashboard({ 
  teams, 
  commits, 
  onSelectCommit, 
  onSelectTeam, 
  onOpenAddTeam, 
  onSimulateCommit, 
  isLiveSyncing, 
  setIsLiveSyncing,
  onEditTeam,
  onDeleteTeam,
  onResetHackathon
}) {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  // Generate real-time raw stdout log entries when commits update
  useEffect(() => {
    if (commits.length > 0) {
      const latest = commits[0];
      const logLine = `[${new Date().toLocaleTimeString()}] INFO git_sentinel::stream: commit=${latest.id} team=${latest.teamName} branch=${latest.branch} (+${latest.linesAdded}/-${latest.linesDeleted})`;
      setTerminalLogs((prev) => [logLine, ...prev.slice(0, 19)]);
    } else {
      setTerminalLogs([]);
    }
  }, [commits]);

  const totalLoc = commits.length > 0 
    ? commits.reduce((acc, c) => acc + (c.linesAdded || 0), 0)
    : teams.reduce((acc, t) => acc + (t.linesAdded || 0), 0);
  const healthAvg = teams.length > 0 
    ? Math.round(teams.reduce((acc, t) => acc + (t.healthScore || 80), 0) / teams.length) 
    : 0;

  const handleResetClick = () => {
    if (onResetHackathon) {
      onResetHackathon();
    }
  };

  return (
    <div className="animate-slide-in" style={{ paddingBottom: '40px' }}>
      {/* Top Metrics Cards */}
      <MetricsHeader
        teams={teams}
        commits={commits}
        teamsCount={teams.length}
        commitsCount={commits.length}
        totalLoc={totalLoc}
        latency={teams.length > 0 ? 12 : 0}
        healthAvg={healthAvg}
      />

      {/* CORE COMMAND TOOLBAR */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--outline)',
        borderRadius: '10px',
        padding: '14px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
            CORE_COMMAND :
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-bright)', fontFamily: 'var(--font-mono)' }}>
            REAL-TIME HACKATHON TELEMETRY ENGINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onSimulateCommit}
            style={{
              backgroundColor: 'rgba(76, 215, 246, 0.15)',
              border: '1px solid var(--secondary)',
              color: 'var(--secondary)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> SYNC_GITHUB_REPOS
          </button>

          <button
            onClick={handleResetClick}
            style={{
              backgroundColor: 'rgba(255, 180, 171, 0.12)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> RESET_HACKATHON
          </button>
        </div>
      </div>

      {/* Main Grid: Live Feed Left (2 Columns) + Raw Terminal Stream Right (1 Column) */}
      <div className="dashboard-grid">
        {/* Left Column: Live Commit Stream */}
        <div>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--outline)',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--outline)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" />
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                  LIVE_FEED
                </h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>
                SORTED BY COMMIT DATE | {commits.length} VISIBLE
              </span>
            </div>

            {/* Commit Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {commits.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface-lowest)',
                  borderRadius: '8px',
                  border: '1px dashed var(--outline)'
                }}>
                  <GitCommit size={24} color="var(--text-dim)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '14px' }}>
                    No Commit Telemetry Stream Recorded Yet
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)', maxWidth: '420px', margin: '4px auto 12px' }}>
                    Register a team or import teams via CSV spreadsheet to begin monitoring real-time telemetry events.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <button
                      onClick={onOpenAddTeam}
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800
                      }}
                    >
                      + REGISTER_FIRST_TEAM
                    </button>
                  </div>
                </div>
              ) : (
                commits.map((c) => {
                  const isError = c.type === 'error';
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCommit(c)}
                      style={{
                        backgroundColor: isError ? 'rgba(255, 180, 171, 0.05)' : 'var(--bg-surface-lowest)',
                        border: `1px solid ${isError ? 'var(--error)' : 'var(--outline)'}`,
                        borderRadius: '6px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = isError ? 'var(--error)' : 'var(--primary)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = isError ? 'var(--error)' : 'var(--outline)';
                        e.currentTarget.style.backgroundColor = isError ? 'rgba(255, 180, 171, 0.05)' : 'var(--bg-surface-lowest)';
                      }}
                    >
                      {/* Left indicator bar */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: isError ? 'var(--error)' : c.type === 'feat' ? 'var(--tertiary)' : c.type === 'fix' ? 'var(--secondary)' : 'var(--primary)'
                      }} />

                      <div style={{ paddingLeft: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                const tObj = teams.find(t => t.id === c.teamId || t.name === c.teamName);
                                if (tObj) onSelectTeam(tObj);
                              }}
                              style={{
                                fontWeight: 800,
                                fontSize: '14px',
                                color: 'var(--primary-bright)',
                                cursor: 'pointer'
                              }}
                            >
                              {c.teamName}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-surface-highest)',
                              color: 'var(--secondary)'
                            }}>
                              {c.branch}
                            </span>
                          </div>

                          <span style={{
                            fontSize: '11px',
                            color: 'var(--tertiary)',
                            fontFamily: 'var(--font-mono)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            backgroundColor: 'rgba(78, 222, 163, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(78, 222, 163, 0.3)'
                          }}>
                            <Calendar size={12} color="var(--tertiary)" /> {c.timestamp}
                          </span>
                        </div>

                        <div style={{ color: 'var(--text-heading)', fontWeight: 600, fontSize: '14px', marginBottom: '6px', lineHeight: 1.3 }}>
                          {c.message}
                        </div>

                        {c.details && (
                          <div className="hide-on-mobile" style={{
                            fontSize: '11px',
                            color: isError ? 'var(--error)' : 'var(--text-muted)',
                            lineHeight: 1.4,
                            marginBottom: '6px'
                          }}>
                            {c.details}
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ color: 'var(--text-dim)' }}>author: {c.author}</span>
                            <span style={{ color: 'var(--tertiary)', fontWeight: 700 }}>+{c.linesAdded}</span>
                            <span style={{ color: 'var(--error)', fontWeight: 700 }}>-{c.linesDeleted}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {c.repoUrl && (
                              <a
                                href={c.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Open GitHub Repository"
                                style={{
                                  color: 'var(--secondary)',
                                  fontSize: '10px',
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
                                <FolderGit2 size={10} /> REPO
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
                                  fontSize: '10px',
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
                                <ExternalLink size={10} /> DIFF
                              </a>
                            )}
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              color: 'var(--primary-bright)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}>
                              <span className="desktop-only">INSPECT</span> <ChevronRight size={13} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Stream & Teams Quick List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Terminal stdout Log Box */}
          <div style={{
            backgroundColor: '#040814',
            border: '1px solid var(--primary-dark)',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid var(--bg-surface-highest)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--tertiary)', fontWeight: 700 }}>
                <Terminal size={13} /> RAW_LOG_STREAM
              </div>
              <button
                onClick={() => setIsLiveSyncing(!isLiveSyncing)}
                style={{
                  backgroundColor: 'transparent',
                  color: isLiveSyncing ? 'var(--tertiary)' : 'var(--text-dim)',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isLiveSyncing ? <Pause size={11} /> : <Play size={11} />}
                {isLiveSyncing ? 'STREAMING' : 'PAUSED'}
              </button>
            </div>

            <div style={{
              height: '180px',
              overflowY: 'auto',
              fontSize: '10px',
              color: 'var(--tertiary)',
              lineHeight: 1.4,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}>
              {terminalLogs.length === 0 ? (
                <div style={{ color: 'var(--text-dim)' }}>[SYSTEM] Initializing telemetry log pipeline...</div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={i} style={{ wordBreak: 'break-all' }}>
                    <span style={{ color: 'var(--text-dim)' }}>[{log.timestamp}]</span>{' '}
                    <span style={{ color: log.type === 'error' ? 'var(--error)' : 'var(--tertiary)' }}>{log.text}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Quick Active Teams Roster Panel */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--outline)',
            borderRadius: '10px',
            padding: '14px 16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--outline)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                MONITORED_TEAMS ({teams.length})
              </div>
              <button
                onClick={onOpenAddTeam}
                style={{
                  backgroundColor: 'rgba(128, 131, 255, 0.15)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary-bright)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700
                }}
              >
                + ADD
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflowY: 'auto' }}>
              {teams.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                  No teams registered.
                </div>
              ) : (
                teams.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTeam(t)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface-lowest)',
                      border: '1px solid var(--outline)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: t.status === 'ACTIVE' ? 'var(--tertiary)' : 'var(--text-dim)'
                      }} />
                      <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-heading)' }}>{t.name}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--secondary)' }}>
                        {commits.filter(c => c.teamId === t.id || c.teamName === t.name).length} commits
                      </span>
                    
                      {onEditTeam && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTeam(t);
                          }}
                          title="Edit Team Details"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                          <Edit size={13} />
                        </button>
                      )}

                      {onDeleteTeam && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTeam(t.id);
                          }}
                          title="Delete Team (Requires Confirmation)"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
