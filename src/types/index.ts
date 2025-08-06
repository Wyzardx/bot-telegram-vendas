export interface User {
  id: string;
  discord_id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  tokens: number;
  premium: boolean;
  banned: boolean;
  ban_reason?: string;
  created_at: string;
  last_active: string;
  total_spent: number;
  rank: number;
  level: number;
  experience: number;
}

export interface Lara {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar_url?: string;
  price: number;
  active: boolean;
  category: string;
  features: string[];
  created_at: string;
  usage_count: number;
  rating: number;
  creator_id: string;
}

export interface BotConfig {
  id: string;
  prefix: string;
  status: 'online' | 'idle' | 'dnd' | 'invisible';
  activity_type: 'playing' | 'streaming' | 'listening' | 'watching';
  activity_name: string;
  welcome_message: string;
  welcome_channel?: string;
  moderation_enabled: boolean;
  auto_role?: string;
  log_channel?: string;
  premium_role?: string;
  token_rate: number;
  daily_tokens: number;
  max_tokens: number;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  tokens: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'pix' | 'card' | 'boleto';
  nitro_payment_id: string;
  pix_code?: string;
  pix_qr_code?: string;
  expires_at?: string;
  created_at: string;
  completed_at?: string;
}

export interface RankingEntry {
  user_id: string;
  username: string;
  avatar?: string;
  tokens: number;
  level: number;
  experience: number;
  rank: number;
  total_spent: number;
  premium: boolean;
}

export interface Message {
  id: string;
  user_id: string;
  channel_id: string;
  guild_id: string;
  content: string;
  type: 'user' | 'bot' | 'system';
  created_at: string;
  edited_at?: string;
  deleted: boolean;
}

export interface ModerationAction {
  id: string;
  type: 'ban' | 'kick' | 'mute' | 'warn' | 'timeout';
  user_id: string;
  moderator_id: string;
  reason: string;
  duration?: number;
  active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_tokens_distributed: number;
  total_revenue: number;
  pending_payments: number;
  bot_uptime: number;
  commands_executed: number;
  premium_users: number;
}

export interface NitroPaymentResponse {
  success: boolean;
  data?: {
    payment_id: string;
    pix_code: string;
    qr_code: string;
    expires_at: string;
    amount: number;
  };
  error?: string;
}

export interface LaraUsage {
  lara_id: string;
  user_id: string;
  tokens_spent: number;
  duration: number;
  satisfaction_rating?: number;
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'spend' | 'reward' | 'admin_add' | 'admin_remove';
  amount: number;
  description: string;
  reference_id?: string;
  created_at: string;
}