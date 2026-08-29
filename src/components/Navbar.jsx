import React from 'react';
import { Activity, PlusSquare, BarChart2, Radio, Cpu, Upload, ClipboardCheck, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddTeam, 
  onOpenBulkImport, 
  isLiveSyncing, 
  setIsLiveSyncing, 
  totalTeams = 0,
  onManualSync,
  theme,
  onToggleTheme
}) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <header style={{
        backgroundColor: 'var(--bg-surface-lowest)',
        borderBottom: '1px solid var(--outline)',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px var(--shadow-color)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand Logo & Live Ping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={() => handleTabClick('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(128, 131, 255, 0.15)',
                border: '1px solid var(--primary)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px var(--shadow-color)'
              }}>
                <Cpu size={20} color="var(--primary-bright)" />
              </div>
              <div className="desktop-only">
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 800, 
                  fontSize: '15px', 
                  letterSpacing: '0.05em',
                  color: 'var(--text-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  HACK_MONITOR <span style={{ color: 'var(--primary-bright)', fontSize: '10px', padding: '2px 5px', background: 'rgba(128, 131, 255, 0.2)', borderRadius: '4px' }}>v1.0</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  built by <a href="https://github.com/RidDevs" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>github.com/RidDevs</a>
                </div>
              </div>
            </div>

            <div className="desktop-only" style={{
              height: '24px',
              width: '1px',
              backgroundColor: 'var(--outline)',
              margin: '0 8px'
            }} />

            {/* Live Sync Toggle Badge */}
            <button 
              onClick={() => {
                if (setIsLiveSyncing) setIsLiveSyncing(!isLiveSyncing);
                if (onManualSync) onManualSync();
              }}
              title="Toggle Live Stream Auto-Sync & Fetch Commits"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isLiveSyncing ? 'rgba(78, 222, 163, 0.12)' : 'var(--bg-surface-high)',
                border: `1px solid ${isLiveSyncing ? 'var(--tertiary)' : 'var(--outline)'}`,
                padding: '6px 10px',
                borderRadius: '4px',
                color: isLiveSyncing ? 'var(--tertiary)' : 'var(--text-dim)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span className={isLiveSyncing ? "pulse-dot" : ""} style={!isLiveSyncing ? { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-dim)', display: 'inline-block' } : {}} />
              <span className="desktop-only">{isLiveSyncing ? 'LIVE SYNC : ONLINE' : 'SYNC : PAUSED'}</span>
              <span className="mobile-only">{isLiveSyncing ? 'LIVE' : 'PAUSED'}</span>
            </button>
          </div>

          {/* Desktop Navigation Tabs & Actions */}
          <nav className="desktop-only" style={{ alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => handleTabClick('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '4px',
                backgroundColor: activeTab === 'dashboard' ? 'var(--bg-surface-high)' : 'transparent',
                color: activeTab === 'dashboard' ? 'var(--primary-bright)' : 'var(--text-muted)',
                border: activeTab === 'dashboard' ? '1px solid var(--primary)' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              <Activity size={16} />
              LIVE_FEED
            </button>

            <button
              onClick={() => handleTabClick('intel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '4px',
                backgroundColor: activeTab === 'intel' ? 'var(--bg-surface-high)' : 'transparent',
                color: activeTab === 'intel' ? 'var(--secondary)' : 'var(--text-muted)',
                border: activeTab === 'intel' ? '1px solid rgba(76, 215, 246, 0.4)' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              <Radio size={16} />
              GLOBAL_INTEL
            </button>

            <button
              onClick={() => handleTabClick('leaderboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '4px',
                backgroundColor: activeTab === 'leaderboard' ? 'var(--bg-surface-high)' : 'transparent',
                color: activeTab === 'leaderboard' ? 'var(--tertiary)' : 'var(--text-muted)',
                border: activeTab === 'leaderboard' ? '1px solid rgba(78, 222, 163, 0.4)' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              <BarChart2 size={16} />
              LEADERBOARD ({totalTeams})
            </button>

            <button
              onClick={() => handleTabClick('evaluation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '4px',
                backgroundColor: activeTab === 'evaluation' ? 'var(--bg-surface-high)' : 'transparent',
                color: activeTab === 'evaluation' ? 'var(--primary-bright)' : 'var(--text-muted)',
                border: activeTab === 'evaluation' ? '1px solid var(--primary)' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              <ClipboardCheck size={16} />
              EVALUATION
            </button>

            <button
              onClick={onOpenBulkImport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                marginLeft: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(76, 215, 246, 0.15)',
                border: '1px solid var(--secondary)',
                color: 'var(--secondary)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}
            >
              <Upload size={16} />
              BULK_IMPORT
            </button>

            <button
              onClick={onOpenAddTeam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                marginLeft: '4px',
                borderRadius: '4px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                boxShadow: '0 0 14px var(--shadow-color)'
              }}
            >
              <PlusSquare size={16} />
              REGISTER_TEAM
            </button>

            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Clean Light Mode'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                marginLeft: '8px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-surface-high)',
                border: '1px solid var(--outline)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={16} color="var(--primary)" />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>DARK</span>
                </>
              ) : (
                <>
                  <Sun size={16} color="#facc15" />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>LIGHT</span>
                </>
              )}
            </button>
          </nav>

          {/* Mobile Right Controls: Bulk Import + Add Team + Theme */}
          <div className="mobile-only mobile-flex-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
            <button
              onClick={onOpenBulkImport}
              title="Bulk Import CSV / JSON"
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(76, 215, 246, 0.15)',
                border: '1px solid var(--secondary)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)'
              }}
            >
              <Upload size={13} />
              <span>BULK</span>
            </button>

            <button
              onClick={onOpenAddTeam}
              title="Register Team"
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                border: '1px solid var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 10px var(--shadow-color)'
              }}
            >
              <PlusSquare size={13} />
              <span>+ TEAM</span>
            </button>

            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Clean Light Mode'}`}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface-high)',
                border: '1px solid var(--outline)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={14} color="var(--primary)" />
                  <span>DARK</span>
                </>
              ) : (
                <>
                  <Sun size={14} color="#facc15" />
                  <span>LIGHT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(10, 15, 30, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--outline)',
        padding: '8px 10px calc(10px + env(safe-area-inset-bottom, 0px)) 10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        boxShadow: '0 -6px 25px rgba(0, 0, 0, 0.7), 0 -1px 0 rgba(128, 131, 255, 0.2)'
      }}>
        <button
          onClick={() => handleTabClick('dashboard')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '8px 4px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'dashboard' ? 'rgba(128, 131, 255, 0.18)' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--primary-bright)' : 'var(--text-dim)',
            border: activeTab === 'dashboard' ? '1px solid var(--primary-bright)' : '1px solid transparent',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            boxShadow: activeTab === 'dashboard' ? '0 0 12px rgba(128, 131, 255, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Activity size={22} color={activeTab === 'dashboard' ? 'var(--primary-bright)' : 'var(--text-dim)'} />
          FEED
        </button>

        <button
          onClick={() => handleTabClick('intel')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '8px 4px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'intel' ? 'rgba(76, 215, 246, 0.18)' : 'transparent',
            color: activeTab === 'intel' ? 'var(--secondary)' : 'var(--text-dim)',
            border: activeTab === 'intel' ? '1px solid var(--secondary)' : '1px solid transparent',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            boxShadow: activeTab === 'intel' ? '0 0 12px rgba(76, 215, 246, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Radio size={22} color={activeTab === 'intel' ? 'var(--secondary)' : 'var(--text-dim)'} />
          INTEL
        </button>

        <button
          onClick={() => handleTabClick('leaderboard')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '8px 4px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'leaderboard' ? 'rgba(78, 222, 163, 0.18)' : 'transparent',
            color: activeTab === 'leaderboard' ? 'var(--tertiary)' : 'var(--text-dim)',
            border: activeTab === 'leaderboard' ? '1px solid var(--tertiary)' : '1px solid transparent',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            boxShadow: activeTab === 'leaderboard' ? '0 0 12px rgba(78, 222, 163, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart2 size={22} color={activeTab === 'leaderboard' ? 'var(--tertiary)' : 'var(--text-dim)'} />
          RANKS
        </button>

        <button
          onClick={() => handleTabClick('evaluation')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '8px 4px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'evaluation' ? 'rgba(128, 131, 255, 0.18)' : 'transparent',
            color: activeTab === 'evaluation' ? 'var(--primary-bright)' : 'var(--text-dim)',
            border: activeTab === 'evaluation' ? '1px solid var(--primary-bright)' : '1px solid transparent',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            boxShadow: activeTab === 'evaluation' ? '0 0 12px rgba(128, 131, 255, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <ClipboardCheck size={22} color={activeTab === 'evaluation' ? 'var(--primary-bright)' : 'var(--text-dim)'} />
          EVAL
        </button>
      </nav>
    </>
  );
}
