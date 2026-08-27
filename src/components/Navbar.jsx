import { Activity, PlusSquare, BarChart2, Shield, Radio, Terminal, Cpu, Upload, ClipboardCheck, Sun, Moon } from 'lucide-react';

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
  return (
    <header style={{
      backgroundColor: 'var(--bg-surface-lowest)',
      borderBottom: '1px solid var(--outline)',
      padding: '0 24px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => setActiveTab('dashboard')}
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
            <div>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 800, 
                fontSize: '16px', 
                letterSpacing: '0.05em',
                color: 'var(--text-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                HACK_MONITOR <span style={{ color: 'var(--primary-bright)', fontSize: '11px', padding: '2px 6px', background: 'rgba(128, 131, 255, 0.2)', borderRadius: '4px' }}>v1.0</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                built by <a href="https://github.com/RidDevs" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>github.com/RidDevs</a>
              </div>
            </div>
          </div>

          <div style={{
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
              gap: '8px',
              backgroundColor: isLiveSyncing ? 'rgba(78, 222, 163, 0.12)' : 'var(--bg-surface-high)',
              border: `1px solid ${isLiveSyncing ? 'var(--tertiary)' : 'var(--outline)'}`,
              padding: '6px 12px',
              borderRadius: '4px',
              color: isLiveSyncing ? 'var(--tertiary)' : 'var(--text-dim)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span className={isLiveSyncing ? "pulse-dot" : ""} style={!isLiveSyncing ? { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-dim)', display: 'inline-block' } : {}} />
            {isLiveSyncing ? 'LIVE SYNC : ONLINE' : 'SYNC : PAUSED'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
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
            onClick={() => setActiveTab('intel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
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
            onClick={() => setActiveTab('leaderboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
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
            onClick={() => setActiveTab('evaluation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
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

          {/* Action Buttons */}
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
              letterSpacing: '0.05em',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
              boxShadow: '0 0 14px var(--shadow-color)',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <PlusSquare size={16} />
            REGISTER_TEAM
          </button>

          {/* Theme Switcher Toggle */}
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
      </div>
    </header>
  );
}
