import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const db = {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async banUser(id: string, reason: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ banned: true, ban_reason: reason })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async unbanUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ banned: false, ban_reason: null })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Laras
  async getLaras() {
    const { data, error } = await supabase
      .from('laras')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createLara(lara: any) {
    const { data, error } = await supabase
      .from('laras')
      .insert(lara)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLara(id: string, updates: any) {
    const { data, error } = await supabase
      .from('laras')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteLara(id: string) {
    const { error } = await supabase
      .from('laras')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Bot Config
  async getBotConfig() {
    const { data, error } = await supabase
      .from('bot_config')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  async updateBotConfig(updates: any) {
    const { data, error } = await supabase
      .from('bot_config')
      .update(updates)
      .eq('id', 1)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Payments
  async getPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users (username, avatar)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createPayment(payment: any) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePayment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Dashboard Stats
  async getDashboardStats() {
    const [users, payments, tokens] = await Promise.all([
      supabase.from('users').select('id, tokens, premium, last_active'),
      supabase.from('payments').select('amount, status'),
      supabase.from('token_transactions').select('amount, type')
    ])

    const totalUsers = users.data?.length || 0
    const activeUsers = users.data?.filter(u => 
      new Date(u.last_active) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length || 0
    const premiumUsers = users.data?.filter(u => u.premium).length || 0
    
    const totalRevenue = payments.data?.filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0) || 0
    
    const pendingPayments = payments.data?.filter(p => p.status === 'pending').length || 0
    
    const totalTokensDistributed = tokens.data?.filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      premium_users: premiumUsers,
      total_revenue: totalRevenue,
      pending_payments: pendingPayments,
      total_tokens_distributed: totalTokensDistributed,
      bot_uptime: 99.9,
      commands_executed: 15420
    }
  },

  // Ranking
  async getRanking(limit = 50) {
    const { data, error } = await supabase
      .from('users')
      .select('id, discord_id, username, avatar, tokens, level, experience, total_spent, premium')
      .order('tokens', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    return data?.map((user, index) => ({
      ...user,
      rank: index + 1
    })) || []
  },

  // Token Transactions
  async addTokens(userId: string, amount: number, description: string) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('tokens')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError

    const newTokens = user.tokens + amount

    const [updatedUser, transaction] = await Promise.all([
      supabase
        .from('users')
        .update({ tokens: newTokens })
        .eq('id', userId)
        .select()
        .single(),
      supabase
        .from('token_transactions')
        .insert({
          user_id: userId,
          type: amount > 0 ? 'admin_add' : 'admin_remove',
          amount: Math.abs(amount),
          description
        })
        .select()
        .single()
    ])

    if (updatedUser.error) throw updatedUser.error
    if (transaction.error) throw transaction.error

    return updatedUser.data
  },

  // Messages
  async sendMessage(channelId: string, content: string) {
    // This would integrate with Discord API
    // For now, we'll store it in our database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        content,
        type: 'bot',
        user_id: 'system'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}