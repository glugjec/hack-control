import React from 'react';
import { Activity, PlusSquare, BarChart2, Shield, Radio, Terminal, Cpu, Upload } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddTeam, 
  onOpenBulkImport, 
  isLiveSyncing, 
  setIsLiveSyncing, 
  totalTeams = 0,
  onManualSync
}) {
  return (
    <header style={{
      backgroundColor: 'var(--bg-surface-lowest)',
      borderBottom: '1px solid var(--outline)',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
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
              boxShadow: '0 0 12px rgba(128, 131, 255, 0.3)'
            }}>
              <Cpu size={20} color="var(--primary-bright)" />
            </div>
            <div>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 800, 
                fontSize: '16px', 
                letterSpacing: '0.05em',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                HACK_MONITOR <span style={{ color: 'var(--primary-bright)', fontSize: '11px', padding: '2px 6px', background: 'rgba(128, 131, 255, 0.2)', borderRadius: '4px' }}>v1.0</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                KINETIC PULSE CONTROL // GIT MONITOR
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
              backgroundColor: isLiveSyncing ? 'rgba(78, 222, 163, 0.12)' : 'rgba(144, 143, 160, 0.15)',
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
              border: activeTab === 'dashboard' ? '1px solid var(--primary-dark)' : '1px solid transparent',
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
              color: '#07006c',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              boxShadow: '0 0 14px rgba(128, 131, 255, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <PlusSquare size={16} />
            REGISTER_TEAM
          </button>
        </nav>
      </div>
    </header>
  );
}
