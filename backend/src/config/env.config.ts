export interface EnvConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string;

  supabaseUrl: string;
  supabaseServiceRoleKey: string;

  jwtSecret: string;
  jwtExpiresIn: string;
  authNonceTtlSeconds: number;

  hskRpcUrl: string;
  hskChainId: number;
  hskExplorerUrl: string;
  honraEscrowAddress: string;
  usdcTokenAddress: string;

  indexerPollIntervalMs: number;
  indexerStartBlock: bigint;
  indexerConfirmations: number;

  redisUrl: string;
}

export default (): { app: EnvConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    corsOrigin: process.env.CORS_ORIGIN ?? '*',

    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',

    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    authNonceTtlSeconds: parseInt(process.env.AUTH_NONCE_TTL_SECONDS ?? '300', 10),

    hskRpcUrl: process.env.HSK_RPC_URL ?? 'https://testnet.hsk.xyz',
    hskChainId: parseInt(process.env.HSK_CHAIN_ID ?? '133', 10),
    hskExplorerUrl: process.env.HSK_EXPLORER_URL ?? 'https://testnet-explorer.hsk.xyz',
    honraEscrowAddress: process.env.HONRA_ESCROW_ADDRESS ?? '',
    usdcTokenAddress: process.env.USDC_TOKEN_ADDRESS ?? '',

    indexerPollIntervalMs: parseInt(process.env.INDEXER_POLL_INTERVAL_MS ?? '5000', 10),
    indexerStartBlock: BigInt(process.env.INDEXER_START_BLOCK ?? '0'),
    indexerConfirmations: parseInt(process.env.INDEXER_CONFIRMATIONS ?? '3', 10),

    redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
});
