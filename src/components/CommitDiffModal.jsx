import React, { useState, useEffect } from 'react';
import { X, GitCommit, GitBranch, User, ExternalLink, FileCode, CheckCircle2, FolderGit2, FileText, Loader2 } from 'lucide-react';
import { fetchCommitDetails } from '../services/githubService';

export default function CommitDiffModal({ commit, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!commit) return;

    // If commit has GitHub repo info, fetch detailed file changes
    if (commit.owner && commit.repo && commit.fullSha) {
      setLoading(true);
      fetchCommitDetails(commit.owner, commit.repo, commit.fullSha)
        .then((res) => {
          if (res) {
            setDetails(res);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [commit]);

  if (!commit) return null;

  const getTypeStyle = (type) => {
    switch (type) {
      case 'merge':
        return { bg: 'rgba(128, 131, 255, 0.2)', border: 'var(--primary-bright)', color: 'var(--primary-bright)' };
      case 'feat':
        return { bg: 'rgba(78, 222, 163, 0.2)', border: 'var(--tertiary)', color: 'var(--tertiary)' };
      case 'fix':
        return { bg: 'rgba(76, 215, 246, 0.2)', border: 'var(--secondary)', color: 'var(--secondary)' };
      case 'error':
        return { bg: 'rgba(255, 180, 171, 0.2)', border: 'var(--error)', color: 'var(--error)' };
      default:
        return { bg: 'rgba(144, 143, 160, 0.2)', border: 'var(--text-dim)', color: 'var(--text-dim)' };
    }
  };

  const typeStyle = getTypeStyle(commit.type);

  // Derive repo URL and commit URL
  const repoUrl = commit.repoUrl || (commit.owner && commit.repo ? `https://github.com/${commit.owner}/${commit.repo}` : 'https://github.com');
  const commitUrl = commit.htmlUrl || (commit.owner && commit.repo && commit.fullSha ? `https://github.com/${commit.owner}/${commit.repo}/commit/${commit.fullSha}` : repoUrl);

  const files = details?.files || commit.files || [];
  const totalAdditions = details?.stats?.additions ?? commit.linesAdded;
  const totalDeletions = details?.stats?.deletions ?? commit.linesDeleted;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(6, 14, 32, 0.88)',
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
          border: '1px solid var(--primary-dark)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(128, 131, 255, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--outline)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: typeStyle.bg,
                border: `1px solid ${typeStyle.border}`,
                color: typeStyle.color,
                textTransform: 'uppercase'
              }}>
                {commit.type}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--primary-bright)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <GitCommit size={14} /> {commit.id}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>•</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <GitBranch size={13} /> {commit.branch || 'main'}
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {commit.message}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-surface-high)',
              border: '1px solid var(--outline)',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Details */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
            backgroundColor: 'var(--bg-surface-lowest)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--outline)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TEAM / REPO</div>
              <div style={{ fontWeight: 700, color: 'var(--primary-bright)', marginTop: '2px', wordBreak: 'break-all' }}>
                {commit.teamName}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>AUTHOR</div>
              <div style={{ fontWeight: 600, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} color="var(--secondary)" /> {commit.author}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{commit.timestamp}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LINE CHANGES</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', marginTop: '2px' }}>
                <span style={{ color: 'var(--tertiary)', fontWeight: 700 }}>+{totalAdditions}</span>
                <span style={{ color: 'var(--error)', fontWeight: 700, marginLeft: '8px' }}>-{totalDeletions}</span>
              </div>
            </div>
          </div>

          {/* Quick External Links Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: 'rgba(76, 215, 246, 0.12)',
                border: '1px solid var(--secondary)',
                color: 'var(--secondary)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FolderGit2 size={14} /> REPOSITORY: {commit.owner ? `${commit.owner}/${commit.repo}` : commit.teamName} <ExternalLink size={12} />
            </a>

            <a
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: 'rgba(128, 131, 255, 0.15)',
                border: '1px solid var(--primary-bright)',
                color: 'var(--primary-bright)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <GitCommit size={14} /> VIEW COMMIT DIFF ON GITHUB <ExternalLink size={12} />
            </a>
          </div>

          {/* Loading indicator when fetching files from GitHub */}
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'var(--bg-surface-lowest)',
              borderRadius: '6px',
              color: 'var(--secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              <Loader2 size={16} className="animate-spin" />
              Fetching modified files and live diffs from GitHub API...
            </div>
          )}

          {/* FILES CHANGED LIST SECTION */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <FileCode size={15} color="var(--primary-bright)" /> FILES CHANGED ({files.length > 0 ? files.length : commit.filesChanged || 1})
              </div>
            </div>

            {files.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.map((file, idx) => {
                  const statusColor = file.status === 'added' ? 'var(--tertiary)' : file.status === 'removed' ? 'var(--error)' : 'var(--secondary)';
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'var(--bg-surface-lowest)',
                        border: '1px solid var(--outline)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={15} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#fff', wordBreak: 'break-all' }}>
                          {file.filename}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          backgroundColor: 'var(--bg-surface-highest)',
                          color: statusColor,
                          border: `1px solid ${statusColor}`,
                          textTransform: 'uppercase'
                        }}>
                          {file.status || 'modified'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                        {file.additions !== undefined && (
                          <span style={{ color: 'var(--tertiary)', fontWeight: 700 }}>+{file.additions}</span>
                        )}
                        {file.deletions !== undefined && (
                          <span style={{ color: 'var(--error)', fontWeight: 700 }}>-{file.deletions}</span>
                        )}
                        {file.blobUrl && (
                          <a
                            href={file.blobUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                          >
                            View file <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-lowest)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {commit.filesChanged || 1} file(s) modified in this commit. Click "VIEW COMMIT DIFF ON GITHUB" to inspect file details.
              </div>
            )}
          </div>

          {/* CODE DIFF PREVIEW SECTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={14} /> DIFF PATCH PREVIEW
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--secondary)' }}>
                UNIFIED DIFF MODE
              </span>
            </div>

            {files.some(f => f.patch) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {files.filter(f => f.patch).map((file, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--outline)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{
                      backgroundColor: 'var(--bg-surface-highest)',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--secondary)',
                      borderBottom: '1px solid var(--outline)'
                    }}>
                      {file.filename}
                    </div>
                    <pre style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      backgroundColor: '#040914',
                      padding: '14px',
                      margin: 0,
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                      color: 'var(--text-main)'
                    }}>
                      {file.patch.split('\n').map((line, i) => {
                        let color = 'var(--text-muted)';
                        let bg = 'transparent';
                        if (line.startsWith('+')) {
                          color = 'var(--tertiary)';
                          bg = 'rgba(78, 222, 163, 0.08)';
                        } else if (line.startsWith('-')) {
                          color = 'var(--error)';
                          bg = 'rgba(255, 180, 171, 0.08)';
                        } else if (line.startsWith('@@')) {
                          color = 'var(--secondary)';
                          bg = 'rgba(76, 215, 246, 0.08)';
                        }
                        return (
                          <div key={i} style={{ color, backgroundColor: bg, padding: '1px 4px', borderRadius: '2px' }}>
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                backgroundColor: '#040914',
                border: '1px solid var(--bg-surface-highest)',
                borderRadius: '8px',
                padding: '16px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: 'var(--text-main)'
              }}>
                {commit.diffSummary ? commit.diffSummary.split('\n').map((line, i) => {
                  let color = 'var(--text-muted)';
                  let bg = 'transparent';
                  if (line.startsWith('+')) {
                    color = 'var(--tertiary)';
                    bg = 'rgba(78, 222, 163, 0.08)';
                  } else if (line.startsWith('-')) {
                    color = 'var(--error)';
                    bg = 'rgba(255, 180, 171, 0.08)';
                  }
                  return (
                    <div key={i} style={{ color, backgroundColor: bg, padding: '1px 4px', borderRadius: '2px' }}>
                      {line}
                    </div>
                  );
                }) : '+ // No inline patch provided. View on GitHub for full visual diff.'}
              </pre>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--outline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tertiary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <CheckCircle2 size={14} /> Commit verified by Git Sentinel
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'var(--bg-surface-high)',
                border: '1px solid var(--outline)',
                padding: '8px 16px',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            <a
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#07006c',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(128, 131, 255, 0.3)'
              }}
            >
              View on GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
