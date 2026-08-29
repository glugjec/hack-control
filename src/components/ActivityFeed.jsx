import React, { useState } from 'react';
import { Radio, Search, Filter, Terminal, GitCommit, GitPullRequest, AlertTriangle, CheckCircle, Code, Layers, Zap, ExternalLink, FolderGit2 } from 'lucide-react';

export default function ActivityFeed({ commits, teams, onSelectCommit, onSelectTeam }) {
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  // Category stats calculation
  const categories = ['AI & ML', 'Cloud / Distributed', 'Hardware & IoT', 'Cybersecurity', 'Web3 & Infra'];
  const categoryStats = categories.map(cat => {
    const catTeams = teams.filter(t => t.category === cat);
    const catCommits = commits.filter(c => {
      const team = teams.find(t => t.id === c.teamId || t.name === c.teamName);
      return team && team.category === cat;
    });
    return {
      category: cat,
      teamsCount: catTeams.length,
      commitsCount: catCommits.length + catTeams.reduce((acc, t) => acc + (t.totalCommits || 0), 0)
    };
  });

  // Filter commits
  const filteredCommits = commits.filter(c => {
    const matchesType = filterType === 'ALL' || c.type === filterType;
    const matchesSearch = c.message.toLowerCase().includes(search.toLowerCase()) ||
                          c.teamName.toLowerCase().includes(search.toLowerCase()) ||
                          c.author.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="animate-slide-in" style={{ paddingBottom: '40px' }}>
      {/* Category Overview Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {categoryStats.map((cs, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--outline)',
              borderRadius: '8px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontWeight: 700 }}>
                {cs.category}
              </span>
              <Layers size={14} color="var(--secondary)" />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-heading)' }}>
                {cs.commitsCount}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {cs.teamsCount} teams
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Intel Stream Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--outline)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Stream Filter Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--outline)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={20} color="var(--secondary)" />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                GLOBAL_EVENT_STREAM
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                REAL-TIME AUDIT TRAIL OF ALL HACKATHON COMMIT ACTIVITIES
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Filter Type Pills */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-lowest)', padding: '4px', borderRadius: '6px', border: '1px solid var(--outline)' }}>
              {['ALL', 'feat', 'fix', 'merge', 'error'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: filterType === t ? 'var(--primary)' : 'transparent',
                    color: filterType === t ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search commit or team..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '12px', width: '200px' }}
              />
            </div>
          </div>
        </div>

        {/* Commit Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCommits.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              No matching activity events found in stream.
            </div>
          ) : (
            filteredCommits.map((c) => {
              const isError = c.type === 'error';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCommit(c)}
                  style={{
                    backgroundColor: isError ? 'rgba(255, 180, 171, 0.05)' : 'var(--bg-surface-lowest)',
                    border: `1px solid ${isError ? 'var(--error)' : 'var(--outline)'}`,
                    borderRadius: '8px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = isError ? 'var(--error)' : 'var(--secondary)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = isError ? 'var(--error)' : 'var(--outline)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      marginTop: '2px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: isError ? 'rgba(255, 180, 171, 0.2)' : 'var(--bg-surface-high)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isError ? <AlertTriangle size={16} color="var(--error)" /> : <GitCommit size={16} color="var(--secondary)" />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            const tObj = teams.find(t => t.id === c.teamId || t.name === c.teamName);
                            if (tObj) onSelectTeam(tObj);
                          }}
                          style={{
                            fontWeight: 700,
                            color: 'var(--primary-bright)',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {c.teamName}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>•</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--secondary)' }}>
                          [{c.branch}]
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>by {c.author}</span>
                      </div>

                      <div style={{ color: 'var(--text-heading)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                        {c.message}
                      </div>

                      {c.details && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
                          {c.details}
                        </div>
                      )}
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
                          title="View Commit Diff on GitHub"
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
                      <span style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-surface-high)',
                        color: 'var(--primary-bright)'
                      }}>
                        {c.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {c.timestamp}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
