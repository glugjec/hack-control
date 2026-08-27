const now = Date.now();

export const INITIAL_TEAMS = [
  {
    id: 'team-react-core',
    name: 'React_Core',
    repo: 'github.com/facebook/react',
    ownerRepo: { owner: 'facebook', repo: 'react' },
    category: 'AI & ML',
    status: 'ACTIVE',
    members: [
      { name: 'Dan Abramov', role: 'Lead Dev' },
      { name: 'Sophie Alpert', role: 'Contributor' }
    ],
    totalCommits: 14,
    linesAdded: 3420,
    linesDeleted: 410,
    healthScore: 94,
    lastCommitTime: '10 mins ago',
    problemStatement: 'UI Component Renderer & Concurrent Scheduler',
    avatarColor: '#8083ff'
  },
  {
    id: 'team-vite-speed',
    name: 'Vite_Speed',
    repo: 'github.com/vitejs/vite',
    ownerRepo: { owner: 'vitejs', repo: 'vite' },
    category: 'Cloud / Distributed',
    status: 'ACTIVE',
    members: [
      { name: 'Evan You', role: 'Lead Dev' },
      { name: 'Patak', role: 'Contributor' }
    ],
    totalCommits: 18,
    linesAdded: 4890,
    linesDeleted: 320,
    healthScore: 98,
    lastCommitTime: '5 mins ago',
    problemStatement: 'Next Gen Frontend Tooling & Instant HMR Dev Server',
    avatarColor: '#4cd7f6'
  },
  {
    id: 'team-next-infra',
    name: 'Next_Infra',
    repo: 'github.com/vercel/next.js',
    ownerRepo: { owner: 'vercel', repo: 'next.js' },
    category: 'Web3 & Infra',
    status: 'ACTIVE',
    members: [
      { name: 'Guillermo Rauch', role: 'Lead Dev' },
      { name: 'Tim Neutkens', role: 'Contributor' }
    ],
    totalCommits: 12,
    linesAdded: 2950,
    linesDeleted: 210,
    healthScore: 91,
    lastCommitTime: '25 mins ago',
    problemStatement: 'Fullstack React Framework & Server Actions Engine',
    avatarColor: '#4edea3'
  }
];

export const INITIAL_COMMITS = [
  {
    id: 'a8b1c2d',
    fullSha: 'a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
    owner: 'facebook',
    repo: 'react',
    repoUrl: 'https://github.com/facebook/react',
    htmlUrl: 'https://github.com/facebook/react/commit/a8b1c2d',
    teamId: 'team-react-core',
    teamName: 'React_Core',
    author: 'Dan Abramov',
    branch: 'main',
    message: 'feat(fiber): optimize work loop scheduling priorities',
    details: 'Improves fiber tree reconciliation performance under heavy concurrent updates.',
    timestamp: 'Just now',
    rawTime: now - 2 * 60 * 1000,
    type: 'feat',
    linesAdded: 240,
    linesDeleted: 45,
    filesChanged: 4,
    diffSummary: '+ // Fiber Reconciliation Scheduler Update'
  },
  {
    id: 'e5f6g7h',
    fullSha: 'e5f6g7h8i9j0a1b2c3d4e5f6g7h8i9j0a1b2c3d4',
    owner: 'vitejs',
    repo: 'vite',
    repoUrl: 'https://github.com/vitejs/vite',
    htmlUrl: 'https://github.com/vitejs/vite/commit/e5f6g7h',
    teamId: 'team-vite-speed',
    teamName: 'Vite_Speed',
    author: 'Evan You',
    branch: 'main',
    message: 'fix(hmr): accelerate module graph invalidation on edit',
    details: 'Reduces hot module replacement latency down to sub-10ms range.',
    timestamp: '4 mins ago',
    rawTime: now - 4 * 60 * 1000,
    type: 'fix',
    linesAdded: 110,
    linesDeleted: 18,
    filesChanged: 2,
    diffSummary: '+ // HMR Graph Invalidation Patch'
  },
  {
    id: 'i9j0k1l',
    fullSha: 'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
    owner: 'vercel',
    repo: 'next.js',
    repoUrl: 'https://github.com/vercel/next.js',
    htmlUrl: 'https://github.com/vercel/next.js/commit/i9j0k1l',
    teamId: 'team-next-infra',
    teamName: 'Next_Infra',
    author: 'Guillermo Rauch',
    branch: 'main',
    message: 'refactor(router): streamline server action payload streaming',
    details: 'Optimizes RSC payload chunking over HTTP/2 connection stream.',
    timestamp: '15 mins ago',
    rawTime: now - 15 * 60 * 1000,
    type: 'refactor',
    linesAdded: 380,
    linesDeleted: 120,
    filesChanged: 6,
    diffSummary: '+ // RSC Server Action Stream Refactor'
  }
];

export const RANDOM_MESSAGES = [
  { type: 'feat', prefix: 'feat(api): ', templates: ['add telemetry streaming endpoint', 'optimize RPC payload size by 40%', 'integrate WebSocket heartbeats', 'add OAuth2 scope verification'] },
  { type: 'fix', prefix: 'fix(core): ', templates: ['resolve memory leak in worker threads', 'fix race condition in queue processor', 'patch null pointer dereference in route handler', 'fix CORS header reflection on edge proxies'] },
  { type: 'merge', prefix: 'Merge PR #', templates: ['43 from feature/redis-sentinel', '44 from feature/auth-middleware', '45 from refactor/grpc-proto', '46 from feature/metrics-collector'] },
  { type: 'refactor', prefix: 'refactor: ', templates: ['migrate database connection pool to PGNative', 'streamline state machine transitions', 'decouple event emitter from socket layer'] }
];
