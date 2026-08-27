import React, { useState, useEffect } from 'react';
import { X, Save, Terminal, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { parseGitHubRepo, validateGitHubRepo } from '../services/githubService';

export default function EditTeamModal({ isOpen, onClose, team, onSaveTeam, onDeleteTeam }) {
  const [name, setName] = useState('');
  const [repo, setRepo] = useState('');
  const [category, setCategory] = useState('');
  const [members, setMembers] = useState('');
  const [problem, setProblem] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (team) {
      setName(team.name || '');
      setRepo(team.repo || '');
      setCategory(team.category || 'General');
      setMembers(team.members ? team.members.map(m => m.name).join(', ') : '');
      setProblem(team.problemStatement || '');
      setTestResult(null);
    }
  }, [team, isOpen]);

  if (!isOpen || !team) return null;

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !repo.trim()) {
      alert('Please fill in team name and repository.');
      return;
    }

    const parsed = parseGitHubRepo(repo);
    const cleanRepo = parsed ? `github.com/${parsed.owner}/${parsed.repo}` : repo.trim();

    const memberList = members
      ? members.split(',').map((m, idx) => ({ name: m.trim(), role: idx === 0 ? 'Lead Dev' : 'Contributor' }))
      : team.members || [{ name: 'Team Lead', role: 'Developer' }];

    const updatedTeam = {
      ...team,
      name: name.trim().replace(/\s+/g, '_'),
      repo: cleanRepo,
      ownerRepo: parsed ? { owner: parsed.owner, repo: parsed.repo } : team.ownerRepo,
      category,
      members: memberList,
      problemStatement: problem.trim() || team.problemStatement
    };

    onSaveTeam(updatedTeam);
    onClose();
  };

  const handleDeleteClick = () => {
    const confirmName = prompt(`2ND CONFIRMATION REQUIRED:\nType "${team.name}" to delete this team and all its recorded telemetry commits:`);
    if (confirmName === team.name) {
      onDeleteTeam(team.id);
      onClose();
    } else if (confirmName !== null) {
      alert('Team name did not match. Deletion canceled.');
    }
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
          backgroundColor: '#0a1628',
          border: '1px solid var(--border-neon)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.8), 0 0 30px rgba(76, 215, 246, 0.15)',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#060e20'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: 'rgba(128, 131, 255, 0.15)',
              color: 'var(--primary)',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Terminal size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '0.5px' }}>
                MODIFY TEAM DETAILS
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                UPDATE REPOSITORY & METRICS FOR {team.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Team Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '8px' }}>
              TEAM / PROJECT NAME *
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum_Devs"
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* GitHub Repo with Ping Test */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)' }}>
                PUBLIC GITHUB REPOSITORY *
              </label>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                style={{
                  backgroundColor: 'rgba(76, 215, 246, 0.1)',
                  color: 'var(--secondary)',
                  border: '1px solid rgba(76, 215, 246, 0.3)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: isTesting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isTesting ? <Loader2 size={12} className="animate-spin" /> : <Terminal size={12} />}
                {isTesting ? 'PINGING...' : 'PING API'}
              </button>
            </div>

            <input 
              type="text"
              required
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="github.com/facebook/react or owner/repo"
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: testResult ? (testResult.success ? '1px solid var(--tertiary)' : '1px solid var(--error)') : '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                outline: 'none'
              }}
            />

            {/* Test Result Indicator */}
            {testResult && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: testResult.success ? 'rgba(78, 222, 163, 0.1)' : 'rgba(255, 180, 171, 0.1)',
                color: testResult.success ? 'var(--tertiary)' : 'var(--error)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {testResult.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>
                  {testResult.success 
                    ? `API Verified: ${testResult.stars} ★ | Default Branch: ${testResult.branch}`
                    : testResult.error}
                </span>
              </div>
            )}
          </div>

          {/* Track / Category */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '8px' }}>
              HACKATHON TRACK / CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0a1628',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="AI & ML">AI & ML</option>
              <option value="Cloud / Distributed">Cloud / Distributed</option>
              <option value="Web3 & Infra">Web3 & Infra</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="General">General Hackathon</option>
            </select>
          </div>

          {/* Members */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '8px' }}>
              TEAM MEMBERS (COMMA SEPARATED)
            </label>
            <input 
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Dan Abramov, Sophie Alpert, Andrew Clark"
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '8px' }}>
              PROBLEM STATEMENT / SUMMARY
            </label>
            <textarea 
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Brief description of the project..."
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={handleDeleteClick}
              style={{
                backgroundColor: 'rgba(255, 180, 171, 0.1)',
                color: 'var(--error)',
                border: '1px solid var(--error)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              DELETE TEAM
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-light)',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                CANCEL
              </button>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(128, 131, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} /> SAVE CHANGES
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
