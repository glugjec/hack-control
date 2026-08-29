import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Terminal, Download, Sparkles } from 'lucide-react';
import { parseGitHubRepo, fetchRealGitHubCommits } from '../services/githubService';

const SAMPLE_CSV = `Team Name,Repository,Category,Members,Mission
Cyber_Guard,null-pointers/kernel-guard,Cybersecurity,Viktor Krum; Siddharth Rao,Kernel Memory Security
Alpha_Ops,alpha-org/mesh-net,Cloud / Distributed,Alex Rivera; Elena Chen,Distributed P2P Mesh Routing
Neural_Nodes,neural-labs/vision-model,AI & ML,Devon Vance; Maya Lin,Real-time Vision Inference`;

export default function BulkImportModal({ isOpen, onClose, onBulkAddTeams }) {
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  // Helper to parse CSV lines
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];

    // Check if first line is header
    const hasHeader = lines[0].toLowerCase().includes('team') || lines[0].toLowerCase().includes('repo') || lines[0].toLowerCase().includes('name');
    const startIdx = hasHeader ? 1 : 0;

    const parsedTeams = [];
    const colors = ['#8083ff', '#4cd7f6', '#4edea3', '#c0c1ff', '#ffb4ab'];

    for (let i = startIdx; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
      if (row.length < 2) continue; // Must have at least Team Name & Repo

      const name = row[0] || `Team_${i}`;
      const repo = row[1] || '';
      const category = row[2] || ''; // Can be blank!
      const membersRaw = row[3] || '';
      const mission = row[4] || 'Bulk imported hackathon team.';

      const memberList = membersRaw
        ? membersRaw.split(';').map((m, idx) => ({ name: m.trim(), role: idx === 0 ? 'Lead Dev' : 'Contributor' }))
        : [{ name: 'Team Lead', role: 'Developer' }];

      const parsedRepo = parseGitHubRepo(repo);
      const cleanRepoStr = parsedRepo ? `${parsedRepo.owner}/${parsedRepo.repo}` : repo.replace(/^https?:\/\//, '').replace(/^github\.com\//, '').replace(/\.git$/, '');

      parsedTeams.push({
        id: `team-${Date.now()}-${i}`,
        name: name.replace(/\s+/g, '_'),
        repo: cleanRepoStr ? `github.com/${cleanRepoStr}` : 'github.com/org/repo',
        ownerRepo: parsedRepo ? { owner: parsedRepo.owner, repo: parsedRepo.repo } : null,
        category: category, // Can be empty string
        status: 'ACTIVE',
        members: memberList,
        totalCommits: 0,
        linesAdded: 0,
        linesDeleted: 0,
        healthScore: 80,
        lastCommitTime: 'No commits recorded',
        problemStatement: mission,
        avatarColor: colors[i % colors.length]
      });
    }

    return parsedTeams;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsvText(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvText.trim()) {
      alert('Please paste CSV content or upload a CSV file.');
      return;
    }

    setIsProcessing(true);
    setImportStatus(null);

    const parsedTeams = parseCSV(csvText);
    if (parsedTeams.length === 0) {
      setIsProcessing(false);
      setImportStatus({ success: false, error: 'Could not parse any valid team rows from CSV.' });
      return;
    }

    // Process GitHub API commits for teams with valid ownerRepo
    const teamsWithCommits = [];
    const bulkCommits = [];

    for (const team of parsedTeams) {
      if (team.ownerRepo) {
        try {
          const realCommits = await fetchRealGitHubCommits(team.ownerRepo.owner, team.ownerRepo.repo, team.id, team.name);
          if (Array.isArray(realCommits)) {
            const formatted = realCommits.map(c => ({
              ...c,
              teamId: team.id,
              teamName: team.name
            }));
            if (formatted.length > 0) {
              bulkCommits.push(...formatted);
              team.totalCommits = formatted.length;
              team.linesAdded = formatted.reduce((acc, c) => acc + (c.linesAdded || 0), 0);
              team.linesDeleted = formatted.reduce((acc, c) => acc + (c.linesDeleted || 0), 0);
              team.lastCommitTime = formatted[0].timestamp;
            } else {
              team.totalCommits = 0;
              team.linesAdded = 0;
              team.linesDeleted = 0;
              team.lastCommitTime = 'No commits recorded';
            }
          }
        } catch (err) {
          // Fallback handled gracefully
        }
      }
      teamsWithCommits.push(team);
    }

    setIsProcessing(false);
    onBulkAddTeams(teamsWithCommits, bulkCommits);
    setImportStatus({ success: true, count: teamsWithCommits.length });

    setTimeout(() => {
      setCsvText('');
      setImportStatus(null);
      onClose();
    }, 1200);
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
          border: '1px solid var(--secondary)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(76, 215, 246, 0.25)',
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
              backgroundColor: 'rgba(76, 215, 246, 0.15)',
              border: '1px solid var(--secondary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={18} color="var(--secondary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '0.02em' }}>
                BULK_TEAM_IMPORT // CSV SPREADSHEET
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                IMPORT MULTIPLE TEAMS AT ONCE VIA CSV FILE OR PASTE
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

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '75vh' }}>
          {/* File Upload Box */}
          <div style={{
            border: '2px dashed var(--outline)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface-lowest)',
            marginBottom: '16px',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            />
            <FileText size={28} color="var(--secondary)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '14px' }}>
              Upload .CSV File or Drag & Drop
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Supports standard spreadsheet exports (Comma Separated)
            </div>
          </div>

          {/* Textarea Paste */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                OR PASTE CSV CONTENT DIRECTLY:
              </label>
              <button
                type="button"
                onClick={() => setCsvText(SAMPLE_CSV)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--secondary)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} /> Load Sample CSV Template
              </button>
            </div>
            <textarea
              rows={7}
              placeholder={`Team Name,Repository,Category,Members,Mission\nSyntax_Syndicate,user/repo-parser,AI & ML,Alex; Elena,Building security parser\nCloud_Nomads,cloud-nomads/cache-mesh,,Sarah,Distributed cache relay`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.5 }}
            />
          </div>

          {/* Status Alert */}
          {importStatus && importStatus.success && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(78, 222, 163, 0.12)',
              border: '1px solid var(--tertiary)',
              borderRadius: '6px',
              color: 'var(--tertiary)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> Successfully imported {importStatus.count} teams! Stream updated.
            </div>
          )}

          {importStatus && !importStatus.success && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 180, 171, 0.12)',
              border: '1px solid var(--error)',
              borderRadius: '6px',
              color: 'var(--error)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {importStatus.error}
            </div>
          )}

          {/* Format Spec Note */}
          <div style={{
            marginTop: '16px',
            fontSize: '11px',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--bg-surface-lowest)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid var(--outline)'
          }}>
            Format: <code style={{ color: 'var(--secondary)' }}>Team Name, Repository, Category (Optional), Members (; separated), Mission</code>
          </div>

          {/* Actions */}
          <div style={{
            marginTop: '20px',
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
              type="button"
              onClick={handleImport}
              disabled={isProcessing}
              style={{
                backgroundColor: 'var(--secondary)',
                color: '#003640',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(76, 215, 246, 0.4)'
              }}
            >
              <Terminal size={16} />
              {isProcessing ? 'PROCESSING_CSV...' : 'EXECUTE_BULK_IMPORT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
