import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  Clock, 
  User, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Download, 
  Search, 
  Award, 
  FolderGit2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  MessageSquare,
  BarChart,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const CATEGORY_TAGS = [
  { id: 'TECHNICAL', label: 'Technical & Architecture', color: 'var(--secondary)', bg: 'rgba(76, 215, 246, 0.12)' },
  { id: 'PITCH', label: 'Pitch & Presentation', color: 'var(--primary-bright)', bg: 'rgba(128, 131, 255, 0.12)' },
  { id: 'UI_UX', label: 'UI / UX & Execution', color: 'var(--tertiary)', bg: 'rgba(78, 222, 163, 0.12)' },
  { id: 'INNOVATION', label: 'Innovation & Impact', color: '#facc15', bg: 'rgba(250, 204, 21, 0.12)' },
  { id: 'FLAG', label: 'Flag / Issue', color: 'var(--error)', bg: 'rgba(255, 180, 171, 0.12)' },
  { id: 'GENERAL', label: 'General Note', color: 'var(--text-muted)', bg: 'var(--bg-surface-highest)' }
];

export default function TeamEvaluation({ teams, commits, onNavigateToTeam }) {
  // Evaluator info
  const [judgeName, setJudgeName] = useState(() => {
    return localStorage.getItem('hack_evaluator_name') || 'Judge Alpha';
  });

  // Selected Team ID
  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    return teams.length > 0 ? teams[0].id : '';
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Note Form State
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('TECHNICAL');
  const [noteScore, setNoteScore] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Rubric Scores per team: { [teamId]: { technical: 18, pitch: 16, ui: 17, hygiene: 19, innovation: 18, updated: timestamp } }
  const [scorecards, setScorecards] = useState(() => {
    try {
      const saved = localStorage.getItem('hack_monitor_scorecards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load scorecards:', e);
    }
    return {};
  });

  // Notes list: [ { id, teamId, author, tag, content, score, timestamp, isoTime } ]
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('hack_monitor_eval_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load evaluation notes:', e);
    }
    return [];
  });

  // Active View Mode: 'notes' | 'rubric' | 'summary'
  const [viewMode, setViewMode] = useState('notes');

  // Save evaluator name to localStorage
  useEffect(() => {
    localStorage.setItem('hack_evaluator_name', judgeName);
  }, [judgeName]);

  // Persist scorecards to localStorage
  useEffect(() => {
    localStorage.setItem('hack_monitor_scorecards', JSON.stringify(scorecards));
  }, [scorecards]);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('hack_monitor_eval_notes', JSON.stringify(notes));
  }, [notes]);

  // Keep selectedTeamId synced if teams change and current selection is lost
  useEffect(() => {
    if (teams.length > 0 && (!selectedTeamId || !teams.some(t => t.id === selectedTeamId))) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  const currentTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const teamCommits = currentTeam 
    ? commits.filter(c => c.teamId === currentTeam.id || c.teamName === currentTeam.name)
    : [];

  // Filtered teams list for sidebar
  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.repo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Notes for current team sorted newest first
  const currentTeamNotes = currentTeam
    ? notes.filter(n => n.teamId === currentTeam.id).sort((a, b) => b.isoTime - a.isoTime)
    : [];

  // Handle Note Submission
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    if (!currentTeam) return;

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    if (editingNoteId) {
      // Edit existing note
      setNotes((prev) => prev.map(n => {
        if (n.id === editingNoteId) {
          return {
            ...n,
            author: judgeName.trim() || 'Judge',
            tag: noteTag,
            content: noteContent.trim(),
            score: noteScore !== '' ? Number(noteScore) : null,
            timestamp: `${formattedTimestamp} (Edited)`
          };
        }
        return n;
      }));
      setEditingNoteId(null);
    } else {
      // Add new note
      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        teamId: currentTeam.id,
        teamName: currentTeam.name,
        author: judgeName.trim() || 'Judge',
        tag: noteTag,
        content: noteContent.trim(),
        score: noteScore !== '' ? Number(noteScore) : null,
        timestamp: formattedTimestamp,
        isoTime: now.getTime()
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    // Reset Form
    setNoteContent('');
    setNoteScore('');
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
    setNoteTag(note.tag);
    setNoteScore(note.score !== null && note.score !== undefined ? note.score : '');
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Delete this evaluation note?')) {
      setNotes((prev) => prev.filter(n => n.id !== noteId));
      if (editingNoteId === noteId) {
        setEditingNoteId(null);
        setNoteContent('');
        setNoteScore('');
      }
    }
  };

  // Rubric Scorecard for current team
  const currentRubric = (currentTeam && scorecards[currentTeam.id]) || {
    technical: 15,
    pitch: 15,
    ui: 15,
    hygiene: 15,
    innovation: 15,
    notes: ''
  };

  const handleRubricChange = (field, val) => {
    if (!currentTeam) return;
    const num = Math.min(20, Math.max(0, Number(val) || 0));
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    setScorecards((prev) => ({
      ...prev,
      [currentTeam.id]: {
        ...currentRubric,
        [field]: num,
        lastUpdated: formattedTimestamp
      }
    }));
  };

  const currentTotalRubricScore = currentRubric.technical + currentRubric.pitch + currentRubric.ui + currentRubric.hygiene + currentRubric.innovation;

  // Export Summary Report
  const handleExportReport = () => {
    let reportText = `# HACKATHON EVALUATION & JUDGING REPORT\n`;
    reportText += `Generated At: ${new Date().toLocaleString()}\n`;
    reportText += `Evaluator: ${judgeName}\n\n`;

    teams.forEach(t => {
      const tNotes = notes.filter(n => n.teamId === t.id);
      const tCard = scorecards[t.id];

      reportText += `=========================================\n`;
      reportText += `TEAM: ${t.name} (${t.category || 'General'})\n`;
      reportText += `Repository: ${t.repo}\n`;
      if (tCard) {
        const tot = tCard.technical + tCard.pitch + tCard.ui + tCard.hygiene + tCard.innovation;
        reportText += `Rubric Total Score: ${tot}/100 pts (Tech: ${tCard.technical}, Pitch: ${tCard.pitch}, UI/UX: ${tCard.ui}, Hygiene: ${tCard.hygiene}, Innovation: ${tCard.innovation})\n`;
      }
      reportText += `Total Evaluation Notes: ${tNotes.length}\n\n`;

      if (tNotes.length > 0) {
        reportText += `NOTES LOG:\n`;
        tNotes.forEach((n, idx) => {
          reportText += ` [${idx + 1}] ${n.timestamp} | ${n.tag} | By ${n.author}${n.score ? ` (Score: ${n.score}/10)` : ''}\n`;
          reportText += `     Note: ${n.content}\n\n`;
        });
      } else {
        reportText += ` No notes recorded yet.\n\n`;
      }
    });

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hackathon_Evaluation_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-in" style={{ paddingBottom: '40px' }}>
      {/* Top Banner */}
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
            backgroundColor: 'rgba(128, 131, 255, 0.15)',
            border: '1px solid var(--primary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ClipboardCheck size={26} color="var(--primary-bright)" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em', margin: 0 }}>
              TEAM_EVALUATION // JUDGING & NOTES DESK
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', margin: '4px 0 0' }}>
              EVALUATE TEAMS, LOG TIMESTAMPTED NOTES, & TRACK SCORING RUBRICS
            </p>
          </div>
        </div>

        {/* Judge Name Input & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface-lowest)',
            border: '1px solid var(--outline)',
            padding: '6px 12px',
            borderRadius: '6px'
          }}>
            <User size={15} color="var(--primary-bright)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontWeight: 700 }}>
              EVALUATOR:
            </span>
            <input
              type="text"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              placeholder="Your Name / Judge ID"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                width: '130px',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <button
            onClick={handleExportReport}
            style={{
              backgroundColor: 'rgba(76, 215, 246, 0.15)',
              border: '1px solid var(--secondary)',
              color: 'var(--secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <Download size={15} /> EXPORT_EVALUATION_REPORT
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--outline)',
          borderRadius: '12px',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <ClipboardCheck size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
            No Registered Teams Found For Evaluation
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            Register teams or import a team roster using the top toolbar to begin judging and logging timestamped notes.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) minmax(0, 1fr)',
          gap: '24px'
        }}>
          {/* LEFT SIDEBAR: TEAM ROSTER SELECTOR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--outline)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '32px', width: '100%', fontSize: '12px' }}
                />
              </div>

              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '10px', fontWeight: 700 }}>
                SELECT TEAM TO EVALUATE ({filteredTeams.length}):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
                {filteredTeams.map((t) => {
                  const isSelected = t.id === currentTeam?.id;
                  const teamNoteCount = notes.filter(n => n.teamId === t.id).length;
                  const tRubric = scorecards[t.id];
                  const tTotalScore = tRubric ? tRubric.technical + tRubric.pitch + tRubric.ui + tRubric.hygiene + tRubric.innovation : null;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'var(--bg-surface-high)' : 'var(--bg-surface-lowest)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--outline)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: t.avatarColor || 'var(--primary)'
                          }} />
                          <span style={{ fontWeight: 800, fontSize: '14px', color: isSelected ? 'var(--primary-bright)' : '#fff' }}>
                            {t.name}
                          </span>
                        </div>
                        {tTotalScore !== null && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--tertiary)',
                            backgroundColor: 'rgba(78, 222, 163, 0.12)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {tTotalScore}/100 pts
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                        {t.repo}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--secondary)' }}>
                          {t.totalCommits || 0} commits
                        </span>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={12} /> {teamNoteCount} notes
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Team Quick Telemetry Context */}
            {currentTeam && (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--outline)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary-bright)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderGit2 size={14} /> LIVE TELEMETRY SNAPSHOT
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                  <strong>Mission:</strong> {currentTeam.problemStatement || 'No statement provided.'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  <div>Health Score: <strong style={{ color: 'var(--tertiary)' }}>{currentTeam.healthScore}%</strong></div>
                  <div>Category: <strong style={{ color: '#fff' }}>{currentTeam.category || 'General'}</strong></div>
                  <div>Members: <strong style={{ color: '#fff' }}>{currentTeam.members ? currentTeam.members.map(m => m.name).join(', ') : 'N/A'}</strong></div>
                  <div>Last Commit: <strong style={{ color: 'var(--secondary)' }}>{currentTeam.lastCommitTime || 'N/A'}</strong></div>
                </div>

                {onNavigateToTeam && (
                  <button
                    onClick={() => onNavigateToTeam(currentTeam)}
                    style={{
                      marginTop: '14px',
                      width: '100%',
                      backgroundColor: 'rgba(128, 131, 255, 0.12)',
                      border: '1px solid var(--primary-dark)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'var(--primary-bright)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 131, 255, 0.25)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 131, 255, 0.12)'}
                  >
                    VIEW FULL TEAM PROFILE <ExternalLink size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT WORKSPACE: NOTES & RUBRIC EVALUATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Mode Switcher Tabs */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--outline)',
              borderRadius: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('notes')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: viewMode === 'notes' ? 'var(--bg-surface-high)' : 'transparent',
                    color: viewMode === 'notes' ? 'var(--primary-bright)' : 'var(--text-muted)',
                    border: viewMode === 'notes' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare size={14} /> TIMESTAMPED NOTES ({currentTeamNotes.length})
                </button>

                <button
                  onClick={() => setViewMode('rubric')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: viewMode === 'rubric' ? 'var(--bg-surface-high)' : 'transparent',
                    color: viewMode === 'rubric' ? 'var(--tertiary)' : 'var(--text-muted)',
                    border: viewMode === 'rubric' ? '1px solid var(--tertiary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Award size={14} /> SCORING RUBRIC ({currentTotalRubricScore}/100 PTS)
                </button>

                <button
                  onClick={() => setViewMode('summary')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: viewMode === 'summary' ? 'var(--bg-surface-high)' : 'transparent',
                    color: viewMode === 'summary' ? 'var(--secondary)' : 'var(--text-muted)',
                    border: viewMode === 'summary' ? '1px solid var(--secondary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <BarChart size={14} /> ALL TEAMS SUMMARY
                </button>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                EVALUATING: <span style={{ color: 'var(--primary-bright)' }}>{currentTeam ? currentTeam.name : 'None'}</span>
              </div>
            </div>

            {/* VIEW MODE 1: TIMESTAMPED NOTES WORKSPACE */}
            {viewMode === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Add / Edit Note Form */}
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--outline)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={16} color="var(--primary)" />
                      {editingNoteId ? 'EDIT EVALUATION NOTE' : 'LOG NEW EVALUATION NOTE WITH TIMESTAMP'}
                    </div>
                    {editingNoteId && (
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setNoteContent('');
                          setNoteScore('');
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--text-dim)',
                          border: 'none',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Tag Selector */}
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                          CATEGORY TAG:
                        </label>
                        <select
                          value={noteTag}
                          onChange={(e) => setNoteTag(e.target.value)}
                          style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                        >
                          {CATEGORY_TAGS.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Optional Rating Score */}
                      <div style={{ width: '140px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                          RATING (1-10):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="Optional"
                          value={noteScore}
                          onChange={(e) => setNoteScore(e.target.value)}
                          style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                        />
                      </div>
                    </div>

                    {/* Note Content Textarea */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        EVALUATION OBSERVATION & FEEDBACK:
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write evaluation observations, technical feedback, pitch notes, or team progress flags..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        style={{ width: '100%', fontSize: '13px', lineHeight: 1.5 }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Auto-timestamps with system date/time on save
                      </div>

                      <button
                        type="submit"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: '#07006c',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 0 14px rgba(128, 131, 255, 0.3)'
                        }}
                      >
                        <Send size={14} /> {editingNoteId ? 'UPDATE_NOTE' : 'RECORD_TIMESTAMPED_NOTE'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Timeline Notes Stream */}
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--outline)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--outline)' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="var(--tertiary)" />
                      TIMELINE LOG ({currentTeamNotes.length} Notes Recorded)
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      SORTED CHRONOLOGICALLY (NEWEST FIRST)
                    </span>
                  </div>

                  {currentTeamNotes.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface-lowest)', borderRadius: '8px', border: '1px dashed var(--outline)' }}>
                      <MessageSquare size={28} color="var(--text-dim)" style={{ margin: '0 auto 8px' }} />
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                        No evaluation notes recorded for {currentTeam?.name} yet
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        Use the note log form above to record timestamped observations for this team.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {currentTeamNotes.map((n) => {
                        const tagInfo = CATEGORY_TAGS.find(t => t.id === n.tag) || CATEGORY_TAGS[5];
                        return (
                          <div
                            key={n.id}
                            style={{
                              backgroundColor: 'var(--bg-surface-lowest)',
                              border: `1px solid ${tagInfo.color}40`,
                              borderRadius: '8px',
                              padding: '14px',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 800,
                                  color: tagInfo.color,
                                  backgroundColor: tagInfo.bg,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  border: `1px solid ${tagInfo.color}50`
                                }}>
                                  {tagInfo.label.toUpperCase()}
                                </span>

                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                                  By {n.author}
                                </span>

                                {n.score && (
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: '#facc15',
                                    backgroundColor: 'rgba(250, 204, 21, 0.12)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}>
                                    <Star size={11} fill="#facc15" /> Score: {n.score}/10
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontFamily: 'var(--font-mono)',
                                  color: 'var(--tertiary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: 'rgba(78, 222, 163, 0.08)',
                                  padding: '3px 8px',
                                  borderRadius: '4px'
                                }}>
                                  <Clock size={12} /> {n.timestamp}
                                </span>

                                <button
                                  onClick={() => handleEditNote(n)}
                                  title="Edit note"
                                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                                >
                                  <Edit3 size={13} />
                                </button>

                                <button
                                  onClick={() => handleDeleteNote(n.id)}
                                  title="Delete note"
                                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                              {n.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW MODE 2: SCORING RUBRIC */}
            {viewMode === 'rubric' && (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--outline)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--outline)' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={20} color="var(--tertiary)" />
                      RUBRIC EVALUATION SCORECARD FOR {currentTeam?.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', margin: '4px 0 0' }}>
                      Score 5 core judging criteria (0 - 20 points each). Auto-updates in real time.
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(78, 222, 163, 0.15)',
                    border: '1px solid var(--tertiary)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: 700 }}>
                      TOTAL SCORE
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {currentTotalRubricScore} <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>/ 100</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Criteria 1: Technical Complexity */}
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                        1. Technical Complexity & Code Architecture (0 – 20 Pts)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentRubric.technical}
                        onChange={(e) => handleRubricChange('technical', e.target.value)}
                        style={{ width: '70px', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Evaluates depth of implementation, system design, algorithm efficiency, and code robustness.
                    </div>
                  </div>

                  {/* Criteria 2: Pitch & Presentation */}
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                        2. Pitch & Presentation (0 – 20 Pts)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentRubric.pitch}
                        onChange={(e) => handleRubricChange('pitch', e.target.value)}
                        style={{ width: '70px', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Evaluates demo clarity, problem framing, team articulation, and ability to answer technical Q&A.
                    </div>
                  </div>

                  {/* Criteria 3: UI/UX & Execution */}
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                        3. UI / UX & Product Polish (0 – 20 Pts)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentRubric.ui}
                        onChange={(e) => handleRubricChange('ui', e.target.value)}
                        style={{ width: '70px', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Evaluates design responsiveness, interface aesthetics, user flow smoothness, and error resilience.
                    </div>
                  </div>

                  {/* Criteria 4: Telemetry & Git Hygiene */}
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                        4. Telemetry & Commit Velocity Hygiene (0 – 20 Pts)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentRubric.hygiene}
                        onChange={(e) => handleRubricChange('hygiene', e.target.value)}
                        style={{ width: '70px', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Evaluates regular Git commit cadence, descriptive messages, PR hygiene, and live telemetry health score ({currentTeam?.healthScore}%).
                    </div>
                  </div>

                  {/* Criteria 5: Innovation */}
                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-lowest)', border: '1px solid var(--outline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                        5. Innovation & Practical Impact (0 – 20 Pts)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentRubric.innovation}
                        onChange={(e) => handleRubricChange('innovation', e.target.value)}
                        style={{ width: '70px', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Evaluates novelty of solution, real-world utility, potential business/open-source impact.
                    </div>
                  </div>
                </div>

                {currentRubric.lastUpdated && (
                  <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    Scorecard last updated: {currentRubric.lastUpdated}
                  </div>
                )}
              </div>
            )}

            {/* VIEW MODE 3: ALL TEAMS SUMMARY TABLE */}
            {viewMode === 'summary' && (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--outline)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart size={20} color="var(--secondary)" />
                    ALL TEAMS EVALUATION & SCORE SUMMARY
                  </h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-surface-lowest)', borderBottom: '1px solid var(--outline)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        <th style={{ padding: '12px' }}>TEAM</th>
                        <th style={{ padding: '12px' }}>CATEGORY</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>RUBRIC SCORE</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>NOTES COUNT</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>HEALTH SCORE</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map(t => {
                        const tRubric = scorecards[t.id];
                        const tot = tRubric ? tRubric.technical + tRubric.pitch + tRubric.ui + tRubric.hygiene + tRubric.innovation : null;
                        const tNoteCount = notes.filter(n => n.teamId === t.id).length;

                        return (
                          <tr key={t.id} style={{ borderBottom: '1px solid var(--bg-surface-high)' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#fff' }}>
                              {t.name}
                            </td>
                            <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              {t.category || 'General'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                              {tot !== null ? (
                                <span style={{ fontWeight: 800, color: 'var(--tertiary)', backgroundColor: 'rgba(78, 222, 163, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                                  {tot} / 100 pts
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)' }}>Not Scored</span>
                              )}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                              {tNoteCount}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>
                              {t.healthScore}%
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  setSelectedTeamId(t.id);
                                  setViewMode('notes');
                                }}
                                style={{
                                  backgroundColor: 'var(--bg-surface-high)',
                                  border: '1px solid var(--outline)',
                                  borderRadius: '4px',
                                  padding: '4px 10px',
                                  color: 'var(--primary-bright)',
                                  fontSize: '11px',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                EVALUATE <ChevronRight size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
