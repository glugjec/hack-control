import React from 'react';
import { GitCommit, Code2, Zap, Users, ShieldCheck } from 'lucide-react';

export default function MetricsHeader({ 
  teams = [], 
  commits = [], 
  teamsCount, 
  commitsCount, 
  totalLoc = 0, 
  latency = 0, 
  healthAvg = 0 
}) {
  const count = commitsCount !== undefined ? commitsCount : commits.length;
  const tCount = teamsCount !== undefined ? teamsCount : teams.length;

  // 1. Commits change dynamic calculation (commits in last 5m)
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;
  const recent5mCommits = commits.filter(c => (c.rawTime || 0) >= fiveMinsAgo).length;

  let commitChangeText = '+0 in last 5m';
  if (count > 0 && recent5mCommits > 0) {
    commitChangeText = `+${recent5mCommits} in last 5m`;
  } else if (count > 0) {
    commitChangeText = `+0 in last 5m (${count} total)`;
  } else {
    commitChangeText = '+0 in last 5m';
  }

  // 2. Lines of code velocity dynamic calculation
  const totalLinesAdded = commits.reduce((acc, c) => acc + (c.linesAdded || 0), 0) || totalLoc || 0;
  let locVelocityText = '0.0K/hr velocity';

  if (count > 0 && totalLinesAdded > 0) {
    const rawTimes = commits.map(c => c.rawTime || now).filter(Boolean);
    const oldestTime = rawTimes.length > 0 ? Math.min(...rawTimes) : now;
    const newestTime = rawTimes.length > 0 ? Math.max(...rawTimes) : now;
    // Calculate hours duration (at least 1 minute = 1/60 hr)
    const diffHours = Math.max((newestTime - oldestTime) / (1000 * 60 * 60), 1 / 60);
    const velocityPerHour = Math.round(totalLinesAdded / diffHours);

    if (velocityPerHour >= 1000) {
      locVelocityText = `+${(velocityPerHour / 1000).toFixed(1)}K/hr velocity`;
    } else if (velocityPerHour > 0) {
      locVelocityText = `+${velocityPerHour}/hr velocity`;
    }
  } else if (totalLoc > 0) {
    locVelocityText = `+${(totalLoc / 1000).toFixed(1)}K/hr velocity`;
  } else {
    locVelocityText = '0.0K/hr velocity';
  }

  // 3. Active teams status dynamic calculation
  let teamsChangeText = '0% telemetry online';
  if (tCount > 0) {
    const activeCount = teams.filter(t => t.status === 'ACTIVE' || (t.totalCommits || 0) > 0).length;
    const pct = Math.round((activeCount / tCount) * 100);
    teamsChangeText = `${pct}% telemetry online`;
  } else {
    teamsChangeText = 'No telemetry stream';
  }

  // 4. Latency status
  let latencyChangeText = 'Optimum sync';
  if (tCount === 0 || latency === 0) {
    latencyChangeText = 'No active sync';
  } else if (latency <= 30) {
    latencyChangeText = 'Optimum sync';
  } else {
    latencyChangeText = 'Nominal response';
  }

  // 5. System Health status
  let healthChangeText = 'All build pipelines stable';
  if (tCount === 0 || healthAvg === 0) {
    healthChangeText = 'Awaiting telemetry data';
  } else if (healthAvg >= 80) {
    healthChangeText = 'All build pipelines stable';
  } else if (healthAvg >= 60) {
    healthChangeText = 'Build pipelines operational';
  } else {
    healthChangeText = 'Pipeline warnings detected';
  }

  const metrics = [
    {
      label: 'TOTAL COMMITS',
      value: count.toLocaleString(),
      change: commitChangeText,
      icon: GitCommit,
      color: 'var(--primary-bright)',
      glow: 'rgba(128, 131, 255, 0.2)'
    },
    {
      label: 'LINES OF CODE',
      value: `${(totalLoc / 1000).toFixed(1)}K`,
      change: locVelocityText,
      icon: Code2,
      color: 'var(--secondary)',
      glow: 'rgba(76, 215, 246, 0.2)'
    },
    {
      label: 'ACTIVE TEAMS',
      value: tCount,
      change: teamsChangeText,
      icon: Users,
      color: 'var(--tertiary)',
      glow: 'rgba(78, 222, 163, 0.2)'
    },
    {
      label: 'NETWORK LATENCY',
      value: `${latency}ms`,
      change: latencyChangeText,
      icon: Zap,
      color: '#facc15',
      glow: 'rgba(250, 204, 21, 0.2)'
    },
    {
      label: 'SYSTEM HEALTH',
      value: `${healthAvg}%`,
      change: healthChangeText,
      icon: ShieldCheck,
      color: 'var(--primary-bright)',
      glow: 'rgba(128, 131, 255, 0.2)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--outline)',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 4px 12px ${m.glow}`,
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = m.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--outline)';
            }}
          >
            {/* Top accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: m.color
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-dim)',
                letterSpacing: '0.08em'
              }}>
                {m.label}
              </span>
              <Icon size={18} color={m.color} />
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--text-heading)',
                lineHeight: 1.2
              }}>
                {m.value}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '4px',
                fontFamily: 'var(--font-sans)'
              }}>
                {m.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
