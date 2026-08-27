import React, { useState } from 'react';
import { X, Plus, Terminal, CheckCircle2, Loader2, GitBranch, GitPullRequest, Layers, AlertCircle, ExternalLink } from 'lucide-react';
import { parseGitHubRepo, validateGitHubRepo } from '../services/githubService';

export default function AddTeamModal({ isOpen, onClose, onAddTeam }) {
  const [name, setName] = useState('');
  const [repo, setRepo] = useState('');
  const [category, setCategory] = useState('');
  const [members, setMembers] = useState('');
  const [problem, setProblem] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!repo.trim()) {
      alert('Please enter a GitHub repository URL to test.');
      return;
    }

    const parsed = parseGitHubRepo(repo);
    if (!parsed) {
      setTestResult({
        success: false,
        error: 'Invalid format. Use owner/repo or github.com/owner/repo (e.g. facebook/react)'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await validateGitHubRepo(parsed.owner, parsed.repo);
    setIsTesting(false);
    setTestResult(result);

    if (result.success && result.description && !problem) {
      setProblem(result.description);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !repo.trim()) {
      alert('Please fill in team name and repository.');
      return;
    }

    const parsed = parseGitHubRepo(repo);
    const cleanRepo = parsed ? `${parsed.owner}/${parsed.repo}` : repo.trim();

    const memberList = members
      ? members.split(',').map((m, idx) => ({ name: m.trim(), role: idx === 0 ? 'Lead Dev' : 'Contributor' }))
      : [{ name: 'Team Lead', role: 'Developer' }];

    const colors = ['#8083ff', '#4cd7f6', '#4edea3', '#c0c1ff', '#ffb4ab'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newTeam = {
      id: `team-${Date.now()}`,
      name: name.trim().replace(/\s+/g, '_'),
      repo: `github.com/${cleanRepo}`,
      ownerRepo: parsed ? { owner: parsed.owner, repo: parsed.repo } : null,
      category,
      status: 'ACTIVE',
      members: memberList,
      totalCommits: testResult && testResult.stars ? testResult.stars + 12 : 15,
      linesAdded: Math.floor(Math.random() * 5000) + 1200,
      linesDeleted: Math.floor(Math.random() * 800) + 150,
      healthScore: 99,
      lastCommitTime: 'Just now',
      problemStatement: problem.trim() || 'Real GitHub repository active telemetry monitoring.',
      avatarColor
    };

    onAddTeam(newTeam);
    // Reset
    setName('');
    setRepo('');
    setMembers('');
    setProblem('');
    setTestResult(null);
    onClose();
  };

  return (
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
          border: '1px solid var(--primary)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '640px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(128, 131, 255, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--outline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(128, 131, 255, 0.15)',
              border: '1px solid var(--primary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={18} color="var(--primary-bright)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>
                INITIALIZE_NEW_TEAM
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                REGISTER REAL GITHUB REPO OR HACKATHON UNIT FOR TELEMETRY
              </p>
            </div>
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
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', maxHeight: '75vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Team Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                TEAM_NAME <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber_Guard or Team_Alpha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* GitHub Repo */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                GITHUB_REPOSITORY_URL (Real GitHub Repos Supported!) <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. owner/repository or user/repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  style={{
                    backgroundColor: 'var(--bg-surface-high)',
                    border: '1px solid var(--outline)',
                    borderRadius: '6px',
                    padding: '0 16px',
                    color: 'var(--secondary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isTesting ? <Loader2 size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <GitPullRequest size={14} />}
                  PING_GITHUB_API
                </button>
              </div>

              {testResult && testResult.success && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(78, 222, 163, 0.1)',
                  border: '1px solid var(--tertiary)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} /> GitHub API Verified! Connected to [{testResult.branch}] branch ({testResult.stars} stars)
                </div>
              )}

              {testResult && !testResult.success && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 180, 171, 0.1)',
                  border: '1px solid var(--error)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--error)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} /> {testResult.error}
                </div>
              )}
            </div>

            {/* Track / Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                PROJECT_CATEGORY (Optional)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">None / Unassigned (Keep Blank)</option>
                <option value="AI & ML">AI & Machine Learning</option>
                <option value="Cloud / Distributed">Cloud / Distributed Infrastructure</option>
                <option value="Hardware & IoT">Hardware & IoT Mesh</option>
                <option value="Cybersecurity">Cybersecurity & Zero Trust</option>
                <option value="Web3 & Infra">Web3 & Decentralized Apps</option>
              </select>
            </div>

            {/* Members */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                TEAM_MEMBERS (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Elena Rostova, Marcus Chen, Sarah Jenkins"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                PROBLEM_STATEMENT / MISSION SUMMARY
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe what this team is building..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--outline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'var(--bg-surface-high)',
                border: '1px solid var(--outline)',
                padding: '10px 18px',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '13px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#07006c',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(128, 131, 255, 0.4)'
              }}
            >
              <Terminal size={16} />
              ACTIVATE_TELEMETRY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
