const now = Date.now();

export const INITIAL_TEAMS = [];

export const INITIAL_COMMITS = [];

export const RANDOM_MESSAGES = [
  { type: 'feat', prefix: 'feat(api): ', templates: ['add telemetry streaming endpoint', 'optimize RPC payload size by 40%', 'integrate WebSocket heartbeats', 'add OAuth2 scope verification'] },
  { type: 'fix', prefix: 'fix(core): ', templates: ['resolve memory leak in worker threads', 'fix race condition in queue processor', 'patch null pointer dereference in route handler', 'fix CORS header reflection on edge proxies'] },
  { type: 'merge', prefix: 'Merge PR #', templates: ['43 from feature/redis-sentinel', '44 from feature/auth-middleware', '45 from refactor/grpc-proto', '46 from feature/metrics-collector'] },
  { type: 'refactor', prefix: 'refactor: ', templates: ['migrate database connection pool to PGNative', 'streamline state machine transitions', 'decouple event emitter from socket layer'] }
];
