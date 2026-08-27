import React, { useState, useEffect } from 'react';
import { AlertTriangle, Key } from 'lucide-react';
import Navbar from './components/Navbar';
import LiveDashboard from './components/LiveDashboard';
import ActivityFeed from './components/ActivityFeed';
import Leaderboard from './components/Leaderboard';
import TeamDetailView from './components/TeamDetailView';
import AddTeamModal from './components/AddTeamModal';
import EditTeamModal from './components/EditTeamModal';
import BulkImportModal from './components/BulkImportModal';
import CommitDiffModal from './components/CommitDiffModal';
import TeamEvaluation from './components/TeamEvaluation';
import { INITIAL_TEAMS, INITIAL_COMMITS } from './data/mockData';
import { fetchRealGitHubCommits } from './services/githubService';

const DUMMY_TEAM_IDS = ['team-react-core', 'team-vite-speed', 'team-next-infra'];

function App() {
  // Load initial teams from localStorage or fallback to INITIAL_TEAMS
  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('hack_monitor_teams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy repos
          return parsed.filter(t => !DUMMY_TEAM_IDS.includes(t.id));
        }
      }
    } catch (e) {
      console.warn('Failed to load teams from localStorage:', e);
    }
    return INITIAL_TEAMS;
  });

  // Load initial commits from localStorage or fallback to INITIAL_COMMITS
  const [commits, setCommits] = useState(() => {
    try {
      const saved = localStorage.getItem('hack_monitor_commits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy commits
          return parsed.filter(c => !DUMMY_TEAM_IDS.includes(c.teamId));
        }
      }
    } catch (e) {
      console.warn('Failed to load commits from localStorage:', e);
    }
    return INITIAL_COMMITS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Persist teams to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('hack_monitor_teams', JSON.stringify(teams));
    } catch (e) {
      console.warn('Failed to save teams to localStorage:', e);
    }
  }, [teams]);

  // Persist commits to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('hack_monitor_commits', JSON.stringify(commits));
    } catch (e) {
      console.warn('Failed to save commits to localStorage:', e);
    }
  }, [commits]);

  // Helper to sort commits chronologically by rawTime (latest date first)
  const sortCommitsByDate = (commitList) => {
    return [...commitList].sort((a, b) => (b.rawTime || 0) - (a.rawTime || 0));
  };

  // Sync real commits from GitHub API for all registered teams
  const syncRealGitHubCommits = async () => {
    if (teams.length === 0) return;
    let rateLimitMsg = null;

    for (const team of teams) {
      if (team.ownerRepo) {
        const result = await fetchRealGitHubCommits(
          team.ownerRepo.owner, 
          team.ownerRepo.repo, 
          team.id, 
          team.name
        );

        if (result && result.rateLimited) {
          rateLimitMsg = result.message;
          continue;
        }

        if (Array.isArray(result) && result.length > 0) {
          const formatted = result.map(c => ({
            ...c,
            teamId: team.id,
            teamName: team.name
          }));

          setCommits((prev) => {
            const existingIds = new Set(prev.map(c => c.id));
            const newOnly = formatted.filter(c => !existingIds.has(c.id));
            return sortCommitsByDate([...newOnly, ...prev]);
          });

          // Update team's total commits and last commit date
          setTeams((prevTeams) =>
            prevTeams.map((t) => {
              if (t.id === team.id) {
                const teamCommits = sortCommitsByDate(formatted);
                return {
                  ...t,
                  totalCommits: teamCommits.length,
                  lastCommitTime: teamCommits[0]?.timestamp || t.lastCommitTime
                };
              }
              return t;
            })
          );
        }
      }
    }

    if (rateLimitMsg) {
      setApiError(rateLimitMsg);
    } else {
      setApiError(null);
    }
  };

  // Real-time interval polling ONLY real GitHub API every 2 MINUTES (120,000 ms)
  useEffect(() => {
    if (!isLiveSyncing || teams.length === 0) return;

    // Initial sync on mount/toggle
    syncRealGitHubCommits();

    // Poll real GitHub API every 2 minutes
    const interval = setInterval(() => {
      syncRealGitHubCommits();
    }, 120000); // 2 minutes (120,000 ms)

    return () => clearInterval(interval);
  }, [isLiveSyncing, teams]);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setActiveTab('team-detail');
  };

  const handleOpenEditTeam = (team) => {
    setEditingTeam(team);
    setIsEditTeamOpen(true);
  };

  const handleSaveEditedTeam = (updatedTeam) => {
    setTeams((prev) => prev.map(t => t.id === updatedTeam.id ? { ...t, ...updatedTeam } : t));
    setCommits((prev) => prev.map(c => c.teamId === updatedTeam.id ? { ...c, teamName: updatedTeam.name } : c));
    if (selectedTeam && selectedTeam.id === updatedTeam.id) {
      setSelectedTeam(updatedTeam);
    }
  };

  const handleDeleteTeam = (teamId) => {
    const targetTeam = teams.find(t => t.id === teamId);
    const teamName = targetTeam ? targetTeam.name : teamId;

    const firstConfirm = window.confirm(`DELETE TEAM "${teamName}"?\n1st Confirmation: Are you sure you want to delete this team and all its recorded commits?`);
    if (!firstConfirm) return;

    const typedName = prompt(`2ND CONFIRMATION REQUIRED:\nType "${teamName}" below to permanently delete this team:`);
    if (typedName === teamName) {
      setTeams((prev) => prev.filter(t => t.id !== teamId));
      setCommits((prev) => prev.filter(c => c.teamId !== teamId && c.teamName !== teamName));
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam(null);
        setActiveTab('dashboard');
      }
    } else if (typedName !== null) {
      alert('Team name did not match. Deletion canceled.');
    }
  };

  const handleResetHackathon = () => {
    const firstConfirm = window.confirm("RESET ALL HACKATHON DATA?\n1st Confirmation: This will clear ALL registered teams and recorded commits from local storage.");
    if (!firstConfirm) return;

    const secondConfirm = prompt('2ND CONFIRMATION REQUIRED:\nType "RESET" to permanently clear all hackathon data:');
    if (secondConfirm && secondConfirm.trim().toUpperCase() === 'RESET') {
      localStorage.removeItem('hack_monitor_teams');
      localStorage.removeItem('hack_monitor_commits');
      setTeams([]);
      setCommits([]);
      setSelectedTeam(null);
      setSelectedCommit(null);
      setActiveTab('dashboard');
      alert('Hackathon telemetry data has been completely reset.');
    } else if (secondConfirm !== null) {
      alert('Confirmation word did not match. Reset canceled.');
    }
  };

  const handleAddTeam = async (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);

    // If team has ownerRepo, fetch real GitHub commits!
    if (newTeam.ownerRepo) {
      const result = await fetchRealGitHubCommits(
        newTeam.ownerRepo.owner, 
        newTeam.ownerRepo.repo, 
        newTeam.id, 
        newTeam.name
      );

      if (result && result.rateLimited) {
        setApiError(result.message);
      } else if (Array.isArray(result) && result.length > 0) {
        const formattedRealCommits = sortCommitsByDate(result.map(c => ({
          ...c,
          teamId: newTeam.id,
          teamName: newTeam.name
        })));

        setCommits((prev) => {
          const existingIds = new Set(prev.map(c => c.id));
          const newOnly = formattedRealCommits.filter(c => !existingIds.has(c.id));
          return sortCommitsByDate([...newOnly, ...prev]);
        });

        setTeams((prevTeams) =>
          prevTeams.map((t) =>
            t.id === newTeam.id
              ? {
                  ...t,
                  totalCommits: formattedRealCommits.length,
                  lastCommitTime: formattedRealCommits[0].timestamp
                }
              : t
          )
        );
      }
    }

    setActiveTab('dashboard');
  };

  const handleBulkAddTeams = (newTeams, newCommits) => {
    setTeams((prev) => [...newTeams, ...prev]);
    if (newCommits && newCommits.length > 0) {
      setCommits((prev) => {
        const existingIds = new Set(prev.map(c => c.id));
        const newOnly = newCommits.filter(c => !existingIds.has(c.id));
        return sortCommitsByDate([...newOnly, ...prev]);
      });
    }
    setActiveTab('dashboard');
  };

  const handleManualSync = () => {
    syncRealGitHubCommits();
  };

  const handleConfigureToken = () => {
    const currentToken = localStorage.getItem('github_token') || '';
    const input = prompt('Enter your GitHub Personal Access Token (PAT) for 5,000 req/hr:\n(Leave blank to clear stored token)', currentToken);
    if (input !== null) {
      if (input.trim()) {
        localStorage.setItem('github_token', input.trim());
      } else {
        localStorage.removeItem('github_token');
      }
      setApiError(null);
      syncRealGitHubCommits();
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-space)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTeam={() => setIsAddTeamOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
        isLiveSyncing={isLiveSyncing}
        setIsLiveSyncing={setIsLiveSyncing}
        totalTeams={teams.length}
        onManualSync={handleManualSync}
      />

      <main style={{ flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>
        {/* GitHub API Warning Banner if Rate Limited */}
        {apiError && (
          <div style={{
            backgroundColor: 'rgba(255, 180, 171, 0.12)',
            border: '1px solid var(--error)',
            borderRadius: '8px',
            padding: '12px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffb4ab',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} />
              <span>{apiError}</span>
            </div>
            <button
              onClick={handleConfigureToken}
              style={{
                backgroundColor: 'var(--error)',
                color: '#380004',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Key size={14} /> SET GITHUB TOKEN
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <LiveDashboard
            teams={teams}
            commits={commits}
            onSelectTeam={handleSelectTeam}
            onSelectCommit={(commit) => setSelectedCommit(commit)}
            onOpenAddTeam={() => setIsAddTeamOpen(true)}
            onSimulateCommit={handleManualSync}
            isLiveSyncing={isLiveSyncing}
            setIsLiveSyncing={setIsLiveSyncing}
            onEditTeam={handleOpenEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onResetHackathon={handleResetHackathon}
          />
        )}

        {activeTab === 'intel' && (
          <ActivityFeed
            commits={commits}
            teams={teams}
            onSelectCommit={(commit) => setSelectedCommit(commit)}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            teams={teams}
            commits={commits}
            onSelectTeam={handleSelectTeam}
            onSelectCommit={(commit) => setSelectedCommit(commit)}
            onEditTeam={handleOpenEditTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}

        {activeTab === 'evaluation' && (
          <TeamEvaluation
            teams={teams}
            commits={commits}
            onSelectTeam={handleSelectTeam}
          />
        )}

        {activeTab === 'team-detail' && selectedTeam && (
          <TeamDetailView
            team={selectedTeam}
            commits={commits.filter(c => c.teamId === selectedTeam.id || c.teamName === selectedTeam.name)}
            onBack={() => setActiveTab('dashboard')}
            onSelectCommit={(commit) => setSelectedCommit(commit)}
            onEditTeam={handleOpenEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onSimulateCommitForTeam={handleManualSync}
          />
        )}
      </main>

      {/* Modals */}
      <AddTeamModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        onAddTeam={handleAddTeam}
      />

      <EditTeamModal
        isOpen={isEditTeamOpen}
        onClose={() => setIsEditTeamOpen(false)}
        team={editingTeam}
        onSaveTeam={handleSaveEditedTeam}
        onDeleteTeam={handleDeleteTeam}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onBulkAddTeams={handleBulkAddTeams}
      />

      {selectedCommit && (
        <CommitDiffModal
          commit={selectedCommit}
          onClose={() => setSelectedCommit(null)}
        />
      )}
    </div>
  );
}

export default App;
